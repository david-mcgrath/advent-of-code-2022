var url = "https://adventofcode.com/2022/day/9/input";
var testData = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(true)
	.then(input => {
		let moves = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(" "))
			.map(x => {
				return {
					dir: x[0],
					n: +x[1]
				}
			});
		
		let head = [0,0];
		let tail = [0,0];
		
		let visited = {};
		
		visited[tail[0] + "," + tail[1]] = true;
		
		for (let i = 0; i < moves.length; i++) {
			let m = moves[i];
			
			for (let j = 0; j < m.n; j++) {
				let headPrev = head.map(x => x);
				
				switch (m.dir) {
					case "L":
						head[1] -= 1;
						break;
					case "R":
						head[1] += 1;
						break;
					case "U":
						head[0] -= 1;
						break;
					case "D":
						head[0] += 1;
						break;
				}
				
				if (Math.abs(head[0] - tail[0]) > 1 || Math.abs(head[1] - tail[1]) > 1) {
					// Move the tail
					tail = headPrev;
				}
				
				visited[tail[0] + "," + tail[1]] = true;
			}
		}
		
		return Object.keys(visited).length;
	});