var url = "https://adventofcode.com/2022/day/24/input";
var testData = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(""));
		
		let start = { x: 1, y: 0 },
			end = { x: input[input.length - 1].length - 2, y: input.length - 1 },
			blizzards = input
				.map((x, i) => x
					.map((y, j) => {
						let move = null;
						switch (y) {
							case ">":
								move = {
									dx: 1,
									dy: 0
								};
								break;
							case "<":
								move = {
									dx: -1,
									dy: 0
								};
								break;
							case "^":
								move = {
									dx: 0,
									dy: -1
								};
								break;
							case "v":
								move = {
									dx: 0,
									dy: 1
								};
								break;
						}
						
						return {
							x: j,
							y: i,
							move: move
						};
					}))
				.reduce((a, b) => a.concat(b))
				.filter(x => x.move),
			map = input
				.map(x => x
					.map(y => y === "#" ? "#" : "."));
					
		let minX = 1,
			minY = 1,
			maxX = input[0].length - 2,
			maxY = input.length - 2;
		
		let blizzardsByStep = [blizzards],
			blizzardMapByStep = [];
		
		let queue = [{
			pos: start,
			step: 0,
			finished: 0
		}];
		
		let seen = {};
		
		let options = [
			{ dx: 1, dy: 0 },
			{ dx: 0, dy: 1 },
			{ dx: -1, dy: 0 },
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: 0 }
		];
		
		while (queue.length > 0) {
			let curr = queue.pop();
			
			let step = curr.step + 1;
			
			if (!blizzardsByStep[step]) {
				let last = blizzardsByStep[step - 1];
				let next = last
					.map(x => {
						let tmp = {
							x: x.x + x.move.dx,
							y: x.y + x.move.dy
						};
						
						return  {
							x: tmp.x > maxX ? minX : tmp.x < minX ? maxX : tmp.x,
							y: tmp.y > maxY ? minY : tmp.y < minY ? maxY : tmp.y,
							move: x.move
						};
					});
				blizzardsByStep[step] = next;
				blizzardMapByStep[step] = next
					.reduce((acc, x) => {
						acc[x.x + "," + x.y] = true;
						return acc;
					}, {});
			}
			
			let currBlizzardMap = blizzardMapByStep[step];
			
			let currOptions = options
				.map(x => {
					return {
						x: curr.pos.x + x.dx,
						y: curr.pos.y + x.dy
					};
				})
				.filter(x => !currBlizzardMap[x.x + "," + x.y] && x.y >= 0 && x.y < map.length && map[x.y][x.x] === ".");
			
			for (let i = 0; i < currOptions.length; i++) {
				// check for the end
				let opt = currOptions[i];
				let currFinished = curr.finished;
				let currGoal = currFinished % 2 === 0 ? end : start;
				
				if (opt.x === currGoal.x && opt.y === currGoal.y) {
					currFinished += 1;
					
					if (currFinished === 3) {
						return step;
					}
				}
				
				let key = step + ":" + currFinished + ":" + opt.x + "," + opt.y;
				
				if (!seen[key]) {
					seen[key] = true;
					queue.unshift({
						pos: opt,
						step: step,
						finished: currFinished
					});
				}
			}
		}
		
		throw "Failed to find a path.";
	});