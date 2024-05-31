import { Component } from "../../base/Component";
import { createElement, ensureElement } from "../../../utils/utils";
import { EventEmitter } from "../../Presenter/EventEmitter";

interface IBasketView {
    basketModalItems: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.basketModalItems = [];
    }

    set basketModalItems(items: HTMLElement[]) {
        if (items.length) {
            this.setDisabled(this._button, false)
            this._list.replaceChildren(...items);
        } else {
          this.setDisabled(this._button, true)
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(totalPrice: number) {
        this.setText(this._total, `${(totalPrice)} синапсов`);
    }
}
