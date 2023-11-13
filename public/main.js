var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    console.log(thumbUp)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })//connected with the app.put, which in turn dives into the db collection and parses through messages.
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true) //reloads the page which triggers our app.get
      })
  });
});

Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbDown': thumbDown
      })//connected with the app.put, which in turn dives into the db collection and parses through messages.
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true) //reloads the page which triggers our app.get
      })
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText//gonna grab the name next to the trash when click event fires.
    const msg = this.parentNode.parentNode.childNodes[3].innerText //gonna grab the msg next to the trash when click event fires.
    fetch('messages', {//sends info to back end, which will then delete the message with the appropriate name and msg variable values. Client side is doing the fetch and the server side is doing the CRUD-Delete.
      headers: {
        method: 'delete',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({//body getting sent with this fetch request to tell the server WHAT to delete.
        'name': name,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()//relaods the page which triggers our app.get!//
    })
  });
});
