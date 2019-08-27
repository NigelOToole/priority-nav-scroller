# Priority Nav Scroller

### Priority Nav Scroller is a plugin for the priority+ navigation pattern. When navigation items don’t fit on screen they are hidden and can be scrolled into view or using controls.

### [View demo](http://nigelotoole.github.io/priority-nav-scroller/)



## Installation
```javascript
$ npm install priority-nav-scroller --save-dev
```


## Usage

### Import JS

The script is an ES6(ES2015) module but the compiled version is included in the build as "src/scripts/priority-nav-scroller-umd.js". You can also copy "src/scripts/priority-nav-scroller.js" into your own site if your build process can accommodate ES6 modules.

```javascript
import PriorityNavScroller from './priority-nav-scroller.js';

// Init with default setup
const priorityNavScrollerDefault = PriorityNavScroller();

// Init with all options at default setting
const priorityNavScrollerDefault = PriorityNavScroller({
  selector: '.nav-scroller',
  navSelector: '.nav-scroller-nav',
  contentSelector: '.nav-scroller-content',
  itemSelector: '.nav-scroller-item',
  buttonLeftSelector: '.nav-scroller-btn--left',
  buttonRightSelector: '.nav-scroller-btn--right',
  scrollStep: 80
});

// Init multiple nav scrollers with the same options
let navScrollers = document.querySelectorAll('.nav-scroller');

navScrollers.forEach((currentValue, currentIndex) => {
  PriorityNavScroller({
    selector: currentValue
  });
});
```


### Options
| Property              | Default                    | Type          | Description                                                              |
| --------------------- | -------------------------- | ------------- | ------------------------------------------------------------------------ |
| `selector`            | '.nav-scroller'            | String/Node   | Container element selector.                                              |
| `navSelector`         | '.nav-scroller-nav'        | String        | Item element selector.                                                   |
| `contentSelector`     | '.nav-scroller-content'    | String        | Content element selector.                                                |
| `itemSelector`        | '.nav-scroller-item'       | String        | Item element selector.                                                   |
| `buttonLeftSelector`  | '.nav-scroller-btn--left'  | String        | Left button element selector.                                            |
| `buttonRightSelector` | '.nav-scroller-btn--right' | String        | Right button element selector.                                           |
| `scrollStep`          | 80                         | Number/String | Amount to scroll on button click. 'average' gets the average link width. |


### Import SASS

```scss
@import "node_modules/priority-nav-scroller/src/styles/priority-nav-scroller.scss";
```


### Markup

```html
<div class="nav-scroller">

  <nav class="nav-scroller-nav">
    <div class="nav-scroller-content">
      <a href="#" class="nav-scroller-item">Item 1</a>
      <a href="#" class="nav-scroller-item">Item 2</a>
      <a href="#" class="nav-scroller-item">Item 3</a>
      ...
    </div>
  </nav>

  <button class="nav-scroller-btn nav-scroller-btn--left">
    ...
  </button>

  <button class="nav-scroller-btn nav-scroller-btn--right">
    ...
  </button>

</div>
```



### Using other tags
The demos use a &lt;div&gt; for "nav-scroller-content" and &lt;a&gt; tags for the "nav-scroller-item" but you can also use a &lt;ul&gt; as below.

```html
<ul class="nav-scroller-content">
  <li class="nav-scroller-item"><a href="#" class="nav-scroller-item">Item 1</a></li>
  ...
```

The buttons use an svg for the arrow icon but this can be replaced with an image, text or html entities(&lt; &gt;, &larr; &rarr;, &#9668; &#9658;), just update the nav-scroller-button styles as needed.



## Compatibility

### Browser support
Supports all modern browsers(Firefox, Chrome and Edge) released as of January 2018. For older browsers you may need to include polyfills for Nodelist.forEach and Element.classList.



## Demo site
Clone or download from Github.

```javascript
$ npm install
$ gulp serve
```


### Credits
[A horizontal scrolling navigation pattern for touch and mouse with moving current indicator](https://benfrain.com/a-horizontal-scrolling-navigation-pattern-for-touch-and-mouse-with-moving-current-indicator/) by Ben Frain.<br>
[A Priority+ Navigation With Scrolling and Dropdowns](https://css-tricks.com/priority-navigation-scrolling-dropdowns/) by Micah Miller-Eshleman on CSS-Tricks.<br>
[The Priority+ Navigation Pattern](https://css-tricks.com/the-priority-navigation-pattern/) by Chris Coyier on CSS-Tricks.



### License
MIT © Nigel O Toole
