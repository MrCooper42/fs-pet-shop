'use strict'

const fs = require('fs');
const path = require('path')
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const router = express.Router();
const petsPath = path.join(__dirname, "pets.json")

router.use(morgan('short'));
router.use(bodyParser.json());
router.use((err, req, res, next) => {
  console.error(err.stack);
  return res.send(500, {
    message: err.message
  });
});


router.get('/', (req, res) => {
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

router.get('/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return next(err);
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

router.post('/', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return next(err);
    }

    let pets = JSON.parse(petsJSON);
    let AGE = Number.parseInt(req.body.age);
    let KIND = req.body.kind;
    let NAME = req.body.name;

    if (!NAME || !KIND || !AGE || Number.isNaN(AGE)) {
      return res.sendStatus(400);
    }

    pets.push({
      age: parseInt(AGE),
      kind: KIND,
      name: NAME
    });

    petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) {
        console.error(err.stack);
        return next(err)
      }

      res.set('Content-Type', 'text/plain');
      res.send(pets);
    });
  });
});

router.put('/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    let pets = JSON.parse(data);
    let id = parseInt(req.params.id);
    let AGE = Number.parseInt(req.body.age);
    let KIND = req.body.kind;
    let NAME = req.body.name;

    if (!NAME || !KIND || !AGE) {
      return res.sendStatus(400);
    }
    if (AGE) {
      console.log(AGE);
      pets[id].age = AGE;
    }
    if (KIND) {
      pets[id].kind = KIND;
    }
    if (NAME) {
      pets[id].name = NAME;
    }

    console.log(pets);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) {
        return next(err);
      }
      res.send(petsJSON);
    });
  });
});

router.patch('/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    let pets = JSON.parse(data);
    let id = parseInt(req.params.id);
    let AGE = Number.parseInt(req.body.age);
    let KIND = req.body.kind;
    let NAME = req.body.name;

    if (!NAME && !KIND && !AGE) {
      return res.sendStatus(400);
    }
    if (AGE) {
      console.log(AGE);
      pets[id].age = AGE;
    }
    if (KIND) {
      pets[id].kind = KIND;
    }
    if (NAME) {
      pets[id].name = NAME;
    }

    console.log(pets);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) {
        return next(err);
      }
      res.send(petsJSON);
    });
  });
});

router.delete('/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    let pets = JSON.parse(data)
    let id = parseInt(req.params.id);
    if (!id || id > pets.length || id < 0) {
      return next(err)
    } else {
      pets.splice(id, 1);
      console.log("spliced @ " + "id: " + id, pets);
      let petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (deleteErr) => {
        if (deleteErr) {
          return next(err);
        }
        res.send(petsJSON);
      })
    }
  })
})

module.exports = router;
