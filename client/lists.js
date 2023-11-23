document.addEventListener('DOMContentLoaded', function() {
    const listName = document.getElementById('listName');
    const heroId = document.getElementById('superID');
    const createBtn = document.getElementById('createBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const addHeroBtn = document.getElementById('addHero');
    const deleteHeroBtn = document.getElementById('deleteHero');

    function getBaseUrl() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        } else {
            return 'http://50.17.44.156:3000';
        }
    }
    

    createBtn.addEventListener('click', function() {
        // Validate list name
        if (listName.value.trim() === '') {
            alert('Please enter a list name.');
            return;
        }
    
        // Make an AJAX call to your server to create a new list
        fetch(`${getBaseUrl()}/api/lists`, { // Using 'localhost' here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: listName.value }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // This will handle non-JSON responses or any other HTTP errors
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .then(data => {
            console.log(data); // handle your response data
            alert(`List "${listName.value}" created successfully!`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the list: ' + error);
        });
    });
    
    // Assuming your server's DELETE endpoint expects just the name in the URL
    deleteBtn.addEventListener('click', function() {
        // Make an AJAX call to your server to delete the list
        fetch(`${getBaseUrl()}/api/lists/${listName.value}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Server error') });
            }
            return response.json();
        })
        .then(data => {
            alert(`List "${listName.value}" deleted successfully!`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the list: ' + error.message);
        });
    });
    
    addHeroBtn.addEventListener('click', async function () {
        if (listName.value.trim() === '') {
            alert('Please enter a list name.');
            return;
        }
        if (heroId.value.trim() === '') {
            alert('Please enter a hero ID.');
            return;
        }
    
        // Assume you have a function to check if the hero exists in the database
        const heroExists = await checkHeroInDatabase(heroId.value.trim());
        if (!heroExists) {
            alert('Hero ID does not exist in the SuperHero database.');
            return;
        }
    
        // If everything is okay, proceed to add the hero to the list by making a POST request to the server
        try {
            const response = await fetch(`${getBaseUrl()}/api/lists/${listName.value.trim()}/heroes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ heroId: heroId.value.trim() }), // Send heroId in the request body
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            alert('Hero added to the list successfully.');
        } catch (error) {
            alert('There was an error adding the hero to the list: ' + error.message);
        }
    });

    deleteHeroBtn.addEventListener('click', async function() {
        const listNameValue = listName.value.trim();
        const heroIdValue = heroId.value.trim();
    
        if (listNameValue === '') {
            alert('Please enter a list name.');
            return;
        }
        if (heroIdValue === '') {
            alert('Please enter a hero ID.');
            return;
        }
    
        const heroExists = await checkHeroInDatabase(heroIdValue);
        if (!heroExists) {
            alert('Hero ID does not exist in the SuperHero database.');
            return;
        }
    
        // Now call the function with the values
        deleteHeroFromList(heroIdValue, listNameValue);
    });
    
    function deleteHeroFromList(heroId, listName) {
        fetch(`${getBaseUrl()}/api/lists/${listName}/heroes/${heroId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            // Here you would also update the DOM to reflect the removed hero
        })
        .catch(error => {
            console.error('There was a problem removing the hero from the list:', error);
        });
    }

    // This function checks the database for the hero ID
    async function checkHeroInDatabase(heroId) {
        try {
        const response = await fetch(`${getBaseUrl()}/api/superhero/${heroId}`);
    
        if (!response.ok) {
            if (response.status === 404) {
            return false; // Hero does not exist
            }
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
    
        // If the response is ok, we assume the hero data is returned and hence the hero exists
        // You do not necessarily need to use the JSON data here if you're only checking for existence
        await response.json();
        return true;
        } catch (error) {
        console.error('Error checking hero in database:', error);
        return false;
        }
    }       

    
});
function getBaseUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    } else {
        return 'http://50.17.44.156:3000';
    }
}
async function fetchAndDisplayList(listName) {
    try {
      // Fetch the superhero list from the server
      const response = await fetch(`${getBaseUrl()}/api/lists/${listName}`);
      if (!response.ok) {
        throw new Error('List not found');
      }
      const list = await response.json();
  
      const resultBox = document.getElementById('searchResults');
      resultBox.innerHTML = ''; // Clear previous results
  
      // Fetch and display each superhero with their image
      for (const hero of list.superheroes) {
        const imageUrl = await fetchSuperheroImageByName(hero.name);
        const heroCardHTML = createSuperheroCard(hero, imageUrl);
        resultBox.insertAdjacentHTML('beforeend', heroCardHTML);
      }
  
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  async function fetchSuperheroImageByName(superheroName) {
    try {
      // This URL should point to your Express server's new route
      const imageUrlResponse = await fetch(`${getBaseUrl()}/api/superhero-image-by-name/${encodeURIComponent(superheroName)}`);
      if (!imageUrlResponse.ok) {
        throw new Error('Failed to fetch image from proxy');
      }
      const imageJson = await imageUrlResponse.json();
      return imageJson.imageUrl;
    } catch (error) {
      console.error('Failed to fetch image:', error);
      return ''; // Return an empty string or a placeholder image URL if the fetch fails
    }
  }
  
  
  
  function createSuperheroCard(superhero, imageUrl) {
    return `
      <div class="card">
        <img src="${imageUrl}" alt="${superhero.name}" class="card-img-top">
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
  
  
function toggleRadio(radio) {
    // Get the current state of the clicked radio button
    let wasChecked = radio.dataset.wasChecked;

    // Get all radio buttons
    let radios = document.getElementsByName(radio.name);

    // Unset the 'wasChecked' attribute for all radios
    radios.forEach((r) => r.dataset.wasChecked = "false");

    // If the button was already checked, clear the selection
    if (wasChecked === "true") {
        radio.checked = false;
        radio.dataset.wasChecked = "false";
         // Call the function to fetch and display the list
         fetchAndDisplayList(listName.value);
    } else {
        radio.checked = true;
        radio.dataset.wasChecked = "true";
    }
}
