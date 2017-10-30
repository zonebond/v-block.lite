/**
 * Created by zonebond on 2017/7/13.
 */

import ClassSymbol from './ClassSymbol'

@ClassSymbol('EventSubject')
class EventSubject {

  observers = [];

  constructor(type) {
    this.type = type;
  }

  /**
   * push observer into queue of observers
   * @param observer
   */
  attach(observer) {
    if (!EventObserver.is(observer))
      return false;

    if (observer.subject !== this) {
      this.observers.push(observer);
      return true;
    }

    return false;
  }

  /**
   * remove observer from queue of observers
   * @param observer
   */
  detach(observer) {
    if (!EventObserver.is(observer))
      return false;

    if (observer.subject === this) {
      const iterator = this.observers,
            length   = iterator.length;

      let index = 0;
      while (index < length) {
        if (iterator[index] === observer) {
          iterator.splice(index, 1);
          observer.unsubscribe();
          break;
        }
        index++;
      }
    }
  }

  /**
   * notification all observers
   */
  notification() {
    const iterator = this.observers,
          length   = iterator.length;

    let index = 0;
    while (index < length) {
      iterator[index].update.apply(null, arguments);
      index++;
    }
  }

  /**
   * release all observers
   * :: remove all observing items from queue of observers
   */
  dispose() {
    const iterator = this.observers;
    while (iterator.length) {
      iterator.shift().unsubscribe();
    }
  }
}

@ClassSymbol('EventObserver')
class EventObserver {

  hooks = {};

  set subject(value) {
    if (this._subject_ !== value) {
      this._subject_ && this._subject_.detach(this);
      this._subject_ = value;
    }
  }

  get subject() {
    return this._subject_;
  }

  /**
   * attach self into target subject
   * @param subject
   */
  subscribe(subject) {
    const attached = subject.attach(this);
    if (attached)
      this.subject = subject;

    return attached;
  }

  /**
   * detach self from target subject
   */
  unsubscribe() {
    this.subject.detach(this);
    this.subject = null;
  }

  /**
   * be triggering when observed subject call notification
   */
  update(type, args) {
    // to be implement
  }
}

export {
  EventSubject,
  EventObserver
}
