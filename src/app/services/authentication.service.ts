import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// import { Md5 } from 'ts-md5/dist/md5';
// import { MD5 } from 'js-md5/build/md5.min.js';
declare var md5: any;

@Injectable()
export class AuthenticationService {
    // array in local storage for registered users
    users: any[] = JSON.parse(localStorage.getItem('users')) || [];
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

    private getToken(uname, password, cb) {
        //let encryptedPwd = this.generateEncryptedPassword(password);
        this.http['post']('IGPService/login?username='+uname+'&password='+password, {})
        .subscribe(
            response => {
                let token = response.headers.get('token');
                console.log('User token', token);
                localStorage.setItem('currentUserToken', token);
                return cb(null, token);
            },
            error => {
                return cb(error);
            }
        );

    }

    login(username: string, password: string, cb) {
        this.getToken(username, password, cb);

        /* without API flow -------->
        let filteredUsers = this.users.filter(user => {
            return user.username === username && user.password === password;
        });

        let user = filteredUsers[0];
        var currentUser = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: 'fake-jwt-token'
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        */


        /* fakeAPI flow ----------->
        return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
        */
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserToken');
    }
}