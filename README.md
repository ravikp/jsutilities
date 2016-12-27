# JsUtilities #

This repository contains extensions on string and uri's. The utilities are all
developed using TDD.

Current build status:
[![Build Status](https://travis-ci.org/ravikp/jsutilities.svg?branch=master)](https://travis-ci.org/ravikp/jsutilities)

# JsUtilities #
===============

A small library providing utility methods to `compress` and `checkURIs`

## To run tests locally
  - npm install
  - npm test

## Installation
  This library is not yet published into npm. Otherwise we need to install
  the library using the below command in bash.
  
  ``` npm install jsutilities --save ```

## Usage

  ```javascript

  var jsutilities = require('jsutilities')
      compress = jsutilities.compress,
      checkURIs = jsutilities.checkURIs;

  var uncompressed = 'abbcccdddd';
  var compressed_string = compress(uncompressed);
  console.log(compressed_string); //should return a1b2c3d4

  var uri1 = 'http://ravikumar.io', uri2 = 'http://ravikumar.io:80';
  var are_uris_same = checkURIs(uri1, uri2);
  console.log(are_uris_same); //should return true

  ```

## Release History

* 1.0.0 Initial release
