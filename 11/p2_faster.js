var url = "https://adventofcode.com/2022/day/11/input";
var testData = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		// We only care about divisibility, so operating with ring arithmetic will keep the numbers sane
		// Just multiply the divisors of each of the monkeys together to get the ring it'll be in. Ring of integers mod <product of monkey divisible checks>
		let ring = 1;
		
		let monkeys = input
			.split("\n\n")
			.map(x => x
				.split("\n")
				.filter(x => x)
				.map(y => y
					.split(":")
					.map(z => z
						.trim())))
			.map(x => {
				let opStr = x[2][1].split(" = ")[1];
				
				let testDiv = +x[3][1].split("divisible by ")[1];
				let trueThrow = +x[4][1].split("throw to monkey ")[1];
				let falseThrow = +x[5][1].split("throw to monkey ")[1];
				
				// Side effect to the map, this maintains a ring to keep the numbers at a manageable level
				// Maybe this could be lower, but it should be fine
				ring *= testDiv;
				
				return {
					id: +(x[0][0].split(" ")[1]),
					items: x[1][1].split(", ").map(y => +y),
					multi: opStr === "old * old" || opStr.indexOf(" + ") !== -1 ? 1 : +opStr.split(" * ")[1],
					square: opStr === "old * old",
					add: opStr.indexOf(" + ") !== -1 ? +opStr.split(" + ")[1] : 0,
					test: testDiv,
					trueThrow: trueThrow,
					falseThrow: falseThrow,
					business: 0
				};
				
				return {
					id: +(x[0][0].split(" ")[1]),
					items: x[1][1].split(", ").map(y => +y),
					op: (old) => eval(opStr),
					test: (value) => (value % testDiv) === 0,
					trueThrow: trueThrow,
					falseThrow: falseThrow,
					business: 0
				};
			})
			.reduce((acc, x) => {
				acc[x.id] = x;
				return acc;
			}, {});
		
		let nRounds = 10000;
		let nMonkeys = Object.keys(monkeys)
			.map(x => monkeys[x].id)
			.reduce((a, b) => a > b ? a : b);
		for (let round = 0; round < nRounds; round++) {
			for (let id = 0; id <= nMonkeys; id++) {
				let monkey = monkeys[id];
				if (monkey) {
					while (monkey.items.length > 0) {
						let item = monkey.items.shift();
						item = monkey.square ? item * item : monkey.add ? item + monkey.add : item * monkey.multi;
						
						// Get the number that the result is congruent with
						item = item % ring;
						
						let throwMonkey = (item % monkey.test) === 0 ? monkey.trueThrow : monkey.falseThrow;
						
						monkeys[throwMonkey].items.push(item);
						
						monkey.business++;
					}
				}
			}
			
			//console.log("Monkey " + round + ":\n" + Object.keys(monkeys).map(x => monkeys[x]).map(x => "Monkey " + x.id + ": " + x.items.join(", ")).join("\n"));
		}
		
		let monkeyBusiness = Object.keys(monkeys).map(x => monkeys[x].business).sort((a, b) => b - a);
		
		return monkeyBusiness[0] * monkeyBusiness[1];
	});