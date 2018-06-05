import PriorityNavScroller from './priority-nav-scroller.js';

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
let navScrollers = document.querySelectorAll('.nav-scroller');

navScrollers.forEach((currentValue, currentIndex) => {
  PriorityNavScroller({
    selector: currentValue,
    scrollStep: 90
  });
});
