const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// const NeuralNetwork = require('./wwwroot/NN/neural-network.js');
// const s = require('./wwwroot/NN/lib/statistics.js');
// const guid = require('./wwwroot/NN/lib/guid.js');

// let NN = {};

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/wwwroot/index.html'));
});

// app.post('/NN/create', function (req, res) {
//     let nn = new NeuralNetwork(req.body);
//     let newGuid = guid();
//     NN[newGuid] = nn;
//     res.send(newGuid);
// });

// app.post('/NN/forward', function (req, res) {
//     let out = NN[req.body.guid].forward(req.body.inputs);
//     res.send(out);
// });

app.use(express.static(__dirname + '/wwwroot'));

app.listen(PORT, function () {
    console.log('Express server started on port ' + PORT + '!');
});

// async function train(file) {
//     const fileStream = fs.createReadStream(file);

//     const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });

//     for await (const line of rl) {
//         const values = line.split(",").map(v => parseInt(v));
//         NN.train({
//             inputs: [values.slice(1, values.length).map(v => (s.normalize(v, 0, 255) * 0.99) + 0.01)],
//             targets: [values[0]]
//         });
//     }
// }

// async function test(file) {
//     const fileStream = fs.createReadStream(file);

//     const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });

//     const scorecard = [];
//     for await (const line of rl) {
//         const values = line.split(",").map(v => parseInt(v));
//         output = NN.forward(values.slice(1, values.length).map(v => (s.normalize(v, 0, 255) * 0.99) + 0.01));
//         scorecard.push(s.indexOfMax(output.data) === values[0] ? 1 : 0);
//     }

//     return scorecard;
// }
