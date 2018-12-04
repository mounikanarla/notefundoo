import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionsComponent } from './add-questions.component';

describe('AddQuestionsComponent', () => {
  let component: AddQuestionsComponent;
  let fixture: ComponentFixture<AddQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddQuestionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return true when user like', () => {
    let likeArray = [{
      like: true,
      userId: localStorage.getItem('userId')
    }]
    let question = {
      like: likeArray
    }
    expect(component.like(question)).toBeTruthy();
  });
  it('should return false when user not like', () => {
    let likeArray = [{
      like: true,
      userId: "5bc0287b5414a900407e8e59"
    }]
    let question = {
      like: likeArray
    }
    expect(component.like(question)).toBeFalsy();
  });
});









