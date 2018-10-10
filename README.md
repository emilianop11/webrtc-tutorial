# webrtc-tutorial
Contains source code for voxbone click to call webrtc tutorial

## Install app dependencies
```bash
npm install
```

## Set environment variables

* Duplicate .env.example as .env
* Set the environment variables `webrtc_username` and `webrtc_pass` with your WebRTC credentials.

Also, change the following line to call your own DID: </public/js/main.js#L79>

## Initialize app

```bash
npm start
```
