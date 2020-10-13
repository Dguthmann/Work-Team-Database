var mysql = require("mysql");
var inquirer = require("inquirer");
// require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "workteam_DB"
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
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Update Employee Role", "Update Employee Manager", "View Roles", "View Departments", "Add Role", "Add Department", "QUIT"]
        })
        // To Add Later "Remove Employee", 
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.mainMenu === "View All Employees") {
                // Function to show table
                viewEmployees();
            }
            else if (answer.mainMenu === "View All Employees by Department") {
                // Call function to show by department
                byDepartment();
            }
            else if (answer.mainMenu === "View All Employees by Manager") {
                // Call function to show by manager
                byManager();
            }
            else if (answer.mainMenu === "Add Employee") {
                // Use Post Auction Functionality
                addEmployee();
            }
            // else if (answer.mainMenu === "Remove Employee") {
            //     fireEmployee();
            // } 
            else if (answer.mainMenu === "Update Employee Role") {
                // List functionality from roles
                updateRole();
            }
            else if (answer.mainMenu === "Update Employee Manager") {
                updateManager();
            }
            else if (answer.mainMenu === "View Roles") {
                viewRoles();
            }
            else if (answer.mainMenu === "View Departments") {
                viewDepartments();
            }
            else if (answer.mainMenu === "Add Role") {
                // Use Post Auction Functionality
                addRole();
            }
            else if (answer.mainMenu === "Add Department") {
                // Use Post Auction Functionality
                addDepartment();
            }
            else {
                console.log("Thank you for using the database");
                console.log("Good Bye!");
                connection.end();
            }
        });
}

// function shows the employee table and returns to prompt menu
function viewEmployees() {
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
function byDepartment() {
    console.log("I'm viewing by dept");

    start()
}

// function shows the employee table by manager and returns to prompt menu
function byManager() {
    // console.log("I'm viewing by manager");
    connection.query("SELECT * FROM employee ORDER BY manager_id", function (err, stuff) {
        if (err) {
            throw err;
        } else {
            console.table(stuff);
            start();
        }
    })
}

// Use post function for framework
function addEmployee() {
    // console.log("I'm adding an employee");
    connection.query("SELECT * FROM my_role", (err, results) => {
        if (err) throw err;
        // console.table(results);
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the first name of the new employee?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the last name of the new employee?"
            }, {
                name: "role",
                type: "rawlist",
                message: "Which role is the employee?",
                choices: function () {
                    const roleArray = [];
                    for (let j = 0; j < results.length; j++) {
                        roleArray.push(results[j].title);
                    }
                    return roleArray;
                }
            }
        ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                const roleName = answer.role;
                const roleID = results.filter(rolo =>
                    rolo.title === roleName
                )
                console.table(roleID);
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: roleID[0].role_id,
                    },
                    function (err) {
                        if (err) {
                            throw err;
                        }
                        // console.table(managerial)
                        const managerID = handleManager(answer.first_name, answer.last_name)
                    })
            });
    });
};


function updateManager() {
    // console.log("I'm adding an employee");
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        // console.table(results);
        inquirer.prompt([
            {
                name: "emp",
                type: "rawlist",
                message: "Which employee?",
                choices: function () {
                    const employeeArray = [];
                    for (let j = 0; j < results.length; j++) {
                        employeeArray.push(results[j].first_name + " " + results[j].last_name)
                    }
                    return employeeArray;
                }
            },
            {
                name: "man",
                type: "rawlist",
                message: "What is this employee's manager?",
                choices: function () {
                    const personArray = [];
                    for (let j = 0; j < results.length; j++) {
                        personArray.push(results[j].first_name + " " + results[j].last_name)
                    }
                    return personArray;
                }
            }
        ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                const [firstN, lastN] = answer.emp.split(" ");
                const foundEmployee = results.filter(employee =>
                    employee.first_name === firstN && employee.last_name === lastN
                );
                const [firstName, lastName] = answer.man.split(" ");
                const foundManager = results.filter(manager =>
                    manager.first_name === firstName && manager.last_name === lastName
                );
                connection.query(
                    "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?", [foundManager[0].employee_id, foundEmployee[0].first_name, foundEmployee[0].last_name], function (err) {
                        if (err) throw err;
                        console.log("Your employee was created successfully!");
                        start();
                    })
            });
    });
};

function handleManager(first, last) {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        const personArray = [];
        for (let j = 0; j < results.length; j++) {
            personArray.push(results[j].first_name + " " + results[j].last_name)
        }
        inquirer.prompt([
            {
                name: "manager",
                type: "rawlist",
                message: "What is the manager of the new employee (pick new employee's name if no manager or self managed)?",
                choices: personArray
            }]).then(function (man) {
                const [firstName, lastName] = man.manager.split(" ");
                const foundManager = results.filter(manager =>
                    manager.first_name === firstName && manager.last_name === lastName
                );
                connection.query(
                    "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?", [foundManager[0].employee_id, first, last], function (err) {
                        if (err) throw err;
                        console.log("Your employee was created successfully!");
                        start();
                    })
            })
    });
}

// Update FK role_id for employee
function updateRole() {
    console.log("I'm updating role");
    start()
}

// function shows the role table and returns to prompt menu
function viewRoles() {
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
function addRole() {
    // console.log("I'm adding a roll");
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "role_name",
                type: "input",
                message: "What is the new role called?"
            }, {
                name: "salary",
                type: "number",
                message: "What is the new role salary?"
            }, {
                name: "depart",
                type: "list",
                message: "Which department is this part of?",
                choices: function () {
                    const choicesArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choicesArray.push(results[i].dep_name);
                    }
                    return choicesArray;
                }
            }
        ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                const depName = answer.depart;
                const depID = results.filter(depa =>
                    depa.dep_name === depName
                )
                console.table(depID);
                connection.query(
                    "INSERT INTO my_role SET ?",
                    {
                        title: answer.role_name,
                        salary: answer.salary,
                        department_id: depID[0].department_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your role was created successfully!");
                        // re-prompt the user for if they want to bid or post
                        start();
                    }
                );
            });
    });
}

// Use post function for framework, create the employee one first then recycle ideas will be simplier for both role and dept
function addDepartment() {
    console.log("I'm adding a dept");
    inquirer
        .prompt([
            {
                name: "dep_name",
                type: "text",
                message: "What is the new department called?"
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?",
                {
                    dep_name: answer.dep_name
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
}