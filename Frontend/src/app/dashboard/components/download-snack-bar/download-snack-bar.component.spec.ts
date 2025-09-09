import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSnackBarComponent } from './download-snack-bar.component';

describe('DownloadSnackBarComponent', () => {
  let component: DownloadSnackBarComponent;
  let fixture: ComponentFixture<DownloadSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadSnackBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
