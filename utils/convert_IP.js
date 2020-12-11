exports.convert_Decimal_To_IPv4 = function(int) {
  var part1 = int & 255;
  var part2 = (int >> 8) & 255;
  var part3 = (int >> 16) & 255;
  var part4 = (int >> 24) & 255;

  return part4 + "." + part3 + "." + part2 + "." + part1;
}

// convert the ip address to a decimal
// assumes dotted decimal format for input
exports.convertIpToDecimal =  function(ip) {
  // a not-perfect regex for checking a valid ip address
  // It checks for (1) 4 numbers between 0 and 3 digits each separated by dots (IPv4)
  // or (2) 6 numbers between 0 and 3 digits each separated by dots (IPv6)
  var ipAddressRegEx = /^(\d{0,3}\.){3}.(\d{0,3})$|^(\d{0,3}\.){5}.(\d{0,3})$/;
  var valid = ipAddressRegEx.test(ip);
  if (!valid) {
    return false;
  }
  var dots = ip.split(".");
  // make sure each value is between 0 and 255
  for (var i = 0; i < dots.length; i++) {
    var dot = dots[i];
    if (dot > 255 || dot < 0) {
      return false;
    }
  }
  if (dots.length == 4) {
    // IPv4
    return ((+dots[0] * 256 + +dots[1]) * 256 + +dots[2]) * 256 + +dots[3];
  } else if (dots.length == 6) {
    // IPv6
    return (
      ((+dots[0] * 256 + +dots[1]) * 256 + +dots[2]) * 256 +
      +dots[3] * 256 +
      +dots[4] * 256 +
      +dots[5]
    );
  }
  return false;
}
