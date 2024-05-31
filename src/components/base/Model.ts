import { IEvents } from "../Presenter/EventEmitter";

/* В данном модуле мы определяем базовый класс для моделей данных,
он будет абстрактынм, чтобы избежать инстанцирования. Класс будет предназначен
только для передачи общей функциональности. */

//Проверяем является ли obj экземпляром Model
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}

/* Базовый класс для последующего создания моделей данных на его основе */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Метод, который оповестит, что модель поменялась
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}
