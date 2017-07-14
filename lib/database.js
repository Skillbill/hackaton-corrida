const deepmerge = require('deepmerge');
const jsonfile = require('jsonfile');
const file = 'database.json';
const fs = require('fs');

let db;

const createVideo = video => {
  db.videos.push(video);
  jsonfile.writeFileSync(file, db);
};

const getAllVideo = () => {
  return deepmerge([], db.videos, { clone : true});
};

const init = () => {
  if (fs.existsSync(file)) {
    console.log(`read data from ${file}`);
    db = jsonfile.readFileSync(file);
    console.log(`videos are ${db}`);
  } else {
    db = {
      videos: []
    };
  }
}

module.exports = {
  createVideo,
  getAllVideo,
  init
};