(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Untitled_1_atlas_1", frames: [[0,0,623,1438],[625,0,1022,773],[625,775,753,903]]},
		{name:"Untitled_1_atlas_2", frames: [[820,786,750,750],[755,0,784,784],[0,905,818,818],[0,0,753,903]]},
		{name:"Untitled_1_atlas_3", frames: [[1286,650,683,683],[0,719,522,957],[0,0,717,717],[719,0,760,648],[524,719,760,648],[1247,1369,778,564],[524,1369,721,643]]},
		{name:"Untitled_1_atlas_4", frames: [[985,507,516,516],[1299,1252,489,490],[1596,0,396,733],[454,611,502,531],[1503,735,512,515],[985,0,609,505],[454,0,529,609],[0,0,452,766],[0,768,408,747],[761,1485,536,463],[410,1144,735,339],[0,1517,759,398]]},
		{name:"Untitled_1_atlas_5", frames: [[1071,813,410,410],[1483,1198,356,356],[1483,813,383,383],[357,731,436,436],[357,0,463,463],[357,1169,355,510],[714,1414,355,510],[0,675,355,611],[0,0,355,673],[822,0,469,453],[1293,452,556,359],[795,731,274,681],[1071,1873,512,172],[1071,1704,615,167],[1688,1704,295,313],[1071,1556,720,146],[357,465,721,264],[1745,0,212,339],[1071,1225,410,211],[1841,1198,190,394],[357,1681,347,347],[0,1288,355,611],[1293,0,450,450]]},
		{name:"Untitled_1_atlas_6", frames: [[822,264,87,56],[280,258,128,55],[410,258,56,120],[0,139,108,172],[822,0,99,262],[666,0,154,318],[923,235,77,103],[923,0,75,116],[923,118,75,115],[280,315,64,63],[110,258,107,117],[110,139,128,117],[240,139,128,117],[666,320,72,31],[346,315,52,52],[370,139,128,117],[0,0,502,137],[504,0,160,375],[0,313,94,49],[740,320,67,28],[219,258,59,126]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_101 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_102 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_100 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_104 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_103 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_97 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_99 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_98 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_93 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_96 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_95 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_94 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_75 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_84 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_83 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["Untitled_1_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["Untitled_1_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["Untitled_1_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(img.CachedBmp_71);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,889,2238);


(lib.CachedBmp_72 = function() {
	this.initialize(img.CachedBmp_72);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,876,2513);


(lib.CachedBmp_3 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["Untitled_1_atlas_6"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(img.CachedBmp_73);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,876,2633);


(lib.CachedBmp_74 = function() {
	this.initialize(img.CachedBmp_74);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1012,3073);


(lib.CachedBmp_6 = function() {
	this.initialize(img.CachedBmp_6);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_9 = function() {
	this.initialize(img.CachedBmp_9);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1927);


(lib.CachedBmp_11 = function() {
	this.initialize(img.CachedBmp_11);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2078);


(lib.CachedBmp_16 = function() {
	this.initialize(img.CachedBmp_16);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2379);


(lib.CachedBmp_8 = function() {
	this.initialize(img.CachedBmp_8);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1837);


(lib.CachedBmp_5 = function() {
	this.initialize(img.CachedBmp_5);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_7 = function() {
	this.initialize(img.CachedBmp_7);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1747);


(lib.CachedBmp_14 = function() {
	this.initialize(img.CachedBmp_14);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2258);


(lib.CachedBmp_12 = function() {
	this.initialize(img.CachedBmp_12);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2138);


(lib.CachedBmp_15 = function() {
	this.initialize(img.CachedBmp_15);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2318);


(lib.CachedBmp_10 = function() {
	this.initialize(img.CachedBmp_10);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2018);


(lib.CachedBmp_13 = function() {
	this.initialize(img.CachedBmp_13);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,2198);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Scene_1_clap_effect = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// clap_effect
	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(600.1,169.25,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_3();
	this.instance_1.setTransform(592.45,158.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},442).to({state:[{t:this.instance_1}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.up_leg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_104();
	this.instance.setTransform(0,-6.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-6.8,54,86);


(lib.leg2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_103();
	this.instance.setTransform(0,-12.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-12.3,49.5,131);


(lib.foot2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_102();
	this.instance.setTransform(0,0,0.4729,0.4729);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,60.6,26);


(lib.foot = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_101();
	this.instance.setTransform(1,5.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1,5.8,43.5,27.999999999999996);


(lib.down_leg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_100();
	this.instance.setTransform(-0.4,-7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-7,28,60);


(lib.wLight = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_99();
	this.instance.setTransform(-0.95,0.05,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_98();
	this.instance_1.setTransform(-7.6,-6.6,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_97();
	this.instance_2.setTransform(-14.25,-13.25,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_96();
	this.instance_3.setTransform(-20.9,-19.85,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_95();
	this.instance_4.setTransform(-27.55,-26.5,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_94();
	this.instance_5.setTransform(-34.2,-33.15,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_93();
	this.instance_6.setTransform(-40.85,-39.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-40.8,-39.8,258,258);


(lib.lighting = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_86();
	this.instance.setTransform(359.25,-50.75,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_85();
	this.instance_1.setTransform(350.85,-59.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_84();
	this.instance_2.setTransform(342.5,-67.55,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_83();
	this.instance_3.setTransform(334.1,-75.95,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_82();
	this.instance_4.setTransform(325.7,-84.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(325.7,-84.3,409.00000000000006,409);


(lib.lamp_broken = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_66();
	this.instance.setTransform(-3,-16,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_67();
	this.instance_1.setTransform(-3,-16,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_68();
	this.instance_2.setTransform(-3,-16,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_69();
	this.instance_3.setTransform(-17.6,-16,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_70();
	this.instance_4.setTransform(-32.95,-16,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_71();
	this.instance_5.setTransform(-92.95,-16,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_72();
	this.instance_6.setTransform(-93,-16,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_73();
	this.instance_7.setTransform(-93,-16,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_74();
	this.instance_8.setTransform(-107.5,-16,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-107.5,-16,506,1536.5);


(lib.homelamp = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(-16,-16,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-16,-16,77,159);


(lib.hand10 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_60();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,380,324);


(lib.hand8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,251,265.5);


(lib.hand7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,137,340.5);


(lib.hand6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,256,257.5);


(lib.hand5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,264.5,304.5);


(lib.hand4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_54();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,304.5,252.5);


(lib.hand3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,226,383);


(lib.hand1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,204,373.5);


(lib.nose = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(15.5,-3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_51();
	this.instance_1.setTransform(17.15,2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(15.5,-3,40.2,58);


(lib.neck = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(-0.8,-2.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.8,-2.7,37.5,57.5);


(lib.mouth = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(23.15,141.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_40();
	this.instance_1.setTransform(23.5,125.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_41();
	this.instance_2.setTransform(1.15,65.05,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_42();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_43();
	this.instance_4.setTransform(107.85,111.05,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_44();
	this.instance_5.setTransform(-23.85,-63.7,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_45();
	this.instance_6.setTransform(61.6,65.85,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_46();
	this.instance_7.setTransform(92.3,70.15,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_47();
	this.instance_8.setTransform(107.1,108.85,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_48();
	this.instance_9.setTransform(104.85,86.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.8,-63.7,511,386.5);


(lib.eyebrows = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,32,31.5);


(lib.eye2_stati = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,53.5,58.5);


(lib.eye2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_31();
	this.instance_1.setTransform(-1.5,-1.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_30();
	this.instance_2.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_1}]},2).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,64,58.5);


(lib.blinkeye = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(1.35,1.35,0.2886,0.2886);

	this.instance_1 = new lib.CachedBmp_26();
	this.instance_1.setTransform(-1.8,5.1,0.2886,0.2886);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},16).to({state:[{t:this.instance}]},1).wait(14));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.8,1.4,20.8,14.999999999999998);


(lib.startBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-5,91.9,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_23();
	this.instance_1.setTransform(8,13.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.startBtn, new cjs.Rectangle(-5,13.6,251,225), null);


(lib.body = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(-8.75,-9.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-8.7,-9,106,169.5);


(lib.ball = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,173.5,173.5);


(lib.up_arm = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(8.5,13.7,0.2214,0.2214);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(8.5,13.7,35.4,83);


(lib.down_arm = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(3.65,6.1,0.1913,0.1913);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(3.7,6.1,36.3,75.4);


(lib.___Camera___ = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-641,-361,1282,722);


(lib.Scene_1_darkScreen = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// darkScreen
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_1 = new lib.wLight("synched",0);
	this.instance_1.setTransform(681.85,117.7,0.9998,0.9998,0,0,0,88.8,89.9);

	this.instance_2 = new lib.CachedBmp_6();
	this.instance_2.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_7();
	this.instance_3.setTransform(-89.1,-94.8,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_8();
	this.instance_4.setTransform(-89.1,-139.95,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_9();
	this.instance_5.setTransform(-89.1,-185.05,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_10();
	this.instance_6.setTransform(-89.1,-230.2,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_11();
	this.instance_7.setTransform(-89.1,-260.3,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_12();
	this.instance_8.setTransform(-89.1,-290.35,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_13();
	this.instance_9.setTransform(-89.1,-320.45,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_14();
	this.instance_10.setTransform(-89.1,-350.55,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_15();
	this.instance_11.setTransform(-89.1,-380.6,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_16();
	this.instance_12.setTransform(-89.1,-410.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},39).to({state:[{t:this.instance},{t:this.instance_1}]},136).to({state:[{t:this.instance_2}]},83).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_ball = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// ball
	this.instance = new lib.ball("synched",0);
	this.instance.setTransform(791.3,351.45,0.1377,0.1377,0,0,0,86.5,86.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(6).to({_off:false},0).wait(1).to({regX:86.8,regY:86.8,x:762.95,y:301.45},0).wait(1).to({x:732.05,y:252.95},0).wait(1).to({x:694.75,y:209.65},0).wait(1).to({x:646.45,y:179},0).wait(1).to({x:590.35,y:181.05},0).wait(1).to({x:539.9,y:208.3},0).wait(1).to({x:501.8,y:251},0).wait(1).to({x:471.55,y:299.9},0).wait(1).to({x:444.8,y:350.85},0).to({_off:true},1).wait(9).to({_off:false,regX:86.5,regY:86.5,x:444.9,y:366.6},0).wait(1).to({regX:86.8,regY:86.8,x:463.6,y:319.65},0).wait(1).to({x:484.3,y:273.35},0).wait(1).to({x:507.65,y:228.45},0).wait(1).to({x:535.1,y:186},0).wait(1).to({x:569.3,y:148.8},0).wait(1).to({x:614.3,y:127.15},0).wait(1).to({x:662.35,y:139.5},0).wait(1).to({x:698.85,y:174.2},0).wait(1).to({x:726.95,y:216.3},0).wait(1).to({x:750.15,y:261.25},0).wait(1).to({x:770.15,y:307.75},0).wait(1).to({x:787.95,y:355.15},0).wait(1).to({x:755.35,y:331.1},0).wait(1).to({x:719.2,y:313.9},0).wait(1).to({x:678.7,y:311.95},0).wait(1).to({x:642,y:325.1},0).wait(1).to({x:623,y:360.8},0).wait(1).to({x:612.5,y:399.9},0).wait(1).to({x:603.8,y:439.55},0).wait(1).to({x:595.4,y:479.25},0).wait(1).to({x:587.9,y:519.2},0).wait(1).to({x:584.05,y:559.5},0).wait(1).to({x:580.65,y:548.45},0).wait(1).to({x:574.85,y:538.3},0).wait(1).to({x:566.7,y:530.05},0).wait(1).to({x:555.8,y:526.35},0).wait(1).to({x:544.85,y:529.9},0).wait(1).to({x:536.5,y:537.95},0).wait(1).to({x:530.55,y:548},0).wait(1).to({x:526.9,y:559.05},0).wait(1).to({x:517.8,y:550.2},0).wait(1).to({x:506.8,y:543.55},0).wait(1).to({x:494.9,y:539.35},0).wait(1).to({x:482.45,y:542.1},0).wait(1).to({x:472.05,y:549.55},0).wait(1).to({x:463.45,y:559.05},0).wait(1).to({x:457.7,y:554.25},0).wait(1).to({x:450.6,y:551.75},0).wait(1).to({x:443.2,y:552.65},0).wait(1).to({x:436.3,y:555.7},0).wait(1).to({x:429.05,y:557.7},0).wait(1).to({x:421.55,y:558.2},0).wait(1).to({x:414,y:558.55},0).wait(1).to({x:406.45,y:558.75},0).wait(1).to({x:398.85,y:558.8},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.lamp2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_75();
	this.instance.setTransform(439.6,-14.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_77();
	this.instance_1.setTransform(439.7,-14.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1,p:{x:439.7}}]},4).to({state:[{t:this.instance_1,p:{x:439.6}}]},4).wait(1));

	// Layer_2
	this.instance_2 = new lib.lighting();
	this.instance_2.setTransform(531.25,122.55,1,1,0,0,0,530,120);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(9));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(360.5,-48.2,341.5,341.5);


(lib.lamp = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_64();
	this.instance.setTransform(17.1,-99.55,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_66();
	this.instance_1.setTransform(17.1,-99.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},4).wait(5));

	// Layer_2
	this.instance_2 = new lib.lighting();
	this.instance_2.setTransform(106.75,113,1,1,0,0,0,530,120);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},4).wait(5));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64,-99.5,341.5,383.3);


(lib.hand12 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.lamp2("synched",0);
	this.instance.setTransform(157.9,212.65,0.9558,0.9558,0,0,180,531.2,122.7);

	this.instance_1 = new lib.CachedBmp_62();
	this.instance_1.setTransform(77.55,135.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.4,49.2,326.4,326.40000000000003);


(lib.hand11 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.lamp2("synched",0);
	this.instance.setTransform(184.7,75.15,1,1,180,0,0,531.3,122.6);

	this.instance_1 = new lib.CachedBmp_61();
	this.instance_1.setTransform(34.7,26.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(14,-95.5,341.5,341.5);


(lib.hand9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.ball("synched",0);
	this.instance.setTransform(175.45,112.95,1,1,0,0,0,86.7,86.7);

	this.instance_1 = new lib.CachedBmp_59();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,380,324);


(lib.head21 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",0);
	this.instance.setTransform(176.95,208.5,0.3609,0.3609,-5.7711,0,0,36.2,26.2);

	this.instance_1 = new lib.CachedBmp_38();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,360.5,321.5);


(lib.head2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",0);
	this.instance.setTransform(176.95,208.5,0.3609,0.3609,-5.7711,0,0,36.2,26.2);

	this.instance_1 = new lib.blinkeye("synched",0);
	this.instance_1.setTransform(144.6,171.45,1.2185,1.2185,0,0,0,8.7,9);

	this.instance_2 = new lib.blinkeye("synched",0);
	this.instance_2.setTransform(194.3,171.45,1.2185,1.2185,0,0,0,8.7,9);

	this.instance_3 = new lib.CachedBmp_38();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(40));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,360.5,321.5);


(lib.head11 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",1);
	this.instance.setTransform(149.2,281.8,0.5222,0.5222,0,0,180,35.4,26.2);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,376.5,451.5);


(lib.head1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",1);
	this.instance.setTransform(149.2,281.8,0.5222,0.5222,0,0,180,35.4,26.2);

	this.instance_1 = new lib.blinkeye("single",0);
	this.instance_1.setTransform(186.9,247.8,1.7326,1.7326,0,0,0,9,9);

	this.instance_2 = new lib.blinkeye("single",0);
	this.instance_2.setTransform(129.7,247.8,1.7326,1.7326,0,0,0,9,9);

	this.instance_3 = new lib.CachedBmp_36();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_35();
	this.instance_4.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2,p:{mode:"single"}},{t:this.instance_1,p:{mode:"single"}},{t:this.instance,p:{regX:35.4,regY:26.2,scaleX:0.5222,scaleY:0.5222,x:149.2,y:281.8}}]}).to({state:[{t:this.instance_4},{t:this.instance_2,p:{mode:"synched"}},{t:this.instance_1,p:{mode:"synched"}},{t:this.instance,p:{regX:35.7,regY:26,scaleX:0.5533,scaleY:0.5533,x:149.3,y:281.5}}]},8).wait(62));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,376.5,451.5);


(lib.replayBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// text
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(4.1,62.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(4));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_64();
	this.instance_1.setTransform(17.1,-99.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(4));

	// Layer_2
	this.light = new lib.lighting();
	this.light.name = "light";
	this.light.setTransform(106.75,113,1,1,0,0,0,530,120);

	this.timeline.addTween(cjs.Tween.get(this.light).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64,-99.5,341.5,383.3);


(lib.Scene_1_lamp = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// lamp
	this.instance = new lib.lamp("single",0);
	this.instance.setTransform(629.15,43.55,0.421,0.421,0,0,0,105.8,53.3);

	this.instance_1 = new lib.lamp_broken("synched",0,false);
	this.instance_1.setTransform(637.55,8.25,0.421,0.421,0,0,0,106,53.1);

	this.instance_2 = new lib.lamp2("synched",0);
	this.instance_2.setTransform(680.8,116.3,0.3094,0.3094,0,180,0,532.6,121.7);

	this.instance_3 = new lib.homelamp("synched",0);
	this.instance_3.setTransform(631.65,-15.8,0.419,0.419,0,0,0,22.9,63);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance,p:{mode:"single",startPosition:0,regX:105.8,regY:53.3,scaleX:0.421,scaleY:0.421,x:629.15,y:43.55}}]},1).to({state:[{t:this.instance,p:{mode:"synched",startPosition:4,regX:105.8,regY:53.3,scaleX:0.421,scaleY:0.421,x:629.15,y:43.55}}]},29).to({state:[{t:this.instance,p:{mode:"single",startPosition:4,regX:105.8,regY:53.3,scaleX:0.421,scaleY:0.421,x:629.15,y:43.55}}]},9).to({state:[{t:this.instance_1}]},1).to({state:[]},29).to({state:[{t:this.instance_2}]},105).to({state:[]},81).to({state:[{t:this.instance_3,p:{mode:"synched"}}]},68).to({state:[{t:this.instance_3,p:{mode:"single"}},{t:this.instance,p:{mode:"single",startPosition:0,regX:107.2,regY:108.1,scaleX:0.3533,scaleY:0.3533,x:631.75,y:31.05}}]},71).to({state:[{t:this.instance_3,p:{mode:"single"}}]},86).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Character2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Character2
	this.instance = new lib.mouth("single",7);
	this.instance.setTransform(395.9,357.7,0.1219,0.1228,0,-23.2126,156.792,233.8,134.1);

	this.instance_1 = new lib.head2("synched",0);
	this.instance_1.setTransform(391.4,306.45,0.6593,0.6593,-14.7618,0,0,180.2,160.9);

	this.instance_2 = new lib.down_arm("synched",0);
	this.instance_2.setTransform(287.6,388.75,0.8219,0.8219,0,0,0,21.9,12.8);

	this.instance_3 = new lib.up_arm("synched",0);
	this.instance_3.setTransform(296.7,336.35,0.8219,0.8219,0,0,180,15.6,26.5);

	this.instance_4 = new lib.body("synched",0);
	this.instance_4.setTransform(328.65,379.55,0.8219,0.8219,0,0,180,44.1,75.6);

	this.instance_5 = new lib.leg2("synched",0);
	this.instance_5.setTransform(319.1,493.2,1,1,0,0,0,24.8,53.1);

	this.instance_6 = new lib.hand1("synched",0);
	this.instance_6.setTransform(286.1,455.35,0.1393,0.1393,0,0,0,102.3,187);

	this.instance_7 = new lib.foot2("synched",0);
	this.instance_7.setTransform(307.35,558.5,0.9189,1.0573,0,-41.3995,149.6312,30.2,13.2);

	this.instance_8 = new lib.leg2("synched",0);
	this.instance_8.setTransform(345.35,482.55,1,1,0,0,180,24.8,53.1);

	this.instance_9 = new lib.foot2("synched",0);
	this.instance_9.setTransform(371.85,548.6,1.0155,1,0,0,10.0299,30.2,12.9);

	this.instance_10 = new lib.down_arm("synched",0);
	this.instance_10.setTransform(363.2,409.55,0.8219,0.8219,0,-10.0503,169.9497,21.7,43.9);

	this.instance_11 = new lib.hand1("synched",0);
	this.instance_11.setTransform(373.15,444.8,0.1171,0.1171,0,0,180,102,186.6);

	this.instance_12 = new lib.up_arm("synched",0);
	this.instance_12.setTransform(357.55,356.9,0.8219,0.8219,0,0,0,26.3,55.3);

	this.instance_13 = new lib.neck("synched",0);
	this.instance_13.setTransform(326.35,309.95,0.8219,0.8219,0,0,180,17.8,25.9);

	this.instance_14 = new lib.hand10("synched",0);
	this.instance_14.setTransform(427.2,393.85,0.1171,0.1171,-21.0386,0,0,103,187.9);

	this.instance_15 = new lib.hand9("synched",0);
	this.instance_15.setTransform(427.2,393.85,0.1171,0.1171,-21.0386,0,0,103,187.9);

	this.instance_16 = new lib.hand8("synched",0);
	this.instance_16.setTransform(424.3,408.3,0.1399,0.1399,-13.2964,0,0,103.1,188.6);

	this.instance_17 = new lib.head21("synched",0);
	this.instance_17.setTransform(475.65,226.25,0.525,0.525,-9.2896,0,0,180.5,160.8);

	this.instance_18 = new lib.hand6("synched",0);
	this.instance_18.setTransform(617.05,361.65,0.1794,0.2028,0,2.8814,-177.1186,101.7,193.9);

	this.instance_19 = new lib.hand11("synched",0);
	this.instance_19.setTransform(677.4,116.25,0.3102,0.3102,-29.998,0,0,184.8,75.8);

	this.instance_20 = new lib.hand5("synched",0);
	this.instance_20.setTransform(382.5,203.9,0.1596,0.1744,0,-8.0507,-5.6468,103.9,188.3);

	this.instance_21 = new lib.hand12("synched",0);
	this.instance_21.setTransform(636.15,90.65,0.2882,0.2882,-0.276,0,0,184.9,76.4);

	this.instance_22 = new lib.hand7("synched",0);
	this.instance_22.setTransform(597.4,229.2,0.243,0.2003,0,-15.726,-14.0127,86.2,290.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1,p:{regX:180.2,regY:160.9,scaleX:0.6593,scaleY:0.6593,rotation:-14.7618,x:391.4,y:306.45,startPosition:0}},{t:this.instance,p:{regX:233.8,regY:134.1,scaleX:0.1219,scaleY:0.1228,rotation:0,skewX:-23.2126,skewY:156.792,x:395.9,y:357.7,startPosition:7}}]}).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:1}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_11,p:{regX:102,regY:186.6,skewX:0,skewY:180,x:373.15,y:444.8,scaleX:0.1171,scaleY:0.1171}},{t:this.instance_10,p:{regY:43.9,skewX:-10.0503,skewY:169.9497,x:363.2,y:409.55,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:10}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_11,p:{regX:102.1,regY:187.2,skewX:-29.9968,skewY:150.0032,x:406.05,y:430.6,scaleX:0.1171,scaleY:0.1171}},{t:this.instance_10,p:{regY:44,skewX:-40.0491,skewY:139.9509,x:379.8,y:405.1,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},10).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:11}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_11,p:{regX:102.4,regY:187.6,skewX:-45,skewY:135,x:416.5,y:417.55,scaleX:0.1171,scaleY:0.1171}},{t:this.instance_10,p:{regY:44.1,skewX:-55.0486,skewY:124.9514,x:384.55,y:399.6,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:14}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:103,regY:187.9,scaleX:0.1171,scaleY:0.1171,rotation:-21.0386,x:427.2,y:393.85,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44,skewX:-79.008,skewY:100.992,x:390.7,y:387.8,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},3).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:15}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_15,p:{regX:103,regY:187.9,scaleX:0.1171,scaleY:0.1171,rotation:-21.0386,x:427.2,y:393.85}},{t:this.instance_10,p:{regY:44,skewX:-79.008,skewY:100.992,x:390.7,y:387.8,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:16}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:103.1,regY:188.6,rotation:-13.2964,x:424.3,y:408.3,scaleX:0.1399,scaleY:0.1399}},{t:this.instance_10,p:{regY:44.1,skewX:-71.2724,skewY:108.7276,x:389.3,y:391.7,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:17}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:103.2,regY:188.7,rotation:-23.0041,x:427.7,y:398.15,scaleX:0.1399,scaleY:0.1399}},{t:this.instance_10,p:{regY:44.1,skewX:-80.9803,skewY:99.0197,x:390.95,y:386.75,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:18}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:103.2,regY:188.8,rotation:-16.2777,x:425.15,y:406,scaleX:0.1399,scaleY:0.1399}},{t:this.instance_10,p:{regY:44.1,skewX:-74.2555,skewY:105.7445,x:390,y:390.45,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:19}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:103.5,regY:188.6,rotation:13.7224,x:404.7,y:434.55,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_10,p:{regY:44.1,skewX:-44.256,skewY:135.744,x:382,y:403.45,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:20}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:104,regY:188.6,rotation:38.9186,x:374.9,y:448.1,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_10,p:{regY:44.1,skewX:-19.0587,skewY:160.9413,x:367.55,y:410.25,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:20}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:103.7,regY:188.6,rotation:20.2107,x:398.3,y:438.9,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_10,p:{regY:44.1,skewX:-37.7669,skewY:142.2331,x:379.25,y:405.4,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:21}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_16,p:{regX:104,regY:189,rotation:15.5134,x:403,y:435.7,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_10,p:{regY:44.2,skewX:-42.4626,skewY:137.5374,x:381.25,y:403.9,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:22}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_15,p:{regX:104,regY:189.3,scaleX:0.1398,scaleY:0.1398,rotation:-14.4851,x:423.9,y:407.65}},{t:this.instance_10,p:{regY:44.2,skewX:-72.4623,skewY:107.5377,x:389.15,y:390.95,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:0,x:329.3,y:225.6,startPosition:23}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:104.4,regY:189.6,scaleX:0.1398,scaleY:0.1398,rotation:-19.9222,x:426.25,y:401.5,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.2,skewX:-77.9003,skewY:102.0997,x:390,y:388.1,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.2,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-14.9864,skewX:0,skewY:0,x:325.75,y:263.6,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.3,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-2.7403,x:325.25,y:225.55,startPosition:32}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:104.4,regY:189.6,scaleX:0.1398,scaleY:0.1398,rotation:-19.9222,x:426.25,y:401.5,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.2,skewX:-77.9003,skewY:102.0997,x:390,y:388.1,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.8,regY:131.9,scaleX:0.0825,scaleY:0.1752,rotation:-17.7232,skewX:0,skewY:0,x:323.6,y:263.7,startPosition:0}}]},9).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:315.65,y:226.25,startPosition:32}},{t:this.instance_12,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:104.4,regY:189.6,scaleX:0.1398,scaleY:0.1398,rotation:-19.9222,x:426.25,y:401.5,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.2,skewX:-77.9003,skewY:102.0997,x:390,y:388.1,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.6,regY:132.8,scaleX:0.0817,scaleY:0.1125,rotation:0,skewX:-24.2774,skewY:155.7332,x:317.25,y:272.25,startPosition:4}}]},1).to({state:[{t:this.instance_13,p:{x:326.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_12,p:{regX:26.2,regY:55.2,rotation:-135,x:358.8,y:326,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:103.8,regY:189.5,scaleX:0.1398,scaleY:0.1398,rotation:-139.9238,x:361.8,y:241.95,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.2,skewX:162.0983,skewY:-17.9017,x:368.35,y:280,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:315.65,y:226.25,startPosition:38}},{t:this.instance_9,p:{x:371.85}},{t:this.instance_8,p:{x:345.35}},{t:this.instance_7,p:{x:307.35}},{t:this.instance_6,p:{regX:102.4,regY:185.2,scaleY:0.114,skewX:-171.2527,skewY:8.7586,x:270.85,y:253.15,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:319.1}},{t:this.instance_4,p:{x:328.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.5,regY:26.4,scaleY:0.6726,rotation:143.7543,skewY:0,x:296.75,y:336.45,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.5,scaleY:0.6726,skewX:-171.2469,skewY:8.7523,x:264.05,y:307.3,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.6,regY:132.8,scaleX:0.0817,scaleY:0.1125,rotation:0,skewX:-24.2774,skewY:155.7332,x:317.25,y:272.25,startPosition:4}}]},8).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_12,p:{regX:26.2,regY:55.2,rotation:-135,x:518.8,y:326,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:103.8,regY:189.5,scaleX:0.1398,scaleY:0.1398,rotation:-139.9238,x:521.8,y:241.95,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.2,skewX:162.0983,skewY:-17.9017,x:528.35,y:280,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_17},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.4,regY:185.2,scaleY:0.114,skewX:-171.2527,skewY:8.7586,x:430.85,y:253.15,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.5,regY:26.4,scaleY:0.6726,rotation:143.7543,skewY:0,x:456.75,y:336.45,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.5,scaleY:0.6726,skewX:-171.2469,skewY:8.7523,x:424.05,y:307.3,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.6,regY:132.8,scaleX:0.0817,scaleY:0.1125,rotation:0,skewX:-24.2774,skewY:155.7332,x:477.25,y:272.25,startPosition:4}}]},26).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_12,p:{regX:26.2,regY:55.2,rotation:-135,x:518.8,y:326,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:103.8,regY:189.5,scaleX:0.1398,scaleY:0.1398,rotation:-139.9238,x:521.8,y:241.95,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.2,skewX:162.0983,skewY:-17.9017,x:528.35,y:280,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:20}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.4,regY:185.2,scaleY:0.114,skewX:-171.2527,skewY:8.7586,x:430.85,y:253.15,scaleX:0.1393,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.5,regY:26.4,scaleY:0.6726,rotation:143.7543,skewY:0,x:456.75,y:336.45,scaleX:0.8219,skewX:0}},{t:this.instance_2,p:{regY:12.5,scaleY:0.6726,skewX:-171.2469,skewY:8.7523,x:424.05,y:307.3,scaleX:0.8219,regX:21.9}},{t:this.instance,p:{regX:233.6,regY:132.8,scaleX:0.0817,scaleY:0.1125,rotation:0,skewX:-24.2774,skewY:155.7332,x:477.25,y:272.25,startPosition:4}}]},100).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_12,p:{regX:27.9,regY:30.6,rotation:-21.4548,x:518.15,y:334.5,scaleX:0.8217,scaleY:0.8217,skewX:0,skewY:0}},{t:this.instance_14,p:{regX:104.7,regY:191.3,scaleX:0.1397,scaleY:0.1397,rotation:-19.9093,x:595,y:394.65,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.5,skewX:-77.9039,skewY:102.0961,x:558.85,y:381.25,regX:21.9,scaleX:0.8216,scaleY:0.8216}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:22}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:233.6,regY:132.8,scaleX:0.0817,scaleY:0.1125,rotation:0,skewX:-24.2774,skewY:155.7332,x:477.25,y:272.25,startPosition:9}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_18},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:25}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_12,p:{regX:28.1,regY:32.2,rotation:-38.4418,x:521.2,y:332.5,scaleX:0.8211,scaleY:0.8211,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.8,skewX:-94.8893,skewY:85.1107,x:574.7,y:365.25,regX:22.3,scaleX:0.8214,scaleY:0.7845}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:134.5,scaleX:0.0816,scaleY:0.1124,rotation:-20.7254,skewX:0,skewY:0,x:475.9,y:269.5,startPosition:3}}]},10).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_11,p:{regX:102.2,regY:194.7,skewX:-80.9045,skewY:99.0944,x:609.75,y:373.55,scaleX:0.1168,scaleY:0.132}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:3}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_12,p:{regX:28.1,regY:32.3,rotation:-27.97,x:520.9,y:333.95,scaleX:0.8211,scaleY:0.8211,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.8,skewX:-88.6636,skewY:91.3371,x:567.9,y:373.8,regX:22.4,scaleX:0.8213,scaleY:0.7845}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:233.8,regY:136,scaleX:0.0815,scaleY:0.1123,rotation:0,skewX:-9.2704,skewY:170.728,x:478.15,y:273.6,startPosition:10}}]},58).to({state:[{t:this.instance_13,p:{x:484.1,regX:17.5,regY:26.3,scaleX:0.8218,scaleY:0.8218,y:310.05,skewX:0,skewY:180}},{t:this.instance_11,p:{regX:102.9,regY:195.9,skewX:-84.3546,skewY:95.6398,x:610.5,y:367.4,scaleX:0.1168,scaleY:0.132}},{t:this.instance_1,p:{regX:181,regY:161.3,scaleX:0.5249,scaleY:0.5249,rotation:-9.2832,x:473.45,y:226.3,startPosition:4}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:103.4,regY:186.8,scaleY:0.1201,skewX:-8.2608,skewY:-9.2159,x:427.65,y:426.85,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:497.75,regX:33,regY:144.2,scaleX:0.8218,scaleY:0.8218,skewX:-0.9873,skewY:179.0127,y:435.95}},{t:this.instance_12,p:{regX:28.1,regY:32.5,rotation:-31.4066,x:519.35,y:333.25,scaleX:0.821,scaleY:0.821,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.9,skewX:-92.0971,skewY:87.9033,x:568.65,y:370.05,regX:22.4,scaleX:0.8212,scaleY:0.7844}},{t:this.instance_3,p:{regX:15.2,regY:26.5,scaleY:0.697,rotation:0,skewY:-142.2633,x:453.55,y:338.95,scaleX:0.838,skewX:34.7783}},{t:this.instance_2,p:{regY:12.8,scaleY:0.709,skewX:-8.293,skewY:-9.2272,x:420.85,y:369.8,scaleX:0.8228,regX:22.1}},{t:this.instance,p:{regX:231.3,regY:138.8,scaleX:0.0815,scaleY:0.1123,rotation:0,skewX:-9.2382,skewY:170.7724,x:475.9,y:273.65,startPosition:10}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_11,p:{regX:102.3,regY:195.2,skewX:-88.0858,skewY:91.9094,x:613.75,y:361.5,scaleX:0.1168,scaleY:0.132}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:5}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_12,p:{regX:28.1,regY:32.4,rotation:-35.149,x:520.6,y:333.35,scaleX:0.821,scaleY:0.821,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.8,skewX:-95.8419,skewY:84.159,x:572.2,y:366.95,regX:22.4,scaleX:0.8212,scaleY:0.7844}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:233.8,regY:136,scaleX:0.0815,scaleY:0.1123,rotation:0,skewX:-9.2704,skewY:170.728,x:478.15,y:273.6,startPosition:10}}]},5).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_11,p:{regX:102.6,regY:195.4,skewX:-94.7543,skewY:85.2395,x:616.05,y:349.85,scaleX:0.1168,scaleY:0.132}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:6}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_12,p:{regX:28.1,regY:32.5,rotation:-41.8256,x:520.35,y:332.75,scaleX:0.8209,scaleY:0.8209,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.8,skewX:-102.5177,skewY:77.4829,x:575.45,y:360.05,regX:22.4,scaleX:0.8211,scaleY:0.7843}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:255.8,regY:165,scaleX:0.0805,scaleY:0.1113,rotation:0,skewX:-20.5285,skewY:-20.457,x:482,y:268.55,startPosition:1}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_14,p:{regX:103.6,regY:196.2,scaleX:0.1166,scaleY:0.1319,rotation:-66.2704,x:618.75,y:326.25,skewX:0,skewY:0}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:7}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_12,p:{regX:28,regY:32.6,rotation:-64.8122,x:517.3,y:325.95,scaleX:0.8208,scaleY:0.8208,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:44.9,skewX:-110.5061,skewY:69.4939,x:581.25,y:336.25,regX:22.6,scaleX:0.821,scaleY:0.7841}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:138.3,scaleX:0.0825,scaleY:0.1096,rotation:-14.5393,skewX:0,skewY:0,x:481.4,y:267.95,startPosition:2}}]},1).to({state:[{t:this.instance_14,p:{regX:102.3,regY:197.1,scaleX:0.1168,scaleY:0.1561,rotation:0,x:604.4,y:268.45,skewX:-102.2317,skewY:-104.3665}},{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:8}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.9,regY:32.8,rotation:0,x:506.95,y:331.1,scaleX:0.8218,scaleY:0.9723,skewX:-101.011,skewY:-102.6572}},{t:this.instance_10,p:{regY:44.8,skewX:-142.6102,skewY:27.84,x:575.3,y:299.65,regX:22.8,scaleX:0.9148,scaleY:0.8459}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:138.2,scaleX:0.0836,scaleY:0.1123,rotation:-16.2203,skewX:0,skewY:0,x:479.65,y:270.6,startPosition:3}}]},1).to({state:[{t:this.instance_14,p:{regX:101.4,regY:197.6,scaleX:0.1168,scaleY:0.156,rotation:0,x:629.15,y:215.45,skewX:-102.2231,skewY:-104.3557}},{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:9}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.8,regY:32.8,rotation:0,x:495.85,y:341.95,scaleX:0.8217,scaleY:1.367,skewX:-122.7313,skewY:-124.3774}},{t:this.instance_10,p:{regY:44.7,skewX:-142.6102,skewY:27.8402,x:592.55,y:261.25,regX:23,scaleX:0.9147,scaleY:1.3262}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:138.2,scaleX:0.0836,scaleY:0.1123,rotation:-16.2203,skewX:0,skewY:0,x:479.65,y:270.6,startPosition:3}}]},1).to({state:[{t:this.instance_14,p:{regX:99.5,regY:198.3,scaleX:0.1167,scaleY:0.156,rotation:0,x:654.45,y:164.35,skewX:-107.1922,skewY:-109.3208}},{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:10}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.4,regY:32.8,rotation:0,x:498.8,y:341.45,scaleX:0.8215,scaleY:1.6508,skewX:-127.7136,skewY:-129.3597}},{t:this.instance_10,p:{regY:44.5,skewX:-147.5932,skewY:22.8562,x:612.1,y:228.55,regX:23.6,scaleX:0.9144,scaleY:1.7589}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:138.2,scaleX:0.0836,scaleY:0.1123,rotation:-16.2203,skewX:0,skewY:0,x:479.65,y:270.6,startPosition:3}}]},1).to({state:[{t:this.instance_14,p:{regX:94.6,regY:203.2,scaleX:0.1647,scaleY:0.1557,rotation:0,x:672.5,y:147.25,skewX:-92.1063,skewY:-94.2444}},{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:11}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.3,regY:32.9,rotation:0,x:492.55,y:347.6,scaleX:0.8214,scaleY:1.9503,skewX:-127.7135,skewY:-129.3591}},{t:this.instance_10,p:{regY:44.4,skewX:-147.5935,skewY:22.856,x:620.35,y:220.6,regX:23.8,scaleX:0.9144,scaleY:2.0154}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:138.2,scaleX:0.0836,scaleY:0.1123,rotation:-16.2203,skewX:0,skewY:0,x:479.65,y:270.6,startPosition:3}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:180.5,regY:160.8,scaleX:0.525,scaleY:0.525,rotation:-9.2896,x:475.65,y:226.25,startPosition:12}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.3,regY:32.9,rotation:0,x:492.55,y:347.6,scaleX:0.8214,scaleY:1.9503,skewX:-127.7135,skewY:-129.3591}},{t:this.instance_19,p:{regX:184.8,regY:75.8,scaleX:0.3102,scaleY:0.3102,rotation:-29.998,x:677.4,y:116.25}},{t:this.instance_10,p:{regY:44.4,skewX:-147.5935,skewY:22.856,x:620.35,y:220.6,regX:23.8,scaleX:0.9144,scaleY:2.0154}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_2,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228,regX:21.9}},{t:this.instance,p:{regX:235.2,regY:138.2,scaleX:0.0836,scaleY:0.1123,rotation:-16.2203,skewX:0,skewY:0,x:479.65,y:270.6,startPosition:3}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:15}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:103.3,regY:185.8,scaleY:0.1201,skewX:6.1545,skewY:5.2001,x:409.25,y:419.8,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.3,regY:32.9,rotation:0,x:492.55,y:347.6,scaleX:0.8214,scaleY:1.9503,skewX:-127.7135,skewY:-129.3591}},{t:this.instance_19,p:{regX:184.8,regY:75.8,scaleX:0.3102,scaleY:0.3102,rotation:-29.998,x:677.4,y:116.25}},{t:this.instance_10,p:{regY:44.4,skewX:-147.5935,skewY:22.856,x:620.35,y:220.6,regX:23.8,scaleX:0.9144,scaleY:2.0154}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.697,rotation:0,skewY:-127.8346,x:456.25,y:341.2,scaleX:0.8379,skewX:49.2043}},{t:this.instance_2,p:{regY:12.7,scaleY:0.709,skewX:6.1329,skewY:5.1982,x:416.9,y:362.85,scaleX:0.8227,regX:22.1}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},3).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:16}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:103.3,regY:185.8,scaleY:0.1201,skewX:6.1545,skewY:5.2001,x:409.25,y:419.8,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.2,regY:32.9,rotation:0,x:492.45,y:347.75,scaleX:0.8214,scaleY:1.505,skewX:-127.7135,skewY:-129.3588}},{t:this.instance_19,p:{regX:185.2,regY:76.8,scaleX:0.3101,scaleY:0.3101,rotation:-44.992,x:631.55,y:144.15}},{t:this.instance_10,p:{regY:44.3,skewX:-147.5934,skewY:22.8555,x:599,y:241.8,regX:23.9,scaleX:0.9142,scaleY:1.7412}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.697,rotation:0,skewY:-127.8346,x:456.25,y:341.2,scaleX:0.8379,skewX:49.2043}},{t:this.instance_2,p:{regY:12.7,scaleY:0.709,skewX:6.1329,skewY:5.1982,x:416.9,y:362.85,scaleX:0.8227,regX:22.1}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:17}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:103.3,regY:185.8,scaleY:0.1201,skewX:6.1545,skewY:5.2001,x:409.25,y:419.8,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.2,regY:32.9,rotation:0,x:492.4,y:347.75,scaleX:0.8213,scaleY:1.2541,skewX:-127.7137,skewY:-129.3585}},{t:this.instance_19,p:{regX:185.2,regY:77.3,scaleX:0.31,scaleY:0.31,rotation:-44.992,x:602.7,y:183.55}},{t:this.instance_10,p:{regY:44.3,skewX:-147.5935,skewY:22.8551,x:574.75,y:266.6,regX:24.1,scaleX:0.9141,scaleY:1.3351}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.697,rotation:0,skewY:-127.8346,x:456.25,y:341.2,scaleX:0.8379,skewX:49.2043}},{t:this.instance_2,p:{regY:12.7,scaleY:0.709,skewX:6.1329,skewY:5.1982,x:416.9,y:362.85,scaleX:0.8227,regX:22.1}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:18}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:103.3,regY:185.8,scaleY:0.1201,skewX:6.1545,skewY:5.2001,x:409.25,y:419.8,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.2,regY:32.9,rotation:0,x:492.4,y:347.75,scaleX:0.8213,scaleY:1.2541,skewX:-127.7137,skewY:-129.3585}},{t:this.instance_19,p:{regX:185.3,regY:77.9,scaleX:0.2888,scaleY:0.2888,rotation:-44.9936,x:589.45,y:211.75}},{t:this.instance_10,p:{regY:44.2,skewX:-147.5942,skewY:22.8549,x:568.05,y:278.55,regX:24.4,scaleX:0.9141,scaleY:1.0008}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.697,rotation:0,skewY:-127.8346,x:456.25,y:341.2,scaleX:0.8379,skewX:49.2043}},{t:this.instance_2,p:{regY:12.7,scaleY:0.709,skewX:6.1329,skewY:5.1982,x:416.9,y:362.85,scaleX:0.8227,regX:22.1}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:27}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_6,p:{regX:103.6,regY:186.3,scaleY:0.1201,skewX:-1.3395,skewY:-2.2901,x:420.45,y:424,scaleX:0.1394,rotation:0}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.2,regY:33,rotation:0,x:490.9,y:345.5,scaleX:0.8213,scaleY:1.254,skewX:-122.5231,skewY:-124.1672}},{t:this.instance_19,p:{regX:185.3,regY:78,scaleX:0.2888,scaleY:0.2888,rotation:-39.8025,x:599.75,y:218.95}},{t:this.instance_10,p:{regY:44.2,skewX:-142.4034,skewY:28.0453,x:572.45,y:283.55,regX:24.4,scaleX:0.914,scaleY:1.0007}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.697,rotation:0,skewY:-135.3283,x:456.75,y:339.95,scaleX:0.8379,skewX:41.7101}},{t:this.instance_2,p:{regY:12.8,scaleY:0.709,skewX:-1.3603,skewY:-2.295,x:420.5,y:366.6,scaleX:0.8227,regX:22}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},9).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:28}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:103.9,regY:188.3,skewX:-8.0507,skewY:-5.6468,x:382.5,y:203.9,scaleX:0.1596,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.2,regY:32.9,rotation:0,x:497.55,y:353.75,scaleX:0.8212,scaleY:1.4263,skewX:-145.0229,skewY:-146.6666}},{t:this.instance_19,p:{regX:185,regY:78.7,scaleX:0.2888,scaleY:0.2888,rotation:-70.7502,x:561,y:152.55}},{t:this.instance_10,p:{regY:44.1,skewX:-164.9038,skewY:5.5429,x:562.15,y:237,regX:24.7,scaleX:0.9139,scaleY:1.3116}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9305,rotation:0,skewY:124.8308,x:456.65,y:331.55,scaleX:1.0431,skewX:148.4868}},{t:this.instance_2,p:{regY:12.6,scaleY:1.2024,skewX:156.949,skewY:-20.6514,x:417.1,y:284.4,scaleX:0.8232,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:29}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.1,regY:188.6,skewX:-10.2394,skewY:-7.8325,x:377.7,y:206.95,scaleX:0.1596,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0226,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9305,rotation:0,skewY:122.6406,x:456.6,y:331.6,scaleX:1.0431,skewX:146.2972}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:154.7592,skewY:-22.8414,x:415.4,y:286.05,scaleX:0.8232,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:31}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.4,regY:188.7,skewX:-6.5356,skewY:-4.1247,x:386.1,y:202.55,scaleX:0.1595,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:500.4,y:355.75,scaleX:0.8211,scaleY:1.4262,skewX:-151.4988,skewY:-153.1426}},{t:this.instance_19,p:{regX:185,regY:79,scaleX:0.2887,scaleY:0.2887,rotation:-77.2271,x:540.75,y:148.7}},{t:this.instance_10,p:{regY:44.1,skewX:-171.38,skewY:-0.9329,x:551.4,y:232.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9304,rotation:0,skewY:126.3443,x:456.75,y:332.05,scaleX:1.043,skewX:150.0014}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:158.463,skewY:-19.138,x:418.6,y:283.9,scaleX:0.8231,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:29}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.1,regY:188.6,skewX:-10.2394,skewY:-7.8325,x:377.7,y:206.95,scaleX:0.1596,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9305,rotation:0,skewY:122.6406,x:456.6,y:331.6,scaleX:1.0431,skewX:146.2972}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:154.7592,skewY:-22.8414,x:415.4,y:286.05,scaleX:0.8232,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:31}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.4,regY:188.7,skewX:-6.5356,skewY:-4.1247,x:386.1,y:202.55,scaleX:0.1595,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:500.4,y:355.75,scaleX:0.8211,scaleY:1.4262,skewX:-151.4988,skewY:-153.1426}},{t:this.instance_19,p:{regX:185,regY:79,scaleX:0.2887,scaleY:0.2887,rotation:-77.2271,x:540.75,y:148.7}},{t:this.instance_10,p:{regY:44.1,skewX:-171.3799,skewY:-0.9329,x:551.4,y:232.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9304,rotation:0,skewY:126.3443,x:456.75,y:332.05,scaleX:1.043,skewX:150.0014}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:158.463,skewY:-19.138,x:418.6,y:283.9,scaleX:0.8231,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:29}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.1,regY:188.6,skewX:-10.2394,skewY:-7.8325,x:377.7,y:206.95,scaleX:0.1596,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9305,rotation:0,skewY:122.6406,x:456.6,y:331.6,scaleX:1.0431,skewX:146.2972}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:154.7592,skewY:-22.8414,x:415.4,y:286.05,scaleX:0.8232,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:31}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.4,regY:188.7,skewX:-6.5356,skewY:-4.1247,x:386.1,y:202.55,scaleX:0.1595,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:500.4,y:355.75,scaleX:0.8211,scaleY:1.4262,skewX:-151.4988,skewY:-153.1426}},{t:this.instance_19,p:{regX:185,regY:79,scaleX:0.2887,scaleY:0.2887,rotation:-77.2271,x:540.75,y:148.7}},{t:this.instance_10,p:{regY:44.1,skewX:-171.3799,skewY:-0.9329,x:551.4,y:232.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9304,rotation:0,skewY:126.3443,x:456.75,y:332.05,scaleX:1.043,skewX:150.0014}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:158.463,skewY:-19.138,x:418.6,y:283.9,scaleX:0.8231,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:29}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.1,regY:188.6,skewX:-10.2394,skewY:-7.8325,x:377.7,y:206.95,scaleX:0.1596,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9305,rotation:0,skewY:122.6406,x:456.6,y:331.6,scaleX:1.0431,skewX:146.2972}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:154.7592,skewY:-22.8414,x:415.4,y:286.05,scaleX:0.8232,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:31}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.4,regY:188.7,skewX:-6.5356,skewY:-4.1247,x:386.1,y:202.55,scaleX:0.1595,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:500.4,y:355.75,scaleX:0.8211,scaleY:1.4262,skewX:-151.4988,skewY:-153.1426}},{t:this.instance_19,p:{regX:185,regY:79,scaleX:0.2887,scaleY:0.2887,rotation:-77.2271,x:540.75,y:148.7}},{t:this.instance_10,p:{regY:44.1,skewX:-171.3799,skewY:-0.9329,x:551.4,y:232.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9304,rotation:0,skewY:126.3443,x:456.75,y:332.05,scaleX:1.043,skewX:150.0014}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:158.463,skewY:-19.138,x:418.6,y:283.9,scaleX:0.8231,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},6).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:174.9,regY:321.6,scaleX:0.525,scaleY:0.525,rotation:-15.2355,x:486.35,y:310,startPosition:29}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.1,regY:188.6,skewX:-10.2394,skewY:-7.8325,x:377.7,y:206.95,scaleX:0.1596,scaleY:0.1744}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.4,scaleY:0.9305,rotation:0,skewY:122.6406,x:456.6,y:331.6,scaleX:1.0431,skewX:146.2972}},{t:this.instance_2,p:{regY:12.5,scaleY:1.2023,skewX:154.7592,skewY:-22.8414,x:415.4,y:286.05,scaleX:0.8232,regX:21.9}},{t:this.instance,p:{regX:235.6,regY:138.8,scaleX:0.0835,scaleY:0.1122,rotation:-22.1645,skewX:0,skewY:0,x:475.6,y:271.5,startPosition:3}}]},6).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175,regY:321.6,scaleX:0.5249,scaleY:0.5249,rotation:-21.9496,x:486.4,y:309.85,startPosition:11}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_20,p:{regX:104.8,regY:189.8,skewX:-25.2305,skewY:-22.8235,x:351.7,y:240.8,scaleX:0.1595,scaleY:0.1743}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:15.2,regY:26.1,scaleY:0.9303,rotation:0,skewY:107.642,x:460.25,y:340.8,scaleX:1.0429,skewX:131.3001}},{t:this.instance_2,p:{regY:12.2,scaleY:1.2021,skewX:139.7618,skewY:-37.8377,x:408.7,y:307.55,scaleX:0.823,regX:21.9}},{t:this.instance,p:{regX:235.5,regY:138.9,scaleX:0.0835,scaleY:0.1122,rotation:-28.8791,skewX:0,skewY:0,x:471.2,y:272.95,startPosition:3}}]},22).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175,regY:321.6,scaleX:0.5249,scaleY:0.5249,rotation:-21.9496,x:486.4,y:309.85,startPosition:13}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:235.1,regY:142.1,scaleX:0.0805,scaleY:0.1121,rotation:0,skewX:-13.8566,skewY:166.1298,x:464.75,y:273.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.1,regY:321.7,scaleX:0.5249,scaleY:0.5249,rotation:-17.9967,x:486.35,y:309.95,startPosition:24}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:235.3,regY:142.5,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:-9.8982,skewY:170.0821,x:467.25,y:271.85,startPosition:7}}]},11).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.1,regY:321.8,scaleX:0.5249,scaleY:0.5249,rotation:-2.9997,x:486.25,y:310.05,startPosition:25}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:235,regY:143.1,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:5.092,skewY:-174.9276,x:477.7,y:268.35,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.8,scaleX:0.5248,scaleY:0.5248,rotation:4.9554,x:486.2,y:310.1,startPosition:26}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.7,regY:142.9,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:13.0467,skewY:-166.9712,x:483.45,y:267.55,startPosition:7}}]},8).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.1,regY:321.8,scaleX:0.5249,scaleY:0.5249,rotation:-2.9997,x:486.25,y:310.05,startPosition:25}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:235,regY:143.1,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:5.092,skewY:-174.9276,x:477.7,y:268.35,startPosition:7}}]},5).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.8,scaleX:0.5248,scaleY:0.5248,rotation:4.9554,x:486.2,y:310.1,startPosition:26}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.7,regY:142.9,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:13.0467,skewY:-166.9712,x:483.45,y:267.55,startPosition:7}}]},5).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.1,regY:321.8,scaleX:0.5249,scaleY:0.5249,rotation:-2.9997,x:486.25,y:310.05,startPosition:25}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:27.1,regY:32.9,rotation:0,x:498.35,y:354.45,scaleX:0.8212,scaleY:1.4262,skewX:-147.0223,skewY:-148.6667}},{t:this.instance_19,p:{regX:185.1,regY:78.7,scaleX:0.2887,scaleY:0.2887,rotation:-72.7506,x:554.7,y:151.1}},{t:this.instance_10,p:{regY:44.1,skewX:-166.9038,skewY:3.5421,x:558.85,y:235.45,regX:24.8,scaleX:0.9138,scaleY:1.3115}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:235,regY:143.1,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:5.092,skewY:-174.9276,x:477.7,y:268.35,startPosition:7}}]},5).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.1,regY:321.8,scaleX:0.5249,scaleY:0.5249,rotation:-2.9997,x:486.25,y:310.05,startPosition:28}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.8,regY:32.8,rotation:0,x:491.1,y:346.15,scaleX:0.794,scaleY:1.3004,skewX:-121.1123,skewY:-129.7902}},{t:this.instance_19,p:{regX:185,regY:79.1,scaleX:0.2887,scaleY:0.2887,rotation:-56.236,x:601.5,y:195.85}},{t:this.instance_10,p:{regY:44,skewX:-148.5485,skewY:19.6067,x:583.05,y:270.1,regX:24.9,scaleX:0.9132,scaleY:1.1529}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:235,regY:143.1,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:5.092,skewY:-174.9276,x:477.7,y:268.35,startPosition:7}}]},3).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-12.2195,x:486.35,y:310.05,startPosition:30}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.7,regY:32.9,rotation:0,x:488.35,y:340.15,scaleX:0.7939,scaleY:1.1855,skewX:-108.632,skewY:-117.3097}},{t:this.instance_19,p:{regX:185.1,regY:79.3,scaleX:0.2886,scaleY:0.2886,rotation:-43.7554,x:612.1,y:230.55}},{t:this.instance_10,p:{regY:43.8,skewX:-136.0693,skewY:32.0862,x:578.05,y:294.4,regX:21.8,scaleX:0.9129,scaleY:1.0216}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.5,regY:143.1,scaleX:0.0804,scaleY:0.1121,rotation:0,skewX:-4.1229,skewY:175.854,x:471.15,y:270.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:31}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.7,regY:32.9,rotation:0,x:488.35,y:340.15,scaleX:0.7939,scaleY:1.1855,skewX:-108.632,skewY:-117.3097}},{t:this.instance_19,p:{regX:185.1,regY:79.3,scaleX:0.2886,scaleY:0.2886,rotation:-43.7554,x:612.1,y:230.55}},{t:this.instance_10,p:{regY:43.8,skewX:-136.0693,skewY:32.0862,x:578.05,y:294.4,regX:21.8,scaleX:0.9129,scaleY:1.0216}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:34}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.7,regY:32.9,rotation:0,x:487.2,y:336.5,scaleX:0.7938,scaleY:1.1854,skewX:-101.1445,skewY:-109.8219}},{t:this.instance_19,p:{regX:185,regY:79.7,scaleX:0.2885,scaleY:0.2885,rotation:-46.6757,x:609.9,y:233.6}},{t:this.instance_10,p:{regY:43.7,skewX:-138.9895,skewY:29.1656,x:579.25,y:299.1,regX:22,scaleX:0.9128,scaleY:1.0214}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},3).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:36}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:32.9,rotation:0,x:487.7,y:338.55,scaleX:0.7938,scaleY:1.1853,skewX:-105.3884,skewY:-114.0659}},{t:this.instance_19,p:{regX:185,regY:80,scaleX:0.2885,scaleY:0.2885,rotation:-50.9204,x:602.4,y:226.8}},{t:this.instance_10,p:{regY:43.6,skewX:-143.2337,skewY:24.9207,x:576.65,y:294.5,regX:22.1,scaleX:0.9127,scaleY:1.0213}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:38}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:32.9,rotation:0,x:489.3,y:343.4,scaleX:0.7937,scaleY:1.1852,skewX:-115.6166,skewY:-124.2944}},{t:this.instance_19,p:{regX:184.8,regY:80,scaleX:0.2885,scaleY:0.2885,rotation:-61.1506,x:582.3,y:213.1}},{t:this.instance_10,p:{regY:43.7,skewX:-153.4621,skewY:14.6914,x:569.05,y:284.1,regX:22.1,scaleX:0.9127,scaleY:1.0212}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:0}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:32.9,rotation:0,x:489.3,y:343.4,scaleX:0.7937,scaleY:1.1852,skewX:-115.6166,skewY:-124.2944}},{t:this.instance_19,p:{regX:184.8,regY:80,scaleX:0.2885,scaleY:0.2885,rotation:-61.1506,x:582.3,y:213.1}},{t:this.instance_10,p:{regY:43.7,skewX:-153.4621,skewY:14.6914,x:569.05,y:284.1,regX:22.1,scaleX:0.9127,scaleY:1.0212}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:2}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.4,regY:33,rotation:0,x:487.1,y:344.1,scaleX:0.7936,scaleY:1.437,skewX:-115.6165,skewY:-124.2926}},{t:this.instance_19,p:{regX:184.4,regY:75.4,scaleX:0.2884,scaleY:0.2884,rotation:-61.153,x:597,y:184.65}},{t:this.instance_10,p:{regY:43.5,skewX:-153.4625,skewY:14.6906,x:583.1,y:265.25,regX:22.3,scaleX:0.9125,scaleY:1.3789}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:3}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.2,regY:33,rotation:0,x:496.15,y:340.85,scaleX:0.7934,scaleY:1.6079,skewX:-122.3167,skewY:-130.9918}},{t:this.instance_21,p:{regX:184.9,regY:76.4,scaleX:0.2882,scaleY:0.2882,rotation:-0.276,x:636.15,y:90.65}},{t:this.instance_10,p:{regY:43.2,skewX:-160.1636,skewY:7.9894,x:595.9,y:230.35,regX:22.4,scaleX:0.9122,scaleY:1.9434}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:4}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.8,regY:33,rotation:0,x:486.95,y:359.5,scaleX:0.7931,scaleY:2.1296,skewX:-131.282,skewY:-139.9584}},{t:this.instance_21,p:{regX:185,regY:77.1,scaleX:0.2881,scaleY:0.2881,rotation:-1.994,x:634.85,y:39.45}},{t:this.instance_10,p:{regY:9,skewX:-166.5904,skewY:1.5592,x:579.9,y:265.7,regX:17.2,scaleX:0.9118,scaleY:2.1455}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:5}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.3,regY:33,rotation:0,x:495.05,y:349.9,scaleX:0.9745,scaleY:2.2584,skewX:-134.2322,skewY:-142.9085}},{t:this.instance_21,p:{regX:185.1,regY:77.2,scaleX:0.2881,scaleY:0.2881,rotation:-1.9823,x:638.5,y:-10.65}},{t:this.instance_10,p:{regY:8.7,skewX:-169.5423,skewY:-1.3916,x:585.55,y:254.6,regX:17.8,scaleX:1.0474,scaleY:2.6134}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:6}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.3,regY:33,rotation:0,x:495.05,y:349.9,scaleX:0.9745,scaleY:2.2584,skewX:-134.2322,skewY:-142.9085}},{t:this.instance_14,p:{regX:184.6,regY:77.8,scaleX:0.2113,scaleY:0.2113,rotation:-84.9502,x:612.5,y:38.55,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:8.7,skewX:-169.5423,skewY:-1.3916,x:585.55,y:254.6,regX:17.8,scaleX:1.0474,scaleY:2.6134}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:5}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.3,regY:33,rotation:0,x:495.05,y:349.9,scaleX:0.9745,scaleY:2.2584,skewX:-134.2322,skewY:-142.9085}},{t:this.instance_14,p:{regX:184,regY:77.4,scaleX:0.1869,scaleY:0.1869,rotation:-106.9641,x:606,y:44.55,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:8.7,skewX:-169.5423,skewY:-1.3916,x:585.55,y:254.6,regX:17.8,scaleX:1.0474,scaleY:2.6134}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},7).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:4}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.8,regY:33,rotation:0,x:486.95,y:359.5,scaleX:0.7931,scaleY:2.1296,skewX:-131.282,skewY:-139.9584}},{t:this.instance_14,p:{regX:183.7,regY:77.7,scaleX:0.1973,scaleY:0.1973,rotation:-102.9571,x:603.4,y:87.9,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:9,skewX:-166.5904,skewY:1.5592,x:579.9,y:265.7,regX:17.2,scaleX:0.9118,scaleY:2.1455}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},4).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:3}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.2,regY:33,rotation:0,x:496.15,y:340.85,scaleX:0.7934,scaleY:1.6079,skewX:-122.3167,skewY:-130.9918}},{t:this.instance_14,p:{regX:184.4,regY:76.5,scaleX:0.1747,scaleY:0.1747,rotation:-105.267,x:609.85,y:137.75,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.2,skewX:-160.1636,skewY:7.9894,x:595.9,y:230.35,regX:22.4,scaleX:0.9122,scaleY:1.9434}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:2}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.4,regY:33,rotation:0,x:487.1,y:344.1,scaleX:0.7936,scaleY:1.437,skewX:-115.6165,skewY:-124.2926}},{t:this.instance_14,p:{regX:183.6,regY:75.9,scaleX:0.1731,scaleY:0.1731,rotation:-97.6173,x:594.3,y:197.2,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.5,skewX:-153.4625,skewY:14.6906,x:583.1,y:265.25,regX:22.3,scaleX:0.9125,scaleY:1.3789}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:0}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:32.9,rotation:0,x:489.3,y:343.4,scaleX:0.7937,scaleY:1.1852,skewX:-115.6166,skewY:-124.2944}},{t:this.instance_14,p:{regX:184.1,regY:80.5,scaleX:0.1667,scaleY:0.1667,rotation:-91.1379,x:579.8,y:225.6,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.7,skewX:-153.4621,skewY:14.6914,x:569.05,y:284.1,regX:22.1,scaleX:0.9127,scaleY:1.0212}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:36}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:32.9,rotation:0,x:487.7,y:338.55,scaleX:0.7938,scaleY:1.1853,skewX:-105.3884,skewY:-114.0659}},{t:this.instance_14,p:{regX:184.2,regY:80,scaleX:0.1767,scaleY:0.1767,rotation:-80.916,x:598,y:240.25,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.6,skewX:-143.2337,skewY:24.9207,x:576.65,y:294.5,regX:22.1,scaleX:0.9127,scaleY:1.0213}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:37}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:33.1,rotation:0,x:519.45,y:337.3,scaleX:0.6665,scaleY:0.9971,skewX:-21.902,skewY:-30.5815}},{t:this.instance_14,p:{regX:183.9,regY:81.2,scaleX:0.1188,scaleY:0.1188,rotation:2.5471,x:610.8,y:410.05,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.7,skewX:-59.7503,skewY:108.4028,x:564.1,y:401.3,regX:22.2,scaleX:0.8167,scaleY:0.8899}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.2,regY:321.9,scaleX:0.5248,scaleY:0.5248,rotation:-15.9365,x:486.4,y:310,startPosition:38}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:33.1,rotation:0,x:519.45,y:337.3,scaleX:0.6665,scaleY:0.9971,skewX:-21.902,skewY:-30.5815}},{t:this.instance_14,p:{regX:184.2,regY:81.3,scaleX:0.1188,scaleY:0.1188,rotation:17.5389,x:602.5,y:426.8,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.8,skewX:-44.7527,skewY:123.3994,x:559.6,y:406.35,regX:22.2,scaleX:0.8166,scaleY:0.8899}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:234.6,regY:143,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-7.8355,skewY:172.1452,x:468.6,y:271.15,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.3,regY:322,scaleX:0.5247,scaleY:0.5247,rotation:-6.4581,x:486.3,y:310.1,startPosition:13}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.6,regY:33.1,rotation:0,x:519.45,y:337.3,scaleX:0.6665,scaleY:0.9971,skewX:-21.902,skewY:-30.5815}},{t:this.instance_14,p:{regX:184.2,regY:81.3,scaleX:0.1188,scaleY:0.1188,rotation:17.5389,x:602.5,y:426.8,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.8,skewX:-44.7527,skewY:123.3994,x:559.6,y:406.35,regX:22.2,scaleX:0.8166,scaleY:0.8899}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.8,regY:143.2,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:1.639,skewY:-178.3793,x:475.15,y:268.85,startPosition:7}}]},15).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.3,regY:322,scaleX:0.5247,scaleY:0.5247,rotation:-6.4581,x:486.3,y:310.1,startPosition:20}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.5,regY:33.1,rotation:0,x:520.4,y:336.7,scaleX:0.6664,scaleY:0.997,skewX:-28.8522,skewY:-37.5319}},{t:this.instance_14,p:{regX:184.8,regY:81.5,scaleX:0.1188,scaleY:0.1188,rotation:10.5866,x:613.65,y:415.5,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.8,skewX:-51.7031,skewY:116.4492,x:568.65,y:400.35,regX:22.2,scaleX:0.8166,scaleY:0.8898}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.8,regY:143.2,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:1.639,skewY:-178.3793,x:475.15,y:268.85,startPosition:7}}]},6).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.3,regY:322,scaleX:0.5247,scaleY:0.5247,rotation:-6.4581,x:486.3,y:310.1,startPosition:21}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.4,regY:33.2,rotation:0,x:520.65,y:336.45,scaleX:0.6664,scaleY:0.997,skewX:-32.805,skewY:-41.4846}},{t:this.instance_14,p:{regX:185,regY:81.9,scaleX:0.1187,scaleY:0.1187,rotation:6.6337,x:619.15,y:408.55,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.8,skewX:-55.655,skewY:112.4963,x:573.1,y:396.55,regX:22.3,scaleX:0.8165,scaleY:0.8897}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.8,regY:143.2,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:1.639,skewY:-178.3793,x:475.15,y:268.85,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.3,regY:322,scaleX:0.5247,scaleY:0.5247,rotation:-6.4581,x:486.3,y:310.1,startPosition:23}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.3,regY:33.4,rotation:0,x:514,y:329.45,scaleX:0.7522,scaleY:0.9968,skewX:-62.8038,skewY:-71.4831}},{t:this.instance_14,p:{regX:185,regY:82.7,scaleX:0.1187,scaleY:0.1187,rotation:-23.362,x:635.35,y:342.5,skewX:0,skewY:0}},{t:this.instance_10,p:{regY:43.9,skewX:-85.6552,skewY:82.4988,x:589.5,y:355.2,regX:22.4,scaleX:0.8165,scaleY:0.8896}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.8,regY:143.2,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:1.639,skewY:-178.3793,x:475.15,y:268.85,startPosition:7}}]},2).to({state:[{t:this.instance_13,p:{x:486.35,regX:17.8,regY:25.9,scaleX:0.8219,scaleY:0.8219,y:309.95,skewX:0,skewY:180}},{t:this.instance_1,p:{regX:175.3,regY:322,scaleX:0.5247,scaleY:0.5247,rotation:-6.4581,x:486.3,y:310.1,startPosition:24}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:26.2,regY:33.5,rotation:0,x:509.15,y:332.65,scaleX:0.7581,scaleY:1.0567,skewX:-126.4543,skewY:-132.1764}},{t:this.instance_14,p:{regX:183.5,regY:83.2,scaleX:0.1263,scaleY:0.1201,rotation:0,x:576.55,y:213.85,skewX:-95.1384,skewY:-92.0985}},{t:this.instance_10,p:{regY:43.8,skewX:-156.1857,skewY:11.7161,x:571.85,y:264.6,regX:22.6,scaleX:0.8173,scaleY:0.9564}},{t:this.instance_4,p:{x:488.65,regX:44.1,regY:75.6,scaleX:0.8219,scaleY:0.8219,skewX:0,skewY:180,y:379.55}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-138.6916,x:456.4,y:343.7,scaleX:0.9857,skewX:20.4608}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:412.4,y:464.1,scaleX:0.1281,rotation:0}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:12.0054,skewY:6.1275,x:427.85,y:388.55,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.8,regY:143.2,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:1.639,skewY:-178.3793,x:475.15,y:268.85,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:480.15,regX:17.8,regY:26,scaleX:0.8219,scaleY:0.8219,y:310.6,skewX:-2.739,skewY:177.261}},{t:this.instance_1,p:{regX:175.4,regY:322.1,scaleX:0.5247,scaleY:0.5247,rotation:-9.1969,x:480.1,y:310.75,startPosition:25}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.9,regY:33.4,rotation:0,x:501.15,y:342.35,scaleX:0.8249,scaleY:1.1175,skewX:-149.8287,skewY:-147.4118}},{t:this.instance_14,p:{regX:181.6,regY:83.5,scaleX:0.1457,scaleY:0.1201,rotation:0,x:508.25,y:197.1,skewX:-120.7365,skewY:-119.0085}},{t:this.instance_10,p:{regY:43.5,skewX:174.1117,skewY:-11.5551,x:530.7,y:251.1,regX:22.8,scaleX:0.8329,scaleY:1.0654}},{t:this.instance_4,p:{x:485.75,regX:44.1,regY:75.7,scaleX:0.8219,scaleY:0.8219,skewX:-2.739,skewY:177.261,y:380}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-141.4311,x:451.8,y:345.7,scaleX:0.9856,skewX:17.7211}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:413.65,y:468.05,scaleX:0.1281,rotation:-2.738}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:9.2654,skewY:3.3877,x:425.4,y:391.8,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.5,regY:143.7,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-1.0927,skewY:178.8903,x:467,y:270.05,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:480.15,regX:17.8,regY:26,scaleX:0.8219,scaleY:0.8219,y:310.6,skewX:-2.739,skewY:177.261}},{t:this.instance_1,p:{regX:175.4,regY:322.1,scaleX:0.5247,scaleY:0.5247,rotation:-9.1969,x:480.1,y:310.75,startPosition:26}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.8,regY:33.4,rotation:0,x:496.8,y:334.9,scaleX:0.8248,scaleY:1.1174,skewX:-119.8294,skewY:-117.4131}},{t:this.instance_22,p:{regX:86.2,regY:290.8,skewX:-15.726,skewY:-14.0127,x:597.4,y:229.2,scaleX:0.243,scaleY:0.2003}},{t:this.instance_10,p:{regY:43.5,skewX:-155.8899,skewY:18.4436,x:568,y:270.65,regX:22.9,scaleX:0.8329,scaleY:1.0653}},{t:this.instance_4,p:{x:485.75,regX:44.1,regY:75.7,scaleX:0.8219,scaleY:0.8219,skewX:-2.739,skewY:177.261,y:380}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-141.4311,x:451.8,y:345.7,scaleX:0.9856,skewX:17.7211}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:413.65,y:468.05,scaleX:0.1281,rotation:-2.738}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:9.2654,skewY:3.3877,x:425.4,y:391.8,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.5,regY:143.7,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-1.0927,skewY:178.8903,x:467,y:270.05,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:480.15,regX:17.8,regY:26,scaleX:0.8219,scaleY:0.8219,y:310.6,skewX:-2.739,skewY:177.261}},{t:this.instance_1,p:{regX:175.4,regY:322.1,scaleX:0.5247,scaleY:0.5247,rotation:-9.1969,x:480.1,y:310.75,startPosition:27}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.8,regY:33.5,rotation:0,x:496.45,y:334.25,scaleX:0.8248,scaleY:1.1173,skewX:-116.3635,skewY:-113.9469}},{t:this.instance_22,p:{regX:86.7,regY:291.2,skewX:-6.5711,skewY:-4.8566,x:609.75,y:240.45,scaleX:0.243,scaleY:0.2003}},{t:this.instance_10,p:{regY:43.4,skewX:-146.7361,skewY:27.5971,x:574,y:276.7,regX:23,scaleX:0.8328,scaleY:1.0652}},{t:this.instance_4,p:{x:485.75,regX:44.1,regY:75.7,scaleX:0.8219,scaleY:0.8219,skewX:-2.739,skewY:177.261,y:380}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-141.4311,x:451.8,y:345.7,scaleX:0.9856,skewX:17.7211}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:413.65,y:468.05,scaleX:0.1281,rotation:-2.738}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:9.2654,skewY:3.3877,x:425.4,y:391.8,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.5,regY:143.7,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-1.0927,skewY:178.8903,x:467,y:270.05,startPosition:7}}]},1).to({state:[{t:this.instance_13,p:{x:480.15,regX:17.8,regY:26,scaleX:0.8219,scaleY:0.8219,y:310.6,skewX:-2.739,skewY:177.261}},{t:this.instance_1,p:{regX:175.4,regY:322.1,scaleX:0.5247,scaleY:0.5247,rotation:-9.1969,x:480.1,y:310.75,startPosition:28}},{t:this.instance_9,p:{x:531.85}},{t:this.instance_8,p:{x:505.35}},{t:this.instance_7,p:{x:467.35}},{t:this.instance_5,p:{x:479.1}},{t:this.instance_12,p:{regX:25.8,regY:33.5,rotation:0,x:496.45,y:334.25,scaleX:0.8248,scaleY:1.1173,skewX:-116.3635,skewY:-113.9469}},{t:this.instance_22,p:{regX:87.6,regY:292.4,skewX:-2.0749,skewY:-0.3636,x:609.75,y:247.65,scaleX:0.2429,scaleY:0.2002}},{t:this.instance_10,p:{regY:43.3,skewX:-142.2604,skewY:32.0723,x:575.8,y:278.6,regX:23.1,scaleX:0.8327,scaleY:1.0651}},{t:this.instance_4,p:{x:485.75,regX:44.1,regY:75.7,scaleX:0.8219,scaleY:0.8219,skewX:-2.739,skewY:177.261,y:380}},{t:this.instance_3,p:{regX:14.8,regY:26,scaleY:0.8075,rotation:0,skewY:-141.4311,x:451.8,y:345.7,scaleX:0.9856,skewX:17.7211}},{t:this.instance_6,p:{regX:103.5,regY:188.2,scaleY:0.1281,skewX:0,skewY:0,x:413.65,y:468.05,scaleX:0.1281,rotation:-2.738}},{t:this.instance_2,p:{regY:12.6,scaleY:0.9327,skewX:9.2654,skewY:3.3877,x:425.4,y:391.8,scaleX:0.8044,regX:22.6}},{t:this.instance,p:{regX:233.5,regY:143.7,scaleX:0.0804,scaleY:0.112,rotation:0,skewX:-1.0927,skewY:178.8903,x:467,y:270.05,startPosition:7}}]},1).wait(39));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Character1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Character1
	this.instance = new lib.mouth("single",7);
	this.instance.setTransform(856.6,357.6,0.1823,0.1883,14.9766,0,0,231.5,130.8);

	this.instance_1 = new lib.head1("synched",0);
	this.instance_1.setTransform(887.2,408.85,0.5343,0.5343,14.9994,0,0,236,393.4);

	this.instance_2 = new lib.down_arm("synched",0);
	this.instance_2.setTransform(947.8,393.25,0.7437,0.7437,0,0,0,19.1,11.8);

	this.instance_3 = new lib.hand1("synched",0);
	this.instance_3.setTransform(950.85,440.5,0.1302,0.1302,0,0,180,102.1,81);

	this.instance_4 = new lib.up_arm("synched",0);
	this.instance_4.setTransform(940.7,342.65,0.7734,0.7734,0,0,0,20.9,27.1);

	this.instance_5 = new lib.foot("synched",0);
	this.instance_5.setTransform(869.85,547.1,1,1,0,0,0,22.8,5.8);

	this.instance_6 = new lib.foot("synched",0);
	this.instance_6.setTransform(918.85,548.1,1,1,0,0,0,22.8,5.8);

	this.instance_7 = new lib.body("synched",0);
	this.instance_7.setTransform(900,445.9,0.8109,0.8109,0,0,0,39.6,149.9);

	this.instance_8 = new lib.up_leg("synched",0);
	this.instance_8.setTransform(920,452.35,0.8951,0.8951,0,0,0,34.5,7);

	this.instance_9 = new lib.down_leg("synched",0);
	this.instance_9.setTransform(918.85,507.85,1,1,0,0,0,13.6,-2.1);

	this.instance_10 = new lib.up_leg("synched",0);
	this.instance_10.setTransform(874.4,448,0.8951,0.8951,0,0,180,34,5);

	this.instance_11 = new lib.down_arm("synched",0);
	this.instance_11.setTransform(866.7,383.85,0.7437,0.7437,0,23.2505,-156.7495,21.6,6.2);

	this.instance_12 = new lib.hand8("synched",0);
	this.instance_12.setTransform(845.65,446.85,0.1302,0.1302,0,0,180,102.1,186.6);

	this.instance_13 = new lib.up_arm("synched",0);
	this.instance_13.setTransform(876.25,338.6,0.7734,0.7734,0,6.7812,-173.2188,26.1,27.9);

	this.instance_14 = new lib.down_leg("synched",0);
	this.instance_14.setTransform(875.1,505.8,1,1,0,0,180,13.6,-0.1);

	this.instance_15 = new lib.neck("synched",0);
	this.instance_15.setTransform(906.5,322.2,0.7086,0.7086,0,0,0,17.9,38.6);

	this.instance_16 = new lib.hand9("synched",0);
	this.instance_16.setTransform(801.5,390.25,0.1302,0.1302,0,42.1454,-137.8546,101.8,186.8);

	this.instance_17 = new lib.hand10("synched",0);
	this.instance_17.setTransform(801.5,390.25,0.1302,0.1302,0,42.1454,-137.8546,101.8,186.8);

	this.instance_18 = new lib.CachedBmp_1();
	this.instance_18.setTransform(914.55,206.6,0.5,0.5);

	this.instance_19 = new lib.hand5("synched",0);
	this.instance_19.setTransform(805,390.2,0.1302,0.1302,-72.1469,0,0,101.7,186.7);

	this.instance_20 = new lib.eye2("synched",0);
	this.instance_20.setTransform(493.3,231.7,0.3677,0.3677,-0.019,0,0,31.6,30.4);

	this.instance_21 = new lib.eye2("synched",0);
	this.instance_21.setTransform(457.5,234,0.3679,0.3679,0,-14.9833,165.0167,31,29.6);

	this.instance_22 = new lib.eye2("synched",0);
	this.instance_22.setTransform(752.6,237.2,0.3677,0.3677,29.9785,0,0,35,29);

	this.instance_23 = new lib.eye2("synched",0);
	this.instance_23.setTransform(718.05,231.25,0.3679,0.3679,0,-14.9867,165.0133,31.2,29.2);

	this.instance_24 = new lib.head11("synched",0);
	this.instance_24.setTransform(749.9,300.85,0.4302,0.4302,14.9969,0,0,235.9,393.3);

	this.instance_25 = new lib.eyebrows("synched",0);
	this.instance_25.setTransform(705.35,223.8,0.3372,0.3372,0,28.7282,-151.2718,16.6,17.2);

	this.instance_26 = new lib.eyebrows("synched",0);
	this.instance_26.setTransform(745.65,228.55,0.3372,0.3372,1.2731,0,0,17.8,16.9);

	this.instance_27 = new lib.eye2_stati("synched",0);
	this.instance_27.setTransform(712.2,235.9,0.3675,0.3675,19.2611,0,0,36.5,29.8);

	this.instance_28 = new lib.eye2_stati("synched",0);
	this.instance_28.setTransform(740.7,238.15,0.3675,0.3675,19.2669,0,0,35.8,29.4);

	this.instance_29 = new lib.hand4("synched",0);
	this.instance_29.setTransform(687.75,280.5,0.212,0.1702,0,7.9972,10.2801,95.9,8.2);

	this.instance_30 = new lib.hand3("synched",0);
	this.instance_30.setTransform(596.95,314.9,0.1919,0.1854,0,-70.9999,-72.9455,95.9,320.3);

	this.instance_31 = new lib.hand6("synched",0);
	this.instance_31.setTransform(621.9,331.55,0.1866,0.157,0,7.9741,6.0877,252.8,179.5);

	this.instance_32 = new lib.hand5("synched",0);
	this.instance_32.setTransform(665.4,232.75,0.1634,0.1374,0,-5.4687,-7.352,139.2,289.7);

	this.instance_33 = new lib.hand7("synched",0);
	this.instance_33.setTransform(612.7,207.8,0.2435,0.2132,0,16.7864,-165.5641,217.1,186.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1,p:{regX:236,regY:393.4,scaleX:0.5343,scaleY:0.5343,rotation:14.9994,x:887.2,y:408.85,startPosition:0}},{t:this.instance,p:{regX:231.5,regY:130.8,scaleX:0.1823,scaleY:0.1883,rotation:14.9766,skewX:0,skewY:0,x:856.6,y:357.6,startPosition:7}}]}).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.8,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:0,x:909.85,y:300.8,startPosition:1}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_12,p:{regX:102.1,regY:186.6,skewX:0,skewY:180,x:845.65,y:446.85}},{t:this.instance_11,p:{skewX:23.2505,skewY:-156.7495,regY:6.2,scaleX:0.7437,scaleY:0.7437,x:866.7,y:383.85,regX:21.6}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.9,regY:129.8,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,startPosition:0}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.8,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:0,x:909.85,y:300.8,startPosition:2}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_12,p:{regX:102.5,regY:186.5,skewX:-9.747,skewY:170.253,x:835.3,y:442.4}},{t:this.instance_11,p:{skewX:32.9975,skewY:-147.0025,regY:6.2,scaleX:0.7437,scaleY:0.7437,x:866.7,y:383.85,regX:21.6}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.9,regY:129.8,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,startPosition:0}}]},2).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.8,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:0,x:909.85,y:300.8,startPosition:3}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_12,p:{regX:102.5,regY:186.7,skewX:11.9972,skewY:-168.0028,x:816.35,y:426.15}},{t:this.instance_11,p:{skewX:54.7407,skewY:-125.2593,regY:6.1,scaleX:0.7436,scaleY:0.7436,x:867.25,y:383.3,regX:21.6}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.9,regY:129.8,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,startPosition:0}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.8,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:0,x:909.85,y:300.8,startPosition:4}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_16},{t:this.instance_11,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.9,regY:129.8,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,startPosition:0}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.8,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:0,x:909.85,y:300.8,startPosition:5}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17,p:{regX:101.8,regY:186.8,scaleX:0.1302,scaleY:0.1302,skewX:42.1454,skewY:-137.8546,x:801.5,y:390.25}},{t:this.instance_11,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.9,regY:129.8,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,startPosition:0}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.8,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:0,x:909.85,y:300.8,startPosition:9}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17,p:{regX:101.8,regY:186.8,scaleX:0.1302,scaleY:0.1302,skewX:42.1454,skewY:-137.8546,x:801.5,y:390.25}},{t:this.instance_11,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.9,regY:129.8,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,startPosition:1}}]},4).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.9,regY:393.3,scaleX:0.4302,scaleY:0.4302,rotation:2.9681,x:909.9,y:300.9,startPosition:33}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17,p:{regX:101.8,regY:186.8,scaleX:0.1302,scaleY:0.1302,skewX:42.1454,skewY:-137.8546,x:801.5,y:390.25}},{t:this.instance_11,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:230.7,regY:130.1,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:17.9493,skewY:-162.0436,x:868,y:272.5,startPosition:1}}]},24).to({state:[{t:this.instance_18},{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.9,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:909.95,y:300.8,startPosition:33}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17,p:{regX:101.8,regY:186.8,scaleX:0.1302,scaleY:0.1302,skewX:42.1454,skewY:-137.8546,x:801.5,y:390.25}},{t:this.instance_11,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:231.2,regY:129.9,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:29.985,skewY:-150.0115,x:874.8,y:264.35,startPosition:4}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.9,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:909.95,y:300.8,startPosition:36}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_13,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.7,rotation:-72.1469,x:805,y:390.2,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_11,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_3,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{regX:231.2,regY:129.9,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:29.985,skewY:-150.0115,x:874.8,y:264.35,startPosition:4}}]},2).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:117.7547,skewY:-62.2453,x:887.85,y:342.95,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.9,rotation:38.8192,x:865.15,y:257.85,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_11,p:{skewX:-164.1336,skewY:15.8664,regY:6,scaleX:0.7436,scaleY:0.7436,x:851.1,y:321,regX:21.7}},{t:this.instance_15,p:{x:906.5}},{t:this.instance_1,p:{regX:235.9,regY:393.2,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:909.95,y:300.8,startPosition:39}},{t:this.instance_14,p:{x:875.1}},{t:this.instance_10,p:{x:874.4}},{t:this.instance_9,p:{x:918.85}},{t:this.instance_8,p:{x:920}},{t:this.instance_7,p:{x:900,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:918.85}},{t:this.instance_5,p:{x:869.85}},{t:this.instance_4,p:{regX:21,regY:27,scaleY:0.669,skewX:-165.0015,skewY:14.9991,x:937.7,y:342.3,scaleX:0.7734}},{t:this.instance_3,p:{regX:101.9,regY:80.2,scaleY:0.1126,rotation:165.0036,skewY:0,x:948.25,y:261.55,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.2,regY:11.7,scaleY:0.6433,skewX:165.0019,skewY:-14.9986,x:955.85,y:301.8,scaleX:0.7437}},{t:this.instance,p:{regX:231.2,regY:129.9,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:29.985,skewY:-150.0115,x:874.8,y:264.35,startPosition:4}}]},3).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:117.7547,skewY:-62.2453,x:727.85,y:342.95,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.9,rotation:38.8192,x:705.15,y:257.85,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_11,p:{skewX:-164.1336,skewY:15.8664,regY:6,scaleX:0.7436,scaleY:0.7436,x:691.1,y:321,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:235.9,regY:393.3,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:749.9,y:300.85}},{t:this.instance_23,p:{startPosition:0}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:21,regY:27,scaleY:0.669,skewX:-165.0015,skewY:14.9991,x:777.7,y:342.3,scaleX:0.7734}},{t:this.instance_3,p:{regX:101.9,regY:80.2,scaleY:0.1126,rotation:165.0036,skewY:0,x:788.25,y:261.55,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.2,regY:11.7,scaleY:0.6433,skewX:165.0019,skewY:-14.9986,x:795.85,y:301.8,scaleX:0.7437}},{t:this.instance,p:{regX:231.2,regY:129.9,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:29.985,skewY:-150.0115,x:714.8,y:264.35,startPosition:4}},{t:this.instance_22,p:{startPosition:0}},{t:this.instance_21,p:{startPosition:0}},{t:this.instance_20,p:{startPosition:0}}]},29).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:117.7547,skewY:-62.2453,x:727.85,y:342.95,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.9,rotation:38.8192,x:705.15,y:257.85,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_11,p:{skewX:-164.1336,skewY:15.8664,regY:6,scaleX:0.7436,scaleY:0.7436,x:691.1,y:321,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:235.9,regY:393.3,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:749.9,y:300.85}},{t:this.instance_23,p:{startPosition:5}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:21,regY:27,scaleY:0.669,skewX:-165.0015,skewY:14.9991,x:777.7,y:342.3,scaleX:0.7734}},{t:this.instance_3,p:{regX:101.9,regY:80.2,scaleY:0.1126,rotation:165.0036,skewY:0,x:788.25,y:261.55,scaleX:0.1302,skewX:0}},{t:this.instance_2,p:{regX:19.2,regY:11.7,scaleY:0.6433,skewX:165.0019,skewY:-14.9986,x:795.85,y:301.8,scaleX:0.7437}},{t:this.instance,p:{regX:231.3,regY:130.2,scaleX:0.1144,scaleY:0.1486,rotation:0,skewX:-0.0118,skewY:179.9924,x:714.75,y:264.3,startPosition:9}},{t:this.instance_22,p:{startPosition:5}},{t:this.instance_21,p:{startPosition:5}},{t:this.instance_20,p:{startPosition:5}}]},41).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_2,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:3}},{t:this.instance_20,p:{startPosition:3}},{t:this.instance_27},{t:this.instance_26,p:{regX:17.8,regY:16.9,rotation:1.2731,x:745.65,y:228.55,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.6,regY:17.2,y:223.8,scaleX:0.3372,scaleY:0.3372,skewX:28.7282,skewY:-151.2718,x:705.35}}]},21).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_2,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:5}},{t:this.instance_20,p:{startPosition:5}},{t:this.instance_27},{t:this.instance_26,p:{regX:17.9,regY:17.1,rotation:1.2706,x:747.05,y:228.55,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.4,regY:17.3,y:222.9,scaleX:0.3372,scaleY:0.3372,skewX:28.7282,skewY:-151.2718,x:705.35}}]},2).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_2,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:7}},{t:this.instance_20,p:{startPosition:7}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.1,regY:17.2,rotation:1.268,x:748.5,y:227.05,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.2,regY:17.4,y:221.85,scaleX:0.3371,scaleY:0.3371,skewX:28.7262,skewY:-151.2738,x:705.35}}]},2).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_2,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:1}},{t:this.instance_20,p:{startPosition:1}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.2,regY:17.4,rotation:1.2655,x:749.5,y:227.05,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.2,regY:17.4,y:221.85,scaleX:0.3371,scaleY:0.3371,skewX:28.7262,skewY:-151.2738,x:705.35}}]},2).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_2,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:3}},{t:this.instance_20,p:{startPosition:3}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.4,regY:17.6,rotation:1.2629,x:751.05,y:224.95,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16,regY:17.4,y:219.7,scaleX:0.3371,scaleY:0.3371,skewX:28.7251,skewY:-151.2749,x:704.05}}]},2).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_2,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:5}},{t:this.instance_20,p:{startPosition:5}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},2).to({state:[{t:this.instance_13,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_11,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.4,scaleX:0.2119,skewX:-82.0072,skewY:-79.7232,x:716.65,y:431.6}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5949,skewX:52.1486,skewY:49.8662,x:788.55,y:379.1,scaleX:0.7373}},{t:this.instance,p:{regX:265,regY:149.2,scaleX:0.1341,scaleY:0.1746,rotation:0,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,startPosition:10}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},28).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:91.6951,skewY:-107.5822,x:740,y:338.35,regX:26.1,scaleX:1.1202,scaleY:1.0472}},{t:this.instance_30,p:{regX:95.9,regY:320.3,skewX:-70.9999,skewY:-72.9455,x:596.95,y:314.9,scaleX:0.1919,scaleY:0.1854}},{t:this.instance_11,p:{skewX:106.47,skewY:-87.3474,regY:6.2,scaleX:0.936,scaleY:1.126,x:680.45,y:332.75,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:94.7,regY:8.8,scaleY:0.1219,rotation:0,skewY:-144.0217,x:768.85,y:410.45,scaleX:0.1518,skewX:38.2644}},{t:this.instance_2,p:{regX:21,regY:-1.1,scaleY:0.5948,skewX:32.9265,skewY:30.6445,x:787.7,y:377.35,scaleX:0.7373}},{t:this.instance,p:{regX:263.6,regY:150.3,scaleX:0.134,scaleY:0.1745,rotation:0,skewX:18.8817,skewY:-161.0388,x:705.1,y:264.75,startPosition:1}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},2).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:138.2765,skewY:-61.0016,x:733.5,y:353.5,regX:26.2,scaleX:1.1202,scaleY:1.0471}},{t:this.instance_30,p:{regX:95.6,regY:320.4,skewX:-24.4198,skewY:-26.3613,x:652.05,y:233.55,scaleX:0.1919,scaleY:0.1854}},{t:this.instance_11,p:{skewX:153.0516,skewY:-40.7666,regY:6.2,scaleX:0.936,scaleY:1.126,x:696.45,y:306.45,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:95.2,regY:8.2,scaleY:0.1249,rotation:0,skewY:-162.0431,x:790.35,y:416.9,scaleX:0.1556,skewX:20.2415}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:0.9054,skewY:-1.3756,x:783.1,y:375.8,scaleX:0.7373}},{t:this.instance,p:{regX:262.6,regY:150.3,scaleX:0.1339,scaleY:0.1744,rotation:0,skewX:13.3361,skewY:-166.5845,x:707.25,y:264.55,startPosition:2}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:139.7577,skewY:-59.5199,x:733.2,y:353.9,regX:26.2,scaleX:1.1203,scaleY:1.0472}},{t:this.instance_30,p:{regX:95.6,regY:320.4,skewX:-22.9398,skewY:-24.884,x:654.9,y:231.9,scaleX:0.1919,scaleY:0.1854}},{t:this.instance_11,p:{skewX:154.5326,skewY:-39.2851,regY:6.2,scaleX:0.9361,scaleY:1.126,x:697.45,y:305.9,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:93.4,regY:7.7,scaleY:0.1094,rotation:0,skewY:-165.214,x:783.6,y:418.4,scaleX:0.1363,skewX:17.0757}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:2.1876,skewY:-0.0925,x:783.25,y:376.5,scaleX:0.7373}},{t:this.instance,p:{regX:262.6,regY:150.3,scaleX:0.1339,scaleY:0.1744,rotation:0,skewX:13.3361,skewY:-166.5845,x:707.25,y:264.55,startPosition:2}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_13,p:{regY:27.9,skewX:140.9395,skewY:-58.3381,x:732.85,y:354.1,regX:26.2,scaleX:1.1204,scaleY:1.0473}},{t:this.instance_30,p:{regX:95.9,regY:320.2,skewX:-21.7585,skewY:-23.7016,x:657.15,y:230.6,scaleX:0.1919,scaleY:0.1854}},{t:this.instance_11,p:{skewX:155.7146,skewY:-38.1029,regY:6.2,scaleX:0.9361,scaleY:1.1261,x:698.15,y:305.55,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45,startPosition:0}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:94.5,regY:7.5,scaleY:0.1144,rotation:0,skewY:-160.2628,x:787,y:419.85,scaleX:0.1425,skewX:22.0285}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:7.1485,skewY:4.8665,x:784.8,y:376.15,scaleX:0.7373}},{t:this.instance,p:{regX:261.7,regY:150.8,scaleX:0.1215,scaleY:0.1584,rotation:0,skewX:20.5476,skewY:-159.3741,x:711.65,y:267.55,startPosition:3}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_13,p:{regY:27.9,skewX:136.7057,skewY:-62.5722,x:733.75,y:353.15,regX:26.2,scaleX:1.1203,scaleY:1.0472}},{t:this.instance_30,p:{regX:95.9,regY:320.5,skewX:-25.9894,skewY:-27.9385,x:649.2,y:235.55,scaleX:0.1919,scaleY:0.1854}},{t:this.instance_11,p:{skewX:151.4825,skewY:-42.3369,regY:6.2,scaleX:0.9361,scaleY:1.126,x:695.55,y:307.2,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45,startPosition:15}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:94.5,regY:7.5,scaleY:0.1144,rotation:0,skewY:-160.2628,x:787,y:419.85,scaleX:0.1425,skewX:22.0285}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:7.1485,skewY:4.8665,x:784.8,y:376.15,scaleX:0.7373}},{t:this.instance,p:{regX:261.7,regY:150.8,scaleX:0.1215,scaleY:0.1584,rotation:0,skewX:20.5476,skewY:-159.3741,x:711.65,y:267.55,startPosition:3}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},87).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:117.7409,skewY:-81.5373,x:737.2,y:347.8,regX:26.2,scaleX:1.1202,scaleY:1.0471}},{t:this.instance_30,p:{regX:95.8,regY:320.8,skewX:-26.5102,skewY:-28.4628,x:638.9,y:245.65,scaleX:0.1918,scaleY:0.1854}},{t:this.instance_11,p:{skewX:150.9589,skewY:-42.8608,regY:6.2,scaleX:0.936,scaleY:1.1259,x:685.95,y:316.75,regX:21.5}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45,startPosition:16}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:94.5,regY:7.5,scaleY:0.1144,rotation:0,skewY:-160.2628,x:787,y:419.85,scaleX:0.1425,skewX:22.0285}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:7.1485,skewY:4.8665,x:784.8,y:376.15,scaleX:0.7373}},{t:this.instance,p:{regX:261.7,regY:150.8,scaleX:0.1215,scaleY:0.1584,rotation:0,skewX:20.5476,skewY:-159.3741,x:711.65,y:267.55,startPosition:3}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:80.7097,skewY:-118.569,x:739.75,y:335.95,regX:26,scaleX:1.1202,scaleY:1.0471}},{t:this.instance_31,p:{regY:179.5,skewX:7.9741,skewY:6.0877,x:621.9,y:331.55,regX:252.8,scaleX:0.1866,scaleY:0.157}},{t:this.instance_11,p:{skewX:95.4842,skewY:-98.3328,regY:6,scaleX:0.9359,scaleY:0.9131,x:680.3,y:341.8,regX:21.5}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45,startPosition:16}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:94.5,regY:7.5,scaleY:0.1144,rotation:0,skewY:-160.2628,x:787,y:419.85,scaleX:0.1425,skewX:22.0285}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:7.1485,skewY:4.8665,x:784.8,y:376.15,scaleX:0.7373}},{t:this.instance,p:{regX:260.4,regY:151.1,scaleX:0.0932,scaleY:0.1063,rotation:0,skewX:5.537,skewY:-174.38,x:711.75,y:276.2,startPosition:6}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:72.9782,skewY:-126.3003,x:738.85,y:332.9,regX:26.1,scaleX:1.1202,scaleY:1.0471}},{t:this.instance_31,p:{regY:179.3,skewX:0.2451,skewY:-1.6398,x:621.5,y:344.45,regX:252.8,scaleX:0.1866,scaleY:0.157}},{t:this.instance_11,p:{skewX:87.7533,skewY:-106.0645,regY:6,scaleX:0.936,scaleY:0.9132,x:680.7,y:346.6,regX:21.6}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45,startPosition:17}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_3,p:{regX:94.5,regY:7.5,scaleY:0.1144,rotation:0,skewY:-160.2628,x:787,y:419.85,scaleX:0.1425,skewX:22.0285}},{t:this.instance_2,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:7.1485,skewY:4.8665,x:784.8,y:376.15,scaleX:0.7373}},{t:this.instance,p:{regX:260.4,regY:151.1,scaleX:0.0932,scaleY:0.1063,rotation:0,skewX:5.537,skewY:-174.38,x:711.75,y:276.2,startPosition:6}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_13,p:{regY:27.8,skewX:67.2382,skewY:-132.0412,x:737.85,y:330.85,regX:26.1,scaleX:1.1202,scaleY:1.0471}},{t:this.instance_31,p:{regY:179.6,skewX:-5.495,skewY:-7.3801,x:622.3,y:354.1,regX:252.8,scaleX:0.1866,scaleY:0.157}},{t:this.instance_11,p:{skewX:82.0128,skewY:-111.8052,regY:6,scaleX:0.9359,scaleY:0.9131,x:681.4,y:350.4,regX:21.5}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45,startPosition:25}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.6193,skewX:-4.7756,skewY:-2.4603,x:783.1,y:335.45,scaleX:0.7674}},{t:this.instance_3,p:{regX:94.6,regY:7.7,scaleY:0.1144,rotation:0,skewY:-169.7264,x:799.3,y:417.35,scaleX:0.1425,skewX:12.5661}},{t:this.instance_2,p:{regX:21,regY:-1.1,scaleY:0.5948,skewX:-2.3128,skewY:-4.5954,x:790.05,y:374.6,scaleX:0.7372}},{t:this.instance,p:{regX:260.4,regY:151.1,scaleX:0.0932,scaleY:0.1063,rotation:0,skewX:5.537,skewY:-174.38,x:711.75,y:276.2,startPosition:6}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},8).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:142.2396,skewY:-57.0422,x:737.85,y:362,regX:26.1,scaleX:1.12,scaleY:1.2819}},{t:this.instance_32,p:{skewX:-5.4687,skewY:-7.352,x:665.4,y:232.75,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:157.0139,skewY:-36.8037,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:699.25,y:307.2,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:26}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.7968,skewX:-171.8064,skewY:7.653,x:782.2,y:352.65,scaleX:0.7678}},{t:this.instance_19,p:{regX:132,rotation:0,x:802.65,y:226.45,regY:152.7,scaleX:0.1489,scaleY:0.151,skewX:5.2825,skewY:-171.3748}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-173.7207,skewY:10.3973,x:793.15,y:302.85,scaleX:0.7387}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:147.2136,skewY:-52.0682,x:735.55,y:363.7,regX:26.1,scaleX:1.1199,scaleY:1.2818}},{t:this.instance_32,p:{skewX:-0.4901,skewY:-2.377,x:674.6,y:228.7,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:161.9879,skewY:-31.8296,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:701.9,y:305.8,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:27}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.4,scaleY:0.7967,skewX:-175.0328,skewY:4.4262,x:782.85,y:352.55,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.8,rotation:0,x:796.1,y:225.4,regY:153.1,scaleX:0.1488,scaleY:0.151,skewX:2.0562,skewY:-174.6056}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-176.9477,skewY:7.1699,x:790.95,y:302.15,scaleX:0.7386}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:142.2396,skewY:-57.0422,x:737.85,y:362,regX:26.1,scaleX:1.12,scaleY:1.2819}},{t:this.instance_32,p:{skewX:-5.4687,skewY:-7.352,x:665.4,y:232.75,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:157.0139,skewY:-36.8037,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:699.25,y:307.2,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:26}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.7968,skewX:-171.8064,skewY:7.653,x:782.2,y:352.65,scaleX:0.7678}},{t:this.instance_19,p:{regX:132,rotation:0,x:802.65,y:226.45,regY:152.7,scaleX:0.1489,scaleY:0.151,skewX:5.2825,skewY:-171.3748}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-173.7207,skewY:10.3973,x:793.15,y:302.85,scaleX:0.7387}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:147.2136,skewY:-52.0682,x:735.55,y:363.7,regX:26.1,scaleX:1.1199,scaleY:1.2818}},{t:this.instance_32,p:{skewX:-0.4901,skewY:-2.377,x:674.6,y:228.7,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:161.9879,skewY:-31.8296,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:701.9,y:305.8,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:27}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.4,scaleY:0.7967,skewX:-175.0328,skewY:4.4262,x:782.85,y:352.55,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.8,rotation:0,x:796.1,y:225.4,regY:153.1,scaleX:0.1488,scaleY:0.151,skewX:2.0562,skewY:-174.6056}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-176.9477,skewY:7.1699,x:790.95,y:302.15,scaleX:0.7386}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:142.2396,skewY:-57.0422,x:737.85,y:362,regX:26.1,scaleX:1.12,scaleY:1.2819}},{t:this.instance_32,p:{skewX:-5.4687,skewY:-7.352,x:665.4,y:232.75,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:157.0139,skewY:-36.8037,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:699.25,y:307.2,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:26}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.7968,skewX:-171.8064,skewY:7.653,x:782.2,y:352.65,scaleX:0.7678}},{t:this.instance_19,p:{regX:132,rotation:0,x:802.65,y:226.45,regY:152.7,scaleX:0.1489,scaleY:0.151,skewX:5.2825,skewY:-171.3748}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-173.7207,skewY:10.3973,x:793.15,y:302.85,scaleX:0.7387}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:147.2136,skewY:-52.0682,x:735.55,y:363.7,regX:26.1,scaleX:1.1199,scaleY:1.2818}},{t:this.instance_32,p:{skewX:-0.4901,skewY:-2.377,x:674.6,y:228.7,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:161.9879,skewY:-31.8296,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:701.9,y:305.8,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:27}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.4,scaleY:0.7967,skewX:-175.0328,skewY:4.4262,x:782.85,y:352.55,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.8,rotation:0,x:796.1,y:225.4,regY:153.1,scaleX:0.1488,scaleY:0.151,skewX:2.0562,skewY:-174.6056}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-176.9477,skewY:7.1699,x:790.95,y:302.15,scaleX:0.7386}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:142.2396,skewY:-57.0422,x:737.85,y:362,regX:26.1,scaleX:1.12,scaleY:1.2819}},{t:this.instance_32,p:{skewX:-5.4687,skewY:-7.352,x:665.4,y:232.75,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:157.0139,skewY:-36.8037,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:699.25,y:307.2,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:26}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.7968,skewX:-171.8064,skewY:7.653,x:782.2,y:352.65,scaleX:0.7678}},{t:this.instance_19,p:{regX:132,rotation:0,x:802.65,y:226.45,regY:152.7,scaleX:0.1489,scaleY:0.151,skewX:5.2825,skewY:-171.3748}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-173.7207,skewY:10.3973,x:793.15,y:302.85,scaleX:0.7387}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:147.2136,skewY:-52.0682,x:735.55,y:363.7,regX:26.1,scaleX:1.1199,scaleY:1.2818}},{t:this.instance_32,p:{skewX:-0.4901,skewY:-2.377,x:674.6,y:228.7,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:161.9879,skewY:-31.8296,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:701.9,y:305.8,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:27}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.4,scaleY:0.7967,skewX:-175.0328,skewY:4.4262,x:782.85,y:352.55,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.8,rotation:0,x:796.1,y:225.4,regY:153.1,scaleX:0.1488,scaleY:0.151,skewX:2.0562,skewY:-174.6056}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-176.9477,skewY:7.1699,x:790.95,y:302.15,scaleX:0.7386}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},4).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:142.2396,skewY:-57.0422,x:737.85,y:362,regX:26.1,scaleX:1.12,scaleY:1.2819}},{t:this.instance_32,p:{skewX:-5.4687,skewY:-7.352,x:665.4,y:232.75,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:157.0139,skewY:-36.8037,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:699.25,y:307.2,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:26}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.5,scaleY:0.7968,skewX:-171.8064,skewY:7.653,x:782.2,y:352.65,scaleX:0.7678}},{t:this.instance_19,p:{regX:132,rotation:0,x:802.65,y:226.45,regY:152.7,scaleX:0.1489,scaleY:0.151,skewX:5.2825,skewY:-171.3748}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-173.7207,skewY:10.3973,x:793.15,y:302.85,scaleX:0.7387}},{t:this.instance,p:{regX:258.3,regY:153.8,scaleX:0.1889,scaleY:0.1911,rotation:0,skewX:16.7032,skewY:-163.1988,x:718.75,y:265.4,startPosition:8}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},5).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:147.2136,skewY:-52.0682,x:735.55,y:363.7,regX:26.1,scaleX:1.1199,scaleY:1.2818}},{t:this.instance_32,p:{skewX:-0.4901,skewY:-2.377,x:674.6,y:228.7,regX:139.2,regY:289.7,scaleX:0.1634,scaleY:0.1374}},{t:this.instance_11,p:{skewX:161.9879,skewY:-31.8296,regY:5.7,scaleX:0.9357,scaleY:1.1644,x:701.9,y:305.8,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4285,scaleY:0.4285,rotation:15.3627,x:754.2,y:306.8,startPosition:45}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.4,scaleY:0.7967,skewX:-175.0328,skewY:4.4262,x:782.85,y:352.55,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.8,rotation:0,x:796.1,y:225.4,regY:153.1,scaleX:0.1488,scaleY:0.151,skewX:2.0562,skewY:-174.6056}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-176.9477,skewY:7.1699,x:790.95,y:302.15,scaleX:0.7386}},{t:this.instance,p:{regX:259.4,regY:154.8,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:16.6905,skewY:16.7876,x:727.2,y:263.6,startPosition:7}},{t:this.instance_26,p:{regX:18.7,regY:17.8,rotation:12.4616,x:766.65,y:227.15,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:212,scaleX:0.337,scaleY:0.337,skewX:39.9255,skewY:-140.0745,x:720.85}}]},7).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:141.2496,skewY:-58.0333,x:737.9,y:361.9,regX:26.1,scaleX:1.1198,scaleY:1.2817}},{t:this.instance_32,p:{skewX:-6.4491,skewY:-8.3421,x:663.3,y:234,regX:139.4,regY:289.8,scaleX:0.1633,scaleY:0.1373}},{t:this.instance_11,p:{skewX:156.0229,skewY:-37.7943,regY:5.6,scaleX:0.9356,scaleY:1.1643,x:698.5,y:307.9,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:47}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.8,regY:17.4,scaleY:0.7967,skewX:-175.0328,skewY:4.4262,x:782.85,y:352.55,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.8,rotation:0,x:796.1,y:225.4,regY:153.1,scaleX:0.1488,scaleY:0.151,skewX:2.0562,skewY:-174.6056}},{t:this.instance_2,p:{regX:21.1,regY:-1.1,scaleY:0.766,skewX:-176.9477,skewY:7.1699,x:790.95,y:302.15,scaleX:0.7386}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:133.2942,skewY:-65.9885,x:740.4,y:359.2,regX:26.1,scaleX:1.1198,scaleY:1.2817}},{t:this.instance_32,p:{skewX:-8.9243,skewY:-10.8091,x:655.5,y:239,regX:139.7,regY:290.7,scaleX:0.1633,scaleY:0.1373}},{t:this.instance_11,p:{skewX:153.5495,skewY:-40.2679,regY:5.5,scaleX:0.9355,scaleY:1.1642,x:693.85,y:311.3,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:48}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.5,scaleY:0.7967,skewX:-170.5916,skewY:8.8669,x:781.55,y:352.75,scaleX:0.7677}},{t:this.instance_19,p:{regX:131.6,rotation:0,x:804.6,y:227.1,regY:153,scaleX:0.1488,scaleY:0.151,skewX:6.4943,skewY:-170.1649}},{t:this.instance_2,p:{regX:21.1,regY:-1.2,scaleY:0.766,skewX:-172.5069,skewY:11.6105,x:793.5,y:303.25,scaleX:0.7386}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:118.2963,skewY:-80.9869,x:745.4,y:352.4,regX:26.1,scaleX:1.1197,scaleY:1.2816}},{t:this.instance_17,p:{regX:111.4,regY:35.6,scaleX:0.1631,scaleY:0.1371,skewX:62.665,skewY:-115.4574,x:648.9,y:234.55}},{t:this.instance_11,p:{skewX:145.0313,skewY:-48.7863,regY:5.5,scaleX:0.9354,scaleY:1.1641,x:687.9,y:318.25,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:49}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:102.3389,skewY:-96.944,x:748.3,y:343.75,regX:26.1,scaleX:1.1196,scaleY:1.2815}},{t:this.instance_17,p:{regX:110.8,regY:35.6,scaleX:0.163,scaleY:0.1371,skewX:46.7095,skewY:-131.4144,x:623.25,y:257.05}},{t:this.instance_11,p:{skewX:129.0746,skewY:-64.7443,regY:5.4,scaleX:0.9353,scaleY:1.164,x:683.7,y:326.8,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:50}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:94.8519,skewY:-104.431,x:748.8,y:340.3,regX:26.1,scaleX:1.1196,scaleY:1.2815}},{t:this.instance_17,p:{regX:109.4,regY:35.4,scaleX:0.153,scaleY:0.1341,skewX:60.8035,skewY:-121.5547,x:633.55,y:256.9}},{t:this.instance_11,p:{skewX:138.6564,skewY:-50.4089,regY:5.2,scaleX:0.8876,scaleY:1.1075,x:678.3,y:331.1,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:51}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:74.1048,skewY:-125.1779,x:747.5,y:328.65,regX:25.9,scaleX:1.1194,scaleY:1.2813}},{t:this.instance_17,p:{regX:107.4,regY:34.7,scaleX:0.1529,scaleY:0.134,skewX:70.0565,skewY:-112.3015,x:644.35,y:273.15}},{t:this.instance_11,p:{skewX:147.9049,skewY:-41.1601,regY:5,scaleX:0.8874,scaleY:1.1072,x:676.5,y:353.5,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:53}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:74.1048,skewY:-125.1779,x:747.5,y:328.65,regX:25.9,scaleX:1.1194,scaleY:1.2813}},{t:this.instance_30,p:{regX:108,regY:37,skewX:-25.0526,skewY:-22.697,x:618.9,y:237.85,scaleX:0.1856,scaleY:0.1626}},{t:this.instance_11,p:{skewX:147.9049,skewY:-41.1601,regY:5,scaleX:0.8874,scaleY:1.1072,x:676.5,y:353.5,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:55}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:59.1066,skewY:-140.1764,x:742.65,y:327.85,regX:25.5,scaleX:1.1192,scaleY:1.281}},{t:this.instance_30,p:{regX:108.2,regY:38,skewX:-25.0471,skewY:-22.6913,x:619,y:258.3,scaleX:0.1856,scaleY:0.1625}},{t:this.instance_11,p:{skewX:147.905,skewY:-41.1601,regY:4.8,scaleX:0.8872,scaleY:1.107,x:676.7,y:373.85,regX:21.8}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:56}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:74.1047,skewY:-125.1783,x:744.75,y:334.75,regX:25.5,scaleX:1.1192,scaleY:1.281}},{t:this.instance_30,p:{regX:108.3,regY:38.4,skewX:-10.046,skewY:-7.6896,x:643.4,y:235.6,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:162.9034,skewY:-26.1618,regY:4.8,scaleX:0.8872,scaleY:1.107,x:669.15,y:362.05,regX:21.8}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:57}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:104.102,skewY:84.8201,x:744.5,y:348.85,regX:25.4,scaleX:0.9132,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.2,regY:39.1,skewX:4.9411,skewY:7.2981,x:683.55,y:203.7,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:177.9054,skewY:-11.1613,regY:4.7,scaleX:0.8871,scaleY:1.1067,x:675.6,y:332.5,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:58}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:59}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:74.1047,skewY:-125.1783,x:744.75,y:334.75,regX:25.5,scaleX:1.1192,scaleY:1.281}},{t:this.instance_30,p:{regX:108.3,regY:38.4,skewX:-10.046,skewY:-7.6896,x:643.4,y:235.6,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:162.9034,skewY:-26.1618,regY:4.8,scaleX:0.8872,scaleY:1.107,x:669.15,y:362.05,regX:21.8}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:57}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:69.6503,skewY:-129.6329,x:744.4,y:332.95,regX:25.4,scaleX:1.1191,scaleY:1.281}},{t:this.instance_30,p:{regX:108.2,regY:38.6,skewX:-14.4955,skewY:-12.1398,x:635.6,y:241.95,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:158.4495,skewY:-30.6158,regY:4.7,scaleX:0.8872,scaleY:1.1069,x:671.15,y:366.1,regX:21.8}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:58}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:104.102,skewY:84.8201,x:744.5,y:348.85,regX:25.4,scaleX:0.9132,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.2,regY:39.1,skewX:4.9411,skewY:7.2981,x:683.55,y:203.7,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:177.9053,skewY:-11.1613,regY:4.7,scaleX:0.8871,scaleY:1.1067,x:675.6,y:332.5,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:58}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:59}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:104.102,skewY:84.8201,x:744.5,y:348.85,regX:25.4,scaleX:0.9132,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.2,regY:39.1,skewX:4.9411,skewY:7.2981,x:683.55,y:203.7,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:177.9053,skewY:-11.1613,regY:4.7,scaleX:0.8871,scaleY:1.1067,x:675.6,y:332.5,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:58}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:69.6503,skewY:-129.6329,x:744.4,y:332.95,regX:25.4,scaleX:1.1191,scaleY:1.281}},{t:this.instance_30,p:{regX:108.2,regY:38.6,skewX:-14.4955,skewY:-12.1398,x:635.6,y:241.95,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:158.4495,skewY:-30.6158,regY:4.7,scaleX:0.8872,scaleY:1.1069,x:671.15,y:366.1,regX:21.8}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:58}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:74.1047,skewY:-125.1783,x:744.75,y:334.75,regX:25.5,scaleX:1.1192,scaleY:1.281}},{t:this.instance_30,p:{regX:108.3,regY:38.4,skewX:-10.046,skewY:-7.6896,x:643.4,y:235.6,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:162.9034,skewY:-26.1618,regY:4.8,scaleX:0.8872,scaleY:1.107,x:669.15,y:362.05,regX:21.8}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:57}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:104.102,skewY:84.8201,x:744.5,y:348.85,regX:25.4,scaleX:0.9132,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.2,regY:39.1,skewX:4.9411,skewY:7.2981,x:683.55,y:203.7,scaleX:0.1855,scaleY:0.1625}},{t:this.instance_11,p:{skewX:177.9053,skewY:-11.1613,regY:4.7,scaleX:0.8871,scaleY:1.1067,x:675.6,y:332.5,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:58}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},2).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.3,scaleX:0.4284,scaleY:0.4284,rotation:25.3467,x:753.6,y:308.2,startPosition:59}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.2,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:155.2,scaleX:0.1403,scaleY:0.1338,rotation:0,skewX:26.6732,skewY:26.7741,x:734.5,y:261,startPosition:7}},{t:this.instance_26,p:{regX:18.8,regY:17.9,rotation:22.4459,x:779.65,y:231.95,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.6,regY:17.6,y:209.1,scaleX:0.337,scaleY:0.337,skewX:49.9111,skewY:-130.0889,x:737.15}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:61}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.9,regY:155.2,scaleX:0.1403,scaleY:0.1337,rotation:0,skewX:16.4726,skewY:16.5781,x:727.35,y:263.65,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},2).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:3}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.8,regY:156.7,scaleX:0.1091,scaleY:0.1336,rotation:0,skewX:23.4967,skewY:-156.394,x:721.5,y:261.4,startPosition:1}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},12).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:4}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.8,regY:156.7,scaleX:0.1091,scaleY:0.1336,rotation:0,skewX:23.4967,skewY:-156.394,x:721.5,y:261.4,startPosition:2}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:107.2964,skewY:88.0148,x:744.05,y:350.6,regX:25.4,scaleX:0.9131,scaleY:1.2808}},{t:this.instance_30,p:{regX:109.5,regY:39.5,skewX:8.1324,skewY:10.4916,x:691.2,y:202.25,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:-178.9003,skewY:-7.9659,regY:4.7,scaleX:0.887,scaleY:1.1067,x:676.1,y:330.35,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:5}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.8,regY:156.7,scaleX:0.1091,scaleY:0.1336,rotation:0,skewX:23.4967,skewY:-156.394,x:721.5,y:261.4,startPosition:3}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:100.8166,skewY:81.5356,x:745.1,y:347.5,regX:25.4,scaleX:0.9131,scaleY:1.2807}},{t:this.instance_30,p:{regX:109.7,regY:39.6,skewX:1.6527,skewY:4.011,x:675.85,y:206.1,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:174.6205,skewY:-14.4453,regY:4.7,scaleX:0.887,scaleY:1.1066,x:675.35,y:335.05,regX:22}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:40}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:156.9,scaleX:0.1345,scaleY:0.1336,rotation:0,skewX:23.49,skewY:23.6022,x:721,y:267.2,startPosition:10}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},35).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:85.8195,skewY:66.5386,x:745.35,y:340.6,regX:25.4,scaleX:0.913,scaleY:1.2806}},{t:this.instance_30,p:{regX:110,regY:39.5,skewX:-13.3416,skewY:-10.9835,x:642,y:221.95,scaleX:0.1854,scaleY:0.1624}},{t:this.instance_11,p:{skewX:159.6235,skewY:-29.4424,regY:4.7,scaleX:0.8869,scaleY:1.1065,x:674.85,y:346.6,regX:22}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:42}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259.6,regY:157.3,scaleX:0.1134,scaleY:0.1336,rotation:0,skewX:23.49,skewY:23.5985,x:728.45,y:264.5,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},1).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:70.8228,skewY:51.5419,x:744.55,y:333.9,regX:25.6,scaleX:0.9129,scaleY:1.2805}},{t:this.instance_31,p:{regY:192.8,skewX:46.6568,skewY:49.0122,x:631.25,y:290.65,regX:195.1,scaleX:0.225,scaleY:0.197}},{t:this.instance_11,p:{skewX:144.6264,skewY:-44.4395,regY:4.6,scaleX:0.8868,scaleY:1.1064,x:678,y:357.95,regX:22}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:44}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:259,regY:157.8,scaleX:0.1696,scaleY:0.1306,rotation:0,skewX:15.4765,skewY:-164.4094,x:720.7,y:264.05,startPosition:8}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:34.0806,skewY:14.7998,x:735.3,y:318.95,regX:25.7,scaleX:0.9129,scaleY:1.2804}},{t:this.instance_31,p:{regY:179.8,skewX:9.9049,skewY:12.2693,x:639.7,y:356.05,regX:226.8,scaleX:0.2277,scaleY:0.1994}},{t:this.instance_11,p:{skewX:107.8832,skewY:-81.1827,regY:4.5,scaleX:0.8867,scaleY:0.9451,x:696.35,y:377.95,regX:22}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:46}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:258.9,regY:157.2,scaleX:0.1971,scaleY:0.1676,rotation:0,skewX:15.7656,skewY:-164.1253,x:721.55,y:261.3,startPosition:8}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:34.0806,skewY:14.7998,x:735.3,y:318.95,regX:25.7,scaleX:0.9129,scaleY:1.2804}},{t:this.instance_31,p:{regY:180.1,skewX:4.7014,skewY:7.0683,x:638,y:361.3,regX:227.1,scaleX:0.2277,scaleY:0.1994}},{t:this.instance_11,p:{skewX:102.6826,skewY:-86.3826,regY:4.4,scaleX:0.8866,scaleY:0.945,x:696.45,y:378,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.2,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:15.147,x:754.45,y:306.75,startPosition:47}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:258.9,regY:157.2,scaleX:0.1971,scaleY:0.1676,rotation:0,skewX:15.7656,skewY:-164.1253,x:721.55,y:261.3,startPosition:8}},{t:this.instance_26,p:{regX:18.9,regY:17.9,rotation:12.246,x:766.6,y:227.05,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.5,regY:17.7,y:212.15,scaleX:0.337,scaleY:0.337,skewX:39.7106,skewY:-140.2894,x:720.8}}]},2).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:34.0806,skewY:14.7998,x:735.3,y:318.95,regX:25.7,scaleX:0.9129,scaleY:1.2804}},{t:this.instance_31,p:{regY:180.1,skewX:4.7014,skewY:7.0683,x:638,y:361.3,regX:227.1,scaleX:0.2277,scaleY:0.1994}},{t:this.instance_11,p:{skewX:102.6826,skewY:-86.3826,regY:4.4,scaleX:0.8866,scaleY:0.945,x:696.45,y:378,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.3,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:10.6603,x:754.9,y:306.25,startPosition:1}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:258.7,regY:157.4,scaleX:0.1971,scaleY:0.1676,rotation:0,skewX:11.2772,skewY:-168.6109,x:718.55,y:263.55,startPosition:8}},{t:this.instance_26,p:{regX:18.9,regY:18.1,rotation:7.7603,x:760.8,y:225.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.3,regY:17.7,y:214.65,scaleX:0.3369,scaleY:0.3369,skewX:35.2225,skewY:-144.7775,x:713.95}}]},27).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:40.7965,skewY:21.5158,x:737.45,y:321,regX:25.7,scaleX:0.9128,scaleY:1.2803}},{t:this.instance_31,p:{regY:180.3,skewX:11.4157,skewY:13.7819,x:636,y:351.7,regX:227.2,scaleX:0.2276,scaleY:0.1994}},{t:this.instance_11,p:{skewX:109.3973,skewY:-79.6674,regY:4.4,scaleX:0.8865,scaleY:0.9449,x:692.05,y:375.1,regX:21.9}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.3,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:10.6603,x:754.9,y:306.25,startPosition:4}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:258.7,regY:157.4,scaleX:0.1971,scaleY:0.1676,rotation:0,skewX:11.2772,skewY:-168.6109,x:718.55,y:263.55,startPosition:8}},{t:this.instance_26,p:{regX:18.9,regY:18.1,rotation:7.7603,x:760.8,y:225.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.3,regY:17.7,y:214.65,scaleX:0.3369,scaleY:0.3369,skewX:35.2225,skewY:-144.7775,x:713.95}}]},3).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:78.9878,skewY:59.7068,x:743.9,y:335.15,regX:25.7,scaleX:0.9127,scaleY:1.2803}},{t:this.instance_17,p:{regX:219.9,regY:185.9,scaleX:0.1544,scaleY:0.1351,skewX:85.5447,skewY:-96.8524,x:630.85,y:267.5}},{t:this.instance_11,p:{skewX:147.5892,skewY:-41.4766,regY:4.3,scaleX:0.8864,scaleY:0.8627,x:674.85,y:349.5,regX:22.1}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.3,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:10.6603,x:754.9,y:306.25,startPosition:5}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:258.7,regY:157.4,scaleX:0.1971,scaleY:0.1676,rotation:0,skewX:11.2772,skewY:-168.6109,x:718.55,y:263.55,startPosition:8}},{t:this.instance_26,p:{regX:18.9,regY:18.1,rotation:7.7603,x:760.8,y:225.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.3,regY:17.7,y:214.65,scaleX:0.3369,scaleY:0.3369,skewX:35.2225,skewY:-144.7775,x:713.95}}]},1).to({state:[{t:this.instance_13,p:{regY:27.6,skewX:108.9867,skewY:89.7059,x:741.65,y:349.1,regX:25.8,scaleX:0.9127,scaleY:1.2802}},{t:this.instance_17,p:{regX:219.4,regY:185.6,scaleX:0.1543,scaleY:0.1351,skewX:90.8154,skewY:-91.5751,x:638.45,y:241.25}},{t:this.instance_11,p:{skewX:152.8665,skewY:-36.2001,regY:4.3,scaleX:0.8863,scaleY:0.8626,x:674.65,y:326.85,regX:22.1}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.3,regY:403.4,scaleX:0.4284,scaleY:0.4284,rotation:10.6603,x:754.9,y:306.25,startPosition:6}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:740,scaleX:0.8109,scaleY:0.8109,rotation:0}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.7,scaleY:0.8163,skewX:-18.1488,skewY:-18.5409,x:779.2,y:333.45,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.3,scaleY:0.1548,rotation:0,skewY:166.3882,x:809.3,y:455.25,scaleX:0.1324,skewX:-9.6471}},{t:this.instance_2,p:{regX:21.2,regY:-1.1,scaleY:0.7862,skewX:-10.6707,skewY:-15.474,x:799.9,y:381.45,scaleX:0.7398}},{t:this.instance,p:{regX:258.7,regY:158.3,scaleX:0.1486,scaleY:0.1676,rotation:0,skewX:11.2649,skewY:11.3792,x:728.2,y:261.4,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:18.1,rotation:7.7603,x:760.8,y:225.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.3,regY:17.7,y:214.65,scaleX:0.3369,scaleY:0.3369,skewX:35.2225,skewY:-144.7775,x:713.95}}]},1).to({state:[{t:this.instance_13,p:{regY:27.5,skewX:146.9469,skewY:127.6664,x:729.55,y:362.7,regX:25.8,scaleX:0.9126,scaleY:1.195}},{t:this.instance_17,p:{regX:219.2,regY:185.5,scaleX:0.1543,scaleY:0.1351,skewX:106.8195,skewY:-75.5665,x:679.1,y:211.6}},{t:this.instance_11,p:{skewX:168.8708,skewY:-20.1961,regY:4.1,scaleX:0.8861,scaleY:0.8624,x:690.35,y:303.95,regX:22.2}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.4,regY:403.6,scaleX:0.4283,scaleY:0.4283,rotation:12.6579,x:759.65,y:307,startPosition:7}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:739.9,scaleX:0.8108,scaleY:0.8108,rotation:1.9984}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.8,scaleY:0.8163,skewX:-16.1495,skewY:-16.5414,x:783.05,y:335,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.5,scaleY:0.1548,rotation:0,skewY:168.3882,x:808.8,y:457.75,scaleX:0.1324,skewX:-7.6491}},{t:this.instance_2,p:{regX:21.3,regY:-1.1,scaleY:0.7861,skewX:-8.671,skewY:-13.4745,x:802.05,y:383.65,scaleX:0.7398}},{t:this.instance,p:{regX:259.1,regY:158.5,scaleX:0.1485,scaleY:0.1675,rotation:0,skewX:13.2629,skewY:13.3753,x:734.6,y:261.2,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:18.2,rotation:9.7588,x:768.35,y:226.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.2,regY:17.8,y:213.95,scaleX:0.3369,scaleY:0.3369,skewX:37.2213,skewY:-142.7787,x:721.9}}]},1).to({state:[{t:this.instance_13,p:{regY:27.4,skewX:131.9493,skewY:112.6689,x:735.1,y:359.95,regX:25.9,scaleX:0.9125,scaleY:1.1949}},{t:this.instance_33,p:{regX:217.1,skewX:16.7864,skewY:-165.5641,x:612.7,y:207.8,regY:186.1}},{t:this.instance_11,p:{skewX:153.8744,skewY:-35.1927,regY:4,scaleX:0.886,scaleY:1.0525,x:681.9,y:313,regX:22.2}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.4,regY:403.6,scaleX:0.4283,scaleY:0.4283,rotation:12.6579,x:759.65,y:307,startPosition:10}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:739.9,scaleX:0.8108,scaleY:0.8108,rotation:1.9984}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.8,scaleY:0.8163,skewX:-16.1495,skewY:-16.5414,x:783.05,y:335,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.5,scaleY:0.1548,rotation:0,skewY:168.3882,x:808.8,y:457.75,scaleX:0.1324,skewX:-7.6491}},{t:this.instance_2,p:{regX:21.3,regY:-1.1,scaleY:0.7861,skewX:-8.671,skewY:-13.4745,x:802.05,y:383.65,scaleX:0.7398}},{t:this.instance,p:{regX:259.1,regY:158.5,scaleX:0.1485,scaleY:0.1675,rotation:0,skewX:13.2629,skewY:13.3753,x:734.6,y:261.2,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:18.2,rotation:9.7588,x:768.35,y:226.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.2,regY:17.8,y:213.95,scaleX:0.3369,scaleY:0.3369,skewX:37.2213,skewY:-142.7787,x:721.9}}]},3).to({state:[{t:this.instance_13,p:{regY:27.4,skewX:131.9493,skewY:112.6689,x:735.1,y:359.95,regX:25.9,scaleX:0.9125,scaleY:1.1949}},{t:this.instance_33,p:{regX:216.9,skewX:9.0605,skewY:-173.2891,x:599.7,y:217.55,regY:186.1}},{t:this.instance_11,p:{skewX:146.1498,skewY:-42.9173,regY:4,scaleX:0.8859,scaleY:1.0524,x:682.4,y:312.5,regX:22.2}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.4,regY:403.6,scaleX:0.4283,scaleY:0.4283,rotation:12.6579,x:759.65,y:307,startPosition:11}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:739.9,scaleX:0.8108,scaleY:0.8108,rotation:1.9984}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.8,scaleY:0.8163,skewX:-16.1495,skewY:-16.5414,x:783.05,y:335,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.5,scaleY:0.1548,rotation:0,skewY:168.3882,x:808.8,y:457.75,scaleX:0.1324,skewX:-7.6491}},{t:this.instance_2,p:{regX:21.3,regY:-1.1,scaleY:0.7861,skewX:-8.671,skewY:-13.4745,x:802.05,y:383.65,scaleX:0.7398}},{t:this.instance,p:{regX:259.1,regY:158.5,scaleX:0.1485,scaleY:0.1675,rotation:0,skewX:13.2629,skewY:13.3753,x:734.6,y:261.2,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:18.2,rotation:9.7588,x:768.35,y:226.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.2,regY:17.8,y:213.95,scaleX:0.3369,scaleY:0.3369,skewX:37.2213,skewY:-142.7787,x:721.9}}]},1).to({state:[{t:this.instance_13,p:{regY:27.4,skewX:131.9493,skewY:112.6689,x:735.1,y:359.95,regX:25.9,scaleX:0.9125,scaleY:1.1949}},{t:this.instance_33,p:{regX:216.8,skewX:3.3612,skewY:-178.9875,x:590.65,y:226.15,regY:186}},{t:this.instance_11,p:{skewX:140.4525,skewY:-48.615,regY:4,scaleX:0.8859,scaleY:1.0524,x:682.35,y:312.5,regX:22.2}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_1,p:{regX:249.4,regY:403.6,scaleX:0.4283,scaleY:0.4283,rotation:12.6579,x:759.65,y:307,startPosition:12}},{t:this.instance_14,p:{x:715.1}},{t:this.instance_10,p:{x:714.4}},{t:this.instance_9,p:{x:758.85}},{t:this.instance_8,p:{x:760}},{t:this.instance_7,p:{x:739.9,scaleX:0.8108,scaleY:0.8108,rotation:1.9984}},{t:this.instance_6,p:{x:758.85}},{t:this.instance_5,p:{x:709.85}},{t:this.instance_4,p:{regX:27.9,regY:17.8,scaleY:0.8163,skewX:-16.1495,skewY:-16.5414,x:783.05,y:335,scaleX:0.7696}},{t:this.instance_3,p:{regX:131.9,regY:153.5,scaleY:0.1548,rotation:0,skewY:168.3882,x:808.8,y:457.75,scaleX:0.1324,skewX:-7.6491}},{t:this.instance_2,p:{regX:21.3,regY:-1.1,scaleY:0.7861,skewX:-8.671,skewY:-13.4745,x:802.05,y:383.65,scaleX:0.7398}},{t:this.instance,p:{regX:259.1,regY:158.5,scaleX:0.1485,scaleY:0.1675,rotation:0,skewX:13.2629,skewY:13.3753,x:734.6,y:261.2,startPosition:7}},{t:this.instance_26,p:{regX:18.9,regY:18.2,rotation:9.7588,x:768.35,y:226.9,scaleX:0.337,scaleY:0.337}},{t:this.instance_25,p:{regX:15.2,regY:17.8,y:213.95,scaleX:0.3369,scaleY:0.3369,skewX:37.2213,skewY:-142.7787,x:721.9}}]},1).wait(39));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_btns = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// btns
	this.sb1 = new lib.startBtn();
	this.sb1.name = "sb1";
	this.sb1.setTransform(625.9,329.35,1,1,0,0,0,120.5,126);

	this.rb2 = new lib.replayBtn();
	this.rb2.name = "rb2";
	this.rb2.setTransform(632.1,31.75,0.36,0.36,0,0,0,108.5,108);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.sb1}]}).to({state:[]},1).to({state:[{t:this.rb2}]},479).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.Untitled1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0,1,480];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		this.sb1 = this.btns.sb1;
		var self = this;
		
		self.stop();
		
		self.sb1.addEventListener("click", myPlay);
		
		function myPlay() {
			self.gotoAndPlay(1);
		
		}
	}
	this.frame_1 = function() {
		this.sb1 = undefined;
		playSound("FluteTone");
	}
	this.frame_480 = function() {
		this.rb2 = this.btns.rb2;
		this.___loopingOver___ = true;
		var self = this;
		
		self.stop();
		createjs.Sound.stop();
		
		self.rb2.addEventListener("click", myReplay);
		
		function myReplay() {
			self.gotoAndPlay(1);
		
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(479).call(this.frame_480).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(640,360);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(69).to({regX:0.4,regY:0.4,scaleX:0.4469,scaleY:0.4469,x:612.6,y:259.05},0).wait(15).to({regX:1.1,regY:1.1,scaleX:0.3268,scaleY:0.3268,x:776.15,y:247.85},82).wait(4).to({regX:0.7,regY:0.7,scaleX:0.3599,scaleY:0.3599,x:769.45,y:253.25},0).to({regX:1.1,regY:1.1,scaleX:0.6161,scaleY:0.6161,x:647.75,y:196.45},4).wait(84).to({regX:1.2,regY:1.2,x:613,y:240.15},5).wait(60).to({x:614.5,y:201.7},27).wait(56).to({regX:1.4,regY:1.4,scaleX:0.6788,scaleY:0.6788,x:614.6,y:218.35},12).wait(27).to({regX:3,regY:3,scaleX:0.1878,scaleY:0.1878,x:630.6,y:35.95},34).wait(2));

	// btns_obj_
	this.btns = new lib.Scene_1_btns();
	this.btns.name = "btns";
	this.btns.setTransform(625.9,329.4,1,1,0,0,0,625.9,329.4);
	this.btns.depth = 0;
	this.btns.isAttachedToCamera = 0
	this.btns.isAttachedToMask = 0
	this.btns.layerDepth = 0
	this.btns.layerIndex = 0
	this.btns.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.btns).wait(480).to({regX:627.4,regY:29.7,scaleX:5.3255,scaleY:5.3255,x:626.05,y:329.35},0).wait(1));

	// lamp_obj_
	this.lamp = new lib.Scene_1_lamp();
	this.lamp.name = "lamp";
	this.lamp.depth = 0;
	this.lamp.isAttachedToCamera = 0
	this.lamp.isAttachedToMask = 0
	this.lamp.layerDepth = 0
	this.lamp.layerIndex = 1
	this.lamp.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.lamp).wait(69).to({regX:326.4,regY:98,scaleX:2.2379,scaleY:2.2379,y:0.1},0).wait(100).to({regX:566.6,regY:129.8,scaleX:3.0597,scaleY:3.0597,y:0},0).wait(5).to({regX:252.7,regY:-26.1,scaleX:1.623,scaleY:1.623,y:-0.1},0).wait(149).to({regX:217.8,regY:17.5,scaleX:1.6231,scaleY:1.6231,x:-0.05,y:0},0).wait(71).to({regX:219.3,regY:-20.8,x:-0.1,y:0.05},0).wait(86).to({regX:509.9,regY:-32.1,scaleX:5.3255,scaleY:5.3255,x:0.3,y:0.25},0).wait(1));

	// ball_obj_
	this.ball = new lib.Scene_1_ball();
	this.ball.name = "ball";
	this.ball.depth = 0;
	this.ball.isAttachedToCamera = 0
	this.ball.isAttachedToMask = 0
	this.ball.layerDepth = 0
	this.ball.layerIndex = 2
	this.ball.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.ball).wait(7).to({regX:595.1,regY:343.3,x:595.1,y:343.3},0).wait(9).to({regX:0,regY:0,x:0,y:0},0).wait(10).to({regX:595.1,regY:343.3,x:595.1,y:343.3},0).wait(44).to({_off:true},1).wait(410));

	// Character1_obj_
	this.Character1 = new lib.Scene_1_Character1();
	this.Character1.name = "Character1";
	this.Character1.setTransform(885.7,315.7,1,1,0,0,0,885.7,315.7);
	this.Character1.depth = 0;
	this.Character1.isAttachedToCamera = 0
	this.Character1.isAttachedToMask = 0
	this.Character1.layerDepth = 0
	this.Character1.layerIndex = 3
	this.Character1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Character1).wait(69).to({regX:722.1,regY:239,scaleX:2.2379,scaleY:2.2379,x:885.55,y:315.65},0).wait(41).to({regX:764.6,regY:237.2,scaleX:2.4464,scaleY:2.4464,x:885.6,y:315.85},0).wait(21).to({regX:799,regY:235.7,scaleX:2.6452,scaleY:2.6452,x:885.65,y:315.75},0).wait(2).to({regX:802.3,regY:235.6,scaleX:2.6659,scaleY:2.6659,y:315.8},0).wait(2).to({regX:805.6,regY:235.4,scaleX:2.6869,scaleY:2.6869,x:885.75,y:315.75},0).wait(2).to({regX:808.9,regY:235.2,scaleX:2.7082,scaleY:2.7082,x:885.85,y:315.5},0).wait(2).to({regX:812.1,regY:235.1,scaleX:2.7298,scaleY:2.7298,x:885.55,y:315.7},0).wait(2).to({regX:815.4,regY:235,scaleX:2.7518,scaleY:2.7518,x:885.65,y:315.8},0).wait(28).to({regX:856.1,regY:233,scaleX:3.0597,scaleY:3.0597,x:885.8,y:315.75},0).wait(2).to({regX:842.8,regY:220,scaleX:2.3589,scaleY:2.3589,x:885.7,y:315.85},0).wait(1).to({regX:828.1,regY:202.8,scaleX:2.0492,scaleY:2.0492,y:315.75},0).wait(1).to({regX:813.4,regY:185.7,scaleX:1.8114,scaleY:1.8114,x:885.8},0).wait(1).to({regX:798.4,regY:168.5,scaleX:1.623,scaleY:1.623,x:885.65,y:315.7},0).wait(87).to({regX:777.6,regY:194.7,scaleX:1.6231,scaleY:1.6231,x:885.8},0).wait(1).to({regX:770.6,regY:203.5,x:885.7,y:315.8},0).wait(1).to({regX:763.6,regY:212.1,scaleX:1.623,scaleY:1.623},0).wait(60).to({regY:212,scaleX:1.6231,scaleY:1.6231,x:885.8,y:315.7},0).wait(2).to({regY:209.2,x:885.65,y:315.8},0).wait(2).to({regX:763.8,regY:206.3,x:885.75,y:315.7},0).wait(2).to({regX:763.9,regY:203.5,x:885.7,y:315.8},0).wait(2).to({regX:764,regY:200.6,y:315.7},0).wait(2).to({regX:764.1,regY:197.8},0).wait(2).to({regX:764.2,regY:195,x:885.65,y:315.8},0).wait(2).to({regX:764.4,regY:192.2,x:885.75,y:315.75},0).wait(1).to({regX:764.5,regY:190.7,x:885.8,y:315.65},0).wait(1).to({regY:189.3,x:885.75},0).wait(2).to({regX:764.6,regY:186.5,x:885.65,y:315.75},0).wait(2).to({regX:764.7,regY:183.7,y:315.8},0).wait(2).to({regX:764.9,regY:180.8,x:885.8,y:315.75},0).wait(1).to({regY:179.4,x:885.75},0).wait(2).to({regX:765,regY:176.5,x:885.65,y:315.65},0).wait(12).to({regX:765.1,regY:173.7,x:885.75,y:315.7},0).wait(71).to({regX:780.4,regY:187.3,scaleX:1.4732,scaleY:1.4732,x:885.7,y:315.65},0).wait(50));

	// Character2_obj_
	this.Character2 = new lib.Scene_1_Character2();
	this.Character2.name = "Character2";
	this.Character2.setTransform(391.4,306.3,1,1,0,0,0,391.4,306.3);
	this.Character2.depth = 0;
	this.Character2.isAttachedToCamera = 0
	this.Character2.isAttachedToMask = 0
	this.Character2.layerDepth = 0
	this.Character2.layerIndex = 4
	this.Character2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Character2).wait(69).to({regX:501.2,regY:234.8,scaleX:2.2379,scaleY:2.2379,x:391.2,y:306.25},0).wait(100).to({regX:694.5,regY:229.9,scaleX:3.0597,scaleY:3.0597,x:391.35},0).wait(2).to({regX:633.2,regY:216,scaleX:2.3589,scaleY:2.3589,x:391.3,y:306.45},0).wait(10).to({regX:493.8,regY:162.7,scaleX:1.623,scaleY:1.623,y:306.3},0).wait(77).to({regY:162.8,x:391.35,y:306.35},0).wait(1).to({regX:486.9,regY:171.6,x:391.4,y:306.4},0).wait(1).to({regX:479.9,regY:180.3,x:391.35,y:306.35},0).wait(1).to({regX:472.9,regY:188.9,scaleX:1.6231,scaleY:1.6231,x:391.25,y:306.3},0).wait(9).to({regX:459,regY:206.2,scaleX:1.623,scaleY:1.623,x:391.3,y:306.2},0).wait(63).to({regX:459.5,regY:192,scaleX:1.6231,scaleY:1.6231,x:391.35,y:306.3},0).wait(2).to({regX:459.7,regY:189.2,x:391.4,y:306.4},0).wait(11).to({regX:460.3,regY:173.6,x:391.35,y:306.3},0).wait(1).to({regX:460.4,regY:172.2,y:306.4},0).wait(8).to({regX:460.5,regY:167.9,y:306.3},0).wait(51).to({regX:460.6,x:391.45,y:306.25},0).wait(2).to({regX:457.9,regY:170.2,scaleX:1.5961,scaleY:1.5961,x:391.25,y:306.4},0).wait(1).to({regX:456.6,regY:171.2,scaleX:1.5828,scaleY:1.5828,x:391.3,y:306.2},0).wait(1).to({regX:455.3,regY:172.3,scaleX:1.5699,scaleY:1.5699,y:306.25},0).wait(2).to({regX:452.8,regY:174.6,scaleX:1.5446,scaleY:1.5446,y:306.35},0).wait(1).to({regX:451.5,regY:175.8,scaleX:1.5322,scaleY:1.5322,x:391.35,y:306.4},0).wait(15).to({regX:444.9,regY:181,scaleX:1.4732,scaleY:1.4732,x:391.45,y:306.35},0).wait(53));

	// clap_effect_obj_
	this.clap_effect = new lib.Scene_1_clap_effect();
	this.clap_effect.name = "clap_effect";
	this.clap_effect.depth = 0;
	this.clap_effect.isAttachedToCamera = 0
	this.clap_effect.isAttachedToMask = 0
	this.clap_effect.layerDepth = 0
	this.clap_effect.layerIndex = 5
	this.clap_effect.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.clap_effect).wait(442).to({regX:179.2,regY:-26.9,scaleX:1.4732,scaleY:1.4732,y:0.05},0).wait(2).to({_off:true},1).wait(36));

	// darkScreen_obj_
	this.darkScreen = new lib.Scene_1_darkScreen();
	this.darkScreen.name = "darkScreen";
	this.darkScreen.depth = 0;
	this.darkScreen.isAttachedToCamera = 0
	this.darkScreen.isAttachedToMask = 0
	this.darkScreen.layerDepth = 0
	this.darkScreen.layerIndex = 6
	this.darkScreen.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.darkScreen).wait(175).to({regX:252.7,regY:-26.1,scaleX:1.623,scaleY:1.623,y:-0.1},0).wait(83).to({regY:-25.9,x:0.05,y:0.05},0).wait(1).to({regX:245.8,regY:-17.2,x:0.1,y:0},0).wait(1).to({regX:238.8,regY:-8.4,x:0.05,y:0.05},0).wait(1).to({regX:231.8,regY:0.2,scaleX:1.6231,scaleY:1.6231,x:-0.1,y:0},0).wait(1).to({regX:224.9,regY:9,x:0,y:0.1},0).wait(1).to({regX:217.9,regY:17.6,scaleX:1.623,scaleY:1.623},0).wait(5).to({_off:true},1).wait(212));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(550.9,-50.7,803.0000000000001,829.5);
// library properties:
lib.properties = {
	id: '5AAAC8EB146B3844933521FFC847E939',
	width: 1280,
	height: 720,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_71.png", id:"CachedBmp_71"},
		{src:"images/CachedBmp_72.png", id:"CachedBmp_72"},
		{src:"images/CachedBmp_73.png", id:"CachedBmp_73"},
		{src:"images/CachedBmp_74.png", id:"CachedBmp_74"},
		{src:"images/CachedBmp_6.png", id:"CachedBmp_6"},
		{src:"images/CachedBmp_9.png", id:"CachedBmp_9"},
		{src:"images/CachedBmp_11.png", id:"CachedBmp_11"},
		{src:"images/CachedBmp_16.png", id:"CachedBmp_16"},
		{src:"images/CachedBmp_8.png", id:"CachedBmp_8"},
		{src:"images/CachedBmp_5.png", id:"CachedBmp_5"},
		{src:"images/CachedBmp_7.png", id:"CachedBmp_7"},
		{src:"images/CachedBmp_14.png", id:"CachedBmp_14"},
		{src:"images/CachedBmp_12.png", id:"CachedBmp_12"},
		{src:"images/CachedBmp_15.png", id:"CachedBmp_15"},
		{src:"images/CachedBmp_10.png", id:"CachedBmp_10"},
		{src:"images/CachedBmp_13.png", id:"CachedBmp_13"},
		{src:"images/Untitled_1_atlas_1.png", id:"Untitled_1_atlas_1"},
		{src:"images/Untitled_1_atlas_2.png", id:"Untitled_1_atlas_2"},
		{src:"images/Untitled_1_atlas_3.png", id:"Untitled_1_atlas_3"},
		{src:"images/Untitled_1_atlas_4.png", id:"Untitled_1_atlas_4"},
		{src:"images/Untitled_1_atlas_5.png", id:"Untitled_1_atlas_5"},
		{src:"images/Untitled_1_atlas_6.png", id:"Untitled_1_atlas_6"},
		{src:"sounds/FluteTone.mp3", id:"FluteTone"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5AAAC8EB146B3844933521FFC847E939'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;