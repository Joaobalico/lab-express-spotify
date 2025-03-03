require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', {artists: data.body.artists.items});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId
  spotifyApi
  .getArtistAlbums(artistId)
  .then(function(data) {
    console.log('Artist albums', data.body.items);
    res.render('albums', {albums: data.body.items});
  }, function(err) {
    console.error(err);
  });
}) 


app.get('/tracks/:albumId', (req, res, next) => {
  const albumsId = req.params.albumId
  spotifyApi
  .getAlbumTracks(albumsId, { limit : 5, offset : 1 })
      .then(function(data) {
    console.log('Album tracks', data.body.items);
    res.render('tracks', {tracks: data.body.items});
  }, function(err) {
    console.error(err);
  });
})


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
