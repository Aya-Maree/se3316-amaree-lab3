// heros.js or the name of your client-side JavaScript file

// Function to create a card for a superhero
function createSuperheroCard(superhero) {
    return `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${superhero.name}</h5>
                <p class="card-text">Gender: ${superhero.gender}</p>
                <p class="card-text">Eye Color: ${superhero.eyeColor}</p>
                <p class="card-text">Race: ${superhero.race}</p>
                <p class="card-text">Hair Color: ${superhero.hairColor}</p>
                <p class="card-text">Height: ${superhero.height} cm</p>
                <p class="card-text">Publisher: ${superhero.publisher}</p>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    // Access the DOM elements after the DOM has been fully loaded
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.querySelector('textarea[name="searchInput"]');
    const sortBySelect = document.getElementById('sortBy');
    const searchBySelect = document.getElementById('searchOptions');
    
    let searchByVal = ''; // Initialize variable to hold the current searchBy value
    let sortByVal = ''; // Initialize variable to hold the current sortBy value

    searchBySelect.addEventListener('change', function() {
        searchByVal = this.value; // Update the value when the selection changes
        console.log('Search By Value: ', searchByVal);
    });

    sortBySelect.addEventListener('change', function() {
        sortByVal = this.value; // Update the value when the selection changes
        console.log('Sort By Value: ', sortByVal);
    });

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value; // Get the current value of the search input
        let url = new URL('http://localhost:3000/api/superheroes/search');
        
        // Use URLSearchParams to construct the query string
        let params = new URLSearchParams({
            searchTerm: searchTerm,
            searchBy: searchByVal,
            sortBy: sortByVal
        });

        // Append the query string to the URL
        url.search = params.toString();

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const resultsContainer = document.getElementById('searchResults');
                resultsContainer.innerHTML = ''; // Clear previous results
                // Loop through the superheroes and create cards
                data.forEach(superhero => {
                    resultsContainer.innerHTML += createSuperheroCard(superhero);
                });
            })
            .catch(error => {
                const resultsContainer = document.getElementById('searchResults');
                resultsContainer.textContent = 'An error occurred: ' + error.message;
            });
    });
});