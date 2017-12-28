import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLID
} from 'graphql';
import * as request from 'sync-request';
import * as axios from 'axios'; 
import { Repo } from './repository';
import { GraphQLBoolean, GraphQLFloat } from 'graphql/type/scalars';

const repository = new Repo();

const ProductType = new GraphQLObjectType({
    name : 'Product',
    fields: () =>({
        _id : {type : GraphQLID},
        ProductId :{type :GraphQLInt},
        Name : {type :GraphQLString},
        Description : {type :GraphQLString},
        ImageUrl : {type :GraphQLString},
        Price : {type :GraphQLString},
        Size : {type :GraphQLString},
        Category : {type :GraphQLInt},
        StockQuantity : {type :GraphQLInt} 
    })
});

const SubscriberType = new GraphQLObjectType({
    name : 'Subscriber',
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

const rootQuery = new GraphQLObjectType({
    name: 'root',
    fields : {
        subscriber: {
            type: SubscriberType,
            args : {
                id:{type: GraphQLInt}
            },
            resolve(parentValue,args){
                return axios.default.get(`http://statisticsapi.euromonitor.local/subscribers/subscribers/${args.id}?format=json`).then(res => res.data[0]);
            }
        },
        subscribers:{
            type: new GraphQLList(SubscriberType),
            resolve(){
                return axios.default.get('http://statisticsapi.euromonitor.local/subscribers/subscribers?format=json')
                .then(res =>res.data);
            }
        },
        products: {
            type: new GraphQLList(ProductType),
             resolve(){
                  return repository.getAll().then(res => res);
             }
        },
        product: {
            type: ProductType,
            args : {
                id: {type : GraphQLString}
            },
            resolve(parentValue, args){
                return repository.getOne(args.id).then(res => res);
            }
        }

    }
});

var mustationRoot = new GraphQLObjectType ({
    name: 'Mutation',
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
            resolve(parentValue ,args){
                 repository.addOne( args.ProductId ,
                    args.Name ,
                    args.Description ,
                    args.ImageUrl ,
                    args.Price  ,
                    args.Size  ,
                    args.Category  ,
                    args.StockQuantity );
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: rootQuery,
        mutation: mustationRoot
});