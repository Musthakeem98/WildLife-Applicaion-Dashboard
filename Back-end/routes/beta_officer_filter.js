const express = require('express');
const router = express.Router();
const TaskSchema = require('../models/task');
const ComplainSchema = require('../models/complaint');

router.get('/:officerid/:status', async (req, res) => {
    const officerid = req.params.officerid;
    const status = req.params.status;

    try {
        // Find tasks assigned to the officer
        const response = await TaskSchema.find({OfficerId: officerid});
        // Extract complainIds from tasks
        const complainIds = response.map(task => task.complainId);
        // Controller for complains
        const complainController = {
            findComplainsByIds: (complainIds) => {
                return ComplainSchema.find({ complaintId: { $in: complainIds } , status: status});
            },
        };
        // Find complain details based on complainIds
        const complainDetails = await complainController.findComplainsByIds(complainIds);

        res.json(complainDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;