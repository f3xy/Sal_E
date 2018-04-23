
// Taken shamelessly from https://stackoverflow.com/a/105074/7722961 so I don't have to re-invent the wheel
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};


function genPlist() {
  var table2Edit = document.getElementById('DataTables_Table_0');
  rows = table2Edit.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  length = rows.length;

 var header = `?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 <plist version="1.0">
 <dict>
 	<key>items</key>
 	<array> \n`;

  var body = '';
  var footer = '';

  for










};
