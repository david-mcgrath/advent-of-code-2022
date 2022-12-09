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
		
		let knots = [];
		
		for (let i = 0; i < 10; i++) {
			knots[i] = [0,0];
		}
		
		let visited = {};
		
		visited[knots[knots.length - 1][0] + "," + knots[knots.length - 1][1]] = true;
		
		for (let i = 0; i < moves.length; i++) {
			let m = moves[i];
			
			for (let j = 0; j < m.n; j++) {
				let prev = knots.map(x => x.map(y => y));
				
				switch (m.dir) {
					case "L":
						knots[0][1] -= 1;
						break;
					case "R":
						knots[0][1] += 1;
						break;
					case "U":
						knots[0][0] -= 1;
						break;
					case "D":
						knots[0][0] += 1;
						break;
				}
				
				for (let k = 1; k < knots.length; k++) {
					if (Math.abs(knots[k][0] - knots[k - 1][0]) > 1 || Math.abs(knots[k][1] - knots[k - 1][1]) > 1) {
						// Non-adjacent, move to keep up (previously was last position of the knot, change to diagonal)
						knots[k][0] += Math.sign(knots[k - 1][0] - knots[k][0]);
						knots[k][1] += Math.sign(knots[k - 1][1] - knots[k][1]);
					}
				}
				
				visited[knots[knots.length - 1][0] + "," + knots[knots.length - 1][1]] = true;
			}
		}
		
		return Object.keys(visited).length;
	});