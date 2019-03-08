import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants, Utils } from '../util/utils';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CrudService {

    fileCambio = new Subject<any>();

    constructor(private http: HttpClient) {
        // console.log('init crudservice');
    }


    /**
     * @author Milton Sanchez
     * @param url
     * @param item
     */
    public post(url: string, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(url, JSON.stringify(item), Constants.httpOptions).toPromise()
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    /**
     * @author Milton Sanchez
     * @param url
     */
    public get(url: string) {
        return new Promise((resolve, reject) => {
            this.http.get(url, Constants.httpOptions).toPromise()
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    /**
     * @author Milton Sanchez
     * @param url
     * @param item
     */
    public put(url: string, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.put(url, JSON.stringify(item), Constants.httpOptions).toPromise()
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }


    /**
     * @author Milton Sanchez
     * @param url
     * @param data
     */
    create(url: string, data: any): Promise<any> {
        const body = JSON.stringify(data);
        return this.http.post(url, body,
            Constants.httpOptions)
            .toPromise()
            .then(res => {
                // console.log('res create: ' + JSON.stringify(res));
                return JSON.stringify(res);
            })
            .catch(Utils.handleError);
    }

    /**
     * @author Milton Sanchez
     * @param url
     * @param item
     */
    public postFile(url: string, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(url, JSON.stringify(item), Constants.httpOptionsFile).toPromise()
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    /**
     * @author Milton Sanchez
     * @param formData
     */
    uploadFile(formData: any) {
        return this.http.post(environment.HOST_FILES + '/file/upload', formData, Constants.httpOptionsFile).toPromise()
            .then(res => {
                /// console.log('res create: ' + JSON.stringify(res));
                return res;
            })
            .catch(Utils.handleError);
    }


    /**
     * @author Milton Sanchez
     * Allow dowload file by upladname
     */
    dowloadFile(file: string) {
        const strWindowFeatures = 'location=yes,height=570,width=520,scrollbars=yes,status=yes';
        const URL = environment.HOST_FILES + `/uploads/${file}?mini=true&amp;url=`
            + location.href;
        const win = window.open(URL, '_blank', strWindowFeatures);

    }

    /**
     * @author Milton Sanchez
     * Allow delete file by upladname
     */
    deleteFile(file: string) {
        return this.http.post(environment.HOST_FILES + '/file/delete', { name: file }, Constants.httpOptionsFile).toPromise()
            .then(res => {
                // console.log('res create: ' + JSON.stringify(res));
                return res;
            })
            .catch(Utils.handleError);

    }


    generatePdf(uuid: String, reportParams: {}): Promise<Blob> {
        return this.http
            .post(Constants.GENERATE_PDF_REPORT + uuid, JSON.stringify(reportParams), Constants.generateReportHeaders).toPromise()
            .then((res) => {
                return res;
            })
            .catch(Utils.handleError);
    }



}
