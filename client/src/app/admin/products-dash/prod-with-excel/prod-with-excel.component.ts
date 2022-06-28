import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from './../../../services/product.service';
import { Product } from 'src/app/interfaces/Product';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-prod-with-excel',
  templateUrl: './prod-with-excel.component.html',
  styleUrls: ['./prod-with-excel.component.scss']
})
export class ProdWithExcelComponent implements OnInit {

  products: Product[] = [];
  data: any;

  constructor(
    private prodServ: ProductService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  fileChange(evt: any): void {
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      const x = this.data.slice(1);
      let prodData = [];
      x.map((prod: string[], i: number) => {
        prodData[i] = {
          id: `${i + new Date().getTime()}`,
          name: prod[0],
          description: prod[1],
          images: prod[2],
          brand: prod[3],
          price: prod[4],
          category: prod[5],
          countInStock: prod[6],
          discount: prod[7],
          filters: prod[8]
        };
      });
      prodData = prodData.filter(ele => ele.name);
      this.products = prodData.map(ele => {
        return {
          ...ele,
          images: JSON.parse(ele.images),
          filters: JSON.parse(ele.filters)
        };
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  handleSubmit(): void {
    if (this.products.length > 0) {
      const load = this.message.loading('action in progress...').messageId;
      this.prodServ.addMany(this.products).subscribe(() => {
        this.message.remove(load);
        this.products = [];
      }, err => {
        console.log(err);
        this.message.remove(load);
      });
    }
  }
}
