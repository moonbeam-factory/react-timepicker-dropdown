# CHANGELOG

### v3.1.3

#### new props

- Add `timeConfig` props: to config from, to, step for classic theme panel.

### v3.1.0

#### remove props

- Remove `onHourChange`
- Remove `onMinuteChange`
- Remove `onMeridiemChange`

#### change props

- `onTimeChange` will get a dict now, including `hour`, `minute`, `meridiem`

#### new props

- Add `closeOnOutsideClick`

### v2.2.3

#### new props

- Add `timeFormat` props
- Add `timeFormatter` props

### v2.2.0

#### new props

- Add `minuteStep` props
- Add `limitDrag` props

### v2.1.3

- Bugfixed for drag position offset
- Add `onTimezoneChange` callback

### v2.1.0

#### new props

- `phrases`: `PropTypes.object`
- `timezone`: `PropTypes.string`
- `onTimezoneChange`: `PropTypes.func`

### v2.0.0

#### changed props

- `onTimeQuantumChange` --> `onMeridiemChange`
- `timeQuantum` --> `meridiem`
- `dragable` --> `draggable`

#### new props

- `showTimezone`: `PropTypes.bool`, default `false`
- `timezone`:  `PropTypes.string`, default user current local timezone
