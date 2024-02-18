const express = require('express');
const router = express.Router();
const TaskSchema = require('../models/task');
const ComplainSchema = require('../models/complaint');

// Create a task
router.post('/', async (req, res) => {
  try {
    // Create a new task based on the request body
    const newTask = new TaskSchema({
      complainId: req.body.complainId,
      OfficerId: req.body.OfficerId,
      officerName: req.body.officerName,
      adminOfficer: req.body.adminOfficer,
      note: req.body.note,
      date: req.body.date
    });

    // Update the status in the complaint table
    const updatedComplaint = await ComplainSchema.findOneAndUpdate(
      { complaintId: req.body.complainId },
      { $set: { status: 'progress' } },
      { new: true }
    );
    console.log("updatedComplaint : ", updatedComplaint)

    // Check if the status was actually changed
    if (updatedComplaint && updatedComplaint.status === 'progress') {
      // Save the new task to the database
      const savedTask = await newTask.save();
      res.status(201).json({ success: true, message: 'Status updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Status not updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/changestate/:id', async (req, res) => {
  
  try {
    // Update the status in the complaint table
    const updatedComplaint = await ComplainSchema.findOneAndUpdate(
      { complaintId: req.params.id },
      { $set: { status: 'close' } },
      { new: true }
    );
    console.log("updatedComplaint : ", updatedComplaint)

    // Check if the status was actually changed
    if (updatedComplaint && updatedComplaint.status === 'close') {
      res.status(201).json({ success: true, message: 'Status updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Status not updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all task
router.get('/', async (req, res) => {
  try {
    const response = await TaskSchema.find();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await TaskSchema.findById(id);

    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await TaskSchema.findByIdAndDelete(id);

    if (response) {
      res.json({ message: "Complaint deleted successfully" });
    } else {
      res.json({ message: 'Complaint not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
