/**
 * Created by zonebond on 2017/7/21.
 */

/* eslint no-mixed-operators:0 */

let _code_   = 0xaac0;
const marker = () => _code_++;

function ClassTypeSymbol(type) {
  return typeof Symbol === 'function' && Symbol['for'] && Symbol['for'](type) || marker();
}

const tag_name = '__$$typeof__';
export default function ClassSymbol(type) {
  if (typeof type !== 'string')
    throw new Error('ClassType need a argument of string :: type');

  const decorator = function(target) {

    const $$typeof = ClassTypeSymbol(`_${type}_symbol_`);
    const proto    = target.prototype;

    Object.defineProperty(proto, tag_name, {
      get: () => {
        return $$typeof;
      },
      configurable: false,
      enumerable: false
    });

    Object.defineProperty(target, `is${target.name}`, {})

    // target[`is${target.name}`] = (instance) => {
    //   return instance[tag_name] === $$typeof || instance.prototype[tag_name] === $$typeof;
    // };

    target.is = (instance) => {
      return instance[tag_name] === $$typeof || instance.prototype[tag_name] === $$typeof;
    };
  };

  return decorator;
}
