'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];
var index = process.argv[3];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err
    }
    var pets = JSON.parse(data)
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
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    var pets = JSON.parse(data);
    var AGE = process.argv[3];
    var KIND = process.argv[4];
    var NAME = process.argv[5];
    if (!AGE) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    pets.push({
      age: parseInt(AGE),
      kind: KIND,
      name: NAME
    });
    console.log(pets);

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      // console.log(pets);
    });
  });
} else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    var pets = JSON.parse(data);
    var petdex = pets[index];
    var AGE = parseInt(process.argv[4]);
    var KIND = process.argv[5];
    var NAME = process.argv[6];
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

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      // console.log(pets);
    });
  });
} else if (cmd === 'delete') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    var pets = JSON.parse(data)
    if (!index || index > pets.length || index < 0) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    } else {
      pets.splice(index, 1);
      console.log("spliced @ " + "index: " + index, pets);
      var petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (destroyErr) => {
        if (destroyErr) {
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
