const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.filter((user) => user.username === username);
    if(user.length > 0){
        return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter((user) => user.username === username && user.password === password);
    if(validUser.length > 0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(300).json({message: "Error logging in"});
  }

    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60*60*20});
        req.session.authorization = {
            accessToken, username
        }
        return res.status(300).json({message: "User successfully loggedIn"});
    }else{
        return res.status(300).json({message: "Please provide the valid username and password"});
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const message = req.body.message;
  let book = Object.entries(books).filter(([key,book]) => book.isbn == isbn).flat();
  const id = book[0];
  book = book[id];
  const username = req.session.authorization.username;

  if(isbn && book){
    let reviews = book.reviews;
    books[id].reviews[username] = {message: message};

    return res.status(300).json({message: "User "+ username +" review updated '" +book.title+"'"});
  }else{
    return res.status(300).json({message: "Book not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = Object.entries(books).filter(([key,book]) => book.isbn == isbn).flat();
    const username = req.session.authorization.username;
    if(book.length > 0){
        const id = book[0];
        delete books[id].reviews[username];

        return res.status(300).json({message: username +" review successfully deleted"});
    }else{
        return res.status(300).json({message: "Book not found."});
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
