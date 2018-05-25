(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _priorityNavScroller = require('./priority-nav-scroller.js');

var _priorityNavScroller2 = _interopRequireDefault(_priorityNavScroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Example
var navScrollerExample = (0, _priorityNavScroller2.default)({});

// const navScrollerExample2 = navScroller({
//   wrapperSelector: '.nav-scroller-wrapper2',
//   selector: '.nav-scroller2',
//   contentSelector: '.nav-scroller-content2'
// });

// const navScrollerExample3 = navScroller({
//   wrapperSelector: '.nav-scroller-wrapper3',
//   selector: '.nav-scroller3',
//   contentSelector: '.nav-scroller-content3'
// });

},{"./priority-nav-scroller.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  Horizontal scrolling menu.

  @param {Object} object - Container for all options.
  @param {string || DOM node} wrapperSelector - Container element selector.
  @param {string} selector - Scroller element selector.
  @param {string} contentSelector - Scroller content element selector.
  @param {string} buttonLeftSelector - Left button selector.
  @param {string} buttonRightSelector - Right button selector.
  @param {integer} scrollStep - Amount to scroll on button click.

**/

var navScroller = function navScroller() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$wrapperSelector = _ref.wrapperSelector,
      wrapperSelector = _ref$wrapperSelector === undefined ? '.nav-scroller-wrapper' : _ref$wrapperSelector,
      _ref$selector = _ref.selector,
      selector = _ref$selector === undefined ? '.nav-scroller' : _ref$selector,
      _ref$contentSelector = _ref.contentSelector,
      contentSelector = _ref$contentSelector === undefined ? '.nav-scroller-content' : _ref$contentSelector,
      _ref$buttonLeftSelect = _ref.buttonLeftSelector,
      buttonLeftSelector = _ref$buttonLeftSelect === undefined ? '.nav-scroller-btn--left' : _ref$buttonLeftSelect,
      _ref$buttonRightSelec = _ref.buttonRightSelector,
      buttonRightSelector = _ref$buttonRightSelec === undefined ? '.nav-scroller-btn--right' : _ref$buttonRightSelec,
      _ref$scrollStep = _ref.scrollStep,
      scrollStep = _ref$scrollStep === undefined ? 75 : _ref$scrollStep;

  var scrolling = false;
  var scrollingDirection = '';
  var scrollOverflow = '';
  var timeout = void 0;

  var navScrollerWrapper = void 0;

  if (wrapperSelector.nodeType === 1) {
    navScrollerWrapper = wrapperSelector;
  } else {
    navScrollerWrapper = document.querySelector(wrapperSelector);
  }
  if (navScrollerWrapper === undefined || navScrollerWrapper === null) return;

  var navScroller = navScrollerWrapper.querySelector(selector);
  var navScrollerContent = navScrollerWrapper.querySelector(contentSelector);
  var navScrollerLeft = navScrollerWrapper.querySelector(buttonLeftSelector);
  var navScrollerRight = navScrollerWrapper.querySelector(buttonRightSelector);

  // Sets overflow
  var setOverflow = function setOverflow() {
    scrollOverflow = getOverflow(navScrollerContent, navScroller);
    toggleButtons(scrollOverflow);
  };

  // Debounce setting the overflow with requestAnimationFrame
  var requestSetOverflow = function requestSetOverflow() {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(function () {
      setOverflow();
    });
  };

  // Get overflow value on scroller
  var getOverflow = function getOverflow(content, container) {
    var containerMetrics = container.getBoundingClientRect();
    var containerWidth = containerMetrics.width;
    var containerMetricsLeft = Math.floor(containerMetrics.left);

    // let contentMetrics = content.getBoundingClientRect();
    // let contentMetricsRight = Math.floor(contentMetrics.right);
    // let contentMetricsLeft = Math.floor(contentMetrics.left);


    var contentItems = content.querySelectorAll('.nav-scroller-item');
    var contentMetricsFirst = contentItems[0].getBoundingClientRect();
    var contentMetricsLast = contentItems[contentItems.length - 1].getBoundingClientRect();
    var contentMetricsRight = Math.floor(contentMetricsLast.right);
    var contentMetricsLeft = Math.floor(contentMetricsFirst.left);

    // Offset the values by the left value of the container
    var offset = containerMetricsLeft;
    containerMetricsLeft -= offset;
    contentMetricsRight -= offset + 1; // Due to an off by one bug in iOS
    contentMetricsLeft -= offset;

    // console.log (containerMetricsLeft, contentMetricsLeft, containerWidth, contentMetricsRight);

    if (containerMetricsLeft > contentMetricsLeft && containerWidth < contentMetricsRight) {
      return 'both';
    } else if (contentMetricsLeft < containerMetricsLeft) {
      return 'left';
    } else if (contentMetricsRight > containerWidth) {
      return 'right';
    } else {
      return 'none';
    }
  };

  // Move the scroller with a transform
  var moveScroller = function moveScroller(direction) {
    if (scrolling === true) return;

    setOverflow();

    var scrollDistance = scrollStep;
    var scrollAvailable = void 0;

    if (scrollOverflow === direction || scrollOverflow === 'both') {

      if (direction === 'left') {
        scrollAvailable = navScroller.scrollLeft;
      }

      if (direction === 'right') {
        var navScrollerRightEdge = navScroller.getBoundingClientRect().right;
        var navScrollerContentRightEdge = navScrollerContent.getBoundingClientRect().right;

        scrollAvailable = Math.floor(navScrollerContentRightEdge - navScrollerRightEdge);
      }

      // If there is less that 1.5 steps available then scroll the full way
      if (scrollAvailable < scrollStep * 1.5) {
        scrollDistance = scrollAvailable;
      }

      if (direction === 'right') {
        scrollDistance *= -1;
      }

      navScrollerContent.classList.remove('no-transition');
      navScrollerContent.style.transform = 'translateX(' + scrollDistance + 'px)';

      scrollingDirection = direction;
      scrolling = true;
    }
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
    navScroller.scrollLeft = navScroller.scrollLeft + transformValue;
    navScrollerContent.classList.remove('no-transition');

    scrolling = false;
  };

  // Toggle buttons depending on overflow
  var toggleButtons = function toggleButtons(overflow) {
    navScrollerLeft.classList.remove('active');
    navScrollerRight.classList.remove('active');

    if (overflow === 'both' || overflow === 'left') {
      navScrollerLeft.classList.add('active');
    }

    if (overflow === 'both' || overflow === 'right') {
      navScrollerRight.classList.add('active');
    }
  };

  var init = function init() {

    // Determine scroll overflow
    setOverflow();

    // Scroll listener
    navScroller.addEventListener('scroll', function () {
      requestSetOverflow();
    });

    // Resize listener
    window.addEventListener('resize', function () {
      requestSetOverflow();
    });

    // Button listeners
    navScrollerLeft.addEventListener('click', function () {
      moveScroller('left');
    });

    navScrollerRight.addEventListener('click', function () {
      moveScroller('right');
    });

    // Set scroller position
    navScrollerContent.addEventListener('transitionend', function () {
      setScrollerPosition();
    });
  };

  // Init is called by default
  init();

  // Reveal API
  return {
    init: init
  };
};

exports.default = navScroller;

},{}]},{},[1])

//# sourceMappingURL=bundle.js.map
