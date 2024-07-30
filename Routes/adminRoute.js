const express = require("express");
const User = require("../model/User");
const Job = require("../model/Job");
const router = express.Router();

// Show all the users and Admin
router.get("/show", async (req, res) => {
  try {
    const existingUser = await User.find({});
    res
      .status(201)
      .json({ message: "Showing all the users and admins", existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Registration Route
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({
      username,
      email,
      password, // Password will be hashed in the pre-save hook
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to authenticate admin
const authenticateAdmin = require("../authMiddleware");

// Get all jobs (admin can see all jobs)
router.get("/jobs", authenticateAdmin, async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new job (admin can create jobs)
router.post("/jobs", authenticateAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a job by ID (admin can view any job)
router.get("/jobs/:id", authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a job by ID (admin can update any job)
router.put("/jobs/:id", authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a job by ID (admin can delete any job)
router.delete("/jobs/:id", authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
