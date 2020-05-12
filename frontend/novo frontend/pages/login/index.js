const form = document.getElementById('login-form')
const myAuthApiAddress = 'https://us-central1-nosso-ka.cloudfunctions.net/app/users/login/'
document.forms[0].onsubmit = async function formSubmit (event) {
    event.preventDefault()
    document.getElementById('feedback-msg').innerHTML = ''
    const usuario = form.usuario.value
    await login(usuario)
}

async function login (username) {

    const myAuth = await (await fetch(myAuthApiAddress+username)).json()
    console.log(myAuth)

    if(myAuth.ok) {
        localStorage.username = username
        redirect('home')   
        console.log('logado!') 
    } else {
        document.getElementById('feedback-msg').innerHTML = myAuth.message
    }
}

function redirect(path) {
    location.href = `../${path}/index.html`
}