'use strict';
import _ from 'underscore';

var jsonapifyOne = (popsicle, data) => {
  let munged_data;
  if(data.hasOwnProperty('data')) {
    munged_data = data.data;
  } else {
    munged_data = data;
  }

  var result = {
    id: munged_data.id,
    type: munged_data.type,
    attributes: {},
    links: {},
    embeds: {},
    relationships: {}
  };


  // pull all attributes out onto a top level object
  _.each(munged_data.attributes, (value, name) => {
    result.attributes[name] = value;
  });

  // pull all embeds out onto a top level object, jsonapiifyifying them as we go
  _.each(munged_data.embeds, (value, name) => {
    if (_.isArray(value.data)) {
      result.embeds[name] = _.map(value.data, _.partial(jsonapifyOne, popsicle));
    } else if (value.data) {
      result.embeds[name] = value.data ? jsonapifyOne(popsicle, value.data) : null;
    }
  });

  // pull all relationships out onto a top level object and turn them into
  // client instances
  _.each(munged_data.relationships, (value, name) => {
    if(value.links.hasOwnProperty('related')) {
      let relatedHref = value.links.related.href;
      result.relationships[name] = {};
      Object.defineProperty(result.relationships[name], 'related', {
        get: () => {
          return popsicle.get(relatedHref).after(jsonapify(popsicle));
        }
      });
    }
    if(value.links.hasOwnProperty('self')) {
      let selfHref = value.links.self.href;
      if(!result.relationships.hasOwnProperty(name)) {
        result.relationships[name] = {};
      }
      Object.defineProperty(result.relationships[name], 'self', {
        get: () => {
          return popsicle.get(selfHref).after(jsonapify(popsicle));
        }
      });
    }
  });

  // pull all links out onto a top level object and turn them into
  // client instances
  result.links = {};
  _.each(munged_data.links, (value, name) => {
    let href = value;
    if (href.match(/^https*:\/\//i)) {
      Object.defineProperty(result.links, name, {
        get: () => {
          return popsicle.get(href).after(jsonapify(popsicle));
        }
      });
    }
  });

  // stick the original data we got back from the api into a property on the
  // result that we send back.
  result._data = _.clone(munged_data);
  return result;

};

var jsonapify = (popsicle) => {
  return (response) => {
    let unwrappedResult = {};
    if(!response.body || !response.body.data) {
      return response;
    } else if(_.isArray(response.body.data)) {
      unwrappedResult = _.map(response.body.data, _.partial(jsonapifyOne, popsicle));
    } else {
      unwrappedResult = jsonapifyOne(popsicle, response.body.data);
    }
    response.data = unwrappedResult;
  };
};

export default jsonapify;
