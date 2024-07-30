const express = require("express");
const Job = require("../model/Job");
const router = express.Router();

// Get all jobs with visibility set to true (public-facing)
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ visibility: true });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new job (default visibility is false until approved by admin)
router.post("/jobs", async (req, res) => {
  try {
    req.body.visibility = false; // Pending admin approval
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a job by ID (only if visible)
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, visibility: true });
    if (!job)
      return res.status(404).json({ message: "Job not found or not visible" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
