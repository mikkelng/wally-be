const router = require('express').Router();
const Expense = require('../models/Expense.model');
const { isAuthenticated } = require('../middlewares/jwt.middleware.js');

// Create a new expense
router.post('/expenses', isAuthenticated, async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;
        const newExpense = await Expense.create({
            amount,
            category,
            description,
            date,
            owner: req.payload._id,
        });
        res.json(newExpense);
    } catch (err) {
        res.status(500).json({ message: "Error creating expense" });
    }
});

// Get all expenses
router.get('/expenses', isAuthenticated, async (req, res) => {
    try {
        const expenses = await Expense.find({ owner: req.payload._id });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: "Error getting expenses" });
    }
});

// Get a specific expense by ID
router.get('/expenses/:id', isAuthenticated, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: "Error fetching expense" });
    }
});

// Update an expense
router.put('/expenses/:id', isAuthenticated, async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
        res.json(updatedExpense);
    } catch (err) {
        res.status(500).json({ message: "Error updating expense" });
    }
});

// Delete an expense
router.delete('/expenses/:id', isAuthenticated, async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting expense" });
    }
});

module.exports = router;
