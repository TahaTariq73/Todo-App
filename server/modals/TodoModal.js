const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxLength: [240, "Todo can't exceed 240 characters"]    
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Todo", todoSchema);