document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchBox = document.querySelector('[name="superID"]');
    const publishersButton = document.getElementById('getPublishers');
    publishersButton.addEventListener('click', function() {

        fetchPublishers();
    });
    searchButton.addEventListener('click', function() {
    
        const superId = searchBox.value.trim(); // Get the ID from the textarea
        if (superId) {
            fetchSuperHero(superId);
        } else {
            alert('Please enter a Superhero ID.');
        }
    });
});

function getBaseUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    } else {
        return 'http://50.17.44.156:3000';
    }
}


function fetchSuperHero(id) {
    fetch(`${getBaseUrl()}/api/superhero/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data); 
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
function fetchPublishers() {
    fetch(`${getBaseUrl()}api/publishers`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log("Publishers Data:", data); // Log the publisher data
            displayPublishers(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayPublishers(publishersData) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Create a publishers card similar to hero card for styling
    const publishersCard = document.createElement('div');
    publishersCard.className = 'hero-card'; // Use the same class as for the superhero

    // Add a title for the publishers list if you want
    const publishersTitle = document.createElement('h2');
    publishersTitle.textContent = 'Publishers';
    publishersCard.appendChild(publishersTitle);

    const publishersList = document.createElement('ul');

    publishersData.forEach(publisher => {
        const publisherItem = document.createElement('li');
        publisherItem.textContent = publisher;
        // Here, you might want to apply specific styles to each publisher list item if needed
        publishersList.appendChild(publisherItem);
    });

    publishersCard.appendChild(publishersList);
    resultsContainer.appendChild(publishersCard);
}
