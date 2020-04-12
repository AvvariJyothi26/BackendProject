const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let CoffeeShop = new Schema({
id: {
    type: String
},
name: {
    type: String
},
location: {
    type: String
},
description: {
    type: String
},
avg_rating: {
    type: String
},
mark_fav: {
    type: String
},
});

const coffee= mongoose.model('CoffeeShop', CoffeeShop);
module.exports = coffee;