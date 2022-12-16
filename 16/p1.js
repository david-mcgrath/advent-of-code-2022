var url = "https://adventofcode.com/2022/day/16/input";
var testData = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let parsed = input
			.split("\n")
			.filter(x => x)
			.map(x => {
				let parts = x.split("; ");
				let valve = parts[0].split(" ")[1];
				let flowRate = +parts[0].split("=")[1];
				let to = parts[1].split(" valves ").length > 1
					? parts[1].split(" valves ")[1].split(", ")
					: parts[1].split(" valve ")[1].split(", ");
				
				return {
					valve: valve,
					flowRate: flowRate,
					to: to
				};
			});
		
		let start = "AA";
			
		// let valves = parsed
			// .filter(x => x.flowRate > 0 || x.valve === start)
			// .reduce((acc, x) => {
				// acc[x.valve] = x;
				// return acc;
			// }, {});
			
		let valves = parsed
			//.filter(x => x.flowRate > 0 || x.valve === start)
			.reduce((acc, x) => {
				acc[x.valve] = x;
				return acc;
			}, {});
		
		let distances = Object.keys(valves)
			.map(x => Object.keys(valves)
				.map(y => [x, y]))
			.reduce((a, b) => a.concat(b))
			.reduce((acc, x) => {
				if (!acc[x[0]]) acc[x[0]] = {};
				acc[x[0]][x[1]] = x[0] === x[1] ? 0 : Infinity;
				return acc;
			}, {});
		
		for (let i = 0; i < parsed.length; i++) {
			let valve_a = parsed[i];
			
			let dist = distances[valve_a.valve];
			
			let queue = valve_a.to.map(x => [x, 1]);
			
			while (queue.length > 0) {
				let curr = queue.pop();
				if (dist[curr[0]] > curr[1]) {
					dist[curr[0]] = curr[1];
					queue.unshift.apply(queue, valves[curr[0]].to.map(x => [x, curr[1] + 1]));
				}
			}
		}
		
		let nonZeroValves = parsed
			.filter(x => x.flowRate > 0)
			.map(x => x.valve);
			
		let stack = [{
			location: start,
			timeRemaining: 30,
			flowRate: 0,
			flow: 0,
			valvesRemaining: nonZeroValves.slice()
		}];
		
		let max = 0;
		
		while (stack.length > 0) {
			let curr = stack.pop();
			
			let options = curr.valvesRemaining
				.map(x => [x, distances[curr.location][x] + 1])
				.filter(x => curr.timeRemaining > x[1]);
			
			if (options.length > 0) {
				stack.push.apply(stack, options
					.map(x => {
						return {
							location: x[0],
							timeRemaining: curr.timeRemaining - x[1],
							flowRate: curr.flowRate + valves[x[0]].flowRate,
							flow: curr.flow + curr.flowRate * x[1],
							valvesRemaining: curr.valvesRemaining.filter(y => y !== x[0])
						};
					}));
			}
			else {
				let finalFlow = curr.flow + curr.flowRate * curr.timeRemaining;
				if (finalFlow > max) {
					max = finalFlow;
				}
			}
		}
		
		return max;
	});