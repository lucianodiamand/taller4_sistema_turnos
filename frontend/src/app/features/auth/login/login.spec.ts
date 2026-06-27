import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { Login } from './login';

describe('Login', () => {
  let sesion: { login: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let noti: { error: ReturnType<typeof vi.fn>; exito: ReturnType<typeof vi.fn> };

  function crear(): Login {
    const fixture = TestBed.createComponent(Login);
    return fixture.componentInstance;
  }

  beforeEach(async () => {
    sesion = { login: vi.fn() };
    router = { navigate: vi.fn() };
    noti = { error: vi.fn(), exito: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SesionService, useValue: sesion },
        { provide: Router, useValue: router },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('no llama a login si el formulario está vacío', () => {
    const cmp = crear() as any;
    cmp.ingresar();
    expect(sesion.login).not.toHaveBeenCalled();
  });

  it('loguea y navega a /inicio cuando es exitoso', () => {
    sesion.login.mockReturnValue(of({ token: 't', usuario: {} }));
    const cmp = crear() as any;
    cmp.form.setValue({ email: 'admin', password: 'admin' });
    cmp.ingresar();
    expect(sesion.login).toHaveBeenCalledWith({ email: 'admin', password: 'admin' });
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('muestra error y no navega si el login falla', () => {
    sesion.login.mockReturnValue(throwError(() => ({ status: 401 })));
    const cmp = crear() as any;
    cmp.form.setValue({ email: 'admin', password: 'mala' });
    cmp.ingresar();
    expect(noti.error).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
