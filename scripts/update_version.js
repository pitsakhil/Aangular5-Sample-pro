'use strict'
/*
  Usage:
    node update_version.js new_version_number
*/
let fs = require('fs');
let regExPackageJson = /("version":\s)"(.*?)"/g;
let newVersion = process.argv[2];
const PACKAGE_JSON = './package.json';

function updateFile(file, regex, version) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data.replace(regex, '$1"' + version + '"');

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}

updateFile(PACKAGE_JSON, regExPackageJson, newVersion);
