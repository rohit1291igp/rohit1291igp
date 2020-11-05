import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRankingComponent } from './search-ranking.component';

describe('SearchRankingComponent', () => {
  let component: SearchRankingComponent;
  let fixture: ComponentFixture<SearchRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
