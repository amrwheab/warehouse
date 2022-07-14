import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required]]
    });
  }

  async sendMessage(): Promise<void> {
    if (this.contactForm.valid) {
      const load = this.message.loading('action in progress...').messageId;
      try {
        await fetch(environment.apiUrl + '/message', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.contactForm.value)
        });
        this.message.remove(load);
        this.contactForm.reset();
        this.message.success('Your message is sended');
      } catch (err) {
        console.log(err);
        this.message.error('some thing went wrong');
        this.message.remove(load);
      }
    }
  }
}

