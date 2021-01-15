const url = 'http://www.omdbapi.com/?apikey=c2f7fbf8'
const form = document.getElementById('form')




function searchRequest(term) {
    
    const searchTitleUrl = encodeURI(`${url}&s=${term}`)
    fetch(searchTitleUrl)
    .then (res => res.json())
    .then (data => {
        for (let object of data.Search) {
            displayResults(object)
        }
    })
}

function displayResults(object) {
    const searchResultsContainer = document.getElementById('search-results-container')

    const movieInstance = document.createElement('div')
    movieInstance.classList.add('movie-instance-container')
    searchResultsContainer.append(movieInstance)
    
    const movieTitle = document.createElement('div')
    movieTitle.innerHTML = object.Title
    movieInstance.append(movieTitle)

    const movieDate = document.createElement('div')
    movieDate.innerHTML = object.Year
    movieInstance.append(movieDate)

    const nominateButton = document.createElement('button')
    nominateButton.innerText = "Nominate"
    nominateButton.classList.add('nominate-button')
    
    nominateButton.addEventListener('click', event => {
        // show/hide movie instance contaner
        movieInstance.style.display = 'none'
        
        // counter for nomination limit
        const nominationListContainer = document.getElementById('nomination-list-container')
        const nominantionCount = nominationListContainer.children.length
        console.log(nominantionCount)
        
        const banner = document.querySelector('#banner')
        if (nominantionCount > 5) {
            banner.style.display = "block"
            console.log("banner triggered", banner)
            return
        }
        
        nominatedTitle = event.target.previousSibling.previousSibling.innerHTML
        nominatedDate = event.target.previousSibling.innerHTML
        addNominationCard(nominatedTitle, nominatedDate, nominationListContainer)
    })
    movieInstance.append(nominateButton)
}

function addNominationCard(title, date, nominationListContainer) {
    
    const nominatonCards = document.createElement('div')
    nominationListContainer.append(nominatonCards)

    const nomination = document.createElement('div')
    nomination.innerHTML = `${title} (${date})`
    nomination.classList.add('card-to-be-saved')
    nominatonCards.append(nomination)

    // collect the cards to be saved and pass them to the next stage
    const cardsToBeSaved = document.querySelectorAll('.card-to-be-saved')
    
    
    // ********* Remove nomination and button *********
    const removeButton = document.createElement('button')
    removeButton.innerText = "Remove"
    removeButton.classList.add('remove-button')
    
    
    removeButton.addEventListener('click', event => {
        // show movie instance again inside search results container
        const movieInstances = document.querySelectorAll('.movie-instance-container')
        for (let movieInstance of movieInstances) {
            movieInstance.style.display = 'flex'
        }
        
        
        // remove movie instance from nomination container
        itemToRemove = event.target.parentElement
        console.log(itemToRemove)
        itemToRemove.remove()
        const banner = document.querySelector('#banner')
        banner.style.display = "none"

        // removeNomination(itemToRemove)
    })
    nominatonCards.append(removeButton)

    // console.log('cards saved: ', cardsToBeSaved);

    saveNominations(cardsToBeSaved)
}
    // ********* Remove nomination and button *********

    // ********* Submit Nominations *********
function saveNominations(finalNominations, nomination) {

    const cardsToBeSaved = document.querySelectorAll('.card-to-be-saved')

    const submitNomsButton = document.getElementById('submit-noms-form')
    submitNomsButton.addEventListener('click', event => {
        event.preventDefault()
        const finalList = cardsToBeSaved[cardsToBeSaved.length - 1]

        const savedNominationsContainer = document.getElementById('saved-nominations')
        savedNominationsContainer.append(finalList)
        
    })
}
    

// ********* Submit Nominations *********

// ***************************************************************************
//                         API Interactions
// ***************************************************************************
const url = 'http://127.0.0.1:8080'

function saveNominations() {
    fetch()
}





// ***************************************************************************
//                         Call to Start Program
// ***************************************************************************
form.addEventListener('submit', event => {
    event.preventDefault()
    console.log('button was clicked')
    document.querySelector('#search-results-container').innerHTML = ''
    const searchInput = document.getElementById('input')
    let term = searchInput.value
    console.log(term)
    searchRequest(term)
})