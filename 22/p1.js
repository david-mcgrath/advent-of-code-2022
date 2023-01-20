var url = "https://adventofcode.com/2022/day/22/input";
var testData = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function Node(x, y, open) {
	this.X = x;
	this.Y = y;
	this.Open = open;
	
	this.Left = null;
	this.Right = null;
	this.Up = null;
	this.Down = null;
}
function State(currentNode, headingId) {
	let self = this;
	let headings = [">", "v", "<", "^"];
	let headingMoveProps = ["Right", "Down", "Left", "Up"];
	
	this.CurrentNode = currentNode;
	this.HeadingId = headingId;
	
	this.Heading = function () {
		return headings[self.HeadingId];
	}
	this.Turn = function (dir) {
		let diff = dir === "L"
			? -1
			: dir === "R"
				? 1
				: 0;
		
		self.HeadingId = (self.HeadingId + diff + headings.length) % headings.length;
	}
	this.Move = function (dist) {
		let moveProp = headingMoveProps[self.HeadingId];
		for (let i = 0; i < dist; i++) {
			let next = self.CurrentNode[moveProp];
			if (!next || !next.Open)
				break;
			
			self.CurrentNode = next;
		}
	}
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		input = input
			.split("\n\n");
		
		let map = input[0]
			.split("\n")
			.filter(x => x)
			.map((x, i) => x
				.split("")
				.map((y, j) => [y, i, j]))
			.reduce((a, b) => a.concat(b))
			.filter(x => x[0] !== " ");
		
		let moves = input[1]
			.split("\n")
			.filter(x => x)[0]
			.split("L")
			.map(x => x
				.split("R")
				.map(y => {
					return [{
						type: "move",
						arg: +y
					}];
				})
				.reduce((a, b) => a.concat([{ type: "turn", arg: "R" }]).concat(b)))
			.reduce((a, b) => a.concat([{ type: "turn", arg: "L" }]).concat(b));
		
		// Map of nodes
		let nodes = [],
			nodeMap = [],
			rowLimits = [],
			colLimits = [];
		
		for (let i = 0; i < map.length; i++) {
			let curr = map[i];
			let node = new Node(curr[2], curr[1], curr[0] !== "#");
			
			if (!nodeMap[node.X])
				nodeMap[node.X] = [];
			nodeMap[node.X][node.Y] = node;
			nodes.push(node);
			
			if (!rowLimits[node.Y]) {
				rowLimits[node.Y] = {
					min: node.X,
					max: node.X
				};
			}
			else {
				if (node.X < rowLimits[node.Y].min)
					rowLimits[node.Y].min = node.X;
				if (node.X > rowLimits[node.Y].max)
					rowLimits[node.Y].max = node.X;
			}
			
			if (!colLimits[node.X]) {
				colLimits[node.X] = {
					min: node.Y,
					max: node.Y
				};
			}
			else {
				if (node.Y < colLimits[node.X].min)
					colLimits[node.X].min = node.Y;
				if (node.Y > colLimits[node.X].max)
					colLimits[node.X].max = node.Y;
			}
		}
		
		// Link the nodes
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			
			let rowLimit = rowLimits[node.Y],
				colLimit = colLimits[node.X];
			
			let left = node.X - 1,
				right = node.X + 1,
				up = node.Y - 1,
				down = node.Y + 1;

			if (left < rowLimit.min)
				left = rowLimit.max;
			if (right > rowLimit.max)
				right = rowLimit.min;
			if (up < colLimit.min)
				up = colLimit.max;
			if (down > colLimit.max)
				down = colLimit.min;
			
			node.Left = nodeMap[left][node.Y];
			node.Right = nodeMap[right][node.Y];
			node.Up = nodeMap[node.X][up];
			node.Down = nodeMap[node.X][down];
		}
		
		// Get the start node and initialise the state
		let state = new State(nodeMap[rowLimits[0].min][0], 0);
		
		// Execute the moves
		for (let i = 0; i < moves.length; i++) {
			let move = moves[i];
			
			switch (move.type) {
				case "turn":
					state.Turn(move.arg);
					break;
				case "move":
					state.Move(move.arg);
					break;
			}
		}
		
		return 1000 * (state.CurrentNode.Y + 1) + 4 * (state.CurrentNode.X + 1) + state.HeadingId;
	});