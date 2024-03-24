import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";

// import routes
import authRoutes from "./Auth/routes/auth.routes.js";
import employeeRoutes from "./Employee/routes/employee.routes.js";
import clientRoutes from "./Client/routes/client.routes.js";
import scheduleRoutes from "./Schedule/routes/schedule.routes.js";

// app config
const app = express();

//cors options
const corsOptions = {
  //TODO include origins on the confir file
  origin: ["http://localhost:3001", "http://localhost:3000"], // this should be on config file

  credentials: true,
  methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
  optionSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//project's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(helmet());

// Routes
//TODO this should redirect to the organization dashboard
app.get("/", (req, res) => {
  res.redirect("https://admindashboard.up.railway.app");
});

//TODO create and include the routes
app.use("/", authRoutes);
app.use("/", employeeRoutes);
app.use("/", clientRoutes);
app.use("/", scheduleRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
