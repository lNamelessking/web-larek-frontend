import { Api, ApiListResponse } from "../base/api";
import { IProductItem, IOrderPostResult, IOrderPost } from "../../types";

export class ApiModel extends Api {
    readonly cdn: string;

    constructor(cdn:string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options)
        this.cdn = cdn;
    }

    getProductList(): Promise<IProductItem[]> {
        return this.get('/product')
        .then((res: ApiListResponse<IProductItem>) => {
            return res.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }));
        });
    }

    postOrder(order:IOrderPost): Promise<IOrderPostResult> {
        return this.post('/order', order)
        .then ((res: IOrderPostResult) => {return res})
    }

}
