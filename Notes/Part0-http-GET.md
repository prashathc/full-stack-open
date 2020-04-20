## The server and the web browser communicate with each other using the HTTP protocol. The Network tab shows how the browser and the server communicate.

- There are often several headers
- Headers give information like:
    1. Size of response in bytes
    2. Content-type
    3. Response data etc

- @ https://fullstack-exampleapp.herokuapp.com/ 
    - you can see, the client (browser) makes a request to the server at the requiest URL: https://fullstack-exampleapp.herokuapp.com/
    - the request method is GET
    - the status code sent by the serer is 200 
- Respone Headers @ https://fullstack-exampleapp.herokuapp.com/ 
    - one of the important response hedaers is "Content-Type"
    - in this case, "Content-Type" tells us the response is a "text-file in utf-8-format" and the contents of it have been formatted to HTML
    - this way, the browser knows to expect an HTML page and to render it as an HTML page
- In the response HTML, there is an image
    - this triggers an additional HTTP-request to fetch "kuva.png" from the server
    - Request URL:https://fullstack-exampleapp.herokuapp.com/kuva.png
    - Request Method:GET
    - Remote Address:3.216.129.32:443
    - Status Code: 200

### Order of operations for example page @ https://fullstack-exampleapp.herokuapp.com/
    1. the browser does a HTTP GET request to the server to fetch the HTML code of the page.
    2. The img tag in the HTML prompts the browser to fetch the image kuva.png.
    3. The browser renders the HTML page and the image to the screen. 

### This page works like a Traditional Web App
    - The homepage of the example application works like a traditional web application. 
    - When entering the page, the browser fetches the HTML document detailing the structure and the textual content of the page from the server.
    - The server has formed this document somehow. 
    - The document can be a static text file saved into the server's directory. 
    - The server can also form the HTML documents dynamically according to the application code, using, for example, data from a database. 
    - The HTML code of the example application has been formed dynamically, because it contains information on the number of created notes. 
Here is the code on the server that generated this HTML page
```javascript

const getFrontPageHtml = (noteCount) => {
  return(`
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`)
} 

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})

```

### Traditional Web Apps
- In traditional web applications the browser is "dumb". 
- It only fetches HTML data from the server, and all application logic is on the server. 
- A server can be created, for example, using Java Spring, Python Flask or with Ruby on Rails.

### Understaind the events @ https://fullstack-exampleapp.herokuapp.com/notes
1. The browser makes a GET request https://fullstack-exampleapp.herokuapp.com/notes
2. That response serves up an HTML file, which looks like

```HTML

<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/main.css" />
  <script type="text/javascript" src="main.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Notes</h1>
    <div id='notes'>
    </div>
    <form action='/new_note' method='POST'>
      <input type="text" name="note"><br>
      <input type="submit" value="Save">
    </form>
  </div>
</body>
</html>

```

3. As you can see, there is a link and script tag in the haed
4. This triggers two more HTTP Get Request for a `main.css` and `main.js` file
5. The css file is straight forward but the main.js file has code for an old school XML request that looks like

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
6. Next, the browser executes the JS file which will trigger an HTTP GET request to the address https://fullstack-exampleapp.herokuapp.com/data.json, which returns the notes as JSON data. 
7. The fetching of the notes, evokes the event handler "onreadystatechange" which will cause the function to run and render all the notes in that data.json file

### Order of operations on page @ https://fullstack-exampleapp.herokuapp.com/notes
    1. The browser fetches the HTML code defining the content and the structure of the page from the server using an HTTP GET request.
    2. Links in the HTML code cause the browser to also fetch the CSS style sheet main.css and a JavaScript code file main.js
    3. The browser executes the JavaScript code. 
    4. The code makes an HTTP GET request to the address https://fullstack-exampleapp.herokuapp.com/data.json, which returns the notes as JSON data.
    5. When the data has been fetched, the browser executes an event handler, which renders the notes to the page using the DOM-API.

