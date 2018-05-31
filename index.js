(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.priorityNavScroller = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
    Horizontal scrolling menu.
  
    @param {Object} object - Container for all options.
    @param {string || DOM node} selector - Element selector.
    @param {string} navSelector - Nav element selector.
    @param {string} contentSelector - Content element selector.
    @param {string} itemSelector - Item elements selector.
    @param {string} buttonLeftSelector - Left button selector.
    @param {string} buttonRightSelector - Right button selector.
    @param {integer} scrollStep - Amount to scroll on button click.
  
  **/

  var priorityNavScroller = function priorityNavScroller() {
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

    if (navScroller === undefined || navScroller === null) {
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

    var intersectionOptions = {
      root: navScrollerNav, // relative to document viewport
      rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
      threshold: 1.0 // visible amount of item shown in relation to root
    };

    var observer = new IntersectionObserver(interectionChange, intersectionOptions);

    // Sets overflow and toggle buttons accordingly
    var setOverflow = function setOverflow() {
      scrollOverflow = getOverflow();
      toggleButtons(scrollOverflow);
      console.log(scrollOverflow);
    };

    function interectionChange(changes, observer) {
      changes.forEach(function (change) {
        setOverflow();

        if (change.intersectionRatio > 0) {
          console.log('overlap');
          setOverflow();
        }
      });
    }

    observer.observe(navScrollerContentItems[0]);
    observer.observe(navScrollerContentItems[navScrollerContentItems.length - 1]);

    // Debounce setting the overflow with requestAnimationFrame
    var requestSetOverflow = function requestSetOverflow() {
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }

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

      var scrollLeftCondition = scrollAvailableLeft > 0;
      var scrollRightCondition = scrollAvailableRight > 0;

      // console.log(scrollWidth, scrollViewport, scrollLeft, scrollAvailableLeft, scrollAvailableRight);

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

    // Move the scroller with a transform
    var moveScroller = function moveScroller(direction) {

      if (scrolling === true || scrollOverflow !== direction && scrollOverflow !== 'both') return;

      var scrollDistance = scrollStep;
      var scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight;

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

      // // Resize listener
      // window.addEventListener('resize', () => {
      //   requestSetOverflow();
      // });

      // // Scroll listener
      // navScrollerNav.addEventListener('scroll', () => {
      //   requestSetOverflow();
      // });

      // Set scroller position
      navScrollerContent.addEventListener('transitionend', function () {
        setScrollerPosition();
      });

      // Button listeners
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

  exports.default = priorityNavScroller;
});