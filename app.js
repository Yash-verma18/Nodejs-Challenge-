// Requiring necessary Modules

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

const https = require('https');

// GET /todos - returns a list of todos without user id field


app.get("/todos", function(req, res) {

    https.get('https://jsonplaceholder.typicode.com/todos', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            const userData = JSON.parse(data);
            userData.forEach(elm => delete elm.userId);
            res.send(userData);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});


// GET /user/<pass-your-user-id> - returns user information along with todo items where userid matches with the one provided in the URL


var todoList = new Array();

app.route("/user/:userId")

.get(function(req, res) {

    const req_userId = req.params.userId;


    https.get('https://jsonplaceholder.typicode.com/users/' + req_userId, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            const userData = JSON.parse(data);


            https.get('https://jsonplaceholder.typicode.com/todos', (resp) => {
                let data = '';

                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    const usersInfo = JSON.parse(data);
                    // console.log(usersInfo[0]);

                    for (let i = 0; i < usersInfo.length; i++) {
                        if (usersInfo[i].userId == req.params.userId) {
                            // console.log(usersInfo[i]);
                            todoList.push(usersInfo[i]);
                        }
                    }
                    // todoList.push("YASH");

                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });

            let userTodo = {
                "id": userData.id,
                "name": userData.name,
                "email": userData.email,
                "phone": userData.phone,
                "todos": todoList,
                "address": userData.address,
                "website": userData.website,
                "company": userData.company
            }

            res.send(userTodo);
            todoList.length = 0;
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});




app.listen(3000, function() {
    console.log("Server started successfully");
});