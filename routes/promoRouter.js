const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

//declares promorouter as a mini express application 
//once we declare this then we can 
const promoRouter = express.Router();

//we will "mount" this in a short while
//we are declaring this at a single location 

promoRouter.use(bodyParser.json());


promoRouter.route('/')
.get((req,res,next) => {
  //all promotions going to be returned 
  //returns promise 
  Promotions.find({})
  .then((promotions) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotions);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  Promotions.create(req.body)
  .then((promotion) => {
    console.log('Promotion created', promotion);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /prmootions');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promotionId')
.get((req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})
.put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;