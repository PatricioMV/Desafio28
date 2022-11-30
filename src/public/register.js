console.log('entro en register.js')

let registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', e => {
    e.preventDefault()
    let obj = {}
    let data = new FormData(registerForm)
    data.forEach((value, key) => obj[key]=value)
    console.log(JSON.stringify(obj))
    fetch('/register', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
})