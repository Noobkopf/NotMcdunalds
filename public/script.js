let cart = [];


function add(item) {

    cart.push(item);

    updateCart();

}



function updateCart() {


    if(cart.length == 0){

        document.getElementById("cart").innerHTML = "Leer";

        return;

    }


    document.getElementById("cart").innerHTML =
    cart.join("<br>");

}



function sendOrder(){


    if(cart.length == 0){

        alert("Warenkorb leer");

        return;

    }


    fetch("/order", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            items:cart

        })

    })


    .then(res=>res.json())


    .then(order=>{


        alert(
        "Bestellung #" + order.id + " gesendet!"
        );


        cart=[];

        updateCart();


    });


}
