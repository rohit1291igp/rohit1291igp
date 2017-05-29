import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// import { Md5 } from 'ts-md5/dist/md5';
// import { MD5 } from 'js-md5/build/md5.min.js';
declare var md5: any;

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    generateEncryptedPassword(plainPassword) {
        let encryptedPassword = "";
        let systemSalt = "Random$SaltValue#WithSpecialCharacters!@#$%^&*()0192384756#qazwsxedcrfvtgbyhnujmikolp";

        let hash = md5.digest();
        // let md5 = MD5('hello');
        // let digest = MD5.digest('hello');
        console.log('digest:', hash);    

        if(plainPassword && plainPassword.length > 0) {
            // MessageDigest md5 = MessageDigest.getInstance("MD5");
            // md5.update((plainPassword.trim() + systemSalt).getBytes());
            // encryptedPassword = new String(Base64.getEncoder().encode(md5.digest()));
        }
        return encryptedPassword;
    }

    private getToken(uname, password) {
        let encryptedPwd = this.generateEncryptedPassword(password);
        return this.http.post('http://192.168.0.80:8080/IGPService/login?username=TEST&challenge=$2a$10$04TVADrR6/SPLBjsK0N30.Jf5fNjBugSACeGv1S69dZALR7lSov0y', {
            username: 'TEST',
            challenge: '$2a$10$04TVADrR6/SPLBjsK0N30.Jf5fNjBugSACeGv1S69dZALR7lSov0y'
        })
        .map((response: Response) => {
            let token = response.headers.get('token');
            console.log('User token', token);

            localStorage.setItem('currentUserToken', token);
            return response.headers.get('token');
        });
    }

    login(username: string, password: string) {

        // return this.getToken(username, password);
        return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserToken');
    }
}