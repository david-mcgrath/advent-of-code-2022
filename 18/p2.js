var url = "https://adventofcode.com/2022/day/18/input";
var testData = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let cubes = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(",")
				.map(y => +y));
		
		let blocked = cubes
			.reduce((acc, x) => {
				acc[x[0] + "," + x[1] + "," + x[2]] = true;
				return acc;
			}, {});
		
		let directions = [
			[ 1, 0, 0],
			[-1, 0, 0],
			[ 0, 1, 0],
			[ 0,-1, 0],
			[ 0, 0, 1],
			[ 0, 0,-1]
		];
		
		let min_i = cubes.map(x => x[0]).reduce((a, b) => a < b ? a : b) - 1;
		let min_j = cubes.map(x => x[1]).reduce((a, b) => a < b ? a : b) - 1;
		let min_k = cubes.map(x => x[2]).reduce((a, b) => a < b ? a : b) - 1;
		let max_i = cubes.map(x => x[0]).reduce((a, b) => a > b ? a : b) + 1;
		let max_j = cubes.map(x => x[1]).reduce((a, b) => a > b ? a : b) + 1;
		let max_k = cubes.map(x => x[2]).reduce((a, b) => a > b ? a : b) + 1;
		
		// find all external cubes
		let map = [];
		let stack = [];
		for (let i = min_i; i <= max_i; i++) {
			map[i] = [];
			for (let j = min_j; j <= max_j; j++) {
				map[i][j] = [];
				for (let k = min_k; k <= max_k; k++) {
					let atEdge = i === min_i || i === max_i || j === min_j || j === max_j || k === min_k || k === max_k;
					if (atEdge) {
						stack.push([i, j, k]);
					}
					map[i][j][k] = atEdge;
				}
			}
		}
		
		// iterate until stable
		while (stack.length > 0) {
			let curr = stack.pop();
			for (let d = 0; d < directions.length; d++) {
				let dir = directions[d];
				let i = curr[0] + dir[0],
					j = curr[1] + dir[1],
					k = curr[2] + dir[2];
				
				if (i > min_i && j > min_j && k > min_k && i < max_i && j < max_j && k < max_k) {
					if (!map[i][j][k] && !blocked[i + "," + j + "," + k]) {
						map[i][j][k] = true;
						stack.push([i, j, k]);
					}
				}
			}
		}
		
		return cubes
			.map(x => directions
				.map(y => [x[0] + y[0], x[1] + y[1], x[2] + y[2]])
				.filter(y => !blocked[y[0] + "," + y[1] + "," + y[2]])
				.filter(y => map[y[0]][y[1]][y[2]])
				.length)
			.reduce((a, b) => a + b);
	});