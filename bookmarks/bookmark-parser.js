const cheerio = require('cheerio');
const fs      = require('fs');
const path    = require('path');
const writeJsonFile = require('write-json-file');

const load = (filepath) => {
  return fs.readFileSync(filepath, 'utf8');
};

const prepare = (content) => {
  $ = cheerio.load(content);
  return (parse) => {
    return parse($);
  };
};

const fetch = (filepath) => {
  return prepare(load(filepath));
};

const crawler = fetch('bookmarks.html');

const getTags = (elem, mark) => {
  elem.parents("dl").each(function(i, e){
    mark.tags.push($(e).prev().text());
  });
};

var bookmarks = crawler(function($){
  var anchors = $("dl").find("a");
  var marks = [], mark, e;
  anchors.each(function(i, elem) {
    e = $(elem);
    mark = {
      url: e.attr("href"),
      name: e.text(),
      tags: []
    };
    marks.push(mark);
    getTags(e, mark);
  });
  //console.log(marks);
  return marks;
});

writeJsonFile('bookmarks.json', bookmarks).then(() => {
	console.log('done');
});
