import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  handleSubmit(): void {
    if (!this.loginForm.invalid) {
      const load = this.message.loading('action in progress...').messageId;
      this.userServ.loginUser(this.loginForm.value).subscribe(({token, user}) => {
        this.message.remove(load);
        localStorage.setItem('token', token);
        this.userServ.user.next({loading: false, ...user})
        this.router.navigateByUrl('/');
      }, err => {
        this.message.remove(load);
        this.message.error(err.error);
        console.log(err);
      });
    } else {
      this.loginForm.controls.email.markAsTouched();
      this.loginForm.controls.password.markAsTouched();
    }
  }

}
