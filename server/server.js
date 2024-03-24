import config from "../config/config.js";
import app from "./express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => {
    app.listen(config.port, (err) => {
      if (err) {
        console.log(err);
      }
      console.info("Server started on port %s.", config.port);
    });
  })
  .catch((err) => {
    console.error(`Unable to connect to database: ${config.mongoUri}`);
    console.error(err);
  });
