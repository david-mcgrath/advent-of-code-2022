var url = "https://adventofcode.com/2022/day/2/input";
var testData = `A Y
B X
C Z`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let outcome = {
			"X": {
				"A": 0 + 3,
				"B": 0 + 1,
				"C": 0 + 2
			},
			"Y": {
				"A": 3 + 1,
				"B": 3 + 2,
				"C": 3 + 3
			},
			"Z": {
				"A": 6 + 2,
				"B": 6 + 3,
				"C": 6 + 1
			}
		}
		
		return input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(" "))
			.map(x => outcome[x[1]][x[0]])
			.reduce((a, b) => a + b);
	});