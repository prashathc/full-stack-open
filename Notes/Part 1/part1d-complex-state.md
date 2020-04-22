### Complex State

- In our previous example the application state was simple as it was comprised of a single integer. 
- What if our application requires a more complex state?

- In most cases the easiest and best way to accomplish this is by using the useState function multiple times to create separate "pieces" of state.
- In the following code we create two pieces of state for the application named left and right that both get the initial value of 0:

```javascript

const App = (props) => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      <div>
        {left}
        <button onClick={() => setLeft(left + 1)}>
          left
        </button>
        <button onClick={() => setRight(right + 1)}>
          right
        </button>
        {right}
      </div>
    </div>
  )
}
```

- The component gets access to the functions setLeft and setRight that it can use to update the two pieces of state.
- The component's state or a piece of its state can be of any type. 
- We could implement the same functionality by saving the click count of both the left and right buttons into a single object:

```javascript

{
  left: 0,
  right: 0
}
```

- In this case the application would look like this:

```javascript

const App = (props) => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      <div>
        {clicks.left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {clicks.right}
      </div>
    </div>
  )
}
```

- Now the component only has a single piece of state and the event handlers have to take care of changing the entire application state.
- The event handler looks a bit messy. When the left button is clicked, the following function is called:

```javascript

const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
```

- The following object is set as the new state of the application:

```javascript

{
  left: clicks.left + 1,
  right: clicks.right
}
```

- The new value of the left property is now the same as the value of left + 1 from the previous state, and the value of the right property is the same as value of the right property from the previous state.
- We can define the new state object a bit more neatly by using the object spread operator.

```javascript

const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
```

- The syntax may seem a bit strange at first. 
- In practice { ...clicks } creates a new object that has copies of all of the properties of the clicks object. 
- When we add new properties to the object, e.g. { ...clicks, right: 1 }, the value of the right property in the new object will be 1.
- In the example above, this:

```javascript
{ ...clicks, right: clicks.right + 1 }
```

- creates a copy of the clicks object where the value of the right property is increased by one.

- Assigning the object to a variable in the event handlers is not necessary and we can simplify the functions to the following form:

```javascript

const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

- Some readers might be wondering why we didn't just update the state directly, like this:

```javascript

const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

- The application appears to work. 
- However, it is forbidden in React to mutate state directly, since it can result in unexpected side effects. 
- Changing state has to always be done by setting the state to a new object. 
- If properties from the previous state object want to simply be copied, this has to be done by copying those properties into a new object.

- Storing all of the state in a single state object is a bad choice for this particular application; there's no apparent benefit and the resulting application is a lot more complex. 
- In this case storing the click counters into separate pieces of state is a far more suitable choice.

### Handling Arrays

- Let's add a piece of state to our application containing an array allClicks that remembers every click that has occurred in the application.

```javascript

const App = (props) => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])


  const handleLeftClick = () => {    
      setAll(allClicks.concat('L'))    
      setLeft(left + 1)  
  }

  const handleRightClick = () => {    
      setAll(allClicks.concat('R'))    
      setRight(right + 1)  
  }


  return (
    <div>
      <div>
        {left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {right}
        <p>{allClicks.join(' ')}</p>      
      </div>
    </div>
  )
}
```
- Every click is stored into a separate piece of state called allClicks that is initialized as an empty array:

```javascript

const [allClicks, setAll] = useState([])
```

- When the left button is clicked, we add the letter L to the allClicks array:

```javascript

const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

- The piece of state stored in allClicks is now set to be an array that contains all of the items of the previous state array plus the letter L. 
- Adding the new item to the array is accomplished with the concat method
- That does not mutate the existing array but rather returns a new copy of the array with the item added to it.
- As mentioned previously, it's also possible in JavaScript to add items to an array with the push method. 
- If we add the item by pushing it to the allClicks array and then updating the state, the application would still appear to work:
- However, **don't do this**. 
- As mentioned previously, the state of React components like allClicks must not be mutated directly. 
- Even if mutating state appears to work in some cases, it can lead to problems that are very hard to notice.
- Let's take a closer look at how the clicking history is rendered to the page:

```javascript

const App = (props) => {
  // ...

  return (
    <div>
      <div>
        {left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {right}
        <p>{allClicks.join(' ')}</p>      
      </div>
    </div>
  )
}
```

- We call the join method for the allClicks array that joins all the items into a single string, separated by the string passed as the function parameter, which in our case is an empty space.

### Conditional Rendering

- Let's modify our application so that the rendering of the clicking history is handled by a new History component:

```javascript

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const App = (props) => {
  // ...

  return (
    <div>
      <div>
        {left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {right}
        <History allClicks={allClicks} />      
      </div>
    </div>
  )
}
```
- Now the behavior of the component depends on whether or not any buttons have been clicked. 
- If not, meaning that the allClicks array is empty, the component renders a div component with some instructions:

`<div>the app is used by pressing the buttons</div>`

- And in all other cases, the component renders the clicking history:

```javascript

<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

- The History component renders completely different React-elements depending on the state of the application. 
- This is called conditional rendering.
- React also offers many other ways of doing conditional rendering. We will take a closer look at this in part 2.

Let's make one last modification to our application by refactoring it to use the Button component that we defined earlier on:

```javascript

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({ onClick, text }) => (  <button onClick={onClick}>    {text}  </button>)
const App = (props) => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      <div>
        {left}
        <Button onClick={handleLeftClick} text='left' />        
        <Button onClick={handleRightClick} text='right' />        
        {right}
        <History allClicks={allClicks} />
      </div>
    </div>
  )
}
```