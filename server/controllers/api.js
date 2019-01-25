import { find } from './algorithms.js';

import '../../env'

const WHITESPACE_CHARACTERS = [ 8.46142578125, 1.08544921875 ];
const WHITESPACE_CHARACTERS_HEADER = [ 9.76318359375, 1.25244140625 ];

const async = require('async');
const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: false,
  switches: {
    'proxy-server': process.env.PROXYURL
  }
})

nightmare
  .authentication(process.env.PROXYLOGIN, process.env.PROXYPASS)
  .goto('https://steamcommunity.com/id/shellcode')
  .wait('.showcase_notes')
  .then(() => console.log('Nightmare ready'))
  .catch(error => {
    console.error(error)
  });

async function performCheck (text, isH1) {
  return new Promise(async (resolve, reject) => {
    try {
      const rect = await nightmare.evaluate((x, isH1) => {
        if (isH1) {
          document.querySelector('.showcase_notes').innerHTML = `<div class="bb_h1"><span>${x}</span></div>`;
          var { width, height } = document.querySelector('.showcase_notes .bb_h1 span').getBoundingClientRect();
        } else {
          document.querySelector('.showcase_notes').innerHTML = `<span>${x}</span>`;
          var { width, height } = document.querySelector('.showcase_notes span').getBoundingClientRect();
        }
        return { width, height };
      }, text, isH1);
      return resolve(rect);
    } catch (e) {
      console.error(new Date(), 'performCheck error', e);
      return resolve({ width: 0, height: 'err' });
    }
  })
}

const calculate = async function (params, lines) {

  return new Promise(resolve => {

    var precision = [];
    async.mapSeries(lines, async (line, callback) => {

      var isH1 = false;
      line.indexOf('<h1>') === 0 && (isH1 = true);
      isH1 && (line = line.substring(4, line.length));

      line.indexOf('<p>') === 0 && (line = line.substring(3, line.length));

      var c1 = String.fromCharCode(10240), c2 = String.fromCharCode(8202);
      line = line.replace(new RegExp(`^${c1}+|{c1}+$`, 'g'), '');
      line = line.replace(new RegExp(`^${c2}+|{c2}+$`, 'g'), '');
      line = line.replace(/<span class="quill-precision".+<\/span>/g, '');

      var r = /<img src="https:\/\/steamcommunity-a\.akamaihd\.net\/economy\/emoticon\/\w+">/g;
      var emoticons = (line.match(r) || []).map(tag => {
         return tag.match(/https:\/\/steamcommunity-a\.akamaihd\.net\/economy\/emoticon\/(\w+)/)[1];
      });

      var orgLine = line;
      line = line.replace(r, '');

      line = line.replace(/<br>/g, '\n');

      const rect = await performCheck(line, isH1);

      if (rect.height === 'err') {
        return callback(null, 'Unexpected error happened while trying to center this line. Please try again.');
      }

      if (rect.height > 18) {
        return callback(null, '<h1>*THIS LINE WAS TOO WIDE*</h1>');
      }

      var chars = isH1 ? WHITESPACE_CHARACTERS_HEADER : WHITESPACE_CHARACTERS;

      let t = 0, s = 0, p = 0, whitespaces = '';
      find(chars, (parseInt(params.width) - (rect.width + emoticons.length * 18)) / 2).forEach(i => {

        t += i;

        if (isH1) {
          if (i === 9.76318359375) {
            whitespaces += String.fromCharCode(10240);
          } else {
            whitespaces += String.fromCharCode(8202);
          }
        } else {
          if (i === 8.46142578125) {
            whitespaces += String.fromCharCode(10240);
          } else {
            whitespaces += String.fromCharCode(8202);
          }
        }

      });

      s = (t * 2 / (parseInt(params.width) - (rect.width + emoticons.length * 18))) * 100;
      p = t * 2 - ((parseInt(params.width) - (rect.width + emoticons.length * 18)));

      precision.push({ prec: s.toFixed(2), left: p.toFixed(2) });

      if (isH1) {
        return callback(null, '<h1>' + whitespaces + orgLine + '</h1>');
      }

      return callback(null, '<p>' + whitespaces + orgLine + '</p>');

    }, (err, lines) => resolve({ lines, precision }));

  });

}

const center = async function (ctx) {

  const params = ctx.request.body;
  const input = params.text;

  const allowedWidth = ['592', '626', '544', '534', '454'];

  if (typeof input !== 'string') {
    ctx.body = {
      success: false,
      error: 'INVALID_PARAM'
    };
    return;
  }

  if (allowedWidth.indexOf(params.width) === -1) {
    ctx.body = {
      success: false,
      error: 'WIDTH_NOT_ALLOWED'
    };
    return;
  }

  if (input.length > 5000) {
    ctx.body = {
      success: false,
      error: 'TEXT_TOO_LONG'
    };
    return;
  }

  if (input.length === 0) {
    ctx.body = {
      success: true,
      response: ''
    };
    return;
  }

  var lines = input.split(/<\/p>|<\/h1>/);
  lines.pop();

  if (lines.length > 1000) {
    ctx.body = {
      success: false,
      error: 'TEXT_TOO_LONG'
    };
    return;
  }

  var { lines, precision } = await calculate(params, lines);

  ctx.body = {
    success: true,
    response: lines.join(''),
    precision
  };

}

export default {
  center
}
