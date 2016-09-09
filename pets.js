'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];
const index = process.argv[3];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      throw err
    }
    let pets = JSON.parse(data)
    if (index > pets.length - 1 || index < 0) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      return;
    }
    if (index === undefined) {
      console.log(pets);
      return;
    }
    console.log(pets[index]);
  });
} else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }
    let pets = JSON.parse(data);
    let AGE = process.argv[3];
    let KIND = process.argv[4];
    let NAME = process.argv[5];
    if (!NAME) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    pets.push({
      age: parseInt(AGE),
      kind: KIND,
      name: NAME
    });
    console.log(pets);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }
      // console.log(pets);
    });
  });
} else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }
    let pets = JSON.parse(data);
    let petdex = pets[index];
    let AGE = parseInt(process.argv[4]);
    let KIND = process.argv[5];
    let NAME = process.argv[6];
    if (!AGE) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }
    if (AGE) {
      petdex.age = AGE;
    }
    if (KIND) {
      petdex.kind = KIND;
    }
    if (NAME) {
      petdex.name = NAME;
    }

    console.log(pets);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }
      // console.log(pets);
    });
  });
} else if (cmd === 'delete') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    let pets = JSON.parse(data)
    if (!index || index > pets.length || index < 0) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    } else {
      pets.splice(index, 1);
      console.log("spliced @ " + "index: " + index, pets);
      let petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (deleteErr) => {
        if (deleteErr) {
          console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
          return
        }
      })
    }
  })
} else {
  console.error(`Usage: ${node} ${file} CRUD?`);
  process.exit(1)
}
