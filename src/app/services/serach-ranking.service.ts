import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class SerachRankingService {

  constructor(
    private httpClient:HttpClient
  ) { }

  getSearchRanking(searchKeyword,solr,ml,skip,limit){
    let url=`${environment.origin}v1/admin/solr/search/ranking?q=${searchKeyword}&o=${skip}&l=${limit}&s=wt_desc&solr=${solr}&ml=${ml}`
    return this.httpClient.get(url);
  }
}
