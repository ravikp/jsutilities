/*jshint expr: true*/

var expect = require('chai').expect;

var ObjectExtensions = require('../src/object_extensions');

describe('#ObjectExtensions.equals', function () {

  it('should be equal for objects with empty keys', function () {
    var literal1 = {};
    var literal2 = {};
    expect(ObjectExtensions.equals(literal1, literal2)).to.be.true;
  });

  it('should not be equal for objects with different key lengths', function () {
    var literal1 = {
      fname: 'Ram'
    };
    var literal2 = {
      fname: 'Ram',
      lname: 'Krishna'
    };
    expect(ObjectExtensions.equals(literal1, literal2)).to.be.false;
  });

  it('should be equal for objects with same keys and values', function () {
    var literal1 = {
      fname: ['Ram', 'Krishna']
    };
    var literal2 = {
      fname: ['Ram', 'Krishna']
    };
    expect(ObjectExtensions.equals(literal1, literal2)).to.be.true;
  });

  it(
    'should not be equal for objects with same keys when order of values differ',
    function () {
      var literal1 = {
        fname: ['Krishna', 'Ram']
      };
      var literal2 = {
        fname: ['Ram', 'Krishna']
      };
      expect(ObjectExtensions.equals(literal1, literal2)).to.be.false;
    });

  it('should not be equal for objects with same keys with different case',
    function () {
      var literal1 = {
        fname: ['Ram']
      };
      var literal2 = {
        Fname: ['Ram']
      };
      expect(ObjectExtensions.equals(literal1, literal2)).to.be.false;
    });

  it('should not be equal for objects with values in different case',
    function () {
      var literal1 = {
        fname: ['Ram']
      };
      var literal2 = {
        fname: ['ram']
      };
      expect(ObjectExtensions.equals(literal1, literal2)).to.be.false;
    });

});
