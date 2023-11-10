const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createSuperHeroList, SuperHeroList, addSuperHeroToList, removeSuperHeroFromList } = require('./db.js');
const fetch = require('node-fetch'); 
const db = require('./db'); 
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Utility function to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// Function to build the query based on the search term and search by field
function buildQuery(searchTerm, searchBy) {
  let query = {};
  if (searchBy === 'id') {
    // Attempt to convert the search term to a number for 'id' search
    let searchTermNumber = Number(searchTerm);
    if (!isNaN(searchTermNumber)) {
      // If it's a number, use it for the 'id' query
      query.id = searchTermNumber;
    }
    // If conversion to number fails and there's still a searchTerm and searchBy, proceed to regex
  } 
  if (searchTerm && searchBy && searchBy !== 'id') {
    const escapedSearchTerm = escapeRegExp(searchTerm);
    const searchTermRegex = new RegExp('^' + escapedSearchTerm, 'i');
    
    // Assign the regex to the correct field in the query object
    query[searchBy] = searchTermRegex;
  }
  console.log(query);
  return query;
}
// REST API endpoint to get all unique publisher names
app.get('/api/publishers', async (req, res) => {
  try {
    const publishers = await db.SuperHero.distinct('publisher');
    res.json(publishers);
  } catch (err) {
    console.error('Error during database query:', err);
    res.status(500).send('Error fetching publishers');
  }
});

// This route will act as a proxy to get around the CORS issue and search by name
app.get('/api/superhero-image-by-name/:superheroName', async (req, res) => {
  const { superheroName } = req.params;
  const accessToken = '2088884981475988'; //access token
  try {
    const searchUrl = `https://superheroapi.com/api/${accessToken}/search/${encodeURIComponent(superheroName)}`;
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error('Failed to search superhero');
    }
    const searchData = await searchResponse.json();
    if (searchData.response === 'success' && searchData.results.length > 0) {
      const imageUrl = searchData.results[0].image.url;
      res.json({ imageUrl });
    } else {
      res.json({ imageUrl: 'imagenotfound.jpeg' }); // Send a default image
    }
  } catch (error) {
    if (!res.headersSent) {
      console.error('Error fetching superhero image by name:', error);
      res.status(500).send('Internal server error');
    }
  }
});

// REST API endpoint to get superhero powers by ID
app.get('/api/superhero/:id', async (req, res) => {
  const { id } = req.params;
  let superheroId = parseInt(id);

  if (isNaN(superheroId)) {
    return res.status(400).send('Invalid Superhero ID');
  }
  console.log(`Fetching superhero with ID: ${superheroId}`);
  try {
    let superhero = await db.SuperHero.findOne({ id: superheroId })
      .populate('powers')
      .select('-id -hero_names')
      .exec();

    // Check if superhero exists before sending a response
    if (!superhero) {
     
      return res.status(404).send('Superhero not found');
    }

    // Send response
    res.json({
      name: superhero.name,
      powers: superhero.powers
    });

  // Proper error handling for asynchronous operations
  } catch (err) {
    console.error('Error during database query:', err);
    // If headers were already sent, you should not try to send another response.
    // It's good to check if headers have been sent before trying to send an error response.
    if (!res.headersSent) {
      res.status(500).send('Error fetching superhero');
    }
  }
});


// REST API endpoint to search for superheroes
app.get('/api/superheroes/search', async (req, res) => {
  // Destructure the searchTerm, searchBy, sortBy, and n from req.query
  const { searchTerm, searchBy, sortBy, n } = req.query;
  console.log(`Searching for: ${searchTerm}, by ${searchBy}, sorted by ${sortBy}, limit: ${n}`);

  if (!searchTerm || !searchBy) {
    return res.status(400).send('Search term and field are required');
  }

  // Convert n to an integer. Default to 0, which means no limit in MongoDB.
  const limit = parseInt(n, 10) || 0;

  const query = buildQuery(searchTerm, searchBy);
  let sort = {};
  if (sortBy) {
    sort[sortBy] = 1; // or -1 for descending
  }

  try {
    // Apply the limit if it's greater than 0
    let queryBuilder = db.SuperHero.find(query).collation({ locale: 'en', strength: 2 }).sort(sort);
    if (limit > 0) {
      queryBuilder = queryBuilder.limit(limit);
    }
    let superheroes = await queryBuilder.exec();

    if (superheroes.length > 0) {
      res.json(superheroes);
    } else {
      res.status(404).send('No superheroes found');
    }
  } catch (err) {
    console.error('Error during database query:', err);
    res.status(500).send('Error fetching superheroes');
  }
});


// Endpoint to create a new list
app.post('/api/lists', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('List name is required');
  }

  try {
    // Use the createSuperHeroList function from db.js
    const result = await createSuperHeroList(name);
    if (result.error) {
      console.error('List creation error:', result.error);
      return res.status(400).json({ error: result.error });
    }


    // If the list was created successfully, return the new list
    res.status(201).json(result.data);
  } catch (err) {
    console.error('Error during list creation:', err);
    res.status(500).json({ error: err.message });
  }
  
});

// Endpoint to delete a list
app.delete('/api/lists/:name', async (req, res) => {
  const listName = req.params.name;

  try {
    await SuperHeroList.findOneAndDelete({ name: listName });
    res.status(200).json({ message: `List "${listName}" deleted successfully!` });
  } catch (err) {
    console.error('Error during database operation:', err);
    res.status(500).send('An error occurred while deleting the list.');
  }
});

app.delete('/api/lists/:listName/heroes/:heroId', async (req, res) => {
  try{
  const { listName, heroId } = req.params;
      await removeSuperHeroFromList(heroId, listName);
      res.status(200).send(`Hero with ID ${heroId} removed from list '${listName}'`);
  } catch (error) {
      res.status(500).send(error.message);
  }
});




// Endpoint to add a superhero to a list
app.post('/api/lists/:name/heroes', async (req, res) => {
  const { name } = req.params; // The name of the list
  const { heroId } = req.body; // The ID of the hero to add

  if (!heroId) {
    return res.status(400).send('Superhero ID is required');
  }

  try {
    // Add superhero to list using the function from db.js
    const list = await addSuperHeroToList(heroId, name);

    // If the list is null, it means the superhero wasn't found or couldn't be added
    if (!list) {
      return res.status(404).send('Superhero not found or list could not be updated');
    }

    // If the function was successful, send back the updated list
    res.status(200).json(list);
  } catch (err) {
    console.error('Error adding hero to list:', err);
    res.status(500).send('Error adding hero to list');
  }
});

app.get('/api/lists/:name', async (req, res) => {
  const listName = req.params.name;
  try {
    const list = await SuperHeroList.findOne({ name: listName });
    await list.populateSuperheroes();

    if (!list) {
      return res.status(404).send('List not found');
    }
    res.json(list);
  } catch (error) {
    console.error('Server error:', error); // This will log the error to the console
    res.status(500).send(`An error occurred on the server: ${error.message}`);
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up and running, listening on port ${port}`);
});
