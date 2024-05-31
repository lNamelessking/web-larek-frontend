import { IUser, IProductItem, IFormErrors, IOrderPost } from "../../types"
import { Model } from "../base/Model"


interface IAppModel {
    listOfProducts: IProductItem[];
    clickedProduct: IProductItem;
    basketOfProducts: IProductItem[];
    user: IUser;
    formErrors: IFormErrors;
}

export class AppModel extends Model<IAppModel> {
    productList: IProductItem[];
    clickedProduct: IProductItem;
    basketOfProducts: IProductItem[] = [];
    user: IUser = {
        payment:'',
        email: '',
        phone: '',
        address: ''
    };

    formErrors: IFormErrors = {};

    addToBasket(product: IProductItem):void {
        const isIncluded = this.basketOfProducts.some(item => item.id === product.id);
        if (!isIncluded) {
            this.basketOfProducts.push(product);
        }
        this.emitChanges('basket:changed')
    }

    removeFromBasket(product: IProductItem):void {
        this.basketOfProducts = this.basketOfProducts.filter(item => item.id !== product.id);
        this.emitChanges('basket:changed')
    }

    getProductQuantity():number {
        return this.basketOfProducts.length;
    }

    getBasketPrice():number {
        return this.basketOfProducts.reduce((total, product) => total + (product.price || 0), 0);
    }

    setProductList(data: IProductItem[]) {
        this.productList = data;
        this.emitChanges('productList:changed', { productList: this.productList });
    }

    setClickedProduct(product: IProductItem):void {
        this.clickedProduct = product;
        this.emitChanges('clickedProduct:open', product);
    }

    setUserField(field: keyof IUser, value: string):void {
        this.user[field] = value;
        if (this.validateUser()) {
            this.events.emit('order:ready', this.user);
        }
    }

    isProductInBasket(product: IProductItem): boolean {
      return this.basketOfProducts.some(item => item.id === product.id);
    }

    validateUser() {
        const errors: typeof this.formErrors = {};
        if (!this.user.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.user.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.user.address) {
            errors.address = 'Необходимо указать адресс';
        }
        if(!this.user.payment) {
            errors.payment= "Neoходимо указать метод оплаты"
        }
        this.formErrors = errors;
        this.events.emit('user:notvalid', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    get order():IOrderPost {
        return {
            ...this.user,
            items: this.basketOfProducts.map(product => product.id),
            total: this.getBasketPrice()
        };
    }

    reset() {
        this.basketOfProducts = [];
        this.user.address = '';
        this.user.email = '';
        this.user.phone = '';
        this.user.payment = '';
        this.clickedProduct = null;
        this.events.emit('basket:change');
    }
}
