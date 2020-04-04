// Help Functions to RDF4J processing


//// Help Queries
function strlenFix(str) {
  while (str.length < 4) str = "0" + str;
  return str;
}

function convertUTF8toJAVA(input) {
  var result = '';
  /* UTF-8 to entities */
  for (i = 0; i < input.length; i++) {
    charCode = input.charCodeAt(i);
    if (charCode <= 127)
      result += input.charAt(i);
    else
      result += '\\u' + strlenFix(charCode.toString(16).toUpperCase());
  }
  return result
}

function convertJAVAtoUTF8(input) {
  var result = '';

  var state = 0;
  var chars = 0;
  var value = "";
  /* entities to UTF-8 */
  for (i = 0; i < input.length; i++) {
    switch (state) {
      case 0:
        if (input.charAt(i) == '\\')
          state = 1;
        else
          result += input.charAt(i);
        break;
      case 1:
        if (input.charAt(i) == 'u') {
          state = 2;
          chars = 0;
          value = "";
        } else {
          result += '\\' + input.charAt(i);
          state = 0;
        }
        break;
      case 2:
        chars++;
        value += input.charAt(i);
        if (chars >= 4) {
          result += unescape("%u" + value);
          state = 0;
        }
        break;
    }
  }
  return result
}


// a list of exported variables
module.exports = {
  convertUTF8toJAVA,
  convertJAVAtoUTF8
};