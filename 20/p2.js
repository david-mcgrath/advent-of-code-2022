var url = "https://adventofcode.com/2022/day/20/input";
var testData = `1
2
-3
3
-2
0
4
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function testOutput(node) {
	let res = [node.Number];
	let curr = node;
	do {
		curr = curr.Next;
		res.push(curr.Number);
	} while (curr.Next !== node);
	
	console.log(res.reduce((a, b) => a + ", " + b));
}

function Node(number) {
	let self = this;
	
	this.Number = number;
	this.Next = this;
	this.Prev = this;
	
	this.Remove = function () {
		let prev = self.Prev;
		let next = self.Next;
		
		prev.Next = next;
		next.Prev = prev;
		
		self.Prev = self;
		self.Next = self;
		
		return prev;
	}
	this.Add = function (node) {
		let l = self;
		let r = self.Next;
		
		l.Next = node;
		r.Prev = node;
		node.Prev = l;
		node.Next = r;
		
		return node;
	}
	
	this.Move = function (n) {
		if (n > 0) {
			for (let i = 0; i < n; i++) {
				self.MoveForward();
			}
		}
		else if (n < 0) {
			for (let i = 0; i > n; i--) {
				self.MoveBackward();
			}
		}
	}
	
	this.MoveForward = function () {
		let l = self.Prev;
		let r = self.Next;
		let rr = self.Next.Next;
		
		l.Next = r;
		r.Prev = l;
		r.Next = self;
		self.Prev = r;
		self.Next = rr;
		rr.Prev = self;
	}
	this.MoveBackward = function () {
		let ll = self.Prev.Prev;
		let l = self.Prev;
		let r = self.Next;
		
		ll.Next = self;
		self.Prev = ll;
		self.Next = l;
		l.Prev = self;
		l.Next = r;
		r.Prev = l;
	}
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let decryptionKey = 811589153;
		let iterations = 10;
		
		let numbers = input
			.split("\n")
			.filter(x => x)
			.map(x => +x * decryptionKey);
			
		let cycle = numbers.length - 1;
		
		// Create the doubly linked list
		let node = new Node(numbers[0]);
		let toProcess = [node];
		for (let i = 1; i < numbers.length; i++) {
			node = node.Add(new Node(numbers[i]));
			toProcess.push(node);
		}
		
		// Store the zero node, used later and I'm using it to keep the test output consistent
		let zeroNode = node;
		while (zeroNode.Number !== 0) {
			zeroNode = zeroNode.Next;
		}
		
		if (isTest) {
			testOutput(node.Next);
		}
		
		// Process all numbers in their initial order
		for (let i = 0; i < iterations; i++) {			
			for (let j = 0; j < toProcess.length; j++) {
				let curr = toProcess[j];
				let num = curr.Number % cycle;
				curr.Move(num);
			}
			
			if (isTest) {
				testOutput(zeroNode);
			}
		}
		
		// Get result
		let result = 0;
		node = zeroNode;
		
		// Sum 1000th, 2000th, 3000th
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 1000; j++) {
				node = node.Next;
			}
			result += node.Number;
		}
		
		return result;
	});