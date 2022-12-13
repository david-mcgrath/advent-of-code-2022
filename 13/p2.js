var url = "https://adventofcode.com/2022/day/13/input";
var testData = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

function compare(a, b) {
	if (!Array.isArray(a)) {
		a = [a];
	}
	if (!Array.isArray(b)) {
		b = [b];
	}
	
	for (let i = 0; i < a.length && i < b.length; i++) {
		let _a = a[i],
			_b = b[i];
		
		if (Array.isArray(_a) || Array.isArray(_b)) {
			let comp = compare(_a, _b);
			
			if (comp !== 0) {
				return comp;
			}
		}
		else {
			if (_a !== _b) {
				return _a - _b;
			}
		}
	}
	
	return a.length - b.length;
}

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(true)
	.then(input => {
		let packets = input
			.split("\n\n")
			.map(x => x
				.split("\n")
				.filter(x => x)
				.map(x => eval(x)));
		
		// Add divider packets
		packets.push([[[2]],[[6]]]);
		
		// Collapse the packets
		packets = packets.reduce((a, b) => a.concat(b));
		
		packets.sort(compare);
		
		let mult = 1;
		for (let i = 0; i < packets.length; i++) {
			if (packets[i].length === 1 && packets[i][0].length === 1 && (packets[i][0][0] === 2 || packets[i][0][0] === 6)) {
				mult *= i + 1;
			}
		}
		
		return mult;
	});