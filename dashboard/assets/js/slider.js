jQuery(".top-seller-list").owlCarousel({
  loop: true,
  nav: true,
  items: 4,
  dots: false,
  margin: 20,
  autoHeight: true,
  autoplayTimeout: 7000,
  smartSpeed: 800,
  responsive: {
    0: {
      items: 1,
    },

    600: {
      items: 1,
      nav: false,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
    },

    1024: {
      items: 4,
    },

    1366: {
      items: 4,
    },
  },
});
