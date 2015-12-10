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
    // need to run each of these through
    // think it's missing because data isn't being pulled out
    if (_.isArray(value)) {
      result.embeds[name] = _.map(value, _.partial(jsonapifyOne, popsicle));
    } else if (value) {
      result.embeds[name] = value ? jsonapifyOne(popsicle, value) : null;
    }
  });

  // pull all relationships out onto a top level object and turn them into
  // client instances
  _.each(munged_data.relationships, (value, name) => {
    let href = value.links.related.href;
    Object.defineProperty(result.relationships, name, {
      get: () => {
        return popsicle.get(href).after(jsonapify(popsicle));
      }
    });
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
    let data = response.body.data;
    if(!data) {
      console.dir('NO DATA!');
      console.dir(response);
      return data;
    } else if(_.isArray(data)) {
      unwrappedResult = _.map(data, _.partial(jsonapifyOne, popsicle));
    } else {
      unwrappedResult = jsonapifyOne(popsicle, data);
    }
    response.data = unwrappedResult;
  };
};

export default jsonapify;
