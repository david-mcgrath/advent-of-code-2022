var url = "https://adventofcode.com/2022/day/12/input";
var testData = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let start,
			end;
		
		let map = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(""))
			.map((x, i) => x
				.map((y, j) => {
					if (y === "S") {
						start = [i, j];
						y = "a";
					}
					else if (y === "E") {
						end = [i, j];
						y = "z";
					}
					
					return parseInt(y, 36);
				}));
				
		let distances = map
			.map(x => x
				.map(y => null));
		
		distances[start[0]][start[1]] = 0;
				
		let options = [[-1,0],[1,0],[0,-1],[0,1]];
		
		let explorePositions = [start];
		
		while (explorePositions.length > 0) {
			let pos = explorePositions.pop();
			let i = pos[0],
				j = pos[1];
			
			let curr = map[i][j];
			let nextDist = distances[i][j] + 1;
			
			let currOptions = options
				.map(x => [i + x[0], j + x[1]])
				.filter(x => x[0] >= 0 && x[0] < map.length && x[1] >= 0 && x[1] < map[0].length)
				.filter(x => map[x[0]][x[1]] - curr <= 1)
				.filter(x => distances[x[0]][x[1]] === null);
			
			for (let n = 0; n < currOptions.length; n++) {
				let opt = currOptions[n];
				distances[opt[0]][opt[1]] = nextDist;
				explorePositions.unshift(opt);
			}
			
			if (i === end[0] && j === end[1]) {
				break;
			}
		}
		
		
		return distances[end[0]][end[1]];
	});