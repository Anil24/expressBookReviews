const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(isValid(username)){
        return res.status(300).json({message: "User already exist"});
    }else{
        users.push({username: username, password: password});
        return res.status(300).json({message: "User successfully register!"});
    }
  }else{
    return res.status(300).json({message: "Please provide the valid username and password"});
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.entries(books).filter(([key,book]) => 
    book.isbn === isbn
  )

  if(book.length > 0){
    return res.status(300).send(Object.fromEntries(book));
  }else{
    return res.status(300).json({message: "No book found by ISBN"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book = Object.entries(books).filter(([key,book]) => 
    book.author === author
  )

  if(book.length > 0){
    return res.status(300).send(Object.fromEntries(book));
  }else{
    return res.status(300).json({message: "No book found by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book = Object.entries(books).filter(([key,book]) => 
    book.title === title
  )

  if(book.length > 0){
    return res.status(300).send(Object.fromEntries(book));
  }else{
    return res.status(300).json({message: "No book found by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.entries(books).filter(([key,book]) => 
    book.isbn === isbn
  )

  if(book.length > 0){
    return res.status(300).send(Object.fromEntries(book.review));
  }else{
    return res.status(300).json({message: "No review found"});
  }
});

module.exports.general = public_users;
