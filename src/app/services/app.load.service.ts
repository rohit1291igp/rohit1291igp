import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable()
export class AppLoadService {
  micrositeDetails
  constructor(private httpClient:HttpClient) {}

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
          if(location.href.includes('login') && location.href.split('login/')[1]){
            sessionStorage.removeItem('micrositeStyleData');

            if(location.href.split('login/')[1].includes('yourigpstore')){
                let data = {
                        headerLogoUrl:'https://cdn.igp.com/f_auto,q_auto/banners/IGP-for-business-50_new_png.png?v=6',
                        primaryColor:'#606869',
                        secondaryColor: "#fff",
                        whitelabelname: location.href.split('login/')[1]
                    }
                sessionStorage.setItem('micrositeStyleData', JSON.stringify(data));
                resolve(true);
            }
            this.getMicrositeDetails(location.href.split('login/')[1]);
            let timer = setInterval(() => {
              if(this.micrositeDetails){
                clearInterval(timer)
                resolve(true);
              }
            }, 10);
          }else{
            if(location.href.includes('login') && !location.href.split('login/')[1]){
                sessionStorage.removeItem('micrositeStyleData');
            }
            
            resolve(true);
          }
        });
  }

  getMicrositeDetails(microsite){
    console.log('microsite - ', microsite)
    let micrositeDetails;
    let url = `${environment.origin}v1/admin/${microsite}/details`;
    let subs = this.httpClient.get(url).subscribe(
      (response:any) => {
        this.micrositeDetails = 'getResponse';

        if(response && response.status == 'Success' && response.data){
          response && sessionStorage.setItem('micrositeStyleData', JSON.stringify(response.data));
        }
        
      },
      err => {
        console.log('Errp99999999Res')
      },
      () => {
        subs.unsubscribe();
      },
    )

}
}