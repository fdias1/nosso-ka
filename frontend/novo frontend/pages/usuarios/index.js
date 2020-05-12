const buttons = [...document.getElementsByTagName('button')]
buttons.forEach(button => {
    button.onclick = () => buttonClick(button.getAttribute('link-to'))

})

function buttonClick(path) {
    location.href = `../${path}/index.html`
}

