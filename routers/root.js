const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/', function(req, res) {
  res.send({
    d: new Date(),
    oid : req.user.oid
  });
});

module.exports = router;/**
 * Created by root on 7/14/17.
 */
