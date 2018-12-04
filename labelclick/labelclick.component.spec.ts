import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelclickComponent } from './labelclick.component';

describe('LabelclickComponent', () => {
  let component: LabelclickComponent;
  let fixture: ComponentFixture<LabelclickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelclickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelclickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
