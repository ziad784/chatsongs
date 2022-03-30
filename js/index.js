const all_times = document.querySelectorAll(".time_sent");

const all_times_array = Array.from(all_times);

const popup = document.getElementById("popup");
const popup_close_btn = document.getElementById("popup_close_btn")
const user_img = document.querySelectorAll(".user_img");
const user_img_array = Array.from(user_img);

const popup_name_input = document.getElementById('popup_name');


const create_room_btn = document.getElementById('create_room_btn');
const create_room_popup = document.getElementById('create_room_popup');
const create_room_popup_close_btn = document.getElementById('create_room_popup_close_btn');

const available_sidebar = document.getElementById("available_sidebar")
const available_sidebar_close_btn = document.getElementById("available_sidebar_close_btn")
const available_btn = document.getElementById("available_btn");

const private_chat_btn = document.getElementById("private_chat_btn");
const private_chat_close_btn = document.getElementById("private_chat_sidebar_close_btn");
const private_chat_sidebar = document.getElementById("private_chat_sidebar");

const groups_sidebar_btn = document.getElementById("groups_sidebar_btn");
const groups_sidebar_close_btn = document.getElementById("groups_sidebar_close_btn");
const groups_sidebar = document.getElementById("groups_sidebar");

const wall_sidebar_btn = document.getElementById("wall_sidebar_btn");
const wall_sidebar_close_btn = document.getElementById("wall_sidebar_close_btn");
const wall_sidebar = document.getElementById("wall_sidebar");


const setting_sidebar_btn = document.getElementById("setting_sidebar_btn");
const setting_sidebar_close_btn = document.getElementById("setting_sidebar_close_btn");
const setting_sidebar = document.getElementById("setting_sidebar");


const send_btn = document.getElementById("send_btn");

const msg_input = document.getElementById("msg_input");

const current_users = document.getElementById("current_users");

const logout_btn = document.getElementById('logout_btn');


const add_room_btn = document.getElementById("add_room_btn");

const room_title_input = document.getElementById("room_title_input");
const room_desc_input = document.getElementById("room_desc_input");
const room_welcome_msg_input = document.getElementById("room_welcome_msg_input");
const room_password_input = document.getElementById("room_password_input");
const room_size_input = document.getElementById("room_size_input");


const groups_list = document.getElementById("groups_list");
const rooms_count_number = document.getElementById('rooms_count_number')

const name_color = document.getElementById("name_color");
const font_color = document.getElementById("font_color");
const background_color = document.getElementById("background_color");
const nickname_input = document.getElementById('nickname_input')
const bio_input = document.getElementById('bio_input')

const save_user_info_btn = document.getElementById("save_user_info_btn");

const user_photo = document.querySelectorAll(".user_photo")
const user_photo_array = Array.from(user_photo);


const add_wall_post_btn = document.getElementById("add_wall_post_btn");
const wall_input = document.getElementById("wall_input");


const remove_my_img_btn = document.getElementById("remove_my_img_btn");


const exit_rooms_btn = document.getElementById("exit_rooms_btn");

const profile_pic_input = document.getElementById("profile_pic_input");

const profile_pic_btn = document.getElementById("profile_pic_btn");


const edit_room_popup = document.getElementById("edit_room_popup");

const edit_room_title_input = document.getElementById("edit_room_title_input");
const edit_room_desc_input = document.getElementById("edit_room_desc_input");
const edit_room_welcome_msg_input = document.getElementById("edit_room_welcome_msg_input");
const edit_room_password_input = document.getElementById("edit_room_password_input");
const edit_room_size_input = document.getElementById("edit_room_size_input");

const edit_room_popup_close_btn = document.getElementById("edit_room_popup_close_btn");

const edit_room_btn = document.getElementById("edit_room_btn");

const currnet_room_id = document.getElementById("currnet_room_id");

const user_flag = document.getElementById("user_flag");

const username_info = document.getElementById("username_info")
const nickname_info = document.getElementById("nickname_info")
const ip_info = document.getElementById("ip_info")
const device_info = document.getElementById("device_info")

const show_user_info_btn = document.getElementById("show_user_info_btn");

const currnet_name_popup = document.getElementById("currnet_name_popup")
const user_info_popup = document.getElementById("user_info_popup");
const user_info_popup_close_btn = document.getElementById("user_info_popup_close_btn");

const popup_likes_count = document.getElementById("popup_likes_count");
const popup_bio = document.getElementById("popup_bio");



edit_room_popup_close_btn.addEventListener("click",()=>{
    edit_room_popup.style.display = "none"
})


if(edit_room_btn){
    
edit_room_btn.addEventListener("click",()=>{


    if(currnet_room_id.value.length > 0){

        const save_room_btn = document.getElementById("save_room_btn")



        edit_room_popup.style.display = "flex"


        fetch("https://"+window.location.host+"/room",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
    
            body:JSON.stringify({
                id:currnet_room_id.value
            })
        
        })
        .then((res)=>res.json())
        .then((data)=>{
    


            edit_room_title_input.value = data[0].name;
            edit_room_desc_input.value = data[0].description === null ? '' : data[0].description;
            edit_room_welcome_msg_input.value = data[0].welcome_message === null ? '' : data[0].welcome_message;
            edit_room_password_input.value = data[0].password === null ? '' : data[0].password;
            edit_room_size_input.value = data[0].size
    
    
        }).then(()=>{
            save_room_btn.addEventListener("click",()=>{
                fetch("https://"+window.location.host+"/Updateroom",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body:JSON.stringify({
                        title:room_title_input.value,
                        description:room_desc_input.value.length <= 0?null:room_desc_input.value,
                        size:room_size_input.value,
                        password:room_password_input.value.length <= 0?null:room_password_input.value,
                        welcome_msg:room_welcome_msg_input.value.length <= 0?null: room_welcome_msg_input.value
                        
        
                    })
                })
                .then((res) => res.json())
                .then((data) =>{
                    if(data.res === "ok"){
                        edit_room_popup.style.display = "none"
                    }
                })
            
            })
        })
    

    }







})
}


profile_pic_btn.addEventListener("click",()=>{
    profile_pic_input.click();
})

profile_pic_input.addEventListener("change",(e)=>{

    const formData = new FormData();
    formData.append("photo",e.target.files[0])

    fetch("https://"+window.location.host+"/UploadProfileImg",{
        method:"POST",
        credentials: 'include',
        body:formData
    
    })
    .then((res)=>res.json())
    .then((data) =>{

        if(data.res == "ok"){

            user_photo_array.forEach((ele)=>{
                ele.src = data.img
            })
            img = data.img


        }
    })



})



exit_rooms_btn.addEventListener("click",()=>{
    socket.emit("leave room",{user:nickname,img:img})
    send_btn.disabled = true
    msg_input.readOnly = true;
    exit_rooms_btn.disabled = true
    msg_input.style.backgroundColor = "#D3D3D3"
    exit_rooms_btn.style.backgroundColor = "#D3D3D3"
    send_btn.style.backgroundColor = "#D3D3D3"
})

remove_my_img_btn.addEventListener("click",()=>{

    fetch("https://"+window.location.host+"/DeleteMyImg",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    
    })
    .then((res)=>res.json())
    .then((data) =>{
        if(data.res === "ok"){
            user_photo_array.forEach((ele)=>{
                ele.src = "imgs/pic.png"
            })
            img = "imgs/pic.png"
        }
    })

})

add_wall_post_btn.addEventListener('click',()=>{

    
    
    if(wall_input.value.length > 0){

            
                socket.emit("wall post",{nickname:nickname,username:username,msg:wall_input.value,img:img})
                wall_input.value = "";

            
       
    }


})




save_user_info_btn.addEventListener("click",()=>{

    const json = JSON.parse(localStorage.getItem("colors"));

    json.nameCo = name_color.value.split("#")[1];
    json.fontCo = font_color.value.split("#")[1];
    json.bgCo = background_color.value.split("#")[1];

    const colors = json

    localStorage.setItem("colors",JSON.stringify(colors))


    if(nickname_input.value.length > 0 && bio_input.value.length > 0){
        fetch("https://"+window.location.host+"/UpdateUserInfo",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                nickname:nickname_input.value,
                bio:bio_input.value

            })
        })
        .then((res)=>res.json())
        .then((data) => {

            
        })
    }


})













user_img_array.forEach((ele)=>{
    
    ele.addEventListener("click",(e)=>{
    
        const username = e.currentTarget.dataset.name
        popup_name_input.value = username;

        fetch("https://"+window.location.host+"/user",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                username:username
                

            })
        })
        .then((res) => res.json())
        .then((data) =>{

            if(data){



                popup_likes_count.textContent = data[0].likes
                popup_bio.textContent = data[0].bio


                popup.style.display = "flex"

                

            }
        })


    })
})


popup_close_btn.addEventListener("click",()=>{
    popup.style.display = "none"
})

document.addEventListener("click",(e)=>{
    if(e.target === popup){
        popup.style.display = "none"
    }


})

SideBarToggle(available_btn,available_sidebar_close_btn,available_sidebar);
SideBarToggle(private_chat_btn,private_chat_close_btn,private_chat_sidebar);
SideBarToggle(groups_sidebar_btn,groups_sidebar_close_btn,groups_sidebar);
SideBarToggle(wall_sidebar_btn,wall_sidebar_close_btn,wall_sidebar);
SideBarToggle(setting_sidebar_btn,setting_sidebar_close_btn,setting_sidebar);



PopupToggle(create_room_popup,create_room_popup_close_btn,create_room_btn);


function PopupToggle(popup,popupCloseBtn,Openbtn){
    document.addEventListener("click",(e)=>{
        if(e.target === popup){
            popup.style.display = "none"
        }
    
    
    })

        
    popupCloseBtn.addEventListener("click",()=>{
        popup.style.display = "none"
    })


    Openbtn.addEventListener("click",()=>{
        popup.style.display = "flex"
    })



    
}

function SideBarToggle(btn,closeBtn,SideBar){

    if(SideBar === groups_sidebar){
        
        add_room_btn.addEventListener("click",()=>{
            if(room_title_input.value.length > 0){
                fetch("https://"+window.location.host+"/Addroom",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body:JSON.stringify({
                        title:room_title_input.value,
                        description:room_desc_input.value.length <= 0?null:room_desc_input.value,
                        size:room_size_input.value,
                        password:room_password_input.value.length <= 0?null:room_password_input.value,
                        welcome_msg:room_welcome_msg_input.value.length <= 0?null: room_welcome_msg_input.value
                        
        
                    })
                })
                .then((res) => res.json())
                .then((data)=>{
        
                    if(data.res === "ok"){
                        room_title_input.value = "";
                        room_desc_input.value = "";
                        room_size_input.value = "";
                        room_password_input.value = "";
                        create_room_popup.style.display = "none";
        
                        alert(data.msg);
        
                    }
        
                })
            }
        })
        
    }



    btn.addEventListener("click",()=>{
        const SideBars = document.querySelectorAll('.sidebar');
        const SideBars_array = Array.from(SideBars);
        SideBars_array.map((ele)=>{
            ele.style.display = 'none'
        })
        SideBar.style.display = "flex"
    })

    closeBtn.addEventListener("click",()=>{
        SideBar.style.display = "none"
    })


    
document.addEventListener("click",(e)=>{

    if(e.target === SideBar){
        SideBar.style.display = "none"
    }

})
    
}

setInterval(() => {
    all_times_array.forEach((ele)=>{
        const current_num = parseInt(ele.textContent);
        ele.textContent = current_num + 1
    })
}, 60000);

const socket = io();

send_btn.addEventListener("click",()=>{
    if(msg_input.value.length > 0){
        const msg = msg_input.value;
        let uCo = "#00000";
        let bgCO = "#fffff";
        let fontCO = "#00000";
        if(localStorage.getItem("colors")){

            const json  = JSON.parse(localStorage.getItem("colors"));

            fontCO = "#"+json.fontCo;
            uCo = "#"+json.nameCo;
            bgCO = "#"+json.bgCo

        }
        socket.emit("message",{user:nickname,img:img,msg:msg,uCo:uCo,bgCO:bgCO,fontCO:fontCO})
        msg_input.value = '';

    }
})





window.onload = ()=>{
 
    socket.emit("join room",{name:nickname,username:username,room:roomName,img:img})

    currnet_room_id.value = "1"

    if(document.getElementById("send_ad_btn")){
        const send_ad_btn = document.getElementById("send_ad_btn");
        send_ad_btn.addEventListener("click",()=>{
            let ad_prompt = prompt("اكتب نص الإعلان")
    
            if(ad_prompt){
                if(ad_prompt.length > 0){
                    console.log(nickname);
                    
                    socket.emit("ad",{name:nickname,msg:ad_prompt,img:img})
                }
            }
        })
    }

    
fetch("https://"+window.location.host+"/rooms")
.then((res) => res.json())
.then((data)=>{

    rooms_count_number.textContent = data.length

    groups_list.innerHTML = `
        
    <div class="new_room" style="background-color: ${theme_color};">
    <button id="create_room_btn" ><i class="fa-solid fa-plus"></i> <span>غرفة جديدة</span></button>
        
    </div>

`

    data.map((ele)=>{

        const div = document.createElement("div");
        div.className = "room ";
        div.innerHTML = `
        
        <div class="left" data-id="${ele.id}">
        <div><img src="${ele.photo}" width="36" height="36" alt="Room photo"></div>
        <div class="txts">
            <div class="room_name">
                ${ele.name}
            </div>
            <div class="room_desc" style="color: gray;">
                ${ele.description== null?'':ele.description}
            </div>
        </div>
    </div>

    <div class="right">
        <div class="card" style="background-color: ${buttons_color}">
            <div><i class="fa-solid fa-user"></i></div>
            <div><span>1</span>/${ele.size}</div>
        </div>
    </div>
        
        `

        groups_list.appendChild(div)


    })


    const rooms = document.querySelectorAll(".room");
const rooms_array = Array.from(rooms);


rooms_array.forEach((ele)=>{
    ele.addEventListener("click",(e)=>{

        const room_name = e.currentTarget.querySelector(".room_name").innerText;
        const room_id = 
        socket.emit("join new room",{name:nickname,room:room_name,img:img})
        send_btn.disabled = false
        msg_input.readOnly = false;
        exit_rooms_btn.disabled = false
        msg_input.style.backgroundColor = ""
        exit_rooms_btn.style.backgroundColor = ""
        send_btn.style.backgroundColor = ""


    })
})


})

    if(localStorage.getItem("colors")){
        const json  = JSON.parse(localStorage.getItem("colors"));

        font_color.value = "#"+json.fontCo;
        name_color.value = "#"+json.nameCo;
        background_color.value = "#"+json.bgCo

    }else{
        const json_color = JSON.stringify({nameCo:"00000",fontCo:"00000",bgCo:"00000"})
        localStorage.setItem("colors",json_color)
    }

    fetch("https://"+window.location.host+"/MyUser")
    .then((res) => res.json())
    .then((data) =>{
        nickname_input.value = data[0].nickname;
        bio_input.value = data[0].bio;
        user_flag.src = `https://flagcdn.com/16x12/${country.toLowerCase()}.png`

        user_photo_array.forEach((ele)=>{
            ele.src = data[0].img
        })

    })

    fetch("https://"+window.location.host+"/GetWallPosts")
    .then((res) => res.json())
    .then((data) =>{

        const wall_posts = document.getElementById('wall_posts');
        wall_posts.innerHTML = ``
        

        data.forEach((ele)=>{

            const div = document.createElement("div");
            div.className = "wall_card"
            div.style = "border: 1px solid lightgray; margin-left: 3px;";
            div.innerHTML = `
            
                <div class="left">
                <div class="img"><img src="${ele.img}" width="44" height="44" alt="profile card photo"></div>
                <div class="card_info" style="margin-left: 5px;display: flex; flex-direction: column; justify-content: center;">
                    <div class="wall_card_name">${ele.nickname}</div>
                    <div class="msg">${ele.msg}</div>
                </div>
            </div>
            <div class="right">
                <div>
                    <div class="time">
                        1د
                    </div>
                    <div class="wall_like"><i class="fa-solid fa-heart"></i><span>${ele.likes}</span></div>
                </div>
            </div>
            
            `;


            wall_posts.appendChild(div);


        })

    })

    

}

socket.on("size",(size)=>{
    current_users.textContent = parseInt(size);
})

socket.on("ad",(data)=>{
    AddAd(data);
    getUserImg()
})

socket.on("welcome message",(data) =>{

    AddWelcomeMessage(data)
    getUserImg()
})

socket.on("disconnect message",(data) =>{

    AddDisconnectMessage(data)
    getUserImg();

})
socket.on("message",(data) =>{

    AddMessage(data)

    getUserImg();
    

})


socket.on("wall post",(data)=>{
    wall_sidebar_btn.style.backgroundColor = "#E1C16E"
    const wall_new_posts = document.getElementById("wall_new_posts")
    wall_new_posts.textContent = parseInt(wall_new_posts) + 1;
    AddToWall(data);
})


function AddToWall(data){


    const wall_posts = document.getElementById('wall_posts');



  

        const div = document.createElement("div");
        div.className = "wall_card"
        div.style = "border: 1px solid lightgray; margin-left: 3px;";
        div.innerHTML = `
        
            <div class="left">
            <div class="img"><img src="${data.img}" width="44" height="44" alt="profile card photo"></div>
            <div class="card_info" style="margin-left: 5px;display: flex; flex-direction: column; justify-content: center;">
                <div class="wall_card_name">${data.nickname}</div>
                <div class="msg">${data.msg}</div>
            </div>
        </div>
        <div class="right">
            <div>
                <div class="time">
                    1د
                </div>
                <div class="wall_like"><i class="fa-solid fa-heart"></i><span>0</span></div>
            </div>
        </div>
        
        `;


        wall_posts.appendChild(div);


}


function AddWelcomeMessage(data){
    const chat = document.querySelector(".chat");
    const join_msg = document.createElement("div")
    join_msg.className = 'join_msg'
    join_msg.innerHTML = `
    <div class="left">
    <div class="img user_img" data-name="${data.user}" data-img="${data.img}">
        <img width="44" height="44" src="${data.img}" alt="profile photo">
    </div>

    <div class="info">
        <div class="name" >${data.user}</div>
        <div class="flex">
            <div class="exit_btn" style="background-color: ${buttons_color};"><i class="fa-solid fa-arrow-right-from-bracket"></i><span>${data.room}</span></div>
            <div style="min-width: fit-content;height: fit-content;">${data.msg}</div>
        </div>
    </div>
</div>

<div class="right">
    <div class="time"><span class="time_sent">0</span>د</div>
</div>
    
    `;


    chat.appendChild(join_msg)

}

function AddAd(data){
    const chat = document.querySelector(".chat");
    const join_msg = document.createElement("div")
    join_msg.className = 'join_msg'
    join_msg.innerHTML = `
    <div class="left">
    <div class="img user_img" data-name="${data.name}" data-img="${data.img}">
        <img width="44" height="44" src="${data.img}" alt="profile photo">
    </div>

    <div class="info">
        <div class="name" >${data.name}</div>
        <div class="flex">
        <div style="color: blue;"><i class="fa-solid fa-comment-dots"></i><span>إعلان</span></div>
            <div style="min-width: fit-content;height: fit-content;">${data.msg}</div>
        </div>
    </div>
</div>

<div class="right">
    <div class="time"><span class="time_sent">0</span>د</div>
</div>
    
    `;


    chat.appendChild(join_msg)

}

function AddDisconnectMessage(data){
    const chat = document.querySelector(".chat");
    const join_msg = document.createElement("div")
    join_msg.className = 'disconnect_msg'
    join_msg.innerHTML = `
    <div class="left">
    <div class="img user_img" data-name="${data.user}" data-img="${data.img}">
        <img width="44" height="44" src="${data.img}" alt="profile photo">
    </div>

    <div class="info">
        <div class="name">${data.user}</div>
        <div class="flex">

            <div style="min-width: fit-content;height: fit-content;">${data.msg}</div>
        </div>
    </div>
</div>

<div class="right">
    <div class="time"><span class="time_sent">0</span>د</div>
</div>
    
    `;


    chat.appendChild(join_msg)

}
function AddMessage(data){
    const chat = document.querySelector(".chat");
    const join_msg = document.createElement("div")
    join_msg.className = 'msg'
    join_msg.innerHTML = `
    <div class="left">
    <div class="img user_img" data-name="${data.user}" data-img="${data.img}">
        <img width="44" height="44" src="${data.img}" alt="profile photo">
    </div>

    <div class="info">
        <div class="name" style="color:${data.uCo};background-color:${data.bgCO};">${data.user}</div>
        <div class="flex">
            <div style="min-width: fit-content;height: fit-content;color:${data.fontCO};">${data.msg}</div>
        </div>
    </div>
</div>

<div class="right">
    <div class="time"><span class="time_sent">0</span>د</div>
</div>
    
    `;


    chat.appendChild(join_msg)




}


logout_btn.addEventListener("click",()=>{
    fetch("https://"+window.location.host+"/logout")
    .then((res) => {if(res.status === 200){window.location.reload()}})
  
})

function closeIt(){

  return Logout();
}
// window.onbeforeunload = closeIt;



function Logout(){

    fetch("https://"+window.location.host+"/logout")
    .then((res) => res.json())
    .then((data)=>{
        console.log(data);
    })
}






function getUserImg(){
    const user_img = document.querySelectorAll(".user_img");
    const user_img_array = Array.from(user_img);

    const popup_profile_name = document.getElementById("popup_profile_name")
    user_img_array.forEach((ele)=>{

    
        ele.addEventListener("click",(e)=>{


            const username = e.currentTarget.dataset.name
            currnet_name_popup.value = username;
            popup_name_input.value = username;
            popup_profile_name.textContent = username;

            const popup_pics = document.querySelectorAll(".popup_pic");
            const popup_pics_array = Array.from(popup_pics);
            popup_pics_array.forEach((ele)=>{
                ele.src = e.currentTarget.dataset.img
            })

            fetch("https://"+window.location.host+"/user",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:username
                    
    
                })
            })
            .then((res) => res.json())
            .then((data) =>{

                if(data){
    
    
    
                    popup_likes_count.textContent = data[0].likes
                    popup_bio.textContent = data[0].bio

    
                    popup.style.display = "flex"

                    
    
                }
            })
    
           


           
        })
    })
    
}

if(show_user_info_btn){
    
show_user_info_btn.addEventListener("click",()=>{

    if(currnet_name_popup.value.length > 0){

        const username = currnet_name_popup.value
        fetch("https://"+window.location.host+"/user",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                username:username
                

            })
        })
        .then((res) => res.json())
        .then((data) =>{
            if(data){




                username_info.textContent = data[0].username;
                nickname_info.textContent = data[0].nickname;
                ip_info.textContent = data[0].ip;
                device_info.textContent = data[0].device

                user_info_popup.style.display = "flex"
                popup.style.display = "none"


                user_info_popup_close_btn.addEventListener("click",()=>{
                    user_info_popup.style.display = "none"
                })

                

            }
        })





    }
})
}