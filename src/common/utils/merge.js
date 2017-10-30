/**
 * Created by zonebond on 2017/7/5.
 */
const merge = (target, clone) => {
  if (!target || !clone) return target;

  const result = {...target};

  for (let prop in clone) {
    const value = clone[prop];
    if (result.hasOwnProperty(prop) && value && value instanceof Array === false && typeof value === 'object') {
      result[prop] = merge(target[prop], value);
    } else {
      result[prop] = value;
    }
  }

  return result;
};

const mergeProps = (target, clone) => {
  if (!target || !clone) return target;
  const result = {...target};

  for (let prop in clone) {
    result[prop] = prop === 'style' ? {...target.style, ...clone.style} : clone[prop];
  }

  return result;
};

export {merge, mergeProps} ;
