![react-times](./doc/intro_src/react_times.png)

[![npm version](https://badge.fury.io/js/react-times.svg)](https://badge.fury.io/js/react-times) [![Build Status](https://travis-ci.org/ecmadao/react-times.svg?branch=master)](https://travis-ci.org/ecmadao/react-times) [![Coverage Status](https://coveralls.io/repos/github/ecmadao/react-times/badge.svg?branch=master)](https://coveralls.io/github/ecmadao/react-times?branch=master) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![react-times](http://img.shields.io/npm/dm/react-times.svg)](https://www.npmjs.com/package/react-times) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ecmadao/react-times/master/LICENSE)

[![NPM](https://nodei.co/npm/react-times.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-times)

README：[English Version](./README.md)

> 一个 React 时间选择器组件，使用 ES6 标准语法编写，没有 jQuery 依赖

**戳 [这里](./doc/CHANGELOG.md) 查看新版中更改/新增的 props。**

![react-times](./doc/intro_src/react-times.gif)

# 线上 demo

戳[这里](https://ecmadao.github.io/react-times)玩线上 demo

# 本地玩起来

```bash
$ git clone https://github.com/ecmadao/react-times.git

$ npm install

$ npm run storybook
```

# 安装说明

单独使用插件时所需的依赖：

- [`moment`](https://github.com/moment/moment/)
- [`react`](https://github.com/facebook/react)
- [`react-dom`](https://github.com/facebook/react)

> No jQuery 😤😤😤

使用的时候，需要你的项目里已经安装了`react`和`react-dom`。如果没有的话：

```bash
$ npm install react react-dom --save-dev
# and
$ npm install react-times --save-dev
```

注意：因为组件使用了`moment-timezone`，所以你本地需要能够编辑 json 文件。webpack 2 以下的用户可以通过 json-loader 解决该问题。webpack >= 2 后自带 json 解析功能。

# 使用方式

目前组件总共有两种主题：Material 主题和经典主题

> 在使用组件的时候，记得要引入对应主题的 CSS 文件

```javascript
// 基本使用方式
// 假设要在某个组件里使用该插件 (SomeComponent)
import React from 'react';
import TimePicker from 'react-times';

// 使用 Material 主题的话引入：
import 'react-times/css/material/default.css';
// 否则经典主题的话则引入：
import 'react-times/css/classic/default.css';

export default class SomeComponent extends React.Component {
  onTimeChange(options) {
    // do something
  }

  onFocusChange(focusStatue) {
    // do something
  }

  render() {
    <TimePicker
      onFocusChange={this.onFocusChange.bind(this)}
      onTimeChange={this.onTimeChange.bind(this)}
      // 确定主题，不填该 props 则默认为 material
      theme="material"
      // or
      // theme="classic"
    />
  }
}
```

关于配置的栗子：

```javascript
render() {
  <TimePicker
      colorPalette="dark" // main color, default "light"
      focused={true} // whether to show timepicker modal after rendered. default false
      withoutIcon={true} // whether to has time icon on button, default false
      time="13:05" // initial time, default current time
      theme="material"
      // or
      // theme="classic"
      timeMode="12" // use 24 or 12 hours mode, default 24
  />
}
```

> 你可以戳 [这里](https://github.com/ecmadao/react-times/tree/master/examples) 查看更多栗子

# 秀一下

- 24 小时制，亮色调的 Material 主题（默认）

```javascript
<TimePicker />
```

![24HoursMode](./doc/intro_src/24HoursMode.png)

- 12 小时制，亮色调的 Material 主题

```javascript
<TimePicker timeMode="12"/>
```

![12HoursMode](./doc/intro_src/12HoursMode.png)

- 24 小时制，暗色调的 Material 主题

```javascript
<TimePicker colorPalette="dark"/>
```

![DarkColor](./doc/intro_src/DarkColor.png)

- 24 小时制，展示用户当前时区。（除此以外，可以通过 `timezone` props 来手动改变时区）

```javascript
<TimePicker showTimezone={true}/>
```

![showTimezone](./doc/intro_src/24HoursMode-showTimezone.png)

- 24 小时制，亮色调的经典主题

```javascript
<TimePicker theme="classic"/>
```

![24HoursMode-ClassicTheme](./doc/intro_src/24HoursMode-ClassicTheme.png)

- 24 小时制，暗色调的经典主题

```javascript
<TimePicker colorPalette="dark" theme="classic"/>
```

![24HoursMode-ClassicTheme-dark](./doc/intro_src/24HoursMode-ClassicTheme-dark.png)

# APIs

## Props

- `time`

> 初始化时的时间，格式是 `${hour}:${minute}`，不传则默认使用当前时间（通过`moment()`）

```javascript
// PropTypes.string
time="11:11"
time="11:01"
time="1:01"
time="1:1"
```

- `timeFormat`

> 自定义时间的格式

```javascript
// PropTypes.string
// HH, MM 代表 24 小时制
// hh, mm 代表 12 小时制
timeFormat='HH:MM'
timeFormat='hh:mm'

// Warning:
// 如果设定 timeMode 为 12 小时制，且 timeFormat 中含有 hh 或者 mm；
// 或者设定 timeMode 为 24 小时制，且 timeFormat 中含有 HH 或者 MM，
// 则会在浏览器控制台中输出一条警告，且时间格式会被转换为 timeMode 所设定的格式

// 因此，如果想把 timeFormat 设定为 hh:mm 或者 h:m，则还需要把 timeMode 设置为 12
// (因为 timeMode 默认为 24)
```

- `timeFormatter`

> 自定义时间的格式

```javascript
// PropTypes.func
timeFormatter={({ hour, minute, meridiem }) => `${hour} - ${minute}`}

// 注:
// 当同时设定了 timeFormat 和 timeFormatter 时（都合法），会使用 timeFormatter
```

- `focused`

> 初始化时时间选择器的 modal 是否打开，默认为`false`

```javascript
// PropTypes.bool
focused={false}
focused={true}
```

- `withoutIcon`

> 时间选择器的按钮上是否不需要 svg icon，默认为`false`

```javascript
// PropTypes.bool
withoutIcon={true}
```

- `colorPalette`

> 配色方案，默认为`light`

```javascript
// PropTypes.string
colorPalette="dark"
colorPalette="light"
```

- `timeMode`

> 12 或 24 小时制，默认为 24

```javascript
// PropTypes.string or PropTypes.number
timeMode="24"
timeMode=24
timeMode="12"
timeMode=12
```

- `meridiem`

> 上下午，在 12 小时制里为 "AM" 或 "PM"。默认为 `AM`

- `showTimezone`

> `PropTypes.bool`，代表是否展示用户的时区。默认为 `false`

- `timezone`

> `PropTypes.string`，可以通过该 props 改变用户所处的时区。默认为用户当前本地时区。

- `trigger`

> 开启、关闭时间选择器 Modal 的触发器，是一个 React Component

```javascript
<TimePicker
  focused={focused}
  trigger={(
    <div
      onClick={this.handleFocusedChange.bind(this)} >
      click to open modal
    </div>
  )}
/>
```

- `closeOnOutsideClick`

> 点击 Modal 外部后是否关闭。默认为 true

```
<TimePicker
  closeOnOutsideClick={false}
/>
```

- `disabled`

> 禁用组件。默认为 false

```
<TimePicker
  disabled={true}
/>
```

- `draggable`

如果想禁用拖拽，则可以设置 `draggable` 为 `false`，那样的话用户只能通过点击来改变时间。默认为 `true`

```
<TimePicker
  draggable={true}
/>
```

- `language`

> 语言。默认为英语

```javascript
/*
 * support
 * en: english
 * zh-cn: 中文简体
 * zh-tw: 中文繁体
 * fr: Français
 * ja: 日本語
 */
<TimePicker
  language="zh-cn" // 中文简体
/>
```

- `phrases`

> `React.object`，用于自定义一些短语。可以在 [language.js](./src/utils/language.js) 查看所有的默认短语

```javascript
<TimePicker
  phrases={{
    confirm: '确认更改？',
    cancel: '确认取消？',
    close: 'DONE',
    am: '上午',
    pm: '下午'
  }}
/>
```

- `minuteStep`

> `React.number`, 默认为 `5`。该属性代表当分针改变时的最小步长(minute)。可以设置为 1，2，3....

```javascript
<TimePicker
  minuteStep={1}
/>
```

- `timeConfig`

> `React.object`, 用于配置 classic theme 时可选的时间范围以及步长

```javascript
<TimePicker
  theme="classic"
  timeMode="12"
  timeConfig={{
    from: '08:00 PM',
    to: '08:00 AM',
    step: 1,
    unit: 'hour'
  }}
/>

<TimePickerWrapper
  theme="classic"
  timeMode="24"
  timeConfig={{
    from: 9,
    to: 19,
    step: 30,
    unit: 'minutes'
  }}
/>
```

- `limitDrag`

> `React.bool`, 默认为 `false`. 当设置为 `true` 时，将会限制用户的拖拽（从连续性的拖拽变为间断性拖拽，间隔由 `minuteStep` 确定）

```javascript
<TimePicker
  limitDrag
/>
```

## 回调

- `onFocusChange`

`PropTypes.func`

> 当组件`focused`属性改变，也就是选择器 modal 被打开或关闭时调用

- `onTimeChange`

`PropTypes.func`

> 小时`hour`，分钟`minute`或者上下午`meridiem`被改变时的回调

```javascript
onTimeChange(options) {
  const {
    hour,
    minute,
    meridiem
  } = options;
  // ...
}
```

- `onTimezoneChange`

`PropTypes.func`

> 当时区改变时的回调

# 相关文章

- [一言不合造轮子--撸一个ReactTimePicker](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/React/ReactJS/Write%20a%20React%20Timepicker%20Component%20hand%20by%20hand.md)

# Todos

- 测试

  - [x] TimePicker Component
  - [x] PickerDragHandler Component
  - [x] PickerPointGenerator Component
  - [x] MaterialTheme Component
  - [x] TwelveHoursTheme Component
  - [x] PickerPoint Component
  - [x] OutsideClickHandler Component

  - [x] utils test

- 配色

  - [x] light
  - [x] dark
  - [ ] colorful

- 主题

  - [x] Material Theme
  - [x] Classical Theme

- 小时制

  - [x] 12h mode
  - [x] 24h mode

- 动画

# 致谢

感谢 Airbnb 的 [react-dates](https://github.com/airbnb/react-dates) 组件，没有它我也不会想着写一个小时选择组件

# 核心贡献者 🎉

- **[carlodicelico](https://github.com/carlodicelico)**
- **[erin-doyle](https://github.com/erin-doyle)**
- **[MatthieuLemoine](https://github.com/MatthieuLemoine)**
- **[naseeihity](https://github.com/naseeihity)**
- **[shianqi](https://github.com/shianqi)**
- **[thg303](https://github.com/thg303)**

# 版权

[MIT License](./LICENSE)
