var url = "https://adventofcode.com/2022/day/10/input";
var testData = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let state = input
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(" "))
			.map(x => x[0] === "addx" ? [0,+x[1]] : [0])
			.reduce((a, b) => a.concat(b));
		
		let curr = 1;
		for (let i = 0; i < state.length; i++) {
			curr += state[i];
			state[i] = curr;
		}
		
		let result = [];
		
		for (let i = 0; i < 240; i += 40) {
			let output = [];
			for (let j = 0; j < 40; j++) {
				let curr = state[Math.max(i + j - 1, 0)];
				output[j] = Math.abs(curr - j) <= 1 ? "#" : ".";
			}
			result.push(output.reduce((a, b) => a + b));
		}
		
		console.log(result.reduce((a, b) => a + "\n" + b));
	});