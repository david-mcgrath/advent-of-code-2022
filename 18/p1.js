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
		
		return cubes
			.map(x => directions
				.filter(y => !blocked[(x[0] + y[0]) + "," + (x[1] + y[1]) + "," + (x[2] + y[2])])
				.length)
			.reduce((a, b) => a + b);
	});