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



user_img_array.forEach((ele)=>{
    ele.addEventListener("click",()=>{
        const username = ele.dataset.name
        popup_name_input.value = username;

        popup.style.display = "flex"
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
        socket.emit("message",{user:username,msg:msg})
        msg_input.value = '';

    }
})

window.onload = ()=>{
 
    socket.emit("join room",{name:username,room:"ROOM"})
}

socket.on("size",(size)=>{
    current_users.textContent = parseInt(size);
})

socket.on("welcome message",(data) =>{

    AddWelcomeMessage(data)

})
socket.on("message",(data) =>{
    console.log("message",data);
    AddMessage(data)
})

function AddWelcomeMessage(data){
    const chat = document.querySelector(".chat");
    const join_msg = document.createElement("div")
    join_msg.className = 'join_msg'
    join_msg.innerHTML = `
    <div class="left">
    <div class="img user_img" data-name="name">
        <img width="44" height="44" src="./imgs/pic.png" alt="profile photo">
    </div>

    <div class="info">
        <div class="name">${data.user}</div>
        <div class="flex">
            <div class="exit_btn"><i class="fa-solid fa-arrow-right-from-bracket"></i><span>${data.room}</span></div>
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
    <div class="img user_img" data-name="name">
        <img width="44" height="44" src="./imgs/pic.png" alt="profile photo">
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


logout_btn.addEventListener("click",()=>{
    fetch("https://"+window.location.host+"/logout")
    .then((res) => {if(res.status === 200){window.location.reload()}})
  
})

function closeIt()
{


    Logout()


  return "Any string value here forces a dialog box to \n" + 
         "appear before closing the window.";
}
// window.onbeforeunload = closeIt;

// const testers = document.getElementById("testers")

// testers.addEventListener("click",()=>{
//     window.open("/cp","_blank")
// })


function Logout(){
    console.log("LOGED");
    fetch("https://"+window.location.host+"/logout")
    .then((res) => res.json())
    .then((data)=>{
        console.log(data);
    })
}