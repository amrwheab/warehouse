import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-send-to-sub',
  templateUrl: './send-to-sub.component.html',
  styleUrls: ['./send-to-sub.component.scss']
})
export class SendToSubComponent implements OnInit {

  editor = ClassicEditor;
  messageValue = '';

  constructor(
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  async sendMail(): Promise<void> {
    if (this.messageValue) {
      const load = this.message.loading('action in progress...').messageId;
      try {
        await fetch(environment.apiUrl + '/subs/sendmail', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: this.messageValue })
        });
        this.message.remove(load);
        this.messageValue = '';
        this.message.success('Your mail is sended');
      } catch (err) {
        console.log(err);
        this.message.error('some thing went wrong');
        this.message.remove(load);
      }
    } else {
      this.message.error('mail body is required');
    }
  }
}
