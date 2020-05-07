### Component
- The file index.js defines a React-component with the name App
- This line:

```javascript  
ReactDOM.render(<App />, document.getElementById('root'))
```
- Renders the "App" component, in the public/index.html file, into an empty div with the ID of 'root'


So a component looks like this:

```javascript   
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

- All this is, is a JavaScript function, it's no different than this:

```javascript

() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

- Because the function consists of only a single expression we have used a shorthand, which represents this piece of code:

```javascript

const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

-Any JavaScript code within the curly braces is evaluated and the result of this evaluation is embedded into the defined place in the HTML produced by the component.

### JSX
- After compiling our JSX it really looks like this in regular JS:

```javascript   

import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)
```

- The compiling is done through Babel, which is automatically configured by create-react-app

### Muiltiple Components

```javascript

const Hello = () => {  
    return (    
        <div>      
            <p>Hello world</p>    
        </div>  
    )
}

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      <Hello />      
      <Hello />    
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

### props: passing data to components

- It is possible to pass data to components using so called props.

```javascript   

const Hello = (props) => {  
    return (
        <div>
            <p>Hello {props.name}</>    
        </div>
  )
}
```

-Now the function defining the component has a parameter props. 
- As an argument, the parameter receives an object, which has fields corresponding to all the "props" the user of the component defines.
- The props are defined like this:

```javascript

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="George" />      
      <Hello name="Daisy" />    
    </div>
  )
}
```

- *IMPORTANT* side note: React component names must be capitalized. 