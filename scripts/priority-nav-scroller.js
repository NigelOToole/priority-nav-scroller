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


const priorityNavScroller = function({
    selector: selector = '.nav-scroller',
    navSelector: navSelector = '.nav-scroller-nav',
    contentSelector: contentSelector = '.nav-scroller-content',
    itemSelector: itemSelector = '.nav-scroller-item',
    buttonLeftSelector: buttonLeftSelector = '.nav-scroller-btn--left',
    buttonRightSelector: buttonRightSelector = '.nav-scroller-btn--right',
    scrollStep: scrollStep = 75
  } = {}) {

  let navScroller = typeof selector === 'string' ? document.querySelector(selector) : selector;

  if (navScroller === undefined || navScroller === null) {
    throw new Error('There is something wrong with your selector.');
    return;
  }

  let navScrollerNav = navScroller.querySelector(navSelector);
  let navScrollerContent = navScroller.querySelector(contentSelector);
  let navScrollerContentItems = navScrollerContent.querySelectorAll(itemSelector);
  let navScrollerLeft = navScroller.querySelector(buttonLeftSelector);
  let navScrollerRight = navScroller.querySelector(buttonRightSelector);

  let scrolling = false;
  let scrollAvailableLeft = 0;
  let scrollAvailableRight = 0;
  let scrollingDirection = '';
  let scrollOverflow = '';
  let timeout;

  // let ioOptions = {
  //   root: navScrollerNav, // relative to document viewport
  //   rootMargin: `0px`, // margin around root. Values are similar to css property. Unitless values not allowed
  //   threshold: 1.0 // visible amount of item shown in relation to root
  // };
  // let observer = new IntersectionObserver(onChange, ioOptions);

  // function onChange(changes, observer) {
  //   changes.forEach(change => {
  //       if (change.intersectionRatio > 0) {
  //         console.log('overlap');
  //       }
  //   });
  // }

  // observer.observe(navScrollerContentItems[0]);

  // Sets overflow and toggle buttons accordingly
  const setOverflow = function() {
    scrollOverflow = getOverflow();
    // console.log(scrollOverflow, getOverflow2());
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


  // // Gets the overflow on the nav scroller (left, right or both)
  // const getOverflow = function() {
  //   let containerMetrics = navScrollerNav.getBoundingClientRect();
  //   let containerWidth = Math.floor(containerMetrics.width);
  //   let containerMetricsLeft = Math.floor(containerMetrics.left);
  //   let containerMetricsRight = Math.floor(containerMetrics.right);

  //   let contentMetricsFirst = navScrollerContentItems[0].getBoundingClientRect();
  //   let contentMetricsLast = navScrollerContentItems[navScrollerContentItems.length - 1].getBoundingClientRect();
  //   let contentMetricsLeft = Math.floor(contentMetricsFirst.left);
  //   let contentMetricsRight = Math.floor(contentMetricsLast.right);

  //   scrollAvailableLeft = navScrollerNav.scrollLeft;
  //   scrollAvailableRight = contentMetricsRight - containerMetricsRight;

  //   // Offset the values by the left value of the container
  //   let offset = containerMetricsLeft;
  //   containerMetricsLeft -= offset;
  //   contentMetricsRight -= offset + 1; // Fixes an off by one bug in iOS
  //   contentMetricsLeft -= offset;

  //   if (containerMetricsLeft > contentMetricsLeft && containerWidth < contentMetricsRight) {
  //       return 'both';
  //   } else if (contentMetricsLeft < containerMetricsLeft) {
  //       return 'left';
  //   } else if (contentMetricsRight > containerWidth) {
  //       return 'right';
  //   } else {
  //       return 'none';
  //   }
  // }


  // Gets the overflow on the nav scroller (left, right or both)
  const getOverflow = function() {
    let scrollWidth = navScrollerNav.scrollWidth;
    let scrollViewport = navScrollerNav.clientWidth;
    let scrollLeft = navScrollerNav.scrollLeft;

    scrollAvailableLeft = scrollLeft;
    scrollAvailableRight = scrollWidth - (scrollViewport + scrollLeft);

    let scrollLeftCondition = scrollAvailableLeft > 0;
    let scrollRightCondition = scrollAvailableRight > 0;

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

    // console.log(scrollWidth, scrollViewport, scrollLeft, scrollAvailableLeft, scrollAvailableRight);
  }



  // Move the scroller with a transform
  const moveScroller = function(direction) {

    if (scrolling === true || (scrollOverflow !== direction && scrollOverflow !== 'both')) return;

    let scrollDistance = scrollStep;
    let scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight;

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

    // Resize listener
    window.addEventListener('resize', () => {
      requestSetOverflow();
    });

    // Scroll listener
    navScrollerNav.addEventListener('scroll', () => {
      requestSetOverflow();
    });

    // Set scroller position
    navScrollerContent.addEventListener('transitionend', () => {
      setScrollerPosition();
    });

    // Button listeners
    navScrollerLeft.addEventListener('click', () => {
      moveScroller('left');
    });

    navScrollerRight.addEventListener('click', () => {
      moveScroller('right');
    });

  };


  // Init is called by default
  init();


  // Reveal API
  return {
    init
  };

};

export default priorityNavScroller;
