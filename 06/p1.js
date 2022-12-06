var url = "https://adventofcode.com/2022/day/6/input";
var testData = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let parsed = input
			.split("\n")
			.filter(x => x)[0]
			.split("");
		
		for (let i = 3; i < parsed.length; i++) {
			if (parsed[i] !== parsed[i - 1] && parsed[i] !== parsed[i - 2] && parsed[i] !== parsed[i - 3] &&
				parsed[i - 1] !== parsed[i - 2] && parsed[i - 1] !== parsed[i - 3] &&
				parsed[i - 2] !== parsed[i - 3]) {
				return i + 1;
			}
		}
		
		return null;
	});