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
    supervisorACME();
});

function supervisorACME() {    
    console.log("\nWelcome to ACME Corporation Online - Supervisor Mode");
    var supervisorChoices = [
        "View Product Sales Information", 
        "Add a new department", 
        "Exit"
    ]

    // Inquirer prompt of list of options
    inquirer.prompt([
        {
            type: "list",
            name: "supervisorOptions",
            message: "Please select the action you would like to preform",
            choices: supervisorChoices
        }
    ]).then(function(supAns) {
        switch(supAns.supervisorOptions) {
            case supervisorChoices[0]:
            productSales();
            break;
            
            case supervisorChoices[1]:
            addDepartment();
            break;
            
            case supervisorChoices[2]:
            connection.end();
            break;
        }
    });


} 

function productSales() {

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\nProduct ID | Product Name | Department | Price | Quantity in Stock")

        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }

        managerACME();
    });

}

function addDepartment() {
    inquirer.prompt([

        {
            type: "input",
            name: "departmentName",
            message: "What is the name of the new department?"
        },
        {
            type: "input",
            name: "initialOverhead",
            message: "What is the initial overhead for this department?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(newDep) {
        
        var newDep = newDep.departmentName;
        var newDepOH = newDep.initialOverhead;

        console.log("\nYou are adding a department called " + newProDep + " with an initial overhead of " + newDepOH)
        
        inquirer.prompt([
            {
                type: "confirm",
                name: "deparmentConfirm",
                message: "Would you like to add this new department to our records?",
                default: false
            }
        ]).then(function(confirm) {
            if (confirm.productConfirm) {
                connection.query(
                    "INSERT INTO deparments SET ?",
                    {
                      department_name: newDep,
                      overhead_costs: newDepOH
                    },
                    function(error) {
                      if (error) throw err;
                      console.log("\nThe new department has been added\n");
                      supervisorACME();
                    }
                );
            } else {
                supervisorACME();
            }
        })
    })
}