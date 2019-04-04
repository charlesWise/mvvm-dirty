class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(data) {
    if(!data || typeof data !== 'object') return;
    // 要将数据--劫持
    Object.keys(data).forEach(key => {
      // 劫持
      this.defineReactive(data, key, data[key]);
      this.observer(data[key]);
    });
  }
  defineReactive(obj, key, value) {
    let that = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if(newValue !== value) {
          that.observer(newValue);
          value = newValue;
          dep.notify();
        }
      }
    })
  }
}

// 发布订阅
class Dep {
  constructor() {
    // 订阅数组
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}