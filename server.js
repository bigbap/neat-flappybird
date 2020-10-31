const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/wwwroot/index.html'));
});

app.post('/save', function (req, res) {
    let brain = req.body;
    let data = JSON.stringify(brain);
    fs.writeFileSync(`./data/${Date.now()}.json`, data);
    res.send("saved");
});

app.use(express.static(__dirname + '/wwwroot'));

app.listen(PORT, function () {
    console.log('Express server started on port ' + PORT + '!');
});
