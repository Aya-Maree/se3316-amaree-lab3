const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Make sure this points to your database connection file
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
    // Escape the search term to avoid issues with special characters
    const escapedSearchTerm = escapeRegExp(searchTerm);
    const searchTermRegex = new RegExp('^' + escapedSearchTerm, 'i');
    
    // Assign the regex to the correct field in the query object
    query[searchBy] = searchTermRegex;
  }
  console.log(query);
  return query;
}
// REST API endpoint to get superhero powers by ID
app.get('/api/superhero/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching superhero with ID: ${id}`);

  if (!id) {
    return res.status(400).send('Superhero ID is required');
  }

  try {
    let superhero = await db.SuperHero.findOne({ id: Number(id) })
      .populate('powers')
      .select('-id -hero_names') // Excluding the 'id' and 'hero names' fields
      .exec();

    if (superhero) {
      res.json({
        name: superhero.name,
        // Here you will send only the powers because 'id' and 'hero names' are excluded
        powers: superhero.powers
      });
    } else {
      res.status(404).send('Superhero not found');
    }
  } catch (err) {
    console.error('Error during database query:', err);
    res.status(500).send('Error fetching superhero');
  }
});



// REST API endpoint to search for superheroes
app.get('/api/superheroes/search', async (req, res) => {
  const { searchTerm, searchBy, sortBy } = req.query;
  console.log(`Searching for: ${searchTerm}, by ${searchBy}, sorted by ${sortBy}`);

  if (!searchTerm || !searchBy) {
    return res.status(400).send('Search term and field are required');
  }

  const query = buildQuery(searchTerm, searchBy);
  let sort = {};
  if (sortBy) {
    sort[sortBy] = 1; // or -1 for descending
  }

  try {
    let superheroes = await db.SuperHero.find(query).collation({ locale: 'en', strength: 2 }).sort(sort).exec();
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

// ... any other routes or middleware ...

// Listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up and running, listening on port ${port}`);
});
