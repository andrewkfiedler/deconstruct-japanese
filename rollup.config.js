const dependencies = Object.keys(require('./package.json').dependencies);

export default {
    input: 'src/main.js',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    external: dependencies
  };