var url = "https://adventofcode.com/2022/day/5/input";
var testData = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n\n");
		
		let stacksInput = input[0]
			.split("\n");
		
		let stacksContent = stacksInput.slice(0, stacksInput.length - 1);
		let stacksDetails = stacksInput[stacksInput.length - 1]
			.split("")
			.map((x, i) => {
				return {
					n: +x > 0 ? +x : null,
					i: i
				};
			})
			.filter(x => x.n !== null);
		
		let moves = input[1]
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(" "))
			.map(x => {
				return {
					num: +x[1],
					from: +x[3],
					to: +x[5]
				};
			});
		
		let stacks = stacksDetails
			.reduce((acc, x) => {
				acc[x.n] = [];
				return acc;
			}, {});
		
		for (let i = 0; i < stacksDetails.length; i++) {
			let detail = stacksDetails[i];
			let stack = stacks[detail.n];
			
			for (let j = 0; j < stacksContent.length; j++) {
				let crate = stacksContent[j][detail.i];
				
				if (crate !== " ") {
					stack.unshift(crate);
				}
			}
		}
		
		for (let i = 0; i < moves.length; i++) {
			let move = moves[i];
			
			for (let j = 0; j < move.num; j++) {
				if (stacks[move.from].length > 0) {
					let crate = stacks[move.from].pop();
					stacks[move.to].push(crate);
				}
			}
		}
		
		return Object.values(stacks)
			.map(x => x[x.length - 1])
			.reduce((a, b) => a + b);
	});