// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

// APIs

API = { get, post, destroy };

function get(url) {
  return fetch(url).then(resp => resp.json());
}

function post(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(resp => resp.json());
}

function destroy(url, id){
    return fetch(`${url}${id}`, {
        method: "DELETE"
    }).then(resp => resp.json())
}

// Constants
baseURL = "http://localhost:3000/quotes/"
quotesURL = "http://localhost:3000/quotes?_embed=likes";
likesURL = "http://localhost:3000/likes/";
quotesUL = document.querySelector("#quote-list");
newQuoteForm = document.querySelector("#new-quote-form");
newQuote = document.querySelector("#new-quote");
newAuthor = document.querySelector("#author");
embedLikes = "?_embed=likes"

//Functions

newQuoteForm.addEventListener("submit", handleFormSubmit)

function handleFormSubmit(){
  event.preventDefault();
  author = newAuthor.value
  quote = newQuote.value

  API.post(baseURL, {author, quote}).then(console.log)
  // quote => renderQuote(quote)
}

document.addEventListener("DOMContentLoaded", () => getQuotes());

function getQuotes() {
  API.get(quotesURL).then(quotesList => quotesList.forEach(renderQuotes));
}

function renderQuotes(quote) {
  let li = document.createElement("li");
  li.className = "quote-card";
  li.dataset.id = quote.id
  block = document.createElement("blockquote");
  block.className = "blockquote";
  let p = document.createElement("p");
  p.className = "mb-0";
  p.innerText = quote.quote;
  let brk = document.createElement("br");
  let footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.innerText = quote.author;
  let likeButton = document.createElement("button");
  likeButton.className = "btn-success";
  likeButton.dataset.id = quote.id;
  likeButton.innerText = "Likes ";
  let span = document.createElement("span");
  span.innerText = quote.likes.length.toString();
  likeButton.append(span);
  let deleteButton = document.createElement("button");
  deleteButton.className = "btn-danger";
  deleteButton.innerText = "Delete";
  deleteButton.dataset.id = quote.id
  deleteButton.addEventListener("click", handleDeleteQuote)

  quotesUL.append(li);
  li.append(block);
  block.append(p, footer, brk, likeButton, deleteButton);
  likeButton.addEventListener("click", handleLikeClick);
}

function handleLikeClick(event) {
  let quoteData = { quoteId: parseInt(event.target.dataset.id) };
  API.post(likesURL, quoteData).then(like => renderLikes(like));
}

function renderLikes(like){
    quoteId = like.quoteId
    span = document.querySelector(`button[data-id="${quoteId}"]>span`)
    API.get(`${baseURL}${quoteId}${embedLikes}`).then(quote => {span.innerText = quote.likes.length})
    // span.innerText = quote.likes.length
}


function handleDeleteQuote(event){
    quoteId = event.target.dataset.id
    API.destroy(baseURL, quoteId).then(resp => removeQuote(quoteId))
}

function removeQuote(quoteId){
    quoteLi = document.querySelector(`li[data-id="${quoteId}"]`)
    quoteLi.parentNode.removeChild(quoteLi)
}

