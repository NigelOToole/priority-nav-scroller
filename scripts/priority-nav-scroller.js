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


const navScroller = function({
    wrapperSelector: wrapperSelector = '.nav-scroller-wrapper',
    selector: selector = '.nav-scroller',
    contentSelector: contentSelector = '.nav-scroller-content',
    buttonLeftSelector: buttonLeftSelector = '.nav-scroller-btn--left',
    buttonRightSelector: buttonRightSelector = '.nav-scroller-btn--right',
    scrollStep: scrollStep = 75
  } = {}) {

  let scrolling = false;
  let scrollingDirection = '';
  let scrollOverflow = '';
  let timeout;

  let navScrollerWrapper;

  if (wrapperSelector.nodeType === 1) {
    navScrollerWrapper = wrapperSelector;
  }
  else {
    navScrollerWrapper = document.querySelector(wrapperSelector);
  }
  if (navScrollerWrapper === undefined || navScrollerWrapper === null) return;

  let navScroller = navScrollerWrapper.querySelector(selector);
  let navScrollerContent = navScrollerWrapper.querySelector(contentSelector);
  let navScrollerLeft = navScrollerWrapper.querySelector(buttonLeftSelector);
  let navScrollerRight = navScrollerWrapper.querySelector(buttonRightSelector);


  // Sets overflow
  const setOverflow = function() {
    scrollOverflow = getOverflow(navScrollerContent, navScroller);
    toggleButtons(scrollOverflow);
  }


  // Debounce setting the overflow with requestAnimationFrame
  const requestSetOverflow = function() {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(() => {
      setOverflow();
    });
  }


  // Get overflow value on scroller
  const getOverflow = function(content, container) {
    let containerMetrics = container.getBoundingClientRect();
    let containerWidth = containerMetrics.width;
    let containerMetricsLeft = Math.floor(containerMetrics.left);

    // let contentMetrics = content.getBoundingClientRect();
    // let contentMetricsRight = Math.floor(contentMetrics.right);
    // let contentMetricsLeft = Math.floor(contentMetrics.left);


    let contentItems = content.querySelectorAll('.nav-scroller-item');
    let contentMetricsFirst = contentItems[0].getBoundingClientRect();
    let contentMetricsLast = contentItems[contentItems.length - 1].getBoundingClientRect();
    let contentMetricsRight = Math.floor(contentMetricsLast.right);
    let contentMetricsLeft = Math.floor(contentMetricsFirst.left);

    // Offset the values by the left value of the container
    let offset = containerMetricsLeft;
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
  }


  // Move the scroller with a transform
  const moveScroller = function(direction) {
    if (scrolling === true) return;

    setOverflow();

    let scrollDistance = scrollStep;
    let scrollAvailable;


    if (scrollOverflow === direction || scrollOverflow === 'both') {

      if (direction === 'left') {
        scrollAvailable = navScroller.scrollLeft;
      }

      if (direction === 'right') {
        let navScrollerRightEdge = navScroller.getBoundingClientRect().right;
        let navScrollerContentRightEdge = navScrollerContent.getBoundingClientRect().right;

        scrollAvailable = Math.floor(navScrollerContentRightEdge - navScrollerRightEdge);
      }

      // If there is less that 1.5 steps available then scroll the full way
      if (scrollAvailable < (scrollStep * 1.5)) {
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
    navScroller.scrollLeft = navScroller.scrollLeft + transformValue;
    navScrollerContent.classList.remove('no-transition');

    scrolling = false;
  }


  // Toggle buttons depending on overflow
  const toggleButtons = function(overflow) {
    navScrollerLeft.classList.remove('active');
    navScrollerRight.classList.remove('active');

    if (overflow === 'both' || overflow === 'left') {
      navScrollerLeft.classList.add('active');
    }

    if (overflow === 'both' || overflow === 'right') {
      navScrollerRight.classList.add('active');
    }
  }


  const init = function() {

    // Determine scroll overflow
    setOverflow();

    // Scroll listener
    navScroller.addEventListener('scroll', () => {
      requestSetOverflow();
    });

    // Resize listener
    window.addEventListener('resize', () => {
      requestSetOverflow();
    });

    // Button listeners
    navScrollerLeft.addEventListener('click', () => {
      moveScroller('left');
    });

    navScrollerRight.addEventListener('click', () => {
      moveScroller('right');
    });

    // Set scroller position
    navScrollerContent.addEventListener('transitionend', () => {
      setScrollerPosition();
    });

  };

  // Init is called by default
  init();


  // Reveal API
  return {
    init
  };

};

export default navScroller;
