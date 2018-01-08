import { ObjectID } from "bson";

export class Product{
    _id : ObjectID
    ProductId : number
    Name : string
    Description : string
    ImageUrl : string
    Price : number
    Size : string
    Category : string
    StockQuantity : number
}