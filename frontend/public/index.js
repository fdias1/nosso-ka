const apiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/'
const buttonContainer = document.getElementById('button-container')
const form = document.getElementsByClassName('form-container')[0]
let summary = false

const formSubmit = async (endpoint, username, value) => {
    value.replace(",", ".")
    const floatValue = parseFloat(value).toFixed(2)
    await fetch(apiAddress+endpoint, {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: `{ "username":"${username}","value":${floatValue}}`
    })
    refreshCardsAndForm()
}

const generateSummary = async () => {
    userData = await getApiData()
    let gasTotal = 0
    let kmTotal = 0 
    userData.forEach(user => {
        gasTotal += user.gas
        kmTotal += user.km
        console.log(gasTotal,kmTotal,user.gas,user.km)
    })
    if ( kmTotal > 0 && gasTotal > 0 ) {
        userData.forEach(async user => {
            user.balance = user.gas - (gasTotal/kmTotal * user.km)
            user.balance = user.balance.toFixed(2)
            console.log(user.username,user.balance)
            await formSubmit('updatebalance', user.username, user.balance)
        })
        await fetch(apiAddress+"reset")
        refreshCardsAndForm()
    }
}

const getApiData = async () => {
    const userdata = await (await fetch(apiAddress+'get')).json()
    return userdata
}

const refreshCardsAndForm = async () => {
    const apiData = await getApiData()
    const select = document.getElementById('username')
    select.innerHTML = ''
    const usersContainer = document.getElementsByClassName('users-container')[0]
    usersContainer.innerHTML = '<ul class="all-users-data-container"></ul>'
    const cardsContainer = document.getElementsByClassName('all-users-data-container')[0]
    const loadingText = document.createElement('p')
    loadingText.classList.add('feedback-text')
    loadingText.innerHTML = "Carregando..."
    cardsContainer.appendChild(loadingText)
    apiData.forEach(user => {
        console.log(user)
        const username = user.username
        const balance = user.balance
        const km = user.km
        const gas = user.gas
        const card = document.createElement('li')
        card.classList.add('user-data-container')
        card.innerHTML = 
        `<h1 class="username">
        ${username}
        </h1>
        <p class="title">
        Km rodado em aberto: 
        </p>
        <p class="value">
        ${km.toFixed(2)} Km 
        </p>
        <p class="title">
        Abastecimento em aberto: 
        </p>
        <p class="value">
        R$ ${gas.toFixed(2)} 
        </p>
        <p class="title">
        Saldo: 
        </p>
        <p class="value" style="font-weight: bold; color:${balance < 0 ? 'red' : 'green'}">
        R$ ${balance.toFixed(2)}
        </p>`
        cardsContainer.appendChild(card)
        const option = document.createElement('option')
        option.innerHTML = username
        select.appendChild(option)
    })
    cardsContainer.removeChild(loadingText)
}

    const kmButton = document.getElementById('km-button')
    kmButton.onclick = event => {
        const form = document.getElementsByClassName('form-container')[0]
    form.style.display='flex'
    buttonContainer.style.display='none'
    const formTitle = document.getElementsByClassName('form-title')[0]
    formTitle.innerHTML = 'Registrar Km Rodado'
    activeOption = 'addkm'
}

const gasButton = document.getElementById('gas-button')
gasButton.onclick = event => {
    form.style.display='flex'
    buttonContainer.style.display='none'
    const formTitle = document.getElementsByClassName('form-title')[0]
    formTitle.innerHTML = 'Registrar Abastecimento'
    activeOption = 'addgas'
}

const summaryButton = document.getElementById('summary-button')
summaryButton.onclick = event => {
    form.style.display='flex'
    buttonContainer.style.display='none'
    
    const formTitle = document.getElementsByClassName('form-title')[0]
    formTitle.innerHTML = 'Fechar a conta (Tanque Cheio)'
    activeOption = 'addgas'
    summary=true
}

const resetButton = document.getElementById('reset-button')
resetButton.onclick = async event => {
    await fetch(apiAddress+'resetBalance')
    refreshCardsAndForm()
}

const cancelButton = document.getElementById('form-cancel')
cancelButton.onclick = event => {
    form.style.display='none'
    buttonContainer.style.display='flex'
    document.getElementById('value').value = ""
    summary=false
}

const submitButton = document.getElementById('form-submit')
submitButton.onclick = async event => {
    buttonContainer.style.display='flex'
    form.style.display='none'
    await formSubmit(activeOption,document.getElementById('username').value,document.getElementById('value').value)
    buttonContainer.style.display='flex'
    document.getElementById('value').value = ""
    if(summary) {
        generateSummary()
    }
}

refreshCardsAndForm()