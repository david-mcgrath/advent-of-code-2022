var data = `Sensor at x=545406, y=2945484: closest beacon is at x=772918, y=2626448
Sensor at x=80179, y=3385522: closest beacon is at x=772918, y=2626448
Sensor at x=2381966, y=3154542: closest beacon is at x=2475123, y=3089709
Sensor at x=2607868, y=1728571: closest beacon is at x=2715626, y=2000000
Sensor at x=746476, y=2796469: closest beacon is at x=772918, y=2626448
Sensor at x=911114, y=2487289: closest beacon is at x=772918, y=2626448
Sensor at x=2806673, y=3051666: closest beacon is at x=2475123, y=3089709
Sensor at x=1335361, y=3887240: closest beacon is at x=2505629, y=4282497
Sensor at x=2432913, y=3069935: closest beacon is at x=2475123, y=3089709
Sensor at x=1333433, y=35725: closest beacon is at x=1929144, y=529341
Sensor at x=2289207, y=1556729: closest beacon is at x=2715626, y=2000000
Sensor at x=2455525, y=3113066: closest beacon is at x=2475123, y=3089709
Sensor at x=3546858, y=3085529: closest beacon is at x=3629407, y=2984857
Sensor at x=3542939, y=2742086: closest beacon is at x=3629407, y=2984857
Sensor at x=2010918, y=2389107: closest beacon is at x=2715626, y=2000000
Sensor at x=3734968, y=3024964: closest beacon is at x=3629407, y=2984857
Sensor at x=2219206, y=337159: closest beacon is at x=1929144, y=529341
Sensor at x=1969253, y=890542: closest beacon is at x=1929144, y=529341
Sensor at x=3522991, y=3257032: closest beacon is at x=3629407, y=2984857
Sensor at x=2303155, y=3239124: closest beacon is at x=2475123, y=3089709
Sensor at x=2574308, y=111701: closest beacon is at x=1929144, y=529341
Sensor at x=14826, y=2490395: closest beacon is at x=772918, y=2626448
Sensor at x=3050752, y=2366125: closest beacon is at x=2715626, y=2000000
Sensor at x=3171811, y=2935106: closest beacon is at x=3629407, y=2984857
Sensor at x=3909938, y=1033557: closest beacon is at x=3493189, y=-546524
Sensor at x=1955751, y=452168: closest beacon is at x=1929144, y=529341
Sensor at x=2159272, y=614653: closest beacon is at x=1929144, y=529341
Sensor at x=3700981, y=2930103: closest beacon is at x=3629407, y=2984857
Sensor at x=3236266, y=3676457: closest beacon is at x=3373823, y=4223689
Sensor at x=3980003, y=3819278: closest beacon is at x=3373823, y=4223689
Sensor at x=1914391, y=723058: closest beacon is at x=1929144, y=529341
Sensor at x=474503, y=1200604: closest beacon is at x=-802154, y=776650
Sensor at x=2650714, y=3674470: closest beacon is at x=2505629, y=4282497
Sensor at x=1696740, y=586715: closest beacon is at x=1929144, y=529341
Sensor at x=3818789, y=2961752: closest beacon is at x=3629407, y=2984857`;

function getInput() {
	return new Promise((resolve, reject) => resolve(data));
}

function toIJ(pt) {
	return [pt[0] + pt[1], pt[0] - pt[1]];
}
function toXY(pt) {
	return [(pt[0] + pt[1]) / 2, (pt[0] - pt[1]) / 2];
}

let t1 = performance.now();

let res1 = await getInput()
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
		
		let extremes = 4000000;
		
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
					
					// if it's within the i range, skip to the end in j and then break.
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

let t2 = performance.now();

let res2 = await getInput()
	.then(input => {
		// This is the test without rotating the search space
		let extremes = 4000000;
		
		let parsed = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(": ")
				.map(y => y
					.split(", ")
					.map(z => +z
						.split("=")[1])));
		
		// Just get position and distance
		let sensors = parsed
			.map(x => {
				let dist = Math.abs(x[0][0] - x[1][0]) + Math.abs(x[0][1] - x[1][1]);
				
				return {
					pos: x[0],
					dist: dist
				};
			});

		let valid = [];
		
		for (let x = 0; x <= 4000000; x++) {
			// Get all possible ranges that could affect this row
			let currRanges = sensors
				.map(s => [s.pos[1], s.dist - Math.abs(s.pos[0] - x)])
				.filter(s => s[1] >= 0)
				.map(s => [s[0] - s[1], s[0] + s[1]]);
			
			for (let y = 0; y <= 4000000; y++) {
				let failed = false;
				for (let n = 0; n < currRanges.length; n++) {
					let range = currRanges[n];
					
					// if it's within the i range, skip to the end in j and then break.
					if (y >= range[0] && y <= range[1]) {
						y = range[1];
						failed = true;
						break;
					}
				}
				if (!failed) {
					valid.push([x, y]);
				}
			}
		}
		
		// Convert back to XY space, ensure those coordinates are valid, and then return the result
		return valid
			.map(x => x[0] * 4000000 + x[1])[0];
	});

let t3 = performance.now();

let output = [
	"Transformed space result: " + res1,
	"Transformed space time: " + (t2 - t1) + "ms",
	"",
	"Normal space result: " + res2,
	"Normal space time: " + (t3 - t2) + "ms",
	"",
	res1 === res2 ? "Results are equal" : "Results are different (something went wrong)",
	"",
	(t3 - t2) !== (t2 - t1) ? ((t3 - t2) < (t2 - t1) ? "Normal space" : "Transformed space") + " is faster" : "Both took equal time (highly unlikely)",
	(Math.round(((t3 - t2) < (t2 - t1) ? (t2 - t1) / (t3 - t2) : (t3 - t2) / (t2 - t1)) * 100) / 100) + " times faster"
];

console.log(output.reduce((a, b) => a + "\n" + b));