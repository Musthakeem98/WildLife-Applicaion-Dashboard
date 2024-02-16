const express = require('express');
const router = express.Router();
const ComplainSchema = require('../models/complaint');

// Create a complaint
router.post('/', async (req, res) => {
  try {
    const newComplaint = new ComplainSchema({
      complaintId: req.body.complaintId,
      department: req.body.department,
      description: req.body.description,
      location: req.body.location,
      evidences: req.body.evidences,
      status: req.body.status,
      complaintNote: req.body.complaintNote,
      date:req.body.date
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
    const response = await ComplainSchema.find();
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
    const response = await ComplainSchema.findById(id);

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

//Get the specific complaine by sate 
router.get('/getstate/:state', async (req,res) => {
  const state = req.params.state;
  const response = await ComplainSchema.find({status:state})
try {
  if (response) {
    res.status(200).json(response)
  }else {
    res.status(404).json({ message: "Complaint not found" });
  }
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error'); 
}})

// Delete a complaint by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ComplainSchema.findByIdAndDelete(id);

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

router.get('/changestate/:complaineId', async (req, res) => {
  const complaineId = req.params.complaineId
  try {
    const response = await ComplainSchema.updateOne({complaineId: complaineId}, { $set: { status: "close" } });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
