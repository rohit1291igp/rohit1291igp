import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { CookieService } from './cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
previousUrl:string;
    constructor(private router: Router,private cookieService: CookieService) {
        this.router.events
        .filter(e => e instanceof RoutesRecognized)
        .pairwise()
        .subscribe((event: any[]) => {
        console.log(event[0].urlAfterRedirects, 'precviuiosurl');
        this.previousUrl = event[1].urlAfterRedirects;
        });
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.cookieService.getCookie('currentUserToken') || localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        sessionStorage.setItem('previousUrl', location.href.split("#")[1])
        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        this.router.navigate(['/login']);
        return false;
    }
}
