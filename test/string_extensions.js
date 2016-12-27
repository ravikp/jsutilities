var should = require('chai').should(),
jsutilities = require('../index'),
compress = jsutilities.compress;

describe('#compress', function(){
  it('should return empty string on undefined argument', function(){
    compress(undefined).should.equal('');
  });

  it('should return empty string on empty string', function(){
    compress('').should.equal('');
  });

  it('should return 1 for a single character', function(){
    compress('a').should.equal('a1');
  });

  it('should return count for a repeated single character', function(){
    compress('aa').should.equal('a2');
  });

  it('should return count of repeated characters', function(){
    compress('abbcccdddd').should.equal('a1b2c3d4');
  });

  it('should return empty string for any non-string argument', function(){
    compress(true).should.equal('');
  });

});
