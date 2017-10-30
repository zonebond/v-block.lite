/**
 * Created by zonebond on 2017/7/13.
 */
import {EventSubject, EventObserver} from './index'
import ClassSymbol from './ClassSymbol'

/**
 * multiple extends
 * @param mixins
 * @returns {Mix}
 */
export function mix(...mixins) {
  class Mix {
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== "constructor" && key !== "prototype" && key !== "name") {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

const Events = {
  ON_FILL_ITEMS: '-on-fill-items-',
  ON_PUSH_ITEMS: '-on-push-items-',
  ON_DROP_ITEMS: '-on-drop-items-',
  ON_PACK_ITEMS: '-on-pack-items-',
  ON_INTO_ITEMS: '-on-into-items-'
};

const Descriptor = (configs, options) => {
  configs.configurable = true;

  if (options)
    for (let opt in options) {
      configs[opt] = options[opt];
    }

  return configs;
};

function GeneratorIndexer(target, position, count, callback) {
  const descriptors = {};

  const getter = index => () => callback.call(target, 'get', index);
  const setter = index => value => callback.call(target, 'set', index, value);

  let index = 0;
  while (index < count) {
    const indexer        = position + index;
    descriptors[indexer] = Descriptor({
      get: getter(indexer),
      set: setter(indexer),
    });
    index++;
  }

  // extend bounder
  const bound_getter = index => () => {
    GeneratorIndexer(target, index, count + 1, callback);
    return callback.call(target, 'get', index);
  };
  const bound_setter = index => value => {
    GeneratorIndexer(target, index, count + 1, callback);
    callback.call(target, 'set', index, value);
  };
  descriptors[index] = Descriptor({
    get: bound_getter(index),
    set: bound_setter(index),
  });

  Object.defineProperties(target, descriptors);
}

/**
 * ItemCollection
 */
@ClassSymbol("ItemCollection")
class ItemCollection {

  static FILL_ITEMS = '-on-fill-items-';
  static PUSH_ITEMS = '-on-push-items-';
  static DROP_ITEMS = '-on-drop-items-';
  static PACK_ITEMS = '-on-pack-items-';
  static INTO_ITEMS = '-on-into-items-';

  subject  = null;
  observer = null;

  collection = [];

  hooks = {};

  get length() {
    return this.collection.length;
  }

  get items() {
    return this.collection.concat();
  }

  get shortenKey() {
    if (this.__count__ === undefined)
      this.__count__ = 0;
    else
      this.__count__++;
    return (this.__count__).toString(36);
  }

  constructor(resolve) {
    this.subject = new EventSubject('ItemCollection');

    this.observer        = new EventObserver();
    this.observer.update = this.update.bind(this);

    this.resolve = resolve;

    GeneratorIndexer(this, 0, 300, this.__indexer__);
  }

  __indexer__ = (type, index, value) => {
    return type === 'get' ? this.collection[index] : (this.pack(index, value));
  };

  // subject parts
  notification(type, ...args) {
    this.subject.notification(type, ...args);
  }

  push(...items) {
    this.collection.push(...items);
    this.notification(Events.ON_PUSH_ITEMS, ...items);
  }

  drop(start, count) {
    this.collection.splice(start, count);
    this.notification(Events.ON_DROP_ITEMS, start, count);
  }

  pack(position, item) {
    const collection = this.collection,
          count      = collection.length - 1;
    if (position < 0 || position > count)
      throw new Error('Invalidate [position] or out of range!');
    this.collection[position] = item;
    this.notification(Events.ON_PACK_ITEMS, position, item);
  }

  into(position, ...items) {
    this.collection.splice(position, 0, ...items);
    this.notification(Events.ON_INTO_ITEMS, position, ...items);
  }

  fill(items) {
    this.collection = items;
    this.notification(Events.ON_FILL_ITEMS, ...items);
  }

  find(callback) {
    if (typeof callback !== "function")
      throw new Error('The argument of [find] method must of a function that iterate item in ItemCollection.');

    const index = this.index(callback);
    return index === -1 ? null : this.collection[index];
  }

  index(callback) {
    if (typeof callback !== "function")
      throw new Error('The argument of [index] method must of a function that iterate item in ItemCollection.');

    const collection = this.collection,
          length     = collection.length;

    let index = 0;
    while (index < length) {
      const item = collection[index];
      if (callback(item, index))
        return index;
      index++;
    }

    return -1;
  }

  when(type, hook) {
    if (hook === undefined) {
      return this.hooks[type];
    } else {
      this.hooks[type] = hook;
    }
  }

  // observer pats
  update(type, ...args) {
    const hook = this.when(type === Events.ON_INTO_ITEMS || type === Events.ON_FILL_ITEMS || type === Events.ON_PACK_ITEMS ? Events.ON_PUSH_ITEMS : type);

    if (type === Events.ON_PUSH_ITEMS) {
      const produces = hook ? hook(...args) : args;
      this.push(...produces);
      return this.trigger();
    }

    if (type === Events.ON_DROP_ITEMS) {
      this.drop(...args);
      return this.trigger();
    }

    if (type === Events.ON_PACK_ITEMS) {
      const [position, item] = args;
      const produce          = hook ? hook(item) : item;
      this.pack(Number(position), produce);
      return this.trigger();
    }

    if (type === Events.ON_INTO_ITEMS) {
      const [position, ...items] = args;
      const views                = hook ? hook(...items) : items;
      this.into(Number(position), ...views);
      return this.trigger();
    }

    if (type === Events.ON_FILL_ITEMS) {
      const produces  = hook ? hook(...args) : args;
      this.collection = [...produces];
      this.fill(produces);
      return this.trigger();
    }
  }

  trigger() {
    if (typeof this.resolve === 'function')
      this.resolve.call(null);
  }

  connect(itemCollection) {
    if (itemCollection === this)
      throw new Error(`ItemCollection can not subscribe it self !`);

    if (!ItemCollection.is(itemCollection))
      throw new Error(`ItemCollection can only [connect to] an instance of ItemCollection!`);

    const connected = this.observer.subscribe(itemCollection.subject);

    if (connected)
      this.update(Events.ON_FILL_ITEMS, ...itemCollection.collection);
  }

  disconnect() {
    this.observer.unsubscribe();
  }
}

@ClassSymbol('ItemDictionary')
class ItemDictionary {

  static PUT_ITEMS = '-on-put-items-';
  static DEL_ITEMS = '-on-del-items-';
  static ALL_ITEMS = '-on-all-items-';

  __source_map__ = {};

  constructor(key_field, resolve) {
    this.subject = new EventSubject('ItemCollection');

    this.observer        = new EventObserver();
    this.observer.update = this.__update__.bind(this);

    this.__key_field__ = key_field;
    this.resolve       = resolve;
  }

  get length() {
    return Object.keys(this.__source_map__).length;
  }

  get key_field() {
    return this.__key_field__;
  }

  get items() {
    return Object.keys(this.__source_map__).map(key => this.__source_map__[key]);
  }

  __indexer__(index) {
    return {
      get: () => this.collection[index],
      set: (value) => this.__pack__(index, value)
    };
  }

  __getter__ = (key) => () => this.__source_map__[key];

  __setter__ = (key) => (value) => this.__pack__(key, value);

  ___notification___(type, ...args) {
    this.subject.notification(type, ...args);
  }

  put(items, overlap = true) {

    items = Array.isArray(items) ? items : [items];

    const descriptors = {};
    items.forEach((item) => {
      const key = item[this.key_field];
      const has = this.hasOwnProperty(key);
      if (has && !overlap)
        throw new Error('The identity conflict ::: put items has one that id already in ItemDictionary !');

      if (!has)
        descriptors[key] = Descriptor({get: this.__getter__(key), set: this.__setter__(key)});

      this.__source_map__[key] = item;
    });

    Object.defineProperties(this, descriptors);

    this.___notification___(ItemDictionary.PUT_ITEMS, items);
  }

  del(key) {

    const keys = Array.isArray(key) ? key : [key];

    const values = [];
    keys.forEach(key => {
      const value = this[key];
      if (!value)
        return;

      delete this.__source_map__[key];
      values.push(value);
    });

    this.___notification___(ItemDictionary.DEL_ITEMS, keys);
  }

  all(items) {

    const descriptors = {};
    items.forEach(item => {
      const key = item[this.key_field],
            has = this.hasOwnProperty(key);

      this.__source_map__.hasOwnProperty(key) && delete this.__source_map__[key];

      if (!has)
        descriptors[key] = Descriptor({get: this.__getter__(key), set: this.__setter__(key)});

    });

    const old_keys = Object.keys(this.__source_map__);

    this.__source_map__ = items;

    // remove invalidate keys
    old_keys.forEach(key => delete this[key]);

    // add validate keys
    Object.defineProperties(this, descriptors);

    this.___notification___(ItemDictionary.ALL_ITEMS, items);
  }

  __pack__(key, item) {
    this.__source_map__[key] = item;
    this.___notification___(ItemDictionary.PUT_ITEMS, [item]);
  }

  when(type, hook) {
    this.hook = hook;
  }

  // observer pats
  __update__() {
    const [type, ...args] = arguments;
    const hook            = this.hook;

    if (type === ItemDictionary.PUT_ITEMS) {
      const items    = args[0] || [];
      const produces = hook ? hook(...items) : items;
      this.put(produces, true);
      return this.__trigger__();
    }

    if (type === ItemDictionary.DEL_ITEMS) {
      const delete_keys = args[0];
      this.del(delete_keys);
      return this.__trigger__();
    }

    if (type === ItemDictionary.ALL_ITEMS) {
      const items    = args[0] || [];
      const produces = hook ? hook(...items) : items;
      this.all(produces);
      return this.__trigger__();
    }
  }

  __trigger__() {
    if (typeof this.resolve === 'function')
      this.resolve.call(null);
  }

  connect(itemDictionary) {
    if (itemDictionary === this)
      throw new Error(`ItemDictionary can not subscribe it self !`);

    if (!ItemDictionary.isItemDictionary(itemDictionary))
      throw new Error(`ItemDictionary can only [connect to] an instance of ItemDictionary!`);

    const connected = this.observer.subscribe(itemDictionary.subject);

    if (connected)
      this.__update__(ItemDictionary.ALL_ITEMS, itemDictionary.items);
  }

  disconnect() {
    this.observer.unsubscribe();
  }

}

export {
  ItemCollection,
  ItemDictionary
};
