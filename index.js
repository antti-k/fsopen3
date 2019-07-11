const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
	{
		name: 'Antti Esimerkki',
		number: 'enkerro',
		id: 1,
	},
	{
		name: 'Ville Esimerkki',
		number: '1245',
		id: 2,
	}
]

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/info', (req, res) => {
	const currentDate = new Date().toDateString()
	const currentTime = new Date().toTimeString()
	res.send(`Phonebook has info for ${persons.length} people</br>${currentDate}${currentTime}`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)

	const person = persons.find(person => person.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'Name or number missing'
		})
	}

	const { name, number } = body

	if (persons.some(person => person.name === name)) {
		return res.status(400).json({
			error: 'Name must be unique'
		})
	}

	const person = {
		name,
		number,
		id: Math.floor(Math.random() * 1000000000)
	}

	persons = [...persons, person]

	res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
