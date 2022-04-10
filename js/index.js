const all_times = document.querySelectorAll(".time_sent");

const all_times_array = Array.from(all_times);

const popup = document.getElementById("popup");
const popup_close_btn = document.getElementById("popup_close_btn")
const user_img = document.querySelectorAll(".user_img");
const user_img_array = Array.from(user_img);

const popup_name_input = document.getElementById('popup_name');

const socket = io();

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
const user_country = document.getElementById("user_country")

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

const private_chat_popup = document.getElementById("private_chat_popup");
const private_chat_popup_close_btn = document.getElementById("private_chat_popup_close_btn");
const private_chat_popup_btn = document.getElementById("private_chat_popup_btn");

const private_chat_profile_img = document.getElementById("private_chat_profile_img")
const private_chat_name_input = document.getElementById("private_chat_name_input")
const private_chat_nickname = document.getElementById("private_chat_nickname")
const private_chat_profile = document.getElementById("private_chat_profile")

const private_msg_input = document.getElementById("private_msg_input");
const private_send_btn = document.getElementById("private_send_btn");



const private_chats_cont  = document.getElementById("private_chats")

const popup_nickname = document.getElementById("popup_nickname");
const popup_likes_input = document.getElementById("popup_likes_input");

const delete_user_info_img_btn = document.getElementById("delete_user_info_img_btn");

const disable_private_chat = document.getElementById("disable_private_chat")
const disable_notify = document.getElementById("disable_notify")

const msg_form = document.getElementById("msg_form");

const private_chat_form = document.getElementById("private_chat_form");

private_chat_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    sendPrivateMessage();
})

msg_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    sendMessage();

})

disable_private_chat.addEventListener("click",()=>{

    let toggle = 0;

    if(disable_private_chat.children[0].style.display === "none"){
        toggle = 0;
    }else if(disable_private_chat.children[0].style.display === "block"){
        toggle = 1;

    }

    fetch("https://"+window.location.host+"/TogglePrivateChat",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:JSON.stringify({
            toggle:toggle
            

        })
    })
    .then((res) => res.json())
    .then((data) =>{
        if(data.res === "ok"){
            if(disable_private_chat.children[0].style.display === "none"){
                disable_private_chat.children[0].style.display = "block"
            }else if(disable_private_chat.children[0].style.display === "block"){
                disable_private_chat.children[0].style.display = "none"
        
            }
        }
    })


})

disable_notify.addEventListener("click",()=>{

    let toggle = 0;

    if(disable_notify.children[0].style.display === "none"){
        toggle = 0;
    }else if(disable_notify.children[0].style.display === "block"){
        toggle = 1;

    }

    fetch("https://"+window.location.host+"/ToggleNotify",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:JSON.stringify({
            toggle:toggle
            

        })
    })
    .then((res) => res.json())
    .then((data) =>{
        if(data.res === "ok"){
            if(disable_notify.children[0].style.display === "none"){
                disable_notify.children[0].style.display = "block"
            }else if(disable_notify.children[0].style.display === "block"){
                disable_notify.children[0].style.display = "none"
        
            }
        }
    })


})






private_chat_popup_btn.addEventListener("click",()=>{



    if(currnet_name_popup.value.length > 0){
        private_chat_popup.style.display = "flex";
        popup.style.display = "none"


        const username = currnet_name_popup.value



        if(private_chats_cont.children.length === 0){
            const div = document.createElement("div");
            div.id = username+"_chat"
            div.className = "private_chats"
            private_chats_cont.appendChild(div);
        }else{

            const private_chats_array = Array.from(private_chats_cont.children)

            if(private_chats_array.find((cont) => cont.id === username+"_chat")){
                private_chats_array.forEach((ele)=>{
                     
                    if(ele.id !== username+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })
            }else{
                const div = document.createElement("div");
                div.id = username+"_chat"
                div.className = "private_chats"
                private_chats_cont.appendChild(div);

                private_chats_array.forEach((ele)=>{
                    
                    if(ele.id !== username+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })

            }


        }

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

                private_chat_name_input.value = data[0].username;
                private_chat_profile_img.src = data[0].img
                private_chat_nickname.textContent = data[0].nickname

                private_chat_profile.addEventListener("click",()=>{
                    private_chat_popup.style.display = "none"
                    openProfilePopup(data[0].username)
                })
                

            }
        })





    }

})

private_chat_popup_close_btn.addEventListener("click",()=>{
    private_chat_popup.style.display = "none";
})



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
                name:currnet_room_id.value
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
                        title:edit_room_title_input.value,
                        description:edit_room_desc_input.value.length <= 0?null:edit_room_desc_input.value,
                        size:edit_room_size_input.value,
                        password:edit_room_password_input.value.length <= 0?null:edit_room_password_input.value,
                        welcome_msg:edit_room_welcome_msg_input.value.length <= 0?null: edit_room_welcome_msg_input.value,
                        name:currnet_room_id.value
                        
        
                    })
                })
                .then((res) => res.json())
                .then((data) =>{
                    if(data.res === "ok"){
                        edit_room_popup.style.display = "none"
                        getAllRooms();
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

                let uCo = "#00000";
                let bgCO = "#fffff";
                let fontCO = "#00000";
                if(localStorage.getItem("colors")){

                    const json  = JSON.parse(localStorage.getItem("colors"));

                    fontCO = json.fontCo;
                    uCo = json.nameCo;
                    bgCO = json.bgCo

                }

            
                socket.emit("wall post",{nickname:nickname,username:username,msg:wall_input.value,img:img,uco:uCo,bgco:bgCO})
                wall_input.value = "";

            
       
    }


})




save_user_info_btn.addEventListener("click",()=>{




    if(nickname_input.value.length > 0 && bio_input.value.length > 0){
        fetch("https://"+window.location.host+"/UpdateUserInfo",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                nickname:nickname_input.value,
                bio:bio_input.value,
                uco: name_color.value,
                fontco:font_color.value,
                bgco:background_color.value

            })
        })
        .then((res)=>res.json())
        .then((data) => {

            if(data.res === "ok"){
                nickname = nickname_input.value
                const json = JSON.parse(localStorage.getItem("colors"));
    
                json.nameCo = name_color.value;
                json.fontCo = font_color.value;
                json.bgCo = background_color.value;
            
                const colors = json
            
                localStorage.setItem("colors",JSON.stringify(colors))

            }



            
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
                        socket.emit("get all rooms")
                        return
        
                    }
        
                })
            }
        })
        
    }

    if(wall_sidebar_btn === btn){
        btn.addEventListener("click",()=>{
            wall_sidebar_btn.style.backgroundColor = buttons_color
            const SideBars = document.querySelectorAll('.sidebar');
            const SideBars_array = Array.from(SideBars);
            SideBars_array.map((ele)=>{
                ele.style.display = 'none'
            })
            SideBar.style.display = "flex"
        })
    }


    if(private_chat_btn === btn){
        btn.addEventListener("click",()=>{
            private_chat_btn.style.backgroundColor = buttons_color
            const SideBars = document.querySelectorAll('.sidebar');
            const SideBars_array = Array.from(SideBars);
            SideBars_array.map((ele)=>{
                ele.style.display = 'none'
            })
            SideBar.style.display = "flex"
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



send_btn.addEventListener("click",()=>{

    sendMessage();



})



private_send_btn.addEventListener("click",()=>{

    sendPrivateMessage();
    


})


socket.on("get all rooms",()=>{

    getAllRooms()




})



window.onload = ()=>{
 
    socket.emit("join room",{name:nickname,username:username,room:roomName,img:img})
    socket.emit("get_conntected_users")

    currnet_room_id.value = roomName
   

    if(document.getElementById("send_ad_btn")){
        const send_ad_btn = document.getElementById("send_ad_btn");
        send_ad_btn.addEventListener("click",()=>{
            let ad_prompt = prompt("اكتب نص الإعلان")
    
            if(ad_prompt){
                if(ad_prompt.length > 0){
                  
                    
                    socket.emit("ad",{name:nickname,msg:ad_prompt,img:img})
                }
            }
        })
    }


    getAllRooms();
    


 

    fetch("https://"+window.location.host+"/MyUser")
    .then((res) => res.json())
    .then((data) =>{
        

        nickname_input.value = data[0].nickname;
        bio_input.value = data[0].bio;
        user_flag.src = `https://flagcdn.com/16x12/${country.toLowerCase()}.png`
        user_country.textContent = data[0].country

        font_color.value = data[0].fontco;
        name_color.value = data[0].uco;
        background_color.value = data[0].bgco

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
                <div class="img"><img src="${ele.img}" style="object-fit:cover;" width="44" height="44" alt="profile card photo"></div>
                <div class="card_info" style="margin-left: 5px;display: flex; flex-direction: column; justify-content: center;">
                    <div class="wall_card_name" style="color:${ele.uco};background-color:${ele.bgco};width:fit-content;padding:3px;border-radius:3px;">${ele.nickname}</div>
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


socket.on("err",({to,msg})=>{

    if(username === to){
        const div = document.createElement("div");
        div.className = "notify";
        div.innerHTML = `
        
        <div>${msg}</div>
        
        `

        document.body.prepend(div)
        const notify = document.querySelectorAll(".notify");

        Array.from(notify).forEach((ele)=>{
            ele.addEventListener("click",(e)=>{
                ele.remove()
            })
        })
    }
})

socket.on("private notify",({to,from,msg,img,uCo,bgCO})=>{

    if(username === to){
        const div = document.createElement("div");
        div.className = "notify";
        div.innerHTML = `
        
        <div class="flex" style="align-items: center;">
        <div><img width="20" height="20" src="${img}" alt="profile pic"></div>
        <div style="color: ${uCo};background-color: ${bgCO};height: fit-content;">${from}</div>
    </div>
    <div>${msg}</div>
        
        `

        document.body.prepend(div)
        const notify = document.querySelectorAll(".notify");

        Array.from(notify).forEach((ele)=>{
            ele.addEventListener("click",(e)=>{
                ele.remove()
            })
        })
    }
})




socket.on("kick room",({my_username})=>{
  
    if(username === my_username){
        socket.emit("leave room")
    }
})


socket.on("add ban",({my_username})=>{
  
    if(username === my_username){
        fetch("https://"+window.location.host+"/logout",{method:"POST"})
        .then((res) => {if(res.status === 200){window.location.reload()}})
    }
})

socket.on("transfer new room",({my_username,room})=>{
  
    if(username === my_username){
        socket.emit("join new room",{name:nickname,room:room,img:img})
        currnet_room_id.value = room
    }
})


socket.on("send_connected_users",(data)=>{
    if(data.length > 0){
        
        Array.from(document.querySelectorAll(".room_size_txt")).forEach((ele)=>{
            ele.textContent = 0
        })
        data.forEach((ele)=>{
            
            if(document.getElementById(ele.room+"_room")){
                document.getElementById(ele.room+"_room").textContent = parseInt(document.getElementById(ele.room+"_room").textContent ) + 1

            }

            
            
        })
    }
})

socket.on("size",(users)=>{
    current_users.textContent = users.length

    if(users.length > 0){
        const available_users = document.getElementById("available_users");
        const all_users = document.getElementById("all_users");
        all_users.innerHTML = ``
        available_users.innerHTML = ``
        let lastPos = 0;
        users.forEach((ele)=>{
            lastPos = lastPos + 1

            const user_div = document.createElement("div");
            user_div.className = "user"

            user_div.innerHTML =

            `

            <div class="flex">
                 <div class="bar"></div>
                 <div class="img user_img" data-name="${ele.username}" onclick="openProfilePopup('${ele.username}')"><img width="44" height="100%" src="${ele.img}" alt="profile photo"></div>
                 <div style="margin-left: 5px;">
                     <div style="color:${ele.uco};background-color:${ele.bgco};width:fit-content;padding:3px;border-radius:3px;">${ele.nickname}</div>
                     <div class="status-gray" style="color: gray;font-size: 14px;">${ele.bio}</div>
                 </div>
            </div>

            <div class="flag">
             <span style="color: gray;font-size: 11px;">#${lastPos}</span>
                 <img src="https://flagcdn.com/16x12/${ele.country.toLowerCase()}.png" alt="Flag photo">
                 
            </div>


            
            
            `;

            if(ele.room === roomName){
                available_users.appendChild(user_div)
            }else{
                all_users.appendChild(user_div)
            }
            

        })
    }
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

socket.on("private message",(data)=>{
    

    if(data.from === username){

        if(private_chats_cont.children.length === 0){
            const div = document.createElement("div");
            div.id = data.to+"_chat"
            div.className = "private_chats"
            private_chats_cont.appendChild(div);
        }else{
    
            const private_chats_array = Array.from(private_chats_cont.children)
    
            if(private_chats_array.find((cont) => cont.id === data.to+"_chat")){
                private_chats_array.forEach((ele)=>{
                   
                    if(ele.id !== data.to+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })
            }else{
                const div = document.createElement("div");
                div.id = data.to+"_chat"
                div.className = "private_chats"
                private_chats_cont.appendChild(div);
    
                private_chats_array.forEach((ele)=>{
                   
                    if(ele.id !== data.to+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })
    
            }
    
    
        }

        const chat = document.getElementById(data.to+"_chat")

        const join_msg = document.createElement("div")
        join_msg.className = 'msg'
        join_msg.innerHTML = `
        <div class="left">
        <div class="img user_img" data-name="${data.to}" data-img="${data.from_img}">
            <img width="44" height="44" src="${data.from_img}" alt="profile photo">
        </div>
    
        <div class="info">
            <div class="name" style="color:${data.uCo};background-color:${data.bgCO};">${data.from}</div>
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

        const private_chats_sider = document.getElementById("private_chats_sider");
        let isexist = false;

        Array.from(private_chats_sider.children).forEach((ele)=>{
            if(ele.dataset.name === data.to){
                isexist = true;
            }
        })

       

        if(!isexist){

            const private_chat = document.createElement("div");
            private_chat.className = "delete_private_chat flex";
            private_chat.style = "justify-content: space-between;padding: 3px;";
            private_chat.id = data.to+"_chat_sider"
            private_chat.dataset.name = data.to
    
            private_chat.innerHTML = `
            
            <div class="flex private_chat" data-name="${data.to}">
            <div><img style="border: 1px solid black;" src="${data.to_img}" width="30" height="30" alt=""></div>
            <div style="color:${data.uCo};background-color:${data.bgCO};height: fit-content;padding: 3px;">${data.to}</div>
            </div>
            <div data-name="${data.to}" style="background-color: #c12e2a;color: white;height: fit-content;padding: 3px;border-radius: 3px;"><i class="fa-solid fa-xmark"></i><span>حذف</span></div>
    
            `
            private_chats_sider.appendChild(private_chat);
        }


    }else if(data.to === username){

        
        if(private_chats_cont.children.length === 0){
            const div = document.createElement("div");
            div.id = data.from+"_chat"
            div.className = "private_chats"
            private_chats_cont.appendChild(div);
        }else{
    
            const private_chats_array = Array.from(private_chats_cont.children)
    
            if(private_chats_array.find((cont) => cont.id === data.from+"_chat")){
                private_chats_array.forEach((ele)=>{
                   
                    if(ele.id !== data.from+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })
            }else{
                const div = document.createElement("div");
                div.id = data.from+"_chat"
                div.className = "private_chats"
                private_chats_cont.appendChild(div);
    
                private_chats_array.forEach((ele)=>{
                   
                    if(ele.id !== data.from+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })
    
            }
    
    
        }

        
        const chat = document.getElementById(data.from+"_chat")

        const join_msg = document.createElement("div")
        join_msg.className = 'msg'
        join_msg.innerHTML = `
        <div class="left">
        <div class="img user_img" data-name="${data.from}" data-img="${data.to_img}">
            <img width="44" height="44" src="${data.to_img}" alt="profile photo">
        </div>
    
        <div class="info">
            <div class="name" style="color:${data.uCo};background-color:${data.bgCO};">${data.to}</div>
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

        const private_chats_sider = document.getElementById("private_chats_sider");
        let isexist = false;

        Array.from(private_chats_sider.children).forEach((ele)=>{
            if(ele.dataset.name === data.from){
                isexist = true;
            }
        })

       

        if(!isexist){

            const private_chat = document.createElement("div");
            private_chat.className = "delete_private_chat flex";
            private_chat.style = "justify-content: space-between;padding: 3px;";
            private_chat.id = data.from+"_chat_sider"
            private_chat.dataset.name = data.from
            private_chat.innerHTML =  `
            
            <div class="flex private_chat" data-name="${data.from}">
            <div><img style="border: 1px solid black;" src="${data.from_img}" width="30" height="30" alt=""></div>
            <div style="height: fit-content;padding: 3px;">${data.from}</div>
            </div>
            <div data-name="${data.from}" style="background-color: #c12e2a;color: white;height: fit-content;padding: 3px;border-radius: 3px;"><i class="fa-solid fa-xmark"></i><span>حذف</span></div>
    
            `
            private_chats_sider.appendChild(private_chat);
        }



        if(private_chat_btn.style.display === "none"){
            private_chat_btn.style.backgroundColor = "#FFC300"
        }
      




    }

    Array.from(document.querySelectorAll(".private_chat")).forEach((ele)=>{
        ele.addEventListener("click",(e)=>{
            
            openPrivateChat(e.currentTarget.dataset.name);
        })
    })


    Array.from(document.querySelectorAll(".delete_private_chat")).forEach((ele)=>{
        ele.children[1].addEventListener("click",(e)=>{
            
            if(document.getElementById(e.currentTarget.dataset.name+"_chat")){
                document.getElementById(e.currentTarget.dataset.name+"_chat").remove();
                ele.remove();
                
            }
        })
    })


})


socket.on("wall post",(data)=>{
    if(wall_sidebar.style.display === "none"){
        wall_sidebar_btn.style.backgroundColor = "#E1C16E"
    }

    AddToWall(data);
})


function AddToWall(data){


    const wall_posts = document.getElementById('wall_posts');


        const div = document.createElement("div");
        div.className = "wall_card"
        div.style = "border: 1px solid lightgray; margin-left: 3px;";
        div.innerHTML = `


            <div class="left">
            <div class="img"><img src="${data.img}" style="object-fit:cover;" width="44" height="44" alt="profile card photo"></div>
            <div class="card_info" style="margin-left: 5px;display: flex; flex-direction: column; justify-content: center;">
                <div class="wall_card_name" style="color:${data.uco};background-color:${data.bgco};width:fit-content;padding:3px;border-radius:3px;">${data.nickname}</div>
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


        wall_posts.prepend(div);


}


function AddWelcomeMessage(data){
    
    const chat = document.querySelector(".chat");
    const join_msg = document.createElement("div")
    join_msg.className = 'join_msg'
    join_msg.innerHTML = `
    <div class="left">
    <div class="img user_img" data-name="${data.username}" data-img="${data.img}">
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
    <div class="img user_img" data-name="${data.username}" data-img="${data.img}">
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
    <div class="img user_img" data-name="${data.username}" data-img="${data.img}">
        <img width="44" height="44" src="${data.img}" alt="profile photo">
    </div>

    <div class="info">
        <div class="name" style="color:${data.uCo};background-color:${data.bgCO};">${data.user}</div>
        <div style="max-width:100vw">
            <div style="color:${data.fontCO};">${data.msg}</div>
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
    fetch("https://"+window.location.host+"/logout",{method:"POST"})
    .then((res) => {if(res.status === 200){window.location.reload()}})
  
})




function Logout(){

 fetch("https://"+window.location.host+"/logout",{method:"POST"})
    .then((res) => {if(res.status === 200){window.location.reload()}})
}




function closeIt(){

  return Logout();
}
//window.onbeforeunload = closeIt;


function getUserImg(){
    const user_img = document.querySelectorAll(".user_img");
    const user_img_array = Array.from(user_img);

    const popup_profile_name = document.getElementById("popup_profile_name")
    user_img_array.forEach((ele)=>{

    
        ele.addEventListener("click",(e)=>{





            const username = e.currentTarget.dataset.name

            openProfilePopup(username)

            // currnet_name_popup.value = username;
            // popup_name_input.value = username;
            // popup_profile_name.textContent = username;

            // const popup_pics = document.querySelectorAll(".popup_pic");
            // const popup_pics_array = Array.from(popup_pics);
            // popup_pics_array.forEach((ele)=>{
            //     ele.src = e.currentTarget.dataset.img
            // })

            // fetch("https://"+window.location.host+"/user",{
            //     method:"POST",
            //     headers:{
            //         'Content-Type': 'application/json'
            //     },
            //     credentials: 'include',
            //     body:JSON.stringify({
            //         username:username
                    
    
            //     })
            // })
            // .then((res) => res.json())
            // .then((data) =>{

            //     if(data){
    
    
    
            //         popup_likes_count.textContent = data[0].likes
            //         popup_bio.textContent = data[0].bio

    
            //         popup.style.display = "flex"

                    
    
            //     }
            // })
    
           


           
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

function openProfilePopup(username){
 

    if(document.getElementById("admin_popup")){

        currnet_name_popup.value = username;
        popup_name_input.value = username;
        popup_profile_name.textContent = username;
        const rooms_select = document.getElementById("rooms_select");
        const subs_select = document.getElementById("subs_select");
    
        const popup_pics = document.querySelectorAll(".popup_pic");
        const popup_pics_array = Array.from(popup_pics);
    
        socket.emit("get current room",({username}))
    
        socket.on("get current room",({room,rooms})=>{
            rooms_select.innerHTML = ''
            
  
            const popup_room_data_childern = document.getElementById("popup_room_data").children
            rooms.forEach((ele)=>{
                const option = document.createElement("option");
                option.value = ele.name
                option.textContent = ele.name;
                if(ele.name === room){
                    option.selected = true;
                    popup_room_data_childern[0].src = ele.photo
                    popup_room_data_childern[1].textContent = ele.name
                }
                rooms_select.appendChild(option)
            })
    
        })
    
    
    
    
        fetch("https://"+window.location.host+"/user",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                username:currnet_name_popup.value
                
    
            })
        })
        .then((res) => res.json())
        .then((data) =>{

    
            if(data){
    
    
                fetch("https://"+window.location.host+"/PowersNames")
                .then((res) => res.json())
                .then((powers)=>{
                    subs_select.innerHTML = ''

                    powers.forEach((ele)=>{
                        const option = document.createElement("option");
                        option.value = ele.power
                        option.textContent = `[${ele.power}] ${ele.name}`
    
                        if(parseInt(ele.power) === data[0].power){
                            option.selected = true;
                        }
                        subs_select.appendChild(option)
                    })
                })

                
    
                popup_nickname.value = data[0].nickname
                popup_likes_input.value = data[0].likes
                popup_likes_count.textContent = data[0].likes
                popup_bio.textContent = data[0].bio
                user_flag.src = `https://flagcdn.com/16x12/${(data[0].country).toLowerCase()}.png`
                user_country.textContent = data[0].country;
                popup_pics_array.forEach((ele)=>{
                    ele.src = data[0].img
                })
    
    
                popup.style.display = "flex"
    
    
                const update_popup_nickname_btn = document.getElementById("update_popup_nickname_btn");
                update_popup_nickname_btn.addEventListener("click",()=>{
                    if(popup_nickname.value.length > 0){
    
                        fetch("https://"+window.location.host+"/UpdateUserNickname",{
                            method:"POST",
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body:JSON.stringify({
                                username:currnet_name_popup.value,
                                nickname:popup_nickname.value
                                
                    
                            })
                        })
                        .then((res) => res.json())
                        .then((data) =>{
                            if(data.res === "ok"){
                                alert(data.msg)
                                return
                                
                            }else if(data.res === "bad"){
                                alert(data.msg)
                                return
                                
                            }
                            return
                        })
    
                    }
                })
    
                const update_popup_likes_btn = document.getElementById("update_popup_likes_btn");
                update_popup_likes_btn.addEventListener("click",()=>{
                    if(popup_nickname.value.length > 0){
    
                        fetch("https://"+window.location.host+"/UpdateUserLikes",{
                            method:"POST",
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body:JSON.stringify({
                                username:currnet_name_popup.value,
                                likes:popup_likes_input.value
                                
                    
                            })
                        })
                        .then((res) => res.json())
                        .then((data) =>{
                            if(data.res === "ok"){
                                alert(data.msg)
                                return
                            }else if(data.res === "bad"){
                                alert(data.msg)
                                return
                            }
                            return
                        })
    
                    }
                })

                delete_user_info_img_btn.addEventListener("click",()=>{
                    fetch("https://"+window.location.host+"/DeleteImg",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value,
                            
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data)=>{
                        if(data.res === "ok"){
                            popup.style.display = "none"
                            alert(data.msg);
                            return
                            

                        }else if(data.res === "bad"){
                            alert(data.msg)
                            return
                        }

                        return
                    })
    
                })

                const add_like = document.getElementById("add_like");
                add_like.addEventListener("click",()=>{

                    fetch("https://"+window.location.host+"/AddLike",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value,
                            
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data) =>{
                        
                        if(data.res === "bad"){
                           
                           const div = document.createElement("div");
                           div.className = "notify";
                           div.innerHTML = `
                           
                           <div>${data.msg}</div>
                           
                           `
                   
                           document.body.prepend(div)
                           const notify = document.querySelectorAll(".notify");
                   
                           Array.from(notify).forEach((ele)=>{
                               ele.addEventListener("click",(e)=>{
                                   ele.remove()
                               })
                           })
                            
                        }else if(data.res === "ok"){
                            add_like.style.backgroundColor = "#8b0000"

                            setTimeout(() => {
                                add_like.style.backgroundColor = ""
                            }, 500);
                            
                        }
                        return
                    })

                })

                const ban_btn = document.getElementById("ban_btn");
                ban_btn.addEventListener("click",()=>{

                    fetch("https://"+window.location.host+"/CanPower",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data) =>{
                        if(data.res === "ok"){

                            fetch("https://api64.ipify.org/?format=json")
                            .then((res) => res.json())
                            .then((ip_data) =>{

                                fetch("https://"+window.location.host+"/Addban",{
                                    method:"POST",
                                    headers:{
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'include',
                                    body:JSON.stringify({
                                        ban:ip_data.ip,
                    
                        
                                    })
                                })
                                .then((res) => res.json())
                                .then((data) => {
                                    if(data.res){
                                        if(data.res === "ok"){
                                            
                                            popup.style.display = "none"
                                            
                                            socket.emit("add ban",{username:currnet_name_popup.value})
                                            
                    
                                        }else if(data.res === "bad"){
                                            alert(data.msg)
                                            return
                                            
                                        }
                                    }
                                })

                            })

                        }else if(data.res === "bad"){
                            alert(data.msg);
                            return
                        }
                    })

                })

                const kick_room_btn = document.getElementById("kick_room_btn");
                kick_room_btn.addEventListener("click",()=>{
                    fetch("https://"+window.location.host+"/CanPower",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data) =>{
                        if(data.res === "ok"){
                            socket.emit("kick room",{username:currnet_name_popup.value})
                        }else if(data.res === "bad"){
                            alert(data.msg);
                            return
                        }
                    })
                    
                })

                const transfer_room_btn = document.getElementById("transfer_room_btn");
                transfer_room_btn.addEventListener("click",()=>{

                    fetch("https://"+window.location.host+"/CanPower",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data) =>{
                        if(data.res === "ok"){
                            socket.emit("transfer new room",{username:currnet_name_popup.value,room:rooms_select.value})
                        }else if(data.res === "bad"){
                            alert(data.msg);
                            return
                        }
                    })

                })
    
                const change_power_btn = document.getElementById("change_power_btn");
                change_power_btn.addEventListener("click",()=>{

                    fetch("https://"+window.location.host+"/UpdateUserPowers",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value,
                            power: subs_select.value
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data) =>{
                        if(data.msg){
                            alert(data.msg);
                            return
        
                        }
        
                        if(data.res === "ok"){
                            popup.style.display = 'none'
                            
                        }
                    })

                })

                const private_notify_btn = document.getElementById("private_notify_btn");
                private_notify_btn.addEventListener("click",()=>{

                    let ad_prompt = prompt("اكتب رسالتك")
                    
                    if(ad_prompt){
                        if(ad_prompt.length > 0){
                        
                            let uCo = "#00000";
                            let bgCO = "#fffff";
                            let fontCO = "#00000";
                            if(localStorage.getItem("colors")){
                    
                                const json  = JSON.parse(localStorage.getItem("colors"));
                    
                                fontCO = "#"+json.fontCo;
                                uCo = "#"+json.nameCo;
                                bgCO = "#"+json.bgCo
                    
                            }
                          
                            socket.emit("private notify",{msg:ad_prompt,uCo:uCo,bgCO:bgCO,to:currnet_name_popup.value,from:username})
                        }
                    }
                    return


                })
                
    
            }
        })

    }else{

        currnet_name_popup.value = username;
        popup_name_input.value = username;
        popup_profile_name.textContent = username;
    
        const popup_pics = document.querySelectorAll(".popup_pic");
        const popup_pics_array = Array.from(popup_pics);
    

    
    
    
    
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
                popup_pics_array.forEach((ele)=>{
                    ele.src = data[0].img
                })
    
    
                popup.style.display = "flex"

                const add_like = document.getElementById("add_like");
                add_like.addEventListener("click",()=>{

                    fetch("https://"+window.location.host+"/AddLike",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            username:currnet_name_popup.value,
                            
                            
                
                        })
                    })
                    .then((res) => res.json())
                    .then((data) =>{

                        if(data){
                            if(data.res === "bad"){
                                alert(data.msg);
                                return
                            }else if(data.res === "ok"){
                                alert(data.msg);
                                return
                            }
                        }
 
 
                    })

                })
                
    
            }
        })

    }

   

}

function getAllRooms(){

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
                <div><span id = "${ele.name+"_room"}" class="room_size_txt">0</span>/${ele.size}</div>
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
    
            socket.emit("join new room",{name:nickname,username:username,room:room_name,img:img})
            currnet_room_id.value = room_name
            setTimeout(() => {
                socket.emit("get_conntected_users")
            }, 500);
            roomName = room_name
            send_btn.disabled = false
            msg_input.readOnly = false;
            exit_rooms_btn.disabled = false
            msg_input.style.backgroundColor = ""
            exit_rooms_btn.style.backgroundColor = buttons_color
            send_btn.style.backgroundColor = buttons_color
    
    
        })
    })
    
    const create_room_btn = document.getElementById('create_room_btn');
    PopupToggle(create_room_popup,create_room_popup_close_btn,create_room_btn);
    
    
    
    
    })

}

function openPrivateChat(name){

    if(name.length > 0){
        private_chat_popup.style.display = "flex";
        popup.style.display = "none"

        currnet_name_popup.value = name
        const username = name



        if(private_chats_cont.children.length === 0){
            const div = document.createElement("div");
            div.id = username+"_chat"
            div.className = "private_chats"
            private_chats_cont.appendChild(div);
        }else{

            const private_chats_array = Array.from(private_chats_cont.children)

            if(private_chats_array.find((cont) => cont.id === username+"_chat")){
                private_chats_array.forEach((ele)=>{
                   
                    if(ele.id !== username+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })
            }else{
                const div = document.createElement("div");
                div.id = username+"_chat"
                div.className = "private_chats"
                private_chats_cont.appendChild(div);

                private_chats_array.forEach((ele)=>{
                   
                    if(ele.id !== username+"_chat"){
                        ele.style.display = "none"
                    }else{
                        ele.style.display = "block"
                    }
                })

            }


        }

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

                private_chat_name_input.value = data[0].username;
                private_chat_profile_img.src = data[0].img
                private_chat_nickname.textContent = data[0].nickname

                private_chat_profile.addEventListener("click",()=>{
                    private_chat_popup.style.display = "none"
                    openProfilePopup(data[0].username)
                })
                

            }
        })





    }
}

function sendMessage(){

    if(msg_input.value.length > 0){
        const msg = msg_input.value;
        let uCo = "#00000";
        let bgCO = "#fffff";
        let fontCO = "#00000";
        if(localStorage.getItem("colors")){

            const json  = JSON.parse(localStorage.getItem("colors"));

            fontCO = json.fontCo;
            uCo = json.nameCo;
            bgCO = json.bgCo

        }
        socket.emit("message",{user:nickname,username:username,img:img,msg:msg,uCo:uCo,bgCO:bgCO,fontCO:fontCO})
        msg_input.value = '';

    }

}

function sendPrivateMessage(){
    const to = currnet_name_popup.value
    if(private_msg_input.value.length > 0 && to.length > 0){
    
        const msg = private_msg_input.value;
        let uCo = "#00000";
        let bgCO = "#fffff";
        let fontCO = "#00000";
        if(localStorage.getItem("colors")){

            const json  = JSON.parse(localStorage.getItem("colors"));

            fontCO = json.fontCo;
            uCo = json.nameCo;
            bgCO = json.bgCo

        }
        socket.emit("private message",{to:to,from:username,user:private_chat_nickname.innerText,img:img,msg:msg,uCo:uCo,bgCO:bgCO,fontCO:fontCO})
        private_msg_input.value = '';

    }

}
