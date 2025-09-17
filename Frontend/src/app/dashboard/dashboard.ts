import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LsResAuth } from '@models/auth.models';
import { LsUser, LsUserDefault } from '@models/user.models';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...sharedImports, RouterOutlet, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  private authService = inject(AuthService)
  private userService = inject(UserService)

  maskLoad = signal(false)
  user = signal<LsUser>({...LsUserDefault})
  $subUser!: Subscription

  constructor(){}

  ngOnInit(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth > 764) {
      const sidebar = document.querySelector('.sidebar') as Element;
      const closeBtn = document.querySelector("#btn") as Element;

      sidebar.classList.add('open');
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    }

    const auth = this.authService.getAuth() as LsResAuth
    this.user.set(auth.user)

    this.$subUser = this.userService.userProfile.pipe(
      switchMap(() => this.userService.getProfile()),
    ).subscribe(res => {
      this.user.set(res)
    });
  }

  ngOnDestroy(): void {
    this.$subUser.unsubscribe()
  }

  menuToggle(open = false){
    const sidebar = document.querySelector('.sidebar') as Element;
    if(open){
      sidebar.classList.add('open');
    }else{
      sidebar.classList.toggle('open');
    }

    this.menuBtnChange();
    if(!open) this.removeAnalytics()
  }

  menuBtnChange() {
    const sidebar = document.querySelector(".sidebar") as Element;
    const closeBtn = document.querySelector("#btn") as Element;

    if(sidebar.classList.contains("open")){
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    }else{
        closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
    }
  }

  logout(){
    this.maskLoad.set(true)
    setTimeout(() => {
      toastr.info('Goodbye!', '')
      this.maskLoad.set(false)
      this.authService.logout()
    }, 500);
  }

  collapseAnalitycs(){
    this.menuToggle(true)

    const menuItem = document.querySelector('.collapse-analytics') as Element;
    const iconItem = document.querySelector('.bxs-chevron-down') as Element;
    if(menuItem.classList.contains('collapse')){
      iconItem.classList.remove('collapseIcon')
      iconItem.classList.add('collapseIconBack')
    }else{
      iconItem.classList.add('collapseIcon')
      iconItem.classList.remove('collapseIconBack')
    }
    menuItem.classList.toggle('collapse')
  }

  removeAnalytics(){
    const menuItem = document.querySelector('.collapse-analytics') as Element;
    const iconItem = document.querySelector('.bxs-chevron-down') as Element;
    iconItem.classList.remove('collapseIcon')
    iconItem.classList.remove('collapseIconBack')
    menuItem.classList.remove('collapse')
  }
}
