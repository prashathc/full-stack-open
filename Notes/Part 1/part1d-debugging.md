### Debugging React Applications

### The first rule of web development

- Keep the browser's developer console open at all times.
- The Console tab in particular should always be open, unless there is a specific reason to view another tab.
- Keep both your code and the web page open together at the same time, all the time.

- NB when you use console.log for debugging, don't combine objects in a Java-like fashion by using a plus. Instead of writing:


### Debugger

- Logging to the console is by no means the only way of debugging our applications. 
- You can pause the execution of your application code in the Chrome developer console's debugger, by writing the command debugger anywhere in your code.
- The execution will pause once it arrives at a point where the debugger command gets executed:
then
- By going to the Console tab, it is easy to inspect the current state of variables:
- Once the cause of the bug is discovered you can remove the debugger command and refresh the page.
- The debugger also enables us to execute our code line by line with the controls found in the right-hand side of the Source tab.
- You can also access the debugger without the debugger command by adding break points in the Sources tab. 
- Inspecting the values of the component's variables can be done in the Scope-section:

### React debugging tools 

- The new React developer tools tab can be used to inspect the different React elements in the application, along with their state and props.

### Rules of Hooks

- There are a few limitations and rules we have to follow to ensure that our application uses hooks-based state functions correctly.
- The useState function (as well as the useEffect function introduced later on in the course) must not be called from inside of a loop, a conditional expression, or any place that is not a function defining a component. - - This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.
- To recap, hooks may only be called from the inside of a function body that defines a React component:

```javascript   

const App = (props) => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
``

### Function that returns a function 

- Another way to define a event handler is to use function that returns a function.

```javascript   
const App = (props) => {
  const [value, setValue] = useState(10)

  const hello = () => {    
      const handler = () => console.log('hello world')    
      return handler  
  }

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

- The code functions correctly even though it looks complicated.
- The event handler is now set to a function call:

`<button onClick={hello()}>button</button>`

- Earlier on we stated that an event handler may not be a call to a function, and that it has to be a function or a reference to a function. 
- Why then does a function call work in this case?
- When the component is rendered, the following function gets executed:

```javascript

const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

- The return value of the function is another function that is assigned to the handler variable.
- When React renders the line:

`<button onClick={hello()}>button</button>`

- It assigns the return value of `hello()` to the onClick-attribute. Essentially the line gets transformed into:

```javascript

<button onClick={() => console.log('hello world')}>
  button
</button>
```

- Since the `hello` function returns a function, the event handler is now a function.
- What's the point of this concept?

```javascript

const App = (props) => {
  const [value, setValue] = useState(10)

  const hello = (who) => {    
      const handler = () => {      
          console.log('hello', who)    
      }    
      return handler  
  }

  return (
    <div>
      {value}
      <button onClick={hello('world')}>button</button>      
      <button onClick={hello('react')}>button</button>      
      <button onClick={hello('function')}>button</button>    
    </div>
  )
}
```

- Now the application has three buttons with event handlers defined by the hello function that accepts a parameter.
- The first button is defined as

`<button onClick={hello('world')}>button</button>`

- The event handler is created by executing the function call hello('world'). 
- The function call returns the function:

```javascript

() => {
  console.log('hello', 'world')
}
```
- Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. 
- The hello function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

REFACTORING:

- Our current definition is slightly verbose:
```javascript

const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

- Let's eliminate the helper variables and directly return the created function:

```javascript

const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Since our `hello` function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:

```javascript

const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

- Lastly, let's write all of the arrows on the same line:

```javascript

const hello = (who) => () => {
  console.log('hello', who)
}
```

- We can use the same trick to define event handlers that set the state of the component to a given value. 
- Let's make the following changes to our code:

```javascript

const App = (props) => {
  const [value, setValue] = useState(10)
  
  const setToValue = (newValue) => () => {setValue(newValue)}

  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>      
      <button onClick={setToValue(0)}>reset</button>      
      <button onClick={setToValue(value + 1)}>increment</button>    
    </div>
  )
}
```

- When the component is rendered, the thousand button is created:

`<button onClick={setToValue(1000)}>thousand</button>`

- The event handler is set to the return value of setToValue(1000) which is the following function:

```javascript

() => {
  setValue(1000)
}
```

- The row generated for the increase button is the following:

```javascript

<button onClick={setToValue(value + 1)}>increment</button>
```

- The event handler is created by the function call setToValue(value + 1) which receives as its parameter the current value of the state variable value increased by one. 
- If the value of value was 10, then the created event handler would be the function:

```javascript

() => {
  setValue(11)
}
```

- Using functions that return functions is not required to achieve this functionality.
- Let's return the setToValue function that is responsible for updating state, into a normal function:

```javascript

const App = (props) => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

- We can now define the event handler as a function that calls the setToValue function with an appropriate parameter. 
- The event handler for resetting the application state would be:

`<button onClick={() => setToValue(0)}>reset</button>`

- Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.



### Passing Event Handlers to Child Components

- Let's extract the button into its own component:

```javascript

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

- The component gets the event handler function from the `handleClick` prop, and the text of the button from the `text` prop.
- Using the Button component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.

```javascript
<Button handleClick={() => setToValue(1000)} text="thousand" />
<Button handleClick={() => setToValue(0)} text="reset" />
```

### Do Not Define Components Within Components

- Let's start displaying the value of the application into its own Display component.
- We will change the application by defining a new component inside of the App-component.

```javascript

// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = props => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div>
  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

- The application still appears to work, but don't implement components like this! 
- Never define components inside of other components. 
- The method provides no benefits and leads to many unpleasant problems. 
- Let's instead move the Display component function to its correct place, which is outside of the App component function:

```javascript

const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = props => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```