function refreshBrowser(){
    window.location.reload()
}

const tabs = document.querySelector(".tabs").children;

const tabs_array = Array.from(tabs)


const contents = document.querySelectorAll(".tab_contnet")

const contents_array = Array.from(contents)

const anonymous_user_form = document.getElementById("anonymous_user");
const login_user_form = document.querySelector(".login_user");
const signup_user_form = document.querySelector(".signup_user");
const socket = io();

tabs_array.forEach(ele =>{
    ele.addEventListener("click",(e)=>{
        tabs_array.forEach(ele =>{
            ele.classList.remove("active")
        })

        e.currentTarget.classList.add("active")

        contents_array.forEach((element)=>{
            element.classList.remove("active_tab")
        })

        document.querySelector(e.currentTarget.dataset.tab).classList.add("active_tab")

    })
})


anonymous_user_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    
})



signup_user_form.addEventListener("submit",(e)=>{
    const username = document.getElementById("sign_username").value;
    const password = document.getElementById("sign_password").value;
    const sign_btn = document.getElementById("sign_btn");
    const device = window.navigator.userAgent;

    e.preventDefault();

    
    if(username && password){
        sign_btn.disabled = true;

        fetch("https://api64.ipify.org/?format=json")
        .then((res) => res.json())
        .then((data)=>{

            
        fetch("https://"+window.location.host+"/signup",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                username:username,
                password:password,
                device:device,
                ip:data.ip
            })
        })
        .then((res)=>res.json())
        .then((data)=>{
           
            if(data.res === 'bad'){
                if(signup_user_form.children[signup_user_form.children.length - 1].className === "err"){
                    signup_user_form.removeChild(signup_user_form.children[signup_user_form.children.length - 1])
                }
                const err = document.createElement("div");
                err.className = "err"
                err.textContent = data.msg
                signup_user_form.append(err)
                sign_btn.disabled = false
            }else if(data.res === "ok"){
                socket.emit("get_conntected_users")
                localStorage.setItem("user",JSON.stringify(data.user))
                window.location.reload();

            }
        }).catch((e)=>{
            
        })

        })


    }
    
})



login_user_form.addEventListener("submit",(e)=>{
    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;
    const device = window.navigator.userAgent;

    e.preventDefault();

    
    if(username && password){

        fetch("https://api64.ipify.org/?format=json")
        .then((res) => res.json())
        .then((data) =>{


            fetch("https://"+window.location.host+"/login",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:username,
                    password:password,
                    device:device,
                    ip:data.ip
                })
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.res === 'bad'){
                    if(login_user_form.children[login_user_form.children.length - 1].className === "err"){
                        login_user_form.removeChild(login_user_form.children[login_user_form.children.length - 1])
                    }
                    const err = document.createElement("div");
                    err.className = "err"
                    err.textContent = data.msg
                    login_user_form.append(err)
                }else if(data.res === "ok"){
                    localStorage.setItem("user",JSON.stringify(data.user))
                    window.location.reload();
                    socket.emit("get_conntected_users")
                }
            }).catch((e)=>{
                
            })



        })

    }
    
})





window.onload = ()=>{
    socket.emit("get_conntected_users")
    if(!localStorage.getItem("colors")){
        const json_color = JSON.stringify({nameCo:"00000",fontCo:"00000",bgCo:"00000"})
        localStorage.setItem("colors",json_color)
    }
}

socket.on("send_connected_users",(data)=>{
    const users_list = document.getElementById("users_list");
    const send_connected_users = document.getElementById("connected_users_num");

    if(data.length > 0 ){


        send_connected_users.textContent = data.length
        users_list.innerHTML = ``

        data.map((ele)=>{

            const div = document.createElement("div")
            div.className = "user"
    
            div.innerHTML = `
            
            <div class="flex">
            <div class="img user_img" style="border: lightgray 1px solid;"><img width="44" height="100%" src="${ele.img}" alt="profile photo"></div>
            <div style="margin-left: 5px;">
                <div>${ele.nickname}</div>
                <div style="color: lightgray;font-size: 15px;">${ele.bio}</div>
           
            </div>
            </div>
            
            <div class="flag">
                    <img src="https://flagcdn.com/16x12/${ele.country.toLowerCase()}.png" alt="Flag photo">
                    
            </div>
            
            `

            users_list.appendChild(div)

        })





    }else{

        users_list.innerHTML = ``
        if(parseInt(send_connected_users.textContent) > 0){
            send_connected_users.textContent = parseInt(send_connected_users.textContent) - 1
        }
    }
})


