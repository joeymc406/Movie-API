const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");

require("dotenv").config();

const Movies = Models.Movie;
const Users = Models.User;

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//let allowedOrigins = ['http://localhost:8080', 'https://joeymc406movie-api.herokuapp.com/', 'http://localhost:1234'];
//possible issue regarding origins!!! added heroku url

const cors = require("cors");
// app.use (cors({
//       origin: (origin, callback) => {
//             if(!origin) return callback(null, true);
//             if(allowedOrigins.indexOf(origin) === -1){
//                   //if a specific origin isn't found on the list of allowed origins
//                   let message = 'The CORS policy for this application does not allow access from origin ' + origin;
//                   return callback(new Error(message ), false);
//             }
//             return callback(null, true);
//       }
// }));
app.use(cors());
let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

//mongoose.connect('mongodb://localhost:27017/myFLixDB',
//{ useNewUrlParser: true, useUnifiedTopology: true
//});

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
      console.log("Mongodb connected")
}).catch(ee => {
      console.log(ee)
});


//mongodb+srv://joeymc406:joeymc406@myflixdb.1t6aklx.mongodb.net/myFLixDB?retryWrites=true&w=majority

//mongoose.connect('mongodb+srv://joeymc406:joeymc406@myFlixdb.1t6aklx.mongodb.net/myFLixDB?retryWrites=true&w=majority',
//{ useNewUrlParser: true, useUnifiedTopology: true
//});

//json file for top 10 movies
app.get("/movies", function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error:" + error);
    });
});

// request and response for top 10 movies in myFlix movies list. ^

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // find movie
    Movies.findOne({ Title: req.params.Title })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  }
);

//request and response for movie data by title. ^

app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  }
);

//request and response for genre data by genre. ^

app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  }
);

// request and response for director data by name ^
/* 
{
ID: Integer,
Username: String,
Password: String,
Email: String,
Birthdate: Date
}
*/

app.post(
  "/users",
  [
    // validation logic here for request
    check("Username", "Username is Required").isLength({ min: 8 }).withMessage("Should be more than 8 characters"),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required.").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    console.log(req.body);

    // check validation for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }).populate("FavoriteMovies")
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(400).json({errors :  error});
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error" + error);
      });
  }
);
// get current loggedin user data
app.get(
      "/users",
      passport.authenticate("jwt", { session: false }),
      (req, res) => {
        Users.findById(req.user._id).populate('FavoriteMovies')
          .then((user) => {
            res.json({user});
          })
          .catch((err) => {
            console.error(err);
            res.status(400).json({errors: err});
          });
      }
    );

// user request and response all ^
/*
{
      Username: String,
      (required)
      Password: String,
      (required)
      Email: String,
      (required)
      Birthday: Date
}
*/
app.put(
  "/users",
  [
    // validation logic here for request
    check("Username", "Username is Required").isLength({ min: 8 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required.").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findByIdAndUpdate(
     req.user._id,
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(400).json({errors: err});
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// request and response for updating username and find username by id.

app.post(
  "/users/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findByIdAndUpdate(
      req.user._id,
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, //this line makes sure that the updated doc is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(400).json({errors: err});
        } else {
          res.json({ message: "Favourite Movie Added!"});
        }
      }
    );
  }
);

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).json({errors: req.params.Username + "was not found"});
        } else {
          res.status(200).json({message: req.params.Username + "was deleted."});
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({errors:err});
      });
  }
);

app.delete("/users/movies/:MovieID", (req, res) => {
  Users.findByIdAndUpdate(
   req.user._id,
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, _) => {
      if (err) {
        console.error(err);
        res.status(400).json({errors: err});
      } else {
        res.json({ message: "Favourite movie deleted!"});
      }
    }
  );
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: "$omething went wrong!"});
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port" + port);
});
