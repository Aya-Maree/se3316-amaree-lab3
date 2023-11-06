const mongoose = require('mongoose');
const { SuperHero, SuperheroPowers } = require('./db.js'); // Adjust the path to where your db.js file is located
const superheroPowersData = require('./data/superhero_powers.json'); // Adjust the path to your JSON file
const superheroInfoData = require('./data/superhero_info.json'); // Adjust the path to your JSON file

// Convert string values of "True" and "False" to actual Boolean values
const toBoolean = (value) => value === "True";

// Connect to MongoDB
mongoose.connect('mongodb://localhost/superheroes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Clear the database
const clearDatabase = async () => {
  await SuperHero.deleteMany({});
  await SuperheroPowers.deleteMany({});
  console.log('Database cleared');
};

// Insert superhero powers data
const insertSuperheroPowers = async () => {
    for (const powers of superheroPowersData) {
      // Initialize the transformed powers with the name, if it exists.
      const transformedPowers = powers.hero_names ? { hero_names: powers.hero_names } : {};
  
      // Transform and insert the rest of the powers.
      for (const [key, value] of Object.entries(powers)) {
        if (key !== 'hero_names') { // Skip the hero_names field for boolean conversion
          const fieldName = key.replace(/\s+/g, '_').replace(/-/g, '');
          transformedPowers[fieldName] = toBoolean(value);
        }
      }
  
      const superheroPower = new SuperheroPowers(transformedPowers);
      await superheroPower.save();
    }
    console.log('Superhero powers data has been inserted');
  };
  

// Insert superhero info data
// Insert superhero info data
// Insert superhero info data
const insertSuperheroInfo = async () => {
  try {
    for (const info of superheroInfoData) {
      const {
        id,
        name,
        Gender: gender,
        'Eye color': eyeColor,
        Race: race,
        'Hair color': hairColor,
        Height: height,
        Publisher: publisher,
        'Skin color': skinColor,
        Alignment: alignment,
        Weight: weight
      } = info;

      // Find the corresponding power document
      const powerDocument = await SuperheroPowers.findOne({
        hero_names: name
      });

      if (!powerDocument && superheroPowersData.some(p => p.name === name || p.id === id)) {
        console.error(`Powers not found for superhero ${name}`);
        // If it's expected, you might want to continue to the next superhero
        // continue; // Uncomment this if you want to continue the loop
      }

      const superhero = new SuperHero({
        id,
        name,
        gender,
        eyeColor,
        race,
        hairColor,
        height,
        publisher,
        skinColor,
        alignment,
        weight,
        powers: powerDocument ? powerDocument._id : undefined // Set to undefined if not found
      });
  
      await superhero.save();
    }
    console.log('Superhero info data has been inserted');
  } catch (error) {
    console.error('Error inserting superhero info:', error);
  }
};

  
// Execute the clear and insert operations
const executeDatabaseOperations = async () => {
  try {
    await clearDatabase();
    await insertSuperheroPowers();
    await insertSuperheroInfo();
    console.log('Database operations completed successfully');
  } catch (error) {
    console.error('An error occurred during database operations', error);
  } finally {
    // Close the Mongoose connection
    mongoose.connection.close();
  }
};

executeDatabaseOperations();
