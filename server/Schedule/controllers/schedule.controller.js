import Schedule from "../../Schedule/models/schedule.model.js";
import errorHandler from "../../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  const schedule = new Schedule(req.body);
  try {
    await schedule.save();
    return res.status(200).json({
      message: "Schedule created",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let schedules = await Schedule.find()
      .select(
        "employee client startDate endDate status customRate rate scheduleTime"
      )
      .populate({
        path: "employee",
        select: "name lastname email",
      })
      .populate({
        path: "client",
        select: "name lastname email",
      });
    res.json(schedules);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const scheduleByID = async (req, res, next, id) => {
  try {
    let schedule = await Schedule.findById(id);
    if (!schedule) return res.status(400).json({ error: "Schedule not found" });
    req.profile = schedule;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrive schedule",
    });
  }
};
const read = (req, res) => {
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let schedule = req.profile;
    req.body = { ...req.body, updated: Date.now() };
    await Schedule.findByIdAndUpdate(
      schedule._id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "The schedule has been updated successfuly!" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let schedule = req.profile;
    if (req.body.type == "soft") {
      await Schedule.findByIdAndUpdate(
        schedule._id,
        { isDeleted: true },
        { new: true }
      );
      res
        .status(200)
        .json({ message: `Schedule ${schedule._id} has been archived` });
    } else {
      await Schedule.findByIdAndDelete(schedule._id);
      res
        .status(200)
        .json({ message: `Schedule ${schedule._id} has been deleted` });
    }
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, scheduleByID, read, list, remove, update };
