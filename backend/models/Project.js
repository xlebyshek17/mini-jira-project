const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false }); // usuwamy tworzenia _id dla member

const ProjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of the priject is required'],
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        maxLength: 500
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: {
        type: [MemberSchema], // Mówimy: "To jest tablica obiektów o strukturze MemberSchema"
        validate: [arrayLimit, 'Project must have at least one member']
    },
    inviteCode: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, { timestamps: true });

// dla szybkiego sprawdzenia, w jakich projektach jest użytkownik
ProjectSchema.index({ "members.user": 1 });

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Project', ProjectSchema);