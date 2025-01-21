import {connect} from "mongoose";

const connectToDb = async ()=>{
    try{
        const dbHost=process.env.DB_HOST;
        const dbPort=process.env.DB_PORT;
        const dbName=process.env.DB_NAME;

        const url = `${dbHost}:${dbPort}/${dbName}`;
        await connect(url);
        console.log("Connected to db");
    } catch(error){
        console.log(error.message);
    }
};

export default connectToDb;