const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered!" })
        } else {
            res.status(404).send("User already exists.");
        }
    } else {
        res.status(404).send("Invalid username/password.");
    }
});

const doesExist = (username) => {
    let samename = users.filter((user) => {
        return user.username === username;
    })
    return samename.length > 0;
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).send("Invalid ISBN.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase(); // safer to lowercase
    let results = [];

    for (const isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            results.push({ isbn, ...books[isbn] });
        }
    }

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).send("Author not found.");
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase(); // safer to lowercase
    let results = [];

    for (const isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
            results.push({ isbn, ...books[isbn] });
        }
    }

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).send("Title not found.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).send("Invalid ISBN.");
    }
});

module.exports.general = public_users;
