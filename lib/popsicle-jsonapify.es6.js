'use strict';
import _ from 'underscore';

var jsonapifyOne = (popsicle, data) => {
  var result = {
    id: data.id,
    type: data.type
  };

  result.attributes = {};
  result.links = {};
  result.embeds = {};
  result.relationships = {};

  // pull all attributes out onto a top level object
  _.each(data.attributes, (value, name) => {
     result.attributes[name] = value;
  });

  // pull all embeds out onto a top level object, jsonapiifyifying them as we go
  _.each(data.embeds, (value, name) => {
      if (_.isArray(value)) {
        result.embeds[name] = _.map(value, _.partial(jsonapifyOne, popsicle));
      } else if (value) {
        result.embeds[name] = value ? jsonapifyOne(popsicle, value) : null;
      }
  });

  // pull all relationships out onto a top level object and turn them into
  // client instances
  _.each(data.relationships, (value, name) => {
      let href = value.links.related.href;
      Object.defineProperty(result.relationships, name, {
          get: () => {
              return popsicle.get(href);
          }
      });
  });

  // pull all links out onto a top level object and turn them into
  // client instances
  result.links = {};
  _.each(data.links, (value, name) => {
    let href = value;
    if (href.match(/^https*:\/\//i)) {
        Object.defineProperty(result.links, name, {
            get: () => {
               return popsicle.get(href);
            }
        });
    }
  });

  // stick the original data we got back from the api into a property on the
  // result that we send back.
  result._data = _.clone(data);
  return result;

};

var jsonapify = (popsicle) => {
  return (response) => {
    let unwrappedResult = {};
    let data = response.body.data;
    if(!data) {
      return data;
    } else if(_.isArray(data)) {
      unwrappedResult = _.map(data, _.partial(jsonapifyOne, popsicle));
    } else {
      unwrappedResult = jsonapifyOne(popsicle, data);
    }

    return {data: unwrappedResult};
  };
};

export default jsonapify;
