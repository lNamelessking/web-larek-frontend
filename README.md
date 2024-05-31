# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Для архитектуры было принято решение использовать MVP архитектуру.

## Описание базовых классов

### Api класс
Служит для взаимодействия с сервером
- get - получать данные с сервера
- post - отправлять данные на сервер
- handleResponse - проверять на ок, возвращать джейсон файл если ок, реджект если ок :)

### Component
Служит базовым абстрактным классом. Принимает тип Т для отображения данных в порядке.
- используется для наследования другими важными классами отображения.
- имеет вспомогательные методы для отображения текста value, отображения картинок, ставит свойство disabled.

### Model
Служит базовым классом для главной модели данных. Имеет метод, который сообщает об изменении модели. Долго на нём не заострялся. Функционал не использовал.

## Описание классов для работы с данными (Model)

### ApiModel

Использует в себе класс Api, возвращает данные по ссылке, передаём её в аргументах, методы эту ссылку дополняют. base url и cdn url. cdn для картинок.

### AppModel

Главное звено данных бизнес логики.
Имеет такие обязательные поля.
```
interface IAppModel {
    listOfProducts: IProductItem[];
    clickedProduct: IProductItem;
    basketOfProducts: IProductItem[];
    user: IUser;
    formErrors: IFormErrors;
}

```
Принимает в себя объекты карточек, содержит кликнутый продукт, корзину с товарами, данные юзера, ошибки для форм. Имеет методы:

- addToBasket добавляет товар в корзину, перед этим проверяя есть ли товар в корзине
- removeFromBasket удаляет товар из корзинны по айди.
- getProductQuantity возвращает длинну массива корзины (кол-во товаров).
- getBasketPrice возвращает цену корзины в намбер
- setProductList принимает к себе данные с get
- setClickedProduct принимает к себе кликнутую карточку
- setUserField используется чтобы брать данные с инпутов и передавать их в значения юзера
- isProductInBasket проверяет есть ли товар в корзине
- validateUser создаёт массив ошибок по полям
- get order собирает заказ для поста по апи
- reset для сброса всего после успешного поста







## Описание классов для работы посредником.(Presenter)

Презентером у нас выступает один единственный класс EventEmitter.

- on(event, listener): Регистрирует слушатель для указанного события. Этот слушатель будет вызываться каждый раз, когда событие будет эмитироваться.

- once(event, listener): Регистрирует слушатель, который будет вызван только один раз при следующем эмитировании события.

- emit(event, [...args]): Эмиттирует событие, вызывая все зарегистрированные слушатели с переданными аргументами.

- removeListener(event, listener): Удаляет зарегистрированный слушатель для указанного события.
- removeAllListeners([event]): Удаляет все слушатели для указанного события или всех событий, если событие не указано.


## Описание классов для отображения данных.(View)

### Basket
Basket модель для отображения корзины. Она содержит массив ХТМЛ элементов карточек, кнопку "далее". Клонируем темплейт, передаёт сюда, заполняем сеттером, выводим, по успешному заказу очищаем.

Содержит в себе сеттер, который проверяет пустой ли массив товаров нам пришёл, если пустой, то просто отключаем кнопку и не даём пользователю пройти дальше, меняем содержимое картины на параграф "Корзина пуста"

Приходит именно массив товаров карточек отрендаренных в ХТМЛ, рендерить мы будем так же как и обычные карточки, для этого не нужно доп методов, особенный элемент это счётчик товаров.

### Form

Базовый класс для форм. Ищем только кнопку с типом сабмит, а так же span для передачи ошибок валидации. Всё остальное мы будем слушать, но слушать будем не через сами поля, а через саму форму. Таким образом мы будем получать и name инпута, где юзер печатает и сразу же его значение и даже может использовать брокер в наших целях.

### Modal

Класс для того, чтобы вставить в него отрендоренный контент, закрывать/открывать окно. Благодаря методам опен и close мы можем через брокер заблокировать окно. Сеттер контента получает HTML элемент и через replace child вставляет в модал контент.

### Order

Нужен для передачи брокеру выбранного метода оплаты. передавать будем через button.name.
Меняем состояние у кнопок которые мы выбрали, сбрасываем их после заказа.

### Page

Класс для отрисовки всей страницы. Здесь: счётчик на корзине, карточки... Так же как и в корзине, мы формируем массив ХТМЛ элементов и перекидываем его в галлерею склонированного темплейла. Сеттер счётчика: получает число и перекидывает его методом родителя в счётчик корзины. Имеет метод для блокировки страницы.

### Product

Большой класс для отрисовки карточки. Картинка, категория через которую так же удалось нормально поменять цвета категорий. Загаловок, описание, кнопка на модалке, которая добавляет товар или удаляет товар из корзиныы. Цена, индекс(для отрисовки в корзине).
В данном классе в основном сеттеры, логика есть только в одном, который проверяет цену на null и заблокирует нам кнопку.

### Success

Последнее окно отображения. Победный шаг, содержит в себе кнопку закрытия и цену, которую мы вставляем с ответа сервера.


## Описание событий EventEmitter

- productList: changed, мы получили карточки в АппСтейдж - мы отрисовали карточки на странице.

- product: selected, мы нажали на карточку и передали её в АппСтейдж.

- clickedProduct: open, мы получили карточку в АппСтейдж и отрендерили её. В этой функции решил попробовать сразу реализовать логику поведения кнопок как внешнее так и функциональное... Кликаем на продукт, если он в корзине: кнопка меняется на удалить, нажимаем на кнопку, удаляем из корзины, меняем текст на добавить.

- basket:open открываем рендерим корзину.

- product: add/removeFromBasket добавляет удаляет карточку из корзины (из аппстейджа), а вот когда из аппстейджа удалим, тогда рендерим корзину заново.

- basket:change рендерим корзину по изменению товаров внутри

- user:notvalid когда юзер не прошёл валидацию через метод внутри АппСтейджа = выведем ошибки.

- payment:changed Меняем способ оплаты.

- events.on
/^order\..*:change/     передаём изменения в полях в соответствующие свойства юзера
- vents.on(
/^contacts\..*:change/

- order:open по сабмиту кнопки в корзине, открываем модалку с способом оплаты и адресом. Рендерим так, что поля сразу пустые и не валидные, ошибки сразу не показываем.

- order:submit по сабмиту кнопки с оплатой и адресом открываем модалку с телефоном и адресом эмайл

-contacts:submit отправляем готовый объект с товарами

P.S. к сожалению я не успел написать нормальную документацию, ибо торопился к дедлайну в воскресение. Я решил не описывать подробно каждый метод, а вместо этого решил кратко описать(и написать код), о том, какое у меня представление после спринта в голове.
