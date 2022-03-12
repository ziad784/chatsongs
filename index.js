require("dotenv").config();
const express = require("express");
<<<<<<< HEAD
const app = express();

const port = process.env.PORT
const cors = require("cors");
=======
>>>>>>> 17049f1 (first push)
const session = require("express-session");
const cookie_parser = require("cookie-parser");
const formidable = require('formidable');
const mv = require("mv");
const app = express();
const fs = require("fs");
const port = process.env.PORT
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io  = socketio(server);
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let {IPinfoWrapper} = require("node-ipinfo")
let ipinfo = new IPinfoWrapper("16fbed578176de");

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

server.listen(port,()=>{
    console.log("I am listening to ",port);
})

let users = []

io.on('connection', (socket)=>{
    
    socket.on("join room",(data)=>{
      
        const id = socket.id;
        const room = data.room
        const name = data.name
        const user = {id,room,name}
        if(users.length > 0){

            if(!users.find((user)=> user.name === data.name)){
                users.push(user)
            }
        }else{
            users.push(user)
        }
       
     
        socket.join(data.room);

        const size = users.filter((user) => user.room === data.room).length
        io.to(data.room).emit("size",size);
        socket.broadcast.to(data.room).emit("welcome message",{user:data.name,room:data.room,msg:"هذا المستخدم إنضم الى الغرفة"})
        socket.on("message",(data)=>{
            if(users.length > 0){
                console.log(users);
                const room = users.find((user)=> user.id === socket.id).room
                io.to(room).emit("message",data)
            }
        })
    })

    socket.on("disconnect", () => {




        users = users.filter((user) => user.id != socket.id)

        console.log(users);
        // if(users.length > 0){
        //     console.log(users);
        //     const room = users.find((user)=> user.id === socket.id).room
        //     const name = users.find((user)=> user.id === socket.id).name
        //     socket.broadcast.to(room).emit("welcome message",{user:name,room:room,msg:"هذا المستخدم خرج من الغرفة"})
           
        // }

      });
    


} )



app.get("/",(req,res)=>{
    

    if(isloggedin(req) === true){
        const id = req.session.user.id;

        const sql = "SELECT * FROM users WHERE id = ?"
        db.query(sql,[id],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err)
            }


            if(data.length === 1){

                const power = data[0].power

                res.render("index",{
                    username:req.session.user.username,
                    power:power
        
                })
            }

        })

    }else{
       return res.render("auth")
    }
    
    
    
})

app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/")
})


app.post("/upload",(req,res)=>{
    const form = new formidable.IncomingForm()
  
    form.parse(req,(err,fields,files)=>{
      if(err){
        console.log(err);
        return
      }
      const celebrityId = fields.celebrityId
      const videosPath = "imgs/rooms/"
      const oldPath = files.inputFile.filepath
      const newPath = videosPath+files.inputFile.originalFilename
     
  
   
  
  
      if(!fs.existsSync(videosPath)){
        fs.mkdir(videosPath,(err)=>{
          if(err){
            console.log(err);
            return
  
          }
  
  
   
        })
      }
  
      
  
      mv(oldPath,newPath,(err)=>{
        if(err){
          console.log(err);
          return
        }
  
  
        const server = process.env.SERVER
  
        const url = server+newPath
       
      
        const sql = "UPDATE rooms SET photo = ? WHERE id = ?"
  
        db.query(sql,[photo,id],(err,vids)=>{
          if(err){
            console.log(err);
            res.status(300).send(err)
          }
      
          if(vids){
  
            res.send(JSON.stringify({res:"ok"}))
  
          }
        })
  
      })
  
      
  
  
    })
  
  })
  
  



app.get("/cp",(req,res)=>{

    if(req.session.user){

        const id = req.session.user.id;

        const sql = "SELECT * FROM users WHERE id = ?"
        db.query(sql,[id],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err)
            }


            if(data.length === 1){

                const power = data[0].power

                if(power > 0){
                    res.render("cp")
                }else{

                    res.redirect(403,"/")
                }
            }else{
                res.redirect("/")
            }

        })
    }else{
        res.redirect("/")
    }
 
})

app.get("/history",(req,res)=>{
    
    const sql = "SELECT DISTINCT history.status,history.time,history.source,history.invitation,users.ip,history.username,users.nickname,users.device,users.country FROM history INNER JOIN users ON users.username = history.username ORDER BY history.id DESC "
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }
        }



    })

})

app.get("/status",(req,res)=>{
    
    const sql = "SELECT * FROM statuses"
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }
        }



    })

})


app.get("/users",(req,res)=>{
    
    const sql = "SELECT DISTINCT users.username,users.likes,users.nickname,users.ip,users.device,users.date,powers.name FROM users INNER JOIN powers ON users.power = powers.power "
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }
        }



    })

})


app.post("/UpdateUserPowers",(req,res)=>{


    const username = req.body.username;
    const powers = req.body.power


    const sql = "SELECT power FROM users WHERE username = ?"

    db.query(sql,[username],(err,data)=>{
        if(err){
            console.log(err);
        }

        if(data){
            if(data.length === 1){


                const current_power = data[0].power;


                if(parseInt(current_power) < parseInt(req.session.user.power) || parseInt(current_power) === parseInt(req.session.user.power)){
            
              
            
                    const sql = "UPDATE users SET power = ? WHERE username = ?"
            
            
                    db.query(sql,[powers,username],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
            
                        if(data){
                            res.send(JSON.stringify({res:"ok",msg:"تم تحديث الصلاحيات"}))
                        }
            
            
            
                    })
            
            
            
                }else{
                    res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك التعديل علي صلاحية اعلي منك"}))
                }

            }
        }

    })



})


app.post("/UpdateUserLikes",(req,res)=>{


    const username = req.body.username;
    const likes = req.body.likes


    const sql = "SELECT power FROM users WHERE username = ?"

    db.query(sql,[username],(err,data)=>{
        if(err){
            console.log(err);
        }

        if(data){
            if(data.length === 1){


                const current_power = data[0].power;




                if(parseInt(current_power) < parseInt(req.session.user.power) || parseInt(current_power) === parseInt(req.session.user.power)){
            
              
            
                    const sql = "UPDATE users SET likes = ? WHERE username = ?"


                    db.query(sql,[likes,username],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
                
                        if(data){
                            res.send(JSON.stringify({res:"ok",msg:"تم تحديث الليكات"}))
                        }
                
                
                
                    })
                
            
            
                }else{
                    res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك التعديل علي صلاحية اعلي منك"}))
                }

            }
        }

    })





})


app.post("/UpdateUserPasswrod",(req,res)=>{


    const username = req.body.username;
    const password = req.body.password;


    const sql = "SELECT power FROM users WHERE username = ?"

    db.query(sql,[username],(err,data)=>{
        if(err){
            console.log(err);
        }

        if(data){
            if(data.length === 1){


                const current_power = data[0].power;


                if(parseInt(current_power) < parseInt(req.session.user.power) || parseInt(current_power) === parseInt(req.session.user.power)){
            
              
            
                    bcrypt.hash(password,saltRounds,(err,hash)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
                
                
                        const sql = "UPDATE users SET password = ? WHERE username = ?"
                
                
                        db.query(sql,[hash,username],(err,data)=>{
                            if(err){
                                console.log(err);
                                res.send(err)
                            }
                    
                            if(data){
                                res.send(JSON.stringify({res:"ok",msg:"تم تحديث كلمة السر"}))
                            }
                    
                    
                    
                        })
                
                
                    })
                
            
            
                }else{
                    res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك التعديل علي صلاحية اعلي منك"}))
                }

            }
        }

    })






})




app.post("/DeleteUser",(req,res)=>{

    if(req.session.user){



    const sql = "SELECT manage_users FROM powers WHERE power = ?"

    db.query(sql,[req.session.user.power],(err,data)=>{

        if(err){
            console.log(err);
            res.send(err)
        }

        if(data){
            const manage_users = data[0].manage_users
            if(parseInt(manage_users) === 1){

                const username = req.body.username;



                const sql = "SELECT power FROM users WHERE username = ?"
            
                db.query(sql,[username],(err,data)=>{
                    if(err){
                        console.log(err);
                    }
            
                    if(data){
                        if(data.length === 1){
            
            
                            const current_power = data[0].power;
            
            
                            if(parseInt(current_power) < parseInt(req.session.user.power) || parseInt(current_power) === parseInt(req.session.user.power)){
                        
                          
                        
                                const sql = "DELETE FROM users WHERE username = ?"
            
            
                                db.query(sql,[username],(err,data)=>{
                                    if(err){
                                        console.log(err);
                                        res.send(err)
                                    }
                            
                                    if(data){
                                        res.send(JSON.stringify({res:"ok",msg:"تم حذف العضو"}))
                                    }
                            
                            
                            
                                })
                            
                        
                        
                            }else{
                                res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك التعديل علي صلاحية اعلي منك"}))
                            }
            
                        }
                    }
            
                })
            


            }else{
                res.status(401).send(JSON.stringify({res:"bad",msg:'ليس لديك الصلاحيات'}))
            }
        }

    })


}else{
    res.redirect(403,"/")
}





})





app.get("/bans",(req,res)=>{

    if(req.session.user){



        const sql = "SELECT ban FROM powers WHERE power = ?"
    
        db.query(sql,[req.session.user.power],(err,data)=>{
    
            if(err){
                console.log(err);
                res.send(err)
            }
    
            if(data){
                const ban = data[0].ban
                if(parseInt(ban) === 1){
    

                    
                    const sql = "SELECT * FROM bans"
                    db.query(sql,(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
                
                
                        if(data){
                            if(data.length > 0){
                                res.send(data)
                            }else{
                                res.send([])
                            }
                        }
                
                
                
                    })
                
    
    

                
    
    
                }else{
                    res.status(401).send(JSON.stringify({res:"bad",msg:'ليس لديك الصلاحيات'}))
                }
            }
    
        })
    
    
    }else{
        res.redirect(403,"/")
    }
    
    
    

})



app.post("/Addban",(req,res)=>{


    if(req.session.user){



        const sql = "SELECT ban FROM powers WHERE power = ?"
    
        db.query(sql,[req.session.user.power],(err,data)=>{
    
            if(err){
                console.log(err);
                res.send(err)
            }
    
            if(data){
                const ban = data[0].ban
                if(parseInt(ban) === 1){
    

                    
                
                    const ban = req.body.ban
    
                    const sql = "INSERT INTO bans(ban,ban_time) VALUES(?,?)"
                    db.query(sql,[ban,'دائم'],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
                
                
                        if(data){
                
                            res.send(JSON.stringify({res:'ok',msg:'تم اضافة الباند'}))
                        }
                
                
                
                    })
    

                
    
    
                }else{
                    res.status(401).send(JSON.stringify({res:"bad",msg:'ليس لديك الصلاحيات'}))
                }
            }
    
        })
    
    
    }else{
        res.redirect(403,"/")
    }





})



app.get("/Basicpermissions",(req,res)=>{
    
    const sql = "SELECT id,name,power FROM powers"
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }else{
                res.send([])
            }
        }



    })

})

app.post("/permissions",(req,res)=>{

    const name = req.body.name;
    
    const sql = "SELECT * FROM powers WHERE name = ?"
    db.query(sql,[name],(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }else{
                res.send([])
            }
        }



    })

})




app.post("/Updatepermissions",(req,res)=>{

    const power_name = req.body.power_name;
    const power = req.body.power;
    const icon = req.body.power_icon;
    const kick = req.body.kick;
    const remove_wall = req.body.remove_wall;
    const notifications = req.body.notifications;
    const change_nickname = req.body.change_nickname;
    const change_users_data = req.body.change_users_data;
    const ban = req.body.ban;
    const ads = req.body.ads;
    const open_private_chat = req.body.open_private_chat;
    const manage_rooms = req.body.manage_rooms;
    const create_rooms = req.body.create_rooms;
    const max_static_rooms = req.body.max_static_rooms;
    const manage_users = req.body.manage_users;
    const edit_likes = req.body.edit_likes;
    const manage_subs = req.body.manage_subs;
    const gifts = req.body.gifts;
    const show_users_data = req.body.show_users_data;
    const control_panel = req.body.control_panel;
    const remove_messages = req.body.remove_messages;
    const private = req.body.private;
    const site_setting = req.body.site_setting;
    const name = req.body.name
    
    const sql = "UPDATE powers SET name = ?,power = ?,icon = ?,kick = ?,remove_wall = ?,notifications = ?,change_nickname = ?,change_users_data = ?,ban = ?,ads = ?,open_private_chat = ?,manage_rooms = ?,create_rooms = ?,max_static_rooms = ?,manage_users = ?,edit_likes = ?,manage_subs = ?,gifts = ?,show_users_data = ?,control_panel = ?,remove_messages = ?,private = ?,site_setting = ? WHERE name = ?"
    db.query(sql,[power_name,power,icon,kick,remove_wall,notifications,change_nickname,change_users_data,ban,ads,open_private_chat,manage_rooms,create_rooms,max_static_rooms,manage_users,edit_likes,manage_subs,gifts,show_users_data,control_panel,remove_messages,private,site_setting,name],(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            res.send(JSON.stringify({res:"ok",msg:"تم التحديث"}))
        }



    })

})


app.post("/removeBan",(req,res)=>{

    
    if(req.session.user){



        const sql = "SELECT ban FROM powers WHERE power = ?"
    
        db.query(sql,[req.session.user.power],(err,data)=>{
    
            if(err){
                console.log(err);
                res.send(err)
            }
    
            if(data){
                const ban = data[0].ban
                if(parseInt(ban) === 1){
    

                    const id = req.body.id;


                    const sql = "DELETE FROM bans WHERE id = ?"
                
                    db.query(sql,[id],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err);
                        }
                
                        if(data){
                            res.send(JSON.stringify({res:"ok",msg:"تم فك الباند"}))
                        }
                
                    })
                
    

                
    
    
                }else{
                    res.status(401).send(JSON.stringify({res:"bad",msg:'ليس لديك الصلاحيات'}))
                }
            }
    
        })
    
    
    }else{
        res.redirect(403,"/")
    }



})



app.get("/filter",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const sql = "SELECT DISTINCT * FROM filter"
            db.query(sql,(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    if(data.length > 0){
                        res.send(data)
                    }else{
                        res.send([])
                    }
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    


})




app.get("/filterWords",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const sql = "SELECT * FROM filter_words"
            db.query(sql,(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    if(data.length > 0){
                        res.send(data)
                    }else{
                        res.send([])
                    }
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})




app.post("/AddFilterWord",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const filter = req.body.filter
            const category = req.body.category

            const sql = "INSERT INTO filter_words(category,word) VALUES (?,?)"
            db.query(sql,[category,filter],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم اضافة الكلمة'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})


app.post("/RemoveFilterWord",(req,res)=>{


    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const id = req.body.id


            const sql = "DELETE FROM filter_words WHERE id = ?"
            db.query(sql,[id],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم حذف الكلمة'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    


})




app.get("/rooms",(req,res)=>{



    
    if(req.session.user){



        const sql = "SELECT manage_rooms FROM powers WHERE power = ?"
    
        db.query(sql,[req.session.user.power],(err,data)=>{
    
            if(err){
                console.log(err);
                res.send(err)
            }
    
            if(data){
                const manage_rooms = data[0].manage_rooms
                
                if(parseInt(manage_rooms) === 1){
    

                    const sql = "SELECT * FROM rooms"
                    db.query(sql,(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
                
                
                        if(data){
                            if(data.length > 0){
                                res.send(data)
                            }else{
                                res.send([])
                            }
                        }
                
                
                
                    })
    

                
    
    
                }else{
                    res.status(401).send(JSON.stringify({res:"bad",msg:'ليس لديك الصلاحيات'}))
                }
            }
    
        })
    
    
    }else{
        res.redirect(403,"/")
    }


    


})




app.get("/shortcuts",(req,res)=>{
    
    const sql = "SELECT * FROM shortcuts"
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }else{
                res.send([])
            }
        }



    })

})



app.post("/AddShortcut",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const shortcut = req.body.shortcut
            const word = req.body.word

            const sql = "INSERT INTO shortcuts(shortcut,word) VALUES (?,?)"
            db.query(sql,[shortcut,word],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم اضافة الاختصار'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})


app.post("/RemoveShortcut",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const id = req.body.id

            const sql = "DELETE FROM shortcuts WHERE id = ?"
            db.query(sql,[id],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم حذف الاختصار'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})





app.get("/subs",(req,res)=>{

    console.log("SUBS");
    
    const sql = "SELECT DISTINCT subs.id,subs.username,subs.period,subs.days_left,users.nickname,powers.power,powers.name FROM subs INNER JOIN users ON subs.username = users.username INNER JOIN powers ON powers.power = users.power"
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                console.log(data);
                res.send(data)
            }else{
                res.send([])
            }
        }



    })

})




app.post("/RemoveSub",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const id = req.body.id
            const name = req.body.name

            const sql = "DELETE FROM subs WHERE id = ?"
            db.query(sql,[id],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    const sql = "UPDATE users SET power = 0 WHERE username = ?"
                    db.query(sql,[name],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }

                        if(data){
                            res.send(JSON.stringify({res:'ok',msg:'تم حذف الاشتراك'}))
                        }

                    })
                    
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})


app.get("/CPmessages",(req,res)=>{
    
    const sql = "SELECT * FROM cp_messages"
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }else{
                res.send([])
            }
        }



    })

})


app.post("/AddCPmessages",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const category = req.body.category
            const title = req.body.title
            const message = req.body.message

            const sql = "INSERT INTO cp_messages(category,title,message) VALUES (?,?,?)"
            db.query(sql,[category,title,message],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم اضافة الرسالة'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})


app.post("/RemoveCPmessages",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const id = req.body.id

            const sql = "DELETE FROM cp_messages WHERE id = ?"
            db.query(sql,[id],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم حذف الرسالة'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})


app.get("/management",(req,res)=>{
    
    const sql = "SELECT * FROM site_setting"
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }


        if(data){
            if(data.length > 0){
                res.send(data)
            }
        }



    })

})



app.post("/UpdateManagement",(req,res)=>{

    if(req.session.user){
        if(req.session.user.username === 'admin' || req.session.user.username === 'tof3' || req.session.user.username === 'ziad'){

            const site_name = req.body.site_name
            const site_title = req.body.site_title
            const site_description = req.body.site_description
            const tags = req.body.tags
            const javascript_code = req.body.javascript_code
            const theme_color = req.body.theme_color
            const content_color = req.body.content_color
            const buttons_color = req.body.buttons_color
            const message_time = req.body.message_time
            const wall_time = req.body.wall_time
            const wall_messages_time = req.body.wall_messages_time
            const allow_guests = req.body.allow_guests
            const allow_subs = req.body.allow_subs
            const reconnection = req.body.reconnection
            const private_chat_number = req.body.private_chat_number
            const notifications_number = req.body.notifications_number
            const send_pics_number = req.body.send_pics_number


            const sql = "UPDATE site_setting SET site_name = ?,site_title = ?,site_description = ?,tags = ?,javascript_code = ?,theme_color = ?,content_color = ?,buttons_color = ?,message_time = ?,wall_time = ?,wall_messages_time = ?,allow_guests = ?,allow_subs = ?,reconnection = ?,private_chat_number = ?,notifications_number = ?,send_pics_number = ? WHERE id = 1"
            db.query(sql,[site_name,site_title,site_description,tags,javascript_code,theme_color,content_color,buttons_color,message_time,wall_time,wall_messages_time,allow_guests,allow_subs,reconnection,private_chat_number,notifications_number,send_pics_number],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم تحديث الادارة'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})



app.post("/RemoveRoomImg",(req,res)=>{

    if(req.session.user){
        if(parseInt(req.session.user.power) > 0){

            const id = req.body.id

            const sql = "DELETE FROM cp_messages WHERE id = ?"
            db.query(sql,[id],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
        
                if(data){
                    res.send(JSON.stringify({res:'ok',msg:'تم حذف الاشتراك'}))
                }
        
        
        
            })

        }
    }else{
        res.redirect("/")
    }
    
    


})

app.post("/login",(req,res)=>{
  
    const username = req.body.username;
    const password = req.body.password;
    const device = req.body.device

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
                    const time =  new Date().toLocaleString();
                    const ip = req.socket.remoteAddress;
                    if(device){


                        ipinfo.lookupIp(ip).then((response)=>{
                            let country = 'unknown';
                            if(response.countryCode){
                                country = response.countryCode
                            }
                            const id = data[0].id
                            const power = data[0].power
                            const user = {username:username,id:id,power:power}

                            
                            const sql = "UPDATE users SET ip = ?,country = ?,device = ?"

                            db.query(sql,[ip,country,device],(err,data)=>{
                                if(err){
                                    console.log(err);
                                    res.send(err);
                                }

                                if(data){
                                    const sql = "INSERT INTO history (status,username,time) VALUES (?,?,?)"
                                    db.query(sql,['دخول عضو',username,time],(err,data)=>{
                                        if(err){
                                            console.log(err);
                                            res.send(err)
                                        }

                                        if(data){

                                            req.session.user = user;
                                            res.status(200).send(JSON.stringify({res:"ok",user:user}))
                                        }

                                    })
                                }

                            })

    
    
                        })
    
                   

                    }else{
                        res.status(400).send(JSON.stringify({res:"bad",msg:"حدث خطا ما "}))
                    }

                


                }else{
                    res.status(401).send(JSON.stringify({res:"bad",msg:"اسم المستخدم او كلمة المرور غير صحيحة"}))
                }


               
            }else{
                res.status(401).send(JSON.stringify({res:"bad",msg:"اسم المستخدم او كلمة المرور غير صحيحة"}))
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
               return res.send(err);
            }

            if(data.length !== 1){

                bcrypt.hash(password,saltRounds,(err,hash)=>{
                    if(err){
                        console.log(err);
                       return res.send(err);
                    }

                    const device = req.body.device;
                    const img = "imgs/pic.png"
                    const time =  new Date().toLocaleString();
                    const ip = req.socket.remoteAddress;
                    ipinfo.lookupIp(ip).then((response)=>{
                        let country = 'unknown';
                        if(response.countryCode){
                            country = response.countryCode
                        }

                        const sql = "INSERT INTO users(img,username,nickname,password,likes,power,ip,device,country,date) VALUES (?,?,?,?,0,0,?,?,?,?)"
                        db.query(sql,[img,username,username,hash,ip,device,country,time],(err,data)=>{
                            if (err) {
                                console.log(err);
                               return res.send(err);
                            }
                            if(data){
    
                                const id = data.insertId
                                const user = {username:username,id:id,power:'0'}
                                req.session.user = user;
                               return res.status(200).send(JSON.stringify({res:"ok",user:user}))
                
    
                                
                            }else{
                               return res.status(500).send(JSON.stringify({res:"bad",msg:"حدث خطا ما اثناء التسجيل"}))
                            }
    
                        })

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
