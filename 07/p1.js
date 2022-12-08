var url = "https://adventofcode.com/2022/day/7/input";
var testData = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

function Folder(name, parent) {
	let self = this;
	
	this.Name = name;
	this.Files = [];
	this.Folders = [];
	
	this.Parent = parent;
	
	let _size = null;
	this.Size = function () {
		if (_size === null) {
			_size = self.Files
				.map(x => x.Size)
				.concat(self.Folders
					.map(x => x.Size()))
				.reduce((a, b) => a + b, 0);
		}
		return _size;
	}
	this.AddFolder = function (name) {
		self.Folders.push(new Folder(name, self));
	}
	this.AddFile = function (name, size) {
		self.Files.push(new File(name, size));
	}
	
	this.GetAllSizes = function () {
		return [self.Size()]
			.concat(self.Folders
				.map(x => x.GetAllSizes())
				.reduce((a, b) => a.concat(b), []));
	}
	
	// Change directory
	this.cd = function (path) {
		if (path.indexOf("/") > -1) {
			let curr = self;
			let pathComponents = path
				.split("/")
				.map(x => x.trim())
				.filter(x => x);
			
			for (let i = 0; i < pathComponents.length; i++) {
				curr = curr.cd(pathComponents[i]);
			}
			
			return curr;
		}
		
		switch (path) {
			case ".":
				return self;
			case "..":
				return self.Parent;
			default:
				return self.Folders
					.filter(x => x.Name === path)[0] || self;
		}
	}
	
	// Populates files and subfolders from the results of the list command
	this.ls = function (output) {
		self.Files = [];
		self.Folders = [];
		_size = null;
		for (let i = 0; i < output.length; i++) {
			let curr = output[i];
			
			if (curr[0] === "dir") {
				self.AddFolder(curr[1]);
			}
			else {
				self.AddFile(curr[1], +curr[0]);
			}
		}
	}
}
function File(name, size) {
	this.Name = name;
	this.Size = size;
}

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let parsed = input
			.split("$ ")
			.map(x => x.trim())
			.filter(x => x)
			.map(x => x
				.split("\n")
				.map(y => y
					.split(" ")))
			.map(x => {
				return {
					cmd: x[0][0],
					arg: x[0][1] || null,
					out: x.slice(1)
				};
			});
		
		let root = new Folder("/");
		let curr = root;
		
		for (let i = 0; i < parsed.length; i++) {
			let command = parsed[i];
			switch (command.cmd) {
				case "cd":
					curr = curr.cd(command.arg);
					break;
				case "ls":
					curr.ls(command.out);
					break;
			}
		}
		
		return root.GetAllSizes()
			.filter(x => x <= 100000)
			.reduce((a, b) => a + b, 0);
	});