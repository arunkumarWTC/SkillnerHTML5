Ext.define('SWP.view.player.FlowplayerHTML', {
    extend: 'Ext.Component',
    alias: 'widget.flowplayerhtml',
    id:'flowplayerhtml',
    url: "flowplayer/flowplayer.swf",
    smilUrl: undefined,
    store: undefined,
    queryByFn: Ext.emptyFn,
    timeField: undefined,
    fp: undefined,
    registeredCuepoints : false,
    nextChapterTooltip:SWPPLAYER.NEXT,
    previousChapterTooltip:SWPPLAYER.REPLAY,
    skipChapterTooltip:SWPPLAYER.SKIP,
    tooltipTextColor:'#ff0000',
    cls:'player_screen_scroll',
    tooltipColor:'#ffffff',
   /* html:'<div class="flowplayer" style="background:#777">'+
	    	'<video>'+
	    		'<source type="video/mp4" src="http://stream.flowplayer.org/bauhaus/624x260.mp4">'+
	    		'<track src="Captions1.vtt" default>'+
	    	'</video>'+
    	'</div>',*/
    //html:'<div id="player" class="flowplayer" style="background:#777" > </div>',
    html:'<div id="player" class="flowplayer" style="background:#777;" > </div>',
    initComponent: function() {
    	var me = this;
    	swfobject = flowplayer;
    	
        if (Ext.isEmpty(flowplayer)) {
            Ext.Error.raise('Flowplayer is required');
        }
        
        if (Ext.isEmpty(this.url)) {
            Ext.Error.raise('The "url" config is required for Ext.flash.Component');
        }
        flowplayer.conf = {
    		ratio: '3/4',
    		swf: this.url,
    		analytics: "UA-27182341-1",
    		fullscreen:true,
    		splash:true,
    		embed :false
    		//,native_fullscreen:true
        };       
        
        this.callParent(arguments);
    },
    afterRender: function() {
    	debugger; //kanchan
    	//This code is copied from the Ext.flash.Component as direct calling of the callParent() does
    	//not give the desired result as it works with the swfObject whereas we are using the Flowplayer swfobject
    	var me = this,
        params, vars, undef;
    	 
    	me.skipbutton = Ext.create('Ext.Button', {
		   	text: 'Skip Chapter',
		   	id:'skipchapter',
		   	hidden: true,
		   	renderTo:Ext.getBody(),
		   	handler: function() {
    		   	var grid = Ext.ComponentQuery.query('commentsgrid')[0];
    		    grid.fireEvent('nextchapter',grid);
		   	},
		   	style:'opacity:0.7;z-index:2'
    	});
    	 
    	/*debugger;
    	me.replaybutton = Ext.create('Ext.Button', {
//    		    	text: 'Replay button',
		   	iconCls: 'replay-button',
		   	id:'replaybutton',
		   	hidden: true,
		   	width: 60,
		   	height : 50,
		   	renderTo:Ext.getBody(),
		   	scope : this,
		   	handler: function( btn ) {
		   		Ext.getCmp('nextstepsbutton').setVisible( false );
		    	btn.setVisible( false );
		    	this.fireEvent('replaybutton', this.fp.video.time);
//    			this.clickeventFired = true;
		   	},
		   	style:'opacity:0.9;z-index:199999;top:30%;left:369px !important'
    	});
    		   	
    	me.nextstepsbutton = Ext.create('Ext.Button', {
//    		    	text: 'Next Steps button',
		   	iconCls: 'next-Steps-button',
		   	id:'nextstepsbutton',
		   	hidden: true,
		   	width: 62,
		   	height : 50,
		   	scope : this,
		   	renderTo:Ext.getBody(),
		   	handler: function( btn ) {
    		    Ext.getCmp('replaybutton').setVisible( false );
    		   	btn.setVisible( false );
    		   	this.fireEvent('playbutton', this, me.fp);
//    		     this.getFlowPlayer().resume();
//    		    	me.fireEvent('nextlesson', this);
//    		    	this.clickeventFired = true;
		   	},
		   	style:'opacity:0.9;z-index:99999;top:30%'
    	});*/

			me.style =  { 'background-color': '#000000' };
			me.backgroundColor = '#000000';
	     Ext.Component.superclass.onRender.apply(me,arguments);

	     if(SWPtmp.theme == 'Dark'){
	    	 var themeCanvas = {backgroundColor: "#434343"};
	    	 me.tooltipTextColor ='#646464';
	    	 me.tooltipColor='#C6C6C6';
	    	 me.buttonbackgroundColor= '#cfcfcf';
	    	 me.buttonOverColor='#9e9e9e';
	     } else if (SWPtmp.theme == 'Light'){
	    	 
	    	 var themeCanvas = {backgroundColor: "#e6e6e6"};
	    	  me.tooltipTextColor ='#e0e0e0';
	    	 me.tooltipColor='#444444';
	    	 me.buttonbackgroundColor= '#cfcfcf';
	    	 me.buttonOverColor='#595959';
	     } else {
	    	 var themeCanvas = {backgroundColor: "#434343"};
	     }
	     
	     
	     flowplayer(function (api, root) {
	        	me.fp = api;
	        	me.swpplayer = me.up('swpplayer');
	        	//var playList = api.conf.playlist[0];
	        	//var firstPlayList = playList[0];
	        	//var playURL = firstPlayList['mp4'];
	        	api.bind("load", function () {
	        		api.play(0);
	        		//api.subtitles = [{'title':'Ommmmmmmmm','startTime':'00:00:02.878','endTime':'00:00:10.878','text':'How are you ? what about this!'}];
	        	// do something when a new video is about to be loaded
	        	}).bind("ready", function () {
	        		api.play(0);
	        		//api.cuepoints = [10.4, 23.5, { time: 78, below: true }];
	        		//api.subtitles = [{'title':'Ommmmmmmmm','startTime':'00:00:00.878','endTime':'00:00:10.878','text':'How are you ? what about this!'}];
	        	// do something when a video is loaded and ready to play
	        	}).bind("cuepoint", function (e, api, cuepoint) {
	        		api.pause();
	        		
	        		/*Method to get button position*/
	        		var btnPosition = 'bottom'; //classRoom.getButtoPosition(); /*center or bottom*/
	        		me.btnPosition = btnPosition;
	        		
	        		Ext.select('div[class=fp-uinext]').show();
	        		Ext.select('div[class=fp-uipre]').show();
	        		
	        		/*if click again after cue point on same chapter*/
	        		Ext.select('div[class=fp-uinext-bottom-hide]').replaceCls('fp-uinext-bottom-hide','fp-uinext-bottom');
	        		Ext.select('div[class=fp-uipre-bottom-hide]').replaceCls('fp-uipre-bottom-hide','fp-uipre-bottom');
	        		
	        		/*if want to place buttons at button position*/
	        		if(me.btnPosition == 'bottom') {
	        			Ext.select('div[class=fp-uinext]').replaceCls('fp-uinext','fp-uinext-bottom');
		        		Ext.select('div[class=fp-uipre]').replaceCls('fp-uipre','fp-uipre-bottom');
	        		}
	        		
	        		/*me.replaybutton.setVisible( true );
	        		me.nextstepsbutton.setVisible( true );*/
	            	// do something when a video is loaded and ready to play
	            }).bind("mouseenter", function (e, api, cuepoint) {
	            	//debugger;	
	            	//me.replaybutton.setVisible( true );
	            	//me.replaybutton.addCls('flowplayer')
	            	//me.replaybutton.addCls('is-fullscreen');
	            	//me.nextstepsbutton.addCls('is-fullscreen');
	            	//me.replaybutton.isFullscreen = !0;
	            	//me.nextstepsbutton.isFullscreen = !0;
	            }).bind("fullscreen", function (e, api, cuepoint) {
	            	Ext.select('span[class=fp-toppause]').replaceCls('fp-toppause','fp-toppause-full');
	            	if(me.btnPosition == 'bottom') {
	            		/*bottom position full screen*/
	            		Ext.select('div[class=fp-uinext-bottom]').replaceCls('fp-uinext-bottom','fp-uinext-full-bottom');
		        		Ext.select('div[class=fp-uipre-bottom]').replaceCls('fp-uipre-bottom','fp-uipre-full-bottom');
		        		
		        		/*Ext.select('div[class=fp-btn-container-bottom]').replaceCls('fp-btn-container','fp-btn-container-full');
		        		Ext.select('div[class=fp-uinext-bottom]').replaceCls('fp-uinext','fp-uinext-full');*/
	            	} else {
	            		/*Center position full screen*/
	            		Ext.select('div[class=fp-uinext]').replaceCls('fp-uinext','fp-uinext-full-center');
		        		Ext.select('div[class=fp-uipre]').replaceCls('fp-uipre','fp-uipre-full-center');
	            	}
	            }).bind("fullscreen-exit", function (e, api, cuepoint) {
	            	Ext.select('span[class=fp-toppause-full]').replaceCls('fp-toppause-full','fp-toppause');
	            	if(me.btnPosition == 'bottom') {
	            		/*bottom position exit full screen*/
	            		Ext.select('div[class=fp-uinext-full-bottom]').replaceCls('fp-uinext-full-bottom','fp-uinext-bottom');
		        		Ext.select('div[class=fp-uipre-full-bottom]').replaceCls('fp-uipre-full-bottom','fp-uipre-bottom');
	            	} else {
	            		/*Center position exit full screen*/
	            		Ext.select('div[class=fp-uinext-full-center]').replaceCls('fp-uinext-full-center','fp-uinext');
		        		Ext.select('div[class=fp-uipre-full-center]').replaceCls('fp-uipre-full-center','fp-uipre');
	            	}
	            }).bind("pause", function (e, api, cuepoint) {
	            	console.log('pause is clicked');
	            }).bind("toppause", function (e, api, cuepoint) {
	            	var grid = Ext.ComponentQuery.query('commentsgrid')[0];
					grid.fireEvent('nextchapter',grid);
	            }).bind("replay", function (e, api, cuepoint) {
	            	me.swpplayer.fireEvent('playbutton', me.swpplayer, me.swpplayer.getFlowPlayer());
	            }).bind("nextstep", function (e, api, cuepoint) {
	            	me.swpplayer.fireEvent('replaybutton', me.swpplayer.getFlowPlayer().video.time);
	            });
	        	
	        	//api.load(playURL);
	        });
	     
//	     	var uld = "http://stream.flowplayer.org/bauhaus/624x260.mp4";
//	     	$("#player").flowplayer({
//		     	playlist: [[{ mp4: uld }]],
//		     	tooltip:false,
//		     	cuepoints: [10.4, 23.5, { time: 78, below: true }]
//	     	});
	     //flowplayer.addPlugin("timings", this.timingPlugin);
	     //me.fp = flowplayer(this.getSwfId(),params,flowplayerConf).onLoad(function() { this.stop(); return true; } );
	     //me.fp = flowplayer;//(this.getSwfId(),params,flowplayerConf).onLoad(function() { this.stop(); return true; } );
	     me.getEl().down('div').setHeight('100%');
	     me.getEl().down('div').setStyle({overflow : 'hidden'});
    },
    getPlayer: function() {
    	return this.fp;
    }
});