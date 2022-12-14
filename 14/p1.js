var url = "https://adventofcode.com/2022/day/14/input";
var testData = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let lines = input
			.split("\n")
			.map(x => x
				.split(" -> ")
				.map(y => y
					.split(",")
					.map(z => +z)))
			.map(x => {
				let res = [];
				for (let i = 0; i < x.length - 1; i++) {
					res.push([x[i], x[i + 1]]);
				}
				return res;
			})
			.reduce((a, b) => a.concat(b));
		
		let min_i = 9999,
			max_i = -9999,
			min_j = 0, // Don't go above 0, just for sand simplicity...
			max_j = -9999,
			sand_i = 500,
			sand_j = 0;
		
		for (let i = 0; i < lines.length; i++) {
			let i1 = lines[i][0][0],
				i2 = lines[i][1][0],
				j1 = lines[i][0][1],
				j2 = lines[i][1][1];
			
			if (i1 < min_i) min_i = i1;
			if (i2 < min_i) min_i = i2;
			if (j1 < min_j) min_j = j1;
			if (j2 < min_j) min_j = j2;
			
			if (i1 > max_i) max_i = i1;
			if (i2 > max_i) max_i = i2;
			if (j1 > max_j) max_j = j1;
			if (j2 > max_j) max_j = j2;
		}
		
		lines = lines
			.map(x => x
				.map(y => [y[0] - min_i, y[1] - min_j]));
		
		max_i -= min_i;
		max_j -= min_j;
		sand_i -= min_i;
		sand_j -= min_j;
		min_i = 0;
		min_j = 0;
		
		let map = [];
		for (let i = min_i; i <= max_i; i++) {
			map[i] = [];
			for (let j = min_j; j <= max_j; j++) {
				map[i][j] = ".";
			}
		}
		
		for (let n = 0; n < lines.length; n++) {
			let line = lines[n];
			let i1 = line[0][0],
				i2 = line[1][0],
				j1 = line[0][1],
				j2 = line[1][1];
			
			let di = Math.sign(i2 - i1);
			let dj = Math.sign(j2 - j1);
			
			for (let i = i1, j = j1; i !== i2 || j !== j2; i += di, j += dj) {
				map[i][j] = "#";
			}
			map[i2][j2] = "#";
		}
		
		let sand = null;
		while (true) {
			// If sand is null, generate one
			if (sand === null) {
				sand = [sand_i, sand_j];
			}
			else {
				// Check directions
				let d  = sand[1] + 1 < map[sand[0]].length ? map[sand[0]][sand[1] + 1] : null,
					dl = sand[0] > 0 && sand[1] + 1 < map[sand[0] - 1].length ? map[sand[0] - 1][sand[1] + 1] : null,
					dr = sand[0] + 1 < map.length && sand[1] + 1 < map[sand[0] + 1].length ? map[sand[0] + 1][sand[1] + 1] : null;

				if (d === ".") {
					sand[1] += 1;
				}
				else if (dl === ".") {
					sand[0] -= 1;
					sand[1] += 1;
				}
				else if (dr === ".") {
					sand[0] += 1;
					sand[1] += 1;
				}
				else if (d === null || dl === null || dr === null) {
					// Left the screen, so it's done.
					break;
				}
				else {
					// At rest
					map[sand[0]][sand[1]] = "o";
					sand = null;
				}
			}
			
			//console.log(map.map((x, i) => x.map((y, j) => sand && i === sand[0] && j === sand[1] ? "+" : y).reduce((a, b) => a + b)).reduce((a, b) => a + "\n" + b));
		}
		
		return map
			.reduce((a, b) => a.concat(b))
			.filter(x => x === "o")
			.length;
	});