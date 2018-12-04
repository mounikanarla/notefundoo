import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainArchiveComponent } from './main-archive.component';

describe('MainArchiveComponent', () => {
  let component: MainArchiveComponent;
  let fixture: ComponentFixture<MainArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
