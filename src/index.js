// API Functions

function get(url) {
  return fetch(url).then(response => response.json())
}

function post(url, objectData) {
  return fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json", Accept: "application/json"},
    body: JSON.stringify(objectData)
  }).then(response => response.json())
}

function destroy (url, id) {
  return fetch(`${url}/${id}`, {
    method: 'DELETE'
  }).then(resp => resp.json())
}

API = { get, post, destroy }

const URLWithLikes = "http://localhost:3000/quotes?_embed=likes"
const URLWithoutLikes = "http://localhost:3000/quotes"
const likes = "http://localhost:3000/likes"
const quotesList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
const formGroup = document.querySelector(".form-group")
const formSubmit = document.querySelector(".btn")

function quotesDisplay (quote) {
  let li = document.createElement("li")
  li.className = "quote-card"
  let blockquote = document.createElement("blockquote")
  blockquote.className = "blockquote"

  let p = document.createElement("p")
  p.className = "mb-0"
  p.innerText = quote.quote
  let footer = document.createElement("footer")
  footer.className = "blockquote-footer"
  footer.innerText = quote.author
  let br = document.createElement("br")
  let buttonA =document.createElement("button")
  buttonA.className = "btn-success"
  buttonA.innerText = "Likes: "
  let span = document.createElement("span")
  span.innerText = quote.likes.length
  let buttonB = document.createElement("button")
  buttonB.className = "btn-danger"
  buttonB.innerText = "Delete"

  blockquote.append(p, footer, br, buttonA, span, buttonB)
  li.append(blockquote)
  quotesList.append(li)

  buttonA.addEventListener("click", likeAQuote)  

  let quoteIdObject = {
    quoteId: quote.id
  }

  function likeAQuote () {
    span.innerText ++
    API.post(likes, quoteIdObject)
  }

  buttonB.addEventListener("click", deleteQuote)

  function deleteQuote () {
    API.destroy(URLWithoutLikes, quote.id).then(() => li.remove() )
  }
}

function createNewQuote() {
  newQuoteForm.addEventListener("submit", event => {
    event.preventDefault()

    let quoteObject = {
      quote: newQuoteForm.quote.value,
      author: newQuoteForm.author.value
    }
  
  API.post(URLWithoutLikes, quoteObject).then(() => renderAndDisplayQuotes())

  })
}

function renderAndDisplayQuotes () {
  API.get(URLWithLikes).then(quotes => displayAllQuotes(quotes))
}

const displayAllQuotes = quotes => {
  quotesList.innerHTML = ''
  quotes.forEach(quote => quotesDisplay(quote))
}

renderAndDisplayQuotes()
createNewQuote()



