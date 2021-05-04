# immer-ob

观察者模式做事件派发，使用 memo 配合不可变对象做事件拦截

配合 vanilla-life 可以优雅的实现状态管理

> Size < 1kb

## Install

```sh
$ npm install --save immer-ob
```

## Use

```js
import { Ob } from "immer-ob";

const ob = Ob({
  name: "dog",
  list: ["name-a", "name-b"],
  age: 20,
});

const ele = document.createElement("div");

// 监听 name 和 list, 仅当它任何一个有改变时，才会派发任务
// 初始化时，必定会执行一次监听
// 当 ele remove 之后，会自动取消监听
const removeOb = ob.onUpdate((s)=>[s.name, s.list], [name, list]=>{
  document.body.textContent = name + list.join('-');
});

// 派发一次任务
ob.update(s=>{
  // 由于 ob 内部的state使用的是不可变对象，即便直接修改数组内容，也会认为对象已被修改
  s.list[0] = "dog";
});

// 移除删除监听
removeOb()
```

## Detail

拦截所有事件：

```js
const removeOb = ob.onUpdate(
  // 当返回的数组 length 为 0 时，不做事件派发
  (s) => [],
  ([name, list]) => {}
);
```

不做拦截：

```js
const removeOb = ob.onUpdate(
  // 当返回的对象为 null，不做拦截
  (s) => null,
  ([name, list]) => {}
);
```
