var timer = {
	reset: function(){
		this.stack = [];
		this.runs = {};
		this.running = [];
		this.blocked = [];
		this.log = [];
		this.delayed = true;
		return this;
	},
	set: function(name, over, block){
		name = name || "anonymous";
		var that = this;
		if(that.blocked.indexOf(name) !== -1 || that.delayed){
			return;
		}
		
		that.stack.push({
			name: name,
			over: over,
			start: performance.now(),
			block: block
		});
		var runID = name;
		if(over !== undefined && that.runs[runID] === undefined){
			that.runs[runID] = [];
			that.running.push(runID);
		}
	},
	finish: function(name){
		var that = this;
		if(that.blocked.indexOf(name) !== -1 || that.delayed){
			return;
		}
		
		var result = that.stack.pop();
		if(result === undefined){
			return;
		}
		var delta = performance.now()-result.start;
		if(result.over !== undefined){
			var countID = name;
			that.runs[countID].push(delta);
			if(that.runs[countID].length >= result.over){
				var runs = that.runs[countID];
				for(var i = 1, sum = runs[0]; i < runs.length; i += 1){sum += runs[i];}
				var average = sum/i;
				that.log.push(name + " (average over " + result.over + " runs): " + average + "ms");
				
				that.runs[countID] = [];
				that.running.splice(that.running.indexOf(countID), 1);
				that.displayResults();
				
				if(result.block === true){
					that.blocked.push(name);
				}
			}
		}else{
			that.log.push(name + ": " + delta + "ms");
			that.displayResults();
		}
	},
	displayResults: function(){
		var that = this;
		if(that.running.length === 0 && !that.queuedDisplay){
			that.queuedDisplay = true;
			window.setTimeout(function(){
				alert(that.log.join("\n"));
				that.log = [];
				that.queuedDisplay = false;
			}, 0);
		}
	}
};
timer.reset();