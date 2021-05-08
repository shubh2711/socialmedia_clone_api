const  express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const errorHandler = require("./middlewares/errorHandler");
const mongoose = require('mongoose');
const rateLimit =  require("express-rate-limit");
const passportJWT = require('./middlewares/passportJWT')();

const postRoutes = require("./routes/post")
const authRoutes = require("./routes/auth")
const followRoutes = require("./routes/follow")
const app = express();

app.use(cors());

// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// const limiter = rateLimit({
//   windowMs: 10 * 1000, // 15 minutes
//   max: 5 // limit each IP to 100 requests per windowMs
// });
 
// //  apply to all requests
// app.use(limiter);


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/rest-api-node' , {useNewUrlParser: true });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportJWT.initialize());

app.use('/api/follow',passportJWT.authenticate(),followRoutes);
app.use('/api/post',passportJWT.authenticate(),postRoutes);
app.use('/api/auth',authRoutes);
app.use(errorHandler);

app.listen(8001, () => {
console.log("listening on port 8001");
});