//importing the json data
const superheroData = require('./data/superhero_info.json');
const superheroPowersData = require('./data/superhero_powers.json');
//Creating a basic server
const express = require('express');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/superhero/:id', (req, res) => {
    const id = req.params.id;
    // Fetch superhero with the given ID from the JSON data and return
});

app.get('/superhero/:id/powers', (req, res) => {
    const id = req.params.id;
    // Fetch powers of the superhero with the given ID from the JSON data and return
});

