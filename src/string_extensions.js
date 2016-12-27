var compress = function (input) {
  if (input === undefined || input === '' || typeof input !== 'string') return '';

  var count = 0,
    current_char = input[0];
  var output = '';
  for (const char of input) {
    if (current_char === char) {
      count++;
      continue;
    }
    output += current_char + count;
    current_char = char;
    count = 1;
  }
  return output + current_char + count;
};

module.exports = {
  compress
};
