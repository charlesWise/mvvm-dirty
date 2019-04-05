/**
 * 脏值检查 先保留原有值，有一个新值
 * $apply手动更新
 */
function Scope() {
  this.$$watchers = [];
}
Scope.prototype = {
  $watch(expr, fn) {
    // $watch 保留原有fn，有一个新值fn，还有当前老值
    this.$$watchers.push({
      fn,
      last: this[expr],
      expr
    })
  },
  $apply() {
    this.$digest();
  },
  $digest() {// 负责检查
    // 至少检查一次
    var dirty = true; // 默认只要调用$digest方法就应该去查一次
    var count = 9;
    do {
      dirty = this.$digestOne();
      if (count === 0) throw new Error('$digest 10');
    } while (dirty && count--);
  },
  $digestOne() {// 检查一次
    let dirty = false;
    this.$$watchers.forEach(watcher => {
      let oldVal = watcher.last, newVal = this[watcher.expr];
      if (newVal !== oldVal) {
        watcher.fn(newVal, oldVal); // 调用fn可能还会更改数据，就应该在查一遍
        dirty = true;
        watcher.last = newVal; // 更新老值
      }
    })
    return dirty;
  },
}
let scope = new Scope();
scope.name = 'charlesWise';
scope.$watch('name', function (newVal, oldVal) {
  scope.name = 'charlesWise hello world'
  console.warn(newVal, oldVal);
})
scope.name = 'charlesWise cool';
scope.$apply();

// vue Object.defineProperty、es6 proxy+reflect代理改写原生的方法set