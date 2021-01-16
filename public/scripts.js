const url = 'http://www.omdbapi.com/?apikey=c2f7fbf8'
const form = document.getElementById('form')

let savedNominations = []


// ***************************************************************************
//                         OMDB API Request
// ***************************************************************************
function searchRequest(term) {
    const noMovieFoundAlert = document.getElementById('movie-not-found-banner')
    const searchTitleUrl = encodeURI(`${url}&s=${term}`)
    fetch(searchTitleUrl)
    .then (res => res.json())
    .then (data => {
        // console.log(data.Error)
        if (data.Error) {
            noMovieFoundAlert.style.display = 'block'
        }
        else{
            for (let movie of data.Search) {
                displayResults(movie)
        }
        
        }
    })
    
}
// ***************************************************************************
//                         OMDB API Request
// ***************************************************************************


// ***************************************************************************
//                         Display Results of API Request
// ***************************************************************************
function displayResults(movie) {
    const searchResultsContainer = document.getElementById('search-results-container')

    const movieInstance = document.createElement('div')
    movieInstance.classList.add('movie-instance-container')
    searchResultsContainer.append(movieInstance)
    
    const titleDateContainer = document.createElement('div')
    titleDateContainer.classList.add('title-date-container')
    movieInstance.append(titleDateContainer)

    const movieTitle = document.createElement('div')
    movieTitle.innerHTML = movie.Title
    movieTitle.classList.add('movie-title-font')
    titleDateContainer.append(movieTitle)

    const movieDate = document.createElement('div')
    movieDate.innerHTML = movie.Year
    movieDate.classList.add('movie-title-font')
    titleDateContainer.append(movieDate)

    // Check to see if the movie is in the nominated list
    // if it is stop by returning here
    const matchingNomination = savedNominations.find((savedNomination) => {
        // remove `() on movie.Year
        return movie.Title === savedNomination.title &&
            `(${movie.Year})` === savedNomination.date
    })   

    if (matchingNomination) {
        return
    }

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
        
        const banner = document.querySelector('#warning-banner')
        if (nominantionCount > 5) {
            banner.style.display = "block"
            console.log("banner triggered", banner)
            return
        }
        
        addNominationCard(movie.Title, movie.Year, nominationListContainer, movieInstance)
    })
    movieInstance.append(nominateButton)
}

// ***************************************************************************
//            Add/Remove selected movies into user nomination container
// ***************************************************************************
function addNominationCard(title, date, nominationListContainer, movieInstance) {
    
    const nominationCards = document.createElement('div')
    nominationListContainer.append(nominationCards)

    const nominationCard = document.createElement('div')
    nominationCard.classList.add('card-to-be-saved')
    nominationCards.append(nominationCard)

    const nominationTitle = document.createElement('div')
    nominationTitle.innerHTML = `${title}`
    nominationTitle.classList.add('title-to-be-saved')
    nominationTitle.classList.add('movie-title-font')
    nominationCard.append(nominationTitle)

    const nominationDate = document.createElement('div')
    nominationDate.innerHTML = `(${date})`
    nominationDate.classList.add('date-to-be-saved')
    nominationDate.classList.add('movie-title-font')
    nominationCard.append(nominationDate)

    // ********* Remove nomination and button *********
    const removeButton = document.createElement('button')
    removeButton.innerText = "Remove"
    removeButton.classList.add('remove-button')


    removeButton.addEventListener('click', event => {
        // show movie instance again inside search results container
        const movieInstances = document.querySelectorAll('.movie-instance-container')
        movieInstance.style.display = 'flex'
        
        
        // remove movie instance from nomination container
        itemToRemove = event.target.parentElement
        console.log(itemToRemove)
        itemToRemove.remove()
        const banner = document.querySelector('#warning-banner')
        banner.style.display = "none"

        // removeNomination(itemToRemove)
    })
    nominationCard.append(removeButton)
  
    
    

    
    
    
}



// collect the cards to be saved and pass them to the next stage
    

const submitNomsButton = document.getElementById('submit-noms-form')
submitNomsButton.addEventListener('click', event => {
    event.preventDefault()
    const cardsToBeSaved = document.querySelectorAll('.card-to-be-saved')
    for (let card of cardsToBeSaved) {
        console.log('ctbsaved', card.children[0].innerText)
        console.log('ctbsaved', card.children[1].innerText)
        const title = card.children[0].innerText
        const date = card.children[1].innerText
        postNominations(title, date)
    }

    // show thanks-banner
    const thanksBanner = document.getElementById('thanks-banner')
    thanksBanner.style.display = 'block'
    
    // hide the "remove button" "submit noms button" and "nom buttons"
    const hideRemoveButtons = document.querySelectorAll('.remove-button')
    for (let button of hideRemoveButtons) {
        button.style.display = 'none'
    }
    const hideSubmitNomsButton = document.getElementById('submit-noms-button')
    hideSubmitNomsButton.style.display = 'none'
    
    const hideNominateButtons = document.querySelectorAll('.nominate-button')
    for (let nombutton of hideNominateButtons) {
        nombutton.style.display = 'none'
    }
    
})



 // ***************************************************************************
//         Display saved nominations in saved container
// ***************************************************************************
function displaySavedNominations(data) {
    const savedNominationsContainer = document.getElementById('saved-nominations')
    console.log('display function:', data)
    for (let movie of data) {
        const nomMovieTitle = movie.title
        const nomMovieDate = movie.date

        const savedInstances = document.createElement('div')
        savedInstances.classList.add('saved-instances')
        savedNominationsContainer.append(savedInstances)

        const savedTitleDate = document.createElement('div')
        savedTitleDate.innerHTML = `${nomMovieTitle} ${nomMovieDate}`
        savedInstances.append(savedTitleDate)
        
        
    }
    // const savedMovieTitle = title
    // const savedMovieDate = date
    // savedNominationsContainer.append(title)

}
    

// ********* Submit Nominations *********

// ***************************************************************************
//                         API Interactions
// ***************************************************************************
const serverUrl = 'http://127.0.0.1:3000/nominations'

function getNominations() {
    fetch(serverUrl)
    .then (res => {
       return res.json()
    })
    .then (data => {
        console.log('data', data)
        savedNominations = data;
        displaySavedNominations(data)
        })
}

function postNominations(title, date) {
    fetch(serverUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title: title, date: date })
    })
    .then (res => {
        return res.json()
    })
    .then (data => {
        console.log(data)
    })
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
    searchInput.value = ""
    console.log(term)
    searchRequest(term)
})

getNominations()