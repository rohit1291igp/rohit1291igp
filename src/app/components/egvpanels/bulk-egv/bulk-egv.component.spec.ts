import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEgvComponent } from './bulk-egv.component';

describe('BulkEgvComponent', () => {
  let component: BulkEgvComponent;
  let fixture: ComponentFixture<BulkEgvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkEgvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkEgvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
