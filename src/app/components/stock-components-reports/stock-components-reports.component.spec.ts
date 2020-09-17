import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockComponentsReportsComponent } from './stock-components-reports.component';

describe('StockComponentsReportsComponent', () => {
  let component: StockComponentsReportsComponent;
  let fixture: ComponentFixture<StockComponentsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockComponentsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockComponentsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
