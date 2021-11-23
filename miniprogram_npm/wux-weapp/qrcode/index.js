"use strict";var _index=_interopRequireDefault(require("./qr.js/index"));function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}var utf16to8=function(t){for(var e=t.length,r="",o=0;o<e;o++){var i=t.charCodeAt(o);1<=i&&i<=127?r+=t.charAt(o):(2047<i?(r+=String.fromCharCode(224|i>>12&15),r+=String.fromCharCode(128|i>>6&63)):r+=String.fromCharCode(192|i>>6&31),r+=String.fromCharCode(128|i>>0&63))}return r};Component({properties:{typeNumber:{type:Number,value:-1,observer:function(t){this.draw({typeNumber:t})}},errorCorrectLevel:{type:Number,value:2,observer:function(t){this.draw({errorCorrectLevel:t})}},width:{type:Number,value:200,observer:function(t){this.draw({width:t})}},height:{type:Number,value:200,observer:function(t){this.draw({height:t})}},whiteSpace:{type:Number,value:0,observer:function(t){this.draw({whiteSpace:t})}},fgColor:{type:String,value:"black",observer:function(t){this.draw({fgColor:t})}},bgColor:{type:String,value:"white",observer:function(t){this.draw({bgColor:t})}},canvasId:{type:String,value:"wux-qrcode"},data:{type:String,value:"",observer:function(t){this.draw({data:t})}}},methods:{draw:function(t){var a=this,e=0<arguments.length&&void 0!==t?t:{},r=Object.assign({},this.data,e),o=r.typeNumber,i=r.errorCorrectLevel,n=r.width,h=r.height,c=r.whiteSpace,u=r.fgColor,l=r.bgColor,s=r.canvasId,f=r.data,d=(0,_index.default)(utf16to8(f),{typeNumber:o,errorCorrectLevel:i}).modules,v=(n-2*c)/d.length,g=(h-2*c)/d.length;this.ctx=this.ctx||wx.createCanvasContext(s,this),this.ctx.scale(1,1),this.ctx.setFillStyle("#ffffff"),this.ctx.fillRect(0,0,n,h),d.forEach(function(t,i){t.forEach(function(t,e){a.ctx.setFillStyle(t?u:l);var r=Math.ceil((e+1)*v)-Math.floor(e*v),o=Math.ceil((i+1)*g)-Math.floor(i*g);a.ctx.fillRect(Math.round(e*v)+c,Math.round(i*g)+c,r,o)})}),this.ctx.draw()},onTap:function(){this.triggerEvent("click")}},attached:function(){this.draw()},detached:function(){this.ctx=null}});