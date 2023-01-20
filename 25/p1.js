var url = "https://adventofcode.com/2022/day/25/input";
var testData = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function snafuToDecimal(snafu) {
	let curr = 1;
	let total = 0;
	
	for (let i = snafu.length - 1; i >= 0; i--) {
		let c = snafu[i];
		
		switch (c) {
			case "=":
				total -= curr * 2;
				break;
			case "-":
				total -= curr;
				break;
			case "0":
				break;
			case "1":
				total += curr;
				break;
			case "2":
				total += curr * 2;
				break;
		}
		
		curr *= 5;
	}
	
	return total;
}
function decimalToSnafu(decimal) {
	// Get the highest possible digit
	let curr = 1,
		currMax = 0,
		maxDigit = 0;
	while (currMax < decimal) {
		currMax += curr * 2;
		
		curr *= 5;
		maxDigit++;
	}
	
	let result = "";
	
	for (let i = maxDigit; i >= 1; i--) {
		curr /= 5;
		
		let bestOption = "2",
			bestDecimal = decimal - curr * 2,
			bestDistance = Math.abs(decimal - curr * 2);
		
		if (Math.abs(decimal - curr) < bestDistance) {
			bestOption = "1";
			bestDecimal = decimal - curr;
			bestDistance = Math.abs(bestDecimal);
		}
		
		if (Math.abs(decimal) < bestDistance) {
			bestOption = "0";
			bestDecimal = decimal;
			bestDistance = Math.abs(bestDecimal);
		}
		
		if (Math.abs(decimal + curr) < bestDistance) {
			bestOption = "-";
			bestDecimal = decimal + curr;
			bestDistance = Math.abs(bestDecimal);
		}
		
		if (Math.abs(decimal + curr * 2) < bestDistance) {
			bestOption = "=";
			bestDecimal = decimal + curr * 2;
			bestDistance = Math.abs(bestDecimal);
		}
		
		result += bestOption;
		decimal = bestDecimal;
	}
	
	return result;
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x);
		
		// Check for errors in the snafuToDecimal and decimalToSnafu functions
		let errors = input
			.map(x => [x, snafuToDecimal(x), decimalToSnafu(snafuToDecimal(x))])
			.filter(x => x[0] !== x[2]);
		
		if (errors.length > 0) {
			// debugger;
			// decimalToSnafu(errors[0][1]);
			throw "Something's wrong in the conversion functions, check...";
		}
		
		return decimalToSnafu(
			input
				.map(snafuToDecimal)
				.reduce((a, b) => a + b));
	});