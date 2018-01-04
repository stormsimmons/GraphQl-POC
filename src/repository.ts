import { MongoClient, Db } from 'mongodb';
import { ObjectId, ObjectID } from 'bson';

export class Repo {

    public async getAll(): Promise<any[]> {

        const client = await this.getClient();

        const result = await this.find(client);

        return result;
    }

    public async getOne(id: string){
        const client = await this.getClient();

        const result = await this.findOne(client , id);

        return result;
    }

    public async addOne(productId , name , description , imageUrl , price , size ,  category , stockQuantity){
        const client = await this.getClient();

        const result = await this.insert(client, productId , name , description , imageUrl , price , size ,  category , stockQuantity);
        
        return result;
    }

    private insert(client, productId , name , description , imageUrl , price , size ,  category , stockQuantity) {
    
        return new Promise((resolve, reject) => {
            const db = client.db('CherrieCouture');

            const productCollection = db.collection('Products');

            const result = productCollection.insertOne({
                _id: new ObjectID(),
                ProductId :productId, 
                Name : name,
                Description : description,
                ImageUrl : imageUrl,
                Price : price,
                Size : size,
                Category : category,
                StockQuantity :  stockQuantity
            },function(err, result){
                if (err) {
                    reject(err); 
                    return; 
                   }
                   resolve(result);
            });
        });
    }

    private findOne(client, id: string): Promise<any> {

        return new Promise((resolve, reject) => {

            const db = client.db('CherrieCouture');
            
            
            
            const productCollection = db.collection('Products');

            const result = productCollection.findOne({ _id: new ObjectID(id) }, function (err, result) {
                if (err) {
                     reject(err); 
                     return; 
                    }
                    resolve(result);
            })

        });
    }

    private find(client): Promise<any> {

        return new Promise((resolve, reject) => {

            const db = client.db('CherrieCouture');

            const productCollection = db.collection('Products');

            const result = productCollection.find({}).toArray(function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    private getClient(): Promise<Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect('mongodb://localhost:27017', (err, client) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(client);
            });
        });
    }
}
