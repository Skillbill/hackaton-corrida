const express = require('express');
const router = express.Router({mergeParams: true});
const database = require('../lib/database');

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
module.exports = router;