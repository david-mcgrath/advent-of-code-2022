var url = "https://adventofcode.com/2022/day/19/input";
var testData = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function State(state = {}) {
	let self = this;
	
	this.Time = state.Time || 0;
	this.Ore = state.Ore || 0;
	this.Clay = state.Clay || 0;
	this.Obsidian = state.Obsidian || 0;
	this.Geode = state.Geode || 0;
	this.OreRobot = state.OreRobot || 0;
	this.ClayRobot = state.ClayRobot || 0;
	this.ObsidianRobot = state.ObsidianRobot || 0;
	this.GeodeRobot = state.GeodeRobot || 0;
	this.Complete = state.Complete || false;
	
	this.TimeToBuild = function (robotDetails) {
		function timePerCostItem(required, current, production) {
			return required > 0
				? Math.max(0, Math.ceil((required - current) / production)) + 1
				: 1;
		}
		
		let canBuild =
			(!robotDetails.ore || self.OreRobot > 0) &&
			(!robotDetails.clay || self.ClayRobot > 0) &&
			(!robotDetails.obsidian || self.ObsidianRobot > 0) &&
			(!robotDetails.geode || self.GeodeRobot > 0);
		
		if (!canBuild)
			return -1;
		
		return [
			timePerCostItem(robotDetails.ore, self.Ore, self.OreRobot),
			timePerCostItem(robotDetails.clay, self.Clay, self.ClayRobot),
			timePerCostItem(robotDetails.obsidian, self.Obsidian, self.ObsidianRobot),
			timePerCostItem(robotDetails.geode, self.Geode, self.GeodeRobot)
		].reduce((a, b) => a > b ? a : b);
	}
	this.SubtractBuildCost = function (robotDetails) {
		self.Ore -= robotDetails.ore;
		self.Clay -= robotDetails.clay;
		self.Obsidian -= robotDetails.obsidian;
		self.Geode -= robotDetails.geode;
	}
	this.Step = function (time) {
		self.Time += time;
		self.Ore += self.OreRobot * time;
		self.Clay += self.ClayRobot * time;
		self.Obsidian += self.ObsidianRobot * time;
		self.Geode += self.GeodeRobot * time;
	}
	this.Options = function (blueprint, maxTime) {
		let results = [];
		
		// build robots
		let ttbOre = self.TimeToBuild(blueprint.oreRobot);
		let ttbClay = self.TimeToBuild(blueprint.clayRobot);
		let ttbObsidian = self.TimeToBuild(blueprint.obsidianRobot);
		let ttbGeode = self.TimeToBuild(blueprint.geodeRobot);
		
		if (ttbOre > -1 && self.Time + ttbOre < maxTime) {
			let tmp = new State(self);
			tmp.Step(ttbOre);
			tmp.SubtractBuildCost(blueprint.oreRobot);
			tmp.OreRobot++;
			results.push(tmp);
		}
		if (ttbClay > -1 && self.Time + ttbClay < maxTime) {
			let tmp = new State(self);
			tmp.Step(ttbClay);
			tmp.SubtractBuildCost(blueprint.clayRobot);
			tmp.ClayRobot++;
			results.push(tmp);
		}
		if (ttbObsidian > -1 && self.Time + ttbObsidian < maxTime) {
			let tmp = new State(self);
			tmp.Step(ttbObsidian);
			tmp.SubtractBuildCost(blueprint.obsidianRobot);
			tmp.ObsidianRobot++;
			results.push(tmp);
		}
		if (ttbGeode > -1 && self.Time + ttbGeode < maxTime) {
			let tmp = new State(self);
			tmp.Step(ttbGeode);
			tmp.SubtractBuildCost(blueprint.geodeRobot);
			tmp.GeodeRobot++;
			results.push(tmp);
		}
		
		// If can't build any robots in the time frame, push it to the complete state
		if (results.length === 0) {
			let tmp = new State(self);
			tmp.Step(maxTime - self.Time);
			tmp.Complete = true;
			results.push(tmp);
		}
		
		return results;
	}
}

let isTest = false;
await getInput(isTest)
	.then(input => {
		let blueprints = input
			.split("\n")
			.filter(x => x)
			.map(x => {
				let name = x
					.split(": ")[0];
				let details = x
					.split(": ")[1]
					.split(". ")
					.map(y => y
						.split(".")[0])
					.map(y => y
						.split(" costs ")[1]
						.split(" and ")
						.map(z => z
							.split(" "))
						.reduce((a, b) => {
							a[b[1]] = +b[0];
							return a;
						}, {}))
					.map(y => {
						return {
							ore: y["ore"] || 0,
							clay: y["clay"] || 0,
							obsidian: y["obsidian"] || 0,
							geode: y["geode"] || 0
						};
					});
				
				return {
					name: name,
					id: +name.split(" ")[1],
					oreRobot: details[0],
					clayRobot: details[1],
					obsidianRobot: details[2],
					geodeRobot: details[3],
					max: 0
				};
			});
		
		// Remove all except the first three blueprints
		blueprints = blueprints.slice(0, 3);
		
		let maxTime = 32;
		
		for (let i = 0; i < blueprints.length; i++) {
			let blueprint = blueprints[i];
			let max = 0;
			
			let cullingStateByTime = [];
			
			// Find best result
			let stack = [new State()];
			stack[0].OreRobot++;
			
			while (stack.length > 0) {
				let state = stack.pop();
				
				if (state.Complete) {
					max = state.Geode > max ? state.Geode : max;
					continue;
				}
				
				// Check if it's even possible to reach the max geodes (assume 1 geode robot construction per minute)
				if (state.Geode + (maxTime - state.Time) * state.GeodeRobot + (maxTime - state.Time) * (maxTime - state.Time + 1) / 2 < max)
					continue;
				
				// Check if the state is strictly worse than what's been seen before
				let cullingState = cullingStateByTime[state.Time];
				if (cullingState) {
					if (state.Ore <= cullingState.Ore &&
					state.Clay <= cullingState.Clay &&
					state.Obsidian <= cullingState.Obsidian &&
					state.Geode <= cullingState.Geode &&
					state.OreRobot <= cullingState.OreRobot &&
					state.ClayRobot <= cullingState.ClayRobot &&
					state.ObsidianRobot <= cullingState.ObsidianRobot &&
					state.GeodeRobot <= cullingState.GeodeRobot)
					continue;
					
					if (state.Ore >= cullingState.Ore &&
					state.Clay >= cullingState.Clay &&
					state.Obsidian >= cullingState.Obsidian &&
					state.Geode >= cullingState.Geode &&
					state.OreRobot >= cullingState.OreRobot &&
					state.ClayRobot >= cullingState.ClayRobot &&
					state.ObsidianRobot >= cullingState.ObsidianRobot &&
					state.GeodeRobot >= cullingState.GeodeRobot)
					cullingStateByTime[state.Time] = new State(state);
				}
				else {
					cullingStateByTime[state.Time] = new State(state);
				}
				
				// Add all options
				stack.push(...state.Options(blueprint, maxTime));
			}
			
			blueprint.max = max;
		}
		
		console.log(blueprints);
		
		return blueprints
			.map(x => x.max)
			.reduce((a, b) => a * b);
	});