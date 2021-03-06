import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CommentService } from './../../services/comment.service';
import { UserService } from './../../services/user.service';
import { CartService } from './../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/Product';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  productSub: Subscription;

  product: Product = { images: [{}], rate: [0, 0, 0, 0, 0] };
  commentValue = '';
  commentsNextPage = 1;
  colors = [];

  config: SwiperConfigInterface = {
    slidesPerView: 7,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loopFillGroupWithBlank: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };

  constructor(
    private prodServ: ProductService,
    private cartServ: CartService,
    private actRoute: ActivatedRoute,
    private message: NzMessageService,
    private userServ: UserService,
    private router: Router,
    private commentServ: CommentService
  ) { }

  ngOnInit(): void {
    this.resizing();
    this.actRoute.params.subscribe(({ slug }) => {
      this.__getProduct(slug);
    });
  }

  private __getProduct(slug: string): void {
    this.productSub = this.prodServ.getOneProductBySlug(slug).subscribe(product => {
      this.product = product;
      this.colors = product.images.map(ele => ele.color !== 'nocolor' ? ele.color : null).filter(ele => ele);
      this.cartServ.cart.subscribe((car) => {
        car.forEach((ele) => {
          if (ele.product.id === product.id) {
            this.product.cartAmount = ele.amount;
          }
        });
      });
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }

  resizing(): void {
    if (window.innerWidth > 0 && window.innerWidth < 576) {
      this.config.slidesPerView = 2.4;
      this.config.navigation = false;
    } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
      this.config.slidesPerView = 3;
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.config.slidesPerView = 4;
      this.config.navigation = false;
    } else if (window.innerWidth > 992 && window.innerWidth < 1200) {
      this.config.slidesPerView = 5;
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };
    } else if (window.innerWidth > 1200) {
      this.config.slidesPerView = 7;
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };
    }
  }

  addCart(): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    if (userId) {
      const load = this.message.loading('action in progress').messageId;
      this.cartServ.addToCart(this.product.id).subscribe(() => {
        const cart = this.cartServ.cart.getValue();
        if (cart.length < 8) {
          this.cartServ.cart.next([...cart, {
            id: `${new Date().getTime()}`,
            user: userId,
            product: this.product,
            amount: 1
          }]);
        }
        const cartCount = this.cartServ.cartcount.getValue();
        this.cartServ.cartcount.next(cartCount + 1);
        const oldtotalCost = this.cartServ.totalPrice.getValue();
        this.cartServ.totalPrice.next(oldtotalCost + this.product.price);
        this.product.cartAmount = 1;
        this.message.remove(load);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });

    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  likeBtn(): void {
    // tslint:disable-next-line: no-string-literal
    if (this.userServ.user.getValue()['id']) {
      const load = this.message.loading('action in progress').messageId;
      this.cartServ.modifyLike(this.product.id).subscribe(({ add }) => {
        this.product.liked = add;
        const likesCount = this.cartServ.likescount.getValue();
        if (add) {
          this.cartServ.likescount.next(likesCount + 1);
        } else {
          this.cartServ.likescount.next(likesCount - 1);
        }
        this.message.remove(load);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  removeFromCart(): void {
    const load = this.message.loading('action in progress').messageId;
    this.cartServ.removeFromCart(this.product.id).subscribe(() => {
      const cart = this.cartServ.cart.getValue();
      this.cartServ.cart.next(cart.filter(a => a.product.id !== this.product.id));
      const cartCount = this.cartServ.cartcount.getValue();
      this.cartServ.cartcount.next(cartCount - 1);
      const oldtotalCost = this.cartServ.totalPrice.getValue();
      this.cartServ.totalPrice.next(oldtotalCost - this.product.price);
      this.product.cartAmount = 0;
      this.message.remove(load);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

  modifyAmount(e: number): void {
    const load = this.message.loading('action in progress...').messageId;
    if (e === 1) {
      this.cartServ.addOne(this.product.id).subscribe(() => {
        this.message.remove(load);
        this.product.cartAmount++;
        const oldTotal = this.cartServ.totalPrice.getValue();
        this.cartServ.totalPrice.next(oldTotal + this.product.price);
        let cart = this.cartServ.cart.getValue();
        cart = cart.map((car) => {
          if (car.product.id === this.product.id) {
            car.amount = this.product.cartAmount;
          }
          return car;
        });
        this.cartServ.cart.next(cart);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error(err.error);
      });
    } else {
      this.cartServ.minusOne(this.product.id).subscribe(() => {
        this.message.remove(load);
        this.product.cartAmount--;
        const oldTotal = this.cartServ.totalPrice.getValue();
        this.cartServ.totalPrice.next(oldTotal - this.product.price);
        let cart = this.cartServ.cart.getValue();
        cart = cart.map((car) => {
          if (car.product.id === this.product.id) {
            car.amount = this.product.cartAmount;
          }
          return car;
        });
        this.cartServ.cart.next(cart);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error(err.error);
      });
    }
  }

  modifyRate(rate: number): void {
    // tslint:disable-next-line: no-string-literal
    if (this.userServ.user.getValue()['id']) {
      const load = this.message.loading('action in progress...').messageId;
      this.prodServ.modifyRate(rate, this.product.id).subscribe(() => {
        this.message.remove(load);
        if (rate === 0) {
          this.product.numReviews -= 1;
          this.product.rate[this.product.rated - 1] -= 1;
        } else {
          if (this.product.rated > 0) {
            this.product.rate[this.product.rated - 1] -= 1;
            this.product.rate[rate - 1] += 1;
          } else {
            this.product.numReviews += 1;
            this.product.rate[rate - 1] += 1;
          }
        }
        this.product.rated = rate;
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  addComment(): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    if (userId) {
      const productId = this.product.id;
      const load = this.message.loading('action in progress ...').messageId;
      this.commentServ.addComment(userId, productId, this.commentValue).subscribe((res) => {
        this.message.remove(load);
        this.product.comments.push({
          id: res._id,
          product: productId,
          user: userId,
          userdata: [this.userServ.user.getValue()],
          comment: this.commentValue,
          avgup: 0
        });
        this.commentValue = '';
      }, (err) => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  upDownComment(e: number, commentId: string): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    if (userId) {
      const load = this.message.loading('action in progress ...').messageId;
      if (e === 1) {
        this.commentServ.upComment(commentId, userId).subscribe(() => {
          this.message.remove(load);
          this.product.comments.find(ele => ele._id === commentId).avgup++;
          this.product.comments.find(ele => ele._id === commentId).uped = true;
          this.product.comments.sort((a, b) => b.avgup - a.avgup);
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      } else {
        this.commentServ.downComment(commentId, userId).subscribe(() => {
          this.message.remove(load);
          this.product.comments.find(ele => ele._id === commentId).avgup--;
          this.product.comments.find(ele => ele._id === commentId).downed = true;
          this.product.comments.sort((a, b) => b.avgup - a.avgup);
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      }
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  removeUpDown(id: string): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    const comment = this.product.comments.find(ele => ele._id === id);
    const load = this.message.loading('action in progress ...').messageId;
    this.commentServ.removeUpDown(comment.uped, id, userId).subscribe(() => {
      this.message.remove(load);
      if (comment.uped) {
        comment.uped = false;
        comment.avgup--;
      }
      if (comment.downed) {
        comment.downed = false;
        comment.avgup++;
      }
    }, err => {
      console.log(err);
      this.message.remove(load);
    });
  }

  getNextComments(): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    const load = this.message.loading('action in progress ...').messageId;
    this.commentServ.getComments(this.commentsNextPage, this.product.id, userId)
    .subscribe(({comments, commentsCount}) => {
      this.message.remove(load);
      this.product.comments.push(...comments);
      this.product.commentsCount = commentsCount;
      this.commentsNextPage++;
    }, err => {
      console.log(err);
      this.message.remove(load);
    });
  }

}
