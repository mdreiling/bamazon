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
    var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity <= 5"; 
    
    connection.query(query, function(err, res) {
    if (res.length === 0) {
        console.log("No products with low stock");
        managerACME();
      
    } else {
        
        console.log("Item ID | Product Name | Quantity in Stock")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
          }
          managerACME();
      }
    });

}

function addStock() {
    
    inquirer.prompt([
        {
            type: "input",
            name: "addStockProduct",
            message: "Which product would you like to add stock to (by product ID)?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            name: "addStockQuantity",
            message: "How much would like to increase the stock by?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(stockAns) {
         
        // Pushing manager selections onto variables for later comparisons
        var manID = stockAns.addStockProduct;
        var manQTY = parseInt(stockAns.addStockQuantity);

        // Setting up query for selecting product information
        var query = "SELECT product_name, stock_quantity FROM products WHERE item_id=?"; 
 
        connection.query(query, [manID], function(err, res) {
            // Throw error if the connection does not work.
            if (err) throw err;
 
            var curQTY = parseInt(res[0].stock_quantity);

            // Show manager amount of they are increasing stock by for confirmation
            console.log("You are adding " + manQTY + res[0].product_name + " to stock" );
        
            // Inquirer prompt to confirm addition of stock
            inquirer.prompt([
                {
                    type: "confirm",
                    name: "stockConfirm",
                    message: "Would you like to add these products to our stock?",
                    default: false
                }
            ]).then(function(confirm) {
                if (confirm.stockConfirm) {
                    curQTY = curQTY + manQTY;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: curQTY
                          },
                          {
                            item_id: manID
                          }
                        ],
                        function(error) {
                          if (error) throw err;
                          console.log("\nThe stock has been updated\n");
                          managerACME();
                        }
                    );
                } else {
                    managerACME();
                }
            })
        });
        
    });

}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "What is the name of the product you would like to add?"
        },
        {
            type: "input",
            name: "departmentName",
            message: "Which department does this product go in?"
        },
        {
            type: "input",
            name: "productPrice",
            message: "What is the price to customer for this product?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            name: "initialStock",
            message: "What is the initial stock for this product?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(newPro) {
        
        var newProName = newPro.productName;
        var newProDep = newPro.departmentName;
        var newProPrice = newPro.productPrice;
        var newProStock = newPro.initialStock;

        console.log("You are adding the product " + newProName + " to " + newProDep + " with a price of " + newProPrice + " and an initial stock of " + newProStock)
        
        inquirer.prompt([
            {
                type: "confirm",
                name: "productConfirm",
                message: "Would you like to add this new product to our inventory?",
                default: false
            }
        ]).then(function(confirm) {
            if (confirm.productConfirm) {
                connection.query(
                    "INSERT INTO products SET ?",
                    {
                      product_name: newProName,
                      department_name: newProDep,
                      price: newProPrice,
                      stock_quantity: newProStock
                    },
                    function(err) {
                      if (err) throw err;
                      console.log("\nThe new product has been added\n");
                      managerACME();
                    }
                );
            } else {
                managerACME();
            }
        })
    })
}