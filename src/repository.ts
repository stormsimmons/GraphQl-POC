import { MongoClient, Db, Collection, InsertOneWriteOpResult } from "mongodb";
import { ObjectId, ObjectID } from "bson";
import { Product } from "./models/product";

export class Repo {

    public async getAll(): Promise<any[]> {

        const client:Db = await this.getClient();

        const result:any = await this.find(client);

        return result;
    }

    public async getOne(id: string): Promise<Product> {
        const client:Db = await this.getClient();

        const result:Promise<Product> = await this.findOne(client, id);

        return result;
    }

    public async addOne(product : Product): Promise<any> {
        const client:Db = await this.getClient();

        const result:any = await this.insert(client, product);
        return result;
    }

    private insert(client:Db,product:Product): Promise<any> {

        return new Promise((resolve, reject) => {
            const db: Db = client.db("CherrieCouture");

            const productCollection: Collection<Product[]> = db.collection("Products");

            product._id = new ObjectID();

            const result: void = productCollection.insertOne(product ,
                 (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    private findOne(client:Db, id: string): Promise<any> {

        return new Promise((resolve, reject) => {

            const db: Db = client.db("CherrieCouture");

            const productCollection: Collection<Product> = db.collection("Products");

            const result:any = productCollection.findOne({ _id: new ObjectID(id) },
             (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    private find(client:Db): Promise<any> {

        return new Promise((resolve, reject) => {

            const db: Db = client.db("CherrieCouture");

            const productCollection: Collection<Product> = db.collection("Products");

            const result: void = productCollection.find({}).toArray( (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    private getClient(): Promise<Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect("mongodb://localhost:27017", (err, client) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(client);
            });
        });
    }
}
