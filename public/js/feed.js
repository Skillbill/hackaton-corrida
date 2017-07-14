/**
 * Created by enrico on 14/07/17.
 */
const feed = {

  listNew : () => {
    user.getIdToken().then((auth_token) => {
      fetch('/api/list-new', {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + auth_token, 'Content-Type': 'application/json'}
      })
      .then((response) => {
          return response.json();
        }).then(function(json) {
          json.forEach(video => {
            const templateStr = document.getElementById('template-video').innerHTML;
            const newVideo = Mustache.render(templateStr, video);
            const elem = document.createElement('div');
            elem.setAttribute('id',video.videoId);
            elem.classList.add('video-card');
            elem.innerHTML = newVideo;
            document.getElementById('feed').appendChild(elem);
          });

        });
    });
  },

  vote: (videoId, voteType) => {
    console.log(videoId, voteType);
    user.getIdToken().then((auth_token) => {
      fetch('/api/vote', {
        method: 'PUT',
        headers: {'Authorization': 'Bearer ' + auth_token, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          "videoId": videoId,
          "like": voteType=='like',
          "love": voteType=='love',
          "happy": voteType=='happy',
          "dislike": voteType=='dislike'
        })
      }).then((response) => {
        return response.json();
      }).then(function(video) {
        const templateStr = document.getElementById('template-video').innerHTML;
        const newVideo = Mustache.render(templateStr, video);
        document.getElementById(video.videoId).innerHTML = newVideo;
      })
    });
  }

};