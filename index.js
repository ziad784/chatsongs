const express = require("express");
const app = express();

const port = 3001 || process.env.PORT
const cors = require("cors");
const session = require("express-session");
const cookie_parser = require("cookie-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var db_config = {
    host: 'eu-cdbr-west-02.cleardb.net',
      user: 'be80ed191fa5a6',
      password: '8c6a5f7a',
      database: 'heroku_0e924455f0af756'
  };

app.set("view engine","ejs");
app.use(express.static(__dirname))
app.use(express.json())
app.use(cookie_parser());
app.use(session({
    secret: 'O6&&Z^22Ktt^arG#4rke!Z!vA',
    resave: false,
    saveUninitialized: true
}))
app.use(cors({
    origin:["http://localhost:3001/","https://chatsongs.herokuapp.com/"],
    methods:["POST","GET"]
}));


let db;

function handleDisconnect(){
    db = mysql.createConnection(db_config);

    db.connect((err)=>{
        if(err){
            console.log("Database connection error because: ", err);
            setTimeout(handleDisconnect,2000);
        }
    })

    db.on("error",(err)=>{
        console.log("database Error: ",err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    })


}


handleDisconnect();

app.listen(port,()=>{
    console.log("I am listening to ",port);
})


app.get("/",(req,res)=>{


    if(isloggedin(req) === true){
        res.render("index",{
            username:req.session.user.username

        })
    }else{
        res.render("auth")
    }
    
    
})


app.get("/cp",(req,res)=>{
    res.render("cp")
})


app.post("/login",(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    if(username.length > 0 && password.length > 0){
        const sql = "SELECT * FROM users WHERE username = ?"

        db.query(sql,[username],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err);
            }

            if(data.length === 1){
                const hashed_password = data[0].password;
                

                if(bcrypt.compareSync(password,hashed_password)){
                    const id = data[0].id
                    const user = {username:username,id:id}
                    req.session.user = user;
                    res.status(200).send(JSON.stringify({res:"ok",user:user}))


                }else{
                    res.status(400).send(JSON.stringify({res:"bad",msg:"اسم المستخدم او كلمة المرور غير صحيحة"}))
                }


               
            }else{
                res.status(400).send(JSON.stringify({res:"bad",msg:"اسم المستخدم او كلمة المرور غير صحيحة"}))
            }

        })

    }else{
        res.status(400).send(JSON.stringify({res:"bad",msg:"لا يمكنك ترك اي حقل فارغ"}))
    }

})



app.post("/signup",(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    if(username.length > 0 && password.length > 0){
        const sql = "SELECT * FROM users WHERE username = ?"

        db.query(sql,[username],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err);
            }

            if(data.length !== 1){

                bcrypt.hash(password,saltRounds,(err,hash)=>{
                    if(err){
                        console.log(err);
                        res.send(err);
                    }

                    const img = "imgs/pic.png"

                    const sql = "INSERT INTO users(img,username,password) VALUES (?,?,?)"
                    db.query(sql,[img,username,hash],(err,data)=>{
                        if (err) {
                            res.send(err);
                        }
                        if(data){

                            const id = data.insertId
                            const user = {username:username,id:id}
                            req.session.user = user;
                            res.status(200).send(JSON.stringify({res:"ok",user:user}))
            

                            
                        }else{
                            res.status(500).send(JSON.stringify({res:"bad",msg:"حدث خطا ما اثناء التسجيل"}))
                        }

                    })

                })

                
                




               
            }else{
                res.status(400).send(JSON.stringify({res:"bad",msg:"اسم المستخدم مستخدم من قبل"}))
            }

        })

    }else{
        res.status(400).send(JSON.stringify({res:"bad",msg:"لا يمكنك ترك اي حقل فارغ"}))
    }

})



function isloggedin(req){
    console.log(req.session);
    if(req.session.user){
        return true;
    }else {
        return false
    }
}
