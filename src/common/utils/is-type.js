/**
 * Created by zonebond on 2017/7/5.
 */
function isPresent(val) {
  return void 0 !== val && null !== val;
}

function isBlank(val) {
  return void 0 === val || null === val;
}

function isBoolean(val) {
  return typeof val === 'boolean';
}

function isNumber(val) {
  return typeof val === 'number';
}

function isString(val) {
  return typeof val === 'string';
}

function isFunction(val) {
  return typeof val = 'function';
}

function isType(obj) {
  return isFunction(obj);
}

function isStringMap(val) {
  return typeof val === 'object' && val !== null;
}

function isPromise(val) {
  return val instanceof Promise;
}

function isArray(val) {
  return val && isFunction(val.slice)
}

function isDate(val) {
  return val instanceof Date && !isNaN(val.valueOf());
}

export {
  isBlank, isPresent, 
  isBoolean, isNumber, isString, isFunction, isType, 
  isStringMap, isPromise, isArray, isDate
}