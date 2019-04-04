// 给需要变化对元素增加一个观察者，当数据变化后执行对应的方法
class Watcher {
  constructor(vm, expr, callback) {
    this.vm = vm;
    this.expr = expr;
    this.callback = callback;
    this.oldValue = this.getOldValue();
  }
  getVal(vm, expr) {
    expr = expr.split('.'); // message.a.b... [message, a, b, ...]
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  getOldValue() {
    Dep.target = this;
    let value = this.getVal(this.vm, this.expr);
    Dep.target = null;
    return value;
  }
  update() {
    let newValue = this.getVal(this.vm, this.expr);
    let oldValue = this.oldValue;
    if (newValue !== oldValue) {
      this.callback(newValue);
    }
  }
}
// vm.$watch(vm, 'a', function(params) {
// })