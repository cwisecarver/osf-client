'use strict';
var jsdom = require('mocha-jsdom');
var _ = require('underscore');

global.nodeData = {
  title: 'api test node',
  description: 'very description, much words',
  category: 'project'
};
global.invalidNodeData = {
  description: 'very description, much words',
  category: 'project'
};

describe('Time to test some nodes', () => {
  jsdom({skipWindowCheck: true});
  let outer_resp = null;
  describe('Get some nodes', () => {
    before((done) => {
      global.client.nodes().get().then(resp => {
        outer_resp = resp;
        global.workingNodeId = outer_resp.data[0].id;
      }).then(done).catch(done);
    });
    it('should have a response object', () => {
      outer_resp.should.be.an('object');
    });
    it('should have 10 nodes inside', () => {
      outer_resp.data.length.should.equal(10);
    });
    it('should not have any private properties in data objects', () => {
      _.each(outer_resp.data, (item) => {
        _.each(item, (value, key) => {
          let first_char = key.substr(0,1);
          first_char.should.not.equal('_');
        });
      });
    });
    it('should be of type `nodes`', () => {
      _.each(outer_resp.data, (item) => {
        item.type.should.equal('nodes');
      });
    });
    it('should have ids that look like ids', () => {
      _.each(outer_resp.data, (item) => {
        /[a-z0-9]{5}/i.test(item.id).should.equal(true);
      });
    });
  });

  // describe('Get a filtered list of nodes', () => {
  //   before(done => {
  //     global.client.nodes()
  //       .get({
  //         query: {
  //           'filter[public]': false
  //         }
  //       })
  //       .then(resp => {
  //         global.filteredNodes = resp;
  //       }).then(done).catch(done);
  //   });
  //   it('should have no private nodes in it', () => {
  //     _.each(global.filteredNodes.data, node => {
  //       node.attributes.public.should.equal(false);
  //     });
  //   });
  // });
  //
  // describe('Get one specific node', () => {
  //   before((done) => {
  //     global.client.nodes(global.workingNodeId).get().then((resp) => {
  //       global.workingNode = resp;
  //     }).then(done).catch(done);
  //   });
  //   it('should have a response object', () => {
  //     global.workingNode.should.be.an('object');
  //   });
  //   it('should be a single node', () => {
  //     global.workingNode.data.should.be.an('object');
  //   });
  //   it('should match the id requested', () => {
  //     global.workingNode.data.id.should.equal(global.workingNodeId);
  //   });
  // });
  //
  // describe('Create a node', () => {
  //   before((done) => {
  //     global.client.nodes().create(global.nodeData).then((resp) => {
  //       global.createdNode = resp;
  //     }).then(done).catch(done);
  //   });
  //   it('should have a response object', () => {
  //     global.createdNode.should.be.an('object');
  //   });
  //   it('should have an id and a type of node', () => {
  //     global.createdNode.data.id.should.be.a('string');
  //     global.createdNode.data.id.length.should.equal(5);
  //     global.createdNode.data.type.should.equal('nodes');
  //   });
  //   it('it should match the data sent in', () => {
  //     global.createdNode.data.attributes.title.should.equal(global.nodeData.title);
  //     global.createdNode.data.attributes.description.should.equal(global.nodeData.description);
  //     global.createdNode.data.attributes.category.should.equal(global.nodeData.category);
  //   });
  // });
  //
  // describe('Edit a node', () => {
  //   before((done) => {
  //     global.client.nodes(global.createdNode.data.id).update({title: 'a new title'}).then((resp) => {
  //       global.updatedNode = resp;
  //     }).then(done).catch(done);
  //   });
  //   it('should have a response object', () => {
  //     global.updatedNode.should.be.an('object');
  //   });
  //   it('should have an id and a type of node', () => {
  //     global.updatedNode.data.id.should.be.a('string');
  //     global.updatedNode.data.id.length.should.equal(5);
  //     global.updatedNode.data.id.should.equal(global.createdNode.data.id);
  //     global.updatedNode.data.type.should.equal('nodes');
  //   });
  //   it('it should match the data sent in', () => {
  //     global.updatedNode.data.attributes.title.should.equal('a new title');
  //     global.updatedNode.data.attributes.description.should.equal(global.nodeData.description);
  //     global.updatedNode.data.attributes.category.should.equal(global.nodeData.category);
  //   });
  // });
  //
  // describe('Update one specific node with invalid data', () => {
  //   before((done) => {
  //     global.client.nodes(global.createdNode.data.id).update({category: 23234333433})
  //       .then(resp => {
  //         global.updateNodeWithInvalidDataResponse = resp
  //       })
  //       .then(done)
  //       .catch((err) => {
  //         global.updateNodeWithInvalidDataResponse = err;
  //       }).then(done);
  //   });
  //   it('should throw an error', () => {
  //     global.updateNodeWithInvalidDataResponse.response.status.should.equal(400);
  //   });
  // });
  //
  // describe('Delete a node', () => {
  //   before((done) => {
  //     global.client.nodes(global.createdNode.data.id).delete().then(resp => {
  //       global.deletedNodeResponse = resp;
  //     }).then(done).catch(done);
  //   });
  //   it('should delete a node', () => {
  //     global.deletedNodeResponse.status.should.equal(204);
  //   });
  // });
  //
  // describe('Get one specific node that does not exist', () => {
  //   before((done) => {
  //     global.client.nodes(global.createdNode.data.id).get()
  //       .then((resp) => {
  //         global.missingNode = resp;
  //       })
  //       .then(done)
  //       .catch((err) => {
  //         global.missingNode = err;
  //       }).then(done);
  //   });
  //   it('should be GONE', () => {
  //     global.missingNode.response.status.should.equal(410);
  //   });
  // });
  //
  // describe('Update one specific node that does not exist', () => {
  //   before((done) => {
  //     global.client.nodes(global.createdNode.data.id).update({title: 'not going to work'})
  //       .then(resp => {
  //         global.updateDeletedNodeResponse = resp;
  //       })
  //       .then(done)
  //       .catch(err => {
  //         global.updateDeletedNodeResponse = err;
  //       }).then(done);
  //   });
  //   it('should be GONE', () => {
  //     global.updateDeletedNodeResponse.response.status.should.equal(410);
  //   });
  // });
});
