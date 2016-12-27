var get_keys = function (input) {
  var output = [];
  for (var key in input) {
    if (input.hasOwnProperty(key)) {
      output.push(key);
    }
  }
  return output;
};

var are_arrays_equal = function (arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    var item1 = arr1[i];
    var item2 = arr2[i];
    if (item1 !== item2) return false;
  }
  return true;
};

var equals = function (object1, object2) {

  var this_keys = get_keys(object1).sort();
  var that_keys = get_keys(object2).sort();

  if (!are_arrays_equal(this_keys, that_keys)) return false;

  for (var i = 0; i < this_keys.length; i++) {
    var this_item = object1[this_keys[i]];
    var that_item = object2[that_keys[i]];
    if (!are_arrays_equal(this_item, that_item)) return false;
  }
  return true;
};

module.exports = {
  equals
};
