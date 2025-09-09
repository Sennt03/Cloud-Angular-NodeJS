import { Component, Renderer2, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [...sharedImports, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form!: FormGroup
  maskLoad = signal(false)

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) {
      this.buildForm()
    }

  private buildForm(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  togglePasswordVisibility() {
    const passwordInput = this.renderer.selectRootElement('#password-input');
    const passwordIcon = this.renderer.selectRootElement('.icon-password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
    const remove = passwordInput.getAttribute('type') === 'password' ? 'fa-eye' : 'fa-eye-slash'
    const add = passwordInput.getAttribute('type') === 'password' ? 'fa-eye-slash' : 'fa-eye'
    this.renderer.setAttribute(passwordInput, 'type', type);
    this.renderer.removeClass(passwordIcon, remove);
    this.renderer.addClass(passwordIcon, add);
  }

  signup(){
    // Animaciones
    // Redireccion
    this.router.navigate(['../register'], { relativeTo: this.route })
  }

  hasError(field: any, error: any){
    return (this.form.get(field) as AbstractControl).hasError(error)
  }

  haveErrors(field: any){
    return (this.form.get(field) as AbstractControl).touched && (this.form.get(field) as AbstractControl).invalid
  }

  login(){
    if(!this.form.valid){
      this.form.markAllAsTouched()
      return
    }

    this.maskLoad.set(true)
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        toastr.success('Welcome!', '')
        this.maskLoad.set(false)
        this.authService.saveAuth(res)
        this.form.markAsUntouched()
        this.router.navigate(['/'])
      },
      error: (err) => {
        this.maskLoad.set(false)
        toastr.setOption('timeOut', 3000)
        if (window.innerWidth < 768) toastr.setOption('positionClass', 'toast-top-center')
        toastr.error(err.error.message, 'Failed Login')
        toastr.setDefaultsOptions()
      }
    })
  }
}
