/**
 * Created by zonebond on 2017/4/8.
 */

/**
 * [Decorator] Fetch data cache controller.
 * @param expire 'cache expire time (unit: Millisecond)'
 * @returns Promise's Decorator
 */
export default function cached() {

  const first_arg     = arguments[0];
  const has_arguments = arguments.length === 1 && typeof first_arg === 'number';
  const expire        = has_arguments ? first_arg : 60000;

  const decorator = (onwer, name, target) => {

    const primitive = target.value;

    target.value = function (use_cached = true) {
      const cache_tag = `$$last-${name}-tag$$`;

      if (use_cached && onwer[cache_tag]) {
        if (Date.now() - onwer[cache_tag].lastUpdateTimestamp <= expire) {
          return new Promise(resolve => resolve(onwer[cache_tag].data));
        }
      }

      const primitive_pm = primitive.call(null, arguments);

      return new Promise((resolve, rejct) => {
        primitive_pm.then(data => {
          onwer[cache_tag] = {lastUpdateTimestamp: Date.now(), data: data};
          resolve(data);
        });
      })
    };

    return target;
  };

  return has_arguments ? decorator : decorator.call(null, ...arguments);
}
