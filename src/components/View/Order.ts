import { Form } from "./Common/Form";
import { IEvents } from "../Presenter/EventEmitter";
import { IUser } from "../../types";
import { ensureAllElements } from "../../utils/utils";

export class Order extends Form<IUser> {
    protected _payment: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      this._payment = ensureAllElements<HTMLButtonElement>('.button_alt', container);
      this._payment.forEach((button) => {button.addEventListener('click', () => this.clickedPaymentHandler(button.name))})
  }

    set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value =
        value;
    }

    set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value =
        value;
    }

    set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value =
        value;
    }

    clickedPaymentHandler(name: string) {
      this._payment.forEach(button => {
        const isActive = button.name === name;
        this.toggleClass(button, 'button_alt-active', isActive);
      });
      this.events.emit('payment:changed', { name });
    }

    clearButtons() {
      this._payment.forEach((button) => {
        button.classList.remove('button_alt-active');
      })
    }
}

