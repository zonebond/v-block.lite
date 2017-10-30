import PropTypes from 'prop-types'
import {pixels, literal, assignment} from '../../common/utils'

const NumberOrString = [PropTypes.number, PropTypes.string];

const extensionProps = function (extras) {
  return function (props) {
    const clone = {...props};
    Object.keys(extras).forEach(prop => {
      if (clone.hasOwnProperty(prop))
        delete clone[prop];
    });
    return clone;
  }
};

/**
 * common box-model style
 * @type {{width: *, height: *, flex: *, padding: *, margin: *, border: *}}
 */
const BoxModelProperties = {
  width: PropTypes.oneOfType(NumberOrString),
  height: PropTypes.oneOfType(NumberOrString),
  flex: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  padding: PropTypes.oneOfType(NumberOrString),
  margin: PropTypes.oneOfType(NumberOrString),
  border: PropTypes.oneOfType(NumberOrString),
  textAlign: PropTypes.string,
};

/**
 * common box-model style
 * @param target
 */
function box_model(target) {
  const {propTypes} = target;
  target.propTypes  = propTypes ? {...propTypes, ...BoxModelProperties} : {...BoxModelProperties};

  const target_proto = target.prototype;

  if (!target_proto.extensionProps) {
    target_proto.extensionProps = extensionProps(target.propTypes);
  }

  const description    = Object.getOwnPropertyDescriptor(target_proto, 'committedStyle');
  const committedStyle = function () {
    const {width, height, flex, padding, margin, border, textAlign} = this.props;
    return assignment(description ? description.get.call(this) : {}, {
      width: pixels(width),
      height: pixels(height),
      flex: literal(flex),
      padding: literal(padding),
      margin: literal(margin),
      border: literal(border),
      textAlign: literal(textAlign),
      ...this.props.style
    });
  };
  Object.defineProperty(target_proto, 'committedStyle', {get: committedStyle, configurable: true});
}


/**
 * common font styles
 * @type {{color: *, fontSize: *, fontWeight: *}}
 */
const FontProperties = {
  color: PropTypes.oneOfType([PropTypes.string]),
  fontSize: PropTypes.oneOfType(NumberOrString),
  fontWeight: PropTypes.oneOfType(NumberOrString),
};
/**
 * font style
 * @param target
 */
function font(target) {
  const {propTypes} = target;
  target.propTypes  = propTypes ? {...propTypes, ...FontProperties} : {...FontProperties};

  const target_proto = target.prototype;

  if (!target_proto.extensionProps) {
    target_proto.extensionProps = extensionProps(target.propTypes);
  }

  const description    = Object.getOwnPropertyDescriptor(target_proto, 'committedStyle');
  const committedStyle = function () {
    const {color, fontSize, fontWeight} = this.props;
    return assignment(description ? description.get.call(this) : {}, {
      color: color,
      fontSize: pixels(fontSize),
      fontWeight: fontWeight,
      ...this.props.style
    });
  };
  Object.defineProperty(target_proto, 'committedStyle', {get: committedStyle, configurable: true});
}


/**
 * common theme style
 * @type {{color: *, border: *, background: *}}
 */
const ThemeProperties = {
  color: PropTypes.string,
  border: PropTypes.string,
  background: PropTypes.string,
};
/**
 * theme style
 * @param target
 */
function themes(target) {
  const {propTypes} = target;
  target.propTypes  = propTypes ? {...propTypes, ...ThemeProperties} : {...ThemeProperties};

  const target_proto = target.prototype;

  if (!target_proto.extensionProps) {
    target_proto.extensionProps = extensionProps(target.propTypes);
  }

  const description    = Object.getOwnPropertyDescriptor(target_proto, 'committedStyle');
  const committedStyle = function () {
    const {color, border, background} = this.props;
    return assignment(description ? description.get.call(this) : {}, {
      color: color,
      border: border,
      background: background,
      ...this.props.style
    });
  };
  Object.defineProperty(target_proto, 'committedStyle', {get: committedStyle, configurable: true});
}


/**
 * expose function
 */
export {
  box_model,
  font,
  themes
}
