### Forms

- In order to get our page to update when new notes are added it's best to store the notes in the App component's state. 
- Let's import the useState function and use it to define a piece of state that gets initialized with the initial notes array passed in the props. 

```javascript

import React, { useState } from 'react'import Note from './components/Note'

const App = (props) => {  
    const [notes, setNotes] = useState(props.notes)

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

export default App 
```

- The component uses the useState function to initialize the piece of state stored in notes with the array of notes passed in the props:

```javascript

const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```

- If we wanted to start with an empty list of notes we would set the initial value as an empty array, and since the props would not then be used, we could omit the props parameter from the function definition:

```javascript
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```

- Next, let's add an HTML form to the component that will be used for adding new notes.

```javascript

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  const addNote = (event) => {    
      event.preventDefault()    
      console.log('button clicked', event.target)  
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>        
        <input />        
        <button type="submit">save</button>      
      </form>       
    </div>
  )
}
```

- We have added the addNote function as an event handler to the form element that will be called when the form is submitted by clicking the submit button.
- We use the method discussed in part 1 for defining our event handler:

```javascript

const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

- The event parameter is the event that triggers the call to the event handler function: 
- The event handler immediately calls the event.preventDefault() method, which prevents the default action of submitting a form. 
- The default action would, among other things, cause the page to reload.
- The target of the event stored in event.target is logged to the console
- The target in this case is the form that we have defined in our component.

How do we access the data contained in the form's input element?
- There are many ways to accomplish this; the first method we will take a look at is the use of so-called controlled components.
- Let's add a new piece of state called newNote for storing the user submitted input and let's set it as the input element's value attribute:

```javascript

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(    
      'a new note...'  
  )

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} />        
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```