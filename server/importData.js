const mongoose = require('mongoose');
const { SuperHero, SuperheroPowers } = require('./db.js'); // Adjust the path to where your db.js file is located
const superheroPowersData = require('./server/data/superhero_powers.json'); // Adjust the path to your JSON file
const superheroInfoData = require('./server/data/superhero_info.json'); // Adjust the path to your JSON file

// A function to convert string values of "True" and "False" to actual Boolean values
const toBoolean = (value) => value === "True";

// Connect to MongoDB
//mongoose.connect('mongodb://localhost/superheroes', {     
//  useNewUrlParser: true,
 // useUnifiedTopology: true
//})
//.then(() => console.log('Connected to MongoDB...'))
//.catch(err => console.error('Could not connect to MongoDB...', err));

// A function to insert superhero info data
const insertSuperheroInfo = async () => {
  try {
    // Use the map method to iterate over each element in the superhero info array
    // and transform it into a format that can be inserted into the database
    const superheroInfoPromises = superheroInfoData.map(async (info) => {
      // Adjust the keys to match your schema if needed
      const { id, name, Gender: gender, 'Eye color': eyeColor, Race: race, 'Hair color': hairColor, Height: height, Publisher: publisher } = info;
      const superhero = new SuperHero({ id, name, gender, eyeColor, race, hairColor, height, publisher });
      return superhero.save(); // Save the superhero into the database
    });

    // Wait for all insert operations to complete
    await Promise.all(superheroInfoPromises);
    console.log('Superhero info data has been inserted');
  } catch (error) {
    console.error('Error inserting superhero info:', error);
  }
};

// A function to insert superhero powers data
const insertSuperheroPowers = async () => {
  try {
    // Use the map method to iterate over each element in the superhero powers array
    // and transform it into a format that can be inserted into the database
    const superheroPowersPromises = superheroPowersData.map(async (powers) => {
      // Create an object where the keys are the power names and the values are boolean
      const transformedPowers = Object.entries(powers).reduce((acc, [key, value]) => {
        // Replace spaces with underscores and remove hyphens to match the schema field names
        const fieldName = key.replace(/\s+/g, '_').replace(/-/g, '');
        acc[fieldName] = toBoolean(value); // Convert the string "True"/"False" to a boolean
        return acc;
      }, {});

      const superheroPower = new SuperheroPowers(transformedPowers);
      return superheroPower.save(); // Save the superhero powers into the database
    });

    // Wait for all insert operations to complete
    await Promise.all(superheroPowersPromises);
    console.log('Superhero powers data has been inserted');
  } catch (error) {
    console.error('Error inserting superhero powers:', error);
  }
};

// Call the functions to insert the data
insertSuperheroInfo();
insertSuperheroPowers();
