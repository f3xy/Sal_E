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




function enhanceSAL() {
  // The following will change the page to load all of the search results to make things easier.
  //Because Chrome is stupid, this is to Inject Javascript natively... thanks...
  var actualCode = `$('#DataTables_Table_0.groupList.table.table-striped.table-condensed.dataTable.no-footer').DataTable().page.len(-1).draw();`;
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head||document.documentElement).appendChild(script);
  script.remove();

  //Get table that holds the returned search results
  var table2Edit = document.getElementById('DataTables_Table_0');

  //Get the table grabbed above's Header
  var tableHead = table2Edit.tHead.children[0];


  //Creates Array for Titles and variables for the title of Columns to Add
  var col2Insert = [];
  var ip_address = "IP Address(s)";
  var serial_num = "Serial Number";
  var macos_vers = "macOS Version";
  var free_disk = "Free Disk Space";
  var vnc = "IP Address + VNC";

// Can ddd later if Needed
  var ram = "RAM";
  var munki_manifest = "Munki Manifest";

//Insert blank TH for each Column to Display; I should probably make this customizable at some point... later
  col2Insert = [document.createElement('th'),document.createElement('th'),document.createElement('th'),document.createElement('th'),document.createElement('th')];

// Assign titles created above in static order; should make this customizable in the future as well
  col2Insert[0].innerHTML = vnc;
  col2Insert[1].innerHTML = serial_num;
  col2Insert[2].innerHTML = macos_vers;
  col2Insert[3].innerHTML = free_disk;

//Takes total number of columns to find a percentage that each column will split equally
  numof_col2Insert = col2Insert.length + 3;
  var one = 1;
  th_percentage = (one /= numof_col2Insert) * 100;
//Add Columns to Header and resize them with the calculated percentage above
  for (i = 0; i < col2Insert.length; i++) {
    tableHead.appendChild(col2Insert[i]);
    table2Edit.getElementsByTagName('th')[i].style.width=th_percentage+"%";}

  //add Column to each search result to hold IP Address

//Get Number of Machines returned in search result
  rows = table2Edit.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  length = rows.length;

  //creates array to hold the corresponding values for each machine (allows me to use asyncrhonous XMLHttpRequest and makes execution MUCH faster)
  var insertVNC = [];
  var insertSerial = [];
  var insertVersion = [];
  var insertFreeDiskSpace = [];
  var url;
  var htmlString;
// create array to hold XMLHttpRequests
    var xhr = [], i;
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

          } //end if statement
    };//end xhr function
    //"Get" the "Url"... true means asyncrhonous
      xhr[i].open("GET",url,true);
      xhr[i].send();
    })(i); //end for loop

    }
}; //end

//regex for search result pages
var search = new RegExp(/\/(search)\/\?(q)\=(\w)*/); //url pathname must be search/?q={whatever you searched}
var adv_search = new RegExp(/\/(search)\/(run_search)\/\d+/);
//get path name and search query from URL
var whereami = (window.location.pathname + window.location.search);
// Checks path name and query against regrex and only run if it meets the requirements to prevent script running on pages not needed
$(document).ready(function() {
  if (search.test(whereami) || adv_search.test(whereami))
    enhanceSAL()
});
