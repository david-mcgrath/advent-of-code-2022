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
				x.split(""));
		
		let groups = [];
		for (let i = 0; i < rucksacks.length; i += 3) {
			groups.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]])
		}
		
		let badges = groups
			.map(x => x[0]
				.filter((y, i) => x[0].indexOf(y) === i)
				.filter(y => x[1].indexOf(y) > -1)
				.filter(y => x[2].indexOf(y) > -1));
		
		return badges
			.reduce((a, b) => a.concat(b))
			.map(x => parseInt(x, 36) - 9 + (x.toLowerCase() === x ? 0 : 26))
			.reduce((a, b) => a + b);
	});