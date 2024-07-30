const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  jobName: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  salary: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  visibility: {
    type: Boolean,
    default: false,
  },
  JobType: {
    // JobType: JobProvider and JobSeeker
    type: String,
  },
});

// Pre-save middleware to generate slug from jobName
JobSchema.pre("save", function (next) {
  if (this.isModified("jobName") || this.isModified("address") || this.isNew) {
    const slug = slugify(this.jobName + " " + this.address, {
      lower: true,
      strict: true,
    });
    this.slug = slug.length > 20 ? slug.slice(0, 20) : slug;
  }
  next();
});

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

module.exports = Job;
