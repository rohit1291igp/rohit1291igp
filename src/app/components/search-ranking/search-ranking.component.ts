import { Component, OnInit, ViewChild } from '@angular/core';
import { SerachRankingService } from 'app/services/serach-ranking.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


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
  solr:string="";
  ml:string="";
  imgCdn="https://cdn.igp.com/f_auto,q_auto,t_prodm/products/"

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position', 'name', 'weight',];
  dataSource = new MatTableDataSource([]);
  totalResult=0;


  ngOnInit() {
  }

  onSubmit(){
    this.dataSource.data.length=0;
    if(this.searchKeyword && this.solr && this.ml){
      this.getSearchRankingResult(0,100)
    }
  }


  getSearchRankingResult(skip=0,limit=100){
    this.searchRankingService.getSearchRanking(this.searchKeyword,this.solr,this.ml,skip,limit).subscribe((res:any)=>{
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
          }
          this.displayedColumns = ['id','image','name','url'];
        }
        console.log(this.dataSource)  
        console.log(this.totalResult)  
      }
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
