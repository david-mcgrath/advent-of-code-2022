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

function dist(a, b) {
	return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let parsed = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(": ")
				.map(y => y
					.split(", ")
					.map(z => +z
						.split("=")[1])));
		
		
		let row = isTest ? 10 : 2000000;
		
		let sensors = parsed
			.map(x => {
				let distToClosest = dist(x[0], x[1]);
				let baseDistToRow = dist(x[0], [x[0][0], row]);
				
				let diff = distToClosest - baseDistToRow;
				
				let blockedRange = diff > 0 ? [x[0][0] - diff, x[0][0] + diff] : null;
				
				return {
					pos: x[0],
					distToClosest: distToClosest,
					blockedRange: blockedRange
				};
			});
		
		let beacons = parsed
			.map(x => x[1])
			.reduce((acc, x) => {
				acc[x[0] + "," + x[1]] = true;
				return acc;
			}, {});
		
		let blocked = Object.keys(
			sensors
				.map(x => x.blockedRange
					? new Array(x.blockedRange[1] - x.blockedRange[0] + 1)
						.fill(undefined)
						.map((_, i) => i + x.blockedRange[0])
					: [])
				.reduce((a, b) => a.concat(b))
				.reduce((acc, x) => {
					acc[x + "," + row] = true;
					return acc;
				}, {}));
				
		return blocked
			.filter(x => !beacons[x])
			.length;
	});