const deepmerge = require('deepmerge');
const jsonfile = require('jsonfile');
const file = 'database.json';
const fs = require('fs');

let db;

const init = () => {
  if (fs.existsSync(file)) {
    console.log(`read data from ${file}`);
    db = jsonfile.readFileSync(file);
    db.videos.forEach(video => video.uploadDate = new Date(video.uploadDate));
    db.votes.forEach(vote => vote.voteDate = new Date(vote.voteDate));
  } else {
    db = {
      videos: [],
      votes: []
    };
  }
};

const syncDb = () => {
  jsonfile.writeFileSync(file, db, {spaces: 2});
};

const createVideo = video => {
  db.videos.push(deepmerge({}, video, { clone : true}));
  syncDb();
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
  db.videos.splice(index, 1, deepmerge({}, videoToUpdate, { clone : true}));
  syncDb();
  return videoToUpdate;
};


const createVote = vote => {
  db.votes.push(deepmerge({}, vote, { clone : true}));
  syncDb();
};

const getVote = (videoId, oid) => {
  const filtered = db.votes.filter(vote => vote.videoId == videoId && vote.oid == oid);
  if(filtered.length > 1) {
    console.log(`duplicate id in database ${videoId}, ${oid}`);
  }
  return filtered.length > 0 ? deepmerge({}, filtered[0], { clone : true}) : null;
};

const getAllVotes = () => {
  return deepmerge([], db.votes, { clone : true});
};

module.exports = {
  init,
  createVideo,
  getAllVideo,
  getVideo,
  updateVideo,

  createVote,
  getVote,
  getAllVotes
};