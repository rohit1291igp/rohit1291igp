import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDecentralizationComponent } from './product-decentralization.component';

describe('ProductDecentralizationComponent', () => {
  let component: ProductDecentralizationComponent;
  let fixture: ComponentFixture<ProductDecentralizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDecentralizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDecentralizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
