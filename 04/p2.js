var url = "https://adventofcode.com/2022/day/4/input";
var testData = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let assignments = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(",")
				.map(y => y
					.split("-")
					.map(z => +z)));
		
		return assignments
			.filter(x => (x[0][0] <= x[1][1] && x[0][1] >= x[1][0]))
			.length;
	});