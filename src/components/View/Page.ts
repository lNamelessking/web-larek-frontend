import { IEvents } from "../Presenter/EventEmitter";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = container.querySelector('.header__basket-counter');
        this._gallery = container.querySelector('.gallery');
        this._wrapper = container.querySelector('.page__wrapper');
        this._basket = container.querySelector('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
