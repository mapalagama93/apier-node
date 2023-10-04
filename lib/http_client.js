const chalk = require("chalk");
const axios  = require('axios');
const CurlGenerator = require("curl-generator");

class HttpClient {

    constructor(request) {
        this.request = request;
    }

    async sendRequest() {
        this.logRequest();
        let config = {
            method: this.getMethod(),
            url : this.getUrl(),
            data: this.getBody(),
            headers: this.getHeaders()
        };
        try {
            let response = await axios(config);
            this.response = {
                status: response.status,
                data: response.data,
                headers: response.headers
            }
        } catch (e) {
            this.response = {
                status : e.response.status,
                data: e.response.data,
                headers: e.response.headers
            };
        }
        this.logResponse();
        return this.response;
    }

    printCurl() {
        let body = this.request['body'];
        let config = {
            method: this.getMethod(),
            url : this.getUrl(),
            body: body,
            headers: this.getHeaders()
        };
        const curlSnippet = CurlGenerator(config); 
        console.log(curlSnippet);
    }

    getMethod() {
        return this.request['method'];
    }

    getUrl() {
        let url = this.request['url'];
        for (let p of Object.keys(this.request['pathParams'] || {})) {
            url = url.replace(':' + p, this.request['pathParams'][p]);
        }
        if (this.request['queryParams']) {
            let query = new URLSearchParams();
            for (let p of Object.keys(this.request['queryParams'] || {})) {
                query.append(p, this.request['queryParams'][p]);
            }
            url = url + '?' + query.toString();
        }
        return url;
    }

    getBody() {
        if (this.request['requestType'] == 'text') {
            return this.request['body'];
        }

        if (this.request['requestType'] == 'form') {
            return this.getFormBody();
        }

        if (this.request['requestType'] == 'urlencoded') {
            return this.getEncodedBody();
        }

        if (typeof body != 'string') {
            return JSON.stringify(this.request['body']);
        }
        return this.request['body'];
    }

    getFormBody() {
        let form = new FormData();
        for (let x of Object.keys(this.request['body'] || {})) {
            form.append(x, this.request['body'][x]);
        }
        return form;
    }

    getEncodedBody() {
        let params = new URLSearchParams();
        for (let x of Object.keys(this.request['body'] || {})) {
            params.append(x, this.request['body'][x]);
        }
        return params;
    }

    getHeaders() {
        return { ...this.getContentType(), ...(this.request['headers'] || {}) };
    }

    getContentType() {
        let type = 'application/json';

        if (this.request['requestType'] == 'text') {
            type = 'text/plain';
        }

        if (this.request['requestType'] == 'form') {
            type = 'multipart/form-data';
        }

        if (this.request['requestType'] == 'urlencoded') {
            type = 'application/x-www-form-urlencoded';
        }

        return {
            'Content-Type': type
        };
    }

    isJsonRequest() {
        return this.request['requestType'] == null || this.request['requestType'] == 'json';
    }

    
    isJsonResponse() {
        return this.request['responseType'] == null || this.request['responseType'] == 'json';
    }

    logRequest() {
        let body = this.request['body'];
        if (typeof body != 'string') {
            body = JSON.stringify(body, 0, 2);
        }
        console.log(chalk.bgBlue.bold(' Request '));
        console.log(chalk.blue.bold(this.getMethod().toUpperCase()), chalk.bold(this.getUrl()));
        console.log(chalk.magenta("Request Headers"), '\n' + JSON.stringify(this.getHeaders(), 0, 2));
        if(body) {
            console.log(chalk.magenta("Request Body"), '['+(this.request['requestType'] || 'json' ).toUpperCase()+']','\n' + body);
        }else{
            console.log(chalk.magenta("Request Body \n"));
        }
    }

    logResponse() {
        let data = this.response.data;
        if(typeof data != 'string') {
            data = JSON.stringify(this.response.data, 0, 2);
        }
        console.log(chalk.bgGreen.bold(" RESPONSE "));
        console.log(chalk.magenta("Status"), chalk.bold(this.response.status));
        console.log(chalk.magenta("Response Body"), '\n' + chalk.bold(data));
        console.log(chalk.magenta("Response Headers"), '\n' + chalk.bold(JSON.stringify(this.response.headers, 0, 2)));
    }

}

module.exports = HttpClient;