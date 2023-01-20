var url = "https://adventofcode.com/2022/day/23/input";
var testData = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`;

// testData = `.....
// ..##.
// ..#..
// .....
// ..##.
// .....`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function render(elves) {
	let minX = null,
		maxX = null,
		minY = null,
		maxY = null,
		curr = elves
			.reduce((acc, elf) => {
				acc[elf.x + "," + elf.y] = true;
				return acc;
			}, {});
	
	elves
		.forEach(elf => {
			if (minX === null || elf.x < minX) minX = elf.x;
			if (maxX === null || elf.x > maxX) maxX = elf.x;
			if (minY === null || elf.y < minY) minY = elf.y;
			if (maxY === null || elf.y > maxY) maxY = elf.y;
		});
	
	let output = "";
	for (let i = minY; i <= maxY; i++) {
		for (let j = minX; j <= maxX; j++) {
			output += curr[j + "," + i] ? "#" : ".";
		}
		output += "\n";
	}
	
	console.log(output);
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let elves = input
			.split("\n")
			.filter(x => x)
			.map((x, i) => x
				.split("")
				.map((y, j) => [y, i, j]))
			.reduce((a, b) => a.concat(b))
			.filter(x => x[0] === "#")
			.map(x => {
				return {
					x: x[2],
					y: x[1]
				};
			});
		
		let allCheck = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, 1],
			[1, 1],
			[1, 0],
			[1, -1],
			[0, -1]
		];
		let directions = [
			{
				dir: [0, -1],
				check: [[-1, -1], [0, -1], [1, -1]]
			},
			{
				dir: [0, 1],
				check: [[-1, 1], [0, 1], [1, 1]]
			},
			{
				dir: [-1, 0],
				check: [[-1, -1], [-1, 0], [-1, 1]]
			},
			{
				dir: [1, 0],
				check: [[1, -1], [1, 0], [1, 1]]
			}
		];
		
		// render(elves);
		
		let n = 0;
		while (true) {
			n++;
			
			let curr = elves.reduce((acc, elf) => {
				acc[elf.x + "," + elf.y] = elf;
				return acc;
			}, {});
			
			let toCheck = elves
				.filter(elf => allCheck
					.map(dir => (elf.x + dir[0]) + "," + (elf.y + dir[1]))
					.filter(k => curr[k])
					.length > 0);
					
			if (toCheck.length === 0) {
				break;
			}
			
			let proposed = {};
			
			for (let i = 0; i < toCheck.length; i++) {
				let elf = toCheck[i];
				for (let j = 0; j < directions.length; j++) {
					let direction = directions[j];
					
					let free = true;
					for (let k = 0; k < direction.check.length; k++) {
						let check = direction.check[k];
						
						if (curr[(elf.x + check[0]) + "," + (elf.y + check[1])]) {
							free = false;
							break;
						}
					}
					
					if (free) {
						let key = (elf.x + direction.dir[0]) + "," + (elf.y + direction.dir[1]);
						proposed[key] = proposed[key] ? proposed[key].concat(elf) : [elf];
						break;
					}
				}
			}
			
			Object.keys(proposed)
				.filter(k => proposed[k].length === 1)
				.forEach(k => {
					let elf = proposed[k][0],
						coord = k
							.split(",")
							.map(x => +x);
					
					elf.x = coord[0];
					elf.y = coord[1];
				});
			
			directions.push(directions.shift());
			
			// render(elves);
		}
		
		return n;
	});