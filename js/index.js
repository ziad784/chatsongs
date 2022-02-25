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