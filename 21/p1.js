var url = "https://adventofcode.com/2022/day/21/input";
var testData = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

const unstableMonkeyRegex = /[a-zA-Z]/;
function getUnstableMonkeys(monkeys) {
	return monkeys
		.filter(x => unstableMonkeyRegex.test(x.operation));
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let monkeys = input
			.split("\n")
			.filter(x => x)
			.map(x => {
				let split = x.split(": ");
				
				return {
					monkey: split[0],
					operation: "(" + split[1] + ")"
				};
			});
		
		let monkeysByName = monkeys
			.reduce((acc, x) => {
				acc[x.monkey] = x;
				return acc;
			}, {});
			
		// Collapse the tree into just a single expression
		
		let relevantMonkeys = monkeys;
		
		// Iterate through until stable
		for (let unstableMonkeys = getUnstableMonkeys(monkeys); unstableMonkeys.length > 0; unstableMonkeys = getUnstableMonkeys(unstableMonkeys)) {
			let newRelevantMonkeys = [];
			for (let i = 0; i < relevantMonkeys.length; i++) {
				let currMonkey = relevantMonkeys[i];
				let isRelevant = false;
				
				for (let j = 0; j < unstableMonkeys.length; j++) {
					let unstable = unstableMonkeys[j];
					
					// Check if the currMonkey's name is in the unstable monkey's operation, replace if it is
					if (unstable.operation.indexOf(currMonkey.monkey) > -1) {
						unstable.operation = unstable.operation.replace(currMonkey.monkey, currMonkey.operation);
						isRelevant = true;
					}
				}
				
				if (isRelevant) {
					newRelevantMonkeys.push(currMonkey);
				}
			}
			
			// Trim irrelevant monkeys each iteration
			relevantMonkeys = newRelevantMonkeys;
		}
		
		// eval is a bit nasty...
		return eval(monkeysByName["root"].operation);
	});