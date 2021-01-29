import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class SerachRankingService {

  constructor(
    private httpClient:HttpClient
  ) { }

  getSearchRanking(searchKeyword,solr,ml,skip,limit,sortBy, searchType){
    let url=`${environment.origin}v1/admin/solr/${searchType}/ranking?q=${searchKeyword}&o=${skip}&l=${limit}&s=${sortBy}&solr=${solr}&ml=${ml}`
    return this.httpClient.get(url);
  }
}
