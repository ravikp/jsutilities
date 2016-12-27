/*jshint expr: true*/

var expect = require('chai').expect;

var jsutilities = require('../index');
var checkUris = jsutilities.checkUris;

var uri_extensions = require('../src/uri_extensions');
var Uri = uri_extensions.Uri;

describe('#Uri', function () {

  it('should parse scheme', function () {
    var uri = new Uri('http://g.com/');
    expect(uri.scheme()).to.equal('http');
  });

  it('should parse scheme to lowercase', function () {
    var uri = new Uri('HTtP://g.com/');
    expect(uri.scheme()).to.equal('http');
  });

  it('should have empty authentication scheme for open urls', function () {
    var uri = new Uri('http://g.com/');
    expect(uri.authentication()).to.equal('');
  });

  it('should parse authentication parameters', function () {
    var uri = new Uri('http://username:password@g.com/');
    expect(uri.authentication()).to.equal('username:password');
  });

  it('should parse hostname', function () {
    var uri = new Uri('http://g.com/');
    expect(uri.hostname()).to.equal('g.com');
  });

  it('should parse hostname when optional trailing slash', function () {
    var uri = new Uri('http://g.com');
    expect(uri.hostname()).to.equal('g.com');
  });

  it('should deduce default port number for scheme', function () {
    var uri = new Uri('http://g.com');
    expect(uri.port()).to.equal(80);
  });

  it('should parse port number', function () {
    var uri = new Uri('http://g.com:8080');
    expect(uri.port()).to.equal(8080);
  });

  it('should parse empty path to root', function () {
    var uri = new Uri('http://g.com');
    expect(uri.path()).to.equal('/');
  });

  it('should parse root path', function () {
    var uri = new Uri('http://g.com/');
    expect(uri.path()).to.equal('/');
  });

  it('should parse path', function () {
    var uri = new Uri('http://g.com/p1/p2/p3');
    expect(uri.path()).to.equal('/p1/p2/p3');
  });

  it('should parse path with hexadecimal encoded values', function () {
    var uri = new Uri('http://g.com/%7ep1/p2');
    expect(uri.path()).to.equal('/~p1/p2');
  });

  it('should parse paths with parent directory symbols', function () {
    var uri = new Uri('http://g.com/p1/../p3');
    expect(uri.path()).to.equal('/p3');
  });

  it('should parse paths with current directory symbols', function () {
    var uri = new Uri('http://g.com/p1/./p3');
    expect(uri.path()).to.equal('/p1/p3');
  });

  it('should default to empty query set when url do not have query',
    function () {
      var uri = new Uri('http://g.com:8080/p1/p2/p3/');
      expect(uri.query()).to.deep.equal({});
    });

  it('should build query parameter set from uri', function () {
    var uri = new Uri(
      'http://g.com:8080/p1/p2/p3?fname=ravi&lname=kumar');
    expect(uri.query()).to.deep.equal({
      fname: ['ravi'],
      lname: ['kumar'],
    });
  });

  it(
    'should main query parameter value order when uri contains duplicate names',
    function () {
      var uri = new Uri(
        'http://b.com/?fname=ravi&role=developer&fname=kumar');
      expect(uri.query()).to.deep.equal({
        role: ['developer'],
        fname: ['ravi', 'kumar']
      });
    });

  it('should return default hash fragment when there is no hash fragment',
    function () {
      var uri = new Uri('http://g.com/p1');
      expect(uri.hash_fragment()).to.equal('');
    });

  it('should parse hash fragment', function () {
    var uri = new Uri('http://g.com/p1#/products/list');
    expect(uri.hash_fragment()).to.equal('#/products/list');
  });

});

describe('#checkUris', function () {
  it('should be case insensitive when comparing schemes', function () {
    var uri1 = 'http://g.com/';
    var uri2 = 'HTTP://g.com/';
    expect(checkUris(uri1, uri2)).to.be.true;
  });

  it('should be case sensitive when comparing authentication', function () {
    var uri1 = 'http://a1:pass1@g.com/';
    var uri2 = 'http://A1:pass1@g.com/';
    expect(checkUris(uri1, uri2)).to.be.false;
  });

  it('should compare two uris with different hosts', function () {
    var uri1 = 'http://g1.com/';
    var uri2 = 'http://g2.com/';
    expect(checkUris(uri1, uri2)).to.be.false;
  });

  it('should compare hosts case insensitively', function () {
    var uri1 = 'http://g1.com/';
    var uri2 = 'http://G1.com/';
    expect(checkUris(uri1, uri2)).to.be.true;
  });

  it('should compare uris with different ports', function () {
    var uri1 = 'http://g.com/';
    var uri2 = 'http://g.com:8080/';
    expect(checkUris(uri1, uri2)).to.be.false;
  });

  it('should compare uris with different paths', function () {
    var uri1 = 'http://g.com/p1';
    var uri2 = 'http://g.com/p2';
    expect(checkUris(uri1, uri2)).to.be.false;
  });

  it('should compare uris with different query_params', function () {
    var uri1 = 'http://g.com/p1?gender=boy';
    var uri2 = 'http://g.com/p1?gender=girl';
    expect(checkUris(uri1, uri2)).to.be.false;
  });

  it('should compare uris with different hash fragments', function () {
    var uri1 = 'http://g.com/p1/#/state1';
    var uri2 = 'http://g.com/p1/#/state2';
    expect(checkUris(uri1, uri2)).to.be.false;
  });

  it('should compare uris with hexadecimal, default ports', function () {
    var uri1 = 'http://abc.com:80/~smith/home.html';
    var uri2 = 'http://ABC.com/%7Esmith/home.html';
    expect(checkUris(uri1, uri2)).to.be.true;
  });

  it('should compare uris with parent and current directories', function () {
    var uri1 = 'http://abc.com/drill/down/foo.html';
    var uri2 = 'http://abc.com/drill/further/../down/./foo.html';
    expect(checkUris(uri1, uri2)).to.be.true;
  });

  it('should compare uris with different order of query parameters',
    function () {
      var uri1 = 'http://abc.com/foo.html?a=1&b=2';
      var uri2 = 'http://abc.com/foo.html?b=2&a=1';
      expect(checkUris(uri1, uri2)).to.be.true;
    });

  it('should compare uris with multiple query parameters',
    function () {
      var uri1 = 'http://abc.com/foo.html?a=1&b=2&a=3';
      var uri2 = 'http://abc.com/foo.html?a=3&a=1&b=2';
      expect(checkUris(uri1, uri2)).to.be.false;
    });


});
