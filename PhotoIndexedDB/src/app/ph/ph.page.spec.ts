import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhPage } from './ph.page';

describe('PhPage', () => {
  let component: PhPage;
  let fixture: ComponentFixture<PhPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PhPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
