### Getting data from server

- Data being fetched via XHR is outdated.

```javascript
//OUDATED
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

- Right at the beginning we register an event handler to the xhttp object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the xhttp object changes. 
- If the change in state means that the response to the request has arrived, then the data is handled accordingly.

- It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. 
- Therefore, the code does not execute synchronously "from top to bottom", but does so asynchronously. 
- JavaScript calls the event handler that was registered for the request at some point.

#### Synchronous Java Code

- A synchronous way of making requests that's common in Java programming, for instance, would play out as follows (NB this is not actually working Java code):

```java

HTTPRequest request = new HTTPRequest();

String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

- In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command request.get(...) to finish. 
- The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.

### Asynchronous JavaScript

- On the other hand, JavaScript engines, or runtime environments, follow the asynchronous model. 
- In principle, this requires all IO-operations (with some exceptions) to be executed as non-blocking. 
- This means that the code execution continues immediately after calling an IO function, without waiting for it to return.

- When an asynchronous operation is completed, or more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

- Currently, JavaScript engines are single-threaded, which means that they cannot execute code in parallel. 
- As a result, it is a requirement in practise to use a non-blocking model for executing IO operations. 
- Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.
- Another consequence of this single threaded nature of Javascript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. 

If we added the following code at the top of our application:

```javascript

setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000)
```

- everything would work normally for 5 seconds. 
- However, when the function defined as the parameter for setTimeout is run, the browser will be stuck for the duration of the execution of the long loop. 
- Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome.

- For the browser to remain responsive, i.e. to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.

- In today's browsers, it is possible to run parallelized code with the help of so-called web workers. The event loop of an individual browser window is, however, still only handled by a single thread.

### npm

- We could use the previously mentioned promise based function fetch to pull the data from the server. 
- Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE).

- That being said, we will be using the axios library instead for communication between the browser and server. It functions like fetch, but is somewhat more pleasant to use. 

- Nowadays, practically all JavaScript projects are defined using the node package manager, aka npm. 
- The projects created using create-react-app also follow the npm format. 
- A clear indicator that a project uses npm is the package.json file located at the root of the project:

- In the package.json file you will find many properties inluciding dependencies:  
    - At this point the dependencies part is of most interest to us as it defines what dependencies, or external libraries, the project has.

- We now want to use axios. Theoretically, we could define the library directly in the package.json file, but it is better to install it from the command line.

`npm install axios --save`

- NB npm-commands should always be run in the project root directory, which is where the package.json file can be found.

- We used the command npm install twice, but with slight differences:

```
npm install axios --save
npm install json-server --save-dev
```

- There is a fine difference in the parameters. axios is installed as a runtime dependency (--save) of the application, because the execution of the program requires the existence of the library. 
- On the other hand, json-server was installed as a development dependency (--save-dev), since the program itself doesn't require it. 
- It is used for assistance during software development. There will be more on different dependencies in the next part of the course.


### Axios and promises

- Now we are ready to use axios. Going forward, json-server is assumed to be running on port 3001.
- The library can be brought into use the same way other libraries, e.g. React, are, i.e. by using an appropriate import statement.

```javascript

import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

- Axios' method get returns a promise.

- The documentation on Mozilla's site states the following about promises:
  *A Promise is an object representing the eventual completion or failure of an asynchronous operation.*

  - In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

  1. The promise is pending: It means that the final value (one of the following two) is not available yet.

  2. The promise is fulfilled: It means that the operation has completed and the final value is available, which generally is a successful operation. This state is sometimes also called resolved.

  3. The promise is rejected: It means that an error prevented the final value from being determined, which generally represents a failed operation.

- The first promise in our example is fulfilled, representing a successful axios.get('http://localhost:3001/notes') request. 
- The second one, however, is rejected, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

- If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. 
- This is achieved using the method then:

```javascript
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```

- The Javascript runtime environment calls the callback function registered by the then method providing it with a response object as a parameter. 
- The response object contains all the essential data related to the response of an HTTP GET request, which would include the returned data, status code, and headers.

- Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the then method call to the axios method call, so that it follows it directly:

```javascript

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```

- The callback function now takes the data contained within the response, stores it in a variable and prints the notes to the console.
- A more readable way to format chained method calls is to place each call on its own line:

```javascript

axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

- The data returned by the server is plain text, basically just one long string. 
- The axios library is still able to parse the data into a Javascript array, since the server has specified that the data format is application/json; charset=utf-8 (see previous image) using the content-type header.
- We can finally begin using the data fetched from the server.

- Let's do it "poorly" first by putting the App component representing the application inside the callback function. This is done by changing index.js to the following form:

```javascript

// POOR method

import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'

import axios from 'axios'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
  )
})
```

- This method could be acceptable in some circumstances, but it's somewhat problematic. 
- Let's instead move the fetching of the data into the App component.

- What's not immediately obvious, however, is where the command axios.get should be placed within the component.

### Effect-hooks

- We have already used state hooks that were introduced along with React version 16.8.0, which provide state to React components defined as functions. Version 16.8.0 also introduces the effect hooks as a new feature. In the words of the docs:

  *The Effect Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.*

- As such, effect hooks are precisely the right tool to use when fetching data from a server.
- Let's remove the fetching of data from index.js. There is no longer a need to pass data as props to the App component. So index.js simplifies to:

`ReactDOM.render(<App />, document.getElementById('root'))`

- Tue App component changes as follows:

```javascript

import React, { useState, useEffect } from 'react'import axios from 'axios'import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {    
    console.log('effect')    
    axios      
      .get('http://localhost:3001/notes')      
      .then(response => {        
        console.log('promise fulfilled')        
        setNotes(response.data)      
        })  
  }, [])  
  console.log('render', notes.length, 'notes')
    // ...
}
```