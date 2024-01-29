const app = require("./app")
const connectDatabase = require("./config/db");

connectDatabase();
app.listen(process.env.PORT , ()=>{
    console.log('db is connected and running on port:' , process.env.PORT)
} )    