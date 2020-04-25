import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = props => {
  return <button onClick={props.onClick}>{props.text}</button>
}

const Stats = props => {
return <p>{props.text} {props.score}</p>
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [counter, setCounter] = useState(0)


  const handleGood = () => {
      setGood(good + 1)
      setCounter(counter + 1)
  }

  const handleNeutral = () => {
      setNeutral(neutral + 1)
      setCounter(counter + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
    setCounter(counter + 1)
  }

  

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text={"good"}></Button>
      <Button onClick={handleNeutral} text={"neutral"}></Button>
      <Button onClick={handleBad} text={"bad"}></Button>

      <h1>statistics</h1>

      {counter == 0 ? <p>No feedback given</p> 
      : <>
        <Stats text={"good"} score={good}/>
        <Stats text={"neutral"} score={neutral}/>
        <Stats text={"bad"} score={bad}/>
        <Stats text={"all"} score={counter}/>
        </>
      }

    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
