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
        }).then(function(j) {
          j.forEach(video => {
            const templateStr = document.getElementById('template-video').innerHTML;
            const newVideo = Mustache.render(templateStr, video);
            const elem = document.createElement('div');
            elem.classList.add('video-card');
            elem.innerHTML = newVideo;
            document.getElementById('feed').appendChild(elem);
          });

        });
    });
  }

};