import { NzMessageService } from 'ng-zorro-antd/message';
import { FooterService } from './../../services/footer.service';
import { Footer } from './../../interfaces/Footer';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-dash',
  templateUrl: './footer-dash.component.html',
  styleUrls: ['./footer-dash.component.scss']
})
export class FooterDashComponent implements OnInit {

  loading = true;
  footer: Footer[] = [];

  constructor(private footServ: FooterService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.loading = true;
    this.footServ.getFooter().subscribe(res => {
      this.footer = res;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
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
