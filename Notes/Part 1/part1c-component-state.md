### Component helper function

```javascript   

const Hello = (props) => {
  const bornYear = () => {    
      const yearNow = new Date().getFullYear()    
      return yearNow - props.age  
    }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>    
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}

```

- The logic for guessing the year of birth is separated into its own function that is called when the component is rendered.
- The person's age does not have to be passed as a parameter to the function, since it can directly access all props that are passed to the component.
- If we examine our current code closely, we'll notice that the helper function is actually defined inside of another function that defines the behavior of our component. 
- In Java-programming, defining a method inside another method is not possible, but in JavaScript, defining functions within functions is a commonly used technique.


### Destructuring

- Destructuring allows us to store values from objects and arrays upon assignment
- In our previous code, we had to reference the data passed to our component as `props.name` and `props.age`. 
- Of these two expressions we had to repeat props.age twice in our code.

- Since props is an object that looks like this:

```javascript

props = {
  name: 'Arto Hellas',
  age: 35,
}
```

- we can streamline our component by assigning the values of the properties directly into two variables name and age which we can then use in our code:

```javascript  
const Hello = (props) => {
  const name = props.name  
  const age = props.age
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

- Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables:

```javascript

const Hello = (props) => {
  const { name, age } = props  
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

- We can take destructuring a step further:

```javascript

const Hello = ({ name, age }) => {  
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

- The props that are passed to the component are now directly destructured into the variables name and age.
- This means that instead of assigning the entire props object into a variable called props and then assigning its properties into the variables name and age
- Just to recap, these two are the same thing:

```javascript

const Hello = (props) => {
  const { name, age } = props

  and 

  const Hello = ({ name, age }) => {
```

### Page re-rendering

- So far all of our applications have been such that their appearance remains the same after the initial rendering. 
- What if we wanted to create a counter where the value increased as a function of time or at the click of a button?

### Stateful Component
- All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.
- Next, let's add state to our application's App component with the help of React's state hook.

```javascript

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [ counter, setCounter ] = useState(0)
  
  setTimeout(    
      () => setCounter(counter + 1),    
      1000  
  )

  return (
    <div>{counter}</div>
  )
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)
```

- In the first row, the application imports the useState-function:

`import React, { useState } from 'react'`

- The function body that defines the component begins with the function call:

`const [ counter, setCounter ] = useState(0)`

- The function call adds state to the component and renders it initialized with the value of zero. 
- The function returns an array that contains two items. 
- We assign the items to the variables counter and setCounter by using the destructuring assignment syntax shown earlier.
- The counter variable is assigned the initial value of state which is zero. 
- The variable setCounter is assigned to a function that will be used to modify the state.
- The application calls the setTimeout function and passes it two parameters: a function to increment the counter state and a timeout of one second:

```javascript

setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

- When the state modifying function setCounter is called, React re-renders the component which means that the function body of the component function gets re-executed:

```javascript

(props) => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

### Event handling

- We have already mentioned event handlers a few times in part 0, that are registered to be called when specific events occur. 
- E.g. a user's interaction with the different elements of a web page can cause a collection of various different kinds of events to be triggered.
- Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the button-element.

```javascript

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {    
      console.log('clicked')  
    }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>        
        plus    
      </button>    
    </div>
  )
}
```

- We set the value of the button's onClick-attribute to be a reference to the handleClick function defined in the code.
- Now every click of the plus button causes the handleClick function to be called, meaning that every click event will log a clicked message to the browser console.
- The event handler function can also be defined directly in the value assignment of the onClick-attribute:

```javascript

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}>        
        plus
      </button>
    </div>
  )
}
```

- By changing the event handler to the following form:

```javascript

<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

- we achieve the desired behavior, meaning that the value of counter is increased by one and the component gets re-rendered.
- Let's also add a button for resetting the counter:

```javascript

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(0)}>         
        zero      
      </button>    
    </div>
  )
}
```

### Event handlers are functions

- Let's separate the event handlers into separate functions anyway: 

```javascript

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)    
  const setToZero = () => setCounter(0)


  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>        
        plus
      </button>
      <button onClick={setToZero}>        
        zero
      </button>
    </div>
  )
}
```

- Here the event handlers have been defined correctly. The value of the onClick attribute is a variable containing a reference to a function:

```javascript

<button onClick={increaseByOne}> 
  plus
</button>
```

### Passing state to child components

- It's recommended to write React components that are small and reusable across the application and even across projects. 
- Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.
- Let's first implement a Display component that's responsible for displaying the value of the counter.
- One best practice in React is to lift the state up high enough in the component hierarchy. The documentation says:

*Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.*

- So let's place the application's state in the App component and pass it down to the Display component through props:

```javascript

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

- Using the component is straightforward, as we only need to pass the state of the counter to component:

```javascript

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>      
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

- Everything still works. When the buttons are clicked and the App gets re-rendered, all of its children including the Display component are also re-rendered.
- Let's make a Button component for the buttons of our application. 
- We have to pass the event handler as well as the title of the button through the component's props:

```javascript

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

- Our App component now looks like this: 

```javascript

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <Button        
        handleClick={increaseByOne}        
        text='plus'      
      />      
      <Button        
        handleClick={setToZero}        
        text='zero'      
      />           
      <Button        
        handleClick={decreaseByOne}         
        text='minus'      
      />               
    </div>
  )
}
```

- Since we now have an easily reusable Button component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter.
- The event handler is passed to the Button component through the handleClick prop. 
- The name of the prop itself is not that significant, but our naming choice wasn't completely random, e.g. React's own official tutorial suggests this convention.

### Changes in state cause rerendering

-Let's go over the main principles of how an application works once more.
  1. When the application starts, the code in App is executed. 
  2. This code uses a useState - hook to create the application state - value of the counter counter. 
  3. The component renders the Display component. 
  4. It displays the counter's value (0), and three Button components. 
  5. The buttons have event handlers, which are used to change the state of the counter.

- When one of the buttons is clicked
  1. The event handler changes the state of the App component with the setCounter function. 
  2. Calling a function which changes the state causes the component to rerender.

- So, if a user clicks the plus button
  1. The button's event handler changes the value of counter to 1, and the App component is rerendered. 
  2. This causes its subcomponents Display and Button to also be rerendered.
  3. Display receives the new value of the counter, 1, as props. 
  4. The Button components receive event handlers which can be used to change the state of the counter.

  ### Refactoring the components

  - The component displaying the value of the counter is as follows:

  ```javascript

  const Display = (props) => {
    return (
      <div>{props.counter}</div>
    )
}
  ```

  - The component only uses the counter field of its props. 
  - This means we can simplify the component by using destructuring like so:

  ```javascript

  const Display = ({ counter }) => {
    return (
      <div>{counter}</div>
    )
  }
  ```

- The method defining the component contains only the return statement, so we can define the method using the more compact form of arrow functions:

```javascript
const Display = ({ counter }) => <div>{counter}</div>
```

- We can simplify the Button component as well.

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>