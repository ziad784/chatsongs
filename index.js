require("dotenv").config();
const express = require("express");
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
let {IPinfoWrapper} = require("node-ipinfo");
const path = require("path");
let ipinfo = new IPinfoWrapper("16fbed578176de");
const { v4: uuidv4 } = require('uuid');
let db_config = null;


 db_config = {
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
    resave: true,
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




io.on('connection', (socket)=>{

   
    socket.on("join new room",(data)=>{

        const id = socket.id;

        const sql = "SELECT room FROM users WHERE socket_id = ?"
        db.query(sql,[id],(err,roomName)=>{
            if(err){
                console.log(err);
                return
            }

            if(roomName && roomName.length > 0){
                

                socket.leave(roomName[0].room)
                const sql = "UPDATE users SET room = ? WHERE socket_id = ?"
                db.query(sql,[data.room,id],(err,res) =>{
                    if(err){
                        console.log(err);
                        return
                    }
                    
                    if(res){
    
                        socket.join(data.room)
                        io.to(data.room).emit("welcome message",{user:data.name,username:data.username,img:data.img,room:data.room,msg:"هذا المستخدم إنضم الى الغرفة"})
            
                    }
    
                
                })

            }





        })


        

           
        
       


    })
   
    socket.on("transfer new room",(data)=>{

        const username = data.username;
        const room = data.room;

        const sql = "SELECT socket_id FROM users WHERE username = ?"
        db.query(sql,[username],(err,userData)=>{
            if(err){
                console.log(err);
                return
            }

            if(userData){

                socket.join(userData[0].socket_id);
                    io.to(userData[0].socket_id).emit("transfer new room",{my_username:username,room:room})
            
                    socket.leave(userData[0].socket_id);
            }





        })


        

           
        
       


    })


    socket.on("kick room",({username})=>{
   
        const sql = "SELECT socket_id FROM users WHERE username = ?"
        db.query(sql,[username],(err,data)=>{
            if(err){
                console.log(err);
                return
            }

            if(data){
                if(data.length > 0){
                   

                    socket.join(data[0].socket_id);
                    io.to(data[0].socket_id).emit("kick room",{my_username:username})
            
                    socket.leave(data[0].socket_id);
                    
                }
            }



        })
    })

    socket.on("add ban",({username})=>{
   
        const sql = "SELECT socket_id FROM users WHERE username = ?"
        db.query(sql,[username],(err,data)=>{
            if(err){
                console.log(err);
                return
            }

            if(data){
                if(data.length > 0){
                   

                    socket.join(data[0].socket_id);
                    io.to(data[0].socket_id).emit("add ban",{my_username:username})
            
                    socket.leave(data[0].socket_id);
                    
                }
            }



        })
    })


    socket.on("leave room",(data)=>{

        const sql = "SELECT room,nickname,img FROM users WHERE socket_id = ?"
        db.query(sql,[socket.id],(err,data)=>{
            if(err){
                console.log(err);
            }

            if(data){
                if(data.length > 0){


                    const sql = "UPDATE users SET room = null WHERE socket_id = ?"
                    db.query(sql,[socket.id],(err,res) =>{
                        if(err){
                            console.log(err);
                            return
                        }
            
                        if(res){
                           
                            io.to(data[0].room).emit("disconnect message",{user:data[0].nickname,img:data[0].img,msg:"هذا المستخدم خرج من الغرفة"})
                            socket.leave(data[0].room)
            
                        }
            
                    })



                }
            }

        })





        
    })


    
    socket.on("join room",(info)=>{

      
        const id = socket.id;
        const room = info.room
        const username = info.username
        

        const sql = "UPDATE users SET isconnected = 1,room = ?,socket_id = ? WHERE username = ?"
        db.query(sql,[room,id,username],(err,data) =>{
            if(err){
                console.log(err);
            }

            if(data){

                socket.join(info.room);

                const sql = "SELECT * FROM users WHERE isconnected = 1"
                db.query(sql,[data.room],(err,room_size)=>{
                    if(err){
                        console.log(err);
                    }

                    if(room_size){

                        io.emit("size",room_size);
                        socket.to(info.room).emit("welcome message",{user:info.name,username:info.username,img:info.img,room:info.room,msg:"هذا المستخدم إنضم الى الغرفة"})
        
                    }
                })

            }

        })


       
    })

    socket.on("message",(data)=>{
        
     

            const id = socket.id
            const sql = "SELECT room,ip,username FROM users WHERE socket_id = ?"
            db.query(sql,[id],(err,room)=>{
                if(err){
                    console.log(err);
                    return
                }



                if(room){

                    const sql = "SELECT * FROM filter_words"
                    db.query(sql,(err,filters)=>{
                        if(err){
                            console.log(err);
                            return
                        }

                        if(filters){
                            if(filters.length > 0){
                                const msg = data.msg
                                
                                const words = msg.split(" ")

                                let iscont = true;
                                
                                filters.forEach((e)=>{
                                    words.forEach((word)=>{
                                        if(e.word === word){

                                            if(e.category === "ممنوعة"){
                                                iscont = false;
                                                const sql = "INSERT INTO filter(word,username,ip) VALUES (?,?,?)"
                                                db.query(sql,[word,room[0].username,room[0].ip],(err,result)=>{
                                                    if(err){
                                                        console.log(err);
                                                        return

                                                    }

                                                    if(result){
                                                        socket.emit("err",{to:room[0].username,msg:"هناك كلمة ممنوعة"})
                                                    }


                                                })
                                                
                                            }else{
                                                const sql = "INSERT INTO filter(word,username,ip) VALUES (?,?,?)"
                                                db.query(sql,[word,room[0].username,room[0].ip],(err,result)=>{
                                                    if(err){
                                                        console.log(err);
                                                        return

                                                    }

                                                    if(result){
                                                       io.to(room[0].room).emit("message",data)
                                                       return
                                                    }


                                                })
                                                
                                            }
                                        }
                                    })
                                })

                              
                                if(iscont){
                                    io.to(room[0].room).emit("message",data)
                                }
                                
                                

                                

                            }else{
                                io.to(room[0].room).emit("message",data)
                            }
                        }


                    })


                    
                }

            })

           
        
    })

    socket.on("private message",(data)=>{



            const sql = "SELECT socket_id,isprivate,likes,img FROM users WHERE username = ?"
            db.query(sql,[data.to],(err,to_info)=>{
                if(err){
                    console.log(err);
                    return
                }

                if(to_info){

                    const sql = "SELECT private_chat_number FROM site_setting WHERE id = 1"
                    db.query(sql,(err,need_likes)=>{
                        if(err){
                            console.log(err);
                            return
                        }

                        if(need_likes){
                            const sql = "SELECT likes,img,nickname FROM users WHERE socket_id = ?"
                            db.query(sql,[socket.id],(err,likes_count)=>{
                                if(err){
                                    console.log(err);
                                    return
                                }

                                if(likes_count){

                                    if(parseInt(need_likes[0].private_chat_number) <= parseInt(likes_count[0].likes)){
                                        const isprivate = to_info[0].isprivate;
                                        if(parseInt(isprivate) === 1){
                                            const to_id = to_info[0].socket_id
                                            socket.join(to_id);
                                            io.to(to_id).emit("private message",{from:likes_count[0].nickname,from_img:likes_count[0].img,to_img:to_info[0].img,uCo:data.uCo,bgCO:data.bgCO,to:data.to,msg:data.msg,user:data.user})
                                    
                                            socket.leave(to_id);
                    
                                        }else{
                                            socket.emit("err",{to:data.from,msg:"هذا المستخدم قام بقفل الخاص"})
                                        }
        
                                    }else{
                                        socket.emit("err",{to:data.from,msg:"لايك"+need_likes[0].private_chat_number+"يجب ان يكون لديك"})
                                    }

                                }


                            })

                        }


                    })




                }

            })

           
        
    })

    socket.on("private notify",(data)=>{



            const sql = "SELECT socket_id,isnotify FROM users WHERE username = ?"
            db.query(sql,[data.to],(err,to_info)=>{
                if(err){
                    console.log(err);
                    return
                }

                if(to_info){

                    const sql = "SELECT notifications_number FROM site_setting WHERE id = 1"
                    db.query(sql,(err,need_likes)=>{
                        if(err){
                            console.log(err);
                            return
                        }

                        if(need_likes){
                            const sql = "SELECT likes,img,nickname FROM users WHERE socket_id = ?"
                            db.query(sql,[socket.id],(err,from_info)=>{
                                if(err){
                                    console.log(err);
                                    return
                                }

                                if(from_info){
                                   

                                    if(parseInt(need_likes[0].notifications_number) <= parseInt(from_info[0].likes)){

                                        if(parseInt(to_info[0].isnotify) === 1){
        
                                            const to_id = to_info[0].socket_id
                                            socket.join(to_id);
                                            
                                            io.to(to_id).emit("private notify",{from:from_info[0].nickname,img:from_info[0].img,uCo:data.uCo,bgCO:data.bgCO,to:data.to,msg:data.msg})
                                    
                                            socket.leave(to_id);
                    
                                        }else{
                                            socket.emit("err",{to:data.from,msg:"هذا المستخدم قام بقفل التنبيهات"})
                                        }
                                    }else{
                                      
                                        socket.emit("err",{to:data.from,msg:"لايك"+need_likes[0].notifications_number+"يجب ان يكون لديك"})
                                    }


                                }


                            })

                        }


                    })




                }

            })

           
        
    })


    socket.on("ad",(data)=>{
        io.emit("ad",data)
    })

    socket.on("get current room",({username})=>{
        const sql = "SELECT room FROM users WHERE username = ?"
        db.query(sql,[username],(err,current_room)=>{
            if(err){
                console.log(err);
                return
            }

            if(current_room && current_room.length > 0){
                const room = current_room[0].room
                const sql = "SELECT name,photo FROM rooms"
                db.query(sql,(err,data)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
        
                    if(data){
                        io.to(socket.id).emit("get current room",{room:room,rooms:data})
                    }
        
                })

            }


        })

        
    })


    socket.on("wall post",(data)=>{
  

        const sql = "INSERT INTO wall(username,msg,likes) VALUES (?,?,0)"

        db.query(sql,[data.username,data.msg],(err,datas)=>{
            if(err){
                console.log(err);
                res.send(err);
            }

            if(datas){
                io.emit("wall post",{nickname:data.nickname,msg:data.msg,img:data.img,id:datas.insertId,uco:data.uco,bgco:data.bgco})
            }


        })


        
    })


    socket.on("get all rooms",()=>{
        io.emit("get all rooms")
    })


    socket.on("get_conntected_users",()=>{
        const sql = "SELECT * FROM users WHERE isconnected = ?"
        db.query(sql,[1],(err,data)=>{
            if(err){
                console.log(err);
                return
            }
 

            if(data){
                io.emit("send_connected_users",data)
            }



        })
 
    })



    socket.on("disconnecting", () => {
        const id = socket.id

        const sql = "SELECT room,nickname,img FROM users WHERE socket_id = ?"
        db.query(sql,[id],(err,data)=>{
            if(err){
                console.log(err);
                return
            }
            

            if(data){
                if(data.length > 0 ){
                    const sql = "UPDATE users SET isconnected = 0,room = null,socket_id = null WHERE socket_id = ?"
                    db.query(sql,[socket.id],(err,res) =>{
                        if(err){
                            console.log(err);
                            return
                        }
            
                        if(res){
            
                                socket.broadcast.to(data[0].room).emit("disconnect message",{user:data[0].nickname,img:data[0].img,room:data[0].room,msg:"هذا المستخدم خرج من الغرفة"})
                               
                            
                        }
            
            
                    })

                }



            }



        })



      });
    


} )



app.get("/",(req,res)=>{

    const sql = "SELECT site_name,site_title,content_color,buttons_color,theme_color,site_description,tags FROM site_setting"

    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }

       if(data){

            
        if(isloggedin(req) === true){
            const id = req.session.user.id;

            const sql = "SELECT * FROM users WHERE id = ?"
            db.query(sql,[id],(err,datas)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }


                if(datas.length === 1){


                    const sql = "SELECT name FROM rooms WHERE id = 1"
                    
                    db.query(sql,(err,room)=>{
                        if(err){
                            console.log(err);
                            res.send(room);
                        }

                        if(room){

                            const power = datas[0].power

                            res.render("index",{

                                roomName:room[0].name,
                                username:datas[0].username,
                                nickname:datas[0].nickname,
                                country:datas[0].country,
                                isprivate:datas[0].isprivate,
                                isnotify:datas[0].isnotify,
                                likes:datas[0].likes,
                                bio:datas[0].bio,
                                img:datas[0].img,
                                power:power,           
                                site_name:data[0].site_name,
                                site_title:data[0].site_title,
                                content_color:data[0].content_color,
                                buttons_color:data[0].buttons_color,
                                theme_color:data[0].theme_color,
                                site_description:data[0].site_description,
                                tags:data[0].tags
                    
                            })
                            
                        }


                    })


                }

            })

        }else{
            return res.render("auth",{
                site_name:data[0].site_name,
                site_title:data[0].site_title,
                content_color:data[0].content_color,
                buttons_color:data[0].buttons_color,
                theme_color:data[0].theme_color,
                site_description:data[0].site_description,
                tags:data[0].tags
            })
        }


       }

    })
    

    
    
    
})

app.post("/logout",(req,res)=>{

    const sql = "UPDATE users SET isconnected = 0,room = null,socket_id = null WHERE username = ?"
    if(req.session.user){
        db.query(sql,[req.session.user.username],(err,result) =>{
            if(err){
                console.log(err);
                return
            }
    
            if(result){
    
                req.session.destroy();
                res.redirect("/")
            }
    
    
        })
        
    }



})


app.post("/UploadProfileImg",(req,res)=>{

    if(req.session.user){


        
    const form = new formidable.IncomingForm()
  
  
    form.parse(req,(err,fields,files)=>{
      if(err){
        console.log(err);
        return
      }
      const ext = path.extname(files.photo.originalFilename)
      const videosPath = "imgs/users/"
      const oldPath = files.photo.filepath
      const newPath = videosPath+uuidv4()+ext

      
      
     
      
   
  
  
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
       
      
        const sql = "UPDATE users SET img = ? WHERE username = ?"
  
        db.query(sql,[newPath,req.session.user.username],(err,data)=>{
          if(err){
            console.log(err);
            res.status(300).send(err)
          }
      
          if(data){
  
            res.send(JSON.stringify({res:"ok",img:newPath}))
  
          }
        })
  
      })
  
      
  
  
    })

    }else{
        res.status(403)
    }


  
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

app.post("/user",(req,res)=>{
    const username = req.body.username;

    const sql = "SELECT DISTINCT * FROM users WHERE username = ?"

    db.query(sql,[username],(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }

        if(data){
            res.send(data)
        }


    })


})

app.get("/MyUser",(req,res)=>{
    if(req.session.user){

        const username = req.session.user.username;


        const sql = "SELECT DISTINCT nickname,img,bio,uco,bgco,fontco FROM users WHERE username = ?"
    
        db.query(sql,[username],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err)
            }
    
            if(data){
                res.send(data)
            }
    
    
        })

    }else{
        res.redirect("/")
    }



})


app.post("/CanPower",(req,res)=>{


    const username = req.body.username;



    const sql = "SELECT power FROM users WHERE username = ?"

    db.query(sql,[username],(err,data)=>{
        if(err){
            console.log(err);
        }

        if(data){
            if(data.length === 1){


                const current_power = data[0].power;


                if(parseInt(current_power) < parseInt(req.session.user.power)){
                
                    res.send(JSON.stringify({res:"ok"}))
                }else{
                    res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك التعديل علي صلاحية اعلي منك"}))
                }

            }
        }

    })



})


app.post("/UpdateUserInfo",(req,res)=>{

    if(req.session.user){
        if(!req.session.user.guest){

            const username = req.session.user.username;
            const nickname = req.body.nickname;
            const bio = req.body.bio;
            const uco = req.body.uco;
            const fontco = req.body.fontco;
            const bgco = req.body.bgco;

            const sql = "UPDATE users SET nickname = ?,bio = ?,uco = ?,fontco = ?,bgco = ? WHERE username = ?"
        
            db.query(sql,[nickname,bio,uco,fontco,bgco,username],(err,data)=>{
                if(err){
                    console.log(err);
                    res.send(err)
                }
        
                if(data){
                    res.send(JSON.stringify({res:"ok",msg:"تم التحديث"}))
                }
        
        
            })

        }
    }



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


                if(parseInt(current_power) < parseInt(req.session.user.power)){
            
              
            
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

app.get("/PowersNames",(req,res)=>{
    const sql = "SELECT name,power FROM powers"

    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send(err)
        }

        if(data){
            res.send(data)
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




                if(parseInt(current_power) < parseInt(req.session.user.power) ){
            
              
            
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


app.post("/AddLike",(req,res)=>{


    const username = req.body.username;
    
  

    if(req.session.user){

        if(req.session.user.likes){

            const user_like = req.session.user.likes.find((user)=>user.username === username)

            if(user_like){

                if(user_like.time < new Date().getTime()){

                    if(username !== req.session.user.username){
                        const sql = "SELECT likes FROM users WHERE username = ?"
                        db.query(sql,[username],(err,data)=>{
                            if(err){
                                console.log(err);
                                res.send(err);
                            }
            
                            if(data){
                                if(data.length > 0){
                                    const likes = parseInt(data[0].likes) + 1;
                                    const sql = "UPDATE users SET likes = ? WHERE username = ?"
                                    db.query(sql,[likes,username],(err,result)=>{
                                        if(err){
                                            console.log(err);
                                            return
                                        }
            
                                        if(result){
                                            user_like.time = new Date().getTime() + 5*60000
                                            
                                            res.send(JSON.stringify({res:"ok",msg:"تم اضافة لايك"}))
                                        }
            
                                    })
                                }
                            }
            
            
                        })
            
                    }

                }else{
                    res.status(403).send(JSON.stringify({res:"bad",msg:" يمكنك اضافة لايك كل 2 د"}))
                    return
                }
                
            }else{
                if(username !== req.session.user.username){
                    const sql = "SELECT likes FROM users WHERE username = ?"
                    db.query(sql,[username],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err);
                        }
        
                        if(data){
                            if(data.length > 0){
                                const likes = parseInt(data[0].likes) + 1;
                                const sql = "UPDATE users SET likes = ? WHERE username = ?"
                                db.query(sql,[likes,username],(err,result)=>{
                                    if(err){
                                        console.log(err);
                                        return
                                    }
        
                                    if(result){
                                        
                                        
                                        req.session.user.likes.push({username:username,time:new Date().getTime() + 2*60000})
                                        
                                        res.send(JSON.stringify({res:"ok",msg:"تم اضافة لايك"}))
                                    }
        
                                })
                            }
                        }
        
        
                    })
        
                }else{
                    res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك اضافة لايك لنفسك"}))
               }
            }

            if(req.session.user.like_time < new Date().getTime()){

                if(username !== req.session.user.username){
                    const sql = "SELECT likes FROM users WHERE username = ?"
                    db.query(sql,[username],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err);
                        }
        
                        if(data){
                            if(data.length > 0){
                                const likes = parseInt(data[0].likes) + 1;
                                const sql = "UPDATE users SET likes = ? WHERE username = ?"
                                db.query(sql,[likes,username],(err,result)=>{
                                    if(err){
                                        console.log(err);
                                        return
                                    }
        
                                    if(result){
                                        req.session.user.like_time = new Date().getTime() + 5*60000
                                        
                                        res.send(JSON.stringify({res:"ok",msg:"تم اضافة لايك"}))
                                    }
        
                                })
                            }
                        }
        
        
                    })
        
                }else{
                     res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك اضافة لايك لنفسك"}))
                }
    
            }else {
               
            }

        }else{
            
            if(username !== req.session.user.username){
                const sql = "SELECT likes FROM users WHERE username = ?"
                db.query(sql,[username],(err,data)=>{
                    if(err){
                        console.log(err);
                        res.send(err);
                    }
    
                    if(data){
                        if(data.length > 0){
                            const likes = parseInt(data[0].likes) + 1;
                            const sql = "UPDATE users SET likes = ? WHERE username = ?"
                            db.query(sql,[likes,username],(err,result)=>{
                                if(err){
                                    console.log(err);
                                    return
                                }
    
                                if(result){
                                 
                                    req.session.user.likes = new Array()
                                    req.session.user.likes.push({username:username,time:new Date().getTime() + 2*60000})

                                    res.send(JSON.stringify({res:"ok",msg:"تم اضافة لايك"}))
                                }
    
                            })
                        }
                    }
    
    
                })
    
            }else{
                 res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك اضافة لايك لنفسك"}))
            }
        }


    }


    
    








})

app.post("/UpdateUserNickname",(req,res)=>{


    const username = req.body.username;
    const nickname = req.body.nickname;



    const sql = "SELECT power FROM users WHERE username = ?"

    db.query(sql,[username],(err,data)=>{
        if(err){
            console.log(err);
        }

        if(data){
            if(data.length === 1){


                const current_power = data[0].power;




                if(parseInt(current_power) < parseInt(req.session.user.power) ){
            
              
            
                    const sql = "UPDATE users SET nickname = ? WHERE username = ?"


                    db.query(sql,[nickname,username],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err)
                        }
                
                        if(data){
                            res.send(JSON.stringify({res:"ok",msg:"تم تحديث الزخرفة"}))
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


                if(parseInt(current_power) < parseInt(req.session.user.power) ){
            
              
            
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


app.post("/TogglePrivateChat",(req,res)=>{
    if(req.session.user){
        const toggle = req.body.toggle;
        const sql = "UPDATE users SET isprivate = ? WHERE username = ?"
        db.query(sql,[toggle,req.session.user.username],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err)
            }

            if(data){
                res.send(JSON.stringify({res:"ok",msg:"تم التحديث"}))
            }

        })
    }

})

app.post("/ToggleNotify",(req,res)=>{
    if(req.session.user){
        const toggle = req.body.toggle;
        const sql = "UPDATE users SET isnotify = ? WHERE username = ?"
        db.query(sql,[toggle,req.session.user.username],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err)
            }

            if(data){
                res.send(JSON.stringify({res:"ok",msg:"تم التحديث"}))
            }

        })
    }

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
            
            
                            if(parseInt(current_power) < parseInt(req.session.user.power) ){
                        
                          
                        
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

app.post("/DeleteMyImg",(req,res)=>{

    if(req.session.user){
    
        const username =  req.session.user.username;
        const img = "imgs/pic.png"

        const sql = "UPDATE users SET img = ? WHERE username = ?";

        db.query(sql,[img,username],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err)
            }

            if(data){
                res.send(JSON.stringify({res:"ok",msg:"تم مسح الصورة"}))
            }


        })




    }else{
        res.redirect(403,"/")
    }





})

app.post("/DeleteImg",(req,res)=>{

    if(req.session.user){

        
        
        const username =  req.body.username;

        const sql = "SELECT power FROM users WHERE username = ?"

        db.query(sql,[username],(err,data)=>{
            if(err){
                console.log(err);
            }
    
            if(data){
                if(data.length === 1){
    
    
                    const current_power = data[0].power;
    
    
    
    
                    if(parseInt(current_power) < parseInt(req.session.user.power) ){
                
                  
                        const img = "imgs/pic.png"

                        const sql = "UPDATE users SET img = ? WHERE username = ?";
                
                        db.query(sql,[img,username],(err,data)=>{
                            if(err){
                                console.log(err);
                                res.send(err)
                            }
                
                            if(data){
                                res.send(JSON.stringify({res:"ok",msg:"تم مسح الصورة"}))
                            }
                
                
                        })

                    
                
                
                    }else{
                        res.status(403).send(JSON.stringify({res:"bad",msg:"لا يمكنك التعديل علي صلاحية اعلي منك"}))
                    }
    
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



app.post("/AddClientban",(req,res)=>{


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
    

                    
                
                    const username = req.body.username
                    const sql = "SELECT device FROM users WHERE username = ?"

                    db.query(sql,[username],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send(err);
                        }

                        if(data){
                            if(data.length > 0){
                                const device = data[0].device

                                const sql = "INSERT INTO bans(username,ban,ban_time) VALUES(?,?,?)"
                                db.query(sql,[username,device,'دائم'],(err,data)=>{
                                    if(err){
                                        console.log(err);
                                        res.send(err)
                                    }
                            
                            
                                    if(data){
                            
                                        res.send(JSON.stringify({res:'ok',msg:'تم اضافة الباند'}))
                                    }
                            
                            
                            
                                })

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






    


})


app.post("/room",(req,res)=>{

    const name = req.body.name;
    
    const sql = "SELECT * FROM rooms WHERE name = ?"
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


app.post("/Addroom",(req,res)=>{



    
    if(req.session.user){



        const sql = "SELECT create_rooms FROM powers WHERE power = ?"
    
        db.query(sql,[req.session.user.power],(err,data)=>{
    
            if(err){
                console.log(err);
                res.send(err)
            }
    
            if(data){
                const create_rooms = data[0].create_rooms
                
                if(parseInt(create_rooms) === 1){

                    const title = req.body.title;
                    const sql = "SELECT name FROM rooms WHERE name = ?"
                    db.query(sql,[title],(err,data)=>{
                        
                        if(err){
                            console.log(err);
                            res.send(res);
                        }

                        if(data){

                            if(data.length === 0){

                                const description = req.body.description;
                                const welcome_msg = req.body.welcome_msg;
                                let size = req.body.size;
            
                                if(parseInt(size) > 40){
                                    size = 40;
                                }else if(size === ''){
                                    size = 20
                                }
                                const password = req.body.password;
                                const owner = req.session.user.username;
                                const photo = "/imgs/room.png"
                
            
                                const sql = "INSERT INTO rooms(name,owner,photo,password,description,welcome_message,size) VALUES (?,?,?,?,?,?,?)"
                                db.query(sql,[title,owner,photo,password,description,welcome_msg,size],(err,data)=>{
                                    if(err){
                                        console.log(err);
                                        res.send(err)
                                    }
                            
                            
                                    if(data){
                                       res.send(JSON.stringify({res:"ok",msg:"تم اضافة الغرفة"}))
                                    }
                            
                            
                            
                                })

                            }else{
                                res.send(JSON.stringify({res:"bad",msg:"الاسم مستخدم"}))
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


app.post("/Updateroom",(req,res)=>{


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

                    const title = req.body.title;
                    const sql = "SELECT name FROM rooms WHERE name = ?"
                    db.query(sql,[title],(err,data)=>{
                        
                        if(err){
                            console.log(err);
                            res.send(res);
                        }

                        if(data){

                            if(data.length === 0){

                                const description = req.body.description;
                                const welcome_msg = req.body.welcome_msg;
                                let size = req.body.size;
                                const room_name = req.body.name;
            
                                if(parseInt(size) > 40){
                                    size = 40;
                                }else if(size === ''){
                                    size = 20
                                }
                                const password = req.body.password;

                
            
                                const sql = "UPDATE rooms SET name = ?,description = ?,welcome_message = ?,password = ?,size = ? WHERE name = ?"
                                db.query(sql,[title,description,welcome_msg,password,size,room_name],(err,data)=>{
                                    if(err){
                                        console.log(err);
                                        res.send(err)
                                    }
                            
                            
                                    if(data){
                                       res.send(JSON.stringify({res:"ok",msg:"تم اضافة الغرفة"}))
                                    }
                            
                            
                            
                                })

                            }else{
                                res.send(JSON.stringify({res:"bad",msg:"الاسم مستخدم"}))
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

    
    
    const sql = "SELECT DISTINCT subs.id,subs.username,subs.period,subs.days_left,users.nickname,powers.power,powers.name FROM subs INNER JOIN users ON subs.username = users.username INNER JOIN powers ON powers.power = users.power"
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


app.post("/AddWallPost",(req,res)=>{

    if(req.session.user){
        const username = req.session.user.username
        const msg = req.body.msg;

        const sql = "INSERT INTO wall(username,msg,likes) VALUES (?,?,0)"

        db.query(sql,[username,msg],(err,data)=>{
            if(err){
                console.log(err);
                res.send(err);
            }

            if(data){
                res.send(JSON.stringify({res:"ok",msg:"تم اضافة البوست"}))
            }


        })
    }

    

})


app.get("/GetWallPosts",(req,res)=>{

    const sql = "SELECT DISTINCT users.nickname,users.img,wall.msg,wall.likes,users.bgco,users.uco FROM wall INNER JOIN users ON users.username = wall.username ORDER BY wall.id DESC";

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
                    const ip = req.body.ip;
                
                    if(device){


                        ipinfo.lookupIp(ip).then((response)=>{
                            let country = 'unknown';
                            if(response.countryCode){
                                country = response.countryCode
                            }
                            const id = data[0].id
                            const power = data[0].power
                            const user = {username:username,id:id,power:power}

                            const sql = "SELECT * FROM bans WHERE ban = ? OR ban = ? OR ban = ?"
                            db.query(sql,[ip,country,device],(err,result)=>{
                                if(err){
                                    console.log(err);
                                    res.send(err);
                                }


                                if(result){
                                    if(result.length > 0){
                                        res.status(403).send(JSON.stringify({res:"bad",msg:"لقد تم حظرك"}))
                                    }else{

                                        const sql = "UPDATE users SET ip = ?,country = ?,device = ? WHERE username = ?"

                                        db.query(sql,[ip,country,device,username],(err,details_res)=>{
                                            if(err){
                                                console.log(err);
                                                res.send(err);
                                            }
            
                                            if(details_res){
                                                const sql = "INSERT INTO history (status,username,time) VALUES (?,?,?)"
                                                db.query(sql,['دخول عضو',username,time],(err,history_res)=>{
                                                    if(err){
                                                        console.log(err);
                                                        res.send(err)
                                                    }
            
                                                    if(history_res){
            
                                                        req.session.user = user;
                                                        res.status(200).send(JSON.stringify({res:"ok",user:user,uco:data[0].uco,bgco:data[0].bgco}))
                                                    }
            
                                                })
                                            }
            
                                        })


                                    }
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
                    const ip = req.body.ip;
                    ipinfo.lookupIp(ip).then((response)=>{
                        let country = 'unknown';
                        if(response.countryCode){
                            country = response.countryCode
                        }

                        const sql = "SELECT * FROM bans WHERE ban = ? OR ban = ? OR ban = ?"
                        db.query(sql,[ip,country,device],(err,result)=>{
                            if(err){
                                console.log(err);
                                res.send(err);
                            }

                            if(result){
                                if(result.length > 0){
                                    res.status(403).send(JSON.stringify({res:"bad",msg:"لقد تم حظرك"}))

                                }else{

                                    const sql = "INSERT INTO users(img,username,nickname,password,likes,power,ip,device,country,bio,date,isconnected,isprivate,isnotify) VALUES (?,?,?,?,0,0,?,?,?,?,?,1,0,0)"
                                    db.query(sql,[img,username,username,hash,ip,device,country,'(عضو جديد)',time],(err,data)=>{
                                        if (err) {
                                            console.log(err);
                                           return res.send(err);
                                        }
                                        if(data){

                                            const sql = "INSERT INTO history (status,username,time) VALUES (?,?,?)"
                                            db.query(sql,['دخول عضو',username,time],(err,data)=>{
                                                if(err){
                                                    console.log(err);
                                                    res.send(err)
                                                }
        
                                                if(data){
        
                                                    const id = data.insertId
                                                    const user = {username:username,id:id,power:'0'}
                                                    req.session.user = user;
                                                   return res.status(200).send(JSON.stringify({res:"ok",user:user}))
                                                }
        
                                            })
                

                            
                
                                            
                                        }else{
                                           return res.status(500).send(JSON.stringify({res:"bad",msg:"حدث خطا ما اثناء التسجيل"}))
                                        }
                
                                    })


                                }
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
    
    if(req.session.user){
        return true;
    }else {
        return false
    }
}