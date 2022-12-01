var url = "https://adventofcode.com/2022/day/1/input";
var testData = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let elves = input
			.split("\n\n")
            .map(x => x
                .split("\n")
                .filter(y => y)
                .map(y => +y))
			.filter(x => x.length > 0);
        return elves
            .map(x => x
                 .reduce((a, b) => a + b))
            .reduce((a, b) => a > b ? a : b);
	});