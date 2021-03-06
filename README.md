# bamazon
Bamazon Storefront - Module 12 HW

0: Product Summary

    0.1: Customer Portal - [Using the Customer Portal](/bamazonCustomer.mp4)

        In the Customer Portal the user is first shown the full list of products available for purchase. Then the user is prompted to select a product to order, then indicate the quantity that they would like to order. After this, the user is shown their order including total and asked to confirm their purchase. After they confirm their purchase, they are taken to the product listing screen.

        If there are not enough products to complete their order, they are told this and taken back to the product listing screen.

    0.2: Manager Portal - [Using the Manager Portal](/bamazonManager.mp4)

        In the Manager Portal the user is first prompted with five options: Check all products, Check Products with low stock, Add stock to an existing product, Add a new product, or exit. 
        
        In the example in the video, the manager first checks which products have low stock and is shown that there is one product with a low inventory. The manager is then taken back to the initial prompt where they then decide to restock this item. The prompt asks for the product number and the amount of new stock the manager would like to add, is then shown these numbers and asked to confirm. Once they confirm the stock the manager is taken back to the intiial prompt screen and in this case, chooses to check all of the products to make sure that the stock has been updated.

        In this example the manager then decides to add a new product. The manager is prompted to submit a name, department, price, and initial stock quantity. After they submit this information, they are shown it back and asked to confirm it. Once confirmed they are taken back to the initial prompt screen and decide to check to see if the stock has been updated.

1: Introduction

    1.1: Basic Instructions
        
        In this activity, you'll be creating an Amazon-like storefront with the MySQL skills you learned this unit. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.

2: Draft Notes

    2.1: Level One - Customer Portal

        Needs: 
        
            Database
                => Included in DB: products table with the following columns:
                    * item_id (unique id for each product)
                    * product_name (Name of product)
                    * department_name
                    * price (cost to customer)
                    * stock_quantity (how much of the product is available in stores)

            Node app - Customer mode
                => Allows users to view full product listings, select item and quantity of items to purchase
                    If there are enough items in stock => Show user total needed to complete transaction and update stock quantity
                    If there are not enough items in stock => Inform user and let them make another choice/exit

        Use scenario mapping:

        1.  Welcome screen then listing of all products
        2.  Prompt user for product selection and quantity desired
        3.  Either: 
                a) Sumation of amount owed showed to user and asked for confirmation
                b) Message shown about not enough stock available, asked to update selection
        4.  (3a cont.) Message shown thanking user for order and stock quantity updated

        Pseudocoding:

        1. On app load =>
            Welcome screen shown - console.log
            Pull current product database information and show on screen - mysql needed, get command of products then console.log info

        2. Placing order =>
            User prompted for product id and quantity desired - inquirer needed

        3. Reviewing order =>
            Compare user submitted information with database - get item information based off of product id and place into variables to compare to user submitted information

            One of three options as a result
                a.  Stock >= quantity ordered - Items in stock - User then shown total (price * quantity ordered) and asked to confirm            purchase (inquirer)
                b.  Stock < quantity ordered - Not enough in stock - User asked to make another selection and taken to main menu
                c.  Item id not in system - Error message shown, user taken to main menu

        4. Updating stock =>
            If 3a occurs, update stock by initial stock - quantity ordered

    2.2 Level Two - Manager Portal
    
        Needs: 

            Node app - Manager mode 
                => Allows a manager to view full product listings, view items with low inventory, add stock to current products, or add a new product

        Use scenarios to address:

        1.  View current products
        2.  View items with low inventory
        3.  Add stock to current products
        4.  Add a new product

        Pseudocoding:

        Universial - app start with function called to finish all use scenarios
        1. On app load =>
            User prompted to select from list of options (use scenarios addressed above) - inquirer needed

        US-1: Viewing Current Products
        1. Pull current product database information and show on screen - mysql needed, get command of products then console.log info

        US-2: View items with low inventory
        1. Pull current product information for products with an quantity_stock less than 3

        US-3: Adding stock to current products
        1. Ask user which product (by item_id) they'd like to add stock. Also ask how much stock they'd like to add
        2. Add submitted additional stock to existing stock - ask for confirmation before updating database

        US-4: Adding stock to current products
        1. Prompts asking for product name, department, price, and quantity in stock
        2. Push submitted information to database as a new entry