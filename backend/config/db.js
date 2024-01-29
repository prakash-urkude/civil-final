const mongoose = require("mongoose");

const connectDataBase = () => {
    mongoose.connect("mongodb+srv://prakashurkude:prakash1998@cluster0.nuhssqs.mongodb.net/civil")
    .then((data) => console.log('db connected With Server:', data.connection.host))
    .catch((error) => console.log(error));
}

module.exports = connectDataBase;
 