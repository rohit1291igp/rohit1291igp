import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable()
export class CookieService {

  constructor() { };

  createCookie(name, value, hours) {
    if (hours) {
      var date = new Date() as any;
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else {
      var expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if (name == cookiePair[0].trim()) {
        // Decode the cookie value and return
        return decodeURIComponent(cookiePair[1]);
      }
    }

    // Return null if not found
    return null;
  }

  deleteCookie(name){
    document.cookie = `${name}=; max-age=0`;
  }
}
