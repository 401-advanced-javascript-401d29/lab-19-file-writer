'use strict';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

const fs = require('fs');
const util = require('util');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);

const loadFile = (file) => readFile(file);
const saveFile = (file, buffer) => writeFile(file, buffer);
const convertBuffer = buffer => Buffer.from( buffer.toString().trim().toUpperCase());

const alterFile = (file) => {
  loadFile(file)
    .then(content => convertBuffer(content) )  
      .then(buffer => saveFile(file, buffer) )
        .then( success => socket.emit('file-save', {status:1, file: file, text: "File was Saved"}))
          .catch( error => socket.emit('file-error', {status:0, file: file, text: error.message}));
};

let file = process.argv.slice(2).shift();
alterFile(file);
