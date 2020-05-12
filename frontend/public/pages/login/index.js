console.log('login page script')
document.getElementById('feedback-msg').style.display = 'none'

if(localStorage.username) {
    location.replace('../../index.html')
}

const loginEndpoint = 'https://us-central1-nosso-ka.cloudfunctions.net/app/users/login'
const loginForm = document.getElementById('login-form')
loginForm.onsubmit = async event => {
    event.preventDefault()
    document.getElementById('feedback-msg').style.display = 'none'
    const username = document.getElementById('username').value
    const response = await (await fetch(loginEndpoint+`/${username}`)).json()

    if(response) {
        localStorage.username = username
        location.replace('../../index.html')
    } else {
        localStorage.removeItem('username')
        document.getElementById('feedback-msg').style.display = 'block'
    }

}