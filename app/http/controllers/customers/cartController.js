const { json } = require("express")

function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart

            // Check if item does not exist in cart 
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        },
 
        removeItem(req, res) {
            const pizzaId = req.params.pizzaId;
            const cart = req.session.cart;
            if (cart && cart.items[pizzaId]) {
            cart.totalQty -= cart.items[pizzaId].qty;
            cart.totalPrice -= cart.items[pizzaId].qty * cart.items[pizzaId].item.price;
            delete cart.items[pizzaId];
            res.status(200).json(cart);
            } else {
            res.status(404).json({ message: "Food not found in cart" });
            }
        },

        emptyCart(req, res) {
            const cart = req.session.cart;
            if (cart) {
                cart.items = {};
                cart.totalPrice = 0;
                cart.totalQty = 0;
                console.log(cart);
                res.status(200).json(cart);
            } else {
                res.status(404).json({ message: "Cart is already empty!" });
            }
        }
    }
}

module.exports = cartController