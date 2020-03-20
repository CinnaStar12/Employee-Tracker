const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require("console.table")

const Employee = require("./lib/employee")
const Department = require("./lib/department")
const Role = require("./lib/role")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Sainz.55",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw (err);
    initialize();
})


function initialize() {
    const choiceArr = ["Add", "View", "Update", "Quit"]
    inquirer.prompt([{
        type: "rawlist",
        message: "Welcome to the Employee Manager! \n What would you like to do?",
        choices: choiceArr,
        name: "userChoice"
    }]).then(function(ans) {
        if(ans.userChoice === choiceArr[0])
        {
            addTo();
        }
        else if(ans.userChoice === choiceArr[1])
        {
            tableView();
        }
        else if(ans.userChoice === choiceArr[2])
        {
            updateEmployee();
        }
        else if(ans.userChoice === choiceArr[3])
        {
            connection.end()
        }
    })
}

function addTo() {
    const addChoiceArr = ["Department", "Employee", "Role"]
    inquirer.prompt({
        type: "rawlist",
        message: "What would you like to add?",
        choices: addChoiceArr,
        name: "addChoice"
    }).then(function(ans){
        if(ans.addChoice === addChoiceArr[0]){
            addNewDepartment()
        }
        else if(ans.addChoice === addChoiceArr[1]){
            addNewEmployee()
        }
        else if(ans.addChoice === addChoiceArr[2]){
            addNewRole()
        }
    })
}

function addNewDepartment(){
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the department you would like to create?",
        name: "depName"
    }]).then(function(res) {
        const newDep = new Department(res.depName);
        newDep.addDepartment();
        initialize();
    })
}

function addNewRole(){
    connection.query("SELECT * FROM department", function(err, res){
        if(err) throw err;
        const departments = res;
        const depArr = []
        for(let row of departments){
            depArr.push(row.depName);
        }
        console.log(depArr)
        inquirer.prompt([{
            type: "input",
            message: "What is the name of the role you would like to create?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the starting salary of the role you are creating?",
            name: "roleSalary"
        },
        {
            type: "rawlist",
            message: "What department would like to add this role to?",
            name: "roleDep",
            choices: depArr
        }
    ]).then(function(res){
        console.log(res)
    })
    })
}