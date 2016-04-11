'use strict';
const bookmarks   = require('../bookmarks');
const graph       = require('./index.js');
const _           = require('lodash');

bookmarks()
.then(function(links){
  let domains = graph.domain(links);
  /*_.forOwn(domains, function(node, name){
    console.log(_.trimStart(node[0].hostname, 'www.'), node.length);
  });*/
  let tree = _.map(domains, function(domain){
    return graph.treefyByPathname(domain);
  });
  console.log(tree);
})
.catch(function(err){
  console.log(err);
});
