const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const { connectToDatabase } = require("./database/dbConnection");
const { usersRouter } = require("./routes/usersRouter");
const { businessRouter } = require("./routes/businessRouter ");
const { clientRouter } = require("./routes/clientRouter");
const { invoiceRouter } = require("./routes/invoiceRouter");
const { uploadRouter } = require("./routes/uploadRouter");
const { emailRouter } = require("./routes/emailRouter");
const { router } = require("./routes/index");
// const pdfRoutes = require("./routes/pdfRoutes");
require("dotenv").config();

const app = express();

app.use(cors());

// app.use((err, req, res, next) => {
//   if (err.name === 'CORSError') {
//     res.status(403).json({ error: 'CORS error: Origin not allowed' });
//   } else {
//     next(err);
//   }
// });
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(express.json());


app.use('/api', router);

app.use('/*', (req,res)=>res.send('404 error'))
// app.use("/login", usersRouter);
// app.use("/business", businessRouter);
// app.use("/client", clientRouter);
// app.use("/invoices", invoiceRouter);
// app.use("/upload", uploadRouter);
// app.use("/email", emailRouter);
// app.use("/pdf", pdfRoutes);
// app.use('/*', (req, res) => res.send('X-Invoice Backend Routing Not Found'))
const appPromise= async()=>{
  const PORT = process.env.PORT || 9001;
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log("Server listening on port".blue, PORT.toString().green);
  });
  
}
appPromise()


module.exports= app