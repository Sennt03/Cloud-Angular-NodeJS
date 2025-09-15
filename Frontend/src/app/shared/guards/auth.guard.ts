import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService)
  const authService = inject(AuthService)
  const router = inject(Router)

  return userService.getProfile().pipe(
    map(user => {
      authService.updateAuthUser(user)
      return true
    }),catchError(() => {
      authService.logout()
      router.navigate(['/auth/login'])
      return of(false);
    })
  )
};
