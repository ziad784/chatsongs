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

    e.preventDefault();

    
    if(username && password){
        sign_btn.disabled = true;
        fetch("https://"+window.location.host+"/signup",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                username:username,
                password:password
            })
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
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
                localStorage.setItem("user",JSON.stringify(data.user))
                window.location.reload();
            }
        }).catch((e)=>{
            
        })
    }
    
})



login_user_form.addEventListener("submit",(e)=>{
    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;

    e.preventDefault();

    
    if(username && password){
        fetch("https://"+window.location.host+"/login",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                username:username,
                password:password
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
            }
        }).catch((e)=>{
            
        })
    }
    
})

