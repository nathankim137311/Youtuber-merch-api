const express = require('express');
const { db } = require('./database');
const cors = require('cors');

const PORT = process.env.PORT || 8000; 

const app = express(); 

app.get('/api', (req, res) => {
    res.json('Welcome to my Comedy Podcast Merch Api');
});

// get channel based on name 
app.get('/api/comedy-podcasts/:channelName', (req, res) => {
    db.query('SELECT * FROM ComedyPodcasts WHERE channel_name = (?)',[req.params.channelName], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// get channel based on id 
app.get('/api/comedy-podcasts/:channelId', (req, res) => {
    db.query('SELECT * FROM ComedyPodcasts WHERE channel_id = (?)',[req.params.channelId], (err, result) => {
        if (err) throw err; 
        res.json(result);
    });
});

// get all comedy podcasts 
app.get('/api/comedy-podcasts', (req, res) => {
    db.query('SELECT * FROM ComedyPodcasts', (err, result) => {
        if (err) throw err;
        res.json(result); 
    });
});

// get products based on channel id 
app.get('/api/products/:channelId', (req, res) => {
    db.query('SELECT * FROM Products WHERE channel_id = (?)',[req.params.channelId], (err, result) => {
        if (err) throw err;
        res.json(result); 
    });
}); 

// get products based on channel name 
app.get('/api/products/:channelName', (req, res) => {
    db.query("SELECT * FROM Products WHERE channel_name = (?);", [req.params.channelName], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result); 
    });
});

app.get('/api/all-products', (req, res) => {
    db.query('SELECT * FROM Products', (err, result) => {
        if (err) throw err;
        res.json(result); 
    });
});

const server = app.listen(PORT, () => console.log(`server running on port ${PORT}`));
server.keepAliveTimeout = 61 * 1000;