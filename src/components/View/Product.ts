import { IProductItem } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IProduct extends IProductItem {
  index?: string,
  button: string;
}

export class Product extends Component<IProduct> {
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price:HTMLElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._title = container.querySelector('.card__title');
        this._description = container.querySelector('.card__description');
        this._button = container.querySelector('.card__button');
        this._price = container.querySelector('.card__price');
        this._index = container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value)
    }

    set description(value: string) {
        this.setText(this._description, value)
    }

    set category(value: string) {
      this.setText(this._category, value)
      this._category.classList.add(this.colorMap[value])
  }

    set price(value: number | null) {
        const displayText = value === null ? "Бесценно" : `${value} синапсов`;
        this.setText(this._price, displayText);
        if (value === null) this.setDisabled(this._button, true);
    }

    set button(value:string) {
        this.setText(this._button, value)
    }

    set index(value: string ) {
      this.setText(this._index, value);
    }

    colorMap: Record<string, string> = {
      "софт-скил": "card__category_soft",
      "другое": "card__category_other",
      "дополнительное": "card__category_additional",
      "кнопка": "card__category_button",
      "хард-скил": "card__category_hard"
    }
}
