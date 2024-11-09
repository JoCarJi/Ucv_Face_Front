import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubAdministradorPage } from './sub-administrador.page';

describe('SubAdministradorPage', () => {
  let component: SubAdministradorPage;
  let fixture: ComponentFixture<SubAdministradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
