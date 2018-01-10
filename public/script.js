var PRICE = 9.99;
var LOAD_NUM = 7;

new Vue({
  el: '#app',
  data: {
    total: 0,
    price: PRICE,
    visibleStock: [],
    fullStock: [],
    cart: [],
    search: 'guitar',
    lastSearch: '',
    loading: false
  },
  computed: {
    moreItems: function () {
      return this.fullStock.length > this.visibleStock.length;
    }
  },

  methods: {
    appendItems: function () {
      // append more items to the visible stock, but not more than LOAD_NUM
      var addMax = this.visibleStock.length + Math.min(this.fullStock.length - this.visibleStock.length, LOAD_NUM);
      for (var index = this.visibleStock.length; index < addMax; index++) {
        this.visibleStock.push(this.fullStock[index]);
      }
    },
    onSubmit: function () {
      if (!this.search) return;
      this.loading = true;
      this.visibleStock = [];
      this.$http
        .get('/search/'.concat(this.search))
        .then( function(resp) {
          this.lastSearch = this.search;
          this.fullStock = resp.data;
          // at first, show only part of the results
          this.visibleStock = this.fullStock.slice(0, LOAD_NUM);
          this.loading = false;
        })
      ;
    },
    addItem: function (index, decrement) {
      if (!decrement)
        this.total += this.price;
      else
        this.total -= this.price;
      if (this.total < 0) {
        this.total = 0;
        this.cart = [];
        return;
      }
      var item;
      // find the item in our stock
      for (var j = 0; j < this.visibleStock.length; j++) {
        if (this.visibleStock[j].id === index) {
          item = this.visibleStock[j];
          break;
        }
      }
      if (!item) return;

      // check if the item already is in the cart
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          if (!decrement) {
            this.cart[i].qty += 1;
            return;
          }
          this.cart[i].qty -= 1;
          if (this.cart[i].qty < 1)
            this.cart.splice(i, 1);
          return;
        }
      }
      // item was not yet in the cart, so we add it
      this.cart.push({
        title: item.title,
        id: item.id,
        qty: 1
      });
    },
  },

  filters: {
    currency: function (value) {
      if (!value) return '';
      if (!isNaN(value)) {
        return '€'.concat(value.toFixed(2));
      }
    }
  },
  mounted: function () {
    // start with a basic search result
    this.onSubmit();

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport( function() {
      vueInstance.appendItems();
    });
  }
});
