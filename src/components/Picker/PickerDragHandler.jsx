import React from 'react';
import PropTypes from 'prop-types';
import {
  PICKER_RADIUS,
  POINTER_RADIUS,
  MAX_ABSOLUTE_POSITION,
  MIN_ABSOLUTE_POSITION,
} from '../../utils/constant.js';
import darg from '../../utils/drag';

const propTypes = {
  time: PropTypes.number,
  step: PropTypes.number,
  draggable: PropTypes.bool,
  pointerRotate: PropTypes.number,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  minuteStep: PropTypes.number,
  limitDrag: PropTypes.bool,
  rotateState: PropTypes.shape({
    top: PropTypes.number,
    height: PropTypes.number,
    pointerRotate: PropTypes.number
  }),
  handleTimePointerClick: PropTypes.func
};

const defaultProps = {
  time: 0,
  step: 0,
  pointerRotate: 0,
  rotateState: {
    top: 0,
    height: 0,
    pointerRotate: 0
  },
  minLength: MIN_ABSOLUTE_POSITION,
  maxLength: MAX_ABSOLUTE_POSITION,
  minuteStep: 5,
  limitDrag: false,
  handleTimePointerClick: Function.prototype
};

class PickerDragHandler extends React.PureComponent {
  constructor(props) {
    super(props);
    this.startX = 0;
    this.startY = 0;
    this.originX = null;
    this.originY = null;
    this.dragCenterX = null;
    this.dragCenterY = null;
    this.offsetDragCenterX = 0;
    this.offsetDragCenterY = 0;
    this.state = this.initialRotationAndLength();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.resetOrigin = this.resetOrigin.bind(this);
  }

  componentDidMount() {
    this.resetOrigin();
    if (window.addEventListener) {
      window.addEventListener('resize', this.resetOrigin, true);
    } else {
      window.addEventListener('onresize', this.resetOrigin);
    }
    if (document.addEventListener) {
      document.addEventListener('scroll', this.resetOrigin, true);
      document.addEventListener('mousemove', this.handleMouseMove, true);
      document.addEventListener('mouseup', this.handleMouseUp, true);
      document.addEventListener('touchmove', this.handleMouseMove, true);
      document.addEventListener('touchend', this.handleMouseUp, true);
    } else {
      document.addEventListener('onscroll', this.resetOrigin);
      document.attachEvent('onmousemove', this.handleMouseMove);
      document.attachEvent('onmouseup', this.handleMouseUp);
      document.attachEvent('ontouchmove', this.handleMouseMove);
      document.attachEvent('ontouchend', this.handleMouseUp);
    }
  }

  componentWillUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.resetOrigin, true);
    } else {
      window.detachEvent('onresize', this.resetOrigin);
    }
    if (document.removeEventListener) {
      document.removeEventListener('scroll', this.resetOrigin, true);
      document.removeEventListener('mousemove', this.handleMouseMove, true);
      document.removeEventListener('mouseup', this.handleMouseUp, true);
      document.removeEventListener('touchmove', this.handleMouseMove, true);
      document.removeEventListener('touchend', this.handleMouseUp, true);
    } else {
      document.detachEvent('onscroll', this.resetOrigin);
      document.detachEvent('onmousemove', this.handleMouseMove);
      document.detachEvent('onmouseup', this.handleMouseUp);
      document.detachEvent('ontouchmove', this.handleMouseMove);
      document.detachEvent('ontouchend', this.handleMouseUp);
    }
  }

  componentDidUpdate(prevProps) {
    const { step, time, rotateState } = this.props;
    const { draging } = this.state;
    const prevStep = prevProps.step;
    const prevTime = prevProps.time;
    const PrevRotateState = prevProps.rotateState;
    if ((step !== prevStep
      || time !== prevTime
      || rotateState.pointerRotate !== PrevRotateState.pointerRotate)
      && !draging) {
      this.resetState();
    }
  }

  initialRotationAndLength() {
    const { rotateState } = this.props;
    const {
      top,
      height,
      pointerRotate
    } = rotateState;
    this.initialHeight = height;
    return {
      top,
      height,
      pointerRotate,
      draging: false
    };
  }

  resetState() {
    this.setState(this.initialRotationAndLength());
  }

  resetOrigin() {
    const centerPoint = this.pickerCenter;
    const centerPointPos = centerPoint.getBoundingClientRect();
    this.originX =
      centerPointPos.left +
      (centerPoint.clientWidth / 2) +
      Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) + POINTER_RADIUS;
    this.originY =
      centerPointPos.top +
      (centerPoint.clientHeight / 2) +
      Math.max(document.documentElement.scrollTop, document.body.scrollTop) + POINTER_RADIUS;

    this.resetDragCenter();
  }

  resetDragCenter() {
    this.offsetDragCenterX = 0;
    this.offsetDragCenterY = 0;

    const dragCenterPoint = this.dragCenter;
    const dragCenterPointPos = dragCenterPoint.getBoundingClientRect();
    this.dragCenterX =
      dragCenterPointPos.left +
      (dragCenterPoint.clientWidth / 2) +
      Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    this.dragCenterY =
      dragCenterPointPos.top +
      (dragCenterPoint.clientHeight / 2) +
      Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  }

  getRadian(x, y) {
    let sRad = Math.atan2(y - this.originY, x - this.originX);
    sRad -= Math.atan2(
      this.startY - this.originY,
      this.startX - this.originX
    );
    if (sRad > Math.PI) {
      sRad -= Math.PI * 2;
    } else if (sRad < -Math.PI) {
      sRad += Math.PI * 2;
    }
    sRad += darg.degree2Radian(this.props.rotateState.pointerRotate);
    return sRad;
  }

  getAbsolutePosition(x, y) {
    return Math.sqrt(
      Math.pow((x - this.originX), 2) + Math.pow((y - this.originY), 2)
    );
  }

  getPointerRotate(options = {}) {
    const {
      dragX,
      dragY,
    } = options;
    const {
      step,
      limitDrag,
      minuteStep,
    } = this.props;
    const sRad = this.getRadian(dragX, dragY);
    let pointerRotate = sRad * (360 / (2 * Math.PI));

    if (limitDrag) {
      const degree = sRad * (360 / (2 * Math.PI));
      const isHour = step === 0;
      const sectionCount = isHour ? 12 : (60 / minuteStep);
      const roundSeg = Math.round(degree / (360 / sectionCount));
      pointerRotate = roundSeg * (360 / sectionCount);
    }
    return pointerRotate;
  }

  handleTimePointerChange(options = {}) {
    const {
      dragX,
      dragY,
      autoMode = null,
      pointerRotate = null,
    } = options;
    const {
      step,
      timeMode,
      minLength,
      maxLength,
      minuteStep,
      handleTimePointerClick,
    } = this.props;

    const sRad = this.getRadian(dragX, dragY);

    const degree = sRad * (360 / (2 * Math.PI));
    const isHour = step === 0;
    const sectionCount = isHour ? 12 : (60 / minuteStep);
    let roundSeg = Math.round(degree / (360 / sectionCount));

    let absolutePosition = this.getAbsolutePosition(dragX, dragY);
    absolutePosition = darg.validatePosition(
      absolutePosition,
      minLength,
      maxLength
    );
    if (minLength < absolutePosition && absolutePosition < maxLength) {
      if ((absolutePosition - minLength) > (maxLength - minLength) / 2) {
        absolutePosition = maxLength;
      } else {
        absolutePosition = minLength;
      }
    }
    while (roundSeg > sectionCount) {
      roundSeg -= sectionCount;
    }
    let time = absolutePosition === minLength
      ? roundSeg
      : roundSeg + sectionCount;

    if (isHour) {
      if (absolutePosition === minLength && time < 0) {
        time += 12;
      } else if (absolutePosition !== minLength && time < 12) {
        time = 24 + (time - 12);
      }
      time = time === 24 ? 12 : time;
      if (time === 12 && Number(timeMode) === 12) time = 0;
    } else {
      time = (time * minuteStep === 60 ? 0 : time * minuteStep);
      time = time < 0 ? 60 + time : time;
    }

    handleTimePointerClick && handleTimePointerClick({
      time,
      autoMode,
      pointerRotate
    });
  }

  handleMouseDown(e) {
    if (!this.state.draging) {
      const event = e || window.event;
      event.preventDefault();
      event.stopPropagation();
      const pos = darg.mousePosition(event);
      this.startX = pos.x;
      this.startY = pos.y;

      this.resetDragCenter();
      this.offsetDragCenterX = this.dragCenterX - this.startX;
      this.offsetDragCenterY = this.dragCenterY - this.startY;

      this.setState({
        draging: true
      });
    }
  }

  handleMouseMove(e) {
    if (this.state.draging) {
      const {
        minLength,
        maxLength,
      } = this.props;
      const pos = darg.mousePosition(e);
      const dragX = pos.x + this.offsetDragCenterX;
      const dragY = pos.y + this.offsetDragCenterY;
      if (this.originX !== dragX && this.originY !== dragY) {
        const pointerRotate = this.getPointerRotate({ dragX, dragY });

        const absolutePosition = this.getAbsolutePosition(dragX, dragY);
        const height = darg.validatePosition(
          absolutePosition,
          minLength - POINTER_RADIUS,
          maxLength - POINTER_RADIUS
        );
        const top = PICKER_RADIUS - height;
        this.setState({
          top,
          height,
          pointerRotate
        });

        this.handleTimePointerChange({
          dragX,
          dragY,
          autoMode: false
        });
      }
    }
  }

  handleMouseUp(e) {
    if (this.state.draging) {
      this.setState({
        draging: false
      });

      const pos = darg.mousePosition(e);
      const endX = pos.x + this.offsetDragCenterX;
      const endY = pos.y + this.offsetDragCenterY;

      let pointerRotate = this.getPointerRotate({
        dragX: endX,
        dragY: endY
      });
      const remainder = pointerRotate % 30;
      const base = Math.floor(pointerRotate / 30);
      pointerRotate = (base + (remainder >= 15 ? 1 : 0)) * 30;

      this.setState({ pointerRotate });
      this.handleTimePointerChange({
        dragX: endX,
        dragY: endY,
        pointerRotate,
      });
    }
  }

  render() {
    const { time, draggable } = this.props;
    const { draging, height, top, pointerRotate } = this.state;
    const pickerPointerClass = draging
      ? 'picker_pointer'
      : 'picker_pointer animation';

    return (
      <div className="picker_handler">
        <div
          className={pickerPointerClass}
          style={darg.initialPointerStyle(height, top, pointerRotate)}
        >
          <div
            ref={r => (this.dragCenter = r)}
            className={`pointer_drag ${draggable ? 'draggable' : ''}`}
            style={darg.rotateStyle(-pointerRotate)}
            onMouseDown={draggable ? this.handleMouseDown : Function.prototype}
            onTouchStart={draggable ? this.handleMouseDown : Function.prototype}
          >
            {time}
          </div>
        </div>
        <div
          className="picker_center"
          ref={p => (this.pickerCenter = p)}
        />
      </div>
    );
  }
}

PickerDragHandler.propTypes = propTypes;
PickerDragHandler.defaultProps = defaultProps;

export default PickerDragHandler;
