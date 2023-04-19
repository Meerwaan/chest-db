const express = require('express');
const router = express.Router();
const dbo = require('../db/connexionDb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT;


app.get('/data', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

