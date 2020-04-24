import * as express from "express";
import * as bodyParser from "body-parser";
import {handleRequest} from "./helpers/ultil.helper";
import { env } from "./config/env.config";
import {ProfileController} from "./controllers/profile.controller";
const app = express();
app.set("port", env.APP_PORT);
app.use(bodyParser.json());

app.post(
    '/profiles/get',
    (req, res) => handleRequest(req, res, ProfileController.getProfile)
);

app.post(
    '/profiles/up',
    (req, res) => handleRequest(req, res, ProfileController.updateProfile)
);

app.listen(app.get('port'), () => {
   console.log('App start at port: '+app.get('port'));
});
