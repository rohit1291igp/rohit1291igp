import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadEmailComponent } from './download-email.component';

describe('DownloadEmailComponent', () => {
  let component: DownloadEmailComponent;
  let fixture: ComponentFixture<DownloadEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
