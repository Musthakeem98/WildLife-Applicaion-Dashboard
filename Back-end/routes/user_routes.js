const express = require('express');
const router = express.Router();
const UserSchema = require('../models/user');

// Create a complaint
router.post('/', async (req, res) => {
    try {
      const newComplaint = new UserSchema({
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        telNumber: req.body.telNumber,
        nic: req.body.nic,
        password: req.body.password,
      });
  
      const savedComplaint = await newComplaint.save();
  
      res.status(201).json(savedComplaint);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Get all complaints
  router.get('/', async (req, res) => {
    try {
      const response = await UserSchema.find();
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Get a specific complaint by ID
  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const response = await UserSchema.findById(id);
  
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Delete a complaint by ID
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await UserSchema.findByIdAndDelete(id);
  
      if (response) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updatedUser = await UserSchema.findByIdAndUpdate(id, req.body, { new: true });
  
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;
  