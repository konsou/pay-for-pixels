(this["webpackJsonppay-for-pixels-frontend"]=this["webpackJsonppay-for-pixels-frontend"]||[]).push([[0],{101:function(e,t,n){},120:function(e,t,n){},121:function(e,t,n){},230:function(e,t,n){},231:function(e,t,n){},232:function(e,t,n){},233:function(e,t,n){"use strict";n.r(t);var c=n(3),o=n(0),i=n.n(o),r=n(87),a=n.n(r),l=(n(99),n(30)),s=n(50),u=n.n(s),j=n(88),x=n(8),d=(n(101),n(89)),b=n.n(d),h=(n(120),function(e){var t=e.header,n=e.text;return Object(c.jsxs)("div",{className:"header",children:[Object(c.jsx)("h1",{children:t}),Object(c.jsxs)("h2",{children:[n," (",Object(c.jsx)("a",{href:"https://stripe.com/docs/testing#cards",target:"_blank",rel:"noreferrer",children:"more info"}),")"]})]})}),p=function(e){var t=e.pixelData,n=e.activePixel,i=e.setActivePixelFunction,r=e.pixelSize,a=Object(o.useState)(t.color),l=Object(x.a)(a,2),s=l[0],u=l[1],j=function(){return null!==n&&t.x===n.x&&t.y===n.y};return j()&&"#111"!==s&&u("#111"),j()||"#111"!==s||u(t.color),0===t.x&&0===t.y&&console.log("isActive",j()),Object(c.jsx)("td",{className:"pixel",style:{backgroundColor:t.color,width:r,height:r,padding:0,borderWidth:"1px",borderStyle:"solid",borderColor:s},onClick:function(){return i(t)},onMouseEnter:function(){j()||u("black")},onMouseLeave:function(){j()||u(t.color)}})},O=function(e){var t=e.pixelRowData,n=e.activePixel,o=e.setActivePixelFunction,i=e.pixelSize;return Object(c.jsx)("tr",{className:"pixelRow",children:t.map((function(e){return Object(c.jsx)(p,{pixelData:e,activePixel:n,setActivePixelFunction:o,pixelSize:i},e.x)}))})},f=(n(121),function(e){var t=e.fullPixelData,n=e.activePixel,o=e.setActivePixelFunction,i=e.pixelSize;return console.log("in PixelGrid"),Object(c.jsx)("table",{className:"pixelGrid",children:Object(c.jsx)("tbody",{children:t.map((function(e){return Object(c.jsx)(O,{pixelRowData:e,activePixel:n,setActivePixelFunction:o,pixelSize:i},e[0].y)}))})})}),g=n(28),v=(Object(g.a)("pk_test_RMqvxnEUv0TbhaRCpLNpNzeF00G9e3C2JE"),n(6)),m=n(52),C=function(){return JSON.parse(localStorage.getItem("cart"))},y={add:function(e){console.log("adding to local storage cart",e);var t=C()||[];t.some((function(t){return t.x===e.x&&t.y===e.y}))?console.log("duplicate item, not adding"):(console.log("cart doesn't contain that, adding"),localStorage.setItem("cart",JSON.stringify([].concat(Object(l.a)(t),[e])))),console.log("local storage cart:"),console.log(C())},get:C,empty:function(){localStorage.removeItem("cart")}},w=function(e){var t=e.pixelData,n=e.claimPixelsFunction,i=e.addToCartFunction,r=Object(o.useState)(null),a=Object(x.a)(r,2),l=a[0],s=a[1],u=Object(o.useState)(!1),j=Object(x.a)(u,2),d=j[0],b=j[1];return console.log("in PixelInfoEditable"),console.log("pixelData:",t),console.log("pixel:",l),(null===l&&null!==t||null!==l&&l.x!==t.x||null!==l&&l.y!==t.y)&&s(Object(v.a)(Object(v.a)({},t),{},{amount:t.amount+.05})),l&&null!==l?Object(c.jsxs)("div",{className:"pixelInfo",style:{border:"1px solid black",width:"276px"},children:[Object(c.jsxs)("h1",{children:["Pixel ",l.x,",",l.y]}),Object(c.jsxs)("label",{children:["Claimed by:",Object(c.jsx)("input",{type:"text",value:l.owner,onChange:function(e){return s(Object(v.a)(Object(v.a)({},l),{},{owner:e.target.value}))}}),Object(c.jsx)("br",{})]}),Object(c.jsxs)("label",{children:["Color:",Object(c.jsx)("div",{style:{backgroundColor:l.color,width:"100%",height:"50px"}}),d?Object(c.jsx)(m.a,{color:l.color,width:"250px",onChangeComplete:function(e,t){return s(Object(v.a)(Object(v.a)({},l),{},{color:e.hex}))}}):Object(c.jsx)(m.b,{color:l.color,onChange:function(e,t){return s(Object(v.a)(Object(v.a)({},l),{},{color:e.hex}))}}),Object(c.jsx)("button",{style:{width:"100%"},onClick:function(){return b(!d)},children:d?"Basic...":"Advanced..."}),Object(c.jsx)("br",{})]}),Object(c.jsxs)("label",{children:["Note:",Object(c.jsx)("input",{type:"text",value:l.note,onChange:function(e){return s(Object(v.a)(Object(v.a)({},l),{},{note:e.target.value}))}}),Object(c.jsx)("br",{})]}),Object(c.jsxs)("label",{children:["Claim amount:",Object(c.jsx)("input",{type:"text",value:l.amount,style:{width:"3em",textAlign:"right"},onChange:function(e){return s(Object(v.a)(Object(v.a)({},l),{},{amount:e.target.value}))}})," \u20ac",Object(c.jsx)("br",{})]}),Object(c.jsxs)("button",{onClick:function(){return n([l])},children:["Claim for ",l.amount," \u20ac"]}),Object(c.jsx)("button",{onClick:function(){return i(l)},children:"Add to Cart"})]}):Object(c.jsx)("div",{className:"pixelInfo",children:Object(c.jsx)("p",{children:"No pixel selected"})})},S=(n(230),function(e){var t=e.contents,n=e.checkoutFunction;return console.log("shopping cart - contents",t),Object(c.jsxs)("div",{className:"shoppingCart",children:[Object(c.jsx)("h1",{children:"Cart"}),t.map((function(e){return Object(c.jsxs)("div",{className:"shoppingCartItem",children:[Object(c.jsxs)("div",{children:["Pixel ",e.x,", ",e.y]}),Object(c.jsxs)("div",{children:["Owner: ",e.owner]}),Object(c.jsxs)("div",{children:["Color: ",e.color]}),Object(c.jsxs)("div",{children:["Note: ",e.note]}),Object(c.jsxs)("div",{children:["Claim amount: ",e.amount]})]},"".concat(e.x,"-").concat(e.y))})),Object(c.jsx)("button",{onClick:function(){return n(t)},children:"Checkout"})]})}),k=n.p+"static/media/shopping-cart.f0432bbd.svg",P=(n(231),function(e){var t=e.itemsInCart;return t>0?Object(c.jsxs)("div",{id:"shoppingCartIndicator",children:[Object(c.jsx)("img",{src:k,id:"shoppingCartIndicatorImage",alt:"Shopping Cart"}),Object(c.jsx)("div",{id:"shoppingCartIndicatorCount",children:t})]}):null}),F=(n(232),function(){return Object(c.jsxs)("div",{className:"footer",children:["Copyright \xa9 Tomi Javanainen 2021. Shopping cart icon by ",Object(c.jsx)("a",{href:"https://www.freepik.com/",target:"_blank",rel:"noreferrer",children:"Freepik"})," from ",Object(c.jsx)("a",{href:"https://www.flaticon.com/",title:"Flaticon",target:"_blank",rel:"noreferrer",children:"www.flaticon.com"}),"."]})}),N=Object(g.a)("pk_test_RMqvxnEUv0TbhaRCpLNpNzeF00G9e3C2JE"),I="http://pixels.rpghelpers.com:4242",T=[];var D=function(){var e=Object(o.useState)(null),t=Object(x.a)(e,2),n=t[0],i=t[1],r=Object(o.useState)(null),a=Object(x.a)(r,2),s=a[0],d=a[1],p=Object(o.useState)(5),O=Object(x.a)(p,2),g=O[0],v=(O[1],Object(o.useState)(null)),m=Object(x.a)(v,2),C=(m[0],m[1],Object(o.useState)(new Set(y.get()))),k=Object(x.a)(C,2),D=k[0],A=k[1];console.log("render"),Object(o.useEffect)((function(){console.log("running effect"),b.a.get("".concat(I,"/pixels")).then((function(e){i(e.data)})).catch((function(e){console.log(e)}))}),[]),0===T.length&&null!==n&&(T=n);var E=function(){var e=Object(j.a)(u.a.mark((function e(t){var n,c,o,i,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N;case 2:return n=e.sent,c={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)},A(new Set),y.empty(),e.next=7,fetch("".concat(I,"/claim-pixels"),c);case 7:return o=e.sent,e.next=10,o.json();case 10:return i=e.sent,e.next=13,n.redirectToCheckout({sessionId:i.id});case 13:(r=e.sent).error&&console.log(r.error.message);case 15:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return null===n?Object(c.jsx)("h1",{children:"Loading..."}):Object(c.jsxs)("div",{className:"content",style:{display:"flex",flexFlow:"row wrap",justifyContent:"center"},children:[Object(c.jsx)(h,{header:"TESTING MODE",text:"Use card number 4242 4242 4242 4242 for purchases"}),Object(c.jsx)(f,{fullPixelData:T,activePixel:s,setActivePixelFunction:d,pixelSize:g,style:{border:"1px solid black"}}),Object(c.jsxs)("div",{children:[Object(c.jsx)(w,{pixelData:s,claimPixelsFunction:E,addToCartFunction:function(e){var t=new Set(D);t.add(e),A(t),y.add(e)}}),Object(c.jsx)(S,{contents:Object(l.a)(D),checkoutFunction:E})]}),Object(c.jsx)(P,{itemsInCart:D.length}),Object(c.jsx)(F,{})]})},A=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,235)).then((function(t){var n=t.getCLS,c=t.getFID,o=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),c(e),o(e),i(e),r(e)}))};a.a.render(Object(c.jsx)(i.a.StrictMode,{children:Object(c.jsx)(D,{})}),document.getElementById("root")),A()},99:function(e,t,n){}},[[233,1,2]]]);
//# sourceMappingURL=main.2b65da3f.chunk.js.map