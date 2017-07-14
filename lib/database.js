const deepmerge = require('deepmerge');

const db = {
  videos: []
};

const createVideo = video => {
  db.videos.push(video);
};

const getAllVideo = () => {
  return deepmerge([], db.videos, { clone : true});
};

module.exports = {
  createVideo,
  getAllVideo
};