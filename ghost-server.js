'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import { MongoClient } from 'mongodb';
import { ObjectID } from 'mongodb';

const collection = 'ghost-sessions';
const server = express();

server.use(bodyParser.json());



server.post('/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  const { _id } = req.body ;
  // Do data sanitation here.
  const model = req.body;
  console.log('model', model);
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
