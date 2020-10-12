var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "workTeam_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "mainMenu",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Update Employee Role", "View Roles", "View Departments", "Add Role", "Add Department", "QUIT"]
        })
        // To Add Later "Remove Employee", "Update Employee Manager",
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.mainMenu === "View All Employees") {
                // Function to show table
                viewEmployees();
            }
            if (answer.mainMenu === "View All Employees by Department") {
                // Call function to show by department
                byDepartment();
            }
            if (answer.mainMenu === "View All Employees by Manager") {
                // Call function to show by manager
                byManager();
            }
            if (answer.mainMenu === "Add Employee") {
                // Use Post Auction Functionality
                addEmployee();
            } 
            // else if (answer.mainMenu === "Remove Employee") {
            //     fireEmployee();
            // } 
            if (answer.mainMenu === "Update Employee Role") {
                // List functionality from roles
                updateRole();
            }
            //  else if (answer.mainMenu === "Update Employee Manager") {
                // updateManager();
            // } 
            if (answer.mainMenu === "View Roles") {
                viewRoles();
            }
            if (answer.mainMenu === "View Departments") {
                viewDepartments();
            }
            if (answer.mainMenu === "Add Role") {
                // Use Post Auction Functionality
                addRole();
            }
            else if (answer.mainMenu === "Add Department") {
                // Use Post Auction Functionality
                addDepartment();
            }
            else {
                connection.end();
            }
        });
}

// function shows the employee table and returns to prompt menu
function viewEmployees(){
    connection.query("SELECT * FROM employee", function (err, stuff) {
        if (err) {
            throw err;
        } else {
            console.table(stuff);
            start();
        }
    })
}

// function shows the employee table by dept and returns to prompt menu
function byDepartment(){

}

// function shows the employee table by manager and returns to prompt menu
function byManager() {

}

// Use post function for framework
function addEmployee(){

}

// Update FK role_id for employee
function updateRole(){

}

// function shows the role table and returns to prompt menu
function viewRoles(){
    connection.query("SELECT * FROM my_role", function (err, stuff) {
        if (err) {
            throw err;
        } else {
            console.table(stuff);
            start();
        }
    })
}

// function shows the role table and returns to prompt menu
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, stuff) {
        if (err) {
            throw err;
        } else {
            console.table(stuff);
            start();
        }
    })

}

// Use post function for framework, create the employee one first then recycle ideas will be simplier for both role and dept
function addRole(){

}

// Use post function for framework, create the employee one first then recycle ideas will be simplier for both role and dept
function addDepartment(){

}