// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

window.addEventListener("DOMContentLoaded", event => createQuoteList(BASE_URL));

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
const BASE_URL = "http://localhost:3000/quotes?_embed=likes";
const QUOTE_URL = "http://localhost:3000/quotes/";
const LIKES_URL = "http://localhost:3000/likes/";
const SORTED_URL = "http://localhost:3000/quotes?_sort=author&_embed=likes";
const quoteList = document.querySelector("#quote-list");
const quoteForm = document.querySelector("#new-quote-form");
const title = document.querySelector("h1");
sorted = false;

// FUNCTIONS
function createQuoteList(url) {
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

	let likeButton = document.createElement("button");
	likeButton.innerText = "Likes: ";
	likeButton.className = "btn-success";

	let likesSpan = document.createElement("span");
	likesSpan.innerHTML = `${quote.likes.length}`;
	likeButton.appendChild(likesSpan);
	likeButton.addEventListener("click", event => handleLikeClick(quote));

	let editButton = document.createElement("button");
	editButton.innerText = "Edit";
	editButton.className = "btn-warning";
	editButton.addEventListener("click", event => handleEditClick(quote));

	let deleteButton = document.createElement("button");
	deleteButton.innerText = "Delete";
	deleteButton.className = "btn-danger";
	deleteButton.addEventListener("click", event => handleDeleteClick(quote));

	let formDiv = document.createElement("div");
	formDiv.className = "edit-form";

	let editForm = document.createElement("form");
	editForm.className = "hidden-form";
	editForm.id = `edit-form-${quote.id}`;
	editForm.addEventListener("submit", event => editQuote(quoteCard));

	let block1 = document.createElement("div");
	block1.class = "form-group";

	let quoteLabel = document.createElement("label");
	quoteLabel.setAttribute("for", "edit-quote");
	quoteLabel.innerText = "Edit Quote";

	let quoteInput = document.createElement("input");
	quoteInput.setAttribute("type", "text");
	quoteInput.setAttribute("class", "form-control");
	quoteInput.setAttribute("id", "edit-quote");
	quoteInput.value = quote.quote;

	block1.append(quoteLabel, quoteInput);

	let authorLabel = document.createElement("label");
	authorLabel.setAttribute("for", "edit-author");
	authorLabel.innerText = "Edit Author";

	let authorInput = document.createElement("input");
	authorInput.setAttribute("type", "text");
	authorInput.setAttribute("class", "form-control");
	authorInput.setAttribute("id", "edit-author");
	authorInput.value = quote.author;

	let block2 = document.createElement("div");
	block2.class = "form-group";

	block2.append(authorLabel, authorInput);

	let submitEditButton = document.createElement("button");
	submitEditButton.setAttribute = ("type", "submit");
	submitEditButton.className = "btn-info";
	submitEditButton.innerText = "Submit Edit";

	editForm.append(block1, block2, submitEditButton);
	formDiv.appendChild(editForm);

	block.append(
		paragraph,
		blockFooter,
		breakParagraph,
		likeButton,
		editButton,
		deleteButton,
		editForm,
	);
	quoteCard.appendChild(block);
	quoteList.appendChild(quoteCard);
}

function handleSubmit(event) {
	event.preventDefault();
	let quote = event.target.querySelector("#new-quote").value;
	let author = event.target.querySelector("#author").value;
	let likes = [];
	API.post(QUOTE_URL, { quote, author, likes })
		.then(addQuote)
		.then(emptyForm);
}

function handleLikeClick(quote) {
	let currentDate = new Date();
	let unixDateBase = new Date(0);
	let unixDate = currentDate - unixDateBase;
	API.post(LIKES_URL, {
		quoteId: parseInt(quote.id),
		createdAt: unixDate,
	}).then(event.target.children[0].innerText++);
}

function handleEditClick(quote) {
	let form = document.querySelector(`#edit-form-${quote.id}`);

	form.className == "hidden-form"
		? (form.className = "form")
		: (form.className = "hidden-form");
}

function emptyForm() {
	document.querySelector("#new-quote").value = "";
	document.querySelector("#author").value = "";
}

function handleDeleteClick(quote) {
	API.destroy(QUOTE_URL, quote.id).then(
		event.target.parentNode.parentNode.remove(),
	);
}

function editQuote(element) {
	event.preventDefault();
	let quote = event.target.querySelector("#edit-quote").value;
	let author = event.target.querySelector("#edit-author").value;
	API.patch(QUOTE_URL, event.target.id.split("-")[2], { quote, author })
		.then(response => {
			element.querySelector("p").innerText = response.quote;
			element.querySelector("footer").innerText = response.author;
		})
		.then((event.target.className = "hidden-form"));
}

function sortQuotes() {
	sorted ? createQuoteList(BASE_URL) : createQuoteList(SORTED_URL);
	sorted = !sorted;
}

// EVENT LISTENERS
quoteForm.addEventListener("submit", handleSubmit);
title.addEventListener("click", sortQuotes);
