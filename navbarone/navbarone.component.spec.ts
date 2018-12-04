
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbaroneComponent } from './navbarone.component';

describe('NavbaroneComponent', () => {
  let component: NavbaroneComponent;
  let fixture: ComponentFixture<NavbaroneComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [NavbaroneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbaroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
