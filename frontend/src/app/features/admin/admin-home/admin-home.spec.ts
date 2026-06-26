import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminHomeComponent } from './admin-home';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHomeComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('muestra enlaces a los módulos de administración', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Servicios');
    expect(html.textContent).toContain('Profesionales');
    expect(html.textContent).toContain('Usuarios');
  });
});
