const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./database/dbConnection");
const { router } = require("./routes/index");
require("dotenv").config();

const app = express();

app.use(cors('*'));

// app.use((err, req, res, next) => {
//   if (err.name === 'CORSError') {
//     res.status(403).json({ error: 'CORS error: Origin not allowed' });
//   } else {
//     next(err);
//   }
// });
// app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(express.json());
app.use('/api', router);

const appPromise = async () => {
  const PORT = process.env.PORT || 9001;
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log("Server listening on port".blue, PORT.toString().green);
  });

}
appPromise()
module.exports = app