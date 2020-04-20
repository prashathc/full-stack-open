## The server and the web browser communicate with each other using the HTTP protocol. The Network tab shows how the browser and the server communicate.

- There are often several headers
- Headers give information like:
    1. Size of response in bytes
    2. Content-type
    3. Response data etc

- @ https://fullstack-exampleapp.herokuapp.com/ 
    - you can see, the client (browser) makes a request to the server at the requiest URL: https://fullstack-exampleapp.herokuapp.com/
    - the request method is GET
    - the status code sent by the serer is 200 
- Respone Headers @ https://fullstack-exampleapp.herokuapp.com/ 
    - one of the important response hedaers is "Content-Type"
    - in this case, "Content-Type" tells us the response is a "text-file in utf-8-format" and the contents of it have been formatted to HTML
    - this way, the browser knows to expect an HTML page and to render it as an HTML page
- In the response HTML, there is an image
    - this triggers an additional HTTP-request to fetch "kuva.png" from the server
    - Request URL:https://fullstack-exampleapp.herokuapp.com/kuva.png
    - Request Method:GET
    - Remote Address:3.216.129.32:443
    - Status Code: 200

### Order of operations for example page @ https://fullstack-exampleapp.herokuapp.com/
    1. the browser does a HTTP GET request to the server to fetch the HTML code of the page.
    2. The img tag in the HTML prompts the browser to fetch the image kuva.png.
    3. The browser renders the HTML page and the image to the screen. 

### Traditional Web Apps
- In traditional web applications the browser is "dumb". 
- It only fetches HTML data from the server, and all application logic is on the server. 
- A server can be created, for example, using Java Spring, Python Flask or with Ruby on Rails.

### Order of operations on page @ https://fullstack-exampleapp.herokuapp.com/notes
    1. The browser fetches the HTML code defining the content and the structure of the page from the server using an HTTP GET request.
    2. Links in the HTML code cause the browser to also fetch the CSS style sheet main.css and a JavaScript code file main.js
    3. The browser executes the JavaScript code. 
    4. The code makes an HTTP GET request to the address https://fullstack-exampleapp.herokuapp.com/data.json, which returns the notes as JSON data.
    5. When the data has been fetched, the browser executes an event handler, which renders the notes to the page using the DOM-API.

### Significance of AJAX
- Allows fetching of content using JS included within the HTML
- No longer need to refresh the page everytime we have an update
- No longer have all the content being served by the server

### Single Page Apps
In recent years, the Single-page application (SPA) style of creating web-applications has emerged. 
- SPA style websites don't fetch all of their pages separately from the server like our sample application does
- Instead comprises of only one HTML page fetched from the server, the contents of which are manipulated with JavaScript that executes in the browser.


### Traditional vs SPA
