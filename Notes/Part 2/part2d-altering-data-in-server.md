### Altering data in server

- When creating notes in our application, we would naturally want to store them in some backend server. The json-server package claims to be a so-called REST or RESTful API in its documentation:
    *Get a full fake REST API with zero coding in less than 30 seconds (seriously)*

- The json-server does not exactly match the description provided by the textbook definition of a REST API, but neither do most other APIs claiming to be RESTful.

- We will take a closer look at REST in the next part of the course, but it's important to familiarize ourselves at this point with some of the conventions used by json-server and REST APIs in general. 
- In particular, we will be taking a look at the conventional use of routes, aka URLs and 
HTTP request types, in REST.

### REST

- In REST terminology, we refer to individual data objects, such as the notes in our application, as resources. 
- Every resource has a unique address associated with it - its URL. 
- According to a general convention used by json-server, we would be able to locate an individual note at the resource URL notes/3, where 3 is the id of the resource. 
- The notes url, on the other hand, would point to a resource collection containing all the notes.

- Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL notes/3 will return the note that has the id number 3. 
- An HTTP GET request to the notes URL would return a list of all notes.

- Creating a new resource for storing a note is done by making an HTTP POST request to the notes URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the body of the request.

- json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string, and that the request must contain the Content-Type request header with the value application/json.

### Sending Data to the Server

- Let's make the following changes to the event handler responsible for creating a new note:

```javascript

addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)    
    .then(response => {      
        console.log(response)    
    })
}
```

- We create a new object for the note but omit the id property, since it's better to let the server generate ids for our resources!
- The object is sent to the server using the axios post method. The registered event handler logs the response that is sent back from the server to the console.
-The newly created note resource is stored in the value of the data property of the response object.

- Sometimes it can be useful to inspect HTTP requests in the Network tab of Chrome developer tools, which was used heavily at the beginning of part 0:
- We can use the inspector to check that the headers sent in the POST request are what we expected them to be, and that their values are correct.
- Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate application/json value for the Content-Type header.


- The new note is not rendered to the screen yet. This is because we did not update the state of the App component when we created the new note. Let's fix this:

```javascript
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      setNotes(notes.concat(response.data))      
      setNewNote('')    
    })
}
```

- The new note returned by the backend server is added to the list of notes in our application's state in the customary way of using the setNotes function and then resetting the note creation form. 
- An important detail to remember is that the concat method does not change the component's original state, but instead creates a new copy of the list.


- Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. 
- This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important, and we must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won't be enough.

- It's beneficial to inspect the state of the backend server e.g. through the browser:

- This makes it possible to verify that all the data we intended to send was actually received by the server.

- In the next part of the course we will learn to implement our own logic in the backend. We will then take a closer look at tools like postman that help us to debug our server applications. However, inspecting the state of the json-server through the browser is sufficient for our current needs.
    - NB: In the current version of our application the browser adds the creation date 
    property to the note. Since the clock of the machine running the browser can be wrongly configured, it's much wiser to let the backend server generate this timestamp for us. This is in fact what we will do in the next part of the course.

