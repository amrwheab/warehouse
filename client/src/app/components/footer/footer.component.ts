import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { FooterService } from './../../services/footer.service';
import { Footer } from './../../interfaces/Footer';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  @ViewChild('email') email: ElementRef;

  footerParts: Footer[] = [];
  loading = true;
  footerSub: Subscription;

  constructor(private footerServ: FooterService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.loading = true;
    this.footerSub = this.footerServ.getFooter().subscribe(foot => {
      this.loading = false;
      this.footerParts = foot;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.footerSub) {
      this.footerSub.unsubscribe();
    }
  }

  trackByFun(i: number): number {
    return i;
  }

  async addSub(email: string): Promise<void> {
    const load = this.message.loading('action in progress...').messageId;
    try {
      await fetch(environment.apiUrl + '/subs/add', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      });
      this.message.remove(load);
      this.email.nativeElement.value = '';
      this.message.success('Your email is added');
    } catch (err) {
      console.log(err);
      this.message.error('some thing went wrong');
      this.message.remove(load);
    }
  }
}
