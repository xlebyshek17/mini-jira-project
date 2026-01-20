const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const TaskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    type: {
        type: String, 
        enum: ['Task', 'Bug', 'Feature'],
        default: 'Task'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    link: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'In Review', 'Done'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, //przechowuję unikalny numer ID
        ref: 'User', // ten ID odnosi się do dokumentu z modelu User
        required: false
    },
    reporter: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: { 
        type: Number, 
        default: 0 
    },
    comments: [CommentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);

