import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const pathGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(state.url == '/'){
    return true
  }else if(state.url.split('/')[1] == 'r' && state.url.split('/').length <= 2){
    router.navigate(['/'])
    return false
  }else if(state.url.split('/')[1] == 'r'){
    return true
  }else{
    router.navigate([`/r${state.url}`])
    return false
  }
};
