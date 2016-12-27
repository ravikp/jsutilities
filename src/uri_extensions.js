var ObjectExtensions = require('./object_extensions');

const SCHEME = 1;
const AUTHENTICATION = 2;
const HOSTNAME = 3;
const PORT = 4;
const PATH = 5;
const QUERY = 6;
const HASH_FRAGMENT = 7;

function Uri(input) {

  var self = this;
  self.input = input;
  //This regex has been test driven by the tests in test/uri_extensions.js
  var uri_regex =
    /^(http):\/\/(\w+:\w+@)?([^\/:]+)(:\d+)?([^(\?|#)]*)(\?[^#]+)?(#.*)?/gi;
  self.matches = uri_regex.exec(input);

  /**** To parse path ****/
  var filter_empty_directories = function (uri_path) {
    return uri_path.split('/').filter(function (value) {
      return value !== '' && value !== '.';
    });
  };

  var decode_hexa_decimal_names = function (paths) {
    return paths.map(function (value) {
      var regex = /%[0-9A-F]{2}/gi;
      if (!value.match(regex)) return value;
      return value.replace(regex, function (match) {
        return String.fromCharCode(parseInt(match.slice(1), 16));
      });
    });
  };

  var construct_absolute_path = function (directories) {
    return '/' + directories.reduce(function (acc, value) {
      if (value === '..') {
        acc.splice(acc.length - 1, 1);
        return acc;
      }
      acc.push(value);
      return acc;
    }, []).join('/');
  };

  self.path = function () {
    var path = this.matches[PATH];
    if (typeof path === "undefined" || path === "") return "/";
    var output =
      construct_absolute_path(
        decode_hexa_decimal_names(
          filter_empty_directories(path)));
    return output;
  };

  self.equals = function (that) {
    return self.scheme() === that.scheme() &&
      self.hostname().toLowerCase() === that.hostname().toLowerCase() &&
      self.authentication() === that.authentication() &&
      self.port() === that.port() &&
      self.path() === that.path() &&
      ObjectExtensions.equals(self.query(), that.query()) &&
      self.hash_fragment() === that.hash_fragment();
  };
}

Uri.prototype.scheme = function () {
  return this.matches[SCHEME].toLowerCase();
};

Uri.prototype.authentication = function () {
  var authentication = this.matches[AUTHENTICATION];
  if (authentication === undefined) return '';

  return authentication.slice(0, -1);
};

Uri.prototype.hostname = function () {
  return this.matches[HOSTNAME];
};

Uri.prototype.port = function () {
  var port = this.matches[PORT];
  if (port === undefined) return 80;

  return parseInt(port.slice(1));
};

Uri.prototype.query = function () {
  var query = this.matches[QUERY];
  if (query === undefined) return {};

  var query_params = query.slice(1).split('&');
  var query_params_set = {};

  var key, value;
  for (const query_param of query_params) {
    [key, value] = query_param.split('=');
    if (key in query_params_set) {
      query_params_set[key].push(value);
    } else {
      query_params_set[key] = [value];
    }
  }
  return query_params_set;
};

Uri.prototype.hash_fragment = function () {
  var fragment = this.matches[HASH_FRAGMENT];  
  return fragment || '';
};

function checkUris(uri_arg1, uri_arg2) {
  var uri1 = new Uri(uri_arg1);
  var uri2 = new Uri(uri_arg2);
  return uri1.equals(uri2);
}

module.exports = {
  checkUris,
  Uri
};
