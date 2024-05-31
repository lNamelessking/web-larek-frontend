import './scss/styles.scss';
import { AppModel } from './components/Model/AppModel';
import { ApiModel } from './components/Model/ApiModel';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/Presenter/EventEmitter';
import { cloneTemplate } from './utils/utils';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Common/Modal';
import { Basket } from './components/View/Common/Basket';
import { Product, IProduct } from './components/View/Product';
import { Order } from './components/View/Order';
import { ensureElement } from './utils/utils';
import { IProductItem, IOrderPostResult,  IUser } from './types';
import { Success } from "./components/View/Success"

const events = new EventEmitter();
const appState = new AppModel({}, events);
const api = new ApiModel(CDN_URL, API_URL);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;

const basketModalData = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events)
const success = new Success(cloneTemplate(successTemplate), { onClick:() => {
  modal.close()
}})

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then((data) => {
		appState.setProductList(data);
	})
	.catch((error) => {
		console.log(error);
	});

events.on('productList:changed', () => {
	page.gallery = appState.productList.map((item) => {
		const product = new Product(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:selected', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('product:selected', (clickedProduct: IProductItem) => {
	appState.setClickedProduct(clickedProduct);
});

events.on('clickedProduct:open', (clickedProduct: IProductItem) => {
	const productModal = new Product(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			appState.isProductInBasket(clickedProduct)
				? (() => {
						events.emit('product:removeBasket', clickedProduct),
							(productModal.button = 'В корзину');
				  })()
				: (() => {
						events.emit('product:addBasket', clickedProduct),
							(productModal.button = 'Удалить');
				  })();
		},
	});
	modal.render({
		content: productModal.render({
			id: clickedProduct.id,
			title: clickedProduct.title,
			image: clickedProduct.image,
			category: clickedProduct.category,
			description: clickedProduct.description,
			price: clickedProduct.price,
			button: appState.isProductInBasket(clickedProduct)
				? 'Удалить'
				: 'В корзину',
		}),
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basketModalData.render({}),
	});
});

events.on('product:addBasket', (item: IProductItem) => {
	appState.addToBasket(item);
	events.emit('basket:change');
});

events.on('product:removeBasket', (item: IProductItem) => {
	appState.removeFromBasket(item);
	events.emit('basket:change');
});

events.on('basket:change', () => {
  page.counter = appState.getProductQuantity();
  basketModalData.total = appState.getBasketPrice();
	basketModalData.basketModalItems = appState.basketOfProducts.map((item, id) => {
		const product = new Product(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:removeBasket', item);
			},
		});
		return product.render({
			index: (id + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
});

events.on('user:notvalid', (errors: Partial<IUser>) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('payment:changed', ({ name }: { name: string }) => {
	appState.setUserField('payment', name);
	appState.validateUser();
});


events.on(
	/^order\..*:change/,
	(data: { field: keyof IUser; value: string }) => {
		appState.setUserField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IUser; value: string }) => {
		appState.setUserField(data.field, data.value);
	}
);

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
  modal.render({
    content: contacts.render ({
      email:'',
      phone:'',
      valid: false,
      errors: []
    })
  })
})

events.on('contacts:submit', () => {
    api.postOrder(appState.order)
      .then((data:IOrderPostResult) => {
        success.total = `Списано ${data.total} синапсов`;
        appState.reset();
        order.clearButtons();
        modal.render({content: success.render({})
      })
    })
    .catch((err) => console.error(err));
})
