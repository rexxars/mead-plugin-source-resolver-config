# mead-plugin-source-resolver-config

[![npm version](http://img.shields.io/npm/v/mead-plugin-source-resolver-config.svg?style=flat-square)](http://browsenpm.org/package/mead-plugin-source-resolver-config)[![Build Status](http://img.shields.io/travis/rexxars/mead-plugin-source-resolver-config/master.svg?style=flat-square)](https://travis-ci.org/rexxars/mead-plugin-source-resolver-config)[![Coverage Status](https://img.shields.io/coveralls/rexxars/mead-plugin-source-resolver-config/master.svg?style=flat-square)](https://coveralls.io/github/rexxars/mead-plugin-source-resolver-config)[![Dependency status](https://img.shields.io/david/rexxars/mead-plugin-source-resolver-config.svg?style=flat-square)](https://david-dm.org/rexxars/mead-plugin-source-resolver-config)

Super-simple source resolver that uses the Mead configuration file to look up sources

## Installation

```shell
# Bundled with mead by default, but if you're feeling frisky
npm install --save mead-plugin-source-resolver-config
```

## Usage

**Note: Bundled with Mead and enabled by default**

Your mead configuration file (`mead --config <path-to-config.js>`):

```js
module.exports = {
  // Load the plugin
  plugins: [
    require('mead-plugin-source-resolver-config')
  ],

  // Tell mead to use it
  sourceResolver: 'config'
}
```

## License

MIT-licensed. See LICENSE.
