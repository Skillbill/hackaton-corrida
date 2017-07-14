const db = {
  videos: []
};

const createVideo = video => {
  db.videos.push(video);
};

module.exports = {
  createVideo
};