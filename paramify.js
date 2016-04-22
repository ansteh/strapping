const url = require('url');

module.exports = {
  query: (requestUrl) => {
    return url.parse(requestUrl, true).query;
  }
};
