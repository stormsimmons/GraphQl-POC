import * as express from "express";
import * as expressGraphQL from "express-graphql";
import {schema} from "./schema";
import * as cors from "cors";
import * as jwt from "jsonwebtoken";

const app :any = express();

// configuring middleware
app.use(cors());

function validateToken(token:string):any {
    return jwt.decode(token);
 }
// this step could be used to configure your own middleware to authenticate you GQL endpoint
// it is obvioulsy very rudimentary, validate your claims as per your config
app.use((req,res,next) => {
    var decodedToken:any = validateToken(`eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxYTBkYTg2MDQ5ZTFhZDYzNmNkOWM2YjJmYjIzNTM1IiwidHlwIjoiSldUIn0.
    eyJuYmYiOjE1MTY3MDA5MjQsImV4cCI6MTUxNjc4NzMyNCwiaXNzIjoiaHR0cDovL3N0YXRpc3RpY3NhcGkuZXVyb21vbml0b3IubG9jYWwvYXV0aGVudGljYXRpb24
    iLCJhdWQiOlsiaHR0cDovL3N0YXRpc3RpY3NhcGkuZXVyb21vbml0b3IubG9jYWwvYXV0aGVudGljYXRpb24vcmVzb3VyY2VzIiwiRXVyb21vbml0b3IuU3RhdGlzdGl
    jcy5BdXRob3Jpc2F0aW9uU2VydmljZSIsIkV1cm9tb25pdG9yLlN0YXRpc3RpY3MuQ2F0YWxvZ1NlcnZpY2UiLCJFdXJvbW9uaXRvci5TdGF0aXN0aWNzLk1hcmtldFNpe
    mVTZXJ2aWNlIl0sImNsaWVudF9pZCI6IjQwMzM1Iiwic3ViIjoicWFfZ3JvdXAiLCJhdXRoX3RpbWUiOjE1MTY3MDA5MjQsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiRXVy
    b21vbml0b3IuU3RhdGlzdGljcy5BdXRob3Jpc2F0aW9uU2VydmljZSIsIkV1cm9tb25pdG9yLlN0YXRpc3RpY3MuQ2F0YWxvZ1NlcnZpY2UiLCJFdXJvbW9uaXRvci5TdGF
    0aXN0aWNzLk1hcmtldFNpemVTZXJ2aWNlIl0sImFtciI6WyJjdXN0b20iXX0.UR8INeoChufPV4zByEMx54eEuwuZ9-RfKGaoQUGKcFSHLefnBrlY8PpDFVBy0hqmY4kJQX
    d85nseHN6TWeqiWKaAQsuCiMEYlKP5pBoE4PmP0azzFI7PL0W8nk4M0Nazwicz7937LpQuLTapAIKo6i6B1IoLq_8Ej05QaVvaxUV3Vy0O354qlgBxuYN7C0u-_
    8MBFkGGm0JelKf4vhuCEKt1V64yW2Bc2smGVxX9PKvuny-t_bIMCLLwLNXs4kG7tPPRFM0CHeUpaEawxvVO0VMiqzOkeUaZL3P4nmwXt49jPfqnNm_5J4G6L-U6R6a
    NQEoRl8TpPqrfL1m13uRHA`);

    if(!decodedToken) {
        res.status(401).send("Unauthorised");
    }
    next();
});

app.use("/graphql", expressGraphQL({
    schema:schema,
    graphiql:true
}));

app.listen(4000, () => {
    console.log("Server is running on port 4000..");
});
