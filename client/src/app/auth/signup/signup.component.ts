import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from './../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  password = '';

  constructor(
    private fb: FormBuilder,
    private userServ: UserService,
    private message: NzMessageService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      phone: ['', [Validators.required]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      street: [''],
      zip: ['']
    },
    {validators: this.ConfirmValidator}
    );
  }

  ConfirmValidator(frm: FormGroup): { [key: string]: any } | null {
    if (frm.get('password').value !== frm.get('confirmPassword').value) {
      return { passInvalid: true };
    }
    return null;
  }

  handleSubmit(): void {
    const load = this.message.loading('action in progress...').messageId;
    this.userServ.signupUser(this.signUpForm.value).subscribe(({token, user}) => {
      this.message.remove(load);
      localStorage.setItem('token', token);
      this.userServ.user.next({loading: false, ...user})
      this.router.navigateByUrl('/');
    }, err => {
      this.message.remove(load);
      this.message.error(err.error);
    });
  }


}
