console.log('login page script')
document.getElementById('feedback-msg').style.display = 'none'

if(localStorage.username) {
    location.replace('../../index.html')
}

const apiAddress = 'http://localhost:5001/nosso-ka/us-central1/app/users/login'
const loginForm = document.getElementById('login-form')
loginForm.onsubmit = async event => {
    event.preventDefault()
    document.getElementById('feedback-msg').style.display = 'none'
    const username = document.getElementById('username').value
    const response = await (await fetch(apiAddress+`/${username}`)).json()

    if(response) {
        localStorage.username = username
        location.replace('../../index.html')
    } else {
        localStorage.removeItem('username')
        document.getElementById('feedback-msg').style.display = 'block'
    }

}