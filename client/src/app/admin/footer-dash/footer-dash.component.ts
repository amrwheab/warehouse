import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FooterService } from './../../services/footer.service';
import { Footer } from './../../interfaces/Footer';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer-dash',
  templateUrl: './footer-dash.component.html',
  styleUrls: ['./footer-dash.component.scss']
})
export class FooterDashComponent implements OnInit, OnDestroy {

  loading = true;
  footer: Footer[] = [];
  footerSub: Subscription;

  constructor(private footServ: FooterService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.loading = true;
    this.footerSub = this.footServ.getFooter().subscribe(res => {
      this.footer = res;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.footerSub) { this.footerSub.unsubscribe(); }
  }

  trackByFun(i: number): number {
    return i;
  }

  handleSubmit(id: string): void {
    const field = this.footer.find(foot => foot.id === id).field;
    const load = this.message.loading('action in progress...').messageId;
    this.footServ.updateFooter(id, field).subscribe(() => {
      this.message.remove(load);
      this.message.success('updated successfully');
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

}
