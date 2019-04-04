class MVVM {
  constructor (options) {
    this.$el = options.el;
    this.$data = options.data;
    if (this.$el) {
      // 数据劫持，就是把对象对所有属性改成get和set方法
      new Observer(this.$data);
      // 代理到vm上 vm.$data.message这样反问变成vm.message访问
      this.proxyData(this.$data);
      // 用数据和元素进行编译
      new Compile(this.$el, this);
    }
  }
  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newValue) {
          data[key] = newValue;
        }
      })
    })
  }
}