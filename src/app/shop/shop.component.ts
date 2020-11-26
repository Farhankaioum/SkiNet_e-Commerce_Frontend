import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopService } from './shop.service';
import { ShopParams } from '../shared/models/shopParams';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true}) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  productTypes: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getProductTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams)
    .subscribe((response) => {
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
      this.products = response.data;
    }, error => {
      console.log(error);
    });
  }

  getBrands(){
    this.shopService.getBrands()
      .subscribe((response) => {
        this.brands = [{id: 0, name: 'All'}, ...response];
      }, error => {
        console.log(error);
      });
  }

  getProductTypes(){
    this.shopService.getTypes()
      .subscribe((response) => {
        this.productTypes = [{id: 0, name: 'All'}, ...response];
      }, error => {
        console.log(error);
      });
  }

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string){
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChange(event: any){
    if (this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset(){
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }

}
