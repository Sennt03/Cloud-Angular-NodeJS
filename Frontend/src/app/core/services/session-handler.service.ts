import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import toastr from '@shared/utils/toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { NO_TOKEN_HEADER } from './token.service';

// MONITOREA TODAS LAS PETICIONES PARA QUE CUANDO LA SESIÓN HAYA CADUCALO LE CIERRE LA APP Y LE MANDE AL LOGIN
export const sessionHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.context.get(NO_TOKEN_HEADER) === true) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastr.error('Sesión caducada!', '');
        authService.logout()
      }

      return throwError(() => error);
    })
  );
};
