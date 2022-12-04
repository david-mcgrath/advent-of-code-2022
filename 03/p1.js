var url = "https://adventofcode.com/2022/day/3/input";
var testData = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let rucksacks = input
			.split("\n")
			.filter(x => x)
			.map(x =>
				x.split(""))
			.map(x => [x.slice(0, x.length >> 1), x.slice(x.length >> 1, x.length)]);
		
		let duplicates = rucksacks
			.map(x => x[0]
				.filter((y, i) => x[0].indexOf(y) === i)
				.filter(y => x[1].indexOf(y) > -1));
		
		return duplicates
			.reduce((a, b) => a.concat(b))
			.map(x => parseInt(x, 36) - 9 + (x.toLowerCase() === x ? 0 : 26))
			.reduce((a, b) => a + b);
	});