import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HasilVotingPage } from './hasil-voting.page';

describe('HasilVotingPage', () => {
  let component: HasilVotingPage;
  let fixture: ComponentFixture<HasilVotingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HasilVotingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
