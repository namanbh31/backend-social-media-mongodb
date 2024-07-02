import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
class ProductRepository{

    constructor(){
        this.collection = "products";
    }

    async add(newProduct){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("database connectivity error", 500);
        }
    }
    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const allProducts = await collection.find().toArray();
            return allProducts; 
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("database connectivity error", 500);
        }

    }
    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const allProducts = await collection.findOne({_id: new ObjectId(id)});
            return allProducts; 
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("database connectivity error", 500);
        }
    }
    // async filter(minPrice, maxPrice, category){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         let filterExpression = {};
    //         if(minPrice){
    //             filterExpression.price = {$gte: parseFloat(minPrice)}
    //         }
    //         if(maxPrice){
    //             filterExpression.price = {...filterExpression.price,$lte: parseFloat(maxPrice)}
    //         }
    //         if(category){
    //             filterExpression.category = category;
    //         }
    //         return await collection.find(filterExpression).toArray();
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError("database connectivity error", 500);
    //     }

    // }

    async filter(minPrice, categories){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            categories = JSON.parse(categories.replace(/'/g, '"'));
            if(categories){
                // use of and, or operator
                // filterExpression={$or:[{category:{$in:(categories)}}, filterExpression]}

                filterExpression={$and:[{category:{$in:(categories)}}, filterExpression]}
                // filterExpression.category = category;
            }
            return await collection.find(filterExpression).project({name:1, product:1, _id:0}).toArray();

            // use of projection operator

            // return await collection.find(filterExpression).project({name:1, product:1, _id:0}).toArray();

            // use with slice operator

            // return await collection.find(filterExpression).project({name:1, product:1, _id:0, rating{$slice:1}}).toArray();

        }
        catch(err){
            console.log(err);
            throw new ApplicationError("database connectivity error", 500);
        }

    }


    // async rate(userID, productID, rating){
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         const product = await collection.findOne({_id:new ObjectId(productID)});
    //         const userRating = product?.ratings?.find(r=>r.userID == userID);
    //         if(userRating){
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID), "ratings.userID":new ObjectId(userID)
    //             }, {
    //                 $set:{
    //                     "ratings.$.rating":rating
    //                 }
    //             });
    //         }
    //         else{
    //             await collection.updateOne({_id:new ObjectId(productID)}, {
    //                 $push:{ratings:{userID:new ObjectId(userID), rating}}
    //             });
    //         }



    //     } catch (error) {
    //         console.log(err);
    //         throw new ApplicationError("database connectivity error", 500);
    //     }

    // }

    async rate(userID, productID, rating){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            await collection.updateOne({
                _id:new ObjectId(productID)
            }, {
                $pull:{
                    ratings:{userID:new ObjectId(userID)}
                }
            });
            await collection.updateOne({_id:new ObjectId(productID)}, {
                $push:{ratings:{userID:new ObjectId(userID), rating}}
            });

        } catch (error) {
            console.log(err);
            throw new ApplicationError("database connectivity error", 500);
        }

    }
    async averageProductPricePerCategory(){
        try{
            const db = getDB();
            return await  db.collection(this.collection)
            .aggregate([
                {
                $group:{
                    _id:"$category", 
                    averagePrice:{$avg:"$price"}
                }
            }
            ]).toArray();


        } catch (err) {
            console.log(err);
            throw new ApplicationError("database connectivity error", 500);
        }
    }
}

export default ProductRepository;

// db.products.aggregate([{$unwind:"$ratings"}, {$group:{_id:"$name", averageRating:{$avg:"$ratings.rating"}}}])

// db.products.aggregate([{$project:{name:1, countOfRating:{$cond:{if:{$isArray:"$ratings"}, then:{$size:"$ratings"}, else:0}, }}}, {$sort:{countOfRating:-1}}, {$limit:1}])


