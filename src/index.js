// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

// API
const QUOTES_BASE_URL = "http://localhost:3000/quotes/"
const LIKES_BASE_URL = "http://localhost:3000/likes/"
const EMBED_LIKES_QUERY = "?_embed=likes"
const SORT_BY_AUTHOR = "&_sort=author"

function get(url) {
    return fetch(url).then(resp => resp.json())
}

function post(url, data) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(url, configObj).then(resp => resp.json())
}

function patch(url, id, data) {
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }

    return fetch(url+id, configObj).then(resp => resp.json())
}

function destroy(url, id) {
    let configObj = {
        method: "DELETE",
    }
    return fetch(url+id, configObj).then(resp => resp.json())
}

API = {
    get,
    post,
    patch,
    destroy
}

document.addEventListener("DOMContentLoaded", () => {
 
    // Variables ---
    const quotesList = document.querySelector("div ul#quote-list")
    const newQuoteForm = document.querySelector("form#new-quote-form")
    const sortBtn = document.querySelector('button#toggle-sort-btn')

    // Functions ----
    //Create and render quotes
    function getAndRenderAllQuotes() {
        get(`${QUOTES_BASE_URL}${EMBED_LIKES_QUERY}`).then(createAndAppendAllQuoteLis)
    }

    function createAndAppendAllQuoteLis(quotes) {
        while (quotesList.firstChild) quotesList.removeChild(quotesList.firstChild)
        quotes.forEach(appendQuoteToList)
    }

    function appendQuoteToList(quote) {
        let quoteLi = createQuoteLi(quote)
        quotesList.append(quoteLi)
    }

    function createQuoteLi(quote) {        
        let quoteLi = document.createElement('li')
        quoteLi.classList.add('quote-card')
        quoteLi.dataset.id = quote.id

        let quoteBlockquote = document.createElement('blockquote')
        quoteBlockquote.classList.add('blockquote')

        let quoteP = document.createElement('p')
        quoteP.innerText = quote.quote
        quoteP.classList.add('mb-0')
        quoteP.setAttribute('data-quote-id', quote.id)

        let quoteAuthorFooter = document.createElement('footer')
        quoteAuthorFooter.classList.add('blockquote-footer')
        quoteAuthorFooter.innerText = quote.author
        quoteAuthorFooter.setAttribute('data-quote-id', quote.id)


        let quoteBreak = document.createElement('br')

        let likeBtn = document.createElement('button')
        likeBtn.classList.add('btn-success')
        likeBtn.addEventListener('click', e => handleLikeBtnClick(e, quote))
        likeBtn.innerText = "Likes: "

        let likesSpan = document.createElement('span')
        likesSpan.setAttribute('data-quote-id', quote.id)
        likesSpan.innerText = quote.likes ? quote.likes.length : "0"
        likeBtn.append(likesSpan)

        let editQuoteBtn = document.createElement('button')
        editQuoteBtn.classList.add('btn-primary')
        editQuoteBtn.innerText = "Edit"
        editQuoteBtn.setAttribute('data-quote-id', quote.id)

        let deleteQuoteBtn = document.createElement('button')
        deleteQuoteBtn.classList.add('btn-danger')
        deleteQuoteBtn.innerText = "Delete"
        deleteQuoteBtn.addEventListener('click', e => handleDeleteButtonClick(e, quote))

        //  append elements to blockquote first
        quoteBlockquote.append(quoteP, quoteAuthorFooter, quoteBreak, likeBtn, editQuoteBtn, deleteQuoteBtn)
        // append blockquote to li
        quoteLi.append(quoteBlockquote)

        editQuoteBtn.addEventListener('click', e => {
            if (quoteLi.lastChild.tagName !== 'FORM') {
                createAndAppendEditForm(e, quoteLi, quote)
            } else {
                removeFormFromQuoteLi(quoteLi)
            }
        })
        
        return quoteLi
    }

    // Submit Form to add new Quote
    function handleSubmitNewQuote(e) {
        e.preventDefault()
        const newQuote = e.target[0].value
        const newQuoteAuthor = e.target[1].value
        let newQuoteData = {
            "quote": newQuote,
            "author": newQuoteAuthor,
        }
        e.target.reset()
        API.post(QUOTES_BASE_URL, newQuoteData).then(appendQuoteToList)
    }

    // Delete a quote
    function handleDeleteButtonClick(e, quote) {
        e.preventDefault()
        let quoteLi = e.target.parentNode.parentNode
        API.destroy(QUOTES_BASE_URL, quote.id).then(quote => removeNode(quoteLi))
    }

    function removeNode(nodeToRemove) {
        nodeToRemove.remove()
    }

    // Like a quote (post to likes url)
    function handleLikeBtnClick(e, quote) {
        e.preventDefault()
        let data = {
            "quoteId": quote.id,
            "createdAt": Date.now()
        }
        API.post(LIKES_BASE_URL, data).then(like => incrementLikes(like))
    }

    function incrementLikes(like) {
        const likesSpan = document.querySelector(`span[data-quote-id="${like.quoteId}"]`)
        let likeNum = parseInt(likesSpan.innerText)
        likesSpan.innerText = ++likeNum
    }

    // Edit Form

    function createAndAppendEditForm(e, quoteLi, quote) {
        e.preventDefault()
        let form = createEditForm(quote)
        quoteLi.append(form)
    }

    function createEditForm(quote) {
        const currentQuote = document.querySelector(`p[data-quote-id="${quote.id}"]`).innerText
        const currentAuthor = document.querySelector(`footer[data-quote-id="${quote.id}"]`).innerText

        let form = document.createElement('form')
        form.dataset.id = quote.id

        let textDiv = document.createElement('div')
        textDiv.classList.add('form-group')

        let textLabel = document.createElement('label')
        textLabel.innerText = "Edit Quote"

        let quoteText = document.createElement('input')
        quoteText.setAttribute('type', 'text')
        quoteText.classList.add('form-control')
        quoteText.value = currentQuote

        textDiv.append(textLabel, quoteText)

        let authorDiv = document.createElement('div')
        authorDiv.classList.add('form-group')

        let authorLabel = document.createElement('label')
        authorLabel.innerText = "Author"

        let authorText = document.createElement('input')
        authorText.setAttribute('type', 'text')
        authorText.classList.add('form-control')
        authorText.value = currentAuthor

        authorDiv.append(authorLabel, authorText)

        let submitBtn = document.createElement('button')
        submitBtn.setAttribute('type', 'submit')
        submitBtn.classList.add('btn-primary', 'btn')
        submitBtn.innerText = "Submit"

        // event listener to patch quote
        form.addEventListener('submit', e => handleEditQuoteFormSubmit(e))

        form.append(textDiv, authorDiv, submitBtn)

        return form

    }

    // remove edit form from quote li
    function removeFormFromQuoteLi(quoteLi) {
        quoteLi.lastChild.remove()
    }

    // send patch request to edit quote
    function handleEditQuoteFormSubmit(e) {
        e.preventDefault()
        let id = e.target.dataset.id
        let quote = e.target[0].value
        let author = e.target[1].value
        let data = {
            quote,
            author
        }
        e.target.remove()
        API.patch(QUOTES_BASE_URL, id, data).then(renderEditChangesToQuote)
    }

    function renderEditChangesToQuote(quote) {
        const quoteP = document.querySelector(`p[data-quote-id="${quote.id}"`)
        const quoteAuth = document.querySelector(`footer[data-quote-id="${quote.id}"`)
        quoteP.innerText = quote.quote
        quoteAuth.innerText = quote.author
    }

    // Toggle sort by author button
    function handleSortToggle(e) {
        if (e.target.innerText === 'OFF') {
            e.target.innerText = "ON"
            e.target.className = "btn-info"
            removeCurrentQuoteList()
            getAndRenderSortedQuotes()
        } else {
            e.target.innerText = "OFF"
            e.target.className = "btn-dark"
            removeCurrentQuoteList()
            getAndRenderAllQuotes()
        }
    }

    function removeCurrentQuoteList() {
        while (quotesList.firstChild) quotesList.removeChild(quotesList.firstChild)
    }

    function getAndRenderSortedQuotes() {
        get(`${QUOTES_BASE_URL}${EMBED_LIKES_QUERY}${SORT_BY_AUTHOR}`).then(createAndAppendAllQuoteLis)
    }

    // Eventlisteners and Action Calls ----

    getAndRenderAllQuotes()

    newQuoteForm.addEventListener('submit', handleSubmitNewQuote)

    sortBtn.addEventListener('click', handleSortToggle)

})