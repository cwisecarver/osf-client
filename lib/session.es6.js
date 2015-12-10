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

    let instance = new model(params);
    instance.validate();

    return this._request('GET', this.rootUrl+url, params)
    .then(resp => {
      return resp;
    });
  }
  post(url, params, model) {
    let instance = new model(params);
    instance.validate();

    let jsonData = {
      body: {
        data: instance.getPublicInstance()
      }
    };
    return this._request('POST', this.rootUrl+url, jsonData)
    .then(resp => {
      return resp;
    });
  }
  patch(url, params, model) {
    // if they didn't specify a model just use the base
    if (typeof model == 'undefined') {
        model = this.baseModel;
    }
    // create a new model with the incoming params
    let instance = new model(params);
    instance.validate();

    // create an object
    let jsonData = {
        body: {
            data: instance.getPublicInstance()
        }
    };
    return this._request('PATCH', this.rootUrl+url, jsonData)
        .then(resp => {
            return resp;
        });
  }
  delete(url) {
    // make a delete request to the specified url with an empty payload.
    return this._request('DELETE', this.rootUrl+url, {})
        .then((resp) => {
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
        return resp;
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
