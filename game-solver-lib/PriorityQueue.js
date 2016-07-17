'use strict';

// https://github.com/agnat/js_priority_queue/blob/master/priority_queue.js

class PriorityQueue {
  constructor (comparator, queue) {
    this._comparator = comparator || PriorityQueue.lowestCost;
    this._elements = queue || [];
  }

  static lowestCost(a, b) {
    console.log('a = ', a)
    console.log('b = ', b)
    if (!b) {
      return a
    }
    return a.cost - b.cost
  }

  static minFirst(a, b) {
    return a - b
  }

  static maxFirst(a, b) {
    return b - a;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    if (this.isEmpty()) throw new Error('Priority Queue is empty');

    return this._elements[0]
  }

  _compare(a, b) {
    return this._comparator(this._elements[a], this._elements[b])
  }

  size() {
    return this._elements.length;
  }

  dequeue() {
    let first = this.peek();
    let last = this._elements.pop();
    let size = this.size();

    if (size === 0) return first;

    this._elements[0] = last;
    var current = 0;

    while (current < size) {
      var largest = current;
      var left = (2 * current) + 1;
      var right = (2 * current) + 2;

      if (left < size && this._compare(left, largest) >= 0) {
        largest = left;
      }

      if (right < size && this._compare(right, largest) >= 0) {
        largest = right;
      }

      if (largest === current) break;

      this._swap(largest, current);
      current = largest;
    }

    return first;

  }

  enqueue(element) {
    console.log('Enqueeu', element)
    var size = this._elements.push(element);
    var current = size - 1;

    console.log('SIZE = ', size);
    console.log('CURRENT = ', current);
    // return

    while (current > 0) {
      console.log('infinite loop!!!')
      var parent = Math.floor((current - 1) / 2);

      console.log('hi')

      if (this._compare(current, parent) <= 0) break;

      console.log('can compare')

      this._swap(parent, current);
      current = parent;
    }

    return size;
  }

  _swap(a, b) {
    let temp = this._elements[a];
    this._elements[a] = this._elements[b];
    this._elements[b] = temp;
  }

}


// var queue = new PriorityQueue();
//
// console.log('QUEUE before = ', queue);
// queue.enqueue({
//                 cost: 45,
//                 nodeNumber: 1,
//                 board: '536_18247',
//                 pointer: 0,
//                 grandFatherNode: null
//               });
// queue.enqueue({
//                 cost: 44,
//                 nodeNumber: 1,
//                 board: '536_18247',
//                 pointer: 0,
//                 grandFatherNode: null
//               });
// queue.enqueue({
//                 cost: 46,
//                 nodeNumber: 1,
//                 board: '536_18247',
//                 pointer: 0,
//                 grandFatherNode: null
//               });
// console.log('QUEUE after = ', queue);
//
// queue.dequeue();
//
// console.log('QUEUE after dequeuing = ', queue);


module.exports = PriorityQueue;