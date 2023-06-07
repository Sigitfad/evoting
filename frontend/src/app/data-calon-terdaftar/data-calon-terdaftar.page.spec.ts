import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataCalonTerdaftarPage } from './data-calon-terdaftar.page';

describe('DataCalonTerdaftarPage', () => {
  let component: DataCalonTerdaftarPage;
  let fixture: ComponentFixture<DataCalonTerdaftarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataCalonTerdaftarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
