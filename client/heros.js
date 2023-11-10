// heros.js or the name of your client-side JavaScript file

// Function to create a card for a superhero
// Modify this function to accept the imageUrl as a parameter
function createSuperheroCard(superhero, imageUrl) {
    return `
        <div class="card">
            <img src="${imageUrl}" alt="Image of ${superhero.name}" class="card-img-top">
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
    console.log(document.querySelector('textarea[name="n"]'))
    const n = document.querySelector('textarea[name="n"]');
    console.log(n); // This should log the textarea element to the console
    let searchByVal = searchBySelect.options[searchBySelect.selectedIndex].value;
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
        const nValue = n.value; // Get the current value of the 'n' input
        let url = new URL('http://localhost:3000/api/superheroes/search');
        
        // Use URLSearchParams to construct the query string
        let params = new URLSearchParams({
            searchTerm: searchTerm,
            searchBy: searchByVal,
            sortBy: sortByVal,
            n: nValue // Add the 'n' parameter
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
                // Get all image URLs in parallel
                const imageFetchPromises = data.map(superhero => {
                    return fetch(`http://localhost:3000/api/superhero-image-by-name/${encodeURIComponent(superhero.name)}`)
                        .then(response => response.json())
                        .then(imageData => {
                            return { ...superhero, imageUrl: imageData.imageUrl }; // Combine the superhero data with its image URL
                        });
                });
    
                // Wait for all image URLs to be fetched
                return Promise.all(imageFetchPromises);
            })
            .then(superheroesWithImages => {
                const resultsContainer = document.getElementById('searchResults');
                resultsContainer.innerHTML = ''; // Clear previous results
    
                // Now we have all the superhero data with image URLs
                superheroesWithImages.forEach(superhero => {
                    resultsContainer.innerHTML += createSuperheroCard(superhero, superhero.imageUrl);
                });
            })
            .catch(error => {
                const resultsContainer = document.getElementById('searchResults');
                resultsContainer.textContent = 'An error occurred: ' + error.message;
            });
    });
    
});