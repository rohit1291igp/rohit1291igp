import { Component, OnInit, ViewChild } from '@angular/core';
import { SerachRankingService } from 'app/services/serach-ranking.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-search-ranking',
  templateUrl: './search-ranking.component.html',
  styleUrls: ['./search-ranking.component.css']
})
export class SearchRankingComponent implements OnInit {

  constructor(
    private searchRankingService:SerachRankingService
  ) { }
  searchKeyword:string="";
  solr:string="http://solr.igp.com:8983/solr/product";
  ml:string="http://10.0.4.168/api/v1/get_products_id?initial_query";
  imgCdn="https://cdn.igp.com/f_auto,q_auto,t_prodm/products/"

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position', 'name', 'weight',];
  dataSource = new MatTableDataSource([]);
  totalResult=0;
  modified_query="";

  sortOptions=[
    {title : "Ascending by Score",value:'score%2Basc'},
    {title : "Descending by Score",value:'score%2Bdesc'},
    {title : "Ascending by MRP",value:'mrp%2Basc'},
    {title : "Descending by MRP",value:'mrp%2Bdesc'},
    {title : "Descending by Created",value:'created%2Bdesc'}, 
  ]
  sortBy="score%2Bdesc"


  ngOnInit() {
  }

  onSubmit(){
    this.dataSource.data.length=0;
    if(this.searchKeyword && this.solr && this.ml){
      this.getSearchRankingResult(0,100)
    }
  }


  getSearchRandkingResultInvoked=false;
  getSearchRankingResult(skip=0,limit=100){
    this.getSearchRandkingResultInvoked=true;
    this.searchRankingService.getSearchRanking(this.searchKeyword,this.solr,this.ml,skip,limit,this.sortBy).subscribe((res:any)=>{
      this.getSearchRandkingResultInvoked=false;
      if(res.status==='Success'){
        if('products' in res.data){
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 100);
          if(skip){
            this.dataSource.data=this.dataSource.data.concat(res.data.products);
          }else{
            this.dataSource.data=res.data.products;
            this.totalResult=res.data.num;
            this.modified_query=res.data.modified_query;
          }
          this.displayedColumns = ['id','image','name','url','rating','price'];
        }
        console.log(this.dataSource)  
        console.log(this.totalResult)  
      }
    },(err)=>{
      this.getSearchRandkingResultInvoked=false;
    })
  }

  onPageChange(pageEvent){
    console.log(pageEvent)
    if(pageEvent.length-(pageEvent.pageIndex*pageEvent.pageSize)<=pageEvent.pageSize){
      console.log("network call")
      this.getSearchRankingResult(this.dataSource.data.length,pageEvent.pageSize)
    }else{
      console.log("dont make network call")
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
