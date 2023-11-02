const express = require('express'); // Load express
const app = express(); // create app using express

// configure routes
app.get('/',  (req, res) => {// GET  request for '/'
    res.send('hello world');
});

app.get('/api/courses', (req,res)=>{
    res.send ([1,2,3]);
});
//creating enviroment variable; var thats a part of enviroment in which a pprpvess runs, value set outside application
//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listening on port ${port}`)}); // start serverm