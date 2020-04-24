import {constants} from "http2";
import {Request, Response} from "express";
import { env } from "../config/env.config";
export const sleep = function (time: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

export const handleRequest = function (req: Request, res: Response, callback) {
    if(req.body.api_key !== env.API_KEY){
        responseError(res, constants.HTTP_STATUS_UNAUTHORIZED);
    } else {
        callback(req, res)
            .then()
            .catch((exception) => {
                console.log(exception);
                res.status(exception.code)
                    .send(exception.message);
            });
    }
};

export const responseOK = function (res: Response, data: any = {}) {
    res.status(constants.HTTP_STATUS_OK)
        .send({
            status_code: constants.HTTP_STATUS_OK
        });
};

export const responseError = function (res: Response, statusCode: number, message: string = '', errors: any = null) {
    res.status(statusCode)
        .send({
            status_code: statusCode,
            message: message,
            errors: errors
        });
};