var mysql = require('mysql');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"tms",
    
});
con.connect(function(err) {
    if (err) throw err;
    else console.log("Database Connected Successfully");
});

module.exports = con;