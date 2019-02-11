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
            message: "Which product would you like to add stock to (by product ID)?"
        },
        {
            type: "input",
            name: "addStockQuantity",
            message: "How much would like to increase the stock by?"
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

            // Show manager amount of increase
            console.log("You are adding " + manQTY + " to " + res[0].product_name);
        
            // Inquirer prompt to confirm order
            inquirer.prompt([
                {
                    type: "confirm",
                    name: "stockConfirm",
                    message: "Would you like to add this stock?",
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
    console.log("Add a New Product");
    managerACME();
}