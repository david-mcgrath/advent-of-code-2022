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
const canSimplifyExpression = /\([^\(\)#]*\)/g;
function simplify(expression) {
	let stable = false;
	while (!stable) {
		stable = true;
		expression = expression.replaceAll(canSimplifyExpression, x => {
			stable = false;
			return eval(x);
		});
	}
	return expression;
}

// Janky and horribly, but it seems to work. It probably would have been easier to just redo the whole thing, I already basically had an expression tree...
function parseExpressionTree(exp) {
	let stack = [];
	let root = {
		lhs: null,
		op: null,
		rhs: null
	};
	let curr = root;
	let tmp = "";
	let isRhs = false;
	for (let i = 0; i < exp.length; i++) {
		let c = exp[i];
		switch (c) {
			case "(":
				tmp = "";
				stack.push(curr);
				curr = {
					lhs: null,
					op: null,
					rhs: null
				};
				if (isRhs) {
					stack[stack.length - 1].rhs = curr;
				}
				else {
					stack[stack.length - 1].lhs = curr;
				}
				isRhs = false;
				break;
			case ")":
				if (tmp.length > 0) {
					curr.rhs = tmp;
				}
				tmp = "";
				curr = stack.pop();
				break;
			case " ":
				break;
			case "#":
				tmp += c;
				break;
			default:
				if (isNaN(+c)) {
					if (tmp.length > 0) {
						curr.lhs = tmp;
					}
					curr.op = c;
					isRhs = true;
					tmp = "";
				}
				else {
					tmp += c;
				}
		}
	}
	if (tmp.length > 0) {
		curr.rhs = tmp;
	}
	
	return root;
}
function solve(a, b) {
	function r_solve(tree, num) {
		let lhsNumber = !isNaN(+tree.lhs);
		let rhsNumber = !isNaN(+tree.rhs);
		
		if (!lhsNumber && !rhsNumber) {
			throw "This should not occur, due to the specifics of the problem";
		}
		
		let subTree = lhsNumber ? tree.rhs : tree.lhs;
		let number = lhsNumber ? +tree.lhs : +tree.rhs;
		switch (tree.op) {
			case "+":
				num -= number;
				break;
			case "*":
				num /= number;
				break;
			case "-":
				if (lhsNumber) {
					num = number - num;
				}
				else {
					num += number;
				}
				break;
			case "/":
				if (lhsNumber) {
					num = number / num;
				}
				else {
					num *= number;
				}
				break;
			default:
				throw "Unsupported operator: " + tree.op;
		}
		
		return subTree === "#" ? num : r_solve(subTree, num);
	}
	// One side will just be a number, the other will be a bunch of parentheses that have been simplified. Only one instance of the variable exists.
	
	// Ensure b is the number
	if (isNaN(+b)) {
		let tmp = a;
		a = b;
		b = tmp;
	}
	
	// Strip the outermost parentheses
	let _a = a.substring(1, a.length - 1);
	
	// Get the expression tree
	let tree = parseExpressionTree(_a);
	
	return r_solve(tree, +b);
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
					operation: split[0] === "root" ? split[1] : "(" + split[1] + ")"
				};
			});
		
		let monkeysByName = monkeys
			.reduce((acc, x) => {
				acc[x.monkey] = x;
				return acc;
			}, {});
		
		// Replace the relevant expressions for p2, just use # to indicate the human input since it won't match the regex
		monkeysByName["humn"].operation = "#";
		
		let rootMonkey = monkeysByName["root"];
		rootMonkey.operation = rootMonkey.operation
			.split(" ")
			.map((x, i) => i === 1 ? "===" : x)
			.reduce((a, b) => a + " " + b);
			
		// Collapse the tree into just a single expression
		
		// Iterate through everything without the human input first, so that simplification works better
		let relevantMonkeys = monkeys.filter(x => x.monkey !== "humn");
		
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
			
			// Completed, so include humn
			if (relevantMonkeys.length === 0) {
				relevantMonkeys = monkeys;
			}
		}
		
		let finalExpression = rootMonkey.operation;
		
		// Simplify the expression
		finalExpression = finalExpression
			.split(" === ")
			.map(simplify)
			.reduce((a, b) => a + " === " + b);
		
		
		// // Just picking some numbers randomly for the limits for a brute force search
		// for (let i = 0; i < 10000000000; i++) {
			// let curr = finalExpression.replace("#", i);
			
			// if (eval(curr)) {
				// return i;
			// }
		// }
		
		// // If the search fails, output it... I'd rather not go any further, but it may be necessary.
		// console.log("Valid value not found within limits.");
		// console.log("Expression is:")
		// console.log(finalExpression.replace("#", "humn"));
		
		// // When simplified can increase the limits of the search. Or throw it at a solver.
		// // Or redo it in a better way, to actually give me an expression that evaluates to humn...
		
		// Brute forcing isn't going to work
		
		let sides = finalExpression.split(" === ");
		
		return solve(sides[0], sides[1]);
	});