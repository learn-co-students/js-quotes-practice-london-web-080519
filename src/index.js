// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

// ---- API FUNCTIONS --- //
const likesURL = 'http://localhost:3000/likes/'
const quotesURL = 'http://localhost:3000/quotes/'
const embedURL = 'http://localhost:3000/quotes?_embed=likes'
const API = {get, post, destroy}

function get(url) {
    return fetch(url).then(response => response.json());
}

function post(url, objData){
    let configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objData)
    };
    return fetch(url, configObj).then(response => response.json());
}


function destroy(url, id){
    let configObj = {
        method: 'DELETE'
    };
    return fetch(`${url}${id}`, configObj).then(data => data.json());
}


// ---- CONSTANTS --- //
const quotesUl = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')


// ---- FUNCTIONS --- //
// --- rendering page --- //
function getQuotes(url){
    API.get(url).then(quotesList => quotesList.forEach(quote => {
        quotesUl.append(renderQuote(quote))
    }))
}


function renderQuote(quote){
    let li = document.createElement('li')
    li.className='quote-card'
    li.id=`quote-${quote.id}`
    
    let blockquote = document.createElement('blockquote')
    blockquote.className='blockquote'

    let p = document.createElement('p')
    p.className=`mb-${quote.id}`
    p.innerText=`${quote.quote}`

    let footer = document.createElement('footer')
    footer.className='blockquote-footer'
    footer.innerText=`${quote.author}`

    let br = document.createElement('br')

    let likesBtn = document.createElement('button')
    likesBtn.className = 'btn-success'
    likesBtn.id=`likes-${quote.id}`
    likesBtn.innerText=`Likes: ${quote.likes.length}`
  
    likesBtn.addEventListener('click', handleLikeClick)

    let deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-danger'
    deleteBtn.id=`${quote.id}`
    deleteBtn.innerText = 'Delete'
    deleteBtn.addEventListener('click', handleDeleteClick)
    
    blockquote.append(p, footer, br, likesBtn, deleteBtn)
    li.append(blockquote)

    return li
}

// --- adding quotes --- //
newQuoteForm.addEventListener('submit', handleNewQuote)

function handleNewQuote(event){
    event.preventDefault()
    let newQuote = {
        quote: event.target[0].value,
        author: event.target[1].value,
        likes: []
    }
    API.post(quotesURL, newQuote).then(quote => postOnClient(quote))
}

function postOnClient(quote){
    quotesUl.append(renderQuote(quote))
}

// --- handling like click --- //

function handleLikeClick(event){
    let id = parseInt(event.target.id.split("-")[1])
    let liLi = document.querySelector(`#likes-${id}`)
    currentLikes = parseInt(liLi.innerText.split(" ")[1])
    currentLikes += 1
    let dataToSend = {
        quoteId: id,
        likes: currentLikes
    }
    API.post(likesURL, dataToSend).then(updateLikesOnClient)
    // liLi.innerText = `Likes: ${currentLikes}` 
}

function updateLikesOnClient(data){ 
    let liLi = document.querySelector(`#likes-${data.quoteId}`)
    liLi.innerText = `Likes: ${data.likes}` 
}

// --- handling delete click --- //

function handleDeleteClick(event){
    let id = parseInt(event.target.id)
    API.destroy(quotesURL, id)
    deadLi = document.querySelector(`#quote-${id}`)
    deadLi.remove()
}


// ---- ON PAGE LOAD --- //
getQuotes(embedURL)

