new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [
      { id: 0, title: 'item1', price: 2.99 },
      { id: 1, title: 'item2', price: 3.99 },
      { id: 2, title: 'item3', price: 5.99 }
    ],
    cart: [],
    search: ''
  },

  methods: {
    onSubmit: function () {
      if (!this.search) return;
      console.log('submitted', this.search);
    },
    addItem: function (index, decrement) {
      if (!decrement)
        this.total += this.items[index].price;
      else
        this.total -= this.items[index].price;

      var item = this.items[index];
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
      item.qty = 1;
      this.cart.push(item);
    },
  },

  filters: {
    currency: function (value) {
      if (!value) return '';
      if (!isNaN(value)) {
        return '€' + value.toFixed(2);
      }
    }
  }
});
