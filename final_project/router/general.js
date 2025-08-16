const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const url = 'https://raw.githubusercontent.com/Anil24/expressBookReviews/refs/heads/main/final_project/router/booksList.json';

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
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const response = await axios.get(url);
    return res.status(300).send(JSON.stringify(books, null, 4));
  }catch (error){
    return res.status(500).json({messsage: "Error in fatching a book"});
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try{
    const bookslist = (await axios.get(url)).data;
    let isbn = req.params.isbn;
    let book = Object.entries(bookslist).filter(([key,book]) =>
        book.isbn == isbn
    )

    if(book.length > 0){
        return res.status(300).send(Object.fromEntries(book));
    }else{
        return res.status(300).json({message: "No book found by ISBN"});
    }
  }catch (error){
    return res.status(500).json({messsage: "Error in fatching a book"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try{
        //Write your code here
        const bookslist = (await axios.get(url)).data;
        let author = req.params.author;
        let book = Object.entries(bookslist).filter(([key,book]) => 
            book.author === author
        )

        if(book.length > 0){
            return res.status(300).send(Object.fromEntries(book));
        }else{
            return res.status(300).json({message: "No book found by author"});
        }
    }catch (error){
        return res.status(500).json({messsage: "Error in fatching a book"});
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    try{
        //Write your code here
        const bookslist = (await axios.get(url)).data;
        let title = req.params.title;
        let book = Object.entries(books).filter(([key,book]) => 
            book.title === title
        )

        if(book.length > 0){
            return res.status(300).send(Object.fromEntries(book));
        }else{
            return res.status(300).json({message: "No book found by title"});
        }
    }catch (error){
        return res.status(500).json({messsage: "Error in fatching a book"});
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
