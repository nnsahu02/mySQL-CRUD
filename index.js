const mysql = require('mysql2');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());



var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sahurk012',
    database: 'demo',
    multipleStatements: true
});



mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});



app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));



//create contact
app.post('/Contacts', (req, res) => {
    let emp = req.body;
    var sql = "CALL ContactsAddOrEdit(?, ?, ?, ?, ?);";
    mysqlConnection.query(sql, [emp.idcontacts, emp.first_name, emp.last_name, emp.email, emp.mobile], (err, rows, fields) => {
        if (!err) {
            rows.forEach(row => {
                if (row.constructor == Array) {
                    res.send('Inserted Contacts id: ' + row[0].idcontacts);
                }
            });
        } else {
            console.log(err);
            res.status(500).send({ msg: err.message });
        }
    });
});


//Get all Contacts
app.get('/Contacts', (req, res) => {
    mysqlConnection.query('SELECT * FROM Contacts', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Get an Contactss
app.get('/Contacts/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Contacts WHERE idcontacts = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Delete an Contactss
app.delete('/Contacts/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Contacts WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});



//Update an Contactss
app.put('/Contacts', (req, res) => {
    let emp = req.body;
    var sql = "SET first_name = ?;SET last_name = ?;SET email = ?;SET mobile = ?; \
    CALL ContactsAddOrEdit(@first_name,@last_name,@email, @mobile);";
    mysqlConnection.query(sql, [emp.first_name, emp.last_name, emp.email, emp.mobile], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});






