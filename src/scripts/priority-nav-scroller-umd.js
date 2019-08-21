(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.priorityNavScroller = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = void 0;

  /**
    Priority+ horizontal scrolling menu.
  
    @param {Object} object - Container for all options.
      @param {string || DOM node} selector - Element selector.
      @param {string} navSelector - Nav element selector.
      @param {string} contentSelector - Content element selector.
      @param {string} itemSelector - Items selector.
      @param {string} buttonLeftSelector - Left button selector.
      @param {string} buttonRightSelector - Right button selector.
      @param {integer || string} scrollStep - Amount to scroll on button click. 'average' gets the average link width.
  */
  var PriorityNavScroller = function PriorityNavScroller() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? '.nav-scroller' : _ref$selector,
        _ref$navSelector = _ref.navSelector,
        navSelector = _ref$navSelector === void 0 ? '.nav-scroller-nav' : _ref$navSelector,
        _ref$contentSelector = _ref.contentSelector,
        contentSelector = _ref$contentSelector === void 0 ? '.nav-scroller-content' : _ref$contentSelector,
        _ref$itemSelector = _ref.itemSelector,
        itemSelector = _ref$itemSelector === void 0 ? '.nav-scroller-item' : _ref$itemSelector,
        _ref$buttonLeftSelect = _ref.buttonLeftSelector,
        buttonLeftSelector = _ref$buttonLeftSelect === void 0 ? '.nav-scroller-btn--left' : _ref$buttonLeftSelect,
        _ref$buttonRightSelec = _ref.buttonRightSelector,
        buttonRightSelector = _ref$buttonRightSelec === void 0 ? '.nav-scroller-btn--right' : _ref$buttonRightSelec,
        _ref$scrollStep = _ref.scrollStep,
        scrollStep = _ref$scrollStep === void 0 ? 80 : _ref$scrollStep,
        _ref$scrollStepRoundi = _ref.scrollStepRounding,
        scrollStepRounding = _ref$scrollStepRoundi === void 0 ? 80 : _ref$scrollStepRoundi;

    var navScroller = typeof selector === 'string' ? document.querySelector(selector) : selector;

    var validateScrollStep = function validateScrollStep() {
      return Number.isInteger(scrollStep) || scrollStep === 'average';
    };

    if (navScroller === undefined || navScroller === null || !validateScrollStep() || scrollStepRounding < 0 || scrollStepRounding > 100) {
      throw new Error('There is something wrong, check your options.');
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
    var timeout;
    scrollStepRounding *= .01; // Convert to decimal
    // Sets overflow and toggle buttons accordingly

    var setOverflow = function setOverflow() {
      scrollOverflow = getOverflow();
      toggleButtons(scrollOverflow);
      calculateScrollStep();
    }; // Debounce setting the overflow with requestAnimationFrame


    var requestSetOverflow = function requestSetOverflow() {
      if (timeout) window.cancelAnimationFrame(timeout);
      timeout = window.requestAnimationFrame(function () {
        setOverflow();
      });
    }; // Gets the overflow available on the nav scroller


    var getOverflow = function getOverflow() {
      var scrollWidth = navScrollerNav.scrollWidth;
      var scrollViewport = navScrollerNav.clientWidth;
      var scrollLeft = navScrollerNav.scrollLeft;
      scrollAvailableLeft = scrollLeft;
      scrollAvailableRight = scrollWidth - (scrollViewport + scrollLeft); // 1 instead of 0 to compensate for number rounding

      var scrollLeftCondition = scrollAvailableLeft > 1;
      var scrollRightCondition = scrollAvailableRight > 1; // console.log(scrollWidth, scrollViewport, scrollAvailableLeft, scrollAvailableRight);

      if (scrollLeftCondition && scrollRightCondition) {
        return 'both';
      } else if (scrollLeftCondition) {
        return 'left';
      } else if (scrollRightCondition) {
        return 'right';
      } else {
        return 'none';
      }
    }; // Calculates the scroll step based on the width of the scroller and the number of links


    var calculateScrollStep = function calculateScrollStep() {
      if (scrollStep === 'average') {
        var scrollViewportNoPadding = navScrollerNav.scrollWidth - (parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-left')) + parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-right')));
        var scrollStepAverage = Math.floor(scrollViewportNoPadding / navScrollerContentItems.length);
        scrollStep = scrollStepAverage;
      }
    }; // Move the scroller with a transform


    var moveScroller = function moveScroller(direction) {
      if (scrolling === true || scrollOverflow !== direction && scrollOverflow !== 'both') return;
      var scrollDistance = scrollStep;
      var scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight;
      var scrollAvailableOpposite = direction === 'left' ? scrollAvailableRight : scrollAvailableLeft; // If there will be less than 25% of the last step visible then scroll to the end

      if (scrollAvailable < scrollStep * 1.75) {
        scrollDistance = scrollAvailable;
      } else {// if (scrollStepRounding !== 0) {
        //   let scrollPartial = (scrollAvailableOpposite % scrollStep) / scrollStep;
        //   console.log(scrollPartial);
        //   // console.log(scrollAvailableOpposite % scrollStep);
        //   // If the next step change will cover up an item more than scrollRounding as a percentage then go to the next step
        //   if (scrollPartial >= scrollStepRounding) {
        //     scrollDistance = scrollStep + (scrollStep - (scrollAvailableOpposite % scrollStep));
        //     console.log(scrollDistance);
        //   }
        //   // If scroll is less than the inverse of scrollRounding as a percentage inside the current step then go to the end of that step
        //   if (scrollPartial < (1 - scrollStepRounding)) {
        //     scrollDistance = scrollStep - (scrollAvailableOpposite % scrollStep);
        //     console.log(scrollDistance);
        //   }
        // }
      }

      if (direction === 'right') {
        scrollDistance *= -1;
      }

      navScrollerContent.classList.remove('no-transition');
      navScrollerContent.style.transform = 'translateX(' + scrollDistance + 'px)';
      scrollingDirection = direction;
      scrolling = true;
    }; // Set the scroller position and removes transform, called after moveScroller() in the transitionend event


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
    }; // Toggle buttons depending on overflow


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

    var init = function init() {
      setOverflow();
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
    }; // Self init


    init(); // Reveal API

    return {
      init: init
    };
  };

  var _default = PriorityNavScroller;
  _exports["default"] = _default;
});