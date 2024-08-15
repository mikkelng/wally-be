const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const expenseSchema = new Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = model('Expense', expenseSchema);
