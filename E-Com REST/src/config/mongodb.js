import { MongoClient } from "mongodb";

let client;
let url = process.env.DB_URL;
export const connectToMongoDB = ()=>{
    MongoClient.connect(url)
    .then(clientInstance=>{
        client = clientInstance;
        console.log("Mongodb is connected");
        createCounter(client.db());
        createIndexes(client.db())
    })
    .catch(err=>{
        console.log(err);
    })
}
export const getDB =()=>{
    return client.db();
}
export const getClient = ()=>{
    return client;
}
const createCounter = async function(db){
    const exsistingCounter = await db.collection("counters").findOne({_id:'cartItemId'});
    if(!exsistingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }

}
const createIndexes = async function(db){
    try{
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1, category:-1});
        await db.collection("products").createIndex({desc:"text"});
    }
    catch(err){
        console.log(err);
    }
    console.log("indexes are created");
}
