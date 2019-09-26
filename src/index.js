
// API
QUOTES_URL = "http://localhost:3000/quotes"
LIKES_URL = "http://localhost:3000/likes"

get = url => {
    return fetch(url).then(response => response.json())
}

post = (url, data) => {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }, body: JSON.stringify(data)
    }).then(response => response.json())
}

patch = (url, id, data) => {
    return fetch(`${url}/${id}`, {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }, body: JSON.stringify(data)
    }).then(response => response.json())
}

destroy = (url, id) => {
    return fetch(`${url}/${id}`, {
        method: "DELETE"
    }).then(response => response.json())
}

API = { get, post, patch, destroy }

// CONSTANTS
const quoteList = document.querySelector("div>ul#quote-list")
const newQuoteForm = document.querySelector("form#new-quote-form")

// FUNCTIONS

submitNewQuote = (event) => {
    event.preventDefault();
    let newQuote = {
        quote: event.target.querySelector("input#new-quote").value,
        author: event.target.querySelector("input#author").value,
        likes: []
    }
    API.post(QUOTES_URL, newQuote).then((quote) => {
        event.target.reset()
        putOnCard(quote)
    })
}

newQuoteForm.addEventListener("submit", submitNewQuote, false)

getAndRenderQuotes = () => {
    API.get(`${QUOTES_URL}/?_embed=likes`).then(quotes => quotes.map(aQuote=> putOnCard(aQuote)))
}

putOnCard = (singleQuote) => {
    let li = document.createElement("li")
    li.className = "quote-card"
    li.dataset.id = singleQuote.id
    let quoteCard = document.createElement("blockquote")
    quoteCard.className = "blockquote"

    let pQuote = document.createElement("p")
    pQuote.className = "mb-0"
    pQuote.innerText = singleQuote.quote

    let footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = singleQuote.author

    let br = document.createElement("br")

    let likesButton = document.createElement("button")
    likesButton.className = "btn-success"
    likesButton.innerText = "Likes: "
    likesButton.addEventListener("click", () => likesButtonHandler(singleQuote))

    let likesCount = document.createElement("span")
    likesCount.innerText = parseInt(singleQuote.likes.length)

    let deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener("click", () => deleteButtonHandler(singleQuote))
    
    quoteCard.append( pQuote, footer, br, likesButton, likesCount, deleteButton )
    li.append( quoteCard )
    quoteList.append( li )
}

likesButtonHandler = (quote) => {
    let quoteId = parseInt(quote.id)
    // event.timeStamp
    API.post(LIKES_URL, { quoteId } ).then(response => updateLikesOnClient(response))
}

updateLikesOnClient = quote => {
    let liSpan = document.querySelector(`li[data-id="${quote.quoteId}"] span`)
    let updatedLikes = parseInt(liSpan.innerText)
    updatedLikes++
    liSpan.innerText = updatedLikes
}

deleteButtonHandler = (quote) => {
    //let passQuote = quote
    API.destroy(QUOTES_URL, quote.id).then(removeQuoteFromClient(quote))
}

removeQuoteFromClient = (response) => {
    let liSpan = document.querySelector(`li[data-id="${response.id}"]`)
    liSpan.remove()
}




// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.body.onload = getAndRenderQuotes