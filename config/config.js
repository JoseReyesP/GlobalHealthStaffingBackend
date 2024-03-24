const DBUser = "relujo";
const DBPassword = "R6Id4TUL86JYxyxf";
const DBUrl = `mongodb+srv://${DBUser}:${DBPassword}@cluster0.st76yxw.mongodb.net/?retryWrites=true&w=majority`;

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || "relujo_clones_everything",
  mongoUri: DBUrl,
};

// this is mongodb Atlas connection
// const config = {
//   env: process.env.NODE_ENV,
//   port: process.env.PORT,
//   jwtSecret: process.env.JWT_SECRET,
//   mongoUri: process.env.mongoUri,
// };

export default config;
