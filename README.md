### 简易mvvm实现
new MVVM()
#### 具体实现
``` bash
let vm = new MVVM({
  el: '#app',
  data: {
    message: 'hello world',
    msg: {
      age: 18
    }
  }
})
一、compile编译模版
  对每个元素节点的指令、数据和元素进行编译
  1、把真实的dom移到到内存 fragment：
    创建文档碎片 let fragment = document.createDocumentFragment();
    巧妙使用
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    }
    在内存中完成compile
  2、编译 提取想要到元素节点
  3、把编译好的fragment塞到页面去
二、observer数据劫持
  数据劫持，就是把对象对所有属性改成get和set方法，get中添加订阅，set中notify发布订阅
三、watcher观察者
  1、model、text等CompileUtil中添加new Watcher(vm, expr, callback)监听view等变化，一旦变化触发setter，Dep发布订阅执行notify通知watcher.update()执行，callback函数执行渲染视图；
  2、当model数据层发生变化，触发getter函数Dep中添加订阅，diff算法patch函数渲染dom
  ...
四、dep发布订阅
  内部维护了一个数组，用来收集订阅者（Watcher），数据变动触发notify函数，再调用订阅者的update
```
#### 如何将数据代理到vm上
``` bash
  在劫持完数据遍历属性data值Object.defineProperty代理到this上即vm上
```

#### mvvm.html
``` bash
  1、数据data值通过new vm()对象进行绑定
  2、通过文档碎片在内存中操作document.createDocumentFragment()，找到v-、{{}}等节点
  3、遍历替换相应元素、节点
  4、把数据绑定到vm上，通过上到prototype上update、bindNode等
```