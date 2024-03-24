import mongoose, { mongo } from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  rate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rate",
  },
  customRate: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
    enum: ["in process", "pending", "completed"],
    default: "pending",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  historyID: {
    type: mongoose.Types.ObjectId,
    ref: "history",
  },
});

ScheduleSchema.virtual("scheduleTime").get(function () {
  if (!this.startDate || !this.endDate) {
    return null;
  }
  // Calculate the difference in milliseconds
  const diff = this.endDate.getTime() - this.startDate.getTime();
  // Convert milliseconds to hours
  return diff / (1000 * 60 * 60);
});

ScheduleSchema.set("toJSON", { virtuals: true });
ScheduleSchema.set("toObject", { virtuals: true });

export default mongoose.model("Schedule", ScheduleSchema);
