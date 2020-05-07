###  Deploying app to internet

- Next let's connect the frontend we made in part 2 to our own backend.

- In the previous part, the frontend could ask for the list of notes from the json-server we had as a backend at from the address http://localhost:3001/notes. 

- Our backend has a bit different url structure, and the notes can be found from http//localhost:3001/api/notes. Let's change the attribute baseUrl in the src/services/notes.js like so:

```javascript

import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
```

- Now frontend's GET request to http://localhost:3001/api/notes does not work for some reason:

- What's going on here? We can access the backend from a browser and from postman without any problems.

### Same origin policy and CORS

- The issue lies with a thing called CORS, or Cross-Origin Resource Sharing. 

- According to Wikipedia:
*Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.*

- In our context the problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin. Because our server is in localhost port 3001, and our frontend in localhost port 3000, they do not have the same origin.

- Keep in mind, that same origin policy and CORS are not specific to React or Node. They are in fact universal principles of the operation of web applications. 

- We can allow requests from other origins by using Node's cors middleware.

- Install cors with the command

`npm install cors --save`

- take the middleware to use and allow for requests from all origins: 

```javascript

const cors = require('cors')

app.use(cors())
```

- And the frontend works! However, the functionality for changing the importance of notes has not yet been implemented to the backend. 

- You can read more about CORS from Mozillas page.

### Application to the Internet

- Now that the whole stack is ready, let's move our application to the internet. We'll use good old Heroku for this.
    - If you have never used Heroku before, you can find instructions from Heroku documentation or by Googling.

- Add a file called Procfile to the project's root to tell Heroku how to start the application. 

`web: node index.js`

- Change the definition of the port our application uses at the bottom of the index.js file like so: 

```javascript

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- Now we are using the port defined in environment variable PORT or port 3001 if the environment variable PORT is undefined. 
- Heroku configures application port based on the environment variable. 

- Create a Git repository in the project directory, and add .gitignore with the following contents

`node_modules`

- Create a Heroku application with the command heroku create, commit your code to the repository and move it to Heroku with command git push heroku master.

- If everything went well, the application works:

- If not, the issue can be found by reading heroku logs with command heroku logs.
    *NB At least in the beginning it's good to keep an eye on the heroku logs at all times. The best way to do this is with command heroku logs -t which prints the logs to console whenever something happens on the server.*

- The frontend also works with the backend on Heroku. You can check this by changing the backend's address on the frontend to be the backend's address in Heroku instead of http://localhost:3001.