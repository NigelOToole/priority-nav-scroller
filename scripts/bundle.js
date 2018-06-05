(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _priorityNavScroller = require('./priority-nav-scroller.js');

var _priorityNavScroller2 = _interopRequireDefault(_priorityNavScroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // Init with default setup
// const priorityNavScrollerDefault = PriorityNavScroller();

// // Init with all options at default setting
// const priorityNavScrollerDefault = PriorityNavScroller({
//   selector: '.nav-scroller',
//   navSelector: '.nav-scroller-nav',
//   contentSelector: '.nav-scroller-content',
//   itemSelector: '.nav-scroller-item',
//   buttonLeftSelector: '.nav-scroller-btn--left',
//   buttonRightSelector: '.nav-scroller-btn--right',
//   scrollStep: 75
// });

// Init multiple nav scrollers with the same options
var navScrollers = document.querySelectorAll('.nav-scroller');

navScrollers.forEach(function (currentValue, currentIndex) {
  (0, _priorityNavScroller2.default)({
    selector: currentValue,
    scrollStep: 90
  });
});

},{"./priority-nav-scroller.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  Priority+ horizontal scrolling menu.

  @param {Object} object - Container for all options.
  @param {string || DOM node} selector - Element selector.
  @param {string} navSelector - Nav element selector.
  @param {string} contentSelector - Content element selector.
  @param {string} itemSelector - Items selector.
  @param {string} buttonLeftSelector - Left button selector.
  @param {string} buttonRightSelector - Right button selector.
  @param {integer || string} scrollStep - Amount to scroll on button click.

**/

var PriorityNavScroller = function PriorityNavScroller() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$selector = _ref.selector,
      selector = _ref$selector === undefined ? '.nav-scroller' : _ref$selector,
      _ref$navSelector = _ref.navSelector,
      navSelector = _ref$navSelector === undefined ? '.nav-scroller-nav' : _ref$navSelector,
      _ref$contentSelector = _ref.contentSelector,
      contentSelector = _ref$contentSelector === undefined ? '.nav-scroller-content' : _ref$contentSelector,
      _ref$itemSelector = _ref.itemSelector,
      itemSelector = _ref$itemSelector === undefined ? '.nav-scroller-item' : _ref$itemSelector,
      _ref$buttonLeftSelect = _ref.buttonLeftSelector,
      buttonLeftSelector = _ref$buttonLeftSelect === undefined ? '.nav-scroller-btn--left' : _ref$buttonLeftSelect,
      _ref$buttonRightSelec = _ref.buttonRightSelector,
      buttonRightSelector = _ref$buttonRightSelec === undefined ? '.nav-scroller-btn--right' : _ref$buttonRightSelec,
      _ref$scrollStep = _ref.scrollStep,
      scrollStep = _ref$scrollStep === undefined ? 75 : _ref$scrollStep;

  var navScroller = typeof selector === 'string' ? document.querySelector(selector) : selector;

  if (navScroller === undefined || navScroller === null || !Number.isInteger(scrollStep) && scrollStep !== 'calc') {
    throw new Error('There is something wrong with your selector.');
    return;
  }

  var navScrollerNav = navScroller.querySelector(navSelector);
  var navScrollerContent = navScroller.querySelector(contentSelector);
  var navScrollerContentItems = navScrollerContent.querySelectorAll(itemSelector);
  var navScrollerLeft = navScroller.querySelector(buttonLeftSelector);
  var navScrollerRight = navScroller.querySelector(buttonRightSelector);

  var scrolling = false;
  var scrollAvailableLeft = 0;
  var scrollAvailableRight = 0;
  var scrollingDirection = '';
  var scrollOverflow = '';
  var timeout = void 0;

  // Sets overflow and toggle buttons accordingly
  var setOverflow = function setOverflow() {
    scrollOverflow = getOverflow();
    toggleButtons(scrollOverflow);
  };

  // Debounce setting the overflow with requestAnimationFrame
  var requestSetOverflow = function requestSetOverflow() {
    if (timeout) window.cancelAnimationFrame(timeout);

    timeout = window.requestAnimationFrame(function () {
      setOverflow();
    });
  };

  // Gets the overflow on the nav scroller (left, right or both)
  var getOverflow = function getOverflow() {
    var scrollWidth = navScrollerNav.scrollWidth;
    var scrollViewport = navScrollerNav.clientWidth;
    var scrollLeft = navScrollerNav.scrollLeft;

    scrollAvailableLeft = scrollLeft;
    scrollAvailableRight = scrollWidth - (scrollViewport + scrollLeft);

    var scrollLeftCondition = scrollAvailableLeft > 1; // 1 instead of 0 to compensate for rounding errors from the browser
    var scrollRightCondition = scrollAvailableRight > 1;

    // console.log(scrollWidth, scrollViewport, scrollAvailableLeft, scrollAvailableRight);

    if (scrollLeftCondition && scrollRightCondition) {
      return 'both';
    } else if (scrollLeftCondition) {
      return 'left';
    } else if (scrollRightCondition) {
      return 'right';
    } else {
      return 'none';
    }
  };

  // Calculates the scroll step based on the width of the scroller and the number of links
  var calculateScrollStep = function calculateScrollStep() {
    var scrollViewportNoPadding = navScrollerNav.scrollWidth - (parseInt(getComputedStyle(navScrollerContent, null).getPropertyValue('padding-left'), 10) + parseInt(getComputedStyle(navScrollerContent, null).getPropertyValue('padding-right'), 10));

    var scrollStepAverage = Math.floor(scrollViewportNoPadding / navScrollerContentItems.length);

    scrollStep = scrollStepAverage;
    console.log(scrollStep);
  };

  // Move the scroller with a transform
  var moveScroller = function moveScroller(direction) {

    if (scrolling === true || scrollOverflow !== direction && scrollOverflow !== 'both') return;

    var scrollDistance = scrollStep;
    var scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight;

    // If there is less that 1.75 steps available then scroll the full way
    if (scrollAvailable < scrollStep * 1.75) {
      scrollDistance = scrollAvailable;
    }

    if (direction === 'right') {
      scrollDistance *= -1;
    }

    navScrollerContent.classList.remove('no-transition');
    navScrollerContent.style.transform = 'translateX(' + scrollDistance + 'px)';

    scrollingDirection = direction;
    scrolling = true;
  };

  // Set the scroller position and removes transform, called after moveScroller()
  var setScrollerPosition = function setScrollerPosition() {
    var style = window.getComputedStyle(navScrollerContent, null);
    var transform = style.getPropertyValue('transform');
    var transformValue = Math.abs(parseInt(transform.split(',')[4]) || 0);

    if (scrollingDirection === 'left') {
      transformValue *= -1;
    }

    navScrollerContent.classList.add('no-transition');
    navScrollerContent.style.transform = '';
    navScrollerNav.scrollLeft = navScrollerNav.scrollLeft + transformValue;
    navScrollerContent.classList.remove('no-transition');

    scrolling = false;
  };

  // Toggle buttons depending on overflow
  var toggleButtons = function toggleButtons(overflow) {
    if (overflow === 'both' || overflow === 'left') {
      navScrollerLeft.classList.add('active');
    } else {
      navScrollerLeft.classList.remove('active');
    }

    if (overflow === 'both' || overflow === 'right') {
      navScrollerRight.classList.add('active');
    } else {
      navScrollerRight.classList.remove('active');
    }
  };

  // Init plugin
  var init = function init() {
    setOverflow();

    if (scrollStep === 'calc') calculateScrollStep();

    window.addEventListener('resize', function () {
      requestSetOverflow();
    });

    navScrollerNav.addEventListener('scroll', function () {
      requestSetOverflow();
    });

    navScrollerContent.addEventListener('transitionend', function () {
      setScrollerPosition();
    });

    navScrollerLeft.addEventListener('click', function () {
      moveScroller('left');
    });

    navScrollerRight.addEventListener('click', function () {
      moveScroller('right');
    });
  };

  // Init is called by default
  init();

  // Reveal API
  return {
    init: init
  };
};

exports.default = PriorityNavScroller;

},{}]},{},[1])

//# sourceMappingURL=bundle.js.map
