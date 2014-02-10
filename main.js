var timer = {
	delayed: true,
	queuedDisplay: false,
	running: [],
	counts: {},
	blocked: [],
	log: [],
	reset: function(){
		this.running = [];
		this.counts = {};
		this.blocked = [];
		this.log = [];
	},
	set: function(name, over, block){
		name = name || "anonymous";
		if(this.blocked.indexOf(name) !== -1 || this.delayed){
			return;
		}
		this.running.push({
			name: name,
			over: over,
			start: Date.now(),
			block: block
		});
		var countID = name;
		if(over !== undefined && this.counts[countID] === undefined){
			this.counts[countID] = {
				runs: []
			};
		}
	},
	finish: function(name){
		if(this.blocked.indexOf(name) !== -1 || this.delayed){
			return;
		}
		
		var result = this.running.pop();
		if(result === undefined){
			return;
		}
		var delta = Date.now()-result.start;
		//console.assert(name === undefined || result.name === name);
		if(result.over !== undefined){
			var countID = name;
			this.counts[countID].runs.push(delta);
			if(this.counts[countID].runs.length >= result.over){
				var runs = this.counts[countID].runs;
				for(var i = 1, sum = runs[0]; i < runs.length; i += 1){sum += runs[i];}
				var average = sum/i;
				this.log.push(name + " (average over " + result.over + " runs): " + average + "ms");
				console.log(this.log[this.log.length-1]);
				this.displayResults();
				
				if(result.block === true){
					this.blocked.push(name);
				}
			}
		}else{
			this.log.push(name + ": " + delta + "ms");
			console.log(this.log[this.log.length-1]);
			this.displayResults();
		}
	},
	displayResults: function(){
		var that = this;
		if(!that.queuedDisplay){
			that.queuedDisplay = true;
			window.setTimeout(function(){
				alert(that.log.join("\n"));
				that.queuedDisplay = false;
			}, 0);
		}
	}
};