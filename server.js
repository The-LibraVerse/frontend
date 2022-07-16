var express = require('express');
var server = express();

// middleware
server.use('/', express.static(__dirname + '/pages'));

server.use('/src', express.static(__dirname + '/src'));

server.use('/shared', express.static(__dirname + '/shared_components'));

server.use('/dependencies', express.static(__dirname + '/dependencies'));

server.use('/styles', express.static(__dirname + '/styles'));

server.use('/dist/styles', express.static(__dirname + '/dist/styles'));

server.use('/dist', express.static(__dirname + '/dist/assets/fontawesome-free-6.1.1-web'));

server.use('/assets', express.static(__dirname + '/assets'));

server.use('/book/:id', function(req, res) {
    res.sendFile(__dirname + '/pages/book.html');
});
server.use('/new-book', function(req, res) {
    res.sendFile(__dirname + '/pages/book-editor.html');
});
server.use('/book/:id_or_name/edit', function(req, res) {
    res.sendFile(__dirname + '/pages/book-editor.html');
});

server.use('/config.local.js', function(req, res) {
    res.sendFile(__dirname + '/config.local.js');
});

server.use('/login', function(req, res) {
    res.sendFile(__dirname + '/pages/login.html');
});


server.use('/profile', function(req, res) {
    res.sendFile(__dirname + '/pages/writer_dashboard.html');
});
server.use('/dashboard', function(req, res) {
    res.sendFile(__dirname + '/pages/writer_dashboard.html');
});

server.use('/writer/:id', function(req, res) {
    res.sendFile(__dirname + '/pages/writer_dashboard.html');
});

server.use('/profile', function(req, res) {
    res.sendFile(__dirname + '/pages/profile.html');
});

server.use('/profile/:id', function(req, res) {
    res.sendFile(__dirname + '/pages/profile.html');
});

// routes
server.use('*', function (req, res) {
    res.sendFile(__dirname + '/pages/404.html');
  // serve file
});

let port = 3077;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});
