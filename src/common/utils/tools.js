/**
 * Created by zonebond on 2017/3/29.
 */

/**
 * check unavailable value eg. undefined and null
 * @param value
 * @constructor
 */
const NotNull = value => value !== null && value !== undefined;

/**
 * check value is Object Map similar value eg. {key: value, ...} and {}
 * @param value
 */
const isObject = value => NotNull(value) && typeof value === 'object' && Array.isArray(value) === false;

/**
 * transform number to number + px
 * @param value <number | string>
 */
const pixels = value => NotNull(value) ? value : (isNaN(value) ? value : value + 'px');

/**
 * transform number + px Or string
 * @param value
 * @returns {*}
 */
const literal = (value, defaultValue) => {
  return NotNull(value) ? (typeof value === 'string' ? value : pixels(value)) : defaultValue;
};


/**
 * merge object with assign props which value must be available
 * @param target
 * @param props
 * @returns {*}
 */
const assignment = (target, props) => {
  let merged = NotNull(target) ? {...target} : null;
  if (!NotNull(props)) return merged;
  Object.keys(props).forEach(prop => {
    const value = props[prop];
    if (NotNull(value)) {
      !NotNull(merged) && ( merged = {});
      if (Array.isArray(value)) {
        value.forEach(val => merged = assignment(merged, val));
      } else {
        merged[prop] = value;
      }

    }
  });
  return merged;
};


/**
 * TimeMate
 */
const _Millisecond = {step: 1, unit: '毫秒'};
const _Second      = {step: _Millisecond.step * 1000, unit: '秒'};
const _Minute      = {step: _Second.step * 60, unit: '分钟'};
const _Hour        = {step: _Minute.step * 60, unit: '小时'};
const _Day         = {step: _Hour.step * 24, unit: '天'};
const _Week        = {step: _Day.step * 7, unit: '周'};
const _Month       = {step: _Week.step * 4, unit: '月'};
const _HalfYear    = {step: _Month.step * 6, unit: '半年'};
const _Year        = {step: _HalfYear.step * 2, unit: '年'};
const _Century     = {step: _Year.step * 100, unit: '世纪'};

const METAs     = Object.assign({
  Millisecond: _Millisecond,
  Second: _Second,
  Minute: _Minute,
  Hour: _Hour,
  Day: _Day,
  Week: _Week,
  Month: _Month,
  HalfYear: _HalfYear,
  Year: _Year,
  Century: _Century
});
const METAsList = Object.keys(METAs).map(key => METAs[key]).sort((prev, next) => prev.step - next.step);

/**
 * merge object with assign props which value must be available
 * @param time
 * @param mates
 * @returns {{number: Number, unit: null}}
 * @constructor
 */
const TimeMate     = (time, mates = METAsList) => {
  time = Math.abs(time);

  let result = NaN;
  let index  = -1;

  const length = mates.length;
  for (let i = 0; i < length; i++) {
    const temp = time / mates[i].step;
    const next = i === length - 1 ? -1 : mates[i + 1].step / mates[i].step;

    if (temp < next) {
      result = temp;
      index  = i;
      break;
    }

    result = temp;
    index  = i;
  }

  const {unit} = mates[index];

  return {number: result, unit: isNaN(result) ? null : unit};
}
TimeMate.METAs     = METAs;
TimeMate.normalize = (emus, filter) => {
  if (!Array.isArray(emus)) {
    emus = Object.keys(emus).reduce((acc, key) => {
      if (emus[key]) {
        acc.push(emus[key]);
      }
      return acc;
    }, []);
  }
  return emus.sort((prev, next) => prev.step - next.step)
};

/**
 * Duff's Device
 */
function DuffsDevice(list, process) {
  const iterations = list.length;

  let index = 0, n = iterations % 8;

  while (n--) {
    process(index, list[index++]);
  }

  n = (iterations * 0.125) ^ 0; //`value ^ 0` is the same as `Math.floor` for positive numbers and `Math.ceil` for negative numbers
  while (n--) {
    process(index, list[index++]);
    process(index, list[index++]);
    process(index, list[index++]);
    process(index, list[index++]);
    process(index, list[index++]);
    process(index, list[index++]);
    process(index, list[index++]);
    process(index, list[index++]);
  }
}

// expose
export {pixels, literal, assignment, TimeMate, isObject, DuffsDevice};
