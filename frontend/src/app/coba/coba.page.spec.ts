import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CobaPage } from './coba.page';

describe('CobaPage', () => {
  let component: CobaPage;
  let fixture: ComponentFixture<CobaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CobaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
