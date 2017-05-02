'use strict';
const sharp = require('sharp');

sharp('andre.jpg')
  .rotate()
  .resize(200)
  .toBuffer()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

//https://ollie.relph.me/blog/streaming-image-resizer-with-node-js/
