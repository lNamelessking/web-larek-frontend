//Комонент. Является базовым классом для всех дальнейших классов слоя View.
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    /* Метод для установки текстового значения, принимает HTML элемент,
    через свойство текст контент меняет на строку вэлью*/
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Метод который будет использоваться для блокировки переданного элемента
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Метод, который будет добавлять свойство дисплей нан для переданного элемента
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Метод, который удаляет свойство дисплей
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    /*Метод, который уставнавливает картинку на элемент(он должен быть Image)
    присваем элементу ссылку, и если есть строка альт то перекидываем её в альт*/
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    /* Метод, который который принимает необязательный объект, свойства и методы в
    котором могут частично совпадать тому что мы передадим в дженерик, вернёт HTML элемент
    контейнер, который дополнится тем, что мы передадим в дату. Через нулиш оператор проверяем
    если дата у нас нулл или андефайнед, то {}*/
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
