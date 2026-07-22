const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const ORDER_FILE = "orders.json";

let orders = [];

let shopOpen = true;


// Alte Bestellungen laden
if (fs.existsSync(ORDER_FILE)) {

    try {

        orders = JSON.parse(
            fs.readFileSync(ORDER_FILE, "utf8")
        );

    } catch {

        orders = [];

    }

}



// Speichern
function saveOrders() {

    fs.writeFileSync(
        ORDER_FILE,
        JSON.stringify(orders, null, 2)
    );

}



// Nächste Bestellnummer
function getNextNumber() {

    let number = orders.length + 1;

    return String(number).padStart(3, "0");

}




// =====================
// Bestellung erstellen
// =====================

app.post("/order", (req, res) => {


    if (!shopOpen) {

        return res.status(403).json({

            error: "NotMcDunalds ist geschlossen"

        });

    }



    if (!req.body.items || req.body.items.length === 0) {

        return res.status(400).json({

            error: "Keine Artikel bestellt"

        });

    }



    let order = {


        id: Date.now(),


        number: getNextNumber(),


        items: req.body.items,


        type: req.body.type || "Mitnehmen",


        location: req.body.location || "Terminal",


        status: "Neu",


        // Deutsche Uhrzeit
        time: new Date().toLocaleTimeString("de-DE", {
            timeZone: "Europe/Berlin"
        })


    };



    orders.push(order);


    saveOrders();



    res.json({

        success: true,

        order: order

    });


});







// =====================
// Alle Bestellungen
// =====================

app.get("/orders", (req, res) => {


    res.json(orders);


});







// =====================
// Bestellung löschen
// =====================

app.post("/delete", (req, res) => {


    orders = orders.filter(

        order => order.id != req.body.id

    );



    saveOrders();



    res.json({

        success: true

    });


});







// =====================
// Status ändern
// =====================

app.post("/status", (req, res) => {


    let order = orders.find(

        o => o.id == req.body.id

    );



    if (!order) {

        return res.status(404).json({

            error: "Bestellung nicht gefunden"

        });

    }



    order.status = req.body.status || "Neu";



    saveOrders();



    res.json(order);


});








// =====================
// Restaurant Status
// =====================

app.get("/shop-status", (req, res) => {


    res.json({

        open: shopOpen

    });


});








// =====================
// Restaurant öffnen/schließen
// =====================

app.post("/toggle-shop", (req, res) => {



    if (req.body.password !== "1234") {


        return res.status(403).json({

            error: "Falsches Passwort"

        });


    }





    shopOpen = !shopOpen;




    res.json({

        open: shopOpen

    });



});








// =====================
// Server starten
// =====================

const PORT = 13459;


app.listen(PORT, "0.0.0.0", () => {


    console.log(

        "NotMcDunalds läuft auf Port " + PORT

    );


});