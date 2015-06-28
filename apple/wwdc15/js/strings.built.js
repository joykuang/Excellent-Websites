require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"RnOWMn":[function(require,module,exports){
module.exports={
	"locale": {
		"zh_CN": true,
		"lang": "zh-CN",
		"country": "cn",
		"path": "."
	},
	"page": {
		"base"        : "/apple/wwdc15",
		"slug"        : "wwdc15",
		"title"       : "Apple - Live - 2015 年 6 月特别活动",
		"description" : "",
		"track"       : "Apple Live - 2015 年 6 月",
		"breadcrumb"  : "2015 年 6 月特别活动",
		"headline"    : "Apple Live",
		"subhead"     : "2015 年 6 月",
		"notification": {
			"singular": "新消息",
			"plural"  : "新消息"
		},
		"requirements": {
			"live": "观看现场直播视频需要在 OS X v10.8.5 或更新版本操作系统上使用 Safari 6.0.5 或更新版本；在 iOS 6.0 或更新版本操作系统上使用 Safari。 在 Apple TV 上观看现场直播视频，需要使用第二代或第三代 Apple TV，以及 6.2 或更新版本的软件。",
			"vod": "观看流媒体视频需要在 OS X v10.8.5 或更新版本操作系统上使用 Safari 6.0.5 或更新版本；在 iOS 6.0 或更新版本操作系统上使用 Safari; 或在 Windows 上使用 QuickTime 7。"
		},
		"sosumi": [
			"显示时间取决于你的系统时区设置。",
			"某些功能仅适用于部分地区或语言。",
			"在 Apple TV 上观看流媒体视频，需要使用第二代或第三代 Apple TV，以及 6.2 或更新版本的软件。"
		],
		"states": [
			{
				"state": "before",
				"state_headline": "现场直播将于北京时间 2015 年 6 月 9 日凌晨 1 点开始。",
				"state_subhead": "敬请关注以下图文直播，分享 #AppleLive# 的每个精彩瞬间。",
				"show_live_requirements": true
			},
			{
				"state": "pending",
				"state_headline": "今天特别活动的重播视频即将准备就绪。",
				"state_subhead": "以下图文直播也已为你追踪了今天活动的重要时刻。",
				"show_vod_requirements": true
			},
			{
				"state": "live",
				"state_headline": "Apple Live",
				"state_subhead": "2015 年 6 月",
				"show_live_requirements": true,
				"show_keynotecta": true
			},
			{
				"state": "vod",
				"state_headline": "Apple Live",
				"state_subhead": "2015 年 6 月",
				"show_vod_requirements": true,
				"show_keynotecta": true
			},
			{
				"state": "error",
				"state_headline": "现场直播视频暂时无法播放。",
				"state_subhead": "请稍后回来，或关注以下图文直播。",
				"show_live_requirements": true
			},
			{
				"state": "unsupported",
				"state_headline": "观看现场直播视频需要在 OS X v10.8.5 或更新版本操作系统上使用 Safari 6.0.5 或更新版本；在 iOS 6.0 或更新版本操作系统上使用 Safari。 在 Apple TV 上观看现场直播视频，需要使用第二代或第三代 Apple TV，以及 6.2 或更新版本的软件。",
				"state_subhead": "你仍能通过以下图文直播，关注今天活动的每个精彩瞬间。"
			},
			{
				"state": "event",
				"state_headline": "很抱歉，会场中心暂时无法传送现场直播视频。",
				"state_subhead": "请亲自至现场或分会场关注主题演讲，或关注以下图文直播。",
				"show_live_requirements": true
			},
			{
				"state": "full",
				"state_headline": "现场直播视频暂时无法播放。",
				"state_subhead": "敬请关注以下的图文直播。",
				"show_live_requirements": true
			}
		]
	},
	"ui": {
		"explore": "展开探索",
		"play": "播放",
		"play_live": "播放直播视频",
		"play_resume": "继续播放",
		"pause": "暂停",
		"close": "关闭",
		"share": "分享",
		"share_moment": "分享自",
		"share_video": "分享视频",
		"sort": "排列",
		"top": "返回顶部"
	},
	"sharesheet": {
		"cta": "分享",
		"facebook": "分享至 Facebook",
		"twitter": "分享至 Twitter",
		"pinterest": "分享至 Pinterest",
		"tumblr": "分享至 Tumblr",
		"link": "复制链接",
		"weibo": "分享至新浪微博",
		"qqweibo": "分享至腾讯微博",
		"renren": "分享至人人网",
		"qzone": "分享至 QQ 空间",
		"retweet": "在 Twitter 上转发",
		"reply": "在 Twitter 上评论",
		"favorite": "在 Twitter 上收藏",
		"email": {
			"label": "通过邮件分享",
			"subject": "来自 Apple 特别活动",
			"subject_moment": "Apple 特别活动的视频片段",
			"body": "希望你喜欢 Apple 特别活动的这个精彩片段：{%share.links.email%}。",
			"body_quote": "希望你喜欢 2015 年 6 月 Apple 特别活动的这段经典引言：\n\n “{%copy%}”\n – {%source.name%}\n\n, 有关活动视频和更多来自该活动的精彩内容，尽在 {%share.links.email%}。",
			"body_page": "希望你喜欢 2015 年 6 月 Apple 特别活动的这个视频片段。访问 {%links.email%} 进一步关注与分享每个精彩的瞬间。",
			"body_moment": "希望你喜欢 2015 年 6 月 Apple 特别活动的这个视频片段： {%link%}。"
		}
	},
	"keynotecta"      : "观看主题演讲",
	"share": {
		"title"       : "观看 Apple 特别活动现场直播。",
		"description" : "不错过 WWDC 每个激动人心的发布信息。",
		"twitter_description" : "关注 Apple 特别活动的每一个精彩瞬间。",
		"hashtags"    : ["AppleLive"],
		"links"         : {
			"directLink" : "http://www.apple.com/cn/live/2015-june-event/?cid=li-cn-keynote-june-2015",
			"qq": "http://www.apple.com/cn/live/2015-june-event/?cid=qq-cn-keynote-june-2015",
			"qzone": "http://www.apple.com/cn/live/2015-june-event/?cid=qz-cn-keynote-june-2015",
			"weibo": "http://www.apple.com/cn/live/2015-june-event/?cid=we-cn-keynote-june-2015"
		},
		"images": {
			"share_og": "http://images.apple.com/live/2015-june-event/images/og.jpg",
			"share_pt": "http://images.apple.com/live/2015-june-event/images/og.jpg"
		}
	},
	"share_moment": {
		"share": {
			"tweet": "观看 2015 年 6 月 Apple 特别活动的这段精彩视频。"
		}
	}
}

},{}],"strings":[function(require,module,exports){
module.exports=require('RnOWMn');
},{}]},{},["RnOWMn"])