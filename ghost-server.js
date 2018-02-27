'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import { MongoClient } from 'mongodb';
import { ObjectID } from 'mongodb';

const collection = 'ghost-sessions';
const server = express();

server.use(bodyParser.json());
// server.use(bodyParser.json({limit: '50mb'}));

server.get('/:_id', (req, res, next) => {
  const { _id } = req.params ;
  const { MONGO_URL } = req.webtaskContext.secrets;

  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) return next(err);
     db.collection(collection).findOne({ _id }, (err, result) => {
       db.close();
       if (err) return next(err);
       res.status(200).send(result);
     });
  });
});


server.post('/:_id', (req, res, next) => {
  const { _id } = req.params ;
  const { MONGO_URL } = req.webtaskContext.secrets;
  const model = req.body;
  
  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) return next(err);
    // db.collection(collection).insertOne(model, (err, result) => {
    db.collection(collection).update({_id}, model, { upsert : true }, (err, result) => {
      db.close();
      if (err) return next(err);
      res.status(200).send(result);
    });
  });
});
module.exports = Webtask.fromExpress(server);
