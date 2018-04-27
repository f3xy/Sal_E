# SAL_E
Enhancements for SAL <br />
Author: Johnny Brown <br />

What does it do...

Currently SAL_E enhances search results adding a few columns of useful information to the user from having to click on a machine to find useful information such as an ip address or current macos version(see below). It uses a browser extension to install, but the script is all javascript run once the page is loaded.

Disclaimer: I removed the manifest for chrome and the Safari Extension folder, if you want to build this yourself you'd need to create a new extension, point the extension to your SAL URL, and add the enclosed 
endscript.js file.

Release Notes:

1.1 - April 27, 2018
- Pages will allow user to generate Plists now <br />
  -takes hostname and ip address of machine and asks user to name file and container for ARD <br />

1.01 - April 20, 2018 <br />
- EnhanceSAL works on advanced search now <br />

1.0 - April 17, 2018
- Initial release (Chrome and Safari only for now) <br />
    -Search Result Modifications: basicallly adds what I believe to be the most searched variables when clicking on individual machines <br />
    -Auto Load all serach results <br />
    -adds IP Address column (with VNC links for Screen Sharing, username included) <br />
    -Serial Number <br />
    -macOS version <br />
    -Free Disk Space <br />

To-Do List: <br />
-User Customization if desired later on <br />
-Generate Plist for ARD <br />
-???? <br />
Before: <br />
![Before](/Media/Screenshots/Before.png) <br />
After:  <br />
![After](/Media/Screenshots/After.png)
PLIST Generator:  <br />
![After](/Media/Screenshots/ard_Plist.png)
