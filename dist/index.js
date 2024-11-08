'use strict';var u=(s=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(s,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):s)(function(s){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+s+'" is not supported')});var f=(s,t)=>()=>(t||s((t={exports:{}}).exports,t),t.exports);var y=f((w,d)=>{var I={calcItemTotal:function(s){let t=s.price||0,e=s.quantity||1;return (t*e).toFixed(2)},calcSubTotal:function(s){if(s.length===0)return 0;let t=0;return s.forEach(e=>{t+=Number(this.calcItemTotal(e));}),t.toFixed(2)},calcTax:function(s){if(s.length===0)return 0;let t=0;return s.forEach(e=>{let c=e.price,a=e.quantity,o=e.tax||0;t+=c*a*o/100;}),t.toFixed(2)},calcFinalTotal:function(s){if(s.length===0)return 0;let t=Number(this.calcSubTotal(s)),e=Number(this.calcTax(s));return (t+e).toFixed(2)}};d.exports=I;});var p=f((C,g)=>{var T={string:{invoice:"F A C T U R A",refNumber:"N\xBA Factura",date:"Fecha",dueDate:"Fecha factura",status:"Estado",billTo:"Facturado a",item:"Producto",quantity:"Cantidad",price:"Precio",tax:"IVA",total:"Total",subTotal:"Subtotal",totalTax:"Total IVA"}};g.exports=T;});var v=u("fs"),k=u("path"),q=u("pdfmake"),r=y(),S=p(),h=class{payload;company;invoice;customer;items;currency;path;qr;note;date;config;constructor(t,e=S){this.payload=t,this.company=t.company,this.customer=t.customer,this.invoice=t.invoice,this.items=t.items,this.qr=t.qr,this.note=t.note,this.currency=this.invoice.currency||"$",this.path=k.resolve(this.invoice.path)||"./invoice.pdf",this.date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"numeric",day:"numeric"}),this.config=e;}async create(){let t=new q(this.fonts()),e={pageSize:"A4",orientation:"portrait",pageMargins:[40,40,40,40],info:this.docMeta(),content:this.content(),defaultStyle:this.docStyle(),styles:this.docTypo()};return new Promise((c,a)=>{let o=t.createPdfKitDocument(e),l=v.createWriteStream(this.path);o.pipe(l),o.on("end",()=>c(this.path)),o.on("error",i=>a(i)),o.end();})}fonts(){let t={Helvetica:{normal:"Helvetica",bold:"Helvetica-Bold",italics:"Helvetica-Oblique",bolditalics:"Helvetica-BoldOblique"},Times:{normal:"Times-Roman",bold:"Times-Bold",italics:"Times-Italic",bolditalics:"Times-BoldItalic"},Courier:{normal:"Courier",bold:"Courier-Bold",italics:"Courier-Oblique",bolditalics:"Courier-BoldOblique"}},e=this.config?.font||null;return e&&Object.keys(e).length>0&&Object.assign(t,e),t}docMeta(){return {title:"Invoice - #"+this.invoice.number,author:this.company.name,subject:"Invoice - "+this.customer.name,keywords:"invoice"}}docStyle(){let t={font:"Helvetica",fontSize:this.config?.style?.fontSize||10,lineHeight:1.8,bold:!1,color:"#000000",columnGap:30},e=this.config.style||null;return e&&Object.keys(e).length>0&&(t={...t,...e}),t}docTypo(){return {h1:{fontSize:18,bold:!0},h2:{fontSize:16,bold:!0},h3:{fontSize:14,bold:!0},text:{fontSize:this.config?.style?.fontSize||10,bold:!1},textBold:{fontSize:this.config?.style?.fontSize||10,bold:!0}}}content(){let t=[],e={columns:[{width:"70%",stack:[],style:"text"},{width:"30%",stack:[],style:"text"}]};if(this.company.logo){if(!this.company.logo.startsWith("<svg"))throw new Error("Only SVG logo are supported.");e.columns[0].stack.unshift({svg:this.company.logo,margin:[0,0,0,20]}),e.columns[0].stack.push({text:this.company.name,style:"h3"});}else e.columns[0].stack.unshift({text:this.company.name,style:"h1"});this.company.address&&e.columns[0].stack.push({text:this.company.address,style:"text"}),this.company.phone&&e.columns[0].stack.push({text:this.company.phone,style:"text"}),this.company.email&&e.columns[0].stack.push({text:this.company.email,style:"text"}),this.company.website&&e.columns[0].stack.push({text:this.company.website,style:"text"}),this.company.taxId&&e.columns[0].stack.push({text:this.company.taxId,style:"text"}),this.invoice.label?e.columns[1].stack.unshift({text:this.invoice.label,style:"h1"}):e.columns[1].stack.unshift({text:this.config.string.invoice||"F A C T U R A",style:"h1"});let c=this.config.string.refNumber||"Facturado a:";e.columns[1].stack.push({text:c+": #"+(this.invoice.number||1),style:"textBold"});let a=this.config.string.date;e.columns[1].stack.push({text:a+": "+(this.invoice.date||this.date),style:"text"});let o=this.config.string.dueDate;e.columns[1].stack.push({text:o+": "+(this.invoice.dueDate||this.date),style:"text"});let l=this.config.string.status;e.columns[1].stack.push({text:l+": "+(this.invoice.status||"Pendiente"),style:"textBold"}),t.push(e);let i={columns:[{width:300,margin:[0,30,0,0],stack:[{text:this.config.string.billTo,style:"h2"}],style:"text"}]};this.customer.name&&i.columns[0].stack.push({text:this.customer.name,style:"textBold"}),this.customer.company&&i.columns[0].stack.push({text:this.customer.company,style:"text"}),this.customer.address&&i.columns[0].stack.push({text:this.customer.address,style:"text"}),this.customer.phone&&i.columns[0].stack.push({text:this.customer.phone,style:"text"}),this.customer.email&&i.columns[0].stack.push({text:this.customer.email,style:"text"}),this.customer.taxId&&i.columns[0].stack.push({text:this.customer.taxId,style:"text"}),t.push(i);let m={margin:[0,30,0,0],lineHeight:1.5,table:{widths:[200,50,"*",50,"*"],headerRows:1,lineHeight:1.5,body:[[`
 ${this.config.string.item}`,`
 ${this.config.string.quantity}`,`
 ${this.config.string.price}`,`
 ${this.config.string.tax}`,`
 ${this.config.string.total}`]]}};this.items.length>0&&this.items.forEach(n=>{let b=r.calcItemTotal(n);m.table.body.push([`
 ${n.name}`,`
 ${n.quantity}`,`
 ${this.currency}${n.price}`,`
 ${n.tax||0}%`,`
 ${this.currency}${b}`]);}),t.push(m);let x={margin:[0,20,0,0],columns:[{width:"*",stack:[" "],style:"text"},{width:200,lineHeight:1.5,style:"textBold",table:{widths:[80,"*"],headerRows:1,lineHeight:1.5,body:[[`
 ${this.config.string.subTotal}`,`
 ${this.currency}${r.calcSubTotal(this.items)}`],[`
 ${this.config.string.totalTax}`,`
 ${this.currency}${r.calcTax(this.items)}`],[`
 ${this.config.string.total}`,`
 ${this.currency}${r.calcFinalTotal(this.items)}`]]}}]};if(t.push(x),this.payload.qr){let n={margin:[0,50,0,0],qr:this.payload.qr.data,fit:this.payload.qr.width||"50"};t.push(n);}if(this.payload.note){let n={margin:[0,this.payload.qr?20:50,0,0],text:this.payload.note,italics:!0};t.push(n);}return t}};exports.PDFInvoice=h;//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map