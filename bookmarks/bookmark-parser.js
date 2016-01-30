'use strict';

const cheerio = require('cheerio');
const fs      = require('fs');
const writeJsonFile = require('write-json-file');

const load = (filepath) => {
  return fs.readFileSync(filepath, 'utf8');
};

const getTags = (elem, mark, $) => {
  elem.parents("dl").each(function(i, e){
    mark.tags.push($(e).prev().text());
  });
};

const createCrawler = (filepath) => {
  let content = load(filepath);
  let $ = cheerio.load(content);

  return () => {
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
      getTags(e, mark, $);
    });
    return marks;
  };
};

const crawl = createCrawler('bookmarks.html');
let bookmarks = crawl();

writeJsonFile('bookmarks.json', bookmarks).then(() => {
	console.log('done');
});
