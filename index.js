// Write your code here...
//=============================================================================================>

document.addEventListener('DOMContentLoaded', () => {

    initalize()
    // let currentId = 1;
    // let cartValue = 0;
    // let itemPrice = 0;
    // let cartPrice = 0;
    // let allData = [];
    // cartButton();
    //why does this work? scope? 

    function initalize() {
        let currentId = 1;
        let cartValue = 0;
        let itemPrice = 0;
        let cartPrice = 0;
        let allData = [];
        cartButton();
    };

    // Basic Get request (Read)
    fetch('http://localhost:3000/menu')
        .then((r) => r.json())
        .then((menus) => {
            allData = menus;
            allData.forEach((menu) => addMenu(menu));
            cartValue = parseInt(menus[0].number_in_bag);
            itemPrice = menus[0].price;
            cartPrice = parseInt(menus[0].number_in_bag) * itemPrice;
            document.querySelector("#number-in-cart").innerText = `${cartValue} \n\nTotal Price: $${cartPrice}`
            renderDish(menus[0]);
        })

    //Adds a menu
    function addMenu(menu) {
        //console.log(menu)
        const menuItems = document.querySelector("#menu-items");
        const span = document.createElement("span")
        span.textContent = menu.name
        span.id = menu.id
        menuItems.append(span);

        //event
        span.addEventListener('click', (event) => {
            // console.log(event)
            // console.log(event.target)
            currentId = span.id
            // console.log(menu.number_in_bag)
            cartValue = parseInt(menu.number_in_bag);
            cartPrice = parseInt(menu.number_in_bag) * menu.price;
            // console.log(cartValue)
            // console.log(cartPrice)
            document.querySelector("#number-in-cart").innerText = `${cartValue} \n\nTotal Price: $${cartPrice}`;
            renderDish(menu)
        })
    }

    function renderDish(dish) {
        const dishSection = document.getElementById("dish");
        const dishTextDiv = document.getElementById("dish-text");

        const currentImage = document.querySelector("#dish-image");
        const currentName = document.querySelector("#dish-name");
        const currentDes = document.querySelector("#dish-description");
        const currentPrice = document.querySelector("#dish-price");

        const img = document.createElement("img");
        const dishName = document.createElement("h3")
        const dishDescription = document.createElement("p")
        const dishPrice = document.createElement("h3")

        img.src = dish.image
        img.id = "dish-image"
        dishName.textContent = dish.name
        dishName.id = "dish-name"
        dishDescription.textContent = dish.description
        dishDescription.id = "dish-description"
        dishPrice.textContent = `$ ${dish.price}`;
        dishPrice.id = "dish-price";

        // console.log(img)
        // console.log(currentImage)
        dishSection.replaceChild(img, currentImage)
        dishTextDiv.replaceChild(dishName, currentName)
        dishTextDiv.replaceChild(dishDescription, currentDes)
        dishTextDiv.replaceChild(dishPrice, currentPrice)

        //dishImage.src = dish.image;
        // console.log(dishSection)
        // console.log(dishImage)
        // console.log(img)
    };

    function cartButton() {
        const form = document.querySelector("#cart-form")
        //submit event
        form.addEventListener('submit', (event) => {
            event.preventDefault()

            const btn = document.querySelector("[type='submit']");
            const input = document.querySelector("#cart-amount");
            const span = document.querySelector("#number-in-cart");
            const cartHeader = document.getElementsByTagName('h3')[2];

            const newSpan = document.createElement("span");
            newSpan.value = parseInt(input.value) + parseInt(span.innerText);
            newSpan.cost = newSpan.value * itemPrice

            cartValue = newSpan.value;
            cartPrice = newSpan.cost;
            newSpan.innerText = `${cartValue} \nTotal Price: $${cartPrice}`;
            console.log(cartValue)
            console.log(cartPrice)
            newSpan.id = 'number-in-cart';
            cartHeader.replaceChild(newSpan, span)
            //form.reset();

            // Patch
            fetch(`http://localhost:3000/menu/${currentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number_in_bag: document.querySelector("#number-in-cart").value,
                    dollars_in_bag: document.querySelector("#number-in-cart").cost
                })
            })
                .then((r) => r.json())
                .then((menus) => {
                    // console.log(menus)
                    // console.log(menus.number_in_bag)
                    cartValue = menus.number_in_bag
                    cartPrice = menus.dollars_in_bag
                    document.querySelector("#number-in-cart").innerText = `${cartValue} \n\nTotal Price: $${cartPrice}`
                    allData[currentId - 1] = menus
                    document.querySelector("#menu-items").innerHTML = '';
                    allData.forEach((menu) => addMenu(menu));
                })

        })
    }
})

//=============================================================================================>
//...Ok

