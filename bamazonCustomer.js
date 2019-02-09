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
    console.log("Welcome to ACME Corporation Online. Your one stop shop for all your Road Runner hunting needs.");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // console.log(res);
        console.log("\nProduct ID | Product Name | Department | Price | Quantity in Stock")

        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }

        customerQuery();
    });

} 

function customerQuery() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemSelection",
            message: "\nWhich product would you like to order (by Item ID)?"
        },
        {
            type: "input",
            name: "itemQuantity",
            message: "\nHow many would you like to order?"
        }
    ]).then(function(cus) {
        
        var cusID = cus.itemSelection;
        var cusQTY = cus.itemQuantity;

        connection.query("SELECT product_name, price, stock_quantity FROM products WHERE item_id=?", [cusID], function(err, res) {
            if (err) throw err;
            // console.log(res);

            var curQTY = res.stock_quantity;
            if (curQTY >= cusQTY) {
                console.log("You are ordering")
            }
        });
    });
}