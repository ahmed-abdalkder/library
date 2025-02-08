import mongoose from "mongoose";


const connectionDB = ()=>{

    mongoose.connect("mongodb://localhost:27017/graphQl")

    .then(()=>{

        console.log("connection database");
        
    }).catch((err)=>{
        
        console.log(err);
        
    })
}

export default connectionDB