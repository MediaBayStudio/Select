# Select
Скрипт скрывает стандартный селект с опциями и вместо него создает легко стилизуемый блок-обертку, с загловком-заглушкой внутри, текст которой определяется `option` с атрибутом `selected` (или `option` с атрибутом `disabled`, если указан `multiple`), и список `ul` с вложенными элементами `li`.
Отслеживание клика происходит по элементам `li`. Выбранному элементу добавляется класс `active`. Значение выбранного элемента подставляется в заголовок и в списке выделяется классом `disabled`.
При создании списка, все классы берутся с элементов, которые уже есть в дереве.

Простая разметка:
```html
<select name="select-size" class="select-size__list">
  <option selected class="select-size__list-item">Выберите размер</option>
  <option value="44" class="select-size__list-item">44</option>
  <option value="46" class="select-size__list-item">46</option>
  <option value="48" class="select-size__list-item">48</option>
</select>
```

Если у `select` указан атрибут `multiple`, то можно будет выбрать несколько элементов из списка. У элемента-заголовка должен быть атрибут `disabled`, например:
```html
<select name="select-size[]" class="select-size" multiple>
  <option disabled class="select-size__item">Выберите размер</option>
  <option selected value="44" class="select-size__item">44</option>
  <option selected value="46" class="select-size__item">46</option>
  <option selected value="48" class="select-size__item">48</option>
</select>
```
Если нужна кнопка "выбрать все", то нужнно задать соответствующему элементу `value="all"`:
```html
<option value="all" class="select-size__item">Выбрать все</option>
```
В таком случае, при клике по этому элементу, выбран будет только он, с других элементов выбор будет снят.
Преобразуется в:
```html
<div>
  <span>Выберите размер</span>
  <ul class="select-size">
    <li class="select-size__item">44</li>
    <li class="select-size__item">46</li>
    <li class="select-size__item">48</li>
  </ul>
</div>
```
Если у `select` указаны атрибуты `multiple` и `size` больше 2, то будет создан блок с прокруткой.
При клике по блоку-обертке `div`, ему добавляется класс `active`. В стилях нужно настроить поведение выпадающего списка, например:
```css
.select-size__list {
  opacity: 0;
  visibility: hidden;
  transition: opacity .5s, visibility .5s;
}

div.active > .select-size__list {
  opacity: 1;
  visibility: visible;
}
```
Далее нужно инизиализировать селект:
```javascript
let selectSize = new Select('.select-size__list');
```
И скриптом будет построена такая конструкция:
```html
<div>
  <span>Выберите размер</span>
  <ul class="select-size__list">
    <li class="select-size__list-item">44</li>
    <li class="select-size__list-item">46</li>
    <li class="select-size__list-item">48</li>
  </ul>
  <!-- Стандартный селект будет скрыт -->
  <select name="select-size" class="select-size__list" style="display:none">
    <option>Значение</option>
  </select>
</div>
```
Значение выбранного `li` будет подставлено в стандартный `select`, который скрыт. И если он находится в форме, то данные будут получены через `name="select-size"`.

Чтобы создать более сложный список с вложенными элементами, можно для каждого `option` задать атрибут `label` с контентом, который будет вставлен внутрь элемента списка `li`. Также можно задать классы для блока-обертки и заголовка.
```html
<select name="select-car" class="select-car__list">
  <option label="<span class='left'>bmw</span><span class='right'>112i</span>" value="bmw 112i" class="select-car__list-item"></option>
  <option label="<span class='left'>bmw</span><span class='right'>212i</span>" value="bmw 212i" class="select-car__list-item"></option>
  <option label="<span class='left'>bmw</span><span class='right'>312i</span>" value="bmw 312i" class="select-car__list-item"></option>
</select>
```
```javascript
let selectSize = new Select('.select-car__list', {
  wrapperClass: 'select-car',
  titleClass: 'select-car__title'
});
```
В таком случае получится:
```html
<div class="select-car">
  <span class="select-car__title">Выберите автомобиль</span>
  <ul class="select-size__list">
    <li class="select-size__list-item">
      <span class='left'>bmw</span>
      <span class='right'>112i</span>
    </li>
    <li class="select-size__list-item">
      <span class='left'>bmw</span>
      <span class='right'>212i</span>
    </li>
    <li class="select-size__list-item">
      <span class='left'>bmw</span>
      <span class='right'>312i</span>
    </li>
  </ul>
</div>

```
Если нужна дополнительная оберка или разметка, можно указать шаблон:
```javascript
let selectSize = new Select('.select-car__list', {
  wrapperClass: 'select-car',
  titleClass: 'select-car__title',
  setListTemplate: function(list) {
    return
    `<div class="select-car__list-wrapper">
      <div class="select-car__list__heading">
        <span class="select-car__mark">Марка</span>
        <span class="select-car__model">Модель</span>
      </div>
      ${list}
      <div class="select-car__bottom">
        <a href="catalog.php" class="select-car__link">Перейти в каталог</a>
      </div>`;
  }
});
```
Тогда разметка будет выглядеть так:
```html
<div class="select-car">
  <span class="select-car__title">Выберите автомобиль</span>
  <div class="select-car__list-wrapper">
    <div class="select-car__list__heading">
      <span class="select-car__mark">Марка</span>
      <span class="select-car__model">Модель</span>
    </div>
    <ul class="select-size__list">
      <li class="select-size__list-item">
        <span class='left'>bmw</span>
        <span class='right'>112i</span>
      </li>
      <li class="select-size__list-item">
        <span class='left'>bmw</span>
        <span class='right'>212i</span>
      </li>
      <li class="select-size__list-item">
        <span class='left'>bmw</span>
        <span class='right'>312i</span>
      </li>
    </ul>
    <div class="select-car__bottom">
      <a href="catalog.php" class="select-car__link">Перейти в каталог</a>
    </div>
  </div>
</div>
<!-- Стандартный селект будет скрыт -->
<select name="select-size" class="select-size__list" style="display:none">
  <option>Значение</option>
  <option>Значение</option>
  <option>Значение</option>
</select>

```


Все настройки:
```javascript
let selectSize = new Select('.select-car__list', {
  wrapperClass: 'select-car',
  titleClass: 'select-car__title',
  setListTemplate: function(list) {
    return list;
  },
  openOnHover: false,
  openOnClick: true,
  escToClose: true,
  outsideClickToClose: true
});
```

Методы:
`selectSize.openSelect()`
`selectSize.closeSelect()`
`selectSize.getValue()`
`selectSize.setValue()`

События:
`openselect`
`closeselect`
`changevalue`