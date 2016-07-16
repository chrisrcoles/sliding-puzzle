'use strict';

// https://github.com/agnat/js_priority_queue/blob/master/priority_queue.js

class PriorityQueue {
  constructor (comparator, queue) {
    this._comparator = comparator || PriorityQueue.minFirst;
    this._elements = queue || [];
  }

  static minFirst (a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    else {
      a = a.toString();
      b = b.toString();

      if (a == b) return 0;

      return (a > b) ? 1 : -1;
    }
  }
  
  static maxFirst (a, b) {
    return b - a;
  }

  isEmpty () {
    return this.size() === 0;
  }
  
  peek () {
    if (this.isEmpty()) throw new Error('Priority Queue is empty');
    
    return this._elements[0]
  }
  
  _compare (a, b) {
    return this._comparator(this._elements[a], this._elements[b])
  }
  
  size () {
    return this._elements.length;
  }
  
  dequeue () {
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
  
  enqueue (element) {
    var size = this._elements.push(element);
    var current = size - 1;

    while (current > 0) {
      var parent = Math.floor((current - 1) / 2);

      if (this._compare(current, parent) <= 0) break;

      this._swap(parent, current);
      current = parent;
    }

    return size;
  }
  
  _swap (a, b) {
    let temp = this._elements[a];
    this._elements[a] = this._elements[b];
    this._elements[b] = temp;
  }

}



export default PriorityQueue;