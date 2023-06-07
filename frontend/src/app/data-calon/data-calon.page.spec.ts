import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataCalonPage } from './data-calon.page';

describe('DataCalonPage', () => {
  let component: DataCalonPage;
  let fixture: ComponentFixture<DataCalonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataCalonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
