let mealsState = []
let user ={}
let ruta = "login"//login,register,orders
const stringToHTML = (s)=>{
    const parser = new DOMParser()
    const doc = parser.parseFromString(s,"text/html")
    return doc.body.firstChild
}
const renderItem = (item)=>{
    const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`)
    element.addEventListener("click", () => {
        const mealsLis = document.getElementById("meals-list")
        Array.from( mealsLis.children).forEach(x=> x.classList.remove("selected"))
        element.classList.add("selected")
        const mealsIDinput = document.getElementById("mealsid")
        mealsIDinput.value = item._id
    })
    return element
}
const rendersOrder= (order, meals) =>{
    const meal = meals.find(meal => meal._id === order.meal_id)
    const element = stringToHTML(`<li data-id="${order._id}">${meal.name} - ${order.user_id}</li>`)
    return element
}
const inicializaForm = ()=>{
    const form = document.getElementById("order")
    form.onsubmit = (e) =>{
        e.preventDefault()
        const btn = document.getElementById("btn")
        btn.setAttribute("disabled",true)
        const mealsID = document.getElementById("mealsid")
        const mealsIdValues = mealsID.value
        if(!mealsIdValues){
            alert("Selecciona un platillo")
            btn.removeAttribute("disabled")
        return
        }
    const ordenes = {
        meal_id: mealsIdValues,
        user_id: user.email,
    }
    fetch("https://almuerzi-grsqh0moh.vercel.app/api/orders",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordenes)
    })
    .then(x => x.json() )
    .then(respuesta => {
            const renderorder = rendersOrder(respuesta, mealsState)
            const ordersList = document.getElementById("orders-list")
            ordersList.appendChild(renderorder)
            btn.removeAttribute("disabled")
        })
    }
}
const inicializaDatos = ()=>{
    fetch("https://almuerzi-grsqh0moh.vercel.app/api/meals")
    .then(response => response.json())
    .then(data =>{
        mealsState = data
        const mealsLis = document.getElementById("meals-list")
        const btn = document.getElementById("btn")
        const listItems = data.map(renderItem)
        mealsLis.removeChild(mealsLis.firstElementChild)
        listItems.forEach(element => mealsLis.appendChild(element))
        btn.removeAttribute("disabled")
        fetch("https://almuerzi-grsqh0moh.vercel.app/api/orders")
        .then(response => response.json())
        .then(ordersData =>{
            const ordersList = document.getElementById("orders-list")
            const listOrders = ordersData.map(orderData => rendersOrder(orderData,data))
            ordersList.removeChild(ordersList.firstElementChild)
            listOrders.forEach(element => ordersList.appendChild(element))
        })
    })
}
const renderApp = () =>{
    const token = localStorage.getItem("token")
    if(token){
    user = JSON.parse(localStorage.getItem("user"))
        return renderOrdens()
    }
    renderLogin()
    renderregistro()
}
const renderOrdens = () =>{
    const ordersview = document.getElementById("orders-view")
    document.getElementById("app").innerHTML = ordersview.innerHTML
    inicializaForm()
    inicializaDatos()
}
const renderLogin= ()=>{
    const loginTemplate = document.getElementById("login")
    document.getElementById("app").innerHTML = loginTemplate.innerHTML
    const loginForm = document.getElementById("login-form")
    loginForm.onsubmit= (e)=>{
        e.preventDefault()
        const email = document.getElementById("user").value
        const password = document.getElementById("pass").value
        fetch("https://almuerzi.manuelp1345.vercel.app/api/auth/login",
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        }).then(x =>x.json())
        .then(respuesta => {
            localStorage.setItem("token", respuesta.token)
            ruta = "orders"
            return respuesta.token
        })
        .then(token=>{
            return fetch("https://almuerzi.manuelp1345.vercel.app/api/auth/me",{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            })
        })
        .then(x=> x.json())
        .then(fetchuser=> {
            localStorage.setItem("user", JSON.stringify(fetchuser))
            user = fetchuser
            renderOrdens()
        })
    }
}
const renderregistro = ()=>{
    const registro = document.getElementById("reg")
    registro.onclick = ()=>{
        const registerTemplate = document.getElementById("register")
        document.getElementById("app").innerHTML = registerTemplate.innerHTML
        const registerForm = document.getElementById("register-form")
        const volver = document.getElementById("volver")
        volver.onclick = ()=> renderLogin()
        registerForm.onsubmit= (e)=>{
            e.preventDefault()
            const email = document.getElementById("user").value
            const password = document.getElementById("pass").value
            if((email == "")||(password == "")){
                document.getElementById("msg").innerHTML= '<p class="error">Ingrese un Correo y una Contraseña</p>'
            }else{
            fetch("https://almuerzi.manuelp1345.vercel.app/api/auth/register",
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password})
            })
            .then(x =>x.json())
            .then(respuesta => {
                if(respuesta == true){
                    document.getElementById("msg").innerHTML= '<p class="exito">Usuario creado con exito</p>'
                    }else{
                    document.getElementById("msg").innerHTML= '<p class="error">El usuario ya existe</p>'
                    }
                })
            }
        }
    }
}
window.onload = ()=>{
    renderApp()
}
