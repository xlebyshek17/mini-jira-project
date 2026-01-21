const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' },
    type: { 
        type: String, 
        enum: ['TASK_ASSIGNED', 'TASK_DONE', 'NEW_COMMENT'], 
        required: true 
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true },
    task: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' },
    message: String,
    isRead: { 
        type: Boolean, 
        default: false },
    createdAt: { 
        type: Date, 
        default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);