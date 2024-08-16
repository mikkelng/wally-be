const router = require('express').Router();
const Income = require('../models/Income.model');
const { isAuthenticated } = require('../middlewares/jwt.middleware.js');

// Create a new income
router.post('/income', isAuthenticated, async (req, res) => {
    try {
        const { amount, source, description, date } = req.body;
        const newIncome = await Income.create({
            amount,
            source,
            description,
            date,
            owner: req.payload._id,
        });
        res.json(newIncome);
    } catch (err) {
        res.status(500).json({ message: "Error creating income" });
    }
});

// Get all income records
router.get('/income', isAuthenticated, async (req, res) => {
    try {
        const incomeList = await Income.find({ owner: req.payload._id });
        res.json(incomeList);
    } catch (err) {
        res.status(500).json({ message: "Error fetching income records" });
    }
});

// Get a specific income record by ID
router.get('/income/:id', isAuthenticated, async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ message: "Income not found" });
        res.json(income);
    } catch (err) {
        res.status(500).json({ message: "Error fetching income record" });
    }
});

// Update an income record
router.put('/income/:id', isAuthenticated, async (req, res) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedIncome) return res.status(404).json({ message: "Income not found" });
        res.json(updatedIncome);
    } catch (err) {
        res.status(500).json({ message: "Error updating income record" });
    }
});

// Delete an income record
router.delete('/income/:id', isAuthenticated, async (req, res) => {
    try {
        const deletedIncome = await Income.findByIdAndDelete(req.params.id);
        if (!deletedIncome) return res.status(404).json({ message: "Income not found" });
        res.json({ message: "Income deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting income record" });
    }
});

module.exports = router;
