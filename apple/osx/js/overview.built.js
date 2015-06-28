require=(function e(h,j,l){function m(a,c){if(!j[a]){if(!h[a]){var d=typeof require=="function"&&require;
if(!c&&d){return d(a,!0)}if(i){return i(a,!0)}throw new Error("Cannot find module '"+a+"'")
}var b=j[a]={exports:{}};h[a][0].call(b.exports,function(g){var f=h[a][1][g];return m(f?f:g)
},b,b.exports,e,h,j,l)}return j[a].exports}var i=typeof require=="function"&&require;
for(var k=0;k<l.length;k++){m(l[k])}return m})({1:[function(d,g,f){g.exports.DOMEmitter=d("./ac-dom-emitter/DOMEmitter")
},{"./ac-dom-emitter/DOMEmitter":2}],2:[function(h,m,i){var k;var l=h("ac-event-emitter").EventEmitter;
function j(a){if(a===null){return}this.el=a;this._bindings={};this._eventEmitter=new l()
}k=j.prototype;k._parseEventNames=function(a){if(!a){return[a]}return a.split(" ")
};k._onListenerEvent=function(a,b){this.trigger(a,b,false)};k._setListener=function(a){this._bindings[a]=this._onListenerEvent.bind(this,a);
this._addEventListener(a,this._bindings[a])};k._removeListener=function(a){this._removeEventListener(a,this._bindings[a]);
delete this._bindings[a]};k._addEventListener=function(b,a,c){if(this.el.addEventListener){this.el.addEventListener(b,a,c)
}else{if(this.el.attachEvent){this.el.attachEvent("on"+b,a)}else{target["on"+b]=a
}}return this};k._removeEventListener=function(b,a,c){if(this.el.removeEventListener){this.el.removeEventListener(b,a,c)
}else{this.el.detachEvent("on"+b,a)}return this};k.on=function(c,a,b){c=this._parseEventNames(c);
c.forEach(function(d,f,g){if(!this.has(g)){this._setListener(g)}this._eventEmitter.on(g,d,f)
}.bind(this,a,b));return this};k.off=function(d,a,b){var c=Array.prototype.slice.call(arguments,0);
d=this._parseEventNames(d);d.forEach(function(q,r,f,g){if(f.length===0){this._eventEmitter.off();
var s;for(s in this._bindings){if(this._bindings.hasOwnProperty(s)){this._removeListener(s)
}}return}this._eventEmitter.off(g,q,r);if(!this.has(g)){this._removeListener(g)
}}.bind(this,a,b,c));return this};k.once=function(c,a,b){c=this._parseEventNames(c);
c.forEach(function(d,f,g){if(!this.has(g)){this._setListener(g)}this._eventEmitter.once.call(this,g,d,f)
}.bind(this,a,b));return this};k.has=function(a){if(this._eventEmitter&&this._eventEmitter.has(a)){return true
}return false};k.trigger=function(c,b,a){c=this._parseEventNames(c);c.forEach(function(f,d,g){this._eventEmitter.trigger(g,f,d)
}.bind(this,b,a));return this};k.destroy=function(){this.off();this.el=this._eventEmitter=this._bindings=null
};m.exports=j},{"ac-event-emitter":false}],3:[function(d,g,f){g.exports={LocalnavSticky:d("./ac-localnav-sticky/Localnav-sticky")}
},{"./ac-localnav-sticky/Localnav-sticky":4}],4:[function(y,z,w){var t=y("ac-base").Element;
var v=y("ac-base").Environment;var p=y("ac-dom-emitter").DOMEmitter;var o=y("ac-event-emitter").EventEmitter;
var x=new p(window);var q;try{q=y("ac-analytics")}catch(s){}var A={visible:"visible",hidden:"hidden"};
function r(a){this._globalHeader=t.select("#globalheader");this._localNav=t.select(".localnav-wrapper");
this._visible=false;if(this._globalHeader&&this._localNav&&!this._isOldIE()){x.on("scroll",this._scrollUpdate.bind(this))
}}var u=r.prototype=new o(null);u._getThreshold=function(){if(!this._threshold){this._threshold=t.cumulativeOffset(this._localNav).top
}return this._threshold};u._isOldIE=function(){return(v.Browser.name==="IE"&&v.Browser.version<9)
};u._stickyAvailable=function(){var a=document.createElement("div"),b=["sticky","-webkit-sticky"];
return b.some(function(d){try{a.style.position=d;if(a.getAttribute("style")){return true
}}catch(c){return false}})};u._scrollUpdate=function(){var b=this._getThreshold();
var a=(window.pageYOffset!==undefined)?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop;
if(b&&a>=b){this._showStickyNav()}else{this._hideStickyNav()}};u._showStickyNav=function(){if(!this._visible){t.addClassName(this._localNav,"localnav-sticky");
if(!this._stickyAvailable()){t.setStyle(this._globalHeader,{marginBottom:t.getBoundingBox(this._localNav).height+"px"})
}this._localNav.setAttribute("data-analytics-region","product nav locked");if(typeof q==="object"){q.regions.refreshRegion(this._localNav)
}this._visible=true;this.trigger(A.visible)}};u._hideStickyNav=function(){if(this._visible){t.removeClassName(this._localNav,"localnav-sticky");
if(!this._stickyAvailable()){t.setStyle(this._globalHeader,{marginBottom:"0"})}this._localNav.setAttribute("data-analytics-region","product nav");
if(typeof q==="object"){q.regions.refreshRegion(this._localNav)}this._visible=false;
this.trigger(A.hidden)}};z.exports=r},{"ac-base":false,"ac-dom-emitter":1,"ac-event-emitter":false}],"dust-runtime":[function(d,g,f){g.exports=d("EVc30+")
},{}],"EVc30+":[function(require,module,exports){
/*! Dust - Asynchronous Templating - v2.3.3
* http://linkedin.github.io/dustjs/
* Copyright (c) 2014 Aleksander Williams; Released under the MIT License */
(function(root){var dust={},NONE="NONE",ERROR="ERROR",WARN="WARN",INFO="INFO",DEBUG="DEBUG",loggingLevels=[DEBUG,INFO,WARN,ERROR,NONE],EMPTY_FUNC=function(){},logger=EMPTY_FUNC,loggerContext=this;
dust.debugLevel=NONE;dust.silenceErrors=false;if(root&&root.console&&root.console.log){logger=root.console.log;
loggerContext=root.console}dust.log=function(message,type){if(dust.isDebug&&dust.debugLevel===NONE){logger.call(loggerContext,'[!!!DEPRECATION WARNING!!!]: dust.isDebug is deprecated.  Set dust.debugLevel instead to the level of logging you want ["debug","info","warn","error","none"]');
dust.debugLevel=INFO}type=type||INFO;if(loggingLevels.indexOf(type)>=loggingLevels.indexOf(dust.debugLevel)){if(!dust.logQueue){dust.logQueue=[]
}dust.logQueue.push({message:message,type:type});logger.call(loggerContext,"[DUST "+type+"]: "+message)
}if(!dust.silenceErrors&&type===ERROR){if(typeof message==="string"){throw new Error(message)
}else{throw message}}};dust.onError=function(error,chunk){logger.call(loggerContext,"[!!!DEPRECATION WARNING!!!]: dust.onError will no longer return a chunk object.");
dust.log(error.message||error,ERROR);if(!dust.silenceErrors){throw error}else{return chunk
}};dust.helpers={};dust.cache={};dust.register=function(name,tmpl){if(!name){return
}dust.cache[name]=tmpl};dust.render=function(name,context,callback){var chunk=new Stub(callback).head;
try{dust.load(name,chunk,Context.wrap(context,name)).end()}catch(err){dust.log(err,ERROR)
}};dust.stream=function(name,context){var stream=new Stream();dust.nextTick(function(){try{dust.load(name,stream.head,Context.wrap(context,name)).end()
}catch(err){dust.log(err,ERROR)}});return stream};dust.renderSource=function(source,context,callback){return dust.compileFn(source)(context,callback)
};dust.compileFn=function(source,name){name=name||null;var tmpl=dust.loadSource(dust.compile(source,name));
return function(context,callback){var master=callback?new Stub(callback):new Stream();
dust.nextTick(function(){if(typeof tmpl==="function"){tmpl(master.head,Context.wrap(context,name)).end()
}else{dust.log(new Error("Template ["+name+"] cannot be resolved to a Dust function"),ERROR)
}});return master}};dust.load=function(name,chunk,context){var tmpl=dust.cache[name];
if(tmpl){return tmpl(chunk,context)}else{if(dust.onLoad){return chunk.map(function(chunk){dust.onLoad(name,function(err,src){if(err){return chunk.setError(err)
}if(!dust.cache[name]){dust.loadSource(dust.compile(src,name))}dust.cache[name](chunk,context).end()
})})}return chunk.setError(new Error("Template Not Found: "+name))}};dust.loadSource=function(source,path){return eval(source)
};if(Array.isArray){dust.isArray=Array.isArray}else{dust.isArray=function(arr){return Object.prototype.toString.call(arr)==="[object Array]"
}}dust.nextTick=(function(){return function(callback){setTimeout(callback,0)}})();
dust.isEmpty=function(value){if(dust.isArray(value)&&!value.length){return true
}if(value===0){return false}return(!value)};dust.filter=function(string,auto,filters){if(filters){for(var i=0,len=filters.length;
i<len;i++){var name=filters[i];if(name==="s"){auto=null;dust.log("Using unescape filter on ["+string+"]",DEBUG)
}else{if(typeof dust.filters[name]==="function"){string=dust.filters[name](string)
}else{dust.log("Invalid filter ["+name+"]",WARN)}}}}if(auto){string=dust.filters[auto](string)
}return string};dust.filters={h:function(value){return dust.escapeHtml(value)},j:function(value){return dust.escapeJs(value)
},u:encodeURI,uc:encodeURIComponent,js:function(value){if(!JSON){dust.log("JSON is undefined.  JSON stringify has not been used on ["+value+"]",WARN);
return value}else{return JSON.stringify(value)}},jp:function(value){if(!JSON){dust.log("JSON is undefined.  JSON parse has not been used on ["+value+"]",WARN);
return value}else{return JSON.parse(value)}}};function Context(stack,global,blocks,templateName){this.stack=stack;
this.global=global;this.blocks=blocks;this.templateName=templateName}dust.makeBase=function(global){return new Context(new Stack(),global)
};Context.wrap=function(context,name){if(context instanceof Context){return context
}return new Context(new Stack(context),{},null,name)};Context.prototype.get=function(path,cur){if(typeof path==="string"){if(path[0]==="."){cur=true;
path=path.substr(1)}path=path.split(".")}return this._get(cur,path)};Context.prototype._get=function(cur,down){var ctx=this.stack,i=1,value,first,len,ctxThis;
dust.log("Searching for reference [{"+down.join(".")+"}] in template ["+this.getTemplateName()+"]",DEBUG);
first=down[0];len=down.length;if(cur&&len===0){ctxThis=ctx;ctx=ctx.head}else{if(!cur){while(ctx){if(ctx.isObject){ctxThis=ctx.head;
value=ctx.head[first];if(value!==undefined){break}}ctx=ctx.tail}if(value!==undefined){ctx=value
}else{ctx=this.global?this.global[first]:undefined}}else{ctx=ctx.head[first]}while(ctx&&i<len){ctxThis=ctx;
ctx=ctx[down[i]];i++}}if(typeof ctx==="function"){var fn=function(){try{return ctx.apply(ctxThis,arguments)
}catch(err){return dust.log(err,ERROR)}};fn.isFunction=true;return fn}else{if(ctx===undefined){dust.log("Cannot find the value for reference [{"+down.join(".")+"}] in template ["+this.getTemplateName()+"]")
}return ctx}};Context.prototype.getPath=function(cur,down){return this._get(cur,down)
};Context.prototype.push=function(head,idx,len){return new Context(new Stack(head,this.stack,idx,len),this.global,this.blocks,this.getTemplateName())
};Context.prototype.rebase=function(head){return new Context(new Stack(head),this.global,this.blocks,this.getTemplateName())
};Context.prototype.current=function(){return this.stack.head};Context.prototype.getBlock=function(key,chk,ctx){if(typeof key==="function"){var tempChk=new Chunk();
key=key(tempChk,this).data.join("")}var blocks=this.blocks;if(!blocks){dust.log("No blocks for context[{"+key+"}] in template ["+this.getTemplateName()+"]",DEBUG);
return}var len=blocks.length,fn;while(len--){fn=blocks[len][key];if(fn){return fn
}}};Context.prototype.shiftBlocks=function(locals){var blocks=this.blocks,newBlocks;
if(locals){if(!blocks){newBlocks=[locals]}else{newBlocks=blocks.concat([locals])
}return new Context(this.stack,this.global,newBlocks,this.getTemplateName())}return this
};Context.prototype.getTemplateName=function(){return this.templateName};function Stack(head,tail,idx,len){this.tail=tail;
this.isObject=head&&typeof head==="object";this.head=head;this.index=idx;this.of=len
}function Stub(callback){this.head=new Chunk(this);this.callback=callback;this.out=""
}Stub.prototype.flush=function(){var chunk=this.head;while(chunk){if(chunk.flushable){this.out+=chunk.data.join("")
}else{if(chunk.error){this.callback(chunk.error);dust.log("Chunk error ["+chunk.error+"] thrown. Ceasing to render this template.",WARN);
this.flush=EMPTY_FUNC;return}else{return}}chunk=chunk.next;this.head=chunk}this.callback(null,this.out)
};function Stream(){this.head=new Chunk(this)}Stream.prototype.flush=function(){var chunk=this.head;
while(chunk){if(chunk.flushable){this.emit("data",chunk.data.join(""))}else{if(chunk.error){this.emit("error",chunk.error);
dust.log("Chunk error ["+chunk.error+"] thrown. Ceasing to render this template.",WARN);
this.flush=EMPTY_FUNC;return}else{return}}chunk=chunk.next;this.head=chunk}this.emit("end")
};Stream.prototype.emit=function(type,data){if(!this.events){dust.log("No events to emit",INFO);
return false}var handler=this.events[type];if(!handler){dust.log("Event type ["+type+"] does not exist",WARN);
return false}if(typeof handler==="function"){handler(data)}else{if(dust.isArray(handler)){var listeners=handler.slice(0);
for(var i=0,l=listeners.length;i<l;i++){listeners[i](data)}}else{dust.log("Event Handler ["+handler+"] is not of a type that is handled by emit",WARN)
}}};Stream.prototype.on=function(type,callback){if(!this.events){this.events={}
}if(!this.events[type]){dust.log("Event type ["+type+"] does not exist. Using just the specified callback.",WARN);
if(callback){this.events[type]=callback}else{dust.log("Callback for type ["+type+"] does not exist. Listener not registered.",WARN)
}}else{if(typeof this.events[type]==="function"){this.events[type]=[this.events[type],callback]
}else{this.events[type].push(callback)}}return this};Stream.prototype.pipe=function(stream){this.on("data",function(data){try{stream.write(data,"utf8")
}catch(err){dust.log(err,ERROR)}}).on("end",function(){try{return stream.end()}catch(err){dust.log(err,ERROR)
}}).on("error",function(err){stream.error(err)});return this};function Chunk(root,next,taps){this.root=root;
this.next=next;this.data=[];this.flushable=false;this.taps=taps}Chunk.prototype.write=function(data){var taps=this.taps;
if(taps){data=taps.go(data)}this.data.push(data);return this};Chunk.prototype.end=function(data){if(data){this.write(data)
}this.flushable=true;this.root.flush();return this};Chunk.prototype.map=function(callback){var cursor=new Chunk(this.root,this.next,this.taps),branch=new Chunk(this.root,cursor,this.taps);
this.next=branch;this.flushable=true;callback(branch);return cursor};Chunk.prototype.tap=function(tap){var taps=this.taps;
if(taps){this.taps=taps.push(tap)}else{this.taps=new Tap(tap)}return this};Chunk.prototype.untap=function(){this.taps=this.taps.tail;
return this};Chunk.prototype.render=function(body,context){return body(this,context)
};Chunk.prototype.reference=function(elem,context,auto,filters){if(typeof elem==="function"){elem.isFunction=true;
elem=elem.apply(context.current(),[this,context,null,{auto:auto,filters:filters}]);
if(elem instanceof Chunk){return elem}}if(!dust.isEmpty(elem)){return this.write(dust.filter(elem,auto,filters))
}else{return this}};Chunk.prototype.section=function(elem,context,bodies,params){if(typeof elem==="function"){elem=elem.apply(context.current(),[this,context,bodies,params]);
if(elem instanceof Chunk){return elem}}var body=bodies.block,skip=bodies["else"];
if(params){context=context.push(params)}if(dust.isArray(elem)){if(body){var len=elem.length,chunk=this;
if(len>0){if(context.stack.head){context.stack.head["$len"]=len}for(var i=0;i<len;
i++){if(context.stack.head){context.stack.head["$idx"]=i}chunk=body(chunk,context.push(elem[i],i,len))
}if(context.stack.head){context.stack.head["$idx"]=undefined;context.stack.head["$len"]=undefined
}return chunk}else{if(skip){return skip(this,context)}}}}else{if(elem===true){if(body){return body(this,context)
}}else{if(elem||elem===0){if(body){return body(this,context.push(elem))}}else{if(skip){return skip(this,context)
}}}}dust.log("Not rendering section (#) block in template ["+context.getTemplateName()+"], because above key was not found",DEBUG);
return this};Chunk.prototype.exists=function(elem,context,bodies){var body=bodies.block,skip=bodies["else"];
if(!dust.isEmpty(elem)){if(body){return body(this,context)}}else{if(skip){return skip(this,context)
}}dust.log("Not rendering exists (?) block in template ["+context.getTemplateName()+"], because above key was not found",DEBUG);
return this};Chunk.prototype.notexists=function(elem,context,bodies){var body=bodies.block,skip=bodies["else"];
if(dust.isEmpty(elem)){if(body){return body(this,context)}}else{if(skip){return skip(this,context)
}}dust.log("Not rendering not exists (^) block check in template ["+context.getTemplateName()+"], because above key was found",DEBUG);
return this};Chunk.prototype.block=function(elem,context,bodies){var body=bodies.block;
if(elem){body=elem}if(body){return body(this,context)}return this};Chunk.prototype.partial=function(elem,context,params){var partialContext;
partialContext=dust.makeBase(context.global);partialContext.blocks=context.blocks;
if(context.stack&&context.stack.tail){partialContext.stack=context.stack.tail}if(params){partialContext=partialContext.push(params)
}if(typeof elem==="string"){partialContext.templateName=elem}partialContext=partialContext.push(context.stack.head);
var partialChunk;if(typeof elem==="function"){partialChunk=this.capture(elem,partialContext,function(name,chunk){partialContext.templateName=partialContext.templateName||name;
dust.load(name,chunk,partialContext).end()})}else{partialChunk=dust.load(elem,this,partialContext)
}return partialChunk};Chunk.prototype.helper=function(name,context,bodies,params){var chunk=this;
try{if(dust.helpers[name]){return dust.helpers[name](chunk,context,bodies,params)
}else{dust.log("Invalid helper ["+name+"]",WARN);return chunk}}catch(err){dust.log(err,ERROR);
return chunk}};Chunk.prototype.capture=function(body,context,callback){return this.map(function(chunk){var stub=new Stub(function(err,out){if(err){chunk.setError(err)
}else{callback(out,chunk)}});body(stub.head,context).end()})};Chunk.prototype.setError=function(err){this.error=err;
this.root.flush();return this};function Tap(head,tail){this.head=head;this.tail=tail
}Tap.prototype.push=function(tap){return new Tap(tap,this)};Tap.prototype.go=function(value){var tap=this;
while(tap){value=tap.head(value);tap=tap.tail}return value};var HCHARS=new RegExp(/[&<>\"\']/),AMP=/&/g,LT=/</g,GT=/>/g,QUOT=/\"/g,SQUOT=/\'/g;
dust.escapeHtml=function(s){if(typeof s==="string"){if(!HCHARS.test(s)){return s
}return s.replace(AMP,"&amp;").replace(LT,"&lt;").replace(GT,"&gt;").replace(QUOT,"&quot;").replace(SQUOT,"&#39;")
}return s};var BS=/\\/g,FS=/\//g,CR=/\r/g,LS=/\u2028/g,PS=/\u2029/g,NL=/\n/g,LF=/\f/g,SQ=/'/g,DQ=/"/g,TB=/\t/g;
dust.escapeJs=function(s){if(typeof s==="string"){return s.replace(BS,"\\\\").replace(FS,"\\/").replace(DQ,'\\"').replace(SQ,"\\'").replace(CR,"\\r").replace(LS,"\\u2028").replace(PS,"\\u2029").replace(NL,"\\n").replace(LF,"\\f").replace(TB,"\\t")
}return s};if(typeof exports==="object"){module.exports=dust}else{root.dust=dust
}})(this)},{}],"8m2ENo":[function(d,g,f){g.exports=(function(){var a=d("./dust-runtime");
(function(){a.register("controlBarDefault",b);function b(h,k){return h.write('<div aria-label="Video playback" class="').reference(k._get(false,["values","controlbarskinning"]),k,"h").write(' acv-controller-disabled" role="toolbar"><div class="ac-video-controlbar-elements"><button aria-label="').reference(k._get(false,["values","localizedText","mutevolume"]),k,"h").write('" data-ac-video-element="minVolumeButton" class="acv-button acv-minvolume" tabindex="0"></button><div data-ac-video-element="volumeSlider" class="acv-button acv-volumeslider ac-media-volume-slider"><div class="acv-volumeslider-inputrange"></div></div><button aria-label="').reference(k._get(false,["values","localizedText","fullvolume"]),k,"h").write('" data-ac-video-element="maxVolumeButton" class="acv-button acv-maxvolume" tabindex="0"></button><button aria-label="').reference(k._get(false,["values","localizedText","play"]),k,"h").write('" data-ac-video-element="playPauseButton" class="acv-button acv-playpause" tabindex="0" role="button"></button>').notexists(k._get(false,["values","disablecaptionscontrol"]),k,{block:c},null).exists(k._get(false,["values","usesFullScreen"]),k,{block:i},null).write('<div data-ac-video-element="progressSlider" class="acv-button acv-progressslider"><span aria-label="').reference(k._get(false,["values","localizedText","elapsed"]),k,"h").write('" class="acv-text acv-text-first acv-currenttime" data-ac-video-element="currentTimeText" role="timer" tabindex="0"></span><div class="acv-progressslider-inputrange"></div><span aria-label="').reference(k._get(false,["values","localizedText","remaining"]),k,"h").write('" class="acv-text acv-text-last acv-remainingtime" data-ac-video-element="remainingTimeText" role="timer" tabindex="0"></span></div>').reference(k._get(false,["values","controlsTemplateString"]),k,"h",["s"]).write("</div></div>")
}function c(h,k){return h.write('<button aria-label="').reference(k._get(false,["values","localizedText","captionscontrol"]),k,"h").write('" data-ac-video-element="captionsButton" class="acv-button acv-captions" tabindex="0"></button>')
}function i(h,k){return h.write('<button aria-label="Enable Full Screen" data-ac-video-element="fullScreenButton" class="acv-button acv-fullscreen" tabindex="0"></button>')
}return b})();(function(){a.register("controlBarStream",b);function b(c,i){return c.write('<div aria-label="Video playback" class="').reference(i._get(false,["values","controlbarskinning"]),i,"h").write('" aria-role="toolbar"><div class="ac-video-controlbar-elements"><button aria-label="Min Volume" data-ac-video-element="minVolumeButton" class="acv-button acv-minvolume" tabindex="0"></button><div data-ac-video-element="volumeSlider" class="acv-button acv-volumeslider ac-media-volume-slider"><div class="acv-volumeslider-inputrange"></div></div><button aria-label="Max Volume" data-ac-video-element="maxVolumeButton" class="acv-button acv-maxvolume" tabindex="0"></button><button aria-label="Play" data-ac-video-element="playPauseButton" class="acv-button acv-playpause" tabindex="0" role="button"></button><button aria-label="Enable Captions" data-ac-video-element="captionsButton" class="acv-button acv-captions" tabindex="0"></button><button aria-label="Enable Full Screen" data-ac-video-element="fullScreenButton" class="acv-button acv-fullscreen" tabindex="0"></button><div class="acv-button acv-progressslider"><span aria-label="Elapsed" class="acv-text acv-text-first acv-currenttime" data-ac-video-element="currentTimeText" aria-role="timer" tabindex="0"></span></div>').reference(i._get(false,["values","controlsTemplateString"]),i,"h",["s"]).write("</div></div>")
}return b})();(function(){a.register("controlBarString",b);function b(c,i){return c.write('<div class="ac-video-controlbar" style="width:').reference(i._get(false,["values","width"]),i,"h").write('px;">').reference(i._get(false,["values","controlsTemplateString"]),i,"h",["s"]).write("</div>")
}return b})();(function(){a.register("elementEmbed",b);function b(h,k){return h.write('<embed src="').reference(k._get(false,["source"]),k,"h").write('" ').notexists(k._get(false,["responsive"]),k,{block:c},null).write(" ").notexists(k._get(false,["responsive"]),k,{block:i},null).write(' class="ac-video-media" id="').reference(k._get(false,["values","id"]),k,"h").write('" wmode="transparent" name="').reference(k._get(false,["values","id"]),k,"h").write('" type="').reference(k._get(false,["type"]),k,"h").write('" width="').reference(k._get(false,["values","width"]),k,"h").write('" height="').reference(k._get(false,["values","height"]),k,"h").write('" scale="tofit" enablejavascript="true" postdomevents="true" controller="false" autoplay="true" poster="').reference(k._get(false,["values","poster"]),k,"h").write('" bgcolor="').reference(k._get(false,["values","bgcolor"]),k,"h").write('" style="width:').reference(k._get(false,["values","width"]),k,"h").write("px; height:").reference(k._get(false,["values","height"]),k,"h").write('px;"  pluginspage="www.apple.com/quicktime/download">')
}function c(h,k){return h.write(' width="').reference(k._get(false,["values","width"]),k,"h").write('" height="').reference(k._get(false,["values","height"]),k,"h").write('"')
}function i(h,k){return h.write(' style="width:').reference(k._get(false,["values","width"]),k,"h").write("px; height:").reference(k._get(false,["values","height"]),k,"h").write('px;"')
}return b})();(function(){a.register("elementObject",b);function b(h,k){return h.write('<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" wmode="transparent" codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=7,2,1,0" id="').reference(k._get(false,["values","id"]),k,"h").write('" name="').reference(k._get(false,["values","id"]),k,"h").write('" class="ac-video-media movie-object" type="').reference(k._get(false,["type"]),k,"h").write('" style="behavior:url(#').reference(k._get(false,["values","eventId"]),k,"h").write("); ").notexists(k._get(false,["responsive"]),k,{block:c},null).write('" ').notexists(k._get(false,["responsive"]),k,{block:i},null).write(' bgcolor="').reference(k._get(false,["values","bgcolor"]),k,"h").write('" poster="').reference(k._get(false,["values","poster"]),k,"h").write('"><param name="autoplay" value="true" /><param name="enablejavascript" value="true" /><param name="postdomevents" value="true" /><param name="scale" value="tofit" /><param name="controller" value="false" /><param name="kioskmode" value="true" /><param name="src" value="').reference(k._get(false,["source"]),k,"h").write('" /><param name="pluginspace" value="http://www.apple.com/qtactivex/qtplugin.cab" /><param name="wmode" value="transparent"></object>')
}function c(h,k){return h.write("width:").reference(k._get(false,["values","width"]),k,"h").write("px; height:").reference(k._get(false,["values","height"]),k,"h").write("px;")
}function i(h,k){return h.write(' width="').reference(k._get(false,["values","width"]),k,"h").write('" height="').reference(k._get(false,["values","height"]),k,"h").write('" ')
}return b})();(function(){a.register("elementObjectEvent",b);function b(c,i){return c.write('<object id="').reference(i._get(false,["values","eventId"]),i,"h").write('" wmode="transparent" classid="clsid:CB927D12-4FF7-4a9e-A169-56E4B8A75598" codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=7,2,1,0"></object>')
}return b})();(function(){a.register("elementVideo",o);function o(h,i){return h.write('<video crossorigin="anonymous" class="ac-video-media" id="').reference(i._get(false,["values","id"]),i,"h").write('" poster="').reference(i._get(false,["values","poster"]),i,"h").write('" ').exists(i._get(false,["values","controls"]),i,{block:p},null).write(" ").exists(i._get(false,["values","autoplay"]),i,{block:q},null).write(" ").exists(i._get(false,["values","preload"]),i,{block:r},null).write(' x-webkit-airplay="').reference(i._get(false,["values","airplay"]),i,"h").write('" ').exists(i._get(false,["values","bgcolor"]),i,{block:s},null).write(" ").notexists(i._get(false,["responsive"]),i,{block:b},null).write(' style="').notexists(i._get(false,["responsive"]),i,{block:c},null).write('" ><source src="').reference(i._get(false,["source"]),i,"h").write('" type="').reference(i._get(false,["type"]),i,"h").write('" />').exists(i._get(false,["captionsTrack"]),i,{block:n},null).write("</video>")
}function p(h,i){return h.write("controls")}function q(h,i){return h.write("autoplay")
}function r(h,i){return h.write('preload="').reference(i._get(false,["values","preload"]),i,"h").write('"')
}function s(h,i){return h.write('bgcolor="').reference(i._get(false,["values","bgcolor"]),i,"h").write('"')
}function b(h,i){return h.write('width="').reference(i._get(false,["values","width"]),i,"h").write('" height="').reference(i._get(false,["values","height"]),i,"h").write('"')
}function c(h,i){return h.write("width:").reference(i._get(false,["values","width"]),i,"h").write("px; height:").reference(i._get(false,["values","height"]),i,"h").write("px;")
}function n(h,i){return h.write('<track src="').reference(i._get(false,["captionsTrack"]),i,"h").write('" kind="captions" srclang="en" label="English" default />')
}return o})();(function(){a.register("masterTemplate",b);function b(h,i){return h.write('<div class="ac-video-wrapper ').reference(i._get(false,["values","targetId"]),i,"h").write(" ac-video-template-").reference(i._get(false,["videoTemplate"]),i,"h").write(" ").exists(i._get(false,["values","usesFullScreen"]),i,{block:c},null).write('" id="').reference(i._get(false,["values","wrapperId"]),i,"h").write('" ').notexists(i._get(false,["responsive"]),i,{block:p},null).write('><div class="ac-video-event-blockade" ').notexists(i._get(false,["responsive"]),i,{block:q},null).write('>&nbsp; &nbsp; &nbsp; &nbsp;</div><button aria-label="Close Video" data-ac-video-element="closeButton" class="acv-button acv-close" tabindex="0"><label class="ac-element-label acv-text">Close</label></button>').exists(i._get(false,["values","poster"]),i,{block:r},null).exists(i._get(false,["values","endframe"]),i,{block:s},null).exists(i._get(false,["videoTemplate"]),i,{block:t},null).exists(i._get(false,["values","controlbar"]),i,{block:v},null).write("</div>")
}function c(h,i){return h.write("ac-video-has-fullscreen")}function p(h,i){return h.write('style="width:').reference(i._get(false,["values","width"]),i,"h").write("px;height:").reference(i._get(false,["values","height"]),i,"h").write('px"')
}function q(h,i){return h.write('style="width:').reference(i._get(false,["values","width"]),i,"h").write("px; height:").reference(i._get(false,["values","height"]),i,"h").write('px;"')
}function r(h,i){return h.write('<img width="').reference(i._get(false,["values","width"]),i,"h").write('px" height="').reference(i._get(false,["values","height"]),i,"h").write('px" src="').reference(i._get(false,["values","poster"]),i,"h").write('" class="ac-video-posterframe" data-ac-video-element="posterframe" alt="" />')
}function s(h,i){return h.write('<img width="').reference(i._get(false,["values","width"]),i,"h").write('px" height="').reference(i._get(false,["values","height"]),i,"h").write('px" src="').reference(i._get(false,["values","endframe"]),i,"h").write('" class="ac-video-endframe acv-hide" data-ac-video-element="endframe" alt="" />')
}function t(h,i){return h.partial(u,i,null)}function u(h,i){return h.reference(i._get(false,["videoTemplate"]),i,"h")
}function v(h,i){return h.partial(w,i,null)}function w(h,i){return h.reference(i._get(false,["values","controlbar"]),i,"h")
}return b})();(function(){a.register("native",b);function b(h,k){return h.write('<div class="ac-video-wrapper native-controlbar ').reference(k._get(false,["values","targetId"]),k,"h").write('" id="').reference(k._get(false,["values","wrapperId"]),k,"h").write('" style="width:').reference(k._get(false,["values","width"]),k,"h").write("px;height:").reference(k._get(false,["values","height"]),k,"h").write('px;"><div class="acv-native-playbutton"></div>').exists(k._get(false,["videoTemplate"]),k,{block:c},null).write("</div>")
}function c(h,k){return h.partial(i,k,null)}function i(h,k){return h.reference(k._get(false,["videoTemplate"]),k,"h")
}return b})();(function(){a.register("noVideoSupport",b);function b(c,i){return c.write('<div class="ac-video-wrapper ').reference(i._get(false,["values","targetId"]),i,"h").write(' acv-no-video-support" id="').reference(i._get(false,["values","wrapperId"]),i,"h").write('" style="width:').reference(i._get(false,["values","width"]),i,"h").write("px;height:").reference(i._get(false,["values","height"]),i,"h").write('px;"><a onclick="s_objectID=&quot;http://www.apple.com/quicktime/download/_1&quot;;return this.s_oc?this.s_oc(e):true" href="').reference(i._get(false,["values","localizedText","downloadquicktimeurl"]),i,"h").write('" class="ac-video-quicktime-download"><span class="ac-video-quicktime-download-title">').reference(i._get(false,["values","localizedText","downloadquicktimetitle"]),i,"h").write('</span><span class="ac-video-quicktime-download-text">').reference(i._get(false,["values","localizedText","downloadquicktimetext"]),i,"h").write('</span><span class="ac-video-quicktime-download-button">').reference(i._get(false,["values","localizedText","downloadquicktimebutton"]),i,"h").write("</span></a></div>")
}return b})();(function(){a.register("steamVideoElement",b);function b(h,i){return h.write('<video crossorigin="anonymous" class="ac-video-media" id="').reference(i._get(false,["values","id"]),i,"h").write('" poster="').reference(i._get(false,["values","poster"]),i,"h").write('" ').exists(i._get(false,["values","controls"]),i,{block:c},null).write(" ").exists(i._get(false,["values","autoplay"]),i,{block:k},null).write(" ").exists(i._get(false,["values","preload"]),i,{block:l},null).write(' width="').reference(i._get(false,["values","width"]),i,"h").write('" height="').reference(i._get(false,["values","height"]),i,"h").write('" x-webkit-airplay="').reference(i._get(false,["values","airplay"]),i,"h").write('" bgcolor="').reference(i._get(false,["values","bgcolor"]),i,"h").write('" style="width:').reference(i._get(false,["values","width"]),i,"h").write("px; height:").reference(i._get(false,["values","height"]),i,"h").write('px;"><source src="').reference(i._get(false,["source"]),i,"h").write('" type="').reference(i._get(false,["type"]),i,"h").write('" />').exists(i._get(false,["captionsTrack"]),i,{block:m},null).write("</video>")
}function c(h,i){return h.write("controls")}function k(h,i){return h.write("autoplay")
}function l(h,i){return h.write('preload="').reference(i._get(false,["values","preload"]),i,"h").write('"')
}function m(h,i){return h.write('<track src="').reference(i._get(false,["captionsTrack"]),i,"h").write('" kind="captions" srclang="en" label="English" default />')
}return b})();return a})()},{"./dust-runtime":"EVc30+"}],"ac-video-templates":[function(d,g,f){g.exports=d("8m2ENo")
},{}],9:[function(u,w,r){var o,t=u("ac-base").Object,q=u("ac-base").Environment,n=u("ac-base").Element,v=u("./tests");
var m={Firefox:"ff",IE:"ie",oldie:"oldie"};var s={features:["js","touch","svg","canvas","sticky","ios","media","ff","ie","oldie"]};
var p=function(){this._didInitialize=false;this._classTarget=document.documentElement;
this.tests=v};o=p.prototype;o.initialize=function(a){if(this._didInitialize){return
}this.options=a||s;this.options.features.forEach(function(c){var b=this.tests[c];
if(b){this.setClass(c,b)}else{if(console){console.warn("No test found for `"+c+"`.");
return false}}}.bind(this));this._didInitialize=true};o.addTest=function(a,b){if(this._didInitialize){throw new Error("RuntimeDelegate has already initialized. This "+a+" test must be added before initialization.")
}this.tests[a]=b};o.setClass=function(a,b){b.supported=b.supported||false;b.className=b.className||a;
if(b.test(this._classTarget)){b.supported=true;n.addClassName(this._classTarget,b.className);
if(b.forceRemove){n.removeClassName(this._classTarget,"no-"+b.className)}}else{n.addClassName(this._classTarget,"no-"+b.className);
if(b.forceRemove){n.removeClassName(this._classTarget,b.className)}}};o.supports=function(a){return this.tests[a].supported
};w.exports=new p()},{"./tests":10,"ac-base":false}],10:[function(k,j,g){var h=k("ac-base").Environment,i=k("ac-base").Element;
j.exports={js:{forceRemove:true,test:function(){return true}},touch:{test:function(){return h.Feature.touchAvailable()
}},svg:{test:function(){return h.Feature.svgAvailable()}},canvas:{test:function(){return h.Feature.canvasAvailable()
}},threedTransform:{test:function(){return h.Feature.threeDTransformsAvailable()
}},sticky:{test:function(){if(h.Browser.version<7){return false}var a="position:",b=document.createElement("div");
b.style.cssText=a+["-webkit-","-moz-","-ms-","-o-",""].join("sticky;"+a)+"sticky;";
if(b.style.position.indexOf("sticky")!==-1){return true}else{return false}}},ios:{test:function(a){var b=h.Browser.os==="iOS";
if(b){i.addClassName(a,"ios-"+h.Browser.version);return true}else{return false}}},media:{test:function(){return(h.Feature.supportsThreeD()||h.Browser.name==="Firefox")
}},mp4:{test:function(){try{var b=document.createElement("VIDEO");if(b.canPlayType&&b.canPlayType("video/mp4").replace(/no/," ")){this._mp4Support=true;
return true}}catch(a){}this._mp4Support=false;return false}},ff:{test:function(){return h.Browser.name==="Firefox"
}},ie:{test:function(){return h.Browser.name==="IE"}},oldie:{test:function(){return h.Browser.name==="IE"&&h.Browser.version<9
}}}},{"ac-base":false}],11:[function(q,o,j){var n=q("ac-base").Element;var k=q("ac-base").Environment;
var p=q("ac-runtime-delegate");var l=q("ac-localnav-sticky").LocalnavSticky;var m=(function(){return{initialize:function(){this.sticky=new l();
function a(){p.initialize();if(p.supports("touch")){return}if(k.Browser.name==="IE"){return
}if(k.Browser.name==="Safari"&&k.Browser.version<6){return}var b=n.select(".section-hero .clouds");
AC.Element.addClassName(b,"show-clouds")}a();return this}}}());o.exports=m.initialize()
},{"ac-base":false,"ac-localnav-sticky":3,"ac-runtime-delegate":9}]},{},[11]);