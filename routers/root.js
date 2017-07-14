const express = require('express');
const router = express.Router({mergeParams: true});
const database = require('../lib/database');
const pageSize = 10;

router.get('/date', function(req, res) {
  res.send({
    d: new Date(),
    oid : req.user.oid
  });
});

const paged = (pageNumber, sortFunc) => {
  return database.getAllVideo().sort(sortFunc).slice(pageNumber*pageSize, (pageNumber+1)*pageSize);
};

router.post('/upload', function(req, res) {
  const {videoId} = req.body;
  const oid = req.user.oid;

  if(database.getVideo(videoId)) {
    return res.status(409).send(`video already exist with id ${videoId}`);
  }

  const video = {
    videoId,
    oid,
    uploadDate: new Date(),
    like: 0,
    love: 0,
    happy: 0,
    dislike: 0
  };

  database.createVideo(video);

  res.status(201).send(video);
});

router.get('/list-new', function(req, res) {
  res.status(200).send(paged(req.query.pageNumber, (video1, video2) => {
    return video1.uploadDate < video2.uploadDate;
  }));
});

router.put('/vote', function(req, res) {
  const {videoId, like, love, happy, dislike} = req.body;
  const video = database.getVideo(videoId);
  if(!video) {
    return res.status(404).send('cannot find video');
  }

  video.like += like ? 1 : 0;
  video.love += love ? 1 : 0;
  video.happy += happy ? 1 : 0;
  video.dislike += dislike ? 1 : 0;

  if(database.updateVideo(video)) {
    res.status(200).send(video);
  } else {
    res.status(404).send('cannot update video');
  }
});

module.exports = router;