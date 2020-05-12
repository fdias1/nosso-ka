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

function buttonClick(path) {
    location.href = `../${path}/index.html`
}
