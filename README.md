# [v-block.lite] Library Core API-Documentation
- - - -
### Table of Modules

* **v-block/common**
	* **block** : @box_model、@font、@theme
	* **RESTish, PM**  [rest-utils]
	* **ServiceTools** : @cache、@pended
	* **classnames, pixels, literal, assignment**  [utils]
	* **merge, mergeProps**  [utils]
	* **DuffsDevice**  [utils]
	* **co-generator**

* **v-block/layout**
	* **Group、HGroup、VGroup** 
	* CI ......

* **v-block/library**
	* **ClassSymbol**
	* **EventSubject, EventObserver**
	* **ItemCollection, ItemDictionary**

- - - -

core-api-doucment
- - - -

## Group、HGroup、VGroup
**包 : v-block/layout**

Group组件是基于Flexbox技术实现的布局组件。能够很大程度上简化使用传统样式方式布局复杂的、灵活的和自适应性布局场景的难度。简化了理解布局样式的难度。统一布了局方式。避免使用不同风格的代码写出布局样式，以至于增加维护成本。屏蔽了跨浏览器、跨平台设备兼容性问题的处理过程。

`Flexbox 是一种新技术，但在如今各个浏览器都广泛支持的情况下，它已经开始准备广泛应用了。Flexbox提供了工具，允许快速创建曾经被证明用CSS很难实现的一些复杂，灵活的布局和功能。[关于Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)`

Group组件包括Group、HGroup、VGroup。最常用的就是HGroup水平布局和VGroup垂直布局这两个组件。
Group本身是一个非可视化组件，虽然它可以手动设置样式，但作为布局容器设计时，**不推荐**为Group设置可视化样式。
这里重点介绍HGroup和VGroup。Group与它们的用法一样。只是默认加入换行行为。

属性：          
* **width : string | number** **布局组自身的宽度**

当值为string类型时，长度单位可以自定义。可以使用百分比。
当植为number类型时，默认为转换为px单位。

* **height : string | number** **布局组自身的高度**

当值为string，长度单位可以自定义。可以使用百分比。
当植为number，默认为转换为px单位。

* **flex : string | boolean** **布局组自身相对于父布局组自适应性伸缩因子或布局方向上的初始大小（flex: flex-grow、flex-shrink、flex-basis）**

默认值 null | false
当值为boolean，flex实际对应为::flex : 1 0 0::
当值为string，flex就是flexbox对应设置3个顺序的可选属性。
flex : flex-grow  flex-shrink  flex-basis
如：flex : 1  1  0%
        flex : 0  1  100px
        flex : 1  0  30em
        ...

**注意 : 当设置flex值时，同时默认会将overflow设置为auto。**

* **padding : string | number** **CSS padding 设置布局组自身的内边距**

当值为string，长度单位可以自定义。并且可以使用4个方向简写：
**padding : padding-top、padding-bottom**；
**padding : padding-top、padding-right、padding-bottom、padding-left**。
当植为number，默认为转换为px单位。注意：number会给所有边距统一设定目标数值。


* **horizontalAlign : string** **组内元素水平方向布局方式**

关于布局组有两个很重要的概念：主轴、交叉轴：
主轴是指布局方向上的概念轴，交叉轴是指与主轴交叉的概念轴。如果主轴方向是水平方向，那么交叉轴就是垂直方向。反之，如果主轴方向是垂直方向，交叉轴方向就是水平方向。

可选值包括：
**主轴     : flex-start | flex-end | center | space-between | space-around**
**flex-start** : 从行首开始排列。每行第一个弹性元素与行首对齐，同时所有后续的弹性元素与前一个对齐。
**flex-end**  : 从行尾开始排列。每行最后一个弹性元素与行尾对齐，其他元素将与后一个对齐。
**center** : 伸缩元素向每行中点排列。每行第一个元素到行首的距离将与每行最后一个元素到行尾的距离相同。
**space-around** : 在每行上均匀分配弹性元素。相邻元素间距离相同。每行第一个元素与行首对齐，每行最后一个元素与行尾对齐。
**space-between** : 在每行上均匀分配弹性元素。相邻元素间距离相同。每行第一个元素到行首的距离和每行最后一个元素到行尾的距离将会是相邻元素之间距离的一半。

**交叉轴 : flex-start | flex-end | center | stretch**
**flex-start** : 元素向交叉轴起点对齐。
**flex-end** : 元素向交叉轴终点对齐。
**center** : 元素在交叉轴居中。如果元素在交叉轴上的高度高于其容器，那么在两个方向上溢出距离相同。
**stretch** : 弹性元素在交叉轴方向上被拉伸到与容器相同的高度或宽度。

* **verticalAlign : string** **组内元素垂直方向布局方式**
与horizontalAlign相同。但要注意方向。

* **gap : string | number** **组内元素间隔距离 (gap | horizontalGap | VerticalGap)**

gap是指主轴方向上的元素间隔。horizontalGap 与 VerticalGap是指 Group 组。无特指方向。
注意：如果元素是自定义组件，组容器会以props.style的方式将间隔属性传递级内部的子元素。

当值为string，长度单位可以自定义。
当植为number，默认为转换为px单位。

* **overflow : string** **指CSS overflow当溢出其块级容器时,是否剪辑内容，渲染滚动条或显示内容**

**overflow : visible | hidden | scroll | auto | inherit**

* **free : boolean** **是否重新渲染组内元素**

与React更新相关。静态组不重新渲染组内元素，可以提升性能

### HGroup 水平分布布局组（Horizontal Group）

```
import React from 'react'
import {HGroup} from 'v-block/component'

class ElementX extends React.Component {
	render() {
    // Group容器会以props的方式，将控制样式传递到自定义组件内部。
    // 并且会合并原有传入的自定义样式。
    const {style} = this.props; 
    return <div style={style}>...</div>
  }
}

const ElementY = (props) => {
  // 同上。
  const {style} = this.props; 
  console.log(style); // marginRight: 20px, color: 'red'
  return <div style={style}>...</div>
}

class MyLayoutTest extends React.Component {
  render() {
    // jsx
    return (
      <HGroup horzontalAlign="center" 
              verticalAlign="stretch"
              gap="20px" flex="1 0 0" >
		  <ElementX/>
		  <ElementX/>
		  <ElementY style={{color: 'red'}}/>
      </HGroup>
    )
  }
}
```
 
### VGroup 垂直分布布局组（Vertical Group）
与HGroup使用方式一致，方向不同。值得注意的是，overflow属性。

- - - -

## ClassSymbol
**包 : v-block/library**

Class类符号。用于标识自定义类Class的实例。类实例类型判断。

装饰器方式使用：
```
import {ClassSymbol} from 'v-block/library'

@ClassSymbol("MyClass")
class MyClass {
	...
}
```

使用类型检查：
```
import MyClass from './my-class'

const the_my_class = new MyClass();
const the_instance_x = new XClass();

console.log(MyClass.is(the_my_class)); // true
console.log(MyClass.is(the_instance_x)); // false

```


- - - -

## EventSubject、EventObserver
**包 : v-block/library**

- - - -

## ItemCollection、ItemDirectory
**包 : v-block/library**

- - - -


## @box_model、@font、@theme
**包 : v-block/common**

- - - -

## RESTish、PM
**包 : v-block/common**

- - - -

## ServiceTools
**包 : v-block/common**

- - - -

## classnames、pixels、literal、assignment
**包 : v-block/common**

- - - -

## merge、mergeProps
**包 : v-block/common**

- - - -

## DuffsDevice
**包 : v-block/common**

- - - -

## co-generator
**包 : v-block/common**

- - - -

### *持续完善中......*

- - - -

作者 **zonebond**  ::zonebond@126.com::

更多关于架构设计等技术文章
请关注：[框架-设计 : 要点总结 - 知乎专栏](https://zhuanlan.zhihu.com/p/28430944)




