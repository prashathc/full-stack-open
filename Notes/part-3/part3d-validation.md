### Validation and ESLint

- There are usually constraints that we want to apply to the data that is stored in our application's database.

- Our application shouldn't accept notes that have a missing or empty content property. The validity of the note is checked in the route handler:

```javascript
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  // ...
});
```

- If the note does not have the content property, we respond to the request with the status code 400 bad request.

- One smarter way of validating the format of the data before it is stored in the database, is to use the validation functionality available in Mongoose.

- We can define specific validation rules for each field in the schema:

```javascript
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});
```

- The content field is now required to be at least five characters long.
- The date field is set as required, meaning that it can not be missing.
- The same constraint is also applied to the content field, since the minimum length constraint allows the field to be missing. We have not added any constraints to the important field, so its definition in the schema has not changed.

- The minlength and required validators are built-in and provided by Mongoose.
- The Mongoose custom validator functionality allows us to create new validators, if none of the built-in ones cover our needs.

- If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:

```javascript

  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))})
```

- Let's expand the error handler to deal with these validation errors:

```javascript
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
```

- When validating an object fails, we return the following default error message from Mongoose:

### Promise Chaining

- Many of the route handlers changed the response data into the right format by calling the toJSON method. When we created a new note, the toJSON method was called for the object passed as a parameter to then:

```javascript

app.post('/api/notes', (request, response, next) => {
  // ...

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) 
})
```