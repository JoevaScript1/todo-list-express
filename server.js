const express = require('express') // Imports the Express library to help build the web server.
const app = express() // Initializes an Express application instance.
const MongoClient = require('mongodb').MongoClient // Imports the MongoDB client to connect to the MongoDB database.
const PORT = 2121 // Sets the port number on which the server will listen.
require('dotenv').config() // Loads environment variables from a .env file for secure configuration.

// Declares a few variables to manage database configuration
let db, // Defines 'db' to later store the database connection instance.
    dbConnectionStr = process.env.DB_STRING, // Retrieves the database connection string from the environment variables.
    dbName = 'todo' // Sets the name of the database to be used, in this case, 'todo'.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connects to the MongoDB database using the connection string.
    .then(client => { // Once connected successfully, executes this code block.
        console.log(`Connected to ${dbName} Database`) // Logs a confirmation message indicating a successful connection to the 'todo' database.
        db = client.db(dbName) // Sets 'db' to the connected database instance, allowing database operations elsewhere in the app.
    })
    
app.set('view engine', 'ejs') // Use ejs
app.use(express.static('public')) // Our public folder is going to contain our static files (css, main.js..etc)
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // format data into JSON


app.get('/',async (request, response)=>{ // async function get request 
    const todoItems = await db.collection('todos').find().toArray() // set variable equal to an array of items that need to be done
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Count the number of items that have a completed property with a value of "false"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render items that have not been completed as EJS
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Post Request or "Create"
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Connect to Mongo Collection and Insert a new document where the thing property is taken from the body of form, and is given a property of completed:false by default.
    .then(result => { // if successfull do this code
        console.log('Todo Added') // Log Confirmation
        response.redirect('/')// Take user back to root page to refresh results
    })
    .catch(error => console.error(error)) // Error Handling
})

    app.put('/markComplete', (request, response) => { // Put request or "Update"
        db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Connect to Mongo collection 'todos', iniitialize update on a single document targeted by a matching "thing" property
            $set: {
                completed: true // What we want to update - in this case changing the completed property to true
            }
        },{
            sort: {_id: -1}, // loop through the list in reverse order
            upsert: false // Do not create new documents if no match is found
        })
        .then(result => {
            console.log('Marked Complete') // Confirmation log
            response.json('Marked Complete') // Confirmation log
        })
        .catch(error => console.error(error)) // Error Catch

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Connect to mongo collection. initialize update on a single document. Update the item with the matching 'thing' property.
        $set: {
            completed: false // What we want to update/change
          }
    },{
        sort: {_id: -1}, // Search in reverse order (bottom up)
        upsert: false // Do not create new document if document does not exist
    })
    .then(result => {
        console.log('Marked Complete') // Confirmation Log
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // Error Handling

})

app.delete('/deleteItem', (request, response) => { // Delete Route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Connect to our DB colection'todos', delete document with matching thing property
    .then(result => {
        console.log('Todo Deleted') // Confirmation Log
        response.json('Todo Deleted')// Confirmation Log
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // Listen on environment port(s) or run on our set port
    console.log(`Server running on port ${PORT}`) // Console log telling us what port our server is running on
})