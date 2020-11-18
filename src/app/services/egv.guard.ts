import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EgvGuard implements CanActivate {
  constructor(private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if((localStorage.getItem('userType') ==='egv_admin' || localStorage.getItem('userType') ==='sub_egv_admin') || (localStorage.getItem('userType')==='manager' || localStorage.getItem('userType')==='sub_manager') ||(localStorage.getItem('userType')==='executive' || localStorage.getItem('userType')==='sub_executive')){
      return true;
    }
    this.router.navigate(['/'])
    return false;
  }
}
