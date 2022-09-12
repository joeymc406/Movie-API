const express =  require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const req = require('express/lib/request');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

let users = [
      {
            name: "Joey",
            id: "1",
            favoriteMovie: ["John Wick: Chapter 3"]
      },
      {
            name: "Beth",
            id: "2",
            favoriteMovie: ["8 Seconds"]
      }
];

let movies = [
      {
            Title: "8 Seconds",
            Description: "This movie chronicles the life of Lane Frost, 1987 PRCA Bull Riding World Champion, his marriage and his friendships with Tuff Hedeman (three-time World Champion) and Cody Lambert.",
            Genre: {
                  Name: "Biography",
                  Description: "A movie genre that has been around since the birth of cinema, biopics are a category all their own. Biopics can technically run the gamut of movie genres (Sports movies, War, Westerns, etc.) but they often find their home in dramas. At their core, biopics dramatize real people and real events with varying degrees of verisimilitude.",
      },
            Director: {
                  Name: "John G. Avildson",
                  Bio: "John G. Avildsen was born on December 21, 1935 in Oak Park, Illinois USA.He was a director and editor, known for Rocky (1976), The Karate Kid Part III (1989) and Rocky V (1990). He was married to Tracy Brooks Swope and Marie Olga Maturevich. He died on June 16, 2017 in Los Angeles, California, USA. "
            }
      },
      {
            Title: "Beauty and the Beast",
            Description: "A selfish Prince is cursed to become a monster for the rest of his life, unless he learns to fall in love with a beautiful young woman he keeps prisoner.",
            Genre: {
                  Name: "Adventure",
                  "Description": "Movies in the adventure genre are defined by a journey, often including some form of pursuit, and can take place in any setting. ",
            },
            Director: {
            Name:"Bill Condon",
            Bio: "Bill Condon was born on October 22, 1955 in New York City, New York, USA. He is a director and writer, known for Dreamgirls (2006), Kinsey (2004) and Gods and Monsters (1998)."
            }
      },
      {
            Title: "Harry Potter and the Prison of Azkaban",
            Description: "Harry Potter, Ron and Hermione return to Hogwarts School of Witchcraft and Wizardry for their third year of study, where they delve into the mystery surrounding an escaped prisoner who poses a dangerous threat to the young wizard.",
            Genre: {
                  Name: "Adventure",
                  Description: "Movies in the adventure genre are defined by a journey, often including some form of pursuit, and can take place in any setting. ",
             },
            Director: {
                  Name: "Alfonso Cuarón",
                  Bio: "Alfonso Cuarón ws born on November 28th in Mexico City, Mexico. From an early age he yearned to be either a film director or astronaut. However he did not want to enter the army so he settled on directing."
            },
      },
      {
            Title: 'John Wick',
            Description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
            Genre: {
                  Name: "Action",
                  Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
            },
            Director: {
                  Name: "Chad Stahelski",
                  Bio: "Born September 20th 1968, He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan."
            },
      },
      {
            Title: 'John Wick Chapter 2',
            Description: 'After returning to the criminal underworld to repay a debt, John Wick discovers that a large bounty has been put on his life.',
            Genre: {
                  Name: "Action",
                  Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
            },
            Director: {
                  Name: "Chad Stahelski",
                  Bio: "Born September 20th 1968, He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan."
            }
      },
      {
            Title: 'John Wick Chapter 3',
            Description: 'John Wick is on the run after killing a member of the international assassins guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.',
            Genre: {
                  Name: "Action",
                  Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
             },
            Director: {
                  Name: "Chad Stahelski",
                  Bio: "Born September 20th 1968, He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan."
            }
      },
      {
            Title: 'John Wick Chapter 4',
            Description: 'John Wick (Keanu Reeves) takes on his most lethal adversaries yet in the upcoming fourth installment of the series. With the price on his head ever increasing, Wick takes his fight against the High Table global as he seeks out the most powerful players in the underworld, from New York to Paris to Osaka to Berlin. Lionsgate presents, a Thunder Road Films / 87eleven production.',
            Genre: {
                  Name: "Action",
                  Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
             },
            Director: {
                  Name: "Chad Stahelski",
                  Bio: "Born September 20th 1968, He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan."
            }
      },
      {
            Title: 'Sicario',
            Description: 'An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico.',
            Genre: {
                  Name: "Action",
                  Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
            },
            Director: {
                  Name: "Denis Villeneuve",
                  Bio: "Denis Villeneuve is a French Canadian film director and writer. He was born in 1967, in Trois-Rivières, Québec, Canada. He started his career as a filmmaker at the National Film Board of Canada. He is best known for his feature films Arrival (2016), Sicario (2015), Prisoners (2013), Enemy (2013), and Incendies (2010). He is married to Tanya Lapointe."
            }
      },
      {
            Title:'Sicario: Day of the Soldado',
            Description:'The drug war on the U.S.-Mexico border has escalated as the cartels have begun trafficking terrorists across the US border. To fight the war, federal agent Matt Graver re-teams with the mercurial Alejandro.',
            Genre:{
                  
                        Name: "Action",
                        Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
                  },
            
            Director: {
                  Name: "Stefano Sollima",
                  Bio: "Stefano Sollima was born on May 4, 1966 in Rome, Lazio, Italy. He is a director and writer, known for Without Remorse (2021), ZeroZeroZero (2019) and Gomorrah (2014). "
            }
      },
      {
            Title:'American Sniper',
            Description:'Navy S.E.A.L. sniper Chris Kyles pinpoint accuracy saves countless lives on the battlefield and turns him into a legend. Back home with his family after four tours of duty, however, Chris finds that it is the war he cant leave behind.',
            Genre:{
                  
                        Name: "Action",
                        Description: "Movies in the action genre are defined by risk and stakes. While many movies may feature an action sequence, to be appropriately categorized inside the action genre, the bulk of the content must be action-oriented, including fight scenes, stunts, car chases, and general danger",
                        Name: "Biography",
               },
            Director: {
                  "Name": "Clint Eastwood",
                  "Bio": "Clint Eastwood was born May 31, 1930 in San Francisco, the son of Clinton Eastwood Sr., a bond salesman and later manufacturing executive for Georgia-Pacific Corporation, and Ruth Wood (née Margret Ruth Runner), a housewife turned IBM clerk."
            }
      }
];

//json file for top 10 movies
app.get('/movies', (req, res) => {
      res.json(movies);
});

// request and response for top 10 movies in myFlix movies list. ^

app.get('/movies/:Title', (req, res) => {
      // find movie
      const movie = movies.find((movie) => {
            return movie.Title === req.params.Title
      });

      if (movie) {
            res.status(200).json(movie);
      } else {
            res.status(400).send('Movie Not Found')
      }
});


//request and response for movie data by title. ^

app.get('/movies/genre/:genreName', (req, res) => {
      const movie = movies.find((movie) => {
            return movie.Genre.Name === req.params.genreName;
      });

      if (movie) {
            res.status(200).json(movie.Genre);
      } else {
            res.status(400).send('Genre Not Found')
      };
});

//request and response for movies data by genre. ^

app.get('/movies/director/:directorName', (req, res) => {
      const movie = movies.find((movie) => {
            return movie.Director.Name === req.params.directorName
      });

      if (movie) {
            res.status(200).json(movie.Director);
      } else {
            res.status(400).send('Director Not Found');
      }
});

// request and response for director data by name ^

app.post('/users', (req, res) => {
      let newUser=req.body;

      if (newUser.name) {
            newUser.id = uuid.v4();
            newUser.favoriteMovie = [];
            user.push(newUser);
            res.status(201).json(newUser);
      } else {
            res.status(400).send('User Name Required')
      }
});

// user request and response all ^

app.put('/user/:id', (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;

      let user = users.find( user => user.id === id);

      if (user) {
            user.name = updateUser.name;
            res.status(200).json(user);
      } else {
            res.status(400).send('User Not Found')
      }
});



// request and response for updating username and find username by id.

app.put('/user/:userId/movies/:favoriteMovie', (req, res) => {
      const userId =  req.params.userId;
      const favoriteMovie = req.params.favoriteMovie;
      const updateMovies = req.body;

            let user = users.find(user => user.id === userId);
            
            if (user) {
                  user.favoriteMovie = push(favoriteMovie)
                  res.status(200).json(id)
            } else {
                        res.status(400).send('Movie Not Found')
                  }
});
  

app.delete('/user/:id', (req, res) => {
      let user = users.find((user) => {
            return user.id === req.params.id
      });
      if (user) {
            users = users.filter(( obj ) => {
                  return obj.id !== req.params.id
            });
            res.status(201).send('User '+ req.params.id +' was deleted');
      }
});

     
      



app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('something went wrong!')
});

app.listen(8080, () => {
      console.log('Your app is listening on port 8080.');
});
