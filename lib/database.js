const deepmerge = require('deepmerge');
const jsonfile = require('jsonfile');
const file = 'database.json';
const fs = require('fs');

let db;

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
};

const createVideo = video => {
  db.videos.push(video);
  jsonfile.writeFileSync(file, db);
};

const getAllVideo = () => {
  return deepmerge([], db.videos, { clone : true});
};

const getVideo = videoId => {
  const filtered = db.videos.filter(video => video.videoId == videoId);
  if(filtered.length > 1) {
    console.log(`duplicate id in database ${videoId}`);
  }
  return filtered.length > 0 ? deepmerge({}, filtered[0], { clone : true}) : null;
};

const updateVideo = videoToUpdate => {
  const index = db.videos.findIndex(video => video.videoId == videoToUpdate.videoId);
  if(index == -1) {
    console.log(`video to update not found ${videoToUpdate.videoId}}`);
    return;
  }
  db.videos.splice(index, 1, videoToUpdate);
  jsonfile.writeFileSync(file, db);
  return videoToUpdate;
};

module.exports = {
  init,
  createVideo,
  getAllVideo,
  getVideo,
  updateVideo
};