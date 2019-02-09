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
    managerACME();
});

function managerACME() {    
    console.log("\nWelcome to ACME Corporation Online - Manager Mode");
    var managerChoices = [
        "Check current product information", 
        "Check products with low stock", 
        "Add stock to an existing product", 
        "Add a new product", 
        "Exit"
    ]


    // Inquirer prompt of list of options
    inquirer.prompt([
        {
            type: "list",
            name: "managerOptions",
            message: "Please select the action you would like to preform",
            choices: managerChoices
        }
    ]).then(function(manAns) {
        switch(manAns.managerOptions) {
            case managerChoices[0]:
            productSearch();
            break;
            
            case managerChoices[1]:
            lowStock();
            break;
            
            case managerChoices[2]:
            addStock();
            break;
            
            case managerChoices[3]:
            addProduct();
            break;
            
            case managerChoices[4]:
            connection.end();
            break;
        }
    });


} 

function productSearch() {
    // Pulling current product information
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\nProduct ID | Product Name | Department | Price | Quantity in Stock")

        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }

        managerACME();
    });

}

function lowStock() {
    var query = "SELECT product_name FROM products WHERE stock_quantity <= 5"; 
    
    connection.query(query, function(err, res) {
    if (res.length === 0) {
        console.log("No products with low stock");
        managerACME();
      
    } else {
    
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name);
          }
          managerACME();
      }
    });

}

function addStock() {
    console.log("Add Stock to Product");
    managerACME();
}

function addProduct() {
    console.log("Add a New Product");
    managerACME();
}