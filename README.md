Built upon the foundation of https://github.com/mistval/render_furigana#readme 
 
And by built I mean I mostly just deleted code, thank @mistval

# Render Furigana
Render Japanese text to an array of objects specifying kanji and relevant furigana.

## Examples
```js
const deconstructJapanese = require('deconstruct-japanese');

deconstructJapanese('私達は、製品の品質において、業界基準を大きく上回っています').then(arrayOfObjects => {
  console.log(arrayOfObjects);
  /*
  [ { kanji: '私', furigana: 'わたし' },
  { kanji: '達', furigana: 'たち' },
  { kanji: 'は' },
  { kanji: '、' },
  { kanji: '製品', furigana: 'せいひん' },
  { kanji: 'の' },
  { kanji: '品質', furigana: 'ひんしつ' },
  { kanji: 'に' },
  { kanji: 'お' },
  { kanji: 'い' },
  { kanji: 'て' },
  { kanji: '、' },
  { kanji: '業界', furigana: 'ぎょうかい' },
  { kanji: '基準', furigana: 'きじゅん' },
  { kanji: 'を' },
  { kanji: '大', furigana: 'おお' },
  { kanji: 'き' },
  { kanji: 'く' },
  { kanji: '上回', furigana: 'うわまわ' },
  { kanji: 'っ' },
  { kanji: 'て' },
  { kanji: 'い' },
  { kanji: 'ま' },
  { kanji: 'す' } ]
  */
});
```