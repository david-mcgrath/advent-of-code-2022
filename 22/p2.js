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

function render(nodeMap, state) {
	let output = [],
		max_i = 0,
		max_j = 0;
	for (let i = 0; i < nodeMap.length; i++) {
		for (let j = 0; j < nodeMap[i].length; j++) {
			output[j] = "";
			let curr = nodeMap[i][j];
			if (curr) {				
				if (curr.X > max_i) max_i = curr.X;
				if (curr.Y > max_j) max_j = curr.Y;
			}
		}
	}
	for (let i = 0; i <= max_i; i++) {
		for (let j = 0; j <= max_j; j++) {
			output[j] += state.CurrentNode.X === i && state.CurrentNode.Y === j
				? state.Heading()
				: nodeMap[i][j]
					? nodeMap[i][j].Open
						? "."
						: "#"
					: " ";
		}
	}
	
	console.log(output.reduce((a, b) => a + "\n" + b));
	
	debugger;
}

function linkNodes(nodes, nodeMap) {
	function fold(length) {
		let changed = false;
		
		let cornerDeltas = [
			[0, 0],
			[length - 1, 0],
			[0, length - 1],
			[length - 1, length - 1]
		];
		
		// Iterate through each face
		for (let i = 0; i < nodeMap.length; i += length) {
			for (let j = 0; j < nodeMap[i].length; j += length) {
				// Check if the face exists
				if (nodeMap[i][j]) {
					// Now iterate through each corner
					for (let k = 0; k < cornerDeltas.length; k++) {
						let node = nodeMap[i + cornerDeltas[k][0]][j + cornerDeltas[k][1]];
						
						// For each of the four initial headings, check if the following exist:
							// 1
							// L1
						// If they do, then there are adjacent nodes
						// Check if 1L1 exists (i.e. check if there's a gap)
						// If it doesn't, need to fold
							// 1L1 = L1
							// So set 1L1 to L1, with an additional L turn
							
							// 1L1 = L1R
							
						for (let headingId = 0; headingId < 4; headingId++) {
							let state_1 = new State(node, headingId);
							let state_2 = state_1.Clone().Turn("L");
							
							// Maintain orientation changes across multiple folds
							let delta = 1 + state_1.CurrentNode[state_1.HeadingProp() + "OrientationChange"] - state_2.CurrentNode[state_2.HeadingProp() + "OrientationChange"];
							
							if (state_1.CheckNextNode() && state_2.CheckNextNode()) {
								state_1.MoveFree().Turn("L"); // 1L
								state_2.MoveFree(); // L1
								if (!state_1.CheckNextNode()) {
									// Need to fold
									changed = true;
									for (let _i = 0; _i < length; _i++) {
										
										
										// (_i + 1)L1 = L(_i + 1)
										state_2.Turn("R");
										
										state_2.CurrentNode[state_2.HeadingProp()] = state_1.CurrentNode;
										state_2.CurrentNode[state_2.HeadingProp() + "OrientationChange"] += delta;
										
										state_1.CurrentNode[state_1.HeadingProp()] = state_2.CurrentNode;
										state_1.CurrentNode[state_1.HeadingProp() + "OrientationChange"] -= delta;
										
										if (_i < length - 1) {
											state_1.Turn("R").MoveFree().Turn("L");
											state_2.Turn("L").MoveFree();
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		return changed;
	}
	
	// The height / width / depth are equal to the number of nodes / 6 (to get nodes per face), then square rooted
	let length = Math.sqrt(nodes.length / 6);
	
	// First, do the obvious links
	let max_x = 0,
		max_y = 0;
	for (let i = 0; i < nodes.length; i++) {
		let node = nodes[i];
		if (node.X > max_x) max_x = node.X;
		if (node.Y > max_y) max_y = node.Y;
	}
	for (let i = 0; i < nodes.length; i++) {
		let node = nodes[i];
		
		if (node.Y > 0 && nodeMap[node.X][node.Y - 1])
			node.Up = nodeMap[node.X][node.Y - 1];
		if (node.Y < max_y && nodeMap[node.X][node.Y + 1])
			node.Down = nodeMap[node.X][node.Y + 1];
		if (node.X > 0 && nodeMap[node.X - 1][node.Y])
			node.Left = nodeMap[node.X - 1][node.Y];
		if (node.X < max_x && nodeMap[node.X + 1][node.Y])
			node.Right = nodeMap[node.X + 1][node.Y];
	}
	
	// Now fold any edges until all are done
	while (fold(length)) {}
}

function Node(x, y, open) {
	this.X = x;
	this.Y = y;
	this.Open = open;
	
	this.Left = null;
	this.Right = null;
	this.Up = null;
	this.Down = null;
	
	this.LeftOrientationChange = 0;
	this.RightOrientationChange = 0;
	this.UpOrientationChange = 0;
	this.DownOrientationChange = 0;
}
function State(currentNode, headingId) {
	let self = this;
	let headings = [">", "v", "<", "^"];
	let headingMoveProps = ["Right", "Down", "Left", "Up"];
	
	this.CurrentNode = currentNode;
	this.HeadingId = (headingId + headings.length) % headings.length;
	
	this.HeadingMoveProps = headingMoveProps;
	this.Clone = function () {
		return new State(self.CurrentNode, self.HeadingId);
	}
	
	this.Heading = function () {
		return headings[self.HeadingId];
	}
	this.HeadingProp = function () {
		return headingMoveProps[self.HeadingId];
	}
	this.Turn = function (dir, renderNodeMap) {
		let diff = dir === "L"
			? -1
			: dir === "R"
				? 1
				: 0;
		
		self.HeadingId = (self.HeadingId + diff + headings.length) % headings.length;
		
		if (renderNodeMap)
			render(renderNodeMap, self);
	
		return self;
	}
	this.Move = function (dist, renderNodeMap) {
		for (let i = 0; i < dist; i++) {
			let moveProp = headingMoveProps[self.HeadingId];
			let next = self.CurrentNode[moveProp];
			if (!next || !next.Open)
				break;
			
			self.HeadingId = (self.HeadingId + self.CurrentNode[moveProp + "OrientationChange"] + headings.length) % headings.length;
			self.CurrentNode = next;
			
			if (renderNodeMap)
				render(renderNodeMap, self);
		}
		
		return self;
	}
	this.MoveFree = function () {
		let moveProp = headingMoveProps[self.HeadingId];
		let next = self.CurrentNode[moveProp];
		if (!next)
			throw "Unexpected move: no next node found";
		
		self.HeadingId = (self.HeadingId + self.CurrentNode[moveProp + "OrientationChange"] + headings.length) % headings.length;
		self.CurrentNode = next;
		
		return self;
	}
	this.CheckNextNode = function () {
		let moveProp = headingMoveProps[self.HeadingId];
		return self.CurrentNode[moveProp];
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
		
		// To link, I need to figure out the position and orienation of the faces
		linkNodes(nodes, nodeMap);
		
		// Link the nodes
		// for (let i = 0; i < nodes.length; i++) {
			// let node = nodes[i];
			
			// let rowLimit = rowLimits[node.Y],
				// colLimit = colLimits[node.X];
			
			// let left = node.X - 1,
				// right = node.X + 1,
				// up = node.Y - 1,
				// down = node.Y + 1;

			// if (left < rowLimit.min)
				// left = rowLimit.max;
			// if (right > rowLimit.max)
				// right = rowLimit.min;
			// if (up < colLimit.min)
				// up = colLimit.max;
			// if (down > colLimit.max)
				// down = colLimit.min;
			
			// node.Left = nodeMap[left][node.Y];
			// node.Right = nodeMap[right][node.Y];
			// node.Up = nodeMap[node.X][up];
			// node.Down = nodeMap[node.X][down];
		// }
		
		// Get the start node and initialise the state
		let state = new State(nodes[0], 0);
		let renderNodeMap = isTest ? nodeMap : null;
		if (isTest)
			render(nodeMap, state);
		
		// Execute the moves
		for (let i = 0; i < moves.length; i++) {
			let move = moves[i];
			
			switch (move.type) {
				case "turn":
					state.Turn(move.arg, renderNodeMap);
					break;
				case "move":
					state.Move(move.arg, renderNodeMap);
					break;
			}
		}
		
		return 1000 * (state.CurrentNode.Y + 1) + 4 * (state.CurrentNode.X + 1) + state.HeadingId;
	});