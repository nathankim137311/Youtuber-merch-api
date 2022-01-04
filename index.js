const express = require('express');
const cors = require('cors');

const PORT = 8000; 

const app = express(); 

app.get('/', (req, res) => {
    res.json('Welcome to my Youtuber Merch Api');
});

app.get('/comedy-podcasts', (req, res) => {
    res.json(comedyPodcasts); 
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));