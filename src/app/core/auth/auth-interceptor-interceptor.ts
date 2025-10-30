import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service'; // <-- 1. Importa tu servicio

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  if (!authToken) {
    return next(req);
  }
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });
  return next(authReq);
};
