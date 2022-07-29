
var useBookmark = false;
var limitWebAppToDevice = (location.search.toLowerCase().indexOf('webapp=0')<0);
var stopIFrameOnNewPage = true;
var resetSliderScrollY = true;
var enablePullTabs = true;
var fitTallToWidth = true;
var resetMSOs = true;
var autoPlay = -1;
var useSmoothSwipeOnImageSequences = true;
var bookmarkName = 'in5_bookmark_' + location.href.substr(location.host.length);
var touchEnabled = 'ontouchstart' in document.documentElement;
var pointerEnabled = 'onpointerdown' in document.documentElement;
var clickEv = (touchEnabled) ? 'vclick' : 'click';
if (!window.getComputedStyle) {
    window.getComputedStyle = function(e, t) {
        return this.el = e, this.getPropertyValue = function(t) {
            var n = /(\-([a-z]){1})/g;
            return t == "float" && (t = "styleFloat"), n.test(t) && (t = t.replace(n, function() {
                return arguments[2].toUpperCase();
            })), e.currentStyle[t] ? e.currentStyle[t] : null;
        }, this;
    };
}
var prefix = (function () {
  	var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['','o']))[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return { dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substr(1)};
})();
var pre = (document.createElement('div').style['WebkitTransform'] != undefined) ? '-webkit-' : '';
var useSwipe = false;
var pageMode = 'csv';
var pageW = 595, pageH = 595;
var multifile = false;
if(multifile) { 
	$('html').addClass('multifile'); 
	if(pageMode[0] == 'f') $('html').addClass('fade');
}		
var isLiquid = (pageMode.indexOf('liquid') != -1), flip = (pageMode.indexOf('flip') != -1) && !multifile;
var arrowNav = false;
var lazyLoad = true;
var scaleMode = 'none_desktop';
var webAppType = '';
var useTracker = false;
var shareInfo = {btns:[], align:"left"};
var maxScaleWidth, maxScaleHeight;
var webAppEmailSubject = 'Check out this Web App for {deviceName}';
var webAppEmailBody = 'Add this Web App to Your {deviceName} by visiting: ';
var animationEndEvents = "webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend";
var animationStartEvents= "webkitAnimationStart oanimationstart msAnimationStart animationstart";
var animationItEvents = 'webkitAnimationIteration oanimationiteration MSAnimationIteration animationiteration';
var interactiveSelectors = 'a,button,input,select,textarea,.mejs-overlay-button,map,[onclick],[data-useswipe="1"],[data-tapstart="1"],.panzoom,#viewer-options-wrap';
var sliderSettings = {}, nav = {}, in5 = {layouts:[
 	{
 		"class": "mq-none mq-default",
 		"width": 595.2755905512,
 		"height": 595.2755905512,
 		"default": true
 	}
 ]},
viewOpts = ({title:0, page:0, zoom:0, fs:0, pdf:0, toc:0, thumbs:0, progress:0, bg:"#000", loadText:"loading content...", footer:0});
var uAgent = navigator.userAgent.toLowerCase();
var isIOS = ((/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream), 
	isIPad = uAgent.indexOf("ipad") > -1 || (isIOS && window.devicePixelRatio < 3), isIPhone = uAgent.indexOf("iphone") > -1 || (isIOS && window.devicePixelRatio > 2),
	isWebkit = 'WebkitAppearance' in document.documentElement.style,
	isAndroid = uAgent.indexOf('android') > -1, isChrome = uAgent.indexOf('chrome') > -1,
	isBaker = uAgent.indexOf("bakerframework") > -1, isLocal = (location.protocol === 'file:');
navigator.standalone = navigator.standalone || checkStandalone();
var deviceDimensions = { width: window.innerWidth, height: window.innerHeight };
var isWebView = isIOS && uAgent.indexOf('safari') === -1 && !navigator.standalone;
if(isLocal) $('html').addClass('local');
if(location.href.indexOf('OverlayResources') !== -1) $('html').addClass('dps');
if(isBaker) { useSwipe=!1; $('html').addClass('baker'); }
if(isIPad || isIPhone) { $('html').addClass('ios'); }
if(uAgent.indexOf('safari') > -1 && !isChrome) {
$('html').addClass('safari');
if(uAgent.indexOf('windows') > -1){$('html').addClass('win-safari')};
window.setInterval=function(f,t){var i=window.setInterval.count?++window.setInterval.count:window.setInterval.count=1;var a=arguments;window.setInterval[i]=function(){if(window.setInterval[i].active){if(typeof f=="string"){eval(f)}else if(a.length>2){f.apply(this,Array.prototype.slice.call(a,2))}else{f()}setTimeout(window.setInterval[i],t)}};window.setInterval[i].active=!0;setTimeout(window.setInterval[i],t);return{intervalId:i}};window.clearInterval=function(e){window.setInterval[e.intervalId].active=!1}
}

function checkStandalone(){
	if(location.search.toLowerCase().indexOf('standalone=1')>-1 || matchMedia('(display-mode: standalone)').matches) { return !0; }
	if(isAndroid && uAgent.match(/chrome.(?:(3[8-9])|(?:[4-9][0-9]))/i) ){ return (screen.height-window.outerHeight<80); }
	return !1;
}

function go(e, objArr, triggerEvent){ 
	if(triggerEvent === 'pageload'){
		var now = new Date().getTime(), goContent = JSON.stringify(objArr);
		if(in5.lastGoStart && now - in5.lastGoStart<200 && in5.lastGoContent == goContent){return;}
		in5.lastGoStart=now, in5.lastGoContent=goContent;
	}
	new AnimationSequence(e,objArr,triggerEvent); 
}
function playAnim(e,item,objArr){ new AnimationItem(objArr,{pointer:-1,next:function(){}}).go(); }
function AnimationSequence(e, objArr, triggerEv){
	this.triggerEvent = triggerEv, this.incomingEvent = e, this.endCount = 0, 
	this.items=[], this.pointer=-1, this.groups;
	var i=0, len = this.length = objArr.length, itemObj, lastLinked, iGroup, animItem, prevItem;
	for(i;i<len;i++){
		itemObj = objArr[i];
		animItem = new AnimationItem(itemObj, this);
		this.items.push(animItem); 
		if(lastLinked === undefined && itemObj.link){
			iGroup = new AnimationGroup(this, i);
			iGroup.push(animItem);
		} else if(lastLinked){ iGroup.push(animItem); }
		if(prevItem && prevItem.link) { prevItem.playSync=!0; }
		lastLinked = itemObj.link;
		prevItem = animItem;
	}
	this.update = function(){
		this.endCount++;
		if(this.endCount === this.length) { $(document).trigger('animationSequenceEnd'); }
	};
	this.next = function(){
		if(this.pointer === null) return;
		this.pointer++;
		if(this.pointer >= this.length) { this.pointer=null; $(document).trigger('animationSequenceEnd'); return; }
		var item = this.items[this.pointer];
		item.go();
	};
	this.next();
}
AnimationSequence.prototype.name = "AnimationSequence";
AnimationSequence.prototype.toString = function(){return this.name;};

function AnimationGroup(parentSeq, startIndex){
	this.children = [], this.sequence = parentSeq, this.startIndex = startIndex,
	this.loopCount = 0, this.pointer = 0;
	this.push = function(animItem){ 
		this.children.push(animItem); animItem.group = this; animItem.groupIndex = this.children.length-1; 
		if(!animItem.link && animItem.groupLoops > 1){
			this.loops = animItem.groupLoops;
			this.lastItem = animItem;
			animItem.$element.one(animItem.loops !==1 ? animationItEvents : animationEndEvents, function(e){
				var aItem = $(this).data('animationItem'), aGroup = aItem.group;
				if(!aItem.groupMode) { aItem.next(); }
				aItem.groupMode=!0;
				aGroup.children[0].delay = 0;
			});
		}
	};
	this.next = function(){
		if(this.loopCount+1 < this.loops){
			var item = this.children[this.pointer];
			this.pointer++;
			if(this.pointer >= this.children.length) { this.loopCount++; this.pointer = 0; }
			item.groupMode=!0;
			item.go();
		}
	};
	this.update = function() {};
}
AnimationGroup.prototype.name = "AnimationGroup";
AnimationGroup.prototype.toString = function(){return this.name;};

function AnimationItem(obj, seq){
	this.data = obj, this.dataID = obj.id, this.$element = $('[data-id='+this.dataID+']').not('video,audio,object'),
	this.element = this.$element[0], this.action = obj.act, this.sequence = seq,
	this.animCSS = this.$element.attr('data-ani'), this.loops = obj.n, this.groupLoops = obj.sn, this.delay = obj.del,
	this.hideStart = this.$element.attr('data-hidestart')==='1',this.hideEnd=this.$element.attr('data-hideend')==='1',
	this.unroll = obj.unroll, this.link = obj.link, this.index = seq.pointer;
	this._prep = function(){
		switch(this.action) {
			case 'reverse': this.reverse(); break;
			case 'play': this.play(); return !1;
			case 'stop': this.$element.css(pre+'animation','none'); return !1;
			case 'pause': this.$element.css(pre+'animation-play-state','paused'); break;
			case 'resume': this.$element.css(pre+'animation-play-state','running'); break;
			case 'stopall': $('.activePage').find('[data-ani]').css(pre+'animation','none'); break;
		}
	}, this._forceRedraw = function() { this.element.offsetWidth = this.element.offsetWidth; },
	this.reset = function() {this.$element.css(pre+'animation',''); this.active=!1; return this;},
	this.stop = function() {this.$element.css(pre+'animation','none'); this.active=!1; return this;},
	this.pause = function() {this.$element.css(pre+'animation-play-state','paused'); this.active=!1; return this;},
	this.play = function(){
		if(!this.$element.length) { this.next(); return; }
		this.reset();
		this._forceRedraw(), this.active=!0;
		var ani = this.animCSS, delay = (this.delay) ? this.delay+'s' : '0s', 
			dir = (this._reverse) ? 'reverse' : 'normal';
		if(this.loops && this.loops != 1) ani = ani.replace(/(?:\d+$)/,this.loops);
		if(!this._unrolling) {
			if(this.unroll) { this.setRollOff(); }
			if(this.sequence.length) {
				var animEvent = this.playSync ? animationStartEvents : (this.loops !==1 ? animationItEvents : animationEndEvents);
				this.$element.data('animationItem',this).one(animEvent, function(e){ 
				$(this).data('animationItem').next(); 
				});
			}
		}
		this.$element.css({animation:ani, '-webkit-animation':ani, 
		'animation-delay':delay, '-webkit-animation-delay':delay, 
		'animation-direction':dir, '-webkit-animation-direction':dir}).removeClass('hidden');
		if(this.$element.parents('.pageItem').hasClass('hidden') || !this.$element.parents('.activePage').length) { this.next() };
		return this;
	}, this.reverse = function() { this._reverse = 1; return this.play(); }, 
	this.doRollOff = function() { this._unrolling=1; this.reverse(); this._unrolling=0; },
	this.setRollOff = function(){
		$(this.unroll).data('unrollItem',this).one('mouseleave', function(e) { $(this).data('unrollItem').doRollOff();  });
	}, this.next = function() { var parent = this.groupMode ? this.group : this.sequence; parent.update(); this.active=!1; parent.next(); },
	this.go = function(){ if(this._prep()){this.play();}return !0;};
	this.init = function(){
		this.hideEnd && this.$element.removeClass('hidden');
		this.hideStart && this.$element.addClass('hidden');
		this.stop();
		return this;
	};
	this.init();
}
AnimationItem.prototype.name = "AnimationItem";
AnimationItem.prototype.toString = function(){return this.name;};

function toggleAudio(btn){
	var elem = $(btn).siblings('audio')[0];
	if(elem == undefined) elem = $(btn).siblings().find('audio')[0];
	if(elem == undefined) return;
	try{
	var player = elem.player || elem, media = player.media || elem;
	if(media.paused) player.play();
	else player.pause();
	} catch(e){}
}


function resumeMedia(dataID) { playMedia(dataID,-1); }
function playMedia(dataID, from) {
	var elem = $('audio,video').filter('[data-id=' + dataID + ']')[0];
	if(elem == undefined) return;
	try{
		var player = elem.player || elem;
		if(from == undefined) from = 0;
		if(from > -1) elem.currentTime = from;
		player.play();
		/*try{ setTimeout(function(){player.setCurrentTime(from);}, 500); }catch(e){}*/
	} catch(e){console.log(e);}
}

function stopMedia(dataID){ pauseMedia(dataID,!0); }
function pauseMedia(dataID, rewind) {
	var elem = $('audio,video').filter('[data-id=' + dataID + ']')[0];
	if(elem == undefined) return;
	try{
	var player = elem.player || elem;
	player.pause();
	if(rewind) elem.currentTime = 0;
	} catch(e){}
}

function stopAllMedia(targ,opts) {
	if(!targ) targ = document;
	switch(opts.src){
		case 'doc': case 'btn': opts.force = 1;
	}
	$(targ).find('audio,video').each(function() {
		var media = this, player = media.player || media;
		if(!opts.force && media.getAttribute('data-nostop') == '1') { return !1; }
		try{player.pause(); media.currentTime = 0; 
		$(this).parents(".mejs-inner").find(".mejs-poster").show().find('img').show(); /*reshow poster*/
    	}catch(e){}
	});
}

function stopIframe(targ){
	$(targ).find('iframe').each(function(index,elem){
		var j = $(elem), src = j.attr('src');
		j.attr('src', '');
		if(j.attr('data-src')) j.siblings('.cover').show();
		else j.attr('src', src);
	});
}

function autoPlayMedia(i,elem) {
	if($(elem).parents('.state').not('.active').length) return; /*skip hidden video in MSOs*/
	var delay = parseFloat($(elem).attr('data-autodelay'))* 1000 || 250+i;
	try{ setTimeout(function(){var player = elem.player || elem; player.play();}, delay); }catch(e){}
}	

function clearLastPage($prevActive){
	if(stopIFrameOnNewPage) { stopIframe($prevActive); };
	/*clearAnimation($prevActive);*/
}

function clearAnimation($targ){ $targ.find('[data-ani]').css(pre+'animation','none'); }

function onNewPage(e, data){
	seqPos = 0;
	if(!multifile) stopAllMedia(undefined,{src:'page'});
	if(data == undefined || data.index == undefined) return;
	if(!multifile) {
		if(data.slider && data.slider.scrollAdjust){
			data.slider.scrollAdjust();
			delete data.slider.scrollAdjust;
		} else if(resetSliderScrollY && sliderSettings.useSlider && $(window).scrollTop()>2){$(window).scrollTop(0);}
		$('.page [data-hidestart]').addClass('hidden').filter('.mso.slideshow[data-autostart=1]').each(function(ind,elem){
			toState($(elem).attr('data-id'),0);/*reset slideshow*/
		});
		$('.page [data-hidestart]').addClass('hidden');
		if(resetMSOs) { $('.page-scale-wrap .mso').each(function(ind,elem){ toFirstState(elem); }); }
		if(!data.slider) clearLastPage($('.activePage'));
		nav.previousPageIndex = (nav.current||1)-1;
		nav.current = data.index+1;
		setStoredPage(nav.current);
		if(lazyLoad && !data.view) loadImages(data.index);
	}
	var activePages = [], $pages=$('.page').removeClass('activePage'),$active;
	if(data.view){
		var pageObjs = $sl.data().pageObjs;
		if(data.view[0] > 0 && pageObjs[data.view[0]]) activePages.push(pageObjs[data.view[0]]);
		if(data.view[1] > 0 && pageObjs[data.view[1]]) activePages.push(pageObjs[data.view[1]]);
		nav.activeView = data.view, $active = $(activePages);
		if(lazyLoad) {
			loadPageImages(pageObjs[data.view[0]]); 
			if(data.view[1]){
				loadPageImages(pageObjs[data.view[1]]);
				setTimeout(function(){loadPageImages(pageObjs[data.view[1]+1]); loadPageImages(pageObjs[data.view[1]+2]);},100);
			} else {
				setTimeout(function(){loadPageImages(pageObjs[data.view[0]+1]);},100);
			}
			if(data.view[0]>3){ setTimeout(function(){loadPageImages(pageObjs[data.view[0]-2]); loadPageImages(pageObjs[data.view[0]-1]);},250);}
		}
	} else { 
		$active = $pages.eq(data.index);
	}
	var refreshPage=!1;
	$active.each(function(index,el) {
		var $el = $(el).addClass('activePage').show(), aniLoad = $el.find('.page-scale-wrap:visible').attr('data-ani-load');
		$el.find('audio,video').filter('[data-autoplay]').each(function(i,elem){autoPlayMedia(i, elem)});
		if(aniLoad && aniLoad.length) setTimeout(function(){ eval(aniLoad); },1);/*to do:remove timeout*/
		if(refreshPage || (data.view && !$el.is(':visible'))){ $el.parents('.turn-page-wrapper').redraw(), refreshPage=!0; }
	});
	$('.activePage .cover').filter('[data-delay]').each(function(index,el){
		setTimeout(function(){ $(el).trigger(clickEv); }, parseFloat($(el).attr('data-delay'))*1000 );
		return !1;
	});
	$('.activePage .mso > .state.active').trigger('newState');
	if(isLiquid){
		$active.find('.page-scale-wrap:visible').each(function(index,el){
			var $el = $(el);
			if($el.hasClass('tall-page')) { $el.parent().addClass('tall-page'); }
			else { $el.parent().removeClass('tall-page'); }
		});
	}
	$(document).trigger('pageRendered', data);
}

function loadImages(pageIndex) {
	var pages = $('.page'), layoutIndex = window.currentLayout || 0;
	loadPageImages(pages.eq(pageIndex).find('.page-scale-wrap').eq(layoutIndex));
	loadPageImages(pages.eq(pageIndex+1).find('.page-scale-wrap').eq(layoutIndex));
	if(pageIndex > 0){ loadPageImages(pages.eq(pageIndex-1).find('.page-scale-wrap').eq(layoutIndex)); }
}

function loadPageImages(targPage){
	if(targPage && !targPage.data('loaded')){
		targPage.find('img').filter('[data-src]').each(function(index,el){ 
			var $el = $(el);
			if((!isWebkit || !isLocal) && $el.hasClass('svg-img')){
				if ($el.siblings().length) $el.wrap('<div class="pageItem"/>');
				$el.parent().load($el.attr('data-src')+' svg',function(resp,status,xhr){
					if(status==='error'){$el.attr('src', $el.attr('data-src'));}
				});
			} else{$el.attr('src', $el.attr('data-src'));}
			$el.removeAttr('data-src');
		});
		targPage.data('loaded',!0);
	}
}

/*to do:check for when multiple pages are visible*/
function checkScroll(e, mode){
	if(window.scrolling) return;
	var docMin, docMax, docSpan, elemSpan, elemMin, elemMax, elemCenter, 
	$lastPage, vertMode = (mode === 'v'), scale = window.scaleLayoutFunc ? scaleLayoutFunc(!0) : 1, $win = $(window);
	docMin = (vertMode) ? $win.scrollTop() : $win.scrollLeft();
	docMax = (vertMode) ? docMin + $win.height(): docMin + $win.width();
	docSpan = docMax - docMin;
	$('.pages .page').not('.activePage').each(function(index,elem) {
    	var $elem = $(elem);
    	elemMin = (vertMode) ? Math.floor($elem.offset().top) : Math.floor($elem.offset().left);
    	elemMax = (vertMode) ? Math.ceil(elemMin + $elem.height()*scale) : Math.ceil(elemMin + $elem.width()*scale);
    	elemSpan = elemMax - elemMin;
    	if(docSpan <= elemSpan+9) {
    		elemCenter = elemMin + elemSpan*.5;
    		if(elemCenter < docMax && elemCenter > docMin){
    			$(document).trigger('newPage', {index:$elem.index()});
				return;
    		} else if((elemMax >= docMax) && (elemMin <= docMin)) {
				$(document).trigger('newPage', {index:$elem.index()});
				return;
			}
    	} else if((elemMax <= docMax) && (elemMin >= docMin)) {
    		$(document).trigger('newPage', {index:$elem.index()});
    		return;
		}
    });
}

function onNewState(e){
	var targState = $(e.target).show();
	var aniLoad = targState.attr('data-ani-load');
	if(aniLoad && aniLoad.length) eval(aniLoad);
	stopAllMedia(targState.siblings('.state'),{src:'state'});
	targState.find('audio,video').filter('[data-autoplay="1"]').each(function(i,elem){autoPlayMedia(i, elem)});
	targState.find('[data-autostart="1"]').each(function(i,el){toFirstState(el); startSlideShowDelayed(el); });
	$otherStates = targState.siblings('.state');
	$otherStates.find('[data-hidestart]').addClass('hidden');
	stopIframe($otherStates);
	clearAnimation($otherStates);
}

function checkSlideLoop(mso,rev){
	mso.each(function(index,elem) {
		if(elem.hasOwnProperty('loopcount')) {
			elem.loopcount++;
			if(elem.loopmax != -1 && elem.loopcount >= elem.loopmax) { stopSlideShow(elem); $(document).trigger('slideShowComplete', {"mso":mso}); return !0; }
		}
		if(elem.crossfade > 0) {
			var el = $(elem).removeClass('hidden');
			var last = el.children('.state.active').removeClass('active').addClass('transition').show().fadeOut(elem.crossfade, function(){$(this).removeClass('transition')});
			var ondeck = rev ? el.children('.state').last() : el.children('.state').first();
			ondeck.addClass('active').hide().fadeIn(elem.crossfade, function(e) { last.hide();}).trigger('newState');
		} else if(rev) { $(elem).removeClass('hidden').children('.state').removeClass('active').last().addClass('active').trigger('newState');
		} else $(elem).removeClass('hidden').children('.state').removeClass('active').first().addClass('active').trigger('newState');
	});	
	return !1;
}


function nextState(dataID, loop) {
	var mso = $('[data-id=' + dataID + ']');
	if(mso.attr('class').indexOf('flipcard-') > -1) { 
		if(loop && checkSlideLoop(mso)) { return !1; }
		mso.toggleClass('flipped');  return !1; 
	}
	var states = mso.first().children('.state');
	var current = states.siblings('.active').index();
	if(current+1 < states.length) {
		mso.each(function(index,elem) {
			if(elem.crossfade > 0) {
				var el = $(elem).removeClass('hidden');
				var last = el.children('.state.active').removeClass('active').addClass('transition').show().fadeOut(elem.crossfade, function(){$(this).removeClass('transition')});
				el.children('.state').eq(current+1).addClass('active').hide().fadeIn(elem.crossfade, function(e) { last.hide();}).trigger('newState');
			} else $(elem).removeClass('hidden').children('.state').removeClass('active').eq(current+1).addClass('active').trigger('newState');
		});
	} else if(loop && checkSlideLoop(mso)) { return; }
}


function prevState(dataID, loop) {
	var mso = $('[data-id=' + dataID + ']');
	var states = mso.first().children('.state');
	var current = states.siblings('.active').index();
	if(mso.attr('class').indexOf('flipcard-') > -1) { 
		if(loop && checkSlideLoop(mso,!0)) { return !1; }
		mso.toggleClass('flipped');  return !1; 
	}
	if(current-1 > -1) {
		mso.each(function(index,elem) {
	 		if(elem.crossfade > 0) {
				var el = $(elem).removeClass('hidden');
				var last = el.children('.state.active').removeClass('active').addClass('transition').show().fadeOut(elem.crossfade,function(){$(this).removeClass('transition')});
				el.children('.state').eq(current-1).addClass('active').hide().fadeIn(elem.crossfade,function(e) { last.hide();}).trigger('newState');
			} else $(elem).removeClass('hidden').children('.state').removeClass('active').eq(current-1).addClass('active').trigger('newState');
		});
	} else if(loop && checkSlideLoop(mso,!0)) { return; }
}


function toState(dataID, stateIndex, restoreOnRollOut, restoreTarg){
	if(restoreOnRollOut) {
		var current = $('[data-id=' + dataID + ']').children('.state.active').first().index();
		$(restoreTarg).mouseleave(function() { toState(dataID, current); });
	}
	$('[data-id=' + dataID + ']').each(function(index,elem) {
		var $el = $(elem);
		if($el.attr('class').indexOf('flipcard-')>-1){$el[stateIndex>0?'addClass':'removeClass']('flipped').trigger('newState').children().attr('display','');return !1;}
		$el.removeClass('hidden').children('.state').removeClass('active').hide().eq(stateIndex).addClass('active').show().trigger('newState');
		if(elem.playing) stopSlideShow(elem);
	});
}

function toFirstState(el) { var f = (el.reverse) ? $(el).children('.state').length-1 : 0; toState($(el).attr('data-id'), f); }

function startSlideShowDelayed(el) { 
	var mso=$(el); 
	mso.removeClass('hidden');
	setTimeout(function(){ startSlideShow(el); }, parseFloat(mso.attr('data-autostartdelay'))*1000 + (mso.is(':visible')?el.duration*1000:0)); 
}

function startSlideShow(el){
	if(el.playing || $(el).is(':hidden')) return;
	el.playing=!0, el.loopcount=0;
	var func = (el.reverse) ? prevState : nextState;
	el.playint = setInterval(function(){ func($(el).attr('data-id'),!0 ); }, el.duration*1000);
	func($(el).attr('data-id'),!0 );
}

function stopSlideShow(elem) {
	elem.playing=!1;
	if(elem.hasOwnProperty('playint')) clearInterval(elem.playint);
	$(elem).find('.state').css('display','').css('opacity','1');
}

function hide(dataID) { $('[data-id=' + dataID + ']').addClass('hidden'); }
function show(dataID) { $('[data-id=' + dataID + ']').removeClass('hidden'); }
function loadFrame(iframe){ iframe.src = $(iframe).attr('data-src'); }
function animateImageSeq(dir,rev,msoID,loopSwipe,velocity,startTime){
	var friction = .5, mass = 2000, framerate = 30;
	switch (dir) {
    case 'left':
      if (rev) prevState(msoID, loopSwipe);
      else nextState(msoID, loopSwipe);
      break;
    case 'right':
      if (rev) nextState(msoID, loopSwipe);
      else prevState(msoID, loopSwipe);
      break;
	}
	velocity = velocity - (velocity * friction / mass) * (Date.now() - startTime);
	if(1/velocity < 1000/framerate){ setTimeout(function(){ 
		animateImageSeq(dir,rev,msoID,loopSwipe,velocity,startTime) }, 1/velocity ); }
}
function calculateVelocity(e, dist, dur) {
	var mouse_ratio = 20 / getCurrentScale($('#container')), touch_ratio = 1;
  return dist / dur / (e.pageX ? mouse_ratio : touch_ratio);
}
function initWebApp(){
	if(location.search.toLowerCase().indexOf('webapp=0')>-1 || navigator.standalone) return !1;
	var isDevice, deviceName, nameForNonDeviceFile = webAppType, nameForDeviceFile = webAppType, styleStr="position:fixed;width:100%;";
	switch(webAppType){
		case 'ipad': deviceName2 = deviceName = 'iPad'; isDevice = isIPad; break;
		case 'iphone': deviceName2 = deviceName = 'iPhone'; isDevice = isIPhone; styleStr+="bottom:0;"; break;
		case 'android': deviceName2 = deviceName = 'Android'; isDevice = isAndroid; break;
		default:
			deviceName = 'Mobile'; deviceName2 = 'Mobile Device';
			isDevice = (isAndroid || isIPad || isIPhone);
			nameForDeviceFile = (isAndroid) ? 'android' : ((isIPad) ? 'ipad' : 'iphone');
	}
	if(isDevice){
		if(!navigator.standalone) {
			$('#container-wrap').hide();
			$('#share-wrap').hide();
			if(window.stop && !$('html').is('[manifest]')/*does not have app cache*/){
				window.stop();
				$('body').addClass('loaded');
			}
			if(uAgent.indexOf('crios/')>-1){
				$('body').css({'background':'#fff','padding':'20px'}).append('<p style="font-family:sans-serif;">In order to install this Web App to your Home Screen, you will need to open it with <strong style="font-weight:bold;">Safari</strong>.<br><br><em style="font-style:italic;">Install to Home Screen</em> is not supported in Chrome.<br><br>You can copy and paste the web address above.</p>');
				return !0;
			}
			$('body').addClass('webapp-instructions').css('background','#fff)').append('<img style="'+styleStr+'" src="assets/images/add_to_home_'+nameForDeviceFile+'.png" />');
			return !0;
		}
	} else if(limitWebAppToDevice) {
		$('#container-wrap').hide();
		$('#share-wrap').hide();
		if(window.stop){
			$('body').addClass('loaded').find('#toloadIndicator').hide();
			window.stop();
		}
		var sendLinkURL = 'mailto:?subject=' + escape(webAppEmailSubject.split('{deviceName}').join(deviceName)) +'&amp;body=' + escape(webAppEmailBody.split('{deviceName}').join(deviceName2)) +
		(location.protocol == 'file:' ? '%28Post%20to%20a%20web%20server%20to%20show%20URL%29' : location.href) +'"><img src="assets/images/non_'+nameForNonDeviceFile+'.png';
		$('body').addClass('webapp-instructions').css('background','#fff').append('<a href="'+sendLinkURL+'" /></a>').find('#container-wrap').hide();
		return !0;
	}
	return !1;
}


function initClickEvents(){
	$('#container').find('*').each(function(index,el){
		var clickArr=[],$el=$(el),args,postArr=[];
		$.each(el.attributes,function(ind,attrib){
			var at=attrib.name, aval=attrib.value;
			switch(at){
				case 'onclick': postArr.push(function(){$el.attr('data-onclick',aval).removeAttr(at);}); clickArr.push(function(event){eval($el.attr('data-onclick'));/*name must be 'event'*/ }); break;
				case 'data-ani-click': clickArr.push(function(e){ if($(e.target).closest(interactiveSelectors,$el).length>0)return; /*exclude clicks on these*/
			if($el.parent().hasClass('activePage')) eval(aval); }); break;
				case 'data-click-show': clickArr.push(function(e){ $.each(aval.split(','), function(i,val){ show(val); }); }); break;
				case 'data-click-hide': clickArr.push(function(e){ $.each(aval.split(','), function(i,val){ hide(val); }); $el.parent('a').trigger(clickEv); }); break;
				case 'data-click-next':clickArr.push(function(e){ args=($el.attr('data-loop')=='1'); $.each(aval.split(','), function(i,val){ nextState(val,args); }); }); break;				
				case 'data-click-prev': clickArr.push(function(e){ args=($el.attr('data-loop')=='1'); $.each(aval.split(','), function(i,val){ prevState(val,args); }); }); break;
				case 'data-click-state': clickArr.push(function(e){ $.each(aval.split(','), function(i,val){ args=val.split(':'); toState(args[0],args[1]); }); }); break;
				case 'data-click-play': clickArr.push(function(e){ $.each(aval.split(','), function(i,val){ args=val.split(':'); playMedia(args[0],args[1]); }) });	break;
				case 'data-click-resume': clickArr.push(function(e){ $.each(aval.split(','), function(i,val){ args=val.split(':'); resumeMedia(args[0]); }) });	break;
				case 'data-click-pause': clickArr.push(function(e){$.each(aval.split(','), function(i,val){ pauseMedia(val); }) }); break;
				case 'data-click-stop': clickArr.push(function(e){ $.each(aval.split(','), function(i,val){ pauseMedia(val,!0);}) }); break;
				case 'data-click-stopall': clickArr.push(function(e){stopAllMedia(undefined,{src:'btn'});}); break;
			}
		});
		$.each(postArr,function(i,func){func();});
		var pd = el.nodeName === 'LABEL' || $el.parent('a').length ? !1 : touchEnabled || clickArr.length===1;
		if(clickArr.length) { $el.on(clickEv,function(e){$.each(clickArr,function(i,func){func.call(el,e);}); $(this).parents('a').trigger(clickEv); if(pd){return !1;} e.stopPropagation();  }); }
		else if(el.nodeName==='A'){
			$el.on(clickEv,function(e){
				if(e.target.nodeName==='LABEL'){
					var $targ = $(this).find('input.choice');
					$targ.prop("checked", !$targ.prop("checked")).parents('a').each(function(i,a){
						$a=$(a),href=$a.attr('href');
						if(href.indexOf('javascript:')===0){eval(href);}
						else{window.open(href,$a.attr('target'));}
					});
					return !1;
				}
			});
		}
	});
}

function printForm(el){ window.print(); }

function submitForm(el,url){
	if(!url || !url.length){
		var $state = $(el).parents('.mso >.state'), $mso = $state.parents('.mso').first(), val = $state.find('input.choice:checked').val();
		if($mso.length){
			var $valState = $mso.find('.state[name="'+val+'"]');
			if($valState.length){ toState($mso.attr('data-id'), $valState.index()); }
		}
	}
}

function clearForm(el){
	var $g = $(el).parents('.group,.mso,.page').first();
	$g.find('input.choice').prop('checked',!1);
	$g.find('input:not(.choice),textarea').val('');
}

$(window).on('hashchange', function(e){ checkHashData(e); });
function checkHashData(e){
	if(multifile){
		var hash = location.hash.split('#').join('');
		if(hash.length){
			var pie = hash.split('&'), plen = pie.length, piece, parts, $c = $('#container'),
			offset = $c.offset(), cScale = getCurrentScale($c);
			while(plen--){
				piece = pie[plen], parts = piece.split('=');
				switch(parts[0]){
					case 'refy':$(document).scrollTop(parseInt(parts[1])*cScale + offset.top); break;
				}
			}
		}
	} else {
		var p = getHashPage();
		if(p > 0) nav.to(p);
		else if(e && $.scrollTo && !!$(window).scrollTop()){checkScroll(e,pageMode.substr(2,1));} 
	}
}

function initPullTabs(){
	if(enablePullTabs) {
	$('.scroll-horiz > *').each(function(index,elem){
		var $elem = $(elem), left = parseFloat($elem.css('left'));
		if(left < -5){ 
			var $parent = $elem.parent('.scroll-horiz');
			if(!$parent.data('wrapped')) {
				$parent.data('wrapped',!0).children().wrapAll('<div class="pageItem group" />').parent().css(pre+'transform', 'scaleX(-1) translateX(-'+$parent.width()+'px)');
				$parent.addClass('pulltab-left');
			}
		}
	});
	$('.scroll-vert > *').each(function(index,elem){
		var top = parseFloat($(elem).css('top'));
		if(top < -5){ $(elem).css({top:'auto',bottom:top+'px'}).attr('style', $(elem).attr('style').replace(/( \!important)*;/g,' !important;')).parent('.scroll-vert').addClass('pulltab-top'); }
	});
	}
}

function initAnimationAttribs() {
	var $ani = $('[data-ani]');
	$ani.on(animationEndEvents, 
		function(e){
		var jel = $(this);
		if((jel.attr('style')||'').indexOf('reverse')<0) {
			if(jel.attr('data-hideend')=='1') jel.addClass('hidden');
		}else { 
			jel.css(pre+'animation', 'none'); 
			if(jel.attr('data-hidestart')=='1') jel.addClass('hidden');
		}
        return !1;
	}).each(function(index,el){
		var $el = $(el),hs=($el.attr('data-hidestart')=='1'),he=($el.attr('data-hideend')=='1');
		if(!multifile && (hs || he)){
		$(document).on('newPage',function(e,data){
			var onpage = $.contains($('.page').eq(data.index)[0],el),style=$el.attr('style')||'';
			if(!onpage || nav.numPages === 1){
				if(he) $el.removeClass('hidden');
				if(hs) $el.addClass('hidden');
				$el.attr('style',style.replace(/(?:animation[^;]+;*\s*)/,'')); 
			}
		}); }
	});
}

function initMSOs(){
	var $msos = $('.mso');
	if(!$msos.length) return;
	$msos.filter('.flipcard-up,.flipcard-side').on(clickEv,function(e){if(!$(e.target).parents('a').length){$(this).toggleClass('flipped');return !1;}});
	$msos.find('.state').on('newState', function(e){ onNewState(e); });
	$msos.filter('.slideshow').each(function(index,el) {
		var mso = $(el), msoID = mso.attr('data-id'), loopSwipe = (mso.attr('data-loopswipe') == '1');
		var msoSwipe = (mso.attr('data-useswipe') == '1');
		el.duration = parseFloat(mso.attr('data-duration'));
		el.loopmax = parseInt(mso.attr('data-loopmax'));
		el.crossfade = parseFloat(mso.attr('data-crossfade')) * 1000;
		el.reverse = mso.attr('data-reverse') == '1';
		el.pageIndex = mso.parents('.page').index();
		if(mso.attr('data-tapstart') == '1' && !msoSwipe) {
			mso.on(clickEv, function(e) {
			if(!this.playing) startSlideShow(this);
			else stopSlideShow(this);
			return !1;
			});
		}
		if(mso.attr('data-autostart') == '1') {
			if(mso.parents('.activePage').length) startSlideShowDelayed(el);
			$(document).on('pageRendered', function(e, data) {
				if(mso.parents('.activePage').length) startSlideShowDelayed(el);
				else if (el.playing) stopSlideShow(el);
			});
		}
		
		if(msoSwipe) {
			if(useSmoothSwipeOnImageSequences && mso.hasClass('seq')){
				var triggerDist, lastPos,rev = el.reverse;
				mso.parents('.page-scale-wrap').on(pointerEnabled ? 'pointerdown' : 'vmousedown', function(e) {
					in5.msoTarget = (e.target == el || $(e.target).parents(el).length ) && $(e.target).parents('.activePage').length; /*track swipe trig by mso*/
				}).swipe({
					allowPageScroll:'vertical',fingers:1,maxTimeThreshold:9999,triggerOnTouchLeave:!0,
					swipeStatus:function(evt,phase,dir,dist,dur,fingers,fingerData,currentDir) {
						if (!in5.msoTarget) return;
						switch(phase){
							case 'move':
								stepDist = Math.abs(dist - lastPos);
								if(stepDist < triggerDist) return;
								switch(currentDir){
									case "left":
										if(rev) prevState(msoID, loopSwipe);
										else nextState(msoID, loopSwipe);
										lastPos = dist;	
										break;
									case "right":
										if(rev) nextState(msoID, loopSwipe);
										else prevState(msoID, loopSwipe);
										lastPos = dist;	
										break;
								}
								break;
							case 'start': lastPos = 0; triggerDist = mso.width()/mso.find('.state').length*.5; break;
							case 'end':animateImageSeq(currentDir,rev,msoID,loopSwipe,calculateVelocity(evt, dist, dur), Date.now()); break;
						}
					},
				});
			} else {
				mso.swipe({
				allowPageScroll:'vertical', fingers:1, triggerOnTouchEnd:!1, triggerOnTouchLeave:!0,
				swipe:function(event, direction, distance, duration, fingerCount) {
					switch(direction) {
						case "left":
							if(el.reverse) prevState(msoID, loopSwipe);
							else nextState(msoID, loopSwipe);
							break;
						case "right":
							if(el.reverse) nextState(msoID, loopSwipe);
							else prevState(msoID, loopSwipe);
							break;		
					}
				} });
			}
		}
	});
}

function initLightbox(){
	$('.lightbox').filter(':not(svg *)').filter(':not([href*=lightbox\\=0])').filter(isBaker?':not([href*=referrer\\=Baker])':'*').colorbox({iframe:!0, width:"85%", height:"85%"});
		$('svg .lightbox').each(function(index,el){
			var jel = $(el);
			var xref = jel.attr('xlink:href');
			if(xref.indexOf('lightbox=0') != -1) return;
			if(!isBaker || xref.indexOf('referrer=Baker') != -1){
				jel.on(clickEv, function(){
				$.colorbox({iframe:!0, width:"85%", height:"85%", href:$(this).attr('xlink:href')});
				return !1;
				});
			}
		});
		$('.thumb').colorbox({maxWidth:"85%", maxHeight:"85%"});
		$('[aria-details]').each(function(index,el){
			var jel=$(el), det = jel.attr('aria-details'), jid = jel.attr('id')||'',ext = det.slice(-5) === '.html';
			jel.on(clickEv,function(){
			if(ext){
					var colorboxProps;
					if (isWebView) {
						var maxW = deviceDimensions.width*0.85, maxH = deviceDimensions.height*0.85,
						top = (deviceDimensions.height - maxH)*.5, left = (deviceDimensions.width - maxW)*.5;
						colorboxProps = {iframe:!1, width:"85%", maxWidth: maxW, height:"85%", maxHeight: maxH, top:top, left:left, href:det};
					}else { colorboxProps = {iframe:isLocal&&pre.length/*chrome loc fallback*/, width:"85%", maxWidth:"600px", height:"85%", href:det} };
					$.colorbox(colorboxProps);
				}
				else $.colorbox({inline:!0, width:"85%", height:"85%", href:$('#'+det)});
				return !1;
		}); });
		$(window).on('resize orientationchange', function(e){ if($('#cboxWrapper:visible').length) $.colorbox.resize({width:"85%", height:"85%"}); });
}

function initPageMode(){
	if(multifile){
		$('.page [data-hidestart]').addClass('hidden');
		if(!lazyLoad){ $('.svg-img').each(function(){ $(this).parent().load($(this).attr('src')+' svg'); }); }
		$('#prefooter').css('min-height', $('.page').height());
		nav = { current:parseInt(location.href.split('/').pop().split('.html').join('')),
		to:function(n,coords){
			if(n <= 0 || n > nav.numPages) return;
			var targPage = (n*.0001).toFixed(4).substr(2) + '.html';
			if(coords && coords.length) targPage += '#refx='+coords[0]+'&refy='+coords[1];
			if(targPage == location.href.split('/').pop()) $(window).trigger('hashchange');
			else location.assign(targPage);
		} };
		$(document).trigger('newPage', {index:0});
	} else if(flip){
		nav = { 
			next:function() { $sl.turn("next"); }, 
			back:function() { $sl.turn("previous"); }, 
			to:function(n) { $sl.turn("page", n);},
			update:function(n){ setTimeout(function(){nav.update(n);},50)},
			reposition:function(view){
				if(!view) view = $sl.turn('view');
				var dispNum = $sl.turn('display') == 'single' ? 1 : 2;
				if(dispNum === 1) { $sl.css(prefix.css+'transform', 'translateX(0px)'); return; }
				if(!view[0] || !view[1]) {
					var mult = view[0]==0 ? -.5 : .5;
					var transX = pageW*mult*scaleFlipLayout(true);
					var transVal = $sl.data('dir') === 'rtl' ? -transX : transX;
					$sl.css(prefix.css+'transform', 'translateX('+transVal+'px)');
				}else { $sl.css(prefix.css+'transform', 'translateX(0px)'); }
			}
		};
		initPageFlip = function(){
			var $pages = $('.pages');
			var ori = getOrientation(), disp = (ori=='landscape') ? 'double' : 'single';
			var spreadW = (disp==='double') ? pageW*2 : pageW;
			if(!$(window).data('lastOrientation')) { $sl.turn({gradients:!0,acceleration:!0,display:disp,width:spreadW,height:pageH}); }
			else { 
				$sl.turn('size', spreadW, pageH).turn('display', disp).turn('resize'); 
				if(disp=='double') { try{setTimeout(function() { $(document).trigger('newPage', {index:$sl.turn('page')-1,'view':$sl.turn('view')})},1); }catch(err){} }
			}
			$(window).data('lastOrientation', ori);
			nav.reposition($sl.turn('view'));
		};
		initPageFlip();
		$sl.turn("disable",!0).on('turning start',function(e,n,v){ window.turning=!0;}).on('end',function(e,n,v){window.turning=!1;}).on('turned',function(e,n,v){ 
			window.turning=!1; nav.update(n); nav.reposition(v); try{$(document).trigger('newPage', {index:n-1,'view':v});}catch(err){} });
		$(window).on('orientationchange resize', function(event) {
			if($(window).data('lastOrientation') != getOrientation()) { initPageFlip(); }
		});
		setTimeout(function(){$sl.peel();},600);
		if(!nav.init) addNavProps();
		nav.init();
	} else if(isLiquid) {
		if(!lazyLoad){ $('.svg-img').each(function(){ $(this).parent().load($(this).attr('src')+' svg'); }); }
		nav = { numPages:$('.pages .page').length,
		current:1,update:function(){},
		to:function(n){
			if(n < 1 || n > nav.numPages) return;
			$(document).trigger('newPage',{index:n-1});
			this.update(n);
		} };
		if(!nav.init) addNavProps();
		nav.init();
	} else if($.hasOwnProperty('scrollTo')){
		arrowNav=!1;
		var dir = (pageMode[2] == 'h') ? 'x' : 'y';
		nav = { numPages:$('.pages .page').length,
			back:function(ref){var ind=(ref?$(ref).parents('.page'):$('.activePage')).prev().index(); if(ind!=-1) nav.to(ind+1);},
			next:function(ref){var ind=(ref?$(ref).parents('.page'):$('.activePage')).next().index(); if(ind!=-1) nav.to(ind+1);},
			to:function(n,c){
				window.scrolling=!0;
				var scrollTarg;
				if(c){ 
					var offset = $('.page').eq(n-1).offset();
					scrollTarg = {left:offset.left+c[0],top:offset.top+c[1]};					
				} else { scrollTarg = $('.page').eq(n-1)[0]; }
				$.scrollTo(scrollTarg, 500, {axis:dir, onAfter:function(){window.scrolling=!1}});
				$(document).trigger('newPage', {index:n-1});} };
			if(!nav.init) addNavProps();
			nav.init();
	}
	if(useSwipe && !$('#container > ul.thumbs').length) initPageSwipe();
}

function initPageSwipe(){
	var container = $('#container'), scrollStart, scrollFunc = vertMode ? 'scrollLeft':'scrollTop';
	var vertMode = (pageMode.substr(0,1) == "v");
	if(vertMode) $.fn.swipe.defaults.excludedElements+=",.scroll";
	container.swipe({
		allowPageScroll: (vertMode ? 'horizontal' : 'vertical'),
		preventDefaultEvents:!1,
		fingers:1, threshold:pointerEnabled?15:150,
		excludedElements: $.fn.swipe.defaults.excludedElements+ ',.mejs-overlay-button,map,[onclick],[data-useswipe="1"],[data-tapstart="1"],.panzoom,.scroll-horiz,#viewer-options-wrap',
		swipeStatus:function(event, phase) {
			switch(phase){ case 'start': scrollStart = $(window)[scrollFunc](); break; }
		},swipe:function(event, direction, distance, duration, fingerCount) {
			if(flip && $sl.turn("animating")) return;
			if(Math.abs($(window)[scrollFunc]()-scrollStart)>distance) return;
			switch(direction) {
				case "left": if(!vertMode) { nav.rtl ? nav.back() : nav.next(); } break;
				case "right": if(!vertMode) { nav.rtl ? nav.next() : nav.back(); } break;
				case "up": if(vertMode) nav.next(); break;
				case "down": if(vertMode) nav.back(); break;		
			}
		}
	});
}

$(function(){
	if(webAppType.length && initWebApp()) return !1;
	$(document).on('newPage', function(e, data) { onNewPage(e, data); });
	if(!multifile && pageMode.substr(0,2) === 'cs') $(document).on('scroll', function(e){ checkScroll(e, pageMode.substr(2,1)); });
	if($('ul.thumbs').length) $('#in5footer').hide();
	$sl = $('#slider');
	initPageMode();
	if($('.panzoom').length) initPanZoom();
	$('[target=_app]').each(function(){var jel=$(this); jel.on(clickEv,function(){location=jel.attr('href');return !1;}) });
	if($.colorbox) initLightbox();
	$('img').on('dragstart', function(e) { e.preventDefault(); });
	$('.cover').on(clickEv, function() { loadFrame($(this).hide().siblings('iframe')[0]); return !1; });
	if(!nav.init) addNavProps();
	if($('.page').eq(0).find('.page-scale-wrap').length > 1){
		$(window).on('resize orientationchange', function(e) { 
			/*to do: compare with stored layout, reset page position if needed*/
			$('.paper-vertical').find('.page.activePage > .page-scale-wrap:visible').each(function(index,el){ $el = $(el); $el.parents('.paper-vertical').width($el.width()); }); 
		});
	}
	initPullTabs();
	initAnimationAttribs();
	initMSOs();
	initClickEvents();
	initDataSave();
		setTimeout(function(){checkHashData();},50);
	setTimeout(function(){initResponsiveLayouts();},50);
	if(document.readyState === 'complete') { $(window).trigger('docReady'); }
	else { $(window).on('load', function(e){ $(window).trigger('docReady'); }) }
});

function getOrientation() {
	if(window.orientation === undefined) return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';   		
    return (Math.abs(window.orientation) === 90) ? 'landscape' : 'portrait';
}

function addNavProps(){
	if(nav.numPages === undefined) nav.numPages=7;
	nav.rtl = $('#slider').attr('data-dir') == 'rtl';
	if(nav.rtl) $('html').attr('data-dir', 'rtl');
	nav.init = function() { setTimeout(function(){nav.to(getStartPage());},1); };
	nav.first = function(){nav.to(1)};
	nav.last = function(){nav.to(nav.numPages)};
	nav.previousPageIndex = nav ? nav.previousPageIndex : undefined;
	nav.regress = function() {
		if(multifile) { window.history.back(); return; }
		if(nav.previousPageIndex === undefined) nav.previousPageIndex = 0;
   		nav.to(nav.previousPageIndex+1);
	};
	if(nav.back === undefined) nav.back = function(ref){nav.to(nav.current-1);};
	if(nav.next === undefined) nav.next = function(ref){nav.to(nav.current+1);};
	nav.update = function(n){
		if(arrowNav && nav.numPages>1){
			var view = flip ? $sl.turn('view') : {view:[]};
			if(view === undefined) return !1;
			if(multifile) n = parseInt(location.href.split('/').pop().split('.html')[0]);
			$('nav#page-nav:hidden, nav#page-nav #backBtn, nav#page-nav #nextBtn').show();
			if(n?n<2:(flip?(view[0] < 2 || view[1] < 2):nav.current < 2)) $('nav #backBtn').hide();
			if((n>-1 ? n>=nav.numPages : nav.current >= nav.numPages) || (view.length && (view[0] === nav.numPages || view[1] === nav.numPages))) $('nav #nextBtn').hide();
		} else { $('nav#page-nav').hide(); }
	};
	nav.build = function(){ nav.next(); };
	$('nav#page-nav #nextBtn').on(clickEv, function(){ nav.next(); return !1; });
	$('nav#page-nav #backBtn').on(clickEv, function(){ nav.back(); return !1; });
	setTimeout(function(){nav.update(getStartPage());},50); /*ensures show() works*/
}

function scaleFlipLayout(getOnly,sf) {
	var targW = $sl.turn('display') == 'single' ? pageW :pageW*2,scaleFactor=sf||getScaleFactor(targW,pageH);
	if(getOnly) return scaleFactor;
	try{$sl.turn("stop");}catch(err){}
	$('.page-scale-wrap').css(prefix.css+'transform',
		'scale('+scaleFactor+','+scaleFactor+')').css(prefix.css+'transform-origin', '0 0 0');
	$sl.turn('size', targW*scaleFactor, pageH*scaleFactor).turn('resize');
	nav.reposition();
	if(!getOnly && !sf) $('body').removeClass('zoomed');
}
function getScaleFactor(targW, targH){
	var maxWF = maxScaleWidth ? maxScaleWidth/targW : Infinity, maxHF = maxScaleHeight ? maxScaleHeight/targH : Infinity;
	var atMaxW = targW>maxWF;
	var $optwrap = $('#viewer-options-wrap'), collapsed = $optwrap.is('.collapsed'), 
		mobile = $optwrap.find('#view-toggle:visible').length>0, optoff = collapsed && mobile ? 0 : (($optwrap.find('#viewer-options-bar:visible').height()||0)+($optwrap.find('#viewer_progress_bar:visible').height()||0));
	var scaleTo = window.scaleModeType;
	if(fitTallToWidth){
		var isTall = targH/targW - pageH/pageW > .1;
		if(scaleTo === 'best' && isTall) { scaleTo = 'width', $('body').addClass('tall-page');
		} else { $('body').removeClass('tall-page'); }
	}
	switch(scaleTo) {
		case undefined: return 1;
		case 'width': $(document.body).attr('data-scaled-to',atMaxW?'mw':'w'); return Math.min(maxWF,$(window).innerWidth()/targW);
		case 'height': $(document.body).attr('data-scaled-to','h'); return Math.min(maxHF,(($(window).innerHeight()-optoff)/targH));
		default: var xScale = Math.min(maxWF,$(window).innerWidth()/targW), yScale = Math.min(maxHF,(($(window).innerHeight()-optoff)/targH));
		if(xScale <= yScale) { $(document.body).attr('data-scaled-to',atMaxW?'mw':'w'); return xScale; }
		else { $(document.body).attr('data-scaled-to','h'); return yScale; }
	}
}

function launchFullscreen(el) {
  if(el.requestFullscreen) {
    el.requestFullscreen();
  } else if(el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if(el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if(el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

function toggleFullScreen(el){
	if(!isFullscreen()) launchFullscreen(el||document.body);
	else exitFullscreen();
}

function fullscreenEnabled(){
	return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
}

function isFullscreen() { return ( window.fullScreen || window.fsmode ); }

function exitFullscreen() {
  if(document.exitFullscreen) { document.exitFullscreen(); }
  else if(document.mozCancelFullScreen) { document.mozCancelFullScreen(); } 
  else if(document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
}

$(document).on('fullscreenchange webkitfullscreenchange msfullscreenchange mozfullscreenchange', function(e) { window.fsmode = !window.fsmode; 
if(isFullscreen()) $('body').addClass('fsmode');
else $('body').removeClass('fsmode');
});

var CSSMtx = (window.hasOwnProperty('WebKitCSSMatrix')) ? WebKitCSSMatrix : MSCSSMatrix;
function getCurrentScale(targ,zooming){ 
	var targ = targ instanceof jQuery ? targ[0] : targ, $body = $('body');
	return zooming || $body.hasClass('zoomed') || $body.is('[data-scaled-to]') ? new CSSMtx(window.getComputedStyle(targ).transform).a : 1;
}
$(window).on('docReady', function(e){
	window.loaded=!0;
	$('body').addClass('loaded');
	if(flip){ $sl.turn("disable",!1); }
	
	initMedia(sliderSettings != undefined);
	if(multifile) { return; }
	});

function initResponsiveLayouts(){
	if($('.page').eq(0).find('.page-scale-wrap').length > 1){
		$('html,body').addClass('responsive');
		$(document).on('layoutChange', onLayoutChange).trigger('layoutChange');
		updateCurrentLayout();
		$(window).on('resize orientationchange', function(e) { 
			updateCurrentLayout();
			var layoutChange = (window.previousLayout !== window.currentLayout);
			if(layoutChange) { $(document).trigger('layoutChange'); }
		});
	}
}

function updateCurrentLayout(){
	window.previousLayout = window.currentLayout, window.currentLayout = $(multifile?'.page':'.page.activePage').find('.page-scale-wrap:visible').index();
}

function onLayoutChange(e){
	switch(pageMode){
		case 'csv': case 'csvb':
			$('.paper-vertical,.multifile').find(multifile?'.page':'.page.activePage').find('.page-scale-wrap:visible').each(function(index,el){ 
				var $el = $(el), newW = $el.width(), newH = $el.height(); 			
				$el.parents('.paper-vertical').width(newW); 
				if(multifile){
					$('.page').width(newW).height(newH); 
					if(window.scaleLayoutFunc) { scaleLayoutFunc(); }
				}
			}); 
			if(!nav.current) { $(document).trigger('scroll'); }
			break;
		case 'csh':
			$('.paper-horizontal,.multifile').find(multifile?'.page':'.page.activePage').find('.page-scale-wrap:visible').each(function(index,el){ 
				var $el = $(el), newW = $el.width(), newH = $el.height();
				$el.parents('.paper-horizontal').height(newH+10).width((newW+10)*nav.numPages); 
				if(multifile){
					$('.page').width(newW).height(newH); 
					if(window.scaleLayoutFunc) { scaleLayoutFunc(); }
				}
			}); 
			$(document).trigger('scroll');
			break;
		case 'flip':
			var $el = $(multifile?'.page':'.page.activePage').find('.page-scale-wrap:visible');
			pageW = $el.width(), pageH = $el.height();
			if(multifile) { $('.page').width(pageW).height(pageH); }
			else { initPageFlip(); }
			if(window.scaleLayoutFunc) { scaleLayoutFunc(); }
			break;
		case 'fade': case 'h': case 'v':
			var $slider = $('#slider,.multifile'), newH, newW;
			var pageWraps = window.currentLayout === undefined ? $slider.find('.page-scale-wrap:visible'):
				$slider.find('.page-scale-wrap:nth-child('+((window.currentLayout||0)+1)+')');
			pageWraps.each(function(index,el) {
				var $el = $(el);
				if(!newW) { newH = $el.height(), newW = $el.width(); }
				$el.parent('.page').height($el.height()).width($el.width());
			});
			var data = $slider.data('AnythingSlider');
			if(data) { data.updateSlider(); }
			break;
		case 'liquid':
			$('.liquid,.multifile').find(multifile?'.page':'.page.activePage').find('.page-scale-wrap:visible').each(function(index,el){
				var $el = $(el);
				if($el.hasClass('tall-page')) { $el.parent().addClass('tall-page'); }
				else { $el.parent().removeClass('tall-page'); }
			});
			break;

	}
	if(window.loaded) { $(document).trigger('newPage', {index:nav.current-1}); }
	else { $(window).on('docReady',function(){ $(document).trigger('newPage', {index:nav.current-1}); }); }
}



function initMedia(hasSlider){
	if(isBaker) return;
	if(!$('video,audio').length) {
		if(multifile) $(document).trigger('newPage', {index:0});
	 	return;
	}
	if(!window.mejs || $('video,audio').mediaelementplayer == undefined) {
		setTimeout(function(){initMedia(hasSlider);}, 50);
		return;
	 }
	 var playerMode = (uAgent.indexOf('firefox') > -1 
		&& isLocal && (!document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"').length)) ? 'shim' : 'auto';
	if((isIPad || isIPhone) && $('audio,video').filter('[data-autoplay]').length) {
		$('.page').one('touchstart', function(e){
			$(e.currentTarget).next().find('audio,video').filter('[data-autoplay]').each(function(){ if(this.load) this.load(); });
		});
	}
	if(hasSlider && (isIPad || isIPhone)) $('video,audio').mediaelementplayer({success:onMediaLoadSuccess});
	else { $('video,audio').mediaelementplayer({pluginPath:'assets/media/',iPadUseNativeControls:!0, iPhoneUseNativeControls:!0, mode:playerMode,
		AndroidUseNativeControls:!0, enableKeyboard:!1, success:onMediaLoadSuccess,defaultAudioWidth:280});
	}
}

var mediaLoaded = 0;
function onMediaLoadSuccess (me, domObj) {
	mediaLoaded++;
	var $domObj = $(domObj);
	$(document).trigger('mediaElementLoaded', {mediaElement:me,element:domObj});
	if(isLiquid && me.pluginType) $(document).trigger('newPage', {index:$('.activePage').index()});
	if($domObj.hasClass('mejs-fsonly')) {me.addEventListener('play',function(){ try{domObj.player.enterFullScreen(); me.enterFullScreen();}catch(e){} }) };
	if($domObj.attr('data-stoplast') == '1') { if(domObj.hasOwnProperty('player')) domObj.player.options.autoRewind=!1; };
	me.addEventListener('play',function(){ $(document).trigger('mediaPlayback', {me:me,domObj:domObj}); });
	me.addEventListener("ended", function(e){ 
		$domObj.parents(".mejs-inner").find(".mejs-poster").show().find('img').show(); /*reshow poster when done*/
    });
	if(me.pluginType == 'flash' && $domObj.attr('loop') == 'loop') { me.addEventListener('ended', function() { domObj.player.play(); }); }
	if(mediaLoaded === $('audio,video').length) allMediaLoaded();
	var cc = $domObj.attr('data-cc-on'), cin = $(me).parents('.mejs-container').find('.mejs-captions-selector input[value="'+cc+'"]').prop('checked',!0);
	if(cc) { me.player.setTrack(cc);}
	$domObj.filter('[data-end-action]').on('ended', function(e){
		var action = $(this).attr('data-end-action'), actionArr=action.split(',');
		switch(actionArr[0]){
			case 'next': nav.next(); break;
			case 'mso': toState(actionArr[1],actionArr[2]); break;
		}
	});
	if($domObj.attr('data-overlap')=='1' && domObj.player) domObj.player.options.pauseOtherPlayers=!1;
}

function allMediaLoaded(){
	if(multifile) {$(document).trigger('newPage', {index:0}); }
	$(document).trigger('allMediaElementsLoaded');
}

if(isBaker){
	$(window).on('blur', function(e){
		stopAllMedia(this.document,{src:'doc'});
		$(window).scrollTop(0);
		$('.page [data-hidestart]').addClass('hidden');
		$(window).data('focused',!1);
	}).on('focus', function(e) {
		if(!$(window).data('focused')) $(document).trigger('newPage', {index:0});
		$(window).data('focused',!0);
	});
	$(function(){ $('.page [data-hidestart]').addClass('hidden'); }); 
}

function getStartPage(){
	if(multifile) return 1;
	var p = getHashPage();
	if(p > 0) return p;
	return getStoredPage();
}
function initDataSave(){
	$('[data-save="1"]').on('keyup blur change',function(e){
		var $el = $(this);
		switch($el.attr('type')){
			case 'checkbox': case 'radio':
				localStorage.setItem($el.parents('label').attr('id'), $el.is(':checked'));
				break;
			default: localStorage.setItem($el.attr('name')||$el.attr('id'), $el.val());
		}	
   }).each(function(i,el){
		var $el = $(el);
		switch($el.attr('type')){
			case 'checkbox': case 'radio':
				if(localStorage.getItem($el.parents('label').attr('id'))=='true') $el.prop('checked','checked');
				break;
			default: $el.val(localStorage.getItem($el.attr('name')||$el.attr('id'))||'');
		}		
   });
   }
function getStoredPage(){ return 1; }
function setStoredPage(p){ return !1; }
getStoredPage = function(){ return (!useBookmark || !localStorage || !localStorage[bookmarkName]) ? 1 : localStorage[bookmarkName]; };
setStoredPage = function(p){ if(useBookmark && localStorage) localStorage[bookmarkName] = p; };
function getHashPage(){
	var q=location.hash.substr(1),px=q.indexOf('p=');
	return px>-1?parseInt(q.substr(px+2))||-1:-1;
}

$.fn.redraw = function(){
	return $(this).each(function(){
		var disp = this.style.display;
		this.style.display = 'none';
		var redraw = this.offsetHeight;
		this.style.display = disp;
	});
};


