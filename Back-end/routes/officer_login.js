const express = require('express');
const bcrypt = require('bcrypt');
const Officer = require('../models/officer');

const router = express.Router();
// POST: Authenticate officer (Check user and password)
router.post('/authenticate', async (req, res) => {
    try {
      const { officerId, password } = req.body;
  
      const officer = await Officer.findOne({ officerId });
  
      if (!officer) {
        return res.status(401).json({ success: false, message: 'Wrong Officer ID' });
      }
  
      const passwordMatch = await bcrypt.compare(password, officer.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Wrong Password' });
      }
  
      res.status(200).json({ success: true, type: officer.type ,name: officer.name, divistion: officer.divistion, id: officer.officerId});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  
// POST: Create a new officer
router.post('/', async (req, res) => {
  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newOfficer = new Officer({
      officerId: req.body.officerId,
      name: req.body.name,
      email: req.body.email,
      divistion: req.body.divistion,
      address: req.body.address,
      type: req.body.type,
      telNumber: req.body.telNumber,
      nic: req.body.nic,
      password: hashedPassword,
    });

    const savedOfficer = await newOfficer.save();
    res.status(201).json(savedOfficer);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// GET: Get all officers
router.get('/', async (req, res) => {
  try {
    const officers = await Officer.find();
    res.status(200).json(officers);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// DELETE: Remove an officer by ID
router.delete('/delete/:officerId', async (req, res) => {
    try {
      const deletedOfficer = await Officer.findOneAndDelete({ officerId: req.params.officerId });
  
      if (!deletedOfficer) {
        return res.status(404).json({ success: false, message: 'Officer not found' });
      }
  
      res.status(200).json({ success: true, deletedOfficer });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });

  //Get all the beta officers 
  router.get('/betOfficer', async (req,res) => {
    try {
      const response = await Officer.find({type:"beta"})
      if (!response) {
        return res.status(404).json({ success: false, message: 'No any beta officer' });
      }
      res.status(200).json({  response });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  })

  router.get('/:id', async (req,res) => {
    try {
      const id = req.params.id;
      const response = await Officer.findOne({officerId: id})
      if (!response) {
        return res.status(404).json({ success: false, message: 'No any officer' });
      }
      const officerDetails = {
        officerId: response.officerId,
        name: response.name,
        email: response.email,
        address: response.address,
        telNumber: response.telNumber,
        nic: response.nic
      };
      res.status(200).json({  officerDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  })

  router.post('/update', async (req, res) => {
    try {
      const filter = { officerId: req.body.officerId }; 
      const update = {
        officerId: req.body.officerId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        telNumber: req.body.telNumber
      };

      const updatedOfficer = await Officer.findOneAndUpdate(filter, update, { new: true });
  
      if (!updatedOfficer) {
        return res.status(404).json({ success: false, message: 'Officer not found' });
      }
  
      res.status(200).json({ success: true, officer: updatedOfficer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  

module.exports = router;
