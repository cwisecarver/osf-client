'use strict';

import _ from 'underscore';

class BaseModel {
  constructor(params={}) {
    this._fields = {
      'type': null,
      'attributes': null
    };

    if (!('attributes' in params)) {
      params = {attributes: params};
    }

    this._params = params;
    this._is_valid = null;
  }
  validate() {
    // combine the required fields for all operations with the provided params
    this._data = _.extend(this._fields,  this._params);

    // Assumes valid if all top level objects are !== null
    // making everything in this._fields required
    this._is_valid = true;
    for (var key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        let item = this._data[key];
        if (
          item !== null &&
          // add more checks here
          // keep using &&
          // any untruths will invalidate
          // true === true is just an example
          true === true
        ) {
          // all true, next property pls
          continue;
        } else {
          // one false, let's blow this pop stand.
          this._is_valid = false;
          break;
        }
      }
    }

    if (!this._is_valid) {
      throw Error('Your data is invalid.');
    }
  }

  getPublicInstance() {
    // this enforces validation, removes private properties and returns
    // the result
    if(this._is_valid !== true && this._is_valid !== false){
      // if _is_valid has not been set to one or the other validate
      // call getPublicInstance and return it's result.
      this.validate();
      return this.getPublicInstance();
    } else if (this._is_valid === true) {
      return this._data;
    }else{
      throw Error('Your data is not valid.');
    }
  }
}

class User extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'users';
    this.validate();
  }
}

class Node extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'nodes';
    this.validate();
  }
}

class Registration extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'registrations';
    this.validate();
  }
}

class Collection extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'collections';
    this.validate();
  }
}

class Comment extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'comments';
    this.validate();
  }
}

class Log extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'logs';
    this.validate();
  }
}

class File extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'files';
    this.validate();
  }
}

export {User};
export {Node};
export {Registration};
export {Collection};
export {Comment};
export {Log};
export {File};
export {BaseModel};
