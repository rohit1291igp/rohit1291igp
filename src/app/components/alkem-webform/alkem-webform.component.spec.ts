import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlkemWebformComponent } from './alkem-webform.component';

describe('AlkemWebformComponent', () => {
  let component: AlkemWebformComponent;
  let fixture: ComponentFixture<AlkemWebformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlkemWebformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlkemWebformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
