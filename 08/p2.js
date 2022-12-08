var url = "https://adventofcode.com/2022/day/8/input";
var testData = `30373
25512
65332
33549
35390
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let trees = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(""));
		
		let score = [];
		
		for (let i = 0; i < trees.length; i++) {
			score[i] = [];
			
			for (let j = 0; j < trees[i].length; j++) {
				let height = trees[i][j];
				let subscores = [];
				let subscore = 0;
				
				subscore = 0;
				for (let _i = i - 1; _i >= 0; _i--) {
					subscore++;
					if (trees[_i][j] >= height) {
						break;
					}
				}
				subscores.push(subscore);
				
				subscore = 0;
				for (let _i = i + 1; _i < trees.length; _i++) {
					subscore++;
					if (trees[_i][j] >= height) {
						break;
					}
				}
				subscores.push(subscore);
				
				subscore = 0;
				for (let _j = j - 1; _j >= 0; _j--) {
					subscore++;
					if (trees[i][_j] >= height) {
						break;
					}
				}
				subscores.push(subscore);
				
				subscore = 0;
				for (let _j = j + 1; _j < trees[i].length; _j++) {
					subscore++;
					if (trees[i][_j] >= height) {
						break;
					}
				}
				subscores.push(subscore);
				
				score[i][j] = subscores.reduce((a, b) => a * b);
			}
		}
		
		return score
			.reduce((a, b) => a.concat(b))
			.reduce((a, b) => a > b ? a : b);
	});