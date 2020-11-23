import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = () => {
	const request = axios.get(baseUrl)
	const data = request.then(response => response.data)
	return data
  }

  const create = async resource => {
	const response = await axios.post(baseUrl, resource)
  	return response.data
  }

  const service = {
	create,
	getAll,
	setResources
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')
  useEffect(() => {
	noteService.getAll().then(initialNotes => {
		noteService.setResources(initialNotes)
	})
	personService.getAll().then(initialPersons => {
		personService.setResources(initialPersons)
	})
  }, [])

  const handleNoteSubmit = (event) => {
    event.preventDefault()
	noteService.create({ content: content.value }).then(returnedNote => {
		noteService.setResources(notes.concat(returnedNote))
	})
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
	personService.create({ name: name.value, number: number.value}).then(returnedPerson => {
		personService.setResources(persons.concat(returnedPerson))
	})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App