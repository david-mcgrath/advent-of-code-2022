// I wasn't happy with my initial solution for day 6, so I threw together another one that feels a bit nicer

var url = "https://adventofcode.com/2022/day/6/input";
var testData = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		// Ensure there are no extra lines, then split the characters into an array
		let parsed = input
			.split("\n")
			.filter(x => x)[0]
			.split("");
		
		// The number of characters to check. Part 1 is 4, part 2 is 14
		let n = 14; // 4;
		
		// Maintain the last seen index of each character as they're encountered
		let lastSeen = {};
		let lastDuplicateIndex = -1;
		
		for (let i = 0; i < parsed.length; i++) {
			let c = parsed[i];
			let prevIndex = lastSeen[c];
			
			// If this is a duplicate within the substring length, update the lastDuplicateIndex
			// Only do this if it's greater than the current value
			if (typeof prevIndex !== "undefined" && prevIndex > lastDuplicateIndex) {
				lastDuplicateIndex = prevIndex;
			}
			
			// Store the current index as the last index the character was seen
			lastSeen[c] = i;
			
			// Check if there's been sufficient characters since the last duplicate
			if (i - lastDuplicateIndex >= n) {
				return i + 1;
			}
		}

		throw "No " + n + " character substrings without duplicates found";
	});