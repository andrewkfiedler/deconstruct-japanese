const assert = require('assert');
const kuroshiro = require('kuroshiro');
const htmlparser = require('htmlparser');

// Initialize kuroshiro
const kuroshiroInit = new Promise((fulfill, reject) => {
  if (kuroshiro) {
    kuroshiro.init(err => {
      if (err) {
        reject(err);
      } else {
        fulfill();
      }
    });
  } else {
    fulfill();
  }
});

function extractFurigana(text) {
  return kuroshiroInit.then(() => {
    // Call into kuroshiro to get the furigana for the input text.
    let kuroshiroResults = kuroshiro.convert(text, {mode: 'furigana'});
    let parseHandler = new htmlparser.DefaultHandler(function(error, dom) {});
    let parser = new htmlparser.Parser(parseHandler);
    parser.parseComplete(kuroshiroResults);
    let kuroshiroResultsAsDom = parseHandler.dom;

    /*
     * Kuroshiro returns results as an array of ruby elements.
     * See here for information about how those work:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby
     * Below, we convert the rubys to a more convenient structure.
     */
    let results = [];
    for (let element of kuroshiroResultsAsDom) {
      let thisResult = {kanji: '', furigana: ''};
      if (element.name === 'ruby') {
        for (let child of element.children) {
          if (child.type === 'text') {
            thisResult.kanji += child.raw;
          } else if (child.name === 'rt') {
            let thisFurigana = child.children.map(innerChild => innerChild.raw).join('');
            if (thisFurigana !== thisResult.kanji) {
              thisResult.furigana += thisFurigana;
            }
          }
        }
      } else if (element.type === 'text') {
        thisResult.kanji += element.raw;
      }
      results.push(thisResult);
    }
    return results;
  });
}

/**
* If a chunk does not contain furigana, split its kana into one chunk per character.
* This is only done for automatically detected furigana.
* In the case of automatically detected furigana, it leads to more natural line breaking.
*/
function splitNonFuriganaChunks(chunks) {
  let newRawChunks = [];
  let nextNonKanaChunk;
  for (let chunk of chunks) {
    if (!chunk.furigana) {
      let characters = chunk.kanji.split('');
      for (let character of characters) {
        let isKana = character >= '\u3040' && character <= '\u30FF';
        if (isKana) {
          nextNonKanaChunk = undefined;
          newRawChunks.push({kanji: character});
        } else {
          if (!nextNonKanaChunk) {
            nextNonKanaChunk = {kanji: ''};
            newRawChunks.push(nextNonKanaChunk);
          }
          nextNonKanaChunk.kanji += character;
        }
      }
    } else {
      nextNonKanaChunk = undefined;
      newRawChunks.push(chunk);
    }
  }
  return newRawChunks;
}

module.exports = function(text) {
  assert(text, 'No text provided. You must provide a string or an array of {kanji:xx, furigana:xx}');
  if (typeof text === typeof '') {
    return extractFurigana(text).then(rawChunks => {
      rawChunks = splitNonFuriganaChunks(rawChunks);
      return rawChunks;
    });
  } else {
    return text;
  }
}
