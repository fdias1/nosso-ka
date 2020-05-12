const getAllUsersApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/users/getall'
const getAllEntriesApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/entry/query'

/**
 * Session control
 */
if(!localStorage.getItem('username')) {
    buttonClick('login')
}

/**
 * Navigation Control
 */
function buttonClick(path) {
    location.href = `../${path}/index.html`
}
/**
 * Get data
 */
async function getData() {
    const username = localStorage.getItem('username')
    const allUsersData = await (await fetch(getAllUsersApiAddress)).json()
    const historyData = await (await fetch(getAllEntriesApiAddress,{ 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: `{}`
    })).json()
    const openEntriesData = historyData.filter(entry => entry.active == true)
    return ({
        username,
        allUsersData,
        historyData,
        openEntriesData
    })
}

const buttons = [...document.getElementsByTagName('button')]
buttons.forEach(button => {
    button.onclick = () => buttonClick(button.getAttribute('link-to'))
})

async function loadProfile() {
    const tela = document.getElementById('contend-container')
    tela.style = 'display:none'

    const data = await getData()
    const name = document.getElementById('name')
    const km = document.getElementById('km')
    const gas = document.getElementById('gas')
    const balance = document.getElementById('balance')

    const userData = data.allUsersData
    const entries = data.historyData
    
    const myName = userData
    .filter(user => user.username == localStorage.getItem('username'))[0].name

    const myKm  = entries
    .filter(entry => entry.username == localStorage.getItem('username'))
    .filter(entry => entry.type == 'km' )
    .filter(entry => entry.active == true)
    .reduce((total,entry) => {
        console.log(entry,entry.value,total)    
        return parseFloat(entry.value)+total
    },0)

    const myGas = entries
    .filter(entry => entry.username == localStorage.getItem('username'))
    .filter(entry => entry.type == 'gas')
    .filter(entry => entry.active == true)
    .reduce((total,entry) => parseFloat(entry.value)+total,0)

    const myBal = entries
    .filter(entry => entry.username == localStorage.getItem('username'))
    .filter(entry => entry.type == 'balance')
    .filter(entry => entry.active == true)
    .reduce((total,entry) => parseFloat(entry.value)+total,0)
    
    name.innerHTML = myName
    km.innerHTML = new Intl.NumberFormat('pt-BR', { style: 'unit', unit: "kilometer",maximumFractionDigits:2 }).format(myKm)
    gas.innerHTML = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(myGas)
    balance.innerHTML = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(myBal)

    if (balance.innerHTML.indexOf('-')==-1) {
        balance.classList.add('text-success')
    } else {
        balance.classList.add('text-danger')

    }

    const load = document.getElementById('load')
    load.parentNode.removeChild(load)
    tela.style=""

}
    
loadProfile()
