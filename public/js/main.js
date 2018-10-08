function getCredentials() {
    const req = new XMLHttpRequest();
    req.open('GET', '/token_config', false);
    req.send(null);
    if (req.status == 200) return (JSON.parse(req.responseText));
}

function postLog(message) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/logs', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ message }));
}

function paramsToObject() {
    let urlParams = new URLSearchParams(window.location.search);
    let result = {}
    for (let entry of urlParams) {
        result[entry[0]] = entry[1];
    }
    return result;
}

//voxbone.WebRTC.basicAuthInit('yourwebrtcusername', 'yourwebrtcpass');

voxbone.WebRTC.init(getCredentials());

var eventHandlers = {
    'getUserMediaFailed': function(e) {
        alert('Cannot get User Media');
    },
    'getUserMediaAccepted': function(e) {
        postLog('Call started');
        postLog(paramsToObject());
        document.getElementById("progress-icon").classList.replace('fa-phone', 'fa-ellipsis-h');
    },
    'accepted': function(e) {
        postLog('Call connected');
        document.getElementById("progress-icon").classList.replace('fa-ellipsis-h', 'fa-phone');
        document.getElementById("call-status").innerHTML = 'End Call';
        document.getElementById("call-btn").style.background = '#CC0000';
        document.getElementById("mute-btn").style.display = 'flex';
    },
    'ended': function(e) {
        postLog('Call ended');
        document.getElementById("call-btn").style.display = 'none';
        document.getElementById("mute-btn").style.display = 'none';
        document.getElementById("feedback").style.display = 'block';
    }
};

voxbone.WebRTC.customEventHandler = Object.assign(voxbone.WebRTC.customEventHandler, eventHandlers);

function sendFeedback() {
    const text = document.getElementById("feedback-textarea").value;
    document.getElementById("feedback").style.display = 'none';
    postLog({ feedback: text });
}

function toggleMute() {
    if (voxbone.WebRTC.isMuted) {
        voxbone.WebRTC.unmute();
        document.getElementById("mute-status").innerHTML = 'Mute';
        document.getElementById("mute-icon").classList.replace('fa-microphone', 'fa-microphone-slash');
    } else {
        voxbone.WebRTC.mute();
        document.getElementById("mute-status").innerHTML = 'Unmute';
        document.getElementById("mute-icon").classList.replace('fa-microphone-slash', 'fa-microphone');

    }
}

function isInCall() {
    return (typeof voxbone.WebRTC.rtcSession.isEstablished === 'function') && !voxbone.WebRTC.rtcSession.isEnded();
}

function callAction() {
    if (!isInCall()) {
        // Change this line with your desired DID to call
        voxbone.WebRTC.call('543415122184');
        document.getElementById("call-status").innerHTML = '';
    } else {
        voxbone.WebRTC.hangup();
    }
}
