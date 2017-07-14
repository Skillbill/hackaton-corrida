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

router.post('/upload', function(req, res) {
  const {videoId} = req.body;
  const oid = req.user.oid;

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
  const pageNumber = req.query.pageNumber;

  const page = database.getAllVideo().sort((video1, video2) => {
    return video1.uploadDate < video2.uploadDate;
  }).slice(pageNumber*pageSize, (pageNumber+1)*pageSize);

  res.status(200).send(page);
});

module.exports = router;