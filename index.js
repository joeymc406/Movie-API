const express =  require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true
}));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use (cors({
      origin: (origin, callback) => {
            if(!origin) return;urn callback(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
                  //if a specific origin isn't found on the list of allowed origins
                  let message = 'The CORS policy for this application does not allow access from origin ' + origin;
                  return callback(new Error(message ), false);
            }
            return callback(null, true);
      }
}));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myFlixDB',
{ useNewUrlParser: true, useUnifiedTopology: true
});

//json file for top 10 movies
app.get('/movies', passport.authenticate('jwt',{session: false}), (req, res) => {
            Movies.find()
                  .then((movies) => {
                        res.status(201).json(movies);
      })
      .catch((err) => {
            console.error(err);
            res.status(500).send('Error' + err);
      });
});

// request and response for top 10 movies in myFlix movies list. ^

app.get('/movies/:Title', passport.authenticate('jwt',{session: false}), (req, res) => {
      // find movie
     Movies.findOne({ Title: req.params.Title})
            .then((movies) => {
                  res.status(200).json(movies);
     })
     .catch((err) => {
            console.error(err);
            res.status(500).send('Error' + err);
      });    
});


//request and response for movie data by title. ^

app.get('/movies/genre/:genreName', passport.authenticate('jwt',{session: false}), (req, res) => {
      Movies.findOne({'Genre.Name': req.params.genreName})
            .then((movie) => {
                  res.json(movie.Genre);
            })
            .catch((err) => {
                  console.error(err);
                  res.status(500).send('Error' + err)
            });
});

//request and response for genre data by genre. ^

app.get('/movies/director/:directorName', passport.authenticate('jwt',{session: false}), (req, res) => {
      Movies.findOne({'Director.Name': req.params.directorName})
            .then((movie) => {
                  res.json(movie.Director);
            })
            .catch((err) => {
                  console.error(err);
                  res.status(500).send('Error' + err)
      });
});

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

app.post('/users', (req, res) => {
      Users.findOne({ Username: req.body.Username })
      .then((user) => {
            if(user) {
                  return res.status(400).send(req.body.Username + 'already exists');
            } else {
                  Users.create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                  })
                  .then((user) => {res.status(201).json(user)})
                  .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error' + error);
                  })
            }
      })
            .catch((error) => {
                  console.error(error);
                  res.status(500).send('Error' + error);
            });
});

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
app.put('/users/:Username', passport.authenticate('jwt',{session: false}), (req, res) => {
      console.log({ username: req.params.Username})
      Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                  $set: {
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                  }
            },
            { new: true },
            (err, updatedUser) => {
                  if (err) {
                        console.error(err);
                        res.status(500).send('Error:' + err);
                  } else {
                        res.json(updatedUser);
                  }
            }
      );
});



// request and response for updating username and find username by id.

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt',{session: false}), passport.authenticate('jwt',{session: false}), (req, res) => {
     Users.findOneAndUpdate({ Username: req.params.Username}, {
            $push: { FavoriteMovies: req.params.MovieID }
            },
            { new: true}, //this line makes sure that the updated doc is returned
            (err, updatedUser) => {
            if (err) {
                  console.error(err);
                  res.status(500).send('Error' + err);
            } else {
                  res.json(updatedUser);
            }
      });
});
  

app.delete('/users/:Username', passport.authenticate('jwt',{session: false}), (req, res) => {
      Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
            if(!user) {
                  res.status(400).send(req.params.Username + 'was not found');
            } else {
                  res.status(200).send(req.params.Username + 'was deleted.');
            }
      })
      .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err)
      });
});

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
      Users.findOneAndUpdate({Username: req.params.Username}, {
            $pull: {FavoriteMovies: req.params.MovieID}
      },
      {new: true},
      (err, updatedUser) => {
            if (err) {
                  console.error(err);
                  res.status(500).send('Error: ' + err);
            } else {
                  res.json(updatedUser);
            }
      });
});
app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send(' $omething went wrong!')
});

app.listen(8080, () => {
      console.log('Your app is listening on port 8080.');
});
