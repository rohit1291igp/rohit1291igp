import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EgvGuard implements CanActivate {
  constructor(private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(localStorage.getItem('userType')==='admin'||localStorage.getItem('userType')==='egv_manager'||localStorage.getItem('userType')==='egv_executive'){
      return true;
    }
    this.router.navigate(['/'])
    return false;
  }
}
