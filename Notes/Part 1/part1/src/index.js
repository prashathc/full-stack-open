import React from 'react'
import ReactDOM from 'react-dom'

const Content = (props) => {
  return (
    <p>{props.part} {props.exercise} </p>
  )
}

const Total = (props) => {
  return (<p>
    Number of exercises {props.exercises}
  </p>)
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <h1>{course.name}</h1>
      <Content part={course.parts[0].name} exercise={course.parts[0].exercises}/>
      <Content part={course.parts[1].name} exercise={course.parts[1].exercises}/>
      <Content part={course.parts[2].name} exercise={course.parts[2].exercises}/>
      <Total exercises={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))