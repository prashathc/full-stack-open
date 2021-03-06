### Consloe.log

- What's the difference between an experienced JavaScript programmer and a rookie? 
- The experienced one uses console.log 10-100 times more.

- NB when you use the command console.log for debugging, don't concatenate things 'the Java way' with a plus. Instead of writing:

`console.log('props value is' + props)`

- separate the things to be printed with a comma:

`console.log('props value is', props)`

- If you concatenate an object with a string and log it to the console (like in our first example), the result will be pretty useless: 

`props value is [Object object]`

### Rendering collections

- We will now do the 'frontend', or the browser-side application logic, in React for an application that's similar to the example application from part 0

```javascript

import React from 'react'
import ReactDOM from 'react-dom'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

- Every note contains its textual content and a timestamp as well as a boolean value for marking whether the note has been categorized as important or not, and also a unique id.
- The code functions due to the fact that there are exactly three notes in the array. 
- A single note is rendered by accessing the objects in the array by referring to a hard-coded index number:

`<li>{note[1].content}</li>`

- This is, of course, not practical. The solution can be made general by generating React-elements from the array objects using the map function.

`notes.map(note => <li>{note.content}</li>)`

- The result is an array of li elements.

```javascript

[
  <li>HTML is easy</li>,
  <li>Browser can execute only Javascript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```

- Which can then be put inside ul tags:

```javascript

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>        
        {notes.map(note => <li>{note.content}</li>)}      
      </ul>    
    </div>
  )
}
```

- Because the code generating the li tags is JavaScript, it must be wrapped in curly braces in a JSX template just like all other JavaScript code.


### Key-attribute

- Even though the application seems to be working, there is a nasty warning in the console: 
'Warning: Each child in an ar ray should have a unique "key" prop'
- As the linked page in the error message instructs, the list items, i.e. the elements generated by the map method, must each have a unique key value: an attribute called key.
- Let's add keys

```javascript

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>            
            {note.content}          
          </li>        
        )}
      </ul>
    </div>
  )
}
```

- And the error message disappears. 
- React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered.


### Anti-pattern: array indexes as keys

- We could have made the error message on our console disappear by using the array indexes as keys. 
- The indexes can be retrieved by passing a second parameter to the callback function of the map-method: 

`notes.map((note, i) => ...)`

- When called like this, i is assigned the value of the index of the position in the array where the Note resides.
- As such, one way to define the row generation without getting errors is:

```javascript

<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

-This is, however, not recommended and can cause undesired problems even if it seems to be working just fine.  

### Refactoring Modules

- Let's tidy the code up a bit. We are only interested in the field notes of the props, so let's retrieve that directly using destructuring: 

```javascript

const App = ({ notes }) => {  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

- We'll separate displaying a single note into its own component Note: 

```javascript

const Note = ({ note }) => {  
    return (    
        <li>{note.content}</li>  
    )
}

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>           
            <Note key={note.id} note={note} />        
        )}      
      </ul>
    </div>
  )
}
```

- Note, that the key attribute must now be defined for the Note components, and not for the li tags like before. 
- A whole React application can be written in a single file. 
- Although that is, of course, not very practical. 
- Common practice is to declare each component in their own file as an ES6-module.
- We have been using modules the whole time. The first few lines of the file:

```javascript

import React from 'react'
import ReactDOM from 'react-dom'
```

- imports two modules, enabling them to be used in the code. 
- The react module is placed into a variable called React and react-dom to variable ReactDOM.
- Let's move our Note component into its own module. 
- In smaller applications, components are usually placed in a directory called components , which is in turn placed within the src directory. 
- The convention is to name the file after the component. 
- Now we'll create a directory called components for our application and place a file named Note.js inside. The contents of the Note.js file are as follows: 

```javascript

import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

- Because this is a React-component, we must import React.
- The last line of the module exports the declared module, the variable Note.
- Now the file using the component, index.js, can import the module: 

```javascript

import React from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note'

const App = ({ notes }) => {
  // ...
}
```

- App is a component as well, so let's declare it in its own module as well. 
- Since it is the root component of the application, we'll place it in the src directory. 
- The contents of the file are as follows: 

```javascript

import React from 'react'
import Note from './components/Note'

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App
```

- What's left in the index.js file is: 

```javascript

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const notes = [
  // ...
]

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```
