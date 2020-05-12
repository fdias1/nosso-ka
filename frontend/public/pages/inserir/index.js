const getAllUsersApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/users/getall'
const getAllEntriesApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/entry/query'
const newEntryApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/entry/new'
const closeEntriesApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/summary/'

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
const buttons = [...document.getElementsByTagName('button')]
buttons.forEach(button => {
    if (button.hasAttribute('link-to')){
        button.onclick = () => buttonClick(button.getAttribute('link-to'))
    }
})

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

async function updateForm() {
    const contend = document.getElementById('contend-container')
    const load = document.getElementById('load')
    contend.style = 'display:none;'
    
    const data = await getData()
    data.allUsersData.forEach(user => {
        const newOption = document.createElement('option')
        newOption.innerHTML = user.name
        newOption.setAttribute('value',user.username)
        document.getElementById('username').appendChild(newOption)
    })

    contend.style=''
    load.style='display:none;'
}

async function newEntry() {
    const form = document.forms[0]
    const km = document.getElementById('km-label')
    const gas = document.getElementById('gas-label')
    const balance = document.getElementById('balance-label')

    let type = ''
    if (km.classList.contains('active')) {
        type = 'km'
    } else {
        type = 'gas'
    }

    const value = form.valor.value
    const username = form.username.value

    if (form.valor.value != '' && (km.classList.contains('active') || gas.classList.contains('active') || balance.classList.contains('active') )) {
        const result = await (await fetch(newEntryApiAddress,{ 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: `{ "value":"${value}","username":"${username}","type":"${type}" }`
        })).json()
        return result
    }
    return null
}

document.forms[0].onsubmit = async event => {
    event.preventDefault()
    const contend = document.getElementById('contend-container')
    const load = document.getElementById('load')

    contend.style = 'display:none;'
    load.style=''

    const resp = await newEntry()
    if (resp) {
        const balance = document.getElementById('balance-label')
        if (balance.classList.contains('active')) {
            const summaryResponse = await summary()
        } else {
            buttonClick('inserir-sucesso')
        }

    } else {
        contend.style=''
        load.style='display:none;'
    }
}

async function summary() {
    const data = await getData()
    const openEntries = data.openEntriesData
    const users = data.allUsersData.reduce((array,user) => {
        array.push(user.username)
        return array
    },[])
    const openKm = openEntries.filter(entry => entry.type == 'km').reduce((total,entry) => parseFloat(entry.value) + total,0)
    const openGas = openEntries.filter(entry => entry.type == 'gas').reduce((total,entry) => parseFloat(entry.value) + total,0)
    const userCards = users.reduce((array,user) => {
        array.push({
            username:user,
            km:openEntries
            .filter(entry => entry.type == 'km')
            .filter(entry => entry.username == user)
            .reduce((total,entry) => parseFloat(entry.value) + total,0),
            gas:openEntries
            .filter(entry => entry.type == 'gas')
            .filter(entry => entry.username == user)
            .reduce((total,entry) => parseFloat(entry.value) + total,0)
        })
        return array
    },[])
    await userCards.forEach(async card => {
        card.balance = card.gas - (card.km / openKm) * openGas
        if (card.balance!=0){
            const result = await (await fetch(newEntryApiAddress,{ 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: `{ "value":"${card.balance}","username":"${card.username}","type":"balance" }`
                })).json()
            }
        }
    )

    let result 
    result = await fetch(closeEntriesApiAddress+'gas')
    result = await fetch(closeEntriesApiAddress+'km')
    buttonClick('inserir-sucesso')

}

updateForm()
