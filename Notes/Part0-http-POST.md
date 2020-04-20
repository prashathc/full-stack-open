### Forms and HTTP POST
  - When the submit button on the form is clicked, the browser will send the user input to the server
  - The submit event looks like this

```HTTP
Request URL:https://fullstack-exampleapp.herokuapp.com/new_note
Request Method:POST
Remote Address:54.174.159.234:443
Status Code:302
Version:HTTP/1.1
Referrer Policy:no-referrer-when-downgrade
```

    - It is an HTTP POST request to the server address new_note. 
    - The server responds with HTTP status code 302. 
    - This is a URL redirect, with which the server asks the browser to do a new HTTP GET request to the address defined in the header's Location - the address notes.
    - So, the browser reloads the Notes page. 
    - The reload causes three more HTTP requests: fetching the style sheet (main.css), the JavaScript code (main.js), and the raw data of the notes (data.json). 
    - The Form tag has attributes action and method, which define that submitting the form is done as an HTTP POST request to the address new_note. 

```HTML
<form action="/new_note" method="POST">
  <input type="text" name="note"><br>
  <input type="submit" value="Save">
</form>
```
    - The code on the server responsible for the POST request is simple (NB: this code is on the server, and not on the JavaScript code fetched by the browser):

```javascript
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  })

  return res.redirect('/notes')
})
```
    - This works because Data is sent as the body of the POST-request
    - Hence the server can access it by using the `req.body` field of the request object called `req`
    - The server then creates a new note object and adds it to an array called notes 

    - Following from Part0-http-GET, here is the JS that is fetched from the server that triggers a re-render when /notes is updated

```javascript
var xhttp = new XMLHttpRequest()
  
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note){
      var li = document.createElement('li')
      
      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById("notes").appendChild(ul)
  }
}

xhttp.open("GET", "/data.json", true)
xhttp.send()
```

### Significance of AJAX
- Allows fetching of content using JS included within the HTML
- No longer need to refresh the page everytime we have an update
- No longer have all the content being served by the server

### Single Page Apps
In recent years, the Single-page application (SPA) style of creating web-applications has emerged. 
- SPA style websites don't fetch all of their pages separately from the server like our sample application does
- Instead comprises of only one HTML page fetched from the server, the contents of which are manipulated with JavaScript that executes in the browser.


### Traditional vs SPA
-The Notes page of our application bears some resemblance to SPA-style apps, but it's not quite there yet. 
- Even though the logic for rendering the notes is run on the browser, the page still uses the traditional way of adding new notes. 
- The data is sent to the server with form submit, and the server instructs the browser to reload the Notes page with a redirect.

### SPA at https://fullstack-exampleapp.herokuapp.com/spa
- The form has no action or method attributes to define how and where to send the input data.

```html 
 <form id="notes_form" _lpchecked="1">
      <input type="text" name="note"><br>
      <input type="submit" value="Save">
</form>
```
- Open the Network-tab and empty it by clicking the ∅ symbol. When you now create a new note, you'll notice that the browser sends only one request to the server. 
- The POST request to the address new_note_spa contains the new note as JSON-data containing both the content of the note (content) and the timestamp (date)
- The Content-Type header of the request tells the server, that the included data is represented in the JSON format.
- Without this header, the server would not know how to correctly parse the data.

```HTTP
Request URL:https://fullstack-exampleapp.herokuapp.com/new_note_spa
Request Method:POST
Remote Address:34.192.12.194:443
Status Code:201
Version:HTTP/1.1
Referrer Policy:no-referrer-when-downgrade
Content-type: application/json
```

- The server responds with statuscode 201 created. This time the server does not ask for a redirect, the browser stays on the same page, and it sends no further HTTP-requests.
- The SPA version of the app does not send the form data the traditional way, but instead uses the JavaScript code it fetched from the server.

```javascript
var form = document.getElementById('notes_form')
form.onsubmit = function(e) {
  e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  }

  notes.push(note)
  e.target.elements[0].value = ''
  redrawNotes()
  sendToServer(note)
}
```

- The command document.getElementById('notes_form') instructs the code to fetch the form-element from the page, and to register an event handler to handle the form submit event. 
- The event handler immediately calls the method e.preventDefault() to prevent the default handling of form submit. 
- The default method would send the data to server and cause a redirect, which we don't want to happen.
- Then the event handler creates a new note, adds it to the notes list with the command notes.push(note), rerenders the note list on the page and sends the new note to the server.
- The code for sending the note to the server is as follows: 

```javascript
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true)
  xhttpForPost.setRequestHeader(
    'Content-type', 'application/json'
  )
  xhttpForPost.send(JSON.stringify(note))
}
```

- The code determines that the data is to be sent with an HTTP POST request and the data type is to be JSON. 
- The data type is determined with a Content-type header. Then the data is sent as JSON-string. 