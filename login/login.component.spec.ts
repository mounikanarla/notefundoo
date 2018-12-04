import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Login Form is valid'),async(()=>{
    expect(component.model.email.toEqual('sravani@gmail.com'));
    expect(component.model.password.toEqual('Sravani@123'));
    expect(component.model.email).toBeTruthy();
    expect(component.model.password).toBeTruthy();
  })
  it('Form should not valid'),async(()=>{
    expect(component.model.email.toEqual('abc@gmail.com'));
    expect(component.model.password.toEqual('ads@123'));
    expect(component.model.email).toBeFalsy();
    expect(component.model.password).toBeFalsy();
  })

});
