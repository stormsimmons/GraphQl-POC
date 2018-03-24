import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLID
} from "graphql";
import * as request from "sync-request";
import * as axios from "axios";
import { Repo } from "./repository";
import { GraphQLBoolean, GraphQLFloat } from "graphql/type/scalars";
import { Product } from "./models/product";
import { ClientRequestArgs } from "http";

const repository: Repo = new Repo();

const ProductType: GraphQLObjectType = new GraphQLObjectType({
    name : "Product",
    fields: () =>({
        _id : {type : GraphQLID},
        ProductId :{type :GraphQLInt},
        Name : {type :GraphQLString},
        Description : {type :GraphQLString},
        ImageUrl : {type :GraphQLString},
        Price : {type :GraphQLFloat},
        Size : {type :GraphQLString},
        Category : {type :GraphQLInt},
        StockQuantity : {type :GraphQLInt}
    })
});

const SubscriberType: GraphQLObjectType = new GraphQLObjectType({
    name : "Subscriber",
    fields: () => ({
        name : {type : GraphQLString },
        id : {type : GraphQLInt},
        applicationId : {type : GraphQLInt },
        clientSecret : {type : GraphQLString },
        fullCompanyName : {type : GraphQLString},
        status : {type : GraphQLString},
        type : {type : GraphQLString },
        isDeleted : {type : GraphQLString}
    })
});

const rootQuery: GraphQLObjectType = new GraphQLObjectType({
    name: "root",
    fields : {
        subscriber: {
            type: SubscriberType,
            args : {
                id:{type: GraphQLInt}
            },
            resolve(parentValue: any,args: any):Promise<any> {
                return axios.default.get(`http://statisticsapi.euromonitor.local/subscribers/subscribers/${args.id}?format=json`)
                .then(res => res.data[0]);
            }
        },
        subscribers:{
            type: new GraphQLList(SubscriberType),
            resolve(): Promise<any> {
                return axios.default.get("http://statisticsapi.euromonitor.local/subscribers/subscribers?format=json")
                .then(res =>res.data);
            }
        },
        products: {
            type: new GraphQLList(ProductType),
             resolve(): Promise<any> {
                  return repository.getAll().then(res => res);
             }
        },
        product: {
            type: ProductType,
            args : {
                id: {type : GraphQLString}
            },
            resolve(parentValue:any, args:any):Promise<any> {
                return repository.getOne(args.id).then(res => res);
            }
        }

    }
});

var mutationRoot:GraphQLObjectType = new GraphQLObjectType ({
    name: "Mutation",
    fields: {
        addProduct:{
            type : ProductType,
            args : {
                ProductId :{type :GraphQLInt},
                Name : {type :GraphQLString},
                Description : {type :GraphQLString},
                ImageUrl : {type :GraphQLString},
                Price : {type :GraphQLFloat},
                Size : {type :GraphQLString},
                Category : {type :GraphQLString},
                StockQuantity : {type :GraphQLInt}
            },
            resolve(parentValue:any ,args:any):void {

                var product:Product = new Product();
                product.ProductId  = args.ProductId;
                product.Name = args.Name;
                product.Description = args.Description;
                product.ImageUrl = args.ImageUrl;
                product.Price = args.Price;
                product.Size = args.Size;
                product.Category = args.Category;
                product.StockQuantity = args.StockQuantity;

                repository.addOne( product );
            }
        }
    }
});

export const schema:GraphQLSchema = new GraphQLSchema({
    query: rootQuery,
        mutation: mutationRoot
});