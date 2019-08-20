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

const PriorityNavScroller = function({
    selector: selector = '.nav-scroller',
    navSelector: navSelector = '.nav-scroller-nav',
    contentSelector: contentSelector = '.nav-scroller-content',
    itemSelector: itemSelector = '.nav-scroller-item',
    buttonLeftSelector: buttonLeftSelector = '.nav-scroller-btn--left',
    buttonRightSelector: buttonRightSelector = '.nav-scroller-btn--right',
    scrollStep: scrollStep = 'average'
  } = {}) {

  const navScroller = typeof selector === 'string' ? document.querySelector(selector) : selector;

  const validateScrollStep = () => {
    return Number.isInteger(scrollStep) || scrollStep === 'average';
  }

  if (navScroller === undefined || navScroller === null || !validateScrollStep()) {
    throw new Error('There is something wrong with your selector(s).');
  }

  const navScrollerNav = navScroller.querySelector(navSelector);
  const navScrollerContent = navScroller.querySelector(contentSelector);
  const navScrollerContentItems = navScrollerContent.querySelectorAll(itemSelector);
  const navScrollerLeft = navScroller.querySelector(buttonLeftSelector);
  const navScrollerRight = navScroller.querySelector(buttonRightSelector);

  let scrolling = false;
  let scrollAvailableLeft = 0;
  let scrollAvailableRight = 0;
  let scrollingDirection = '';
  let scrollOverflow = '';
  let timeout;


  // Sets overflow and toggle buttons accordingly
  const setOverflow = function() {
    scrollOverflow = getOverflow();
    toggleButtons(scrollOverflow);
    calculateScrollStep();
  }


  // Debounce setting the overflow with requestAnimationFrame
  const requestSetOverflow = function() {
    if (timeout) window.cancelAnimationFrame(timeout);

    timeout = window.requestAnimationFrame(() => {
      setOverflow();
    });
  }


  // Gets the overflow available on the nav scroller
  const getOverflow = function() {
    let scrollWidth = navScrollerNav.scrollWidth;
    let scrollViewport = navScrollerNav.clientWidth;
    let scrollLeft = navScrollerNav.scrollLeft;

    scrollAvailableLeft = scrollLeft;
    scrollAvailableRight = scrollWidth - (scrollViewport + scrollLeft);

    // 1 instead of 0 to compensate for number rounding
    let scrollLeftCondition = scrollAvailableLeft > 1;
    let scrollRightCondition = scrollAvailableRight > 1;

    // console.log(scrollWidth, scrollViewport, scrollAvailableLeft, scrollAvailableRight);

    if (scrollLeftCondition && scrollRightCondition) {
      return 'both';
    }
    else if (scrollLeftCondition) {
      return 'left';
    }
    else if (scrollRightCondition) {
      return 'right';
    }
    else {
      return 'none';
    }

  }


  // Calculates the scroll step based on the width of the scroller and the number of links
  const calculateScrollStep = function() {
    if (scrollStep === 'average') {
      let scrollViewportNoPadding = navScrollerNav.scrollWidth - (parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-left')) + parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-right')));

      let scrollStepAverage = Math.floor(scrollViewportNoPadding / navScrollerContentItems.length);

      scrollStep = scrollStepAverage;
    }
  }


  // Move the scroller with a transform
  const moveScroller = function(direction) {

    if (scrolling === true || (scrollOverflow !== direction && scrollOverflow !== 'both')) return;

    let scrollDistance = scrollStep;
    let scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight;

    // If there is less that 1.8 steps available then scroll the full way
    if (scrollAvailable < (scrollStep * 1.8)) {
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


  // Set the scroller position and removes transform, called after moveScroller()
  const setScrollerPosition = function() {
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
  }


  // Toggle buttons depending on overflow
  const toggleButtons = function(overflow) {
    if (overflow === 'both' || overflow === 'left') {
      navScrollerLeft.classList.add('active');
    }
    else {
      navScrollerLeft.classList.remove('active');
    }

    if (overflow === 'both' || overflow === 'right') {
      navScrollerRight.classList.add('active');
    }
    else {
      navScrollerRight.classList.remove('active');
    }
  }


  const init = function() {

    setOverflow();

    window.addEventListener('resize', () => {
      requestSetOverflow();
    });

    navScrollerNav.addEventListener('scroll', () => {
      requestSetOverflow();
    });

    navScrollerContent.addEventListener('transitionend', () => {
      setScrollerPosition();
    });

    navScrollerLeft.addEventListener('click', () => {
      moveScroller('left');
    });

    navScrollerRight.addEventListener('click', () => {
      moveScroller('right');
    });

  };


  // Self init
  init();


  // Reveal API
  return {
    init
  };

};

export default PriorityNavScroller;
