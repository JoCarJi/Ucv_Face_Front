import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacePage } from './face.page';

describe('FacePage', () => {
  let component: FacePage;
  let fixture: ComponentFixture<FacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
