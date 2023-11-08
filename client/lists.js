document.addEventListener('DOMContentLoaded', function() {
    const listName = document.getElementById('listName');
    const heroId = document.getElementById('superID');
    const createBtn = document.getElementById('createBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const addHeroBtn = document.getElementById('addHero');
    const deleteHeroBtn = document.getElementById('deleteHero');

    createBtn.addEventListener('click', function() {
        // Validate list name
        if (listName.value.trim() === '') {
            alert('Please enter a list name.');
            return;
        }
    
        // Make an AJAX call to your server to create a new list
        fetch('http://localhost:3000/api/lists', { // Using 'localhost' here
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
        fetch(`http://localhost:3000/api/lists/${listName.value}`, {
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
            const response = await fetch(`http://localhost:3000/api/lists/${listName.value.trim()}/heroes`, {
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
        fetch(`http://localhost:3000/api/lists/${listName}/heroes/${heroId}`, {
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
    
    /*async function addHeroToList(heroId, listName) {
        try {
            const response = await fetch(`http://localhost:3000/api/lists/${listName}/heroes`, { // Adjusted endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ heroId }), // Assuming the backend expects an object with a heroId property
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data.message); // Log the success message from the server
        } catch (error) {
            console.error('There was an error adding the hero to the list:', error);
            throw error; // Rethrow the error so it can be caught by the calling function
        }
    }*/
    
    
    
    // This function simulates checking the database for the hero ID
    // This function checks the database for the hero ID
    async function checkHeroInDatabase(heroId) {
        try {
        const response = await fetch(`http://localhost:3000/api/superhero/${heroId}`);
    
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

    
    
  
      
    

// Your event listener here remains the same


    // Add other button event listeners similarly...
});
