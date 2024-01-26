const express = require("express");
const app = express();
const port = 5000;

const mysql = require("mysql");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

connection.connect((err) => {
  if (err) throw err;
});

var usedb_query = "USE BACKENDTUT";

connection.query(usedb_query, (err, result) => {
  if (err) console.log("error", err);
});

const sampleResponse = {
  name: "John Doe",
  age: 30,
  city: "New York",
};

const AvailableUsers = [
  {
    username: "Vineeth",
    password: "Navya",
  },
  {
    username: "Prathap",
    password: "Saumya",
  },
];

app.get("/hello-world", function (req, res) {
  res.send("Hello World");
});

app.get("/sampleResponse", function (req, res) {
  res.send(sampleResponse);
});

// {
//     "firstname" : "Vineeth",
//     "lastname" : "avvaru",
//     "town": "chirala",
//     "state": "Andhra Pradesh"
// }

// Header , body
// ToDo: research about Error handling
app.post("/samplePost", function (req, res) {
  var response = {
    fullName: req.body.firstname + " " + req.body.lastname,
    address: req.body.town + ", " + req.body.state,
  };
  res.send(response);
});

// {
//     "username": "Vineeth",
//     "password": "Navya",
// }

app.post("/authenticateUser", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let response = {
    message: "",
  };
  for (let i = 0; i < AvailableUsers.length; i++) {
    if (AvailableUsers[i].username === username) {
      if (AvailableUsers[i].password === password) {
        response.message = "Welcome to tutorial";
        break;
      } else {
        response.message = "Incorrect Password";
      }
    }
  }
  if (response.message === "") {
    response.message = "User Not found !!";
  }
  res.send(response);
});

app.get("/fetchUsers", function (req, res) {
  let response = {
    usersData: [],
  };
  const fetchUsersData = "SELECT username, password FROM users";

  connection.query(fetchUsersData, (err, result) => {
    if (err) console.log("error", err);
    response.usersData = result;
    res.send(response);
  });
});

app.post("/authenticateUserDB", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let response = {
    message: "",
  };
  const authenticateUserPassword =
    "SELECT password FROM users WHERE username=?";
  connection.query(authenticateUserPassword, [username], (err, result) => {
    if (result.length == 0) {
      response.message = "DB: User Not Found !!";
    } else if (result[0].password == password) {
      response.message = "DB: Welcome to tutorial";
    } else {
      response.message = "DB: Incorrect password !!";
    }
    res.send(response);
  });
});

app.put("/createUser", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let user = [[username, password]];
  let response = {
    message: "",
  };
  const createNewUserQuery = `INSERT INTO users VALUES ?`;

  connection.query(createNewUserQuery, [user], (err, result) => {
    if (err) throw err;
    response.message = "User successfully added";
    res.send(response);
  });
});

app.patch("/UpdateUser", function (req, res) {
  const username = req.body.username;
  const new_password = req.body.password;
  let response = {
    message: "",
  };
  const patchUserQuery = `UPDATE users SET password = ? WHERE username=?`;

  connection.query(patchUserQuery, [new_password, username], (err, result) => {
    if (err) throw err;
    response.message = "Password successfully updated";
    res.send(response);
  });
});

app.delete("/deleteUser", function (req, res) {
  const username = req.body.username;
  let response = {
    message: "",
  };
  const deleteUserQuery = `DELETE FROM users WHERE username=?`;

  connection.query(deleteUserQuery, [username], (err, result) => {
    if (err) throw err;
    response.message = "User Deleted successfully";
    res.send(response);
  });
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});
