'use strict';
const fs      = require('fs');
const writeJsonFile = require('write-json-file');
const htmlparser = require('htmlparser2');
const _ = require('lodash');
const path = require('path');

const load = (filepath) => {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
};

const domutils = require('domutils');

const createParser = (cb) => {
  var handler = new htmlparser.DomHandler(function (error, dom) {
      if (error){
        console.log(error);
      } else {
        let all = domutils.findAll(function(elem){
          return elem.name === "a";
        }, dom);
        let links = _.map(all, function(elem){
          return {
            url: elem.attribs.href,
            date: elem.attribs.add_date,
            text: _.get(elem, 'children[0].data')
          };
        });
        //console.log(links);
        cb(links);
        /*let anchor = domutils.find(function(elem){
          return elem.name === "dl";
        }, dom, false, 1);
        console.log(anchor[0].prev);*/
        //console.log(dom);
      }
  });

  return new htmlparser.Parser(handler);
}

/*var parser = new htmlparser.Parser({
	onopentag: function(name, attribs){
    if(name === "a"){
      //console.log("open a:");
			//console.log(attribs.href);
      links.push({
        url: attribs.href,
        date: attribs.ADD_DATE
      });
		}
	},
	ontext: function(text){
		//console.log("-->", text);
	},
	onclosetag: function(name){
    //console.log('onclosetag', name);
    if(name === "a"){
			//console.log("close a");
		}
	},
  onend: function(){
    console.log(links, links.length);
  }
}, {decodeEntities: false});*/

const parse = (content) => {
  return new Promise(function(resolve, reject) {
    let parser = createParser(function(respond){
      resolve(respond);
    });
    parser.write(content);
    parser.end();
  });
};

const write = (content, filepath) => {
  return writeJsonFile('bookmarks.json', bookmarks).then(() => {
  	console.log('done');
  });
};

module.exports = function(){
  let html = load('bookmarks.html');
  return parse(html);
};
