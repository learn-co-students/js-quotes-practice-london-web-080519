// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.body.onload = renderAll();


function renderAll(){

        get(`http://localhost:3000/quotes?_embed=likes`).then(quoteList => quoteList.forEach(renderQuoteList))
        newQuote();
    }
        


function get(url) {
    return fetch(url).then(response => response.json())
    }

function destroy(url, id) {
    return fetch(`${url}/${id}`,{method: "DELETE"}).then(data => data.json()); 
}

function post(url, data) {
    return fetch(`${url}`, {
        method: "POST",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify(data)
    }).then(response => response.json());
}


function destroy(url, id) {
    const configObject = {
      method: "DELETE"
    };
    return fetch(`${url}/${id}`, configObject).then(data => data.json());
  }
  


function renderQuoteList(data){


function checkLikes(data){
    if (data.likes){
    return data.likes.length}
    else{return 0}
}

let likeCount = checkLikes(data);

console.log(data.id)

    const quoteListDiv = document.querySelector(`#quote-list-div`)


const quoteListUl = document.querySelector(`#quote-list`)
const quoteListli = document.createElement(`li`)
quoteListli.className = 'quote-card';
quoteListli.id = `quote${data.id}`
const blockquote = document.createElement(`blockquote`)
blockquote.className = `blockquote`
const p = document.createElement(`p`)
p.className = `mb-0`
const footer = document.createElement(`footer`)
footer.className = 'blockquote-footer'
const lineBreak = document.createElement(`br`)
const likeButton = document.createElement(`button`)
likeButton.className = 'btn-success'
span = document.createElement(`span`)
const deleteButton = document.createElement(`button`)
deleteButton.className = 'btn-danger'

p.innerText = `${data.quote}`
footer.innerText = `${data.author}`
likeButton.innerText = `Likes: `
span.innerText = `${checkLikes(data)}`//${data.likes.length}`
deleteButton.innerText = `Delete`

quoteListUl.appendChild(quoteListli)
quoteListDiv.appendChild(quoteListUl)

likeButton.appendChild(span)
quoteListli.append(blockquote)
blockquote.append(p, footer, lineBreak, likeButton, deleteButton)


deleteButton.addEventListener('click', (event) => {

    destroy(`http://localhost:3000/quotes`, data.id)
    let toRmove =  document.querySelector(`#quote${data.id}`)
    toRmove.remove();
})

likeButton.addEventListener('click', (event) => {

    let newLike = {quoteId: data.id}

    post(`http://localhost:3000/likes`, newLike).then(console.log)

    let newSpan = document.querySelector(`#quote${data.id} span`)
    likeCount ++
    newSpan.innerText = `${likeCount}`
 
    console.log(data.id)
})


}


function newQuote() {
    form = document.querySelector(`#new-quote-form`)
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let newQuote = {
            quote: event.target[0].value,
            author: event.target[1].value
        }

        post(`http://localhost:3000/quotes`, newQuote).then(renderQuoteList);

    })
}







//  <li class='quote-card'>
// <blockquote class="blockquote">
//   <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//   <footer class="blockquote-footer">Someone famous</footer>
//   <br>
//   <button class='btn-success'>Likes: <span>0</span></button>
//   <button class='btn-danger'>Delete</button>
// </blockquote>
// </li> 
