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
const buttons = [...document.getElementsByTagName('button')]
buttons.forEach(button => {
    button.onclick = () => buttonClick(button.getAttribute('link-to'))
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

async function loadHistory() {
    const contend = document.getElementById('contend-container')
    const load = document.getElementById('load')
    contend.style = 'display:none;'

    document.getElementById('history-container').innerHTML = ''
    const data = await getData()
    const userData = data.allUsersData
    const entries = data.openEntriesData
    entries
    .filter(entry => entry.type != 'balance')
    .sort((a,b) => b.date._seconds - a.date._seconds)
    .forEach((entry,index) =>{ 
        const temp = generateHistoryEntry(entry,userData,index)
        document.getElementById('history-container').innerHTML = document.getElementById('history-container').innerHTML + temp
    })
    contend.style=''
    load.parentNode.removeChild(load)

}

function generateHistoryEntry(entry,userData,index) {
    const name = userData.filter(user => user.username == entry.username)[0].name
    const historyId = `history${index}`
    const date = new Intl.DateTimeFormat('pt-BR').format(new Date(entry.date._seconds*1000))
    let backgroundClass = ''
    let abbrev = ''
    let value = ''
    let type = ''
    
    if (entry.type == 'gas') {
        backgroundClass = 'bg-gas'
        abbrev = 'G'
        value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)
        type = 'Abastecimento'
    }
    if (entry.type == 'km') {
        backgroundClass = 'bg-km'
        abbrev = 'R'
        value = new Intl.NumberFormat('pt-BR', { style: 'unit', unit: "kilometer",maximumFractionDigits:2 }).format(entry.value)
        type = 'Rodagem'
    } 
    if (entry.type == 'balance') {
        if (entry.value.indexOf('-') == -1){
            backgroundClass = 'bg-balance-positivo'
        } else {
            backgroundClass = 'bg-balance-negativo'
        }
        abbrev = 'B' 
        value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)
        type = 'Balanço'
    }

    return (
        `<div class="fluid-container mb-1">
            <a class="text-reset text-decoration-none" data-toggle="collapse" href="#${historyId}">
                <div class="row rounded ${backgroundClass} py-1">
                    <div class="col-5 text-left font-weight-bold">
                        ${name}
                    </div>
                    <div class="col-2 text-center">
                        ${abbrev}
                    </div>
                    <div class="col-5 text-right">
                        ${value}
                    </div>
                </div>
            </a>
            <div class="collapse row" id="${historyId}">
                <div class="card card-body bg-light mb-0 pb-0">
                    <p class="mb-0">
                        <div class="row">
                            Data: ${date}
                        </div>
                        <div class="row">
                            Tipo: ${type}
                        </div>
                    </p>
                </div>
            </div>
        </div>`
    )
}

loadHistory()