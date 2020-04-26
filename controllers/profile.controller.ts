import {env} from "../config/env.config";
import {Storage} from '@google-cloud/storage';
import * as fs from "fs";
import archiver = require("archiver");
import * as unzipper from "unzipper";
import {responseOK} from "../helpers/ultil.helper";
import {Request, Response} from "express";

class ProfileControllerClass {
    async getProfile(req: Request, res: Response) {
        let input = req.body as any;
        if (input.force || !fs.existsSync(env.CHROME_DATA_PATH + input.file_name)) {
            const storage = new Storage({keyFilename: "./key.json"});
            const options = {
                destination: env.CHROME_DATA_PATH + input.file_name + '.zip',
            };
            await storage.bucket(env.BUCKET_NAME).file(input.file_name + '.zip').download(options);
            const output = fs.createReadStream(env.CHROME_DATA_PATH + input.file_name + '.zip');
            output.pipe(unzipper.Extract({ path: env.CHROME_DATA_PATH+ input.file_name  }));
        }

        responseOK(res);
    };

    async updateProfile(req: Request, res: Response) {
        let input = req.body as any;
        let zipFile = await ProfileControllerClass.createZip(input.file_name);
        const storage = new Storage({keyFilename: "./key.json"});
        await storage.bucket(env.BUCKET_NAME).upload(zipFile);
        responseOK(res);
    };

    static createZip(fileName: string) {
        return new Promise<string>((resolve, reject) => {
            const output = fs.createWriteStream(env.CHROME_DATA_PATH + fileName + '.zip');
            const archive = archiver('zip', {
                zlib: {level: 9}
            });
            output.on('close', function () {
                resolve(env.CHROME_DATA_PATH + fileName + '.zip');
            });

            archive.on('warning', function (err) {
                if (err.code !== 'ENOENT') {
                    reject(err);
                }
            });

            archive.on('error', function (err) {
                reject(err);
            });

            archive.pipe(output);
            archive.directory(env.CHROME_DATA_PATH + fileName, false);
            archive.finalize();
        });
    }
}

export const ProfileController = new ProfileControllerClass();