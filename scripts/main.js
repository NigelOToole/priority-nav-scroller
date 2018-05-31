import PriorityNavScroller from './priority-nav-scroller.js';

// Example
// const navScrollerLinksLg = PriorityNavScroller({
//   selector: '.nav-scroller--demo-links-lg'
// });

// const navScrollerLinksSm = PriorityNavScroller({
//   selector: '.nav-scroller--demo-links-sm'
// });



// Init multiple nav scrollers with the same options
let navScrollers = document.querySelectorAll('.nav-scroller');

navScrollers.forEach((currentValue, currentIndex) => {
  PriorityNavScroller({
    selector: currentValue
  });
});
