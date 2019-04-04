class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    if (this.el) {
      /**
       *  1、把真实的dom移到到内存 fragment
       */
      let fragment = this.node2Fragment(this.el);
      /**
       * 2、编译 提取想要到元素节点
       */
      this.compile(fragment);
      /**
       * 3、把编译好的fragment塞到页面去
       */
      this.el.appendChild(fragment);
    }
  }
  /**
   * 辅助utils
   */
  isElementNode(node) {
    return node.nodeType === 1;// 是元素节点
  }
  isDirective(name) {
    return name.includes('v-');
  }
  /**
   * 核心utils
   */
  node2Fragment(el) {
    // 文档碎片
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment; // 内存节点
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) { // 元素节点
        this.compileElement(node);
        this.compile(node); // 继续递归生成文本节点
      } else { // 文本节点
        this.compileText(node);
      }
    })
  }
  compileElement(node) {
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      // 判断属性名是否v-
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        let expr = attr.value;
        let [ ,type ] = attrName.split('-');
        CompileUtil[type](node, this.vm, expr);
      }
    })
  }
  compileText(node) {
    // 带{{}}
    let expr = node.textContent;
    let reg = /\{\{([^}]+)\}\}/g; // {{a}}
    if (reg.test(expr)) {
      CompileUtil['text'](node, this.vm, expr);
    }
  }
}

CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split('.'); // message.a.b... [message, a, b, ...]
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      return this.getVal(vm, arguments[1]);
    })
  },
  text(node, vm, expr) {
    let updataFn = this.updater['textUpdater'];
    let value = this.getTextVal(vm, expr);
    expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      new Watcher(vm, arguments[1], (newValue) => {
        updataFn && updataFn(node, this.getTextVal(vm, expr));
      });
    })
    updataFn && updataFn(node, value);
  },
  model(node, vm, expr) {
    let updataFn = this.updater['modelUpdater'];
    // 加个监控数据变化callback
    new Watcher(vm, expr, (newValue) => {
      updataFn && updataFn(node, this.getVal(vm, expr));
    });
    node.addEventListener('input', (e) => {
      let newValue = e.target.value;
      this.setVal(vm, expr, newValue);
    })
    updataFn && updataFn(node, this.getVal(vm, expr));
  },
  setVal(vm, expr, value) {
    expr = expr.split('.');
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length - 1) return prev[next] = value;
      return prev[next];
    }, vm.$data)
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    }
  }
}