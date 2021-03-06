const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Leaders = require('../models/leaders');

//declares leaderRouter as a mini express application 
//once we declare this then we can 
const leaderRouter = express.Router();

//we will "mount" this in a short while
//we are declaring this at a single location 
var authenticate = require('../authenticate');

leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
.get((req,res,next) => {
  //all leaders going to be returned 
  //returns promise 
  Leaders.find({})
  .then((leaders) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
  authenticate.verifyAdmin(req, res, next);
  Leaders.create(req.body)
  .then((leader) => {
    console.log('Leader created', leader);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leader);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req, res, next);
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req, res, next);
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req, res, next);
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = leaderRouter;