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

- 