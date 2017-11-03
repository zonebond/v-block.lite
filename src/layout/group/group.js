/**
 * Created by zonebond on 2017/3/29.
 */
// library
import React, {PureComponent, isValidElement, Children} from 'react'
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefix-all';

// utils
import {pixels, assignment, classnames, mergeProps, HackStyleSheet} from '../../common'

// hack stylesheet
HackStyleSheet(`[data-v-block-layout-group] { 
  display: -webkit-box !important; 
  display: -moz-box !important; 
  display: -ms-flexbox !important; 
  display: -webkit-flex !important; 
  display: flex !important; 
}`);

// enumeration
const main_axis  = ['flex-start', 'flex-end', 'center', 'space-around', 'space-between'];
const cross_axis = ['flex-start', 'flex-end', 'center', 'stretch'];

const base_style        = {};
const base_hgroup_style = {...base_style, justifyContent: 'flex-start', alignItems: 'stretch'};
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
  const {style, width, height, flex, horizontalAlign, verticalAlign, padding, overflow, horizontalGap, verticalGap, gap, free, ...others} = props;

  const measured = assignment(base, {
    width: pixels(width),
    height: pixels(height),
    justifyContent: horizontalAlign,
    alignItems: verticalAlign,
    padding: padding,
    flex: flex ? [{flex: (typeof flex === "string" ? flex : '1 0 0'), overflow: 'auto'}] : null,
    overflow: overflow,
    horizontalGap: horizontalGap ? null : null,
    verticalGap: verticalGap ? null : null,
    gap: gap ? null : null,
    free: free ? null : null
  });

  const prefixed = prefixAll(measured);
  return [{...prefixed, ...style}, others];
}

/**
 * render children
 * @param children
 * @param nextProps
 * @returns {Array}
 */
function renderChildren(children, nextProps) {
  const last = Children.count(children) - 1;
  return Children.map(children, (child, idx) => {
    return idx !== last && isValidElement(child) ? wrappedChild(child, mergeProps(child.props, nextProps)) : child
  });
}

function wrappedChild(element, props) {
	/**
	const primitive_render = element.type.prototype.render;
	element.type.prototype.render = function(){
		const child_root = primitive_render.call(this)
		console.log(child_root, this.props, style);
		return React.cloneElement(child_root, {style: {...child_root.props.style, ...style}});
	};
	*/
    
	return <element.type {...props}/>
}

/**
 * Group
 * @param props
 * @returns WrappedComponent
 * @constructor
 */
export class Group extends PureComponent {
  shouldComponentUpdate(nextProps) {
    if (isStyleInvalidate(this.props.style, nextProps.style))
      return true;
    else
      return this.props['free'] ? false : true;
  }

  render() {
    const props           = this.props;
    const cls             = classnames('v-block-layout-group', props.className);
    const gap             = pixels(props.gap);
    const nextProps       = {style: assignment(null, {marginRight: gap})};
    const [style, others] = commitProperties(props, {...base_style, flexWrap: 'wrap'});
    return (
      <div className={cls} style={style} {...others} data-v-block-layout-group>
        {gap ? renderChildren(props.children, nextProps) : props.children}
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
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  overflow: PropTypes.string
};

/**
 * Horizontal Group
 * @param props
 * @returns WrappedComponent
 * @constructor
 */
export class HGroup extends PureComponent {
  shouldComponentUpdate(nextProps) {
    if (isStyleInvalidate(this.props.style, nextProps.style))
      return true;
    else
      return this.props['free'] ? false : true;
  }

  render() {
    const props           = this.props;
    const cls             = classnames('v-block-layout-group horizontal', props.className);
    const gap             = pixels(props.gap);
    const nextProps       = {style: assignment(null, {marginRight: gap})};
    const [style, others] = commitProperties(props, base_hgroup_style);
    return (
      <div className={cls} style={style} {...others} data-v-block-layout-group>
        {gap ? renderChildren(props.children, nextProps) : props.children}
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
export class VGroup extends PureComponent {
  shouldComponentUpdate(nextProps) {
    if (isStyleInvalidate(this.props.style, nextProps.style))
      return true;
    else
      return this.props['free'] ? false : true;
  }

  render() {
    const props                                      = this.props;
    const cls                                        = classnames('v-block-layout-group vertical', props.className);
    const gap                                        = pixels(props.gap);
    const nextProps                                  = {style: assignment(null, {marginBottom: gap})};
    const {horizontalAlign, verticalAlign, ...other} = props;
    const [style, others]                            = commitProperties({
      horizontalAlign: verticalAlign,
      verticalAlign: horizontalAlign, ...other
    }, base_vgroup_style);
    return (
      <div className={cls} style={style} {...others} data-v-block-layout-group>
        {gap ? renderChildren(props.children, nextProps) : props.children}
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