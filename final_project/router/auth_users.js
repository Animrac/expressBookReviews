const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username || password) {
        if (authenticatedUser(username, password)) {

            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 600 });

            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).json({ message: "User successfully logged in!" })
        } else {
            res.status(404).send("Invalid login. Please check your username and password.");
        }
    } else {
        res.status(404).send("Error logging in.");
     }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review; // <-- This is how you grab it
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;  // Overwrites any previous review by this user
        const bookTitle = books[isbn].title;
        return res.status(200).json({ message: `Your review for ${bookTitle}, '${review}', has been added to the system!` });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            const bookTitle = books[isbn].title;
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: `Your review for ${bookTitle} has been deleted.` });
        } else {
            return res.status(404).json({ message: "You have no review for this title." });
        }
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
