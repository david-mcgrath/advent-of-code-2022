var url = "https://adventofcode.com/2022/day/15/input";
var testData = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function toIJ(pt) {
	return [pt[0] + pt[1], pt[0] - pt[1]];
}
function toXY(pt) {
	return [(pt[0] + pt[1]) / 2, (pt[0] - pt[1]) / 2];
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		// In a rotated space, the area of influence is just a square
		// Call the axes i and j:
			// i = 0.5,0.5
			// j = 0.5,-0.5
		
		// x = (i + j) / 2
		// y = (i - j) / 2
		// therefore
		// i = x + y
		// j = x - y
		
		let extremes = isTest ? 20 : 4000000;
		
		let parsed = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(": ")
				.map(y => y
					.split(", ")
					.map(z => +z
						.split("=")[1])));
		
		// First: calculate the distance, convert to i,j space, and use that to find the limits of the influence
		let invalidRanges = parsed
			.map(x => {
				let dist = Math.abs(x[0][0] - x[1][0]) + Math.abs(x[0][1] - x[1][1]);
				let posIJ = toIJ(x[0]);
				
				return {
					i1: posIJ[0] - dist,
					i2: posIJ[0] + dist,
					j1: posIJ[1] - dist,
					j2: posIJ[1] + dist
				};
			});

		let valid = [];
			
		let minI = toIJ([0, 0])[0],
			maxI = toIJ([extremes, extremes])[0];
		
		for (let i = minI; i <= maxI; i++) {
			// Get all possible ranges that could affect this row
			let currRanges = invalidRanges
				.filter(x => i >= x.i1 && i <= x.i2);
			
			// Get the min & max possible j values for this row
				// (i + j) / 2 >= 0, (i + j) / 2 <= 4000000, (i - j) / 2 >= 0, (i - j) / 2 <= 4000000
				// i between 0 and 8000000
				// so:
					// minJ = -i from i=0...4000000
					// minJ = -8000000+i from i=4000000...8000000
					// maxJ = -minJ
			let minJ = i < extremes ? -i : i-2*extremes,
				maxJ = -minJ;
			
			for (let j = minJ; j <= maxJ; j++) {
				let failed = false;
				for (let n = 0; n < currRanges.length; n++) {
					let range = currRanges[n];
					
					// if it's within the range, skip to the end and then break.
					if (j >= range.j1 && j <= range.j2) {
						j = range.j2;
						failed = true;
						break;
					}
				}
				if (!failed) {
					valid.push([i, j]);
				}
			}
		}
		
		// Convert back to XY space, ensure those coordinates are valid, and then return the result
		return valid
			.map(toXY)
			.filter(x => Math.floor(x[0]) === x[0] && Math.floor(x[1]) === x[1])
			.map(x => x[0] * 4000000 + x[1])[0];
	});