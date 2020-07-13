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

async function loadAllProfiles() {
    const tela = document.getElementById('contend-container')
    tela.style = 'display:none'

    const data = await getData()
    const users = data.allUsersData
    const openData = data.openEntriesData

    users.forEach(user => {

        const myKm  = openData
        .filter(entry => entry.username == user.username)
        .filter(entry => entry.type == 'km' )
        .reduce((total,entry) => parseFloat(entry.value)+total,0)

        const myGas = openData
        .filter(entry => entry.username == user.username)
        .filter(entry => entry.type == 'gas')
        .reduce((total,entry) => parseFloat(entry.value)+total,0)

        const myBal = openData
        .filter(entry => entry.username == user.username)
        .filter(entry => entry.type == 'balance')
        .reduce((total,entry) => parseFloat(entry.value)+total,0)
        const newElement = `
        <div class="row">
            <div class="col-12 my-1 p-2 border border-secondary rounded">
                <p class="h3">${user.name}:</p>
                <div>km: ${new Intl.NumberFormat('pt-BR', { style: 'unit', unit: "kilometer",maximumFractionDigits:2 }).format(myKm)}</div>
                <div>Gas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(myGas)}</div>
                <div>Balance: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(myBal)}</div>
            </div>
        </div>`
        const placeholder = document.querySelector('#json')
        placeholder.innerHTML = placeholder.innerHTML + newElement
        console.log(`\n${user.name}:\nkm: ${myKm}\nGas: ${myGas}\nBalance: ${myBal}`)
    })    

    const load = document.getElementById('load')
    load.style = 'display:none'
    tela.style=""

}
    
loadAllProfiles()
