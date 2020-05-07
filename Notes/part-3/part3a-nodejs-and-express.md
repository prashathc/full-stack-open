### Node.js and Express

- In this part our focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack.

- We will be building our backend on top of NodeJS, which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.

- As mentioned in part 1, browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be transpiled with e.g. babel. 
- The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.

- Our goal is to implement a backend that will work with the notes application from part 2. However, let's start with the basics by implementing a classic "hello world" application.

- Notice that the applications and exercises in this part are not all React applications, and we will not use the create-react-app utility for initializing the project for this application.

- We had already mentioned npm back in part 2, which is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.

- Let's navigate to an appropriate directory, and create a new template for our application with the npm init command. 
- We will answer the questions presented by the utility, and the result will be an automatically generated package.json file at the root of the project, that contains information about the project.

```javascript

{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```

- The file defines, for instance, that the entry point of the application is the index.js file.
- Let's make a small change to the scripts object:

```javascript

{
  // ...
  "scripts": {
    "start": "node index.js",    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

- Next, let's create the first version of our application by adding an index.js file to the root of the project with the following code:

`console.log('hello world')`

- We can run the program directly with Node from the command line:

`node index.js` 

- Or, we can run it as an npm script:

`npm start`

- The start npm script works because we defined it in the package.json file:

```javascript

{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

- Even though the execution of the project works when it is started by calling node index.js from the command line, it's customary for npm projects to execute such tasks as npm scripts.

- By default the package.json file also defines another commonly used npm script called npm test. Since our project does not yet have a testing library, the npm test command simply executes the following command:

`echo "Error: no test specified" && exit 1`

### Simple web server

- Let's change the application into a web server:

```javascript

const http = require('http')

const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World')
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
```

- Once the application is running, the following message is printed in the console:

`Server running on port 3001`

- We can open our humble application in the browser by visiting the address http://localhost:3001:
- In fact, the server works the same way regardless of the latter part of the URL. Also the address http://localhost:3001/foo/bar will display the same content.

- NB if the port 3001 is already in use by some other application, then starting the server will result in the following error message:

```javascript

hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```

-You have two options. Either shutdown the application using the port 3001 (the json-server in the last part of the material was using the port 3001), or use a different port for this application.

- Let's take a closer look at the first line of the code:

`const http = require('http')`

- In the first row, the application imports Node's built-in web server module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:

`import http from 'http'`

- These days, code that runs in the browser uses ES6 modules. Modules are defined with an export and taken into use with an import.
-However, Node.js uses so-called CommonJS modules. 
- The reason for this is that the Node ecosystem had a need for modules long before JavaScript supported them in the language specification. At the time of writing this material, Node does not support ES6 modules, but support for them is coming somewhere down the road.

- CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned.

- The next chunk in our code looks like this:

```javascript

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

- The code uses the createServer method of the http module to create a new web server. 
- An event handler is registered to the server, that is called every time an HTTP request is made to the server's address http:/localhost:3001.

- The request is responded to with the status code 200, with the Content-Type header set to text/plain, and the content of the site to be returned set to Hello World.

- The last rows bind the http server assigned to the app variable, to listen to HTTP requests sent to the port 3001:

```javascript

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

- The primary purpose of the backend server in this course is to offer raw data in the JSON format to the frontend. 
- For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:

```javascript

const http = require('http')

let notes = [  
    {    
        id: 1,    
        content: "HTML is easy",    
        date: "2019-05-30T17:30:31.098Z",    
        important: true  
    },  
    {    
        id: 2,    
        content: "Browser can execute only Javascript",    
        date: "2019-05-30T18:39:34.091Z",    
        important: false  
    },
    {    
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        date: "2019-05-30T19:20:14.298Z",    
        important: true  
    }
]

const app = http.createServer((request, response) => {  
    response.writeHead(200, { 'Content-Type': 'application/json' })  response.end(JSON.stringify(notes))
})


const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
```

- Let's restart the server (you can shut the server down by pressing Ctrl+C in the console) and let's refresh the browser.

- The application/json value in the Content-Type header informs the receiver that the data is in the JSON format. The notes array gets transformed into JSON with the JSON.stringify(notes) method.

- When we open the browser, the displayed format is exactly the same as in part 2 where we used json-server to serve the list of notes

### Express

- Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.

- Many libraries have been developed to ease server side development with Node, by offering a more pleasing interface to work with than the built-in http module. By far the most popular library intended for this purpose is express.

- Let's take express into use by defining it as a project dependency with the command:

`npm install express --save`

- The dependency is also added to our package.json file:

```javascript

{
  // ...
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

- The source code for the dependency is installed to the node_modules directory located in the root of the project. 
- In addition to express, you can find a great amount of other dependencies in the directory:
- These are in fact the dependencies of the express library, and the dependencies of all of its dependencies, and so forth. 
- *These are called the transitive dependencies of our project.*

-The version 4.17.1. of express was installed in our project. What does the caret in front of the version number in package.json mean?

`"express": "^4.17.1"`

- The caret in the front of ^4.17.1 means, that if and when the dependencies of a project are updated, the version of express that is installed will be at least 4.17.1. 
- However, the installed version of express can also be one that has a larger patch number (the last number), or a larger minor number (the middle number). The major version of the library indicated by the first major number must be the same.

- We can update the dependencies of the project with the command:

`npm update`

- Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json with the command:

`npm install`

- If the major number of a dependency does not change, then the newer versions should be backwards compatible. 
- This means that if our application happened to use version 4.99.175 of express in the future, then all the code implemented in this part would still have to work without making changes to the code. 
- In contrast, the future 5.0.0. version of express may contain changes, that would cause our application to no longer work.

### Web and Express

- Let's get back to our application and make the following changes:

```javascript

const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- In order to get the new version of our application into use, we have to restart the application.

- The application did not change a whole lot. Right at the beginning of our code we're importing express, which this time is a function that is used to create an express application stored in the app variable:

```javascript

const express = require('express')
const app = express()
```

- Next, we define two routes to the application. The first one defines an event handler, that is used to handle HTTP GET requests made to the application's / root:

```javascript

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
```

- The event handler function accepts two parameters. The first request parameter contains all of the information of the HTTP request, and the second response parameter is used to define how the request is responded to.

- In our code, the request is answered by using the send method of the response object. 
- Calling the method makes the server respond to the HTTP request by sending a response containing the string <h1>Hello World!</h1>, that was passed to the send method. 
- Since the parameter is a string, express automatically sets the value of the Content-Type header to be text/html. The status code of the response defaults to 200.
- We can verify this from the Network tab in developer tools:

- The second route defines an event handler, that handles HTTP GET requests made to the notes path of the application:

```javascript
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
```

- The request is responded to with the json method of the response object. 
- Calling the method will send the notes array that was passed to it as a JSON formatted string. 
- Express automatically sets the Content-Type header with the appropriate value of application/json.

- Next, let's take a quick look at the data sent in the JSON format.
- In the earlier version where we were only using Node, we had to transform the data into the JSON format with the JSON.stringify method:

`response.end(JSON.stringify(notes))`

- With express, this is no longer required, because this transformation happens automatically.
- It's worth noting, that JSON is a string, and not a JavaScript object like the value assigned to notes.

### nodemon

- If we make changes to the application's code we have to restart the application in order to see the changes. 
- We restart the application by first shutting it down by typing Ctrl+C and then restarting the application. 
- Compared to the convenient workflow in React where the browser 
automatically reloaded after changes were made, this feels slightly cumbersome.

- The solution to this problem is nodemon: 
*nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.*

- Let's install nodemon by defining it as a development dependency with the command:

`npm install --save-dev nodemon`

- The contents of package.json have also changed:

```javascript
{
  //...
  "dependencies": {
    "express": "^4.17.1",
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```

- If you accidentally used the wrong command and the nodemon dependency was added under "dependencies" instead of "devDependencies", then manually change the contents of package.json to match what is shown above.

- By development dependencies, we are referring to tools that are needed only during the development of the application, e.g. for testing or automatically restarting the application, like nodemon.

- These development dependencies are not needed when the application is run in production mode on the production server (e.g. Heroku).

- We can start our application with nodemon like this:

`node_modules/.bin/nodemon index.js`

- Changes to the application code now causes the server to restart automatically. 
- It's worth noting, that even though the backend server restarts automatically, the browser still has to be manually refreshed. 
- This is because unlike when working in React, we could not even have the hot reload functionality needed to automatically reload the browser.

- The command is long and quite unpleasant, so let's define a dedicated npm script for it in the package.json file:

```javascript

{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

- In the script there is no need to specify the node_modules/.bin/nodemon path to nodemon, because npm automatically knows to search for the file from that directory. 

- We can now start the server in the development mode with the command:

`npm run dev`

- Unlike with the start and test scripts, we also have to add run to the command.

### REST

- Let's expand our application so that it provides the RESTful HTTP API as json-server.

- Representational State Transfer, aka. REST was introduced in 2000 in Roy Fielding's dissertation. REST is an architectural style meant for building scalable web applications.

- We are not going to dig into Fielding's definition of REST or spend time pondering about what is and isn't RESTful. Instead, we take a more narrow view by only concerning ourselves with how RESTful API's are typically understood in web applications. The original definition of REST is in fact not even limited to web applications.

- We mentioned in the previous part that singular things, like notes in the case of our application, are called resources in RESTful thinking. Every resource has an associated URL which is the resource's unique address.

- One convention is to create the unique address for resources by combining the name of the resource type with the resource's unique identifier.

- Let's assume that the root URL of our service is www.example.com/api.
  - If we define the resource type of notes to be note, then the address of a note resource with the identifier 10, has the unique address www.example.com/api/notes/10.
  - The URL for the entire collection of all note resources is www.example.com/api/notes.

- We can execute different operations on resources. The operation to be executed is defined by the HTTP verb:


```javascript
URL 	        verb 	  functionality
notes/10    	GET 	  fetches a single resource
notes 	      GET 	  fetches all resources in the collection
notes 	      POST 	  creates a new resource based on the request data
notes/10 	    DELETE  removes the identified resource

notes/10 	    PUT 	  replaces the entire identified resource w/ the request 

notes/10 	    PATCH 	replaces a part of the identified resource w/ the request data
```

- This is how we manage to roughly define what REST refers to as a uniform interface, which means a consistent way of defining interfaces that makes it possible for systems to co-operate.

- This way of interpreting REST falls under the second level of RESTful maturity in the Richardson Maturity Model. 
  - According to the definition provided by Roy Fielding, we have not actually defined a REST API. 
  - In fact, a large majority of the world's purported "REST" API's do not meet Fielding's original criteria outlined in his dissertation.

- In some places (see e.g. Richardson, Ruby: RESTful Web Services) you will see our model for a straightforward CRUD API, being referred to as an example of resource oriented architecture instead of REST. 
- We will avoid getting stuck arguing semantics and instead return to working on our application.

### Fetching a single resource

- Let's expand our application so that it offers a REST interface for operating on individual notes. First let's create a route for fetching a single resource.

- The unique address we will use for an individual note is of the form notes/10, where the number at the end refers to the note's unique id number.

- We can define parameters for routes in express by using the colon syntax:

```javascript

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

- Now app.get('/api/notes/:id', ...) will handle all HTTP GET requests, that are of the form /api/notes/SOMETHING, where SOMETHING is an arbitrary string.

- The id parameter in the route of a request, can be accessed through the request object:

`const id = request.params.id`

- The now familiar `find` method of arrays is used to find the note with an id that matches the parameter. 
- The note is then returned to the sender of the request.

- When we test our application by going to http://localhost:3001/api/notes/1 in our browser, we notice that it does not appear to work, as the browser displays an empty page. 
- This comes as no surprise to us as software developers, and it's time to debug.

- Adding console.log commands into our code is a time-proven trick:

```javascript

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  response.json(note)
})
```

- When we visit http://localhost:3001/api/notes/1 again in the browser, the console which is the terminal in this case, will display the following:

- The id parameter from the route is passed to our application but the find method does not find a matching note.

- To further our investigation, we also add a console log inside the comparison function passed to the find method. 
- In order to do this, we have to get rid of the compact arrow function syntax note => note.id === id, and use the syntax with an explicit return statement:

```javascript

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```

- When we visit the URL again in the browser, each call to the comparison function prints a few different things to the console. The console output is the following:

```
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
```

- The cause of the bug becomes clear. The id variable contains a string '1', whereas the id's of notes are integers. 
- In JavaScript, the "triple equals" comparison === considers all values of different types to not be equal by default, meaning that 1 is not '1'. 

- Let's fix the issue by changing the id parameter from a string into a number:

```javascript

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

- Now fetching an individual resource works.
- However, there's another problem with our application.
- If we search for a note with an id that does not exist, the server responds with:


- The HTTP status code that is returned is 200, which means that the response succeeded. 
- There is no data sent back with the response, since the value of the content-length header is 0, and the same can be verified from the browser. 

- The reason for this behavior is that the note variable is set to undefined if no matching note is found. 
- The situation needs to be handled on the server in a better way. 
- If no note is found, the server should respond with the status code 404 not found instead of 200.

- Let's make the following change to our code:

```javascript

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {    
    response.json(note)  
  } else {    
    response.status(404).end()  
    }
  })
```

- Since no data is attached to the response, we use the status method for setting the status, and the end method for responding to the request without sending any data.

- The if-condition leverages the fact that all JavaScript objects are truthy, meaning that they evaluate to true in a comparison operation. However, undefined is falsy meaning that it will evaluate to false.

- Our application works and sends the error status code if no note is found. - However, the application doesn't return anything to show to the user, like web applications normally do when we visit a page that does not exist. 
- We do not actually need to display anything in the browser because REST API's are interfaces that are intended for programmatic use, and the error status code is all that is needed.



### Deleting Resources

- Next let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the url of the resource:

```javascript

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

- If deleting the resource is successful, meaning that the note exists and it is removed, we respond to the request with the status code 204 no content and return no data with the response.
- There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. Really, the only two options are 204 and 404. For the sake of simplicity our application will respond with 204 in both cases.

### Postman

- So how do we test the delete operation? HTTP GET requests are easy to make from the browser. We could write some JavaScript for testing deletion, but writing test code is not always the best solution in every situation.

- Many tools exist for making the testing of backends easier. One of these is the command line program curl that was mentioned briefly in the previous part of the material.

- Instead of curl, we will take a look at using Postman for testing the application.

- Using Postman is quite easy in this situation. It's enough to define the url and then select the correct request type (DELETE).

- The backend server appears to respond correctly. By making an HTTP GET request to http://localhost:3001/api/notes we see that the note with the id 2 is no longer in the list, which indicates that the deletion was successful. 
- Because the notes in the application are only saved to memory, the list of notes will return to its original state when we restart the application.

### The Visual Studio Code REST client

- If you use Visual Studio Code, you can use the VS Code REST client plugin instead of Postman.
- Once the plugin is installed, using it is very simple. We make a directory at the root of application named requests. We save all the REST client requests in the directory as files that end with the .rest extension.

- Let's create a new get_all_notes.rest file and define the request that fetches all notes.

`GET http://localhost:3001/api/notes`

- By clicking the Send Request text, the REST client will execute the HTTP request and response from the server is opened in the editor.

### Receiving data

- Next, let's make it possible to add new notes to the server. 
- Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in the JSON format.

- In order to access the data easily, we need the help of the express json-parser, that is taken to use with command app.use(express.json()).

-  Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

```javascript

const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
```

- The event handler function can access the data from the body property of the request object.

- Without the json-parser, the body property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object before the route handler is called.

- For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.

- Before we implement the rest of the application logic, let's verify with Postman that the data is actually received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the body:

```javascript
{
  "content": "Postman is a good tool for testing REST apis",
  "important": true
}
```

- The application prints the data that we sent in the request to the console:
- NB Keep the terminal running the application visible at all times when you are working on the backend. 
- Thanks to Nodemon any changes we make to the code will restart the application. If you pay attention to the console, you will immediately be able to pick up on errors that occur in the application:

- Similarly, it is useful to check the console for making sure that the backend behaves like we expect it to in different situations, like when we send data with an HTTP POST request. 
- Naturally, it's a good idea to add lots of console.log commands to the code while the application is still being developed.

- A potential cause for issues is an incorrectly set Content-Type header in requests. This can happen with Postman if the type of body is not defined correctly:

- The Content-Type header is set to text/plain:
- The server appears to only receive an empty object:

- The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data, since there's a massive amount of potential Content-Types.
- If you are using VS Code, then you should install the REST client from the previous chapter now, if you haven't already. The POST request can be sent with the REST client like this:

```javascript

POST http://localhost:3001/api/notes
Content-Type: application/json

{
  "content": "VS Code REST client is pretty good",
  "important": false
}
```

- We created a new create_note.rest file for the request. The request is formatted according to the instructions in the documentation.

- One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. 
  - Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects.

Sidenote:

- Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. 
- One way of accomplishing this is through the get method of the request object, that can be used for getting the value of a single header. The request object also has the headers property, that contains all of the headers of a specific request.

- Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.

- You will be able to spot this missing Content-Type header if at some point in your code you print all of the request headers with the console.log(request.headers) command.

- Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request:

```javascript

app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = request.body
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```

- We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the maxId variable. The id of the new note is then defined as maxId + 1. 
- This method is in fact not recommended, but we will live with it for now as we will replace it soon enough.

- The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. 
- Let's improve the application by defining that the content property may not be empty. The important and date properties will be given default values. All other properties are discarded:

```javascript

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

- The logic for generating the new id number for notes has been extracted into a separate generateId function.

- If the received data is missing a value for the content property, the server will respond to the request with the status code 400 bad request:

```javascript

if (!body.content) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}
```

- Notice that calling return is crucial, because otherwise the code will execute to the very end and the malformed note gets saved to the application.

- If the content property has a value, the note will be based on the received data. 
- As mentioned previously, it is better to generate timestamps on the server than in the browser, since we can't trust that host machine running the browser has its clock set correctly. 
- The generation of the date property is now done by the server.

- If the important property is missing, we will default the value to false. The default value is currently generated in a rather odd-looking way:

`important: body.important || false,`

- If the data saved in the body variable has the important property, the expression will evaluate to its value. 
- If the property does not exist, then the expression will evaluate to false which is defined on the right-hand side of the vertical lines.

### generating IDs function

- The function for generating IDs looks currently like this:

```javascript

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
```

- The function body contains a row that looks a bit intriguing:

`Math.max(...notes.map(n => n.id))`

- What exactly is happening in that line of code? notes.map(n => n.id) creates a new array that contains all the id's of the notes. 
- Math.max returns the maximum value of the numbers that are passed to it. 
- However, notes.map(n => n.id) is an array so it can't directly be given as a parameter to Math.max. The array can be transformed into individual numbers by using the "three dot" spread syntax ....


### About HTTP request types

- The HTTP standard talks about two properties related to request types, safety and idempotence.
- The HTTP GET request should be safe:

*In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".*

- Safety means that the executing request must not cause any side effects in the server. 
- By side-effects we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.

-Nothing can ever guarantee that a GET request is actually safe, this is in fact just a recommendation that is defined in the HTTP standard. 
- By adhering to RESTful principles in our API, GET requests are in fact always used in a way that they are safe.

- The HTTP standard also defines the request type HEAD, that ought to be safe. 
- In practice HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.

- All HTTP requests except POST should be idempotent:

*Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property*

- This means that if a request has side-effects, then the result should be same regardless of how many times the request is sent.

- If we make an HTTP PUT request to the url /api/notes/10 and with the request we send the data { content: "no side effects!", important: true }, the result is the same regardless of many times the request is sent.

- If we make an HTTP PUT request to the url /api/notes/10 and with the request we send the data { content: "no side effects!", important: true }, the result is the same regardless of many times the request is sent.

- Like safety for the GET request, idempotence is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.

- POST is the only HTTP request type that is neither safe nor idempotent. If we send 5 different HTTP POST requests to /api/notes with a body of {content: "many same", important: true}, the resulting 5 notes on the server will all have the same content.

### Middleware 

- The express json-parser we took into use earlier is a so-called middleware.

- Middleware are functions that can be used for handling request and response objects.

- The json-parser we used earlier takes the raw data from the requests that's stored in the request object, parses it into a JavaScript object and assigns it to the request object as a new property body.

- Let's implement our own middleware that prints information about every request that is sent to the server.

- Middleware is a function that receives three parameters:

```javascript
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

- At the end of the function body the next function that was passed as a parameter is called. The next function yields control to the next middleware.

- Middleware are taken into use like this:

`app.use(requestLogger)`

- Middleware functions are called in the order that they're taken into use with the express server object's use method. 
- Notice that json-parser is taken into use before the requestLogger  middleware, because otherwise request.body will not be initialized when the logger is executed!

- Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. 
  - There are also situations where we want to define middleware functions after routes. 
  - In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.

- Let's add the following middleware after our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

```javascript

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```