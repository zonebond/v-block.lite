/**
 * Created by zonebond on 2017/5/17.
 */

/* eslint no-useless-escape: 0 */

/**
 * RESTish API Wrapper
 * @param api
 * @param params
 * @constructor
 */
const RESTish = (api, params) => {
  let result = api.replace(/\\/g, '');
  if (params) {
    Object.keys(params).forEach(key => {
      const regexp = new RegExp(`/:${key}+`, 'g');
      if (regexp.exec(result)) {
        result = result.replace(regexp, `/${params[key]}`);
      } else {
        if (!/\?/.exec(result)) {
          result += '?';
        }
        result += (/\?$/.exec(result) ? '' : '&' ) + `${key}=${params[key]}`;
      }
    });
  }
  result = result.replace(/\/\:[A-Za-z0-9\._-]+/g, '');
  result = result.replace(/\?$/g, '');
  return result;
};

/**
 *
 * @param request
 * @param fulfilled
 * @param exception
 * @returns {Promise}
 * @constructor
 */
const PM = (request, fulfilled, exception, pending) => {
  return new Promise((resolve, reject) => {
    if (typeof pending === 'function') {
      pending(true);
    }

    const hook_proxy = handle => (result) => {
      handle(result);
      if (typeof pending === 'function') {
        pending(false);
      }
    };

    const hook_proxy_resolve = hook_proxy(resolve);
    const hook_proxy_reject  = hook_proxy(reject);

    request.then(
        response => fulfilled(hook_proxy_resolve, response),
        message => exception(hook_proxy_reject, message)
    ).catch(error => exception(hook_proxy_reject, error));
  });
};

export {
  RESTish, PM
}