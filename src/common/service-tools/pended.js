/**
 * Created by zonebond on 2017/7/18.
 */

// auto-pending
export function pended(target, name, descriptor) {

  const primitive = descriptor.value;

  descriptor.value = function (...args) {
    const _tag_ = `$$pended-${name}-tag$$`;

    if (target[_tag_])
      return {
        then: () => {
        }
      };

    target[_tag_] = true;

    const ppm = primitive(...args);

    return new Promise((resolve, reject) => {
      ppm.then(response => {
        resolve(response);
        target[_tag_] = false;
      });
      ppm.catch(error => {
        reject(error);
        target[_tag_] = false;
      })
    });
  };

  return descriptor;
}
