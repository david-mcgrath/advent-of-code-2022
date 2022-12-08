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
		
		let visibleTrees = [];
		
		for (let i = 0; i < trees.length; i++) {
			for (let j = 0; j < trees[i].length; j++) {
				let visible = false;
				let height = trees[i][j];
				
				// Check from top
				visible = true;
				for (let _i = 0; _i < i; _i++) {
					if (trees[_i][j] >= height) {
						visible = false;
					}
				}
				
				if (visible) {
					visibleTrees.push([i,j]);
					continue;
				}
				
				
				// Check from bottom
				visible = true;
				for (let _i = trees.length - 1; _i > i; _i--) {
					if (trees[_i][j] >= height) {
						visible = false;
					}
				}
				
				if (visible) {
					visibleTrees.push([i,j]);
					continue;
				}
				
				// Check from left
				visible = true;
				for (let _j = 0; _j < j; _j++) {
					if (trees[i][_j] >= height) {
						visible = false;
					}
				}
				
				if (visible) {
					visibleTrees.push([i,j]);
					continue;
				}
				
				// Check from right
				visible = true;
				for (let _j = trees[i].length - 1; _j > j; _j--) {
					if (trees[i][_j] >= height) {
						visible = false;
					}
				}
				
				if (visible) {
					visibleTrees.push([i,j]);
					continue;
				}
			}
		}
		
		debugger;
		
		return visibleTrees.length;
	});