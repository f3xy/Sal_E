/* Script adds various variables to the page once loaded, useful if you're looking to get a particular variable quickly or see a bigger picture of your search results

Author: Johnny Brown
*/

var table2Edit;
var tableHead;

//variables for column title
var ip_address = "IP Address(s)";
var serial_num = "Serial Number";
var macos_vers = "macOS Version";
var free_disk = "Free Disk Space";
var vnc = "IP Address + VNC";
var ram = "RAM";
var munki_manifest = "Munki Manifest";

//generate a th (Title) for each column being inserted
col2Insert = [
   document.createElement('th')
  ,document.createElement('th')
  ,document.createElement('th')
  ,document.createElement('th')
  ,document.createElement('th') ];

//intialize button to copy and insert along with variables needed in addButton()
button2Insert = document.createElement('a');
var sidebarLI;
var sideBarLength;
var button2Copy;
var button2Insert;

//header title for variables
col2Insert[0].innerHTML = vnc;
col2Insert[1].innerHTML = serial_num;
col2Insert[2].innerHTML = macos_vers;
col2Insert[3].innerHTML = free_disk;

var one = 1;

//array for each column being added; labelled by variable
var insertVNC = [];
var insertSerial = [];
var insertVersion = [];
var insertFreeDiskSpace = [];
var url = [];
var htmlString;

//for ARD PLIST
var hostname = [];
var hostIP = [];
var plistURI;
var plistText;

// create array to hold XMLHttpRequests
var xhr = [],i;
var done = [];
var ready = true;

//Get Number of Machines returned in search result
var rows;
var length;


function enhanceSAL() {

  //Because Chrome is stupid, this is to Inject Javascript natively... thanks...
  var selectAll = `$('#DataTables_Table_0.groupList.table.table-striped.table-condensed.dataTable.no-footer').DataTable().page.len(-1).draw();`;
  var script = document.createElement('script');
  script.textContent = selectAll;
  (document.head||document.documentElement).appendChild(script);
  script.remove();

  //prep for button addition for ARD Plist Function
  sideBarLength = document.getElementsByClassName('sidebar-nav navbar-collapse')[0].getElementsByTagName('ul')[0].getElementsByTagName('li').length;
  sidebarLI = document.getElementsByClassName('sidebar-nav navbar-collapse')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[sideBarLength - 1];
  button2Copy = document.getElementsByClassName('sidebar-nav navbar-collapse')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[2].getElementsByTagName('a')[0];
  button2Insert = button2Copy.cloneNode(true);

  var table2Edit = document.getElementById('DataTables_Table_0');
  var tableHead = table2Edit.tHead.children[0];


  //Takes total number of columns to find a percentage that each column will split equally
  numof_col2Insert = col2Insert.length + 3;
  th_percentage = (one /= numof_col2Insert) * 100;
  //Add Columns to Header and resize them with the calculated percentage above
  for (i = 0; i < col2Insert.length; i++) {
    tableHead.appendChild(col2Insert[i]);
    table2Edit.getElementsByTagName('th')[i].style.width=th_percentage+"%";
      }
  rows = table2Edit.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  length = rows.length;
  //iterate through each of the returned machines to add various elements to appended columns


  for (i = 0; i < length; i++){
    url[i] = rows[i].getElementsByTagName("td")[0].getElementsByTagName('a')[0].getAttribute('href');
    console.log(url[i]);
    insertVNC[i] = rows[i].insertCell(-1);
    insertSerial[i] = rows[i].insertCell(-1);
    insertVersion[i] = rows[i].insertCell(-1);
    insertFreeDiskSpace[i] = rows[i].insertCell(-1);}

    console.log(url);

    var promises = url.map(url =>
          fetch("https://onemorething.kennesaw.edu" + url,{
            credentials: 'include'
          }).then(resp => resp.text())
        );
        console.log(promises);

      Promise.all(promises).then(texts => {

        for (i = 0; i < url.length; i++) {

        htmlString = texts[i]
                  , parser = new DOMParser()
                  , doc = parser.parseFromString(htmlString,"text/html")
                  , test = doc.getElementById('page-wrapper').children[1]
                  , ip_address = doc.getElementsByClassName('col-md-5')[0].children[5].children[0].children[0].children[10].innerHTML
                  , serial_num = doc.getElementsByClassName('col-md-5')[0].children[5].children[0].children[0].children[8].innerHTML
                  , macos_vers = doc.getElementsByClassName('col-md-5')[0].children[5].children[0].children[0].children[14].innerHTML
                  , free_disk = doc.getElementsByClassName('col-md-5')[0].children[5].children[0].children[0].children[16].innerHTML;
                //Actually insert the variables obtained above
                ip_array = ip_address.split(", ");
                for(j = 0; j < ip_array.length; j++)
                insertVNC[i].innerHTML += ' <a href="vnc://itshw:@' + ip_array[j] +'">' + ip_array[j]+'</a> <br/> ';
                insertSerial[i].innerHTML = serial_num;
                insertVersion[i].innerHTML = macos_vers.match(/\d{2,2}\.\d{1,2}\.?\d{1,2}/);
                insertFreeDiskSpace[i].innerHTML = free_disk;

                // For ARD
                hostname[i] = rows[i].getElementsByTagName("td")[0].getElementsByTagName('a')[0].innerHTML;
                hostname[i] = hostname[i].replace(/\s+/g, '');
                hostIP[i] = ip_array[0];
                done[i] = 1;}

      }).then(addButton);


};

// Taken shamelessly from https://stackoverflow.com/a/105074/7722961 so I don't have to re-invent the wheel
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

// Referenced: https://github.com/Error-freeIT/PHP-ARD-Import-List-Generator/blob/master/ardgen.php
function genPlist() {
  var table2Edit = document.getElementById('DataTables_Table_0');
  rows = table2Edit.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  length = rows.length;

  var plistText = '';

 var header = `<?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 <plist version="1.0">
 <dict>
   <key>items</key>
   <array> \n`;

  var body = '';
  var footer = `    </array>
    <key>listName</key>
    <string>Test</string>
    <key>uuid</key>
    <string>${guid()}</string>
</dict>
</plist>`;

  for(k=0;k<length;k++) {
    body += `     <dict>
       <key>name</key>
       <string>${hostname[k]}</string>
       <key>networkAddress</key>
       <string>${hostIP[k]}</string>
       <key>networkPort</key>
       <integer>3283</integer>
       <key>vncPort</key>
       <integer>5900</integer>
      </dict>\n`; }

     plistText = (header + body + footer);
     plistURI = ('data:application/x-plist,' + encodeURIComponent(plistText));
     lastIndex = document.getElementsByClassName('sidebar-nav navbar-collapse')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[2].getElementsByTagName('a').length;

    //  sidebarLI.appendChild(button2Insert);
     button2Insert.setAttribute('href',`${plistURI}`);
     button2Insert.innerHTML = "Export ARD Plist";
     sidebarLI.appendChild(button2Insert);
};
function genPlist() {
  var table2Edit = document.getElementById('DataTables_Table_0');
  rows = table2Edit.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  length = rows.length;

  var container_name = prompt("Name of Container for Ard");
  var plistText = '';

 var header = `<?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 <plist version="1.0">
 <dict>
   <key>items</key>
   <array> \n`;

  var body = '';
  var footer = `    </array>
    <key>listName</key>
    <string>${container_name}</string>
    <key>uuid</key>
    <string>${guid()}</string>
</dict>
</plist>`;

  for(k=0;k<length;k++) {
    body += `     <dict>
       <key>name</key>
       <string>${hostname[k]}</string>
       <key>networkAddress</key>
       <string>${hostIP[k]}</string>
       <key>networkPort</key>
       <integer>3283</integer>
       <key>vncPort</key>
       <integer>5900</integer>
      </dict>\n`; }

     plistText = (header + body + footer);
     plistURI = ('data:application/x-plist,' + encodeURIComponent(plistText));
     //window.open(plistURI, container_name + '.plist');
     var download = document.createElement('a');
     download.download = container_name + '.plist';
     download.href = plistURI;
     console.log(plistURI);
     download.click();

}

function addButton() {
  button2Insert.innerHTML = "Export ARD Plist";
  button2Insert.setAttribute('href',`javascript:void(0)`);
  button2Insert.addEventListener("click", genPlist, false);
  sidebarLI.appendChild(button2Insert);
}


$(document).ready(function() {
  var whereami = (window.location.pathname + window.location.search);
  var loading = true;
  return [
    /\/(search)\/\?(q)\=(\w)*/gi, //regex for normal search results page
    /\/(search)\/(run_search)\/\d+/gi, //regex for advanced search
    ///\/(list)\/.*/gi //adds support for list pages but it doesn't work great so I'll explore it later
  ].some(function(regexp){
    if (regexp.test(whereami)){
    enhanceSAL();
    //checkXHR();
  }
    })
});
