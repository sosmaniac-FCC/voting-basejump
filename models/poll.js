const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    question: {
		type: String
    },
    options: {
    	type: Array
    }, 
    bgColors: {
        type: Array
    },
    bdColors: {
        type: Array
    },
    votes: {
        type: Array
    },
    voters: {
        type: Array
    },
    creatorId: {
        type: String
    },
    creatorName: {
        type: String
    }
});

const Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = (question, options, creatorId, creatorName, callback) => {
    let votes = [], bgColors = [], bdColors = [];
    
    options.forEach(() => {
        votes.push(0);
        const r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256);
        bgColors.push('rgba(' + r + ',' + g + ',' + b + ',0.2)');
        bdColors.push('rgba(' + r + ',' + g + ',' + b + ',1.0)');
    });
    
    Poll.create({question: question, 
        options: options, 
        bgColors: bgColors, 
        bdColors: bdColors, 
        votes: votes, 
        voters: [], 
        creatorId: creatorId, 
        creatorName: creatorName}, callback);
};

module.exports.deletePollById = (id, callback) => {
    Poll.findByIdAndRemove(id, callback); 
};

module.exports.getPollById = (id, callback) => {
    Poll.findById(id, callback);
};