import Client from "../models/client.model.js";
import errorHandler from "../../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  const client = new Client(req.body);
  try {
    await client.save();
    return res.status(200).json({
      message: "Client created!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let clients = await Client.find().select(
      "name lastname email updated created"
    );
    res.json(clients);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const clientByID = async (req, res, next, id) => {
  try {
    let client = await Client.findById(id);
    if (!client) return res.status(400).json({ error: "Client not found" });
    req.profile = client;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrive client",
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
    let client = req.profile;
    req.body = { ...req.body, updated: Date.now() };
    await Client.findByIdAndUpdate(
      client._id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "The client profile has been updated successfuly!" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let client = req.profile;
    if (req.body.type == "soft") {
      await Employee.findByIdAndUpdate(
        employee._id,
        { isDeleted: true },
        { new: true }
      );
      res
        .status(200)
        .json({ message: `Client ${client._id} has been archived` });
    } else {
      await Client.findByIdAndDelete(client._id);
      res
        .status(200)
        .json({ message: `Client ${client._id} has been deleted` });
    }
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, clientByID, read, list, remove, update };
