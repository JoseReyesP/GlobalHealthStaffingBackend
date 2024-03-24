import Employee from "../models/employee.model.js";
import errorHandler from "../../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  const employee = new Employee(req.body);
  try {
    await employee.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let employees = await Employee.find().select(
      "name lastname email updated created"
    );
    res.json(employees);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const employeeByID = async (req, res, next, id) => {
  try {
    let employee = await Employee.findById(id);
    if (!employee) return res.status(400).json({ error: "Employee not found" });
    req.profile = employee;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrive employee",
    });
  }
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let employee = req.profile;
    req.body = { ...req.body, updated: Date.now() };
    await Employee.findByIdAndUpdate(
      employee._id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "The profile has been updated successfuly!" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let employee = req.profile;
    if (req.body.type == "soft") {
      await Employee.findByIdAndUpdate(
        employee._id,
        { isDeleted: true },
        { new: true }
      );
      res
        .status(200)
        .json({ message: `Employee ${employee._id} has been archived` });
    } else {
      await Employee.findByIdAndDelete(employee._id);
      res
        .status(200)
        .json({ message: `User ${employee._id} has been deleted` });
    }
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, employeeByID, read, list, remove, update };
