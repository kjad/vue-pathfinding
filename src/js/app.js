require("../css/app.css");
var Vue = require('vue');
var PriorityQueue = require('js-priority-queue');
const _ = require('lodash');

var q = new PriorityQueue({
  comparator: (a, b) => {
    return (a.cost < b.cost) ? -1 : (b.cost < a.cost) ? 1 : 0;
  }
});
q.queue({ cost: 9 });
q.queue({ cost: 1 });
q.queue({ cost: 2 });
q.queue({ cost: 0 });
q.queue({ cost: 4 });
q.queue({ cost: 4 });
q.queue({ cost: 9 });
q.queue({ cost: 5 });
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());

Vue.component('a-star', {
  data() {
    var start = { x: 5, y: 5, visited: false, frontier: false, queued: false, from: null, cost: 0, wall: wall };
    var finish = { x: 25, y: 25, visited: false, frontier: false, queued: false, from: null, cost: 0, wall: wall };
    var walls = [
      { x: 24, y: 1 },
      { x: 23, y: 1 },
      { x: 22, y: 1 },
      { x: 21, y: 1 },
      { x: 20, y: 1 },
      { x: 19, y: 1 },
      { x: 18, y: 1 },
      { x: 17, y: 1 },
      { x: 16, y: 1 },
      { x: 15, y: 1 },
      { x: 14, y: 1 },
      { x: 13, y: 1 },
      { x: 12, y: 1 },
      { x: 11, y: 1 },
      { x: 10, y: 1 },
      { x: 9, y: 1 },
      { x: 8, y: 1 },
      { x: 7, y: 1 },
      { x: 6, y: 1 },
      { x: 24, y: 24 },
      { x: 23, y: 24 },
      { x: 22, y: 24 },
      { x: 21, y: 24 },
      { x: 20, y: 24 },
      { x: 19, y: 24 },
      { x: 18, y: 24 },
      { x: 17, y: 24 },
      { x: 16, y: 24 },
      { x: 15, y: 24 },
      { x: 14, y: 24 },
      { x: 13, y: 24 },
      { x: 12, y: 24 },
      { x: 11, y: 24 },
      { x: 10, y: 24 },
      { x: 9, y: 24 },
      { x: 8, y: 24 },
      { x: 7, y: 24 },
      { x: 6, y: 24 },
      { x: 24, y: 23 },
      { x: 24, y: 22 },
      { x: 24, y: 21 },
      { x: 24, y: 20 },
      { x: 24, y: 19 },
      { x: 24, y: 18 },
      { x: 24, y: 17 },
      { x: 24, y: 16 },
      { x: 24, y: 15 },
      { x: 24, y: 14 },
      { x: 24, y: 13 },
      { x: 24, y: 12 },
      { x: 24, y: 11 },
      { x: 24, y: 10 },
      { x: 24, y: 9 },
      { x: 24, y: 8 },
      { x: 24, y: 7 },
      { x: 24, y: 6 },
      { x: 24, y: 5 },
      { x: 24, y: 4 },
      { x: 24, y: 3 },
      { x: 24, y: 2 },
    ];

    var grid = [];
    var open = new PriorityQueue({
      comparator: (a, b) => {
        return (a.cost < b.cost) ? -1 : (b.cost < a.cost) ? 1 : 0;
      }
    });
    open.queue(start);

    for (var i = 0; i < 30; i++) {
      var row = [];
      for (var j = 0; j < 30; j++) {
        var wall = (_.find(walls, { x: j, y: i }));
        row.push({
          x: j,
          y: i,
          visited: false,
          frontier: false,
          queued: false,
          from: null,
          cost: 0,
          wall: wall
        });
      }
      grid.push(row);
    }

    return {
      grid,
      nodes: _.flatten(grid),
      start,
      finish,
      open,
      closed: [],
      solved: false,
      route: false
    }
  },
  methods: {
    flagged: function(node) {
      if (node.x == this.start.x && node.y == this.start.y) {
        return 'S';
      }

      if (node.x == this.finish.x && node.y == this.finish.y) {
        return 'F';
      }

      if (node.visited) {
        // return 'v';
      }

      if (node.frontier) {
        // return 'f';
      }

      if (node.wall) {
        // return 'W';
      }

      if (node.from) {
        var icon = "";
        if (node.from.x > node.x) {
          icon = 'fa-arrow-right';
        } else if (node.from.x < node.x) {
          icon = 'fa-arrow-left';
        } else if (node.from.y > node.y) {
          icon = 'fa-arrow-down';
        } else {
          icon = 'fa-arrow-up';
        }
        return '<i class="fa ' + icon + '"</i>';
      }
    },
    findAdjacentNodes: function(node) {
      var adj = [];

      var leftNode = _.find(this.nodes, { x: node.x - 1, y: node.y });
      if (leftNode && !leftNode.wall) {
        adj.push(leftNode);
      }

      var rightNode = _.find(this.nodes, { x: node.x + 1, y: node.y });
      if (rightNode && !rightNode.wall) {
        adj.push(rightNode);
      }

      var topNode = _.find(this.nodes, { x: node.x, y: node.y - 1 });
      if (topNode && !topNode.wall) {
        adj.push(topNode);
      }

      var bottomNode = _.find(this.nodes, { x: node.x, y: node.y + 1 });
      if (bottomNode && !bottomNode.wall) {
        adj.push(bottomNode);
      }

      return adj;
    },
    steps: function(iterations) {
      for (var i = 0; i < iterations; i++) {
        this.step();
      }
    },
    tracePath: function() {
      var finish = this.grid[this.finish.y][this.finish.x];
      var node = finish.from;
      do {
        node.route = true;
        node = node.from;
      } while (node)

    },
    step: function() {
      if (this.solved) {
        return;
      }

      try {
        var node = this.open.dequeue();
      } catch (e) {
        alert("Completed the search, could not find the end :(");
      }

      // if (!node) {
      // }

      if (node.x == this.finish.x && node.y == this.finish.y) {
        this.solved = true;
        this.tracePath();
        return;
      }

      node.frontier = false;
      node.visited = true;
      // node.queued = false;
      this.closed.push(node);

      var vm = this;
      var adjs = this.findAdjacentNodes(node);

      adjs.forEach(function(n) {
        //if (!_.find(vm.closed, { x: n.x, y: n.y }) && !_.find(vm.open, { x: n.x, y: n.y })) {
        // var cost = node.cost + 1;
        // var cost = Math.abs(vm.finish.x - n.x) + Math.abs(vm.finish.y - n.y);
        var cost = node.cost + Math.abs(vm.finish.x - n.x) + Math.abs(vm.finish.y - n.y);
        // console.log(cost);
        if (n.queued == false && (n.cost == 0 || cost < n.cost)) {
          n.frontier = true;
          n.from = node;
          n.queued = true;
          n.cost = cost;
          vm.open.queue(n);
        }
      });

      // console.log('shifted off:', node.x, node.y, 'open len:', this.open.length, 'closed len:', this.closed.length, 'adjs:', adjs.map(a => a.x.toString() + ',' + a.y.toString()));
    },
    mouseover: function(node) {
      //console.log(node);
    }
  }
});

new Vue({ el: '#app' });
