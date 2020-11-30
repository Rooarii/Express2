// Express 2 - 🚀 Lecture depuis la base de données

const express = require("express");
const movies = require("./movies");
const connection = require("../config");

const port = 3000;
const app = express();

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get("/", (req, res) => {
  res.send("Welcome to my favorite movie list");
});

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/movies/:id", (req, res) => {
  connection.query("SELECT * FROM movies", (err, movies)=>{
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      const movie = movies.find((movie) => {
        return movie.id === Number(req.params.id);
      });
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send("Not found");
      }
    }
  })
  
});

app.get("/api/search", (req, res) => {
  connection.query("SELECT * FROM movies", (err,movies)=>{
    if (err){
      res.status(500).send("Error retrieving data");
    }else{
      const matchingMovies = movies.filter(
        (movie) => movie.duration <= req.query.durationMax
      );
      if (matchingMovies.length > 0) {
        res.json(matchingMovies);
      } else {
        res.status(404).send("No movies found for this duration");
      }
    }
  })
  
});

app.get("/api/user", (req, res) => {
  res.status(401).send("Unauthorized");
});

app.listen(port, () => {
  console.log(`Server is runing on 3000`);
  
});