// app.js
const express = require('express')
const cors = require('cors')

// Create Express app
const app = express()
const corsOptions = {
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions)) // include before other routes


let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'db-id.cpyweoetxkin.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '5h9TpunEqmeFv7Q',
    database: 'sensors_data'
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});

function destroyConnection() {
    connection.end(function (err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
    });
}

// A sample route
app.get('/', (req, res) => res.send('HOME'))
app.get('/getAll', (req, res) => {
    connection.query('SELECT * FROM SensorData', function (err, rows) {
        if (err) {
            throw err;
        } else
            res.send(rows)
    })
})

app.get('/getLast/:amount', (req, res) => {
    connection.query('SELECT * FROM SensorData ORDER BY Date_n_Time DESC LIMIT ' + req.params.amount, function (err, rows) {
        if (err) {
            throw err;
        } else
            res.send(rows)
    })
})

app.get('/actDate', (req, res) => {
    let actDate = new Date();
    let fDate = actDate.getFullYear() + '-' + (actDate.getMonth() + 1) + '-' + actDate.getDate();
    connection.query('SELECT * FROM SensorData WHERE Date(Date_n_Time) = ?', [fDate], function (err, rows) {
        if (err) {
            throw err;
        } else
            res.send(rows)
    })
})

app.get('/actDate/:date', (req, res) => {
    connection.query('SELECT * FROM SensorData WHERE Date(Date_n_Time) = ?', [req.params.date], function (err, rows) {
        if (err) {
            throw err;
        } else
            res.send(rows)
    })
})

app.get('/hData/:hour', (req, res) => {
    let actDate = new Date();
    let fDate = actDate.getFullYear() + '-' + (actDate.getMonth() + 1) + '-' + actDate.getDate();
    connection.query('SELECT AVG(Pollution) AS Total FROM SensorData WHERE Date(Date_n_Time) = ? AND Hour(Date_n_Time) = ?', [fDate, req.params.hour], function (err, rows) {
        if (err) {
            throw err;
        } else {
            data = rows[0].Total.toString();
            res.send(data.toString())
        }
    })
})

app.get('/Sensor/:id', (req, res) => {
    connection.query('SELECT * FROM SensorData WHERE SensorID=\'s' + req.params.id + '\'', function (err, rows) {
        if (err) {
            throw err;
        } else
            res.send(rows)
    })
})

// Start the Express server
app.listen(8080, () => console.log('Server running on port 8080!'))