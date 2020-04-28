import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const handleChange = (e) => {
    setNewName(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setPersons(persons.concat({name: newName}))
    setNewName('')

  }


  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input onChange={handleChange} value={newName} />
        </div>
        <div>
          <button onClick={handleSubmit} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
      {persons.map(person => {
        return <li>{person.name}</li>
      })}
      </ul>
    </div>
  )
}

export default App