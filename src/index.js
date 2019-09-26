// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

// API
get = url => fetch(url).then(resp => resp.json());

post = (url, data) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json());
};

// patch = (url, data) => {
//   return fetch(`${url}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   }).then(resp => resp.json());
// }

destroy = (url, id) => {
  return fetch(`${url}${id}`, {
    method: "DELETE"
  });
};

const API = { get, post, destroy };

// CONSTANTS
const quotesUrlLikesEmbeded = "http://localhost:3000/quotes?_embed=likes";
const quotesUrl = "http://localhost:3000/quotes/";
const likesUrl = "http://localhost:3000/likes/";
const quoteList = document.querySelector("ul#quote-list");
const quoteForm = document.querySelector("form#new-quote-form");

// FUNCTIONS

// create new quote

handleSubmit = event => {
  event.preventDefault();
  newQuote = {
    quote: event.target[0].value,
    author: event.target[1].value
  };

  API.post(quotesUrl, newQuote).then(appendQuote);
};

// delete function

handleDeleteButton = event => {
  let quoteElementId = event.target.id;
  let quoteId = parseInt(quoteElementId.replace("quote-", ""), 10);
  API.destroy(quotesUrl, quoteId).then(promise => {
    let deletedQuote = document.querySelector(`button#${quoteElementId}.btn-danger`).parentNode.parentNode;
    deletedQuote.remove();
  });
};

handleLikeButton = quote => {
  quoteData = {
    quoteId: quote.id
  }
  API.post(likesUrl, quoteData).then(promise => getAllQuotes())
};

// append quote to HTML
appendQuote = quote => {
  let quoteLi = document.createElement("li");
  quoteLi.className = "quote-card";

  let quoteBlock = document.createElement("blockquote");
  quoteBlock.className = "blockquote";

  let quoteP = document.createElement("p");
  quoteP.className = "mb-0";
  quoteP.innerText = quote.quote;

  let quoteFooter = document.createElement("footer");
  quoteFooter.className = "blockquote-footer";
  quoteFooter.innerText = quote.author;

  let quoteBr = document.createElement("br");

  let likeButton = document.createElement("button");
  likeButton.setAttribute("id", `quote-${quote.id}`)
  likeButton.className = "btn-success";
  likeButton.innerText = "Likes: ";
  let likeButtonSpan = document.createElement("span");
  if (quote.likes) {
    likeButtonSpan.innerText = quote.likes.length;
  } else {
    likeButtonSpan.innerText = 0;
  }

  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("id", `quote-${quote.id}`);
  deleteButton.className = "btn-danger";
  deleteButton.innerText = "Delete";

  quoteList.appendChild(quoteLi);
  quoteLi.appendChild(quoteBlock);
  quoteBlock.append(quoteP, quoteFooter, quoteBr, likeButton, deleteButton);
  likeButton.appendChild(likeButtonSpan);

  deleteButton.addEventListener("click", handleDeleteButton);
  likeButton.addEventListener("click", event => {
    handleLikeButton(quote)
  });
};

renderQuotes = quotes => {
  while(quoteList.firstChild) {
    quoteList.firstChild.remove()
  }
  quotes.forEach(appendQuote);
};

getAllQuotes = () => {
  API.get(quotesUrlLikesEmbeded).then(renderQuotes);
};


// EVENT LISTENER

document.body.onload = getAllQuotes();

quoteForm.addEventListener("submit", event => {
  handleSubmit(event);
});
