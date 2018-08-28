const renderFurigana = require('./index.js');
const fs = require('fs');
const kanjiFont = '40px IPAMincho';
const furiganaFont = '20px IPAMincho';

renderFurigana('私達は、製品の品質において、業界基準を大きく上回っています', kanjiFont, furiganaFont).then(pngBuffer => {
  console.log(pngBuffer);
});