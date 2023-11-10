// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/superheroes')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
    
const SuperHeroSchema = new mongoose.Schema({
    id: Number,
    name: String,
    gender: String,
    eyeColor: String,
    race: String,
    hairColor: String,
    height: Number,
    publisher: String,
    skinColor: String,
    alignment: String,
    weight: Number,
    powers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SuperheroPowers'
    }
});

const SuperheroPowersSchema = new mongoose.Schema({
    hero_names: String,
    Agility: Boolean,
    Accelerated_Healing: Boolean,
    Lantern_Power_Ring: Boolean,
    Dimensional_Awareness: Boolean,
    Cold_Resistance: Boolean,
    Durability: Boolean,
    Stealth: Boolean,
    Energy_Absorption: Boolean,
    Flight: Boolean,
    Danger_Sense: Boolean,
    Underwater_breathing: Boolean,
    Marksmanship: Boolean,
    Weapons_Master: Boolean,
    Power_Augmentation: Boolean,
    Animal_Attributes: Boolean,
    Longevity: Boolean,
    Intelligence: Boolean,
    Super_Strength: Boolean,
    Cryokinesis: Boolean,
    Telepathy: Boolean,
    Energy_Armor: Boolean,
    Energy_Blasts: Boolean,
    Duplication: Boolean,
    Size_Changing: Boolean,
    Density_Control: Boolean,
    Stamina: Boolean,
    Astral_Travel: Boolean,
    Audio_Control: Boolean,
    Dexterity: Boolean,
    Omnitrix: Boolean,
    Super_Speed: Boolean,
    Possession: Boolean,
    Animal_Oriented_Powers: Boolean,
    Weapon_based_Powers: Boolean,
    Electrokinesis: Boolean,
    Darkforce_Manipulation: Boolean,
    Death_Touch: Boolean,
    Teleportation: Boolean,
    Enhanced_Senses: Boolean,
    Telekinesis: Boolean,
    Energy_Beams: Boolean,
    Magic: Boolean,
    Hyperkinesis: Boolean,
    Jump: Boolean,
    Clairvoyance: Boolean,
    Dimensional_Travel: Boolean,
    Power_Sense: Boolean,
    Shapeshifting: Boolean,
    Peak_Human_Condition: Boolean,
    Immortality: Boolean,
    Camouflage: Boolean,
    Element_Control: Boolean,
    Phasing: Boolean,
    Astral_Projection: Boolean,
    Electrical_Transport: Boolean,
    Fire_Control: Boolean,
    Projection: Boolean,
    Summoning: Boolean,
    Enhanced_Memory: Boolean,
    Reflexes: Boolean,
    Invulnerability: Boolean,
    Energy_Constructs: Boolean,
    Force_Fields: Boolean,
    Self_Sustenance: Boolean,
    Anti_Gravity: Boolean,
    Empathy: Boolean,
    Power_Nullifier: Boolean,
    Radiation_Control: Boolean,
    Psionic_Powers: Boolean,
    Elasticity: Boolean,
    Substance_Secretion: Boolean,
    Elemental_Transmogrification: Boolean,
    Technopath_Cyberpath: Boolean,
    Photographic_Reflexes: Boolean,
    Seismic_Power: Boolean,
    Animation: Boolean,
    Precognition: Boolean,
    Mind_Control: Boolean,
    Fire_Resistance: Boolean,
    Power_Absorption: Boolean,
    Enhanced_Hearing: Boolean,
    Nova_Force: Boolean,
    Insanity: Boolean,
    Hypnokinesis: Boolean,
    Animal_Control: Boolean,
    Natural_Armor: Boolean,
    Intangibility: Boolean,
    Enhanced_Sight: Boolean,
    Molecular_Manipulation: Boolean,
    Heat_Generation: Boolean,
    Adaptation: Boolean,
    Gliding: Boolean,
    Power_Suit: Boolean,
    Mind_Blast: Boolean,
    Probability_Manipulation: Boolean,
    Gravity_Control: Boolean,
    Regeneration: Boolean,
    Light_Control: Boolean,
    Echolocation: Boolean,
    Levitation: Boolean,
    Toxin_and_Disease_Control: Boolean,
    Banish: Boolean,
    Energy_Manipulation: Boolean,
    Heat_Resistance: Boolean,
    Natural_Weapons: Boolean,
    Time_Travel: Boolean,
    Enhanced_Smell: Boolean,
    Illusions: Boolean,
    Thirstokinesis: Boolean,
    Hair_Manipulation: Boolean,
    Illumination: Boolean,
    Omnipotent: Boolean,
    Cloaking: Boolean,
    Changing_Armor: Boolean,
    Power_Cosmic: Boolean,
    Biokinesis: Boolean,
    Water_Control: Boolean,
    Radiation_Immunity: Boolean,
    Vision_Telescopic: Boolean,
    Toxin_and_Disease_Resistance: Boolean,
    Spatial_Awareness: Boolean,
    Energy_Resistance: Boolean,
    Telepathy_Resistance: Boolean,
    Molecular_Combustion: Boolean,
    Omnilingualism: Boolean,
    Portal_Creation: Boolean,
    Magnetism: Boolean,
    Mind_Control_Resistance: Boolean,
    Plant_Control: Boolean,
    Sonar: Boolean,
    Sonic_Scream: Boolean,
    Time_Manipulation: Boolean,
    Enhanced_Touch: Boolean,
    Magic_Resistance: Boolean,
    Invisibility: Boolean,
    Sub_Mariner: Boolean,
    Radiation_Absorption: Boolean,
    Intuitive_aptitude: Boolean,
    Vision_Microscopic: Boolean,
    Melting: Boolean,
    Wind_Control: Boolean,
    Super_Breath: Boolean,
    Wallcrawling: Boolean,
    Vision_Night: Boolean,
    Vision_Infrared: Boolean,
    Grim_Reaping: Boolean,
    Matter_Absorption: Boolean,
    The_Force: Boolean,
    Resurrection: Boolean,
    Terrakinesis: Boolean,
    Vision_Heat: Boolean,
    Vitakinesis: Boolean,
    Radar_Sense: Boolean,
    Qwardian_Power_Ring: Boolean,
    Weather_Control: Boolean,
    Vision_X_Ray: Boolean,
    Vision_Thermal: Boolean,
    Web_Creation: Boolean,
    Reality_Warping: Boolean,
    Odin_Force: Boolean,
    Symbiote_Costume: Boolean,
    Speed_Force: Boolean,
    Phoenix_Force: Boolean,
    Molecular_Dissipation: Boolean,
    Vision_Cryo: Boolean,
    Omnipresent: Boolean,
    Omniscient: Boolean
});
const SuperHeroListSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    superheroes: [{
        type: Number, // This assumes that the `id` field in Superhero schema is a Number
        ref: 'Superhero'
    }]
});

  
  SuperHeroListSchema.methods.populateSuperheroes = async function() {
    this.superheroes = await Promise.all(
        this.superheroes.map(async (heroId) => {
            return SuperHero.findOne({ id: heroId });
        })
    );
};




const SuperHero = mongoose.model('Superhero', SuperHeroSchema);
const SuperheroPowers = mongoose.model('SuperheroPowers', SuperheroPowersSchema);
const SuperHeroList = mongoose.model('SuperHeroList', SuperHeroListSchema);

// Function to create a new SuperHero list
async function createSuperHeroList(listName) {
    try {
        // Check if a list with the given name already exists
        const listExists = await SuperHeroList.findOne({ name: listName });
        if (listExists) {
            return { error: `A list with the name '${listName}' already exists.` };
        }

        // If it doesn't exist, create a new list
        const newList = new SuperHeroList({ name: listName });
        await newList.save();
        console.log(`List '${listName}' created successfully.`);
        return { data: newList };
    } catch (err) {
        console.error('Error creating superhero list:', err.message);
        return { error: err.message }; // Returning error message
    }
}

// Function to add a superhero to a list by ID
async function addSuperHeroToList(heroId, listName) {
    try {
        // Find the superhero by ID
        let hero = await SuperHero.findOne({ id: parseInt(heroId, 10) });
        if (!hero) {
            console.log(`Superhero with ID '${heroId}' does not exist.`);
            return null; // If hero does not exist, return null
        }

        // Find the list by name
        let list = await SuperHeroList.findOne({ name: listName });
        if (!list) {
            // If the list does not exist, create a new one
            list = new SuperHeroList({ name: listName, superheroes: [] });
        }

       // Check if the superhero is already in the list
        if (list.superheroes.includes(heroId)) {
            console.log(`Superhero '${hero.name}' is already in the '${listName}' list.`);
            return list; // If hero is already in the list, return the list
        }

        // Add superhero ID to the list
        list.superheroes.push(heroId);
        await list.save();
        console.log(`Superhero '${hero.name}' added to '${listName}' list successfully.`);
        return list;
    } catch (err) {
        console.error('Error adding superhero to list:', err.message);
        throw err; // Re-throw the error to be handled by the caller
    }
}

async function removeSuperHeroFromList(heroId, listName) {
    // Convert heroId to Number if it's a String
    heroId = parseInt(heroId, 10);

    // Find the list by name
    let list = await SuperHeroList.findOne({ name: listName });

    if (list) {
        // Filter out the superhero from the list
        list.superheroes = list.superheroes.filter(id => id !== heroId);
        await list.save();
        console.log(`Superhero with ID ${heroId} removed from list '${listName}' successfully.`);
    } else {
        console.log(`List '${listName}' not found.`);
        throw new Error(`List '${listName}' not found.`);
    }
}





// Assuming SuperHeroList is already defined in your Mongoose models

// Function to save or update a list of superhero IDs
async function saveOrUpdateSuperHeroList(listName, superheroIds) {
    // Find the list by name
    const heroList = await SuperHeroList.findOne({ name: listName });

    // If the list does not exist, throw an error
    if (!heroList) {
        throw new Error(`List with the name '${listName}' does not exist.`);
    }

    // Replace existing superhero IDs with new values
    heroList.superheroes = superheroIds;

    // Save the updated list
    await heroList.save();
    console.log(`List '${listName}' updated successfully with new superheroes.`);
    return heroList;
}


// Function to delete a superhero list by name
async function deleteSuperHeroListByName(listName) {
    try {
        const list = await SuperHeroList.findOne({ name: listName });
        
        if (!list) {
            throw new Error(`No list found with the name '${listName}'.`);
        }

        await list.remove();
        console.log(`List '${listName}' deleted successfully.`);
        return { message: `List '${listName}' deleted successfully.` };
    } catch (error) {
        console.error('Error deleting superhero list:', error.message);
        throw error; // Re-throw the error to be handled by the caller
    }
}



async function getSuperHeroesFromList(listName) {
    try {
        // Find the list and populate the superhero details along with powers
        const listWithHeroes = await SuperHeroList.findOne({ name: listName })
            .populate({
                path: 'superheroes',
                model: 'Superhero',
                // populate the 'powers' field in the Superhero model
                populate: {
                    path: 'powers',
                    model: 'SuperheroPowers'
                }
            });

        if (!listWithHeroes) {
            throw new Error(`No list found with the name '${listName}'.`);
        }

        // Map the data to extract relevant information
        const heroDetails = listWithHeroes.superheroes.map(hero => {
            return {
                name: hero.name,
                gender: hero.gender,
                eyeColor: hero.eyeColor,
                race: hero.race,
                hairColor: hero.hairColor,
                height: hero.height,
                publisher: hero.publisher,
                skinColor: hero.skinColor,
                alignment: hero.alignment,
                weight: hero.weight,
                powers: hero.powers // Assuming powers is an object with Boolean properties
            };
        });
        console.log(`Superheroes from list '${listName}':`, heroDetails);
        return heroDetails;

    } catch (error) {
        console.error('Error getting superhero list:', error.message);
        throw error; // Re-throw the error to be handled by the caller
    }
}

module.exports = {
    removeSuperHeroFromList,
    addSuperHeroToList,
    createSuperHeroList,
    SuperHero,
    SuperheroPowers,
    SuperHeroList
};
