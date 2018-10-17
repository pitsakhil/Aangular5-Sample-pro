'use strict'
/*
  Usage:
    node translate_json.js generate_translate_files
*/
let fs = require('fs');
const assetPath = 'src/assets/i18n/';
const translateFiles = ['de_AT', 'de_CH', 'de_DE', 'en_GB'];

function translateFile(assetPath) {
    let result = '';
    for (let i = 0; i < translateFiles.length; i++) {
        fs.readFile(assetPath + 'en_US.json', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            const regex = /[:]\s(\".*\")/g;
            const newData = data.replace(regex, function (groupMatch, match) {
                const val = match.replace(/"/g, '') + '-' + translateFiles[i];
                return ': ' + JSON.stringify(val);
            });

            fs.writeFile(assetPath + translateFiles[i] + '.json', newData, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    }
}

translateFile(assetPath);