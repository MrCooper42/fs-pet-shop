'use strict';

const fs = require('fs');
const path = require('path')
const petsPath = path.join(__dirname, "pets.json")

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const morgan = require('morgan')
const bodyParser = require('body-parser');

app.use(morgan('short'));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.send(500, {
    message: err.message
  });
});

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error('error', err.stack)
      return next(err)
    }
    let pets = JSON.parse(petsJSON)
    res.set("Content-Type", "text/plain");
    res.send(pets);
  })
})

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return next(err);
    }

    var pets = JSON.parse(petsJSON);
    var AGE = req.body.age;
    var KIND = req.body.kind;
    var NAME = req.body.name;

    if (!NAME) {
      return res.sendStatus(400);
    }

    pets.push({
      age: parseInt(AGE),
      kind: KIND,
      name: NAME
    });

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'text/plain');
      res.send(pets);
    });
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error('errors', err.stack);
      return res.sendStatus(500);
    }

    let id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.set("Content-Type", "text/plain");
    res.send(pets[id]);
  });
});

app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log('Listening on port', port));
