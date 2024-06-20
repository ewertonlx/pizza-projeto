const dqs = el => document.querySelector(el);
const dqsall = el => document.querySelectorAll(el);
let qtdPizzas = 1;
let cart = []
let modalKey;
pizzaJson.map((item, index) => {
    let pizzaItem = dqs('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--img').innerHTML = `<img src="${item.img}" />`

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key
        qtdPizzas = 1

        dqs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        dqs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        dqs('.pizzaBig img').src = pizzaJson[key].img
        dqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        dqs('.pizzaInfo--size.selected').classList.remove('selected')
        dqsall('.pizzaInfo--size').forEach((item, index) => {
            if(index === 2){
                item.classList.add('selected')
            }
            item.querySelector('span'). innerHTML = pizzaJson[key].sizes[index]
        })
        dqs('.pizzaInfo--qt').innerHTML = qtdPizzas


        dqs('.pizzaWindowArea').style.opacity = 0
        dqs('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            dqs('.pizzaWindowArea').style.opacity = 1
        },120)
    })
    dqs('.pizza-area').append(pizzaItem)
})

dqsall('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((e) => {
    e.addEventListener('click', fecharModal)
})

dqs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(qtdPizzas < 2) return;
    qtdPizzas--
    dqs('.pizzaInfo--qt').innerHTML = qtdPizzas
})
dqs('.pizzaInfo--qtmais').addEventListener('click', () => {
    qtdPizzas++
    dqs('.pizzaInfo--qt').innerHTML = qtdPizzas
})

dqsall('.pizzaInfo--size').forEach((item, index) => {
    item.addEventListener('click', (e) => {
        dqs('.pizzaInfo--size.selected').classList.remove('selected')
        e.currentTarget.classList.add('selected')
    })
})

dqs('.pizzaInfo--addButton').addEventListener('click', () => {
    let tamanho = parseInt(dqs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let ident = pizzaJson[modalKey].id+'@'+tamanho
    let key = cart.findIndex((item) => item.ident === ident)
    if(key > -1){
        cart[key].qtd += qtdPizzas
    } else {
        cart.push({ident ,id: pizzaJson[modalKey].id, size: tamanho, qtd: qtdPizzas})
    }
    updateCart()
    fecharModal()
})

function fecharModal(){
    dqs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        dqs('.pizzaWindowArea').style.display = 'none'
    },500)
}
dqs('.menu-openner').addEventListener('click', () => {
    if(cart.length < 1) return
    dqs('aside').style.left = '0'
})
dqs('.menu-closer').addEventListener('click', () => {
    dqs('aside').style.left = '100vh'
})
function updateCart(){
    dqs('.menu-openner').innerHTML = `<span>${cart.length}</span> 🛒`
    if(cart.length > 0){
        dqs('aside').classList.add('show');
        dqs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id)
            subtotal += pizzaItem.price * cart[i].qtd

            let cartItem = dqs('.models .cart--item').cloneNode(true);
            let pizzaSize = cart[i].size === 0 ? 'P' : cart[i].size === 1 ? 'M' : 'G'
            let pizzas = `${pizzaItem.name} (${pizzaSize})` 
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzas;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qtd++
                updateCart()
            })
            dqs('.cart').append(cartItem)
        }
        desconto = subtotal * 0.1
        total = subtotal - desconto
        dqs('.subtotal span:last-child').innerHTML = `<span>R$ ${subtotal.toFixed(2)}</span>`
        dqs('.desconto span:last-child').innerHTML = `<span>R$ ${desconto.toFixed(2)}</span>`
        dqs('.total span:last-child').innerHTML = `<span>R$ ${total.toFixed(2)}</span>`
    } else {
        dqs('aside').classList.remove('show');
        dqs('aside').style.left = '100vh'
    }
}