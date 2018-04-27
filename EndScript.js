/* Script adds various variables to the page once loaded, useful if you're looking to get a particular variable quickly or see a bigger picture of your search results

Author: Johnny Brown

Release Notes:

1.0 - April 17th, 2018
  - Initial release (Chrome and Safari for now b/c FF couldn't "Just Work")
  -Search Result Modifications: basicallly adds what I believe to be the most searched variables when clickin on individual machines
    -Auto Load all serach results
    -adds IP Address column (with VNC links for Screen Sharing, username included)
    -Serial Number
    -macOS version
    -Free Disk Space

To-Do List:
-User Customization if desired later on
-Generate Plist for ARD
-????
*/
//Get table that holds the returned search results
var table2Edit;
//Get the table grabbed above's Header
var tableHead;
//Creates Array for Titles and variables for the title of Columns to Add
var col2Insert = [];
var ip_address = "IP Address(s)";
var serial_num = "Serial Number";
var macos_vers = "macOS Version";
var free_disk = "Free Disk Space";
var vnc = "IP Address + VNC";
var ram = "RAM";
var munki_manifest = "Munki Manifest";

//Insert blank TH for each Column to Display; I should probably make this customizable at some point... later
col2Insert = [
   document.createElement('th')
  ,document.createElement('th')
  ,document.createElement('th')
  ,document.createElement('th')
  ,document.createElement('th') ];

button2Insert = document.createElement('a');
var sidebarLI;
var sideBarLength;
var button2Copy;
var button2Insert;
var copyTextBox;
var insertTextBox;


col2Insert[0].innerHTML = vnc;
col2Insert[1].innerHTML = serial_num;
col2Insert[2].innerHTML = macos_vers;
col2Insert[3].innerHTML = free_disk;

var one = 1;

//creates array to hold the corresponding values for each machine (allows me to use asyncrhonous XMLHttpRequest and makes execution MUCH faster)
var insertVNC = [];
var insertSerial = [];
var insertVersion = [];
var insertFreeDiskSpace = [];
var url;
var htmlString;

//for ARD PLIST
var hostname = [];
var hostIP = [];
var plistURI;
var plistText;

// create array to hold XMLHttpRequests
var xhr = [], i;
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
  for (i = 0; i < length; i++) {
    (function(i) {
    // new XMLHttpRequest
    xhr[i] = new XMLHttpRequest();
    // gets machine url from href tag
    url = rows[i].getElementsByTagName("td")[0].getElementsByTagName('a')[0].getAttribute('href');
    //Insert the desired values at the end of each row; will try to make this customizable later as well
    insertVNC[i] = rows[i].insertCell(-1);
    insertSerial[i] = rows[i].insertCell(-1);
    insertVersion[i] = rows[i].insertCell(-1);
    insertFreeDiskSpace[i] = rows[i].insertCell(-1);

    // the fun part: this function takes each url, loads it in the background, retrieves the values needed, and then discards the page once the function is complete; In theory you could add whatever you want without taking significantly longer as long as it's on this page
    xhr[i].onreadystatechange = function() {
        if (xhr[i].readyState == 4 && xhr[i].status == 200) {
             htmlString = xhr[i].responseText
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
            done[i] = 1;


                }

            };

    //"Get" the "Url"... true means asyncrhonous
      xhr[i].open("GET",url,true);
      xhr[i].send();
        })(i); //end for loop

    }
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
     download.click();

};
function checkXHR() {
  if (xhr[length-1].status != 200){
    window.setTimeout(checkXHR,100);
  } else {
    addButton();
  }
}

function addButton() {

  button2Insert.innerHTML = "Export ARD Plist";
  button2Insert.setAttribute('href',`javascript:void(0)`);
  button2Insert.addEventListener("click", genPlist, false);
  sidebarLI.appendChild(button2Insert);

}
$(document).ready(function() {
  var whereami = (window.location.pathname + window.location.search);
  
  return [
    /\/(search)\/\?(q)\=(\w)*/gi, //regex for normal search results page
    /\/(search)\/(run_search)\/\d+/gi, //regex for advanced search
    ///\/(list)\/.*/gi //adds support for list pages but it doesn't work great so I'll explore it later
  ].some(function(regexp){
    if (regexp.test(whereami)){
    enhanceSAL();
    checkXHR();
  }
    })
});
