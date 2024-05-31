
import { Component } from "../base/Component"


interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this._close = container.querySelector('.order-success__close'),
        this._total = container.querySelector('.order-success__description')

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(total:string) {
      this.setText(this._total, total)
    }
}
