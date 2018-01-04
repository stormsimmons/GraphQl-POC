import * as express from 'express';
import * as expressGraphQL from 'express-graphql'
import {schema} from './schema';


const app = express();

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
})); 

app.listen(4000, () => {
    console.log('Server is running on port 4000..');
});