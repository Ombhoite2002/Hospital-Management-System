const http = require('http');
const app = require('./app');
const { sequelize } = require("./models");
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Tables are synced.");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("DB connection or sync error:", err);
  });