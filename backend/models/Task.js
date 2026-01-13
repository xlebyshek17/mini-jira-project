const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In progress', 'Done'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, //przechowuję unikalny numer ID
        ref: 'User', // ten ID odnosi się do dokumentu z modelu User
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);

