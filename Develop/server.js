// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8089;

// sequelize will require index.js as default
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();

// express middleware to handle incoming request as strings or arrays
app.use(express.urlencoded({ extended: true }));

// express middleware to handle incoming request as JSON object
app.use(express.json());

// express middleware to make static file in public folder accessible to web browser
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

// middleware that initialize the passport authentication method
app.use(passport.initialize());

// middleware that deserialized user's request object
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
