/**
 * Created by zonebond on 2017/3/29.
 */
// library
import React, {Component, isValidElement, Children, cloneElement} from 'react'
import PropTypes from 'prop-types';
// utils
import {pixels, assignment, classnames, HackStyleSheet} from 'v-block.lite/common'
import prefixAll from 'inline-style-prefix-all';

// const prefixAll = (value) => value;

const symbol = `#*0x4DAC4$#`;

// hack stylesheet
HackStyleSheet(`[data-v-block-layout-group] { 
  display: -webkit-box; 
  display: -moz-box; 
  display: -ms-flexbox; 
  display: -webkit-flex; 
  display: flex; 
}`);

// hack stylesheet
HackStyleSheet(`[data-v-block-layout-group-spacer] { 
  display: inline-block; 
  pointer-events: none; 
  user-select: none;
}`);

// enumeration
const main_axis  = ['flex-start', 'flex-end', 'center', 'space-around', 'space-between'];
const cross_axis = ['flex-start', 'flex-end', 'center', 'stretch'];

const base_style        = {};
const base_hgroup_style = {...base_style, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch'};
const base_vgroup_style = {...base_style, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'};

const isStyleInvalidate = (prev, next) => {
  if (!prev && !next)
    return false;

  if ((!prev && next) || (prev && !next))
    return true;

  for (let prop in next) {
    if (!prev.hasOwnProperty(prop))
      return true;
    if (prev[prop] !== next[prop])
      return true;
  }

  if (Object.keys(prev).length !== Object.keys(next).length)
    return true;

  return false;
};

function commitProperties(props, base) {
  const {
    style, 
    width, height, 
    flex,
    horizontalAlign, verticalAlign, 
    padding, overflow, 
    horizontalGap, verticalGap, gap, 
    free, ...others
  } = props;

  const measured = assignment(base, {
    width: pixels(width),
    height: pixels(height),
    justifyContent: horizontalAlign,
    alignItems: verticalAlign,
    padding: padding,
    flex: flex ? [{flex: (typeof flex === "string" ? flex : '1 0 0%'), overflow: 'auto'}] : null,
    overflow: overflow,
    horizontalGap: horizontalGap ? null : null,
    verticalGap: verticalGap ? null : null,
    gap: gap ? null : null,
    free: free ? null : null
  });

  const prefixed = prefixAll(measured);
  return [{...prefixed, ...style}, others];
}

function Spacer(props) {
  return <span data-v-block-layout-group-spacer="" {...props}></span>
}

/**
 * render children
 * @param children
 * @param nextProps
 * @returns {Array}
 */
function renderChildren(children, spacer) {
  const nums = Children.count(children);
  
  if(nums === 1) {
    return children;
  }

  const last = nums - 1;
  const result = [];
  Children.forEach(children, (child, index) => {
    if(!child) return;

    result.push(cloneElement(child, { ...child.props, key: child.key || symbol + index }));

    if(index !== last) {
      result.push(isValidElement(spacer) 
                ? cloneElement(spacer, { key: '.gap/.'+index })
                : <Spacer {...spacer} key={'.gap/.'+index}/>);
    }
  });
  return result;
}

/**
 * Group
 * @param props
 * @returns WrappedComponent
 * @constructor
 */
export class Group extends Component {
  shouldComponentUpdate(nextProps) {
    if (isStyleInvalidate(this.props.style, nextProps.style))
      return true;
    else
      return this.props['free'] ? false : true;
  }

  render() {
    const {children, gap, ...props}  = this.props;
    const cls             = classnames('v-block-layout-group', props.className);
    const spacer          = isValidElement(gap) ? gap : { style: assignment(null, { marginRight: pixels(gap) }) };
    const [style, others] = commitProperties(props, {...base_style, flexWrap: 'wrap'});
    return (
      <div className={cls} style={style} {...others} data-v-block-layout-group="">
        {gap ? renderChildren(children, spacer) : children}
      </div>
    )
  }
}
Group.displayName = "Group";
Group.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flex: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  horizontalAlign: PropTypes.oneOf(main_axis),
  verticalAlign: PropTypes.oneOf(cross_axis),
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
  padding: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  overflow: PropTypes.string
};

/**
 * Horizontal Group
 * @param props
 * @returns WrappedComponent
 * @constructor
 */
export class HGroup extends Component {
  shouldComponentUpdate(nextProps) {
    if (isStyleInvalidate(this.props.style, nextProps.style))
      return true;
    else
      return this.props['free'] ? false : true;
  }

  render() {
    const {children, gap, ...props} = this.props;
    const cls             = classnames('v-block-layout-group horizontal', props.className);
    const spacer          = isValidElement(gap) ? gap : { style: assignment(null, { marginRight: pixels(gap) }) };
    const [style, others] = commitProperties(props, base_hgroup_style);
    return (
      <div className={cls} style={style} {...others} data-v-block-layout-group="">
        {gap ? renderChildren(children, spacer) : children}
      </div>
    )
  }
}
HGroup.displayName = "HGroup";
HGroup.propTypes = {
  ...Group.propTypes,
  horizontalAlign: PropTypes.oneOf(main_axis),
  verticalAlign: PropTypes.oneOf(cross_axis),
};

/**
 * Vertical Group
 * @param props
 * @returns WrappedComponent
 * @constructor
 */
export class VGroup extends Component {
  shouldComponentUpdate(nextProps) {
    if (isStyleInvalidate(this.props.style, nextProps.style))
      return true;
    else
      return this.props['free'] ? false : true;
  }

  render() {
    const {children, gap, ...props}                  = this.props;
    const cls                                        = classnames('v-block-layout-group vertical', props.className);
    const spacer = isValidElement(gap) ? gap : { style: assignment(null, { marginBottom: pixels(gap) }) };
    const {horizontalAlign, verticalAlign, ...other} = props;
    const [style, others]                            = commitProperties({
      horizontalAlign: verticalAlign,
      verticalAlign: horizontalAlign, ...other
    }, base_vgroup_style);
    return (
      <div className={cls} style={style} {...others} data-v-block-layout-group="">
        {gap ? renderChildren(children, spacer) : children}
      </div>
    )
  }
}
VGroup.displayName = "VGroup";
VGroup.propTypes = {
  ...Group.propTypes,
  horizontalAlign: PropTypes.oneOf(cross_axis),
  verticalAlign: PropTypes.oneOf(main_axis),
};