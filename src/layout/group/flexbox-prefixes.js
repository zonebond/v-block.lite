const prefixes_map = {
  // display: -webkit-box | -webkit-inline-box
  // display: -moz-box | -moz-inline-box
  // display: -ms-flexbox | -ms-inline-flexbox
  // display: -webkit-flex | -webkit-inline-flex
  // display: flex | inline-flex
  'display': [
    'display', '-webkit-box',
    'display', '-moz-box',
    'display', '-ms-flexbox',
    'display', '-webkit-flex',
    'display', 'flex'
  ],
  // -webkit-box-orient: block-axis | horizontal | inline-axis | vertical
  // -webkit-box-direction: normal | reverse
  // -moz-box-orient: block-axis | horizontal | inline-axis | vertical
  // -moz-box-direction: normal | reverse
  // -ms-flex-direction: column | column-reverse | row | row-reverse
  // -webkit-flex-direction: column | column-reverse | row | row-reverse
  // flex-direction: column | column-reverse | row | row-reverse
  'flexDirection': [
    'WebkitBoxOrient', value => value === 'row' ? 'horizontal' : 'vertical',
    'WebkitBoxDirection', value => value === 'row' ? 'normal' : 'reverse',
    'MozBoxOrient', value => value === 'row' ? 'horizontal' : 'vertical',
    'MozBoxDirection', value => value === 'roe' ? 'normal' : 'reverse',,
    'msFlexDirection', value => value,
    'WebkitFlexDirection', value => value,
    'flexDirection', value => value
  ],
  // -webkit-box-lines: multiple | single
  // -moz-box-lines: multiple | single
  // -ms-flex-wrap: none | wrap | wrap-reverse
  // -webkit-flex-wrap: nowrap | wrap | wrap-reverse
  // flex-wrap: nowrap | wrap | wrap-reverse
  flexWrap: [
    'WebkitBoxLines', value => value === 'nowrap' ? 'single' : 'multiple',
    'MozBoxLines', value => value === 'nowrap' ? 'single' : 'multiple',
    'msFlexWrap', value => value === 'nowrap' ? 'none' : value,
    'WebkitFlexWrap', value => value,
    'flexWrap', value => value,
  ],
  // -webkit-box-flex: 0.0 | <positive floating-point number>
  // -moz-box-flex: 0.0 | <positive floating-point number>
  // -ms-flex: none (0 0 auto) | 
  //   [ [ <positive-flex: 1> <negative-flex: 0> ? ] || <preferred-size: 0px> ] 
  // -webkit-flex-grow: 0 | <positive number>
  // -webkit-flex-shrink: 1 | <positive number>
  // -webkit-flex-basis: auto | <positive length>
  // -webkit-flex: none (0 0 auto) | initial (0 1 auto) | auto (1 1 auto) | 
  //   [ <flex-grow: 1> <flex-shrink: 1> ? || <flex-basis: 0> ]
  // flex-grow: 0 | <positive number>
  // flex-shrink: 1 | <positive number>
  // flex-basis: auto | <positive length>
  // flex: none (0 0 auto) | initial (0 1 auto) | auto (1 1 auto) | 
  //   [ <flex-grow: 1> <flex-shrink: 1> ? || <flex-basis: 0> ]
  flex: [
   'WebkitBoxFlex', value => value,
   'MozBoxFlex', value => value,
   'msFlex', value => value,
   'WebkitFle', value => value,
   'flex', value => value
  ],
  flexGrow: [
    'WebkitBoxFlexGrow', value => value,
    'flexGrow', value => value
  ],
  flexShrink: [
    'WebkitFlexShrink', value => value,
    'flexShrink', value => value
  ],
  flexShrink: [
    'WebkitFlexBasis', value => value,
    'flexBasis', value => value
  ]
};

export default primitive => prefixes_map;