'use strict';

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
    this._data = this._apiExtend(true, this._fields,  this._params);

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

    if (this._is_valid) {
      // extend the data and set the _data property
      this._data = this._apiExtend(this._data);
    } else {
      throw Error('Your data is invalid.');
    }
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

class User extends BaseModel {
  constructor(params) {
    super(params);
    // this allows users to leave "type": "users" out of their payload
    this._fields.type = 'users';
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

export {Node};
export {User};
export {File};
export {BaseModel};
