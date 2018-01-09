new Vue({
  el: '#app',
  data: {
    total: 0,
    price: 9.99,
    stock: [],
    cart: [],
    search: 'guitar',
    lastSearch: '',
    loading: false
  },
  mounted: function () {
    // start with a basic search result
    this.onSubmit();
  },

  methods: {
    onSubmit: function () {
      if (!this.search) return;
      this.loading = true;
      this.stock = [];
      this.$http
        .get('/search/'.concat(this.search))
        .then( function(resp) {
          this.stock = resp.data;
          this.loading = false;
          this.lastSearch = this.search;
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
      for (var j = 0; j < this.stock.length; j++) {
        if (this.stock[j].id === index) {
          item = this.stock[j];
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
  }
});
