# TfNSW Real Time Vehicle Position WAB Widget

A Transport for New South Wales Real time Vehicle position WAB widget.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

```
npm install
```

Change these two lines in Gruntfile.js

var appDir = '<Your WAB DE Directory>/server/apps/2';

var stemappDir = '<Your WAB DE Directory>/client/stemapp';


After the change

```
grunt
```

Grunt will run the compilation task and copy the source into the stem app and app directory.

