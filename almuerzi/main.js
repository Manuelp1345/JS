let mealsState = []
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
        return
        }
    const ordenes = {
        meal_id: mealsIdValues,
        user_id: 'Manuel Puente',
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
}
window.onload = ()=>{
    const loginForm = document.getElementById("login-form")
    loginForm.onsubmit= (e)=>{
        e.preventDefault()
        const userName = document.getElementById("user").value
        const password = document.getElementById("pass").value
        fetch("https://almuerzi.manuelp1345.vercel.app/api/auth/login",
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userName, password})
        }).then(x =>x.json())
        .then(respuesta => {
            localStorage.setItem("token", respuesta.token)
            ruta = "orders"
        })
    }






/*     inicializaForm()
    inicializaDatos() */

}