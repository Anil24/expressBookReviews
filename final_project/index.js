const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret: Buffer.from("fingerprint_customer").toString("base64"),resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(req.session.authorization){
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if(!err){
                req.user = user;
                next()
            }else{
                return req.statusCode(403).json({message: "User not authenticated"});
            }
        })
    }else{
        return req.statusCode(403).json({message: "User not logged in!"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

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