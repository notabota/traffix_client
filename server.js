const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

const server = express();
server.use(cors())

server.use(express.static(path.join(__dirname, 'dist')));

server.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(9000, (err) => {
    if (err) throw err
    console.log(`> Aye http://localhost:${9000}`)
})