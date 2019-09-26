window.addEventListener("DOMContentLoaded", event => renderQuotes(quotesURL));

// API
API = { get, post, patch, destroy };

function get(url) {
	return fetch(url).then(response => response.json());
}

function post(url, data) {
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accepts: "application/json",
		},
		body: JSON.stringify(data),
	}).then(response => response.json());
}

function patch(url, id, data) {
	return fetch(`${url}${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Accepts: "application/json",
		},
		body: JSON.stringify(data),
	}).then(response => response.json());
}

function destroy(url, id) {
	return fetch(`${url}${id}`, {
		method: "DELETE",
	}).then(response => response.json());
}

// CONSTANTS
const quotesURL = "http://localhost:3000/quotes?_embed=likes";
const rawURL = "http://localhost:3000/quotes/";
const likesURL = "http://localhost:3000/likes/";
const quoteList = document.querySelector("#quote-list");
const quoteForm = document.querySelector("#new-quote-form");

// FUNCTIONS
function renderQuotes(url) {
	quoteList.innerText = "";
	API.get(url).then(quotes => quotes.forEach(quote => addQuote(quote)));
}

function addQuote(quote) {
	let quoteCard = document.createElement("li");
	quoteCard.className = "quote-card";

	let block = document.createElement("blockquote");
	block.className = "blockquote";

	let paragraph = document.createElement("p");
	paragraph.className = `mb-${quote.id}`;
	paragraph.innerText = quote.quote;

	let blockFooter = document.createElement("footer");
	blockFooter.className = "blockquote-footer";
	blockFooter.innerText = quote.author;

	let breakParagraph = document.createElement("br");

  

    let likesDiv = document.createElement("div");
    let likeButton = document.createElement("button");

	likeButton.className = "btn-success";
    likeButton.innerText = `${quote.likes.length}`;
    likesDiv.append(likeButton)
    likeButton.addEventListener("click", event => handleLikeClick(quote));
    likesDiv.appendChild(likeButton);


    let deleteDiv = document.createElement("div")
    let deleteButton= document.createElement("button");
	deleteButton.innerText = "Delete";
	deleteButton.className = "btn-danger";
    deleteButton.addEventListener("click", event => handleDeleteClick(quote));
    deleteDiv.appendChild(deleteButton)



	block.append(
		paragraph,
		blockFooter,
		breakParagraph,
		likeButton,
		deleteButton,
	);
	quoteCard.appendChild(block);
	quoteList.appendChild(quoteCard);
}

function handleSubmit(event) {
	event.preventDefault();
	let quote = event.target.querySelector("#new-quote").value;
	let author = event.target.querySelector("#author").value;
	let likes = [];
	API.post(rawURL, { quote, author, likes })
		.then(addQuote)
		.then(resetForm);
}

function handleLikeClick(quote) {

	API.post(likesURL, {
		quoteId: parseInt(quote.id),
	}).then(event.target.innerText++);
}


function resetForm() {
	document.querySelector("#new-quote").value = "";
	document.querySelector("#author").value = "";
}

function handleDeleteClick(quote) {
	API.destroy(rawURL, quote.id).then(
		event.target.parentNode.parentNode.remove(),
	);
}


// EVENT LISTENERS
quoteForm.addEventListener("submit", handleSubmit);