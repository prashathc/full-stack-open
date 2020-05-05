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