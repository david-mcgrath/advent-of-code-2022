var url = "https://adventofcode.com/2022/day/17/input";
var testData = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
`;

var shapeData = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`

function withinBounds(shape, offset) {
	return shape[1]
		.map(x => x[0] + offset[0])
		.filter(x => x < 0 || x > 6)
		.length === 0;
}
function checkBlocked(blocked, shape, offset) {
	for (let i = 0; i < shape[1].length; i++) {
		let curr = [shape[1][i][0] + offset[0], shape[1][i][1] + offset[1]];
		if (blocked[curr[0] + "," + curr[1]]) {
			return true;
		}
	}
	return false;
}
function applyBlock(blocked, shape, offset, highest) {
	for (let i = 0; i < shape[1].length; i++) {
		let curr = [shape[1][i][0] + offset[0], shape[1][i][1] + offset[1]];
		if (curr[1] > highest) {
			highest = curr[1];
		}
		
		blocked[curr[0] + "," + curr[1]] = true;
	}
	
	return highest;
}
function render(blocked) {
	let pts = Object.keys(blocked)
		.map(x => x
			.split(",")
			.map(y => +y));
	
	let height = pts
		.map(x => x[1])
		.reduce((a, b) => a > b ? a : b) + 3;
	
	let output = [];
	for (let i = 0; i < height; i++) {
		output[i] = ["|",".",".",".",".",".",".",".","|"];
	}
	output[height] = ["+","-","-","-","-","-","-","-","+"];
	
	for (let i = 0; i < pts.length; i++) {
		output[height - 1 - pts[i][1]][pts[i][0] + 1] = "#";
	}
	
	console.log(output.map(x => x.reduce((a, b) => a + b)).reduce((a, b) => a + "\n" + b));
}

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

let isDebug = false;
let isTest = false;
await getInput(isTest)
	.then(input => {
		let jets = input
			.split("\n")
			.filter(x => x)[0]
			.split("")
			.filter(x => x);
		
		let shapes = shapeData
			.split("\n\n")
			.map(s => s
				.split("\n")
				.map(x => x
					.split("")
					.map((y, i) => [y, i]))
				.map((x, i) => x
					.map(y => [y[0], y[1], i]))
				.reduce((a, b) => a.concat(b))
				.filter(x => x[0] === "#")
				.map(y => [y[1], y[2]]))
			.map(s => [s.map(x => x[1]).reduce((a, b) => a > b ? a : b), s])
			.map(s => [s[0], s[1].map(x => [x[0], s[0] - x[1]])]);
		
		let blocked = {};
		
		let highest = -1;
		
		let currJet = 0;
		let currShape = 0;
		
		let numShapes = 2022;
		
		for (let n = 0; n < numShapes; n++) {
			let shape = shapes[currShape];
			currShape = (currShape + 1) % shapes.length;
			
			let offset = [2, highest + 3 + 1];// + shape[0]];
			if (isDebug)
				console.log("\n\nNew shape:\n");
				
			while (true) {
				// Apply jet
				let jet = jets[currJet];
				if (isDebug)
					console.log(jet);
				currJet = (currJet + 1) % jets.length;
				
				let tmpOffset = offset;
				switch (jet) {
					case "<":
						tmpOffset = [offset[0] - 1, offset[1]];
						break;
					case ">":
						tmpOffset = [offset[0] + 1, offset[1]];
						break;
				}
				
				if (withinBounds(shape, tmpOffset)) {
					if (!checkBlocked(blocked, shape, tmpOffset)) {
						offset = tmpOffset;
					}
				}
				
				// Apply gravity
				tmpOffset = [offset[0], offset[1] - 1];
				if (tmpOffset[1] < 0 || checkBlocked(blocked, shape, tmpOffset)) {
					highest = applyBlock(blocked, shape, offset, highest);
					break;
				}
				
				offset = tmpOffset;
			}
			
			// output
			if (isDebug && n < 10) {
				render(blocked);
			}
		}
		
		return highest + 1;
	});