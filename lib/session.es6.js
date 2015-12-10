'use strict';

import BaseModel from './models.es6.js';
import jsonapify from './popsicle-jsonapify.es6.js';

class Session {
  constructor(rootUrl, client) {
    this.client = client;
    this.popsicle = this.client.popsicle;
    this.rootUrl = rootUrl;
    this.baseModel = BaseModel;
  }
  get(url, params, model) {
    // if they didn't specify a model just use the base
    if (typeof model == 'undefined') {
      model = this.baseModel;
    }
    return this._request('GET', this.rootUrl+url, params)
    .then(resp => {
      return resp;
    });
  }
  post(url, params, model) {
    return this._request('POST', this.rootUrl+url, params)
    .then(resp => {
      return resp;
    });
  }
  _request(method, url, params = {}) {
    // create the request
    let request = null;
    if(method !== 'GET') {
      request = this.popsicle({
        method: method,
        url: url,
        body: params.body || {}
      });
    } else {
      request = this.popsicle({
        method: method,
        url: url,
        query: params.query || {}
      });
    }
    request.use(this.client.auth);
    request.after(jsonapify(this.popsicle));
    let response = request.then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        if (resp.status !== 204) {
          return resp.body;
        } else {
          return resp;
        }
      } else {
        var error = new Error(resp.text);
        error.response = resp;
        throw error;
      }
    });
    return response;
  }
}

export default Session;
