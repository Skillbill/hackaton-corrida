// Client ID and API key from the Developer Console
var CLIENT_ID = '670742227434-uc7h98jd4fe571tfi2pjtuvv24spd058.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload';

var uploadButton = document.querySelector('button.upload');
var uploadForm = document.querySelector('.uploadForm');
var selectForm = document.querySelector('.selectForm');
var progress = document.querySelector('#progress');

uploadButton.addEventListener('click', (e) => {
  e.preventDefault();
  uploadVideo();
});

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  var uploadVideo = new UploadVideo();
  uploadVideo.ready(gapi.client.getToken().access_token);
  progress.classList.remove('hidden')
})

function uploadVideoApi(videoId) {
  if(videoId) {
    user.getIdToken().then((auth_token) => {
      fetch('/api/upload', {method: 'POST', headers: {'Authorization': 'Bearer ' + auth_token, 'Content-Type': 'application/json'}, body: JSON.stringify({videoId})});
    });
  }
}

function uploadVideo() {

  var initClient = function() {
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
    gapi.auth2.getAuthInstance().signIn()
  }
  
  gapi.load('client:auth2', initClient);
  
  function updateSigninStatus(isLogged) {
    if(isLogged) {
      uploadForm.classList.remove("hidden");
      selectForm.classList.remove("hidden");
      getVideoListByChannel().then((list) => {
        console.log("list", list);
        var select = selectForm.querySelector('select');
        list.items.forEach((video) => {
          var option = document.createElement('option');
          option.value = video.id.videoId;
          option.innerHTML = video.snippet.title;
          select.appendChild(option);
        });
      })
    }
  }
  
}

function getVideoListByChannel() {
  return new Promise((resolve, reject) => {
    gapi.client.request({
      path: '/youtube/v3/channels',
      params: {
        part: 'snippet',
        mine: true
      },
      callback: function(response) {
        if(response.error) {
          console.error(response.error.message);
          reject(response);
        } else {
          console.log(response);
          fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyCu9NwE3N0rAc7j3oFvhfZfPLnYuHEX4Z0&channelId=${response.items[0].id}&part=snippet,id&order=date&maxResults=20`).then((res) => {
            return res.json();
          }).then(resolve)
        }
      }.bind(this)
    });
  });  
}


