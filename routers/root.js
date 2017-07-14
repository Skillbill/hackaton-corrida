const express = require('express');
const router = express.Router({mergeParams: true});
const moment = require('moment');
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

router.get('/list-hot', function(req, res) {
  const timeRange = req.query.timeRange || 1;
  const start = moment().subtract({ minutes: timeRange}).toDate();

  const votesByVideo =
    database.getAllVotes()
      .filter(vote => vote.voteDate > start)
      .reduce((result, vote) => {
        if(result[vote.videoId]) {
          result[vote.videoId]++;
        } else {
          result[vote.videoId] = 1;
        }
        return result;
      }, {});

  const mostVotedVideos =
    Object.keys(votesByVideo)
    .reduce((result, videoId) => {
      result.push({videoId, voteCount : votesByVideo.videoId});
      return result;
    }, [])
    .sort((vbv1, vbv2) => vbv1.voteCount > vbv2.voteCount)
    .map(vbv => database.getVideo(vbv.videoId));

  res.status(200).send(mostVotedVideos);

});

router.put('/vote', function(req, res) {
  const {videoId, like, love, happy, dislike} = req.body;
  const oid = req.user.oid;

  const video = database.getVideo(videoId);
  if(!video) {
    return res.status(404).send('cannot find video');
  }
  if(database.getVote(videoId, oid)) {
    return res.status(409).send(`vote already cast for ${videoId} ${oid}`);
  }

  video.like += like ? 1 : 0;
  video.love += love ? 1 : 0;
  video.happy += happy ? 1 : 0;
  video.dislike += dislike ? 1 : 0;

  if(database.updateVideo(video)) {
    res.status(200).send(video);
    database.createVote({
      videoId,
      oid,
      like,
      love,
      happy,
      dislike,
      voteDate: new Date()
    })
  } else {
    res.status(404).send('cannot update video');
  }
});

module.exports = router;