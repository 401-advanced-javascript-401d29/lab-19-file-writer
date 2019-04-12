'use strict';

const Q = require('nmq/q/client');

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
    .then( success => Q.publish('files', 'save', {status:1, file: file, text: 'File was Saved'}))
    .catch( error => Q.publish('files', 'error', {status:0, file: file, text: error.message}));
};

let file = process.argv.slice(2).shift();
alterFile(file);
