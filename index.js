/* Copyright G. Hemingway - @2017 */

// Get some libraries
let path = require("path"),
    express = require("express");

let app = express();
app.use(express.static(path.join(__dirname, "public")));

// Simple route handler
app.get("*", (req, res) => {
    res.send("<h1>Not static content!</h1>");
});

// Start up the server
let server = app.listen(8080, () => {
    console.log("Example app listening on " + server.address().port);
});
