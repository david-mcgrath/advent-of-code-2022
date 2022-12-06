var url = "https://adventofcode.com/2022/day/6/input";
var testData = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		function check(parsed, curr, n) {
			if (curr < n)
				return false;
			
			for (let i = curr - n + 1; i < curr; i++) {
				for (let j = curr - n; j < i; j++) {
					if (parsed[i] === parsed[j]) {
						return false;
					}
				}
			}
			
			return true;
		}
		
		let parsed = input
			.split("\n")
			.filter(x => x)[0]
			.split("");
			
		let n = 14;
		
		for (let i = 1; i <= parsed.length; i++) {
			// Turns out, this is just... fast enough. That's a bit disappointing.
			if (check(parsed, i, n)) {
				return i;
			}
		}
		
		return null;
	});