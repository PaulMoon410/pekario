/*
* using cross platform MIDI library MIDI.js http://www.midijs.net/
*/

var midifiles = {
	"title"      : "midi/title.mid",
	"map"        : "midi/map.mid",
	"background" : "midi/background.mid",
	"overground" : "midi/overground.mid",
	"underground": "midi/underground.mid",
	"castle"     : "midi/castle.mid",
	"neverGonna" : "midi/Never-Gonna-Give-You-Up-3.mid",
	"bohemian"   : "midi/Queen - Bohemian Rhapsody.mid",
};

Mario.PlayMusic = function(name) {
	if(name in midifiles)
	{
		// Stop any currently playing track first
		if (typeof MIDIjs !== "undefined") {
			MIDIjs.stop();
			MIDIjs.play(midifiles[name]);
		}
	}else{
		console.error("Cannot play music track " + name + " as i have no data for it.");
	}
};

Mario.PlayTitleMusic = function() {
	Mario.PlayMusic("title");
};

Mario.PlayMapMusic = function() {
	Mario.PlayMusic("map");
};

Mario.PlayOvergroundMusic = function() {
	Mario.PlayMusic("background");
};

Mario.PlayUndergroundMusic = function() {
	Mario.PlayMusic("underground");
};

Mario.PlayCastleMusic = function() {
	Mario.PlayMusic("castle");
};

Mario.StopMusic = function() {
	if (typeof MIDIjs !== "undefined") {
		MIDIjs.stop();
	}
};

Mario.PlayNeverGonnaMusic = function() {
	Mario.PlayMusic("neverGonna");
};

Mario.PlayBohemianMusic = function() {
	Mario.PlayMusic("bohemian");
};
