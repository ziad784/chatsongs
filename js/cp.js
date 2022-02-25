const lists = document.querySelector(".lists").children
const lists_array = Array.from(lists);

const datas = document.querySelectorAll(".data");
const datas_array = Array.from(datas);


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

        



    })
})

