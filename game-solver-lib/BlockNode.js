'use strict';

class BlockNode {
  constructor(cost, nodeNumber, board, pointer) {
    this.cost = cost;
    this.nodeNumber = nodeNumber;
    this.board = board;
    this.pointer = pointer;
  }

  // Game Nodes
  // all should have the four following items
  // 1. expected cost of the best solution containing the
  //    path so far
  // 2. number of this node, i.e., the order it was created
  // 3. the nine character tile configuration of the board
  // 4. a pointer to the parent node of this node
  // order is important

}

module.exports = BlockNode;