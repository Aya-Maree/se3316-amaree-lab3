

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchBox = document.querySelector('[name="superID"]');

    searchButton.addEventListener('click', function() {
        console.log("HI")
        const superId = searchBox.value.trim(); // Get the ID from the textarea
        if (superId) {
            fetchSuperHero(superId);
        } else {
            alert('Please enter a Superhero ID.');
        }
    });
});

function fetchSuperHero(id) {
    // Replace `/api/superhero` with your actual server endpoint
    fetch(`http://localhost:3000/api/superhero/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data); // Log the response data
            if (data) {
                displayResults(data);
            } else {
                displayNoResults();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayResults(heroData) {
    delete heroData._id;
    delete heroData.hero_names;
    console.log(heroData)
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    const heroCard = document.createElement('div');
    heroCard.className = 'hero-card';

    const heroName = document.createElement('h2');
    heroName.textContent = heroData.name;

    const powersList = document.createElement('ul');

    if (typeof heroData.powers === 'object' && heroData.powers !== null) {
        for (const [power, hasPower] of Object.entries(heroData.powers)) {
            if (hasPower) { // If the hero has this power
                const powerItem = document.createElement('li');
                powerItem.textContent = power.replace(/_/g, ' '); // Replace underscores with spaces for better readability
                powersList.appendChild(powerItem);
            }
        }
    } else {
        console.error('Unexpected data type for powers:', heroData.powers);
    }

    heroCard.appendChild(heroName);
    heroCard.appendChild(powersList);
    resultsContainer.appendChild(heroCard);
}
