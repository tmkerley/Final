const State = require('../model/State.js');
const statesJson = require('../public/json/States.json');

// requires a valid state
// return random fact for a state
const getRandomFact = async (req, res) => {
    // Get all fun facts for the given state
    const state = await State.findOne({ statecode: req.params.state });
    const facts = state.funfacts;

    // Ensure results were found
    if (!facts || facts.length === 0) {
        // Find the name of the state
        const stateName = statesJson.find(
            (state) => state.code === req.params.state).state;

        // Return JSON message that no facts were found
        res.json({ message: `No Fun Facts found for ${stateName}` });
    } else {
        // Choose random fact
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        // Return the fact alone as json
        res.json({
            funfact: randomFact,
        });
    }
};

// requests a valid state
// creates a fact for the valid state
const createFact = async (req, res) => {
    // Ensure a fun fact object was passed in the request body
    if (!req.body.funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    // Ensure the funfacts value is an array
    if (!Array.isArray(req.body.funfacts)) {
        return res
        .status(400)
        .json({ message: 'State fun facts value must be an array' });
    }

    // Check if an entry for this state already exists
    const state = await State.findOne({ statecode: req.params.state }).exec();

    if (state) {
        // If yes, push new funfacts to the entry
        state.funfacts.push(...req.body.funfacts);

        // Save the modified entry
        const result = await state.save();

        // Return the saved results
        res.json(result);
    } else {
        // If no, create a new entry
        try {
            const result = await State.create({
                statecode: req.params.state,
                funfacts: [...req.body.funfacts],
            });

            // Return the results
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    }
};

// requires a valide state and will modify a state
// returns a state with a modified fact
// failure response provided
const modifyFact = async (req, res) => {
    // Store params for readability
    const stateCode = req.params.state;
    const index = req.body.index;
    const funfact = req.body.funfact;

    // Ensure an index value was provided in the request body
    if (!index) {
        return res.status(400).json({
            message: 'State fun fact index value required',
        });
    }
    // Ensure a funfact value was provided
    if (!funfact) {
        return res.status(400).json({
            message: 'State fun fact value required',
        });
    }

    // Check if an entry for this state exists
    const state = await State.findOne({ statecode: stateCode }).exec();

    // No state record found in database
    // Find the name of the state
    if (!state) {
        const stateName = statesJson.find(
            (state) => state.code === stateCode).state;

        // Return JSON message that no facts were found
        res.json({ message: `No Fun Facts found for ${stateName}` });
    } else if (!state.funfacts[index - 1]) {
        // Invalid index
        // Find the name of the state
        const stateName = statesJson.find(
            (state) => state.code === stateCode).state;

        res.json({ message: `No Fun Fact found at that index for ${stateName}` });
    } else {
        // Modify the found entry
        state.funfacts[index - 1] = funfact;

        // Save the modified entry
        const result = await state.save();

        // Return the saved results
        res.json(result);
    }
};

// requires a valid state and state JSON
// returns id, stateCode, funfacts, and __v.
const deleteFact = async (req, res) => {
    // Store the undex and state
    const stateCode = req.params.state;
    const index = req.body.index;

    // Check if index is not false or exists
    if (!index) {
            return res.status(400).json({
                message: 'State fun fact index value required',
        });
    }

        // Check if an entry for this state exists
    const state = await State.findOne({ statecode: stateCode }).exec();

    if (!state) {
        // No state record found in database
        // Find the name of the state
        const stateName = statesJson.find(
            (state) => state.code === stateCode
            ).state;

        // Return JSON message that no facts were found
        res.json({ message: `No Fun Facts found for ${stateName}` });
    } else if (!state.funfacts[index - 1]) {
        // Invalid index
        // Find the name of the state
        const stateName = statesJson.find(
            (state) => state.code === stateCode).state;

        res.json({ message: `No Fun Fact found at that index for ${stateName}` });
    } else {
        // Modify the found entry
        state.funfacts.splice(index - 1, 1);

        // Save the modified entry
        const result = await state.save();

        // Return the saved results
        res.json(result);
    }
};

// Export all functions
module.exports = {
    getRandomFact,
    createFact,
    modifyFact,
    deleteFact,
};