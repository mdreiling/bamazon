var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Arsehokie1389",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }

    console.log("connected as id " + connection.threadId + "\n");
    welcomeACME();
});

function welcomeACME() {    
    console.log("Welcome to ACME Corporation Online. Your one stop shop for all your Road Runner hunting needs.")

    
} 