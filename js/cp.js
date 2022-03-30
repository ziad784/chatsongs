const lists = document.querySelector(".lists").children
const lists_array = Array.from(lists);

const datas = document.querySelectorAll(".data");
const datas_array = Array.from(datas);

const edit_username_popup_close_btn = document.getElementById("edit_username_popup_close_btn");
const edit_username_popup = document.getElementById("edit_username_popup");
const edit_username_name = document.getElementById('edit_username_name');


lists_array.forEach((ele)=>{

    ele.addEventListener("click",(e)=>{

      
        lists_array.forEach((element)=>{
            element.classList.remove("selected")
        })

        datas_array.forEach((ele)=>{
            ele.classList.remove("showed_data")
        })

        e.currentTarget.classList.add("selected")

        document.querySelector("."+e.currentTarget.dataset.dataname).classList.add("showed_data")

        if(e.currentTarget.dataset.dataname === "history"){

            fetch("http://"+window.location.host+"/history")
            .then((res) => res.json())
            .then((data) => {
                const history_table = document.getElementById("history_table");

                history_table.innerHTML = `


                `

                data.map((ele) => {

                    
                    const tr = document.createElement("tr");



                    tr.innerHTML =  `
                    <td>${ele.status}</td>
                    <td>${ele.username}</td>
                    <td>${ele.nickname}</td>
                    <td>${ele.ip}</td>
                    <td>${ele.country}</td>
                    <td>${ele.device}</td>
                    <td>${ele.source != null? ele.source : ''}</td>
                    <td>${ele.invitation != null? ele.invitation : ''}</td>
                    <td>${ele.time}</td>
                    
                    `
                    history_table.appendChild(tr)


                } )
            })            


        } else if(e.currentTarget.dataset.dataname === "status"){

            fetch("http://"+window.location.host+"/status")
            .then((res) => res.json())
            .then((data) => {
                const history_table = document.getElementById("status_table");

                history_table.innerHTML = `


                `


                data.map((ele) => {

                    
                    const tr = document.createElement("tr");



                    tr.innerHTML =  `
                    <td>${ele.status}</td>
                    <td>${ele.username_1}</td>
                    <td>${ele.username_2}</td>
                    <td>${ele.room}</td>
                    <td>${ele.time}</td>
                    
                    `
                    history_table.appendChild(tr)


                } )
            })            


        }else if(e.currentTarget.dataset.dataname === "users"){

            RenderUsersData();





            UpdatePower();
            UpdateLikes();
            UpdatePassword();
            DeleteUser();



        }else if(e.currentTarget.dataset.dataname === "bans"){

            RenderBansData();

            Addban();




        }else if(e.currentTarget.dataset.dataname === "filter"){

            const filter_input = document.getElementById("filter_input");

            RenderFilterData();
            AddAllowedFilter();
            AddForbiddenFilter();
            AddWarnFilter();






        } else if(e.currentTarget.dataset.dataname === "rooms"){

            fetch("http://"+window.location.host+"/rooms")
            .then((res) => res.json())
            .then((data) => {
                const history_table = document.getElementById("rooms_table");

                history_table.innerHTML = `


                `


                data.map((ele) => {


                    
                    const tr = document.createElement("tr");




                    tr.innerHTML =  `
                    <td>${ele.name}</td>
                    <td>${ele.owner}</td>
                    <td>
                        <table>
                            <thead>
                                <tr>
                                    <th>الصورة</th>
                                    <th>كلمة السر</th>
                                    <th>الغرفه</th>
          
                                </tr>
                            </thead>
        
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="flex">
                                                                                           
                                        <div><img src="${ele.photo}" alt="room photo"></div>
                                        <div class="flexer">
                                            <div class="btn-blue-sm" style="width: fit-content;"><i class="fa-solid fa-image"></i> <span>تغير</span></div>
                                            <div class="btn-red-sm" style="width: fit-content;"><i class="fa-solid fa-xmark"></i> <span>حذف</span></div>
                                        </div>

                                        </div>
                                    </td>
                                    <td> <div class="btn-red-sm" style="width: fit-content;"><i class="fa-solid fa-xmark"></i> <span>حذف</span></div></td>
                                    <td> <div class="btn-red-sm" style="width: fit-content;"><i class="fa-solid fa-xmark"></i> <span>حذف</span></div></td>
                                </tr>
        
                            </tbody>
        
                        </table>

                    </td>
                
                    
                    `
                    history_table.appendChild(tr)


                } )
            })            


        }
        else if(e.currentTarget.dataset.dataname === "shortcuts"){

            RenderShortcutsData();
            AddShortcut();



           


        }else if(e.currentTarget.dataset.dataname === "subs"){

            RenderSubsData();

            



        }else if(e.currentTarget.dataset.dataname === "messages"){
            const messages_title = document.getElementById("messages_title");
            const messages_msg = document.getElementById("messages_msg");

            RenderMessages();
            AddWelcomeMessage();
            AddDailyMessage();



          


        }else if(e.currentTarget.dataset.dataname === "management"){
            let site_name = document.getElementById("site_name")
            let site_title = document.getElementById("site_title")
            let site_description = document.getElementById("site_description")
            let tags = document.getElementById("tags")
            let javascript_code = document.getElementById("javascript_code")
    
            let theme_color = document.getElementById("theme_color")
            let content_color = document.getElementById("content_color")
            let buttons_color = document.getElementById("buttons_color")
    
            let message_time = document.getElementById("message_time")
            let wall_time = document.getElementById("wall_time")
            let wall_messages_time = document.getElementById("wall_messages_time")
    
            let allow_guests = document.getElementById("allow_guests")
            let allow_subs = document.getElementById("allow_subs")
            let reconnection = document.getElementById("reconnection")
    
            let private_chat_number = document.getElementById("private_chat_number")
            let notifications_number = document.getElementById("notifications_number")
            let send_pics_number = document.getElementById("send_pics_number")

            RenderManagement();

            UpdateManagement();


      


        }else if(e.currentTarget.dataset.dataname === "permissions"){
            const select_permission = document.querySelector(".select_permission");
            fetch("http://"+window.location.host+"/Basicpermissions")
            .then((res) => res.json())
            .then((data) => {
               

                console.log(data);

                

                select_permission.innerHTML = ''
                
                data.map((ele)=>{
                    const option = document.createElement("option");
                    option.value = ele.name
                    if(ele.name === "tof3"){
                        option.selected = true
                    }
                    option.textContent = `[${ele.power}] ${ele.name}`
                    select_permission.appendChild(option)
                })

                
                
                const power = document.getElementById("power")
                const power_name = document.getElementById("power_name")
                const power_icon = document.getElementById("power_icon")
                const kick = document.getElementById("kick")
                const remove_wall = document.getElementById("remove_wall")
                const notifications = document.getElementById("notifications")
                const change_nickname = document.getElementById("change_nickname")
                const change_users_data = document.getElementById("change_users_data")
                const ban = document.getElementById("ban")
                const ads = document.getElementById("ads")
                const open_private_chat = document.getElementById("open_private_chat")
                const manage_rooms = document.getElementById("manage_rooms")
                const create_rooms = document.getElementById("create_rooms")
                const max_static_rooms = document.getElementById("max_static_rooms")
                const manage_users = document.getElementById("manage_users")
                const edit_likes = document.getElementById("edit_likes")
                const manage_subs = document.getElementById("manage_subs")
                const gifts = document.getElementById("gifts")
                const show_users_data = document.getElementById("show_users_data")
                const control_panel = document.getElementById("control_panel")
                const remove_messages = document.getElementById("remove_messages")
                const private = document.getElementById("private")
                const site_setting = document.getElementById("site_setting")

                setPermissionData(select_permission.value);

                select_permission.addEventListener("change",(e)=>{
                    console.log(e);
                    setPermissionData(e.target.value)
                })

                UpdatePermissions(select_permission.value)

            })




       


        }



    })
})



function setPermissionData(name){

            
    fetch("http://"+window.location.host+"/permissions",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:JSON.stringify({
            name:name
        
        })
    })
    .then((res) => res.json())
    .then((data) => {
    




       power.value = data[0].power
    

       power_name.value = data[0].name
    

       power_icon.value = data[0].icon
    

       kick.value = data[0].kick
    

       remove_wall.checked = data[0].remove_wall === 0?false:true


       notifications.checked = data[0].notifications === 0?false:true
    

       change_nickname.checked = data[0].change_nickname === 0?false:true
    

       change_users_data.checked = data[0].change_users_data === 0?false:true
    

       ban.checked = data[0].ban === 0?false:true
    

       ads.value = data[0].ads
           

       open_private_chat.checked = data[0].open_private_chat === 0?false:true


       manage_rooms.checked = data[0].manage_rooms === 0?false:true


       create_rooms.checked = data[0].create_rooms === 0?false:true
           

       max_static_rooms.value = data[0].max_static_rooms


       manage_users.checked = data[0].manage_users === 0?false:true


       edit_likes.checked = data[0].edit_likes === 0?false:true

       manage_subs.checked = data[0].manage_subs === 0?false:true

       gifts.value = data[0].gifts
       



       show_users_data.checked = data[0].show_users_data === 0?false:true
       

       control_panel.checked = data[0].control_panel === 0?false:true
       

       remove_messages.checked = data[0].remove_messages === 0?false:true
       

       private.checked = data[0].private === 0?false:true
       

       site_setting.checked = data[0].site_setting === 0?false:true








       



        
    
    
    })

    

}

function UpdatePermissions(name){
    const save_permissions_btn = document.getElementById("save_permissions_btn");

    save_permissions_btn.addEventListener("click",()=>{

        fetch("http://"+window.location.host+"/Updatepermissions",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                name:name,
                power:power.value,
                power_name:power_name.value,
                power_icon:power_icon.value,
                kick:kick.value,
                remove_wall:remove_wall.checked === true ? 1:0,
                notifications:notifications.checked === true ? 1:0,
                change_nickname:change_nickname.checked === true ? 1:0,
                change_users_data:change_users_data.checked === true ? 1:0,
                ban:ban.checked === true ? 1:0,
                ads:ads.value,
                open_private_chat:open_private_chat.checked === true ? 1:0,
                manage_rooms:manage_rooms.checked === true ? 1:0,
                create_rooms:create_rooms.checked === true ? 1:0,
                max_static_rooms:max_static_rooms.value,
                
                manage_users:manage_users.checked === true ? 1:0,
                edit_likes:edit_likes.checked === true ? 1:0,
                manage_subs:manage_subs.checked === true ? 1:0,
                gifts:gifts.value,
                show_users_data:show_users_data.checked === true ? 1:0,
                control_panel:control_panel.checked === true ? 1:0,
                remove_messages:remove_messages.checked === true ? 1:0,
                private:private.checked === true ? 1:0,
                site_setting:site_setting.checked === true ? 1:0,
                


            })
        })
        .then((res) => res.json())
        .then((data) =>{
            if(data.res === "ok"){
                setPermissionData(name)
                alert(data.msg);


            }
        })

    })

   }







edit_username_popup_close_btn.addEventListener("click",()=>{
    edit_username_popup.style.display = "none"
})


function UpdatePower(){


    const powers_update_btn = document.getElementById("powers_update_btn");
    const select_permission = document.getElementById("edit_username_powers");
    powers_update_btn.addEventListener("click",()=>{


        if(select_permission.value){

            fetch("http://"+window.location.host+"/UpdateUserPowers",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:edit_username_name.textContent,
                    power:select_permission.value,

                })
            })
            .then((res) => res.json())
            .then((data) => {

                if(data.msg){
                    alert(data.msg);

                }

                if(data.res === "ok"){
                    edit_username_popup.style.display = 'none'
                    RenderUsersData()
                }


            })

        }


    })
}



function UpdateLikes(){
    const likes_update_btn = document.getElementById("likes_update_btn");

    likes_update_btn.addEventListener("click",()=>{
        const edit_username_likes = document.getElementById("edit_username_likes")


        if(edit_username_likes.value.length > 0){


            fetch("http://"+window.location.host+"/UpdateUserLikes",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:edit_username_name.textContent,
                    likes:edit_username_likes.value,
    
                })
            })
            .then((res) => res.json())
            .then((data) =>{
                if(data.msg){
                    alert(data.msg);

                }

                if(data.res === "ok"){
                    edit_username_popup.style.display = 'none'
                    RenderUsersData()
                }
            })

        }



    })


}


function UpdatePassword(){
    const password_update_btn = document.getElementById("password_update_btn");

    password_update_btn.addEventListener("click",()=>{
        const edit_username_password = document.getElementById("edit_username_password")


        if(edit_username_password.value.length > 0){


            fetch("http://"+window.location.host+"/UpdateUserPasswrod",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:edit_username_name.textContent,
                    password:edit_username_password.value,
    
                })
            })
            .then((res) => res.json())
            .then((data) =>{
                if(data.msg){
                    alert(data.msg);

                }

                if(data.res === "ok"){
                    edit_username_popup.style.display = 'none'
                    edit_username_password.value = ''
                }
            })

        }



    })


}

function DeleteUser(){
    const edit_user_delete_btn = document.getElementById("edit_user_delete_btn");

    edit_user_delete_btn.addEventListener("click",()=>{






            fetch("http://"+window.location.host+"/DeleteUser",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:edit_username_name.textContent,
    
                })
            })
            .then((res) => res.json())
            .then((data) =>{
                if(data.msg){
                    alert(data.msg);

                }

                if(data.res === "ok"){
                    edit_username_popup.style.display = 'none'
                    RenderUsersData()
                    
                }
            })

        



    })


}

function RenderUsersData(){
    fetch("http://"+window.location.host+"/users")
    .then((res) => res.json())
    .then((data) => {
        const history_table = document.getElementById("users_table");

        history_table.innerHTML = `


        `


        data.map((ele) => {
          

            
            const tr = document.createElement("tr");
            let time = ele.date;
            if(ele.date.includes('T')){
                time = ele.date.slice(0,ele.date.indexOf('T'))
            }



            tr.innerHTML =  `
            <td>${ele.username}</td>
            <td>${ele.nickname}</td>
            <td>${ele.ip}</td>
            <td>${ele.device}</td>
            <td>${ele.name}</td>
            <td>54:00:40:35</td>
            <td>${time}</td>
            <td><div class="btn user_setting_btn" data-likes="${ele.likes}" data-username="${ele.username}"><i class="fa-solid fa-gear"></i></div></td>
            
            `
            history_table.appendChild(tr)


        } )




        const user_setting_btns = document.querySelectorAll(".user_setting_btn");
        const user_setting_btns_array = Array.from(user_setting_btns);
        const select_permission = document.getElementById("edit_username_powers");

        user_setting_btns_array.forEach((element)=>{
            element.addEventListener("click",(e)=>{
                
                const username = e.currentTarget.dataset.username

                edit_username_name.textContent = username

                const edit_username_likes = document.getElementById("edit_username_likes");
                edit_username_likes.value = e.currentTarget.dataset.likes

           
                fetch("http://"+window.location.host+"/Basicpermissions")
                .then((res) => res.json())
                .then((datas) => {
                   
    
                    
    
                    
    
                    select_permission.innerHTML = ''
                    
                    datas.map((ele)=>{
                        const option = document.createElement("option");
                        option.value = ele.power
                        if(ele.name === data.find((user)=> user.username === username).name){
                            option.selected = true
                        }
                        option.textContent = `[${ele.power}] ${ele.name}`
                        select_permission.appendChild(option)
                    })
    
                    
    
    
                })
    

                edit_username_popup.style.display = 'flex'


            })
        })

                






    })
}


function Addban(){
    const add_ban_btn = document.getElementById("add_ban_btn");
    const ban_input = document.getElementById('ban_input');

    add_ban_btn.addEventListener("click",()=>{

        if(ban_input.value.length > 0){

            fetch("http://"+window.location.host+"/Addban",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    ban:ban_input.value,

    
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.res){
                    if(data.res === "ok"){
                        RenderBansData();
                        ban_input.value = ''
                        alert(data.msg);



                    }else if(data.res === "bad"){
                        alert(data.msg)
                        
                    }
                }
            })
        }

    })
}


function RenderBansData(){

    fetch("http://"+window.location.host+"/bans")
    .then((res) => res.json())
    .then((data) => {

        if(data.res){
            if(data.res === "bad"){
                document.querySelector(".bans").innerHTML = `<div>${data.msg}</div>`
            }
        }else{

            const history_table = document.getElementById("bans_table");

            history_table.innerHTML = `
    
    
            `
    
    
            data.map((ele) => {
    
    
                
                const tr = document.createElement("tr");
    
    
    
    
                tr.innerHTML =  `
                <td>${ele.username}</td>
                <td>${ele.ban}</td>
                <td>${ele.ban_time}</td>
              
                <td style="padding: 0px;"><div class="btn-red remove_ban_btn"><i class="fa-solid fa-xmark"></i>    <input type="text" hidden value="${ele.id}"></div></td>
            
                
                `
                history_table.appendChild(tr)
    
    
            } )
    
    
            const remove_ban_btns = document.querySelectorAll(".remove_ban_btn");
            const remove_ban_btns_array = Array.from(remove_ban_btns);
    
            remove_ban_btns_array.forEach((ele)=>{
                ele.addEventListener("click",(e)=>{
                    const id = e.currentTarget.children[1].value
                    fetch("http://"+window.location.host+"/removeBan",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body:JSON.stringify({
                            id:id
    
                        })
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if(data.res === 'ok'){
                            alert(data.msg)
                            RenderBansData()
                        }
                    })
                })
            })

        }



    })            

}



function RenderFilterData(){

    fetch("http://"+window.location.host+"/filter")
    .then((res) => res.json())
    .then((data)=>{
        const words = document.querySelector(".words");

        words.innerHTML = ''


        data.map((ele)=>{
            const words_card = document.createElement("div")
            words_card.className = 'words_card'
            words_card.innerHTML =
            `
            <div class="flex">
            <div class="bg-blue">الكلمه</div>
            <div class="filtered_word">${ele.word}</div>
            </div>
            <div class="info">
                <div>${ele.word}</div>
                <div>user: ${ele.username}</div>
                <div>IP: ${ele.ip}</div>
            </div>  

            `

            words.appendChild(words_card)

            
            
            

        })

    })

    fetch("http://"+window.location.host+"/filterWords")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        const history_table = document.getElementById("filter_table");

        history_table.innerHTML = `


        `


        data.map((ele) => {


            
            const tr = document.createElement("tr");




            tr.innerHTML =  `
                        <td>${ele.category}</td>
                        <td>${ele.word}</td>
                        <td><div class="btn-red remove_filter_btn" data-id='${ele.id}'><i class="fa-solid fa-xmark"></i></div></td>
        
            
            `
            history_table.appendChild(tr)


        } )

        RemoveFilterWord();


    })   


}


function AddAllowedFilter(){

    const add_allowed_btn = document.getElementById("add_allowed_btn");

    add_allowed_btn.addEventListener("click",()=>{

        if(filter_input.value.length > 0){

            fetch("http://"+window.location.host+"/AddFilterWord",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    filter:filter_input.value,
                    category:'مسموحة'
    
                })
            }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.res === 'ok'){

                    RenderFilterData();
                    filter_input.value = ''
                    alert(data.msg)

                }
            })

        }


        
    })


}

function AddForbiddenFilter(){

    const add_forbidden_btn = document.getElementById("add_forbidden_btn");

    add_forbidden_btn.addEventListener("click",()=>{

        if(filter_input.value.length > 0){

            fetch("http://"+window.location.host+"/AddFilterWord",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    filter:filter_input.value,
                    category:'ممنوعة'
    
                })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.res === 'ok'){
                    filter_input.value = ''
                    RenderFilterData();
                    alert(data.msg);

                }
            })

        }


        
    })


}

function AddWarnFilter(){

    const add_warn_btn = document.getElementById("add_warn_btn");

    add_warn_btn.addEventListener("click",()=>{


        if(filter_input.value.length > 0){

            fetch("http://"+window.location.host+"/AddFilterWord",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    filter:filter_input.value,
                    category:'مراقبة'
    
                })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.res === 'ok'){

                    RenderFilterData();
                    filter_input.value = ''
                    alert(data.msg)

                }
            })

        }


        
    })


}

function RemoveFilterWord(){

    const remove_filter_btns = document.querySelectorAll(".remove_filter_btn");
    const remove_filter_btns_array = Array.from(remove_filter_btns);

    remove_filter_btns_array.forEach((ele)=>{

        ele.addEventListener("click",(e)=>{


            fetch("http://"+window.location.host+"/RemoveFilterWord",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    id:e.currentTarget.dataset.id,
    
                })
            })
            .then((res) => res.json())
            .then((data) =>{
                if(data.res === 'ok'){
                    RenderFilterData();
                    alert(data.msg);

                }
            })


        })


    })


}


function RenderShortcutsData(){

    fetch("http://"+window.location.host+"/shortcuts")
    .then((res) => res.json())
    .then((data) => {
        const history_table = document.getElementById("shortcuts_table");

        history_table.innerHTML = `


        `


        data.map((ele) => {


            
            const tr = document.createElement("tr");




            tr.innerHTML =  `
            <td>${ele.shortcut}</td>
            <td>${ele.word}</td>
            <td><div class="btn-red remove_shortcut_btn"  data-id='${ele.id}'><i class="fa-solid fa-xmark"></i></div></td>
        
            
            `
            history_table.appendChild(tr)


        } )

        RemoveShortcut();




    }) 

}

function AddShortcut(){
    const shortcut_input = document.getElementById("shortcut_input");
    const shortcut_word_input = document.getElementById("shortcut_word_input");

    const add_shortcut_btn = document.getElementById("add_shortcut_btn");


    add_shortcut_btn.addEventListener("click",()=>{
        add_shortcut_btn.disabled = true;

        if(shortcut_input.value.length > 0 && shortcut_word_input.value.length > 0){

            fetch("http://"+window.location.host+"/AddShortcut",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    shortcut:shortcut_input.value,
                    word:shortcut_word_input.value
                
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.res === 'ok'){
                    shortcut_input.value = '';
                    shortcut_word_input.value = '';
                    RenderShortcutsData();

                    alert(data.msg);


                }
            })



        }


    })


}


function RemoveShortcut(){


            
    const remove_shortcut_btns = document.querySelectorAll(".remove_shortcut_btn");
    const remove_shortcut_btns_array = Array.from(remove_shortcut_btns);

    remove_shortcut_btns_array.forEach((ele)=>{
        ele.addEventListener("click",(e)=>{
            console.log(e.currentTarget.dataset.id);


            fetch("http://"+window.location.host+"/RemoveShortcut",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    id:e.currentTarget.dataset.id
                
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.res === 'ok'){
                    RenderShortcutsData();
                    alert(data.msg);

                }
            })



        })
    })


}

function RenderSubsData(){

    fetch("http://"+window.location.host+"/subs")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        const history_table = document.getElementById("subs_table");

        history_table.innerHTML = `


        `


        data.map((ele) => {
            

            const tr = document.createElement("tr");




            tr.innerHTML =  `
            <td> [${ele.power}] ${ele.name}</td>
            <td>${ele.username}</td>
            <td>${ele.nickname}</td>
            <td>${ele.period}</td>
            <td>${ele.days_left}</td>
            <td><div class="btn remove_sub_btn" data-id='${ele.id}' data-name='${ele.username}'><i class="fa-solid fa-xmark"></i></div></td>
        
            
            `
            history_table.appendChild(tr)


        } )

        const remove_sub_btns = document.querySelectorAll(".remove_sub_btn");
        const remove_sub_btns_array = Array.from(remove_sub_btns);

        remove_sub_btns_array.forEach((ele)=>{
            ele.addEventListener("click",(e)=>{

                fetch("http://"+window.location.host+"/RemoveSub",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body:JSON.stringify({
                        id:e.currentTarget.dataset.id,
                        name:e.currentTarget.dataset.name
                    
                    })
                })
                .then((res) => res.json())
                .then((data) =>{
                    if(data.res === 'ok'){

                        alert(data.msg);
                        RenderSubsData();
                    }
                })
            })
        })


    })            


}



function AddWelcomeMessage(){
    const Add_welcome_message_btn = document.getElementById("Add_welcome_message_btn");

    Add_welcome_message_btn.addEventListener("click",()=>{
        if(messages_msg.value.length > 0 && messages_title.value.length > 0){

            fetch("http://"+window.location.host+"/AddCPmessages",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    category:'الترحيب',
                    title:messages_title.value,
                    message:messages_msg.value

    
                })
            })
            .then((res) => res.json())
            .then((data) =>{
                if(data.res === 'ok'){
                    messages_msg.value = '';
                    messages_title.value = '';
                    RenderMessages();
                    alert(data.msg);

                }
            })

        }
    })

}

function AddDailyMessage(){
    const Add_daily_message_btn = document.getElementById("Add_daily_message_btn");

    Add_daily_message_btn.addEventListener("click",()=>{
        if(messages_msg.value.length > 0 && messages_title.value.length > 0){

            fetch("http://"+window.location.host+"/AddCPmessages",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body:JSON.stringify({
                    category:'يومية',
                    title:messages_title.value,
                    message:messages_msg.value

    
                })
            })
            .then((res) => res.json())
            .then((data) =>{
                if(data.res === 'ok'){
                    messages_msg.value = '';
                    messages_title.value = '';
                    RenderMessages();
                    alert(data.msg);

                }
            })

        }
    })

}


function RenderMessages(){

    fetch("http://"+window.location.host+"/CPmessages")
    .then((res) => res.json())
    .then((data) => {
        const history_table = document.getElementById("messages_table");

        history_table.innerHTML = `


        `


        data.map((ele) => {


            const tr = document.createElement("tr");




            tr.innerHTML =  `
            <td>${ele.category}</td>
            <td>${ele.title}</td>
            <td>${ele.message}</td>
            <td><div class="btn-red remove_msg_btn" data-id='${ele.id}'><i class="fa-solid fa-xmark"></i></div></td>
        
            
            `
            history_table.appendChild(tr)


        } )








        const remove_msg_btns = document.querySelectorAll(".remove_msg_btn");
        const remove_msg_btns_array = Array.from(remove_msg_btns);

        remove_msg_btns_array.forEach((ele)=>{
            ele.addEventListener("click",(e)=>{


                
                fetch("http://"+window.location.host+"/RemoveCPmessages",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body:JSON.stringify({
                        id:e.currentTarget.dataset.id,
        
                    })
                })
                .then((res) => res.json())
                .then((data) =>{
                    if(data.res === 'ok'){
                        alert(data.msg);
                        RenderMessages();
                    }
                })
                
            })
        })


    })  

}


function RenderManagement(){
    fetch("http://"+window.location.host+"/management")
    .then((res) => res.json())
    .then((data) => {


       

        site_name.value = data[0].site_name;
        site_title.value = data[0].site_title;
        site_description.value = data[0].site_description;
        tags.value = data[0].tags;
        javascript_code.value = data[0].javascript_code;


        theme_color.value = data[0].theme_color;
        content_color.value = data[0].content_color;
        buttons_color.value = data[0].buttons_color;


        message_time.value = data[0].message_time;
        wall_time.value = data[0].wall_time;
        wall_messages_time.value = data[0].wall_messages_time;


        allow_guests.checked = data[0].allow_guests === 1? true:false;
        allow_subs.checked = data[0].allow_subs === 1? true:false;
        reconnection.checked = data[0].reconnection === 1? true:false;


        private_chat_number.value = data[0].private_chat_number;
        notifications_number.value = data[0].notifications_number;
        send_pics_number.value = data[0].send_pics_number;





        


    })      

}


function UpdateManagement(){
    const update_management_btn = document.getElementById('update_management_btn');

    update_management_btn.addEventListener("click",()=>{

        fetch("http://"+window.location.host+"/UpdateManagement",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify({
                site_name:site_name.value,
                site_title:site_title.value,
                site_description:site_description.value,
                tags:tags.value,
                javascript_code:javascript_code.value,
                theme_color:theme_color.value,
                content_color:content_color.value,
                buttons_color:buttons_color.value,
                message_time:message_time.value,
                wall_time:wall_time.value,
                wall_messages_time:wall_messages_time.value,
                allow_guests:allow_guests.checked === true ? 1:0,
                allow_subs:allow_subs.checked === true ? 1:0,
                reconnection:reconnection.checked === true ? 1:0,
                private_chat_number:private_chat_number.value,
                notifications_number:notifications_number.value,
                send_pics_number:send_pics_number.value,
            
            })
        })
        .then((res) => res.json())
        .then((data) =>{
            console.log(data);
            if(data.res === "ok"){
                RenderManagement();
                alert(data.msg);


            }
        })
        
    })
}