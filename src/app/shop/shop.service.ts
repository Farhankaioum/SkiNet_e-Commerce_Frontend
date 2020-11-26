import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getProducts(shopParames: ShopParams) {
    let params = new HttpParams();

    if (shopParames.brandId !== 0) {
      params = params.append('brandId', shopParames.brandId.toString());
    }

    if (shopParames.typeId !== 0) {
      params = params.append('typeId', shopParames.typeId.toString());
    }

    if (shopParames.search) {
      params = params.append('search', shopParames.search);
    }

    params = params.append('sort', shopParames.sort);
    params = params.append('pageIndex', shopParames.pageNumber.toString());
    params = params.append('pageSize', shopParames.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getProduct(id: number){
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
