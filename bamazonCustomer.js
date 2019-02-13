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
    
    // Pulling current product information
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\nProduct ID | Product Name | Department | Price | Quantity in Stock")

        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }

        customerQuery();
    });

} 

function customerQuery() {
    console.log("\n");
    
    // Inquirer prompts for selecting product and quantity for order
    inquirer.prompt([
        {
            type: "input",
            name: "itemSelection",
            message: "Which product would you like to order (by Item ID)?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            name: "itemQuantity",
            message: "How many would you like to order?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(cus) {
        
        // Pushing customer selections onto variables for later comparisons
        var cusID = cus.itemSelection;
        var cusQTY = parseInt(cus.itemQuantity);

        // Setting up query for selecting product information
        var query = "SELECT product_name, price, stock_quantity, product_sales FROM products WHERE item_id=?"; 

        connection.query(query, [cusID], function(err, res) {
            // Throw error if the connection does not work.
            if (err) throw err;

            // Setting quantity and price variables for product that the customer selected.
            var curQTY = parseInt(res[0].stock_quantity);
            var curPRC = parseInt(res[0].price);
            var curSAL = parseInt(res[0].product_sales)

            // If statement for checking if there is enough in stock to complete the order.
            if (curQTY >= cusQTY) {
                
                // Calculating total
                var total = curPRC * cusQTY;
                var productSales = curSAL + total;
                
                // Showing customer total of order
                console.log("\nYou are ordering " + cusQTY + " " + res[0].product_name + " for a total of $" + total);
                
                // Inquirer prompt to confirm order
                inquirer.prompt([
                    {
                        type: "confirm",
                        name: "orderConfirm",
                        message: "Would you like to place this order?",
                        default: false
                    }
                ]).then(function(confirm) {
                    if (confirm.orderConfirm) {
                        curQTY = curQTY - cusQTY;
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                              {
                                stock_quantity: curQTY,
                                product_sales: productSales
                              },
                              {
                                item_id: cusID
                              }
                            ],
                            function(error) {
                              if (error) throw err;
                              console.log("\nYour order has been place successfully");
                              console.log("\n----------------------------------------------");

                              welcomeACME();
                            }
                          );
                    } else {
                        welcomeACME();
                    }
                })
            
            } else {
                console.log("We are currently do not have enough " + res[0].product_name + " in stock to complete your order. Please make another selection.")
                welcomeACME();
            }
        });
    });
}