import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyOpsReportComponent } from './daily-ops-report.component';


describe('DailyOpsReportComponent', () => {
  let component: DailyOpsReportComponent;
  let fixture: ComponentFixture<DailyOpsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyOpsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyOpsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
