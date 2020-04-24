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

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={()=>{setGood(good + 1)}} text={"good"}></Button>
      <Button onClick={()=>{setNeutral(neutral + 1)}} text={"neutral"}></Button>
      <Button onClick={()=>{setBad(bad + 1)}} text={"bad"}></Button>

      <h1>statistics</h1>

      <Stats text={"good"} score={good}></Stats>
      <Stats text={"neutral"} score={neutral}></Stats>
      <Stats text={"bad"} score={bad}></Stats>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)