const deleteBtn = document.querySelectorAll('.fa-trash') // Set a variable targeting the delete button
const item = document.querySelectorAll('.item span') // Select all SPANS on to do list
const itemCompleted = document.querySelectorAll('.item span.completed') //Select all spans with the class of completed

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // For each list item 
    element.addEventListener('click', markComplete) // add smurf listening for a click and run markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // for each completed item 
    element.addEventListener('click', markUnComplete) // add event listener, listening for a click, then run MarkUnComplete
})

async function deleteItem(){ // Async function stated
    const itemText = this.parentNode.childNodes[1].innerText //Gets the inner text of the second child node of this element's parent
    try{ // Async function syntax
        const response = await fetch('deleteItem', { // Respond with an object with method, headers, and body properties
            method: 'delete', // Specifies the HTTP method as DELETE 
            headers: {'Content-Type': 'application/json'}, // Sets the request header to indicate JSON format.
            body: JSON.stringify({ // Converts the data to be sent to JSON format.
              'itemFromJS': itemText // Sends 'itemText' as the value of 'itemFromJS' in the request body.
            })
          })
        const data = await response.json() // Set responsed to data as JSON
        console.log(data) // Console log data
        location.reload() //??

    }catch(err){ // Error Handling
        console.log(err)
    }
}

async function markComplete(){ // Async function
    const itemText = this.parentNode.childNodes[1].innerText //Gets the inner text of the second child node of this element's parent
    try{
        const response = await fetch('markComplete', {
            method: 'put', // Specifies the HTTP method as PUT for updating data.
            headers: {'Content-Type': 'application/json'}, // Sets the request header to indicate JSON data format.
            body: JSON.stringify({ // Converts the data to be sent to JSON format.
                'itemFromJS': itemText // Sends 'itemText' as the value of 'itemFromJS' in the request body.
            })
          })
        const data = await response.json() // Wait for server response then parse as JSON
        console.log(data) // Log the Data
        location.reload() // Refresh page so user sees update

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  //Gets the inner text of the second child node of this element's parent
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}