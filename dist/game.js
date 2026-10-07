(()=>{var Jh=0,oc=1,Kh=2;var Hi=1,Qh=2,Ps=3,wi=0,Qe=1,yn=2,Xn=0,Ls=1,si=2,ac=3,lc=4,jh=5;var Gi=100,tu=101,eu=102,nu=103,iu=104,su=200,ru=201,ou=202,au=203,cc=204,hc=205,lu=206,cu=207,hu=208,uu=209,du=210,fu=211,pu=212,mu=213,gu=214,To=0,Eo=1,Ao=2,gs=3,Ro=4,Co=5,Io=6,Po=7,aa=0,xu=1,_u=2,Pn=0,uc=1,dc=2,fc=3,pc=4,mc=5,gc=6,xc=7;var _c=300,Ti=301,Vi=302,la=303,ca=304,Fr=306,xs=1e3,kn=1001,Lo=1002,De=1003,yu=1004;var Wi=1005;var Ve=1006,ha=1007;var Ei=1008;var nn=1009,yc=1010,vc=1011,Ds=1012,ua=1013,Ln=1014,vn=1015,Dn=1016,da=1017,fa=1018,Ns=1020,Mc=35902,Sc=35899,bc=1021,wc=1022,Mn=1023,Hn=1026,Ai=1027,pa=1028,ma=1029,Ri=1030,ga=1031;var xa=1033,Or=33776,Br=33777,kr=33778,zr=33779,_a=35840,ya=35841,va=35842,Ma=35843,Sa=36196,ba=37492,wa=37496,Ta=37488,Ea=37489,Hr=37490,Aa=37491,Ra=37808,Ca=37809,Ia=37810,Pa=37811,La=37812,Da=37813,Na=37814,Ua=37815,Fa=37816,Oa=37817,Ba=37818,ka=37819,za=37820,Ha=37821,Ga=36492,Va=36494,Wa=36495,Xa=36283,qa=36284,Gr=36285,Ya=36286;var tr=2300,Do=2301,bo=2302,ql=2303,Yl=2400,Zl=2401,$l=2402;var vu=3200;var Za=0,Mu=1,ri="",Ge="srgb",er="srgb-linear",nr="linear",me="srgb";var wo=7680;var Su=519,bu=512,wu=513,Tu=514,$a=515,Eu=516,Au=517,Ja=518,Ru=519,Tc=35044;var Ec="300 es",An=2e3,_s=2001;function tf(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ef(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function ir(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Cu(){let s=ir("canvas");return s.style.display="block",s}var mh={},ys=null;function sr(...s){let t="THREE."+s.shift();ys?ys("log",t,...s):console.log(t,...s)}function Iu(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Xt(...s){s=Iu(s);let t="THREE."+s.shift();if(ys)ys("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Gt(...s){s=Iu(s);let t="THREE."+s.shift();if(ys)ys("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Bi(...s){let t=s.join(" ");t in mh||(mh[t]=!0,Xt(...s))}function Pu(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Lu={[To]:Eo,[Ao]:Io,[Ro]:Po,[gs]:Co,[Eo]:To,[Io]:Ao,[Po]:Ro,[Co]:gs},Gn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var yl=Math.PI/180,rr=180/Math.PI;function ei(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[s&255]+Xe[s>>8&255]+Xe[s>>16&255]+Xe[s>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function se(s,t,e){return Math.max(t,Math.min(e,s))}function nf(s,t){return(s%t+t)%t}function vl(s,t,e){return(1-e)*s+e*t}function Bn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function _e(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Lc=class Lc{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Lc.prototype.isVector2=!0;var ft=Lc,xn=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(d!==v||l!==u||c!==f||h!==g){let m=l*u+c*f+h*g+d*v;m<0&&(u=-u,f=-f,g=-g,v=-v,m=-m);let p=1-a;if(m<.9995){let M=Math.acos(m),E=Math.sin(M);p=Math.sin(p*M)/E,a=Math.sin(a*M)/E,l=l*p+u*a,c=c*p+f*a,h=h*p+g*a,d=d*p+v*a}else{l=l*p+u*a,c=c*p+f*a,h=h*p+g*a,d=d*p+v*a;let M=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=M,c*=M,h*=M,d*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-a*f,t[e+2]=c*g+h*f+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:Xt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(se(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Dc=class Dc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(gh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(gh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this.z=se(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this.z=se(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ml.copy(this).projectOnVector(t),this.sub(Ml)}reflect(t){return this.sub(Ml.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Dc.prototype.isVector3=!0;var L=Dc,Ml=new L,gh=new xn,Nc=class Nc{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],v=i[0],m=i[3],p=i[6],M=i[1],E=i[4],_=i[7],b=i[2],w=i[5],I=i[8];return r[0]=o*v+a*M+l*b,r[3]=o*m+a*E+l*w,r[6]=o*p+a*_+l*I,r[1]=c*v+h*M+d*b,r[4]=c*m+h*E+d*w,r[7]=c*p+h*_+d*I,r[2]=u*v+f*M+g*b,r[5]=u*m+f*E+g*w,r[8]=u*p+f*_+g*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=e*d+n*u+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return t[0]=d*v,t[1]=(i*c-h*n)*v,t[2]=(a*n-i*o)*v,t[3]=u*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Bi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Sl.makeScale(t,e)),this}rotate(t){return Bi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Sl.makeRotation(-t)),this}translate(t,e){return Bi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Sl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Nc.prototype.isMatrix3=!0;var Zt=Nc,Sl=new Zt,xh=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_h=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sf(){let s={enabled:!0,workingColorSpace:er,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===me&&(i.r=ni(i.r),i.g=ni(i.g),i.b=ni(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===me&&(i.r=ms(i.r),i.g=ms(i.g),i.b=ms(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ri?nr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Bi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Bi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[er]:{primaries:t,whitePoint:n,transfer:nr,toXYZ:xh,fromXYZ:_h,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ge},outputColorSpaceConfig:{drawingBufferColorSpace:Ge}},[Ge]:{primaries:t,whitePoint:n,transfer:me,toXYZ:xh,fromXYZ:_h,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ge}}}),s}var oe=sf();function ni(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ms(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Ki,No=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ki===void 0&&(Ki=ir("canvas")),Ki.width=t.width,Ki.height=t.height;let i=Ki.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Ki}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ir("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=ni(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ni(e[n]/255)*255):e[n]=ni(e[n]);return{data:e,width:t.width,height:t.height}}else return Xt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},rf=0,vs=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=ei(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(bl(i[o].image)):r.push(bl(i[o]))}else r=bl(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function bl(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?No.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Xt("Texture: Unable to serialize Texture."),{})}var of=0,wl=new L,Je=class s extends Gn{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=kn,i=kn,r=Ve,o=Ei,a=Mn,l=nn,c=s.DEFAULT_ANISOTROPY,h=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=ei(),this.name="",this.source=new vs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(wl).x}get height(){return this.source.getSize(wl).y}get depth(){return this.source.getSize(wl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Xt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Xt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_c)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case xs:t.x=t.x-Math.floor(t.x);break;case kn:t.x=t.x<0?0:1;break;case Lo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case xs:t.y=t.y-Math.floor(t.y);break;case kn:t.y=t.y<0?0:1;break;case Lo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=_c;Je.DEFAULT_ANISOTROPY=1;var Uc=class Uc{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let E=(c+1)/2,_=(f+1)/2,b=(p+1)/2,w=(h+u)/4,I=(d+v)/4,y=(g+m)/4;return E>_&&E>b?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=w/n,r=I/n):_>b?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=w/i,r=y/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=I/r,i=y/r),this.set(n,i,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(d-v)/M,this.z=(u-h)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this.z=se(this.z,t.z,e.z),this.w=se(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this.z=se(this.z,t,e),this.w=se(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Uc.prototype.isVector4=!0;var Te=Uc,Uo=class extends Gn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ve,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Te(0,0,t,e),this.scissorTest=!1,this.viewport=new Te(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},r=new Je(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ve,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new vs(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},tn=class extends Uo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},or=class extends Je{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=De,this.minFilter=De,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fo=class extends Je{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=De,this.minFilter=De,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var oa=class oa{constructor(t,e,n,i,r,o,a,l,c,h,d,u,f,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,u,f,g,v,m)}set(t,e,n,i,r,o,a,l,c,h,d,u,f,g,v,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oa().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/Qi.setFromMatrixColumn(t,0).length(),r=1/Qi.setFromMatrixColumn(t,1).length(),o=1/Qi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,f=o*d,g=a*h,v=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u+v*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u-v*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,f=o*d,g=a*h,v=a*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=v-u*d,e[8]=g*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-v*d}else if(t.order==="XZY"){let u=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=o*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(af,t,lf)}lookAt(t,e,n){let i=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),hi.crossVectors(n,an),hi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),hi.crossVectors(n,an)),hi.normalize(),$r.crossVectors(an,hi),i[0]=hi.x,i[4]=$r.x,i[8]=an.x,i[1]=hi.y,i[5]=$r.y,i[9]=an.y,i[2]=hi.z,i[6]=$r.z,i[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],M=n[3],E=n[7],_=n[11],b=n[15],w=i[0],I=i[4],y=i[8],A=i[12],P=i[1],F=i[5],B=i[9],G=i[13],U=i[2],k=i[6],Z=i[10],K=i[14],at=i[3],$=i[7],et=i[11],rt=i[15];return r[0]=o*w+a*P+l*U+c*at,r[4]=o*I+a*F+l*k+c*$,r[8]=o*y+a*B+l*Z+c*et,r[12]=o*A+a*G+l*K+c*rt,r[1]=h*w+d*P+u*U+f*at,r[5]=h*I+d*F+u*k+f*$,r[9]=h*y+d*B+u*Z+f*et,r[13]=h*A+d*G+u*K+f*rt,r[2]=g*w+v*P+m*U+p*at,r[6]=g*I+v*F+m*k+p*$,r[10]=g*y+v*B+m*Z+p*et,r[14]=g*A+v*G+m*K+p*rt,r[3]=M*w+E*P+_*U+b*at,r[7]=M*I+E*F+_*k+b*$,r[11]=M*y+E*B+_*Z+b*et,r[15]=M*A+E*G+_*K+b*rt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15],M=l*f-c*u,E=a*f-c*d,_=a*u-l*d,b=o*f-c*h,w=o*u-l*h,I=o*d-a*h;return e*(v*M-m*E+p*_)-n*(g*M-m*b+p*w)+i*(g*E-v*b+p*I)-r*(g*_-v*w+m*I)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+i*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],M=e*a-n*o,E=e*l-i*o,_=e*c-r*o,b=n*l-i*a,w=n*c-r*a,I=i*c-r*l,y=h*v-d*g,A=h*m-u*g,P=h*p-f*g,F=d*m-u*v,B=d*p-f*v,G=u*p-f*m,U=M*G-E*B+_*F+b*P-w*A+I*y;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/U;return t[0]=(a*G-l*B+c*F)*k,t[1]=(i*B-n*G-r*F)*k,t[2]=(v*I-m*w+p*b)*k,t[3]=(u*w-d*I-f*b)*k,t[4]=(l*P-o*G-c*A)*k,t[5]=(e*G-i*P+r*A)*k,t[6]=(m*_-g*I-p*E)*k,t[7]=(h*I-u*_+f*E)*k,t[8]=(o*B-a*P+c*y)*k,t[9]=(n*P-e*B-r*y)*k,t[10]=(g*w-v*_+p*M)*k,t[11]=(d*_-h*w-f*M)*k,t[12]=(a*A-o*F-l*y)*k,t[13]=(e*F-n*A+i*y)*k,t[14]=(v*E-g*b-m*M)*k,t[15]=(h*b-d*E+u*M)*k,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,v=o*h,m=o*d,p=a*d,M=l*c,E=l*h,_=l*d,b=n.x,w=n.y,I=n.z;return i[0]=(1-(v+p))*b,i[1]=(f+_)*b,i[2]=(g-E)*b,i[3]=0,i[4]=(f-_)*w,i[5]=(1-(u+p))*w,i[6]=(m+M)*w,i[7]=0,i[8]=(g+E)*I,i[9]=(m-M)*I,i[10]=(1-(u+v))*I,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Qi.set(i[0],i[1],i[2]).length(),a=Qi.set(i[4],i[5],i[6]).length(),l=Qi.set(i[8],i[9],i[10]).length();r<0&&(o=-o),bn.copy(this);let c=1/o,h=1/a,d=1/l;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=d,bn.elements[9]*=d,bn.elements[10]*=d,e.setFromRotationMatrix(bn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=An,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),g,v;if(l)g=r/(o-r),v=o*r/(o-r);else if(a===An)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===_s)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=An,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i),g,v;if(l)g=1/(o-r),v=o/(o-r);else if(a===An)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===_s)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};oa.prototype.isMatrix4=!0;var ae=oa,Qi=new L,bn=new ae,af=new L(0,0,0),lf=new L(1,1,1),hi=new L,$r=new L,an=new L,yh=new ae,vh=new xn,Rn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(se(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-se(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(se(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Xt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return yh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vh.setFromEuler(this),this.setFromQuaternion(vh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Rn.DEFAULT_ORDER="XYZ";var Ms=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},cf=0,Mh=new L,ji=new xn,$n=new ae,Jr=new L,Gs=new L,hf=new L,uf=new xn,Sh=new L(1,0,0),bh=new L(0,1,0),wh=new L(0,0,1),Th={type:"added"},df={type:"removed"},ts={type:"childadded",child:null},Tl={type:"childremoved",child:null},ke=class s extends Gn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new L,e=new Rn,n=new xn,i=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ae},normalMatrix:{value:new Zt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ji.setFromAxisAngle(t,e),this.quaternion.multiply(ji),this}rotateOnWorldAxis(t,e){return ji.setFromAxisAngle(t,e),this.quaternion.premultiply(ji),this}rotateX(t){return this.rotateOnAxis(Sh,t)}rotateY(t){return this.rotateOnAxis(bh,t)}rotateZ(t){return this.rotateOnAxis(wh,t)}translateOnAxis(t,e){return Mh.copy(t).applyQuaternion(this.quaternion),this.position.add(Mh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sh,t)}translateY(t){return this.translateOnAxis(bh,t)}translateZ(t){return this.translateOnAxis(wh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4($n.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Jr.copy(t):Jr.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$n.lookAt(Gs,Jr,this.up):$n.lookAt(Jr,Gs,this.up),this.quaternion.setFromRotationMatrix($n),i&&($n.extractRotation(i.matrixWorld),ji.setFromRotationMatrix($n),this.quaternion.premultiply(ji.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Gt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Th),ts.child=t,this.dispatchEvent(ts),ts.child=null):Gt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(df),Tl.child=t,this.dispatchEvent(Tl),Tl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),$n.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),$n.multiply(t.parent.matrixWorld)),t.applyMatrix4($n),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Th),ts.child=t,this.dispatchEvent(ts),ts.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,t,hf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,uf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ke.DEFAULT_UP=new L(0,1,0);ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Jt=class extends ke{constructor(){super(),this.isGroup=!0,this.type="Group"}},ff={type:"move"},Ss=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ff)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Jt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Du={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},Kr={h:0,s:0,l:0};function El(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var $t=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=oe.workingColorSpace){if(t=nf(t,1),e=se(e,0,1),n=se(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=El(o,r,t+1/3),this.g=El(o,r,t),this.b=El(o,r,t-1/3)}return oe.colorSpaceToWorking(this,i),this}setStyle(t,e=Ge){function n(r){r!==void 0&&parseFloat(r)<1&&Xt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Xt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Xt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ge){let n=Du[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Xt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ni(t.r),this.g=ni(t.g),this.b=ni(t.b),this}copyLinearToSRGB(t){return this.r=ms(t.r),this.g=ms(t.g),this.b=ms(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ge){return oe.workingToColorSpace(qe.copy(this),t),Math.round(se(qe.r*255,0,255))*65536+Math.round(se(qe.g*255,0,255))*256+Math.round(se(qe.b*255,0,255))}getHexString(t=Ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(qe.copy(this),e);let n=qe.r,i=qe.g,r=qe.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=Ge){oe.workingToColorSpace(qe.copy(this),t);let e=qe.r,n=qe.g,i=qe.b;return t!==Ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ui),this.setHSL(ui.h+t,ui.s+e,ui.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ui),t.getHSL(Kr);let n=vl(ui.h,Kr.h,e),i=vl(ui.s,Kr.s,e),r=vl(ui.l,Kr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qe=new $t;$t.NAMES=Du;var ar=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new $t(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var lr=class extends ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},wn=new L,Jn=new L,Al=new L,Kn=new L,es=new L,ns=new L,Eh=new L,Rl=new L,Cl=new L,Il=new L,Pl=new Te,Ll=new Te,Dl=new Te,ti=class s{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),wn.subVectors(t,e),i.cross(wn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){wn.subVectors(i,e),Jn.subVectors(n,e),Al.subVectors(t,e);let o=wn.dot(wn),a=wn.dot(Jn),l=wn.dot(Al),c=Jn.dot(Jn),h=Jn.dot(Al),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,Kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Kn.x),l.addScaledVector(o,Kn.y),l.addScaledVector(a,Kn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return Pl.setScalar(0),Ll.setScalar(0),Dl.setScalar(0),Pl.fromBufferAttribute(t,e),Ll.fromBufferAttribute(t,n),Dl.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Pl,r.x),o.addScaledVector(Ll,r.y),o.addScaledVector(Dl,r.z),o}static isFrontFacing(t,e,n,i){return wn.subVectors(n,e),Jn.subVectors(t,e),wn.cross(Jn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),Jn.subVectors(this.a,this.b),wn.cross(Jn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;es.subVectors(i,n),ns.subVectors(r,n),Rl.subVectors(t,n);let l=es.dot(Rl),c=ns.dot(Rl);if(l<=0&&c<=0)return e.copy(n);Cl.subVectors(t,i);let h=es.dot(Cl),d=ns.dot(Cl);if(h>=0&&d<=h)return e.copy(i);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(es,o);Il.subVectors(t,r);let f=es.dot(Il),g=ns.dot(Il);if(g>=0&&f<=g)return e.copy(r);let v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(ns,a);let m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return Eh.subVectors(r,i),a=(d-h)/(d-h+(f-g)),e.copy(i).addScaledVector(Eh,a);let p=1/(m+v+u);return o=v*p,a=u*p,e.copy(n).addScaledVector(es,o).addScaledVector(ns,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Vn=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Tn):Tn.fromBufferAttribute(r,o),Tn.applyMatrix4(t.matrixWorld),this.expandByPoint(Tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Qr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Qr.copy(n.boundingBox)),Qr.applyMatrix4(t.matrixWorld),this.union(Qr)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Tn),Tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vs),jr.subVectors(this.max,Vs),is.subVectors(t.a,Vs),ss.subVectors(t.b,Vs),rs.subVectors(t.c,Vs),di.subVectors(ss,is),fi.subVectors(rs,ss),Ni.subVectors(is,rs);let e=[0,-di.z,di.y,0,-fi.z,fi.y,0,-Ni.z,Ni.y,di.z,0,-di.x,fi.z,0,-fi.x,Ni.z,0,-Ni.x,-di.y,di.x,0,-fi.y,fi.x,0,-Ni.y,Ni.x,0];return!Nl(e,is,ss,rs,jr)||(e=[1,0,0,0,1,0,0,0,1],!Nl(e,is,ss,rs,jr))?!1:(to.crossVectors(di,fi),e=[to.x,to.y,to.z],Nl(e,is,ss,rs,jr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Qn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Qn=[new L,new L,new L,new L,new L,new L,new L,new L],Tn=new L,Qr=new Vn,is=new L,ss=new L,rs=new L,di=new L,fi=new L,Ni=new L,Vs=new L,jr=new L,to=new L,Ui=new L;function Nl(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Ui.fromArray(s,r);let a=i.x*Math.abs(Ui.x)+i.y*Math.abs(Ui.y)+i.z*Math.abs(Ui.z),l=t.dot(Ui),c=e.dot(Ui),h=n.dot(Ui);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Le=new L,eo=new ft,pf=0,Ne=class extends Gn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Tc,this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)eo.fromBufferAttribute(this,e),eo.applyMatrix3(t),this.setXY(e,eo.x,eo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Bn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Bn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Bn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Bn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var cr=class extends Ne{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var hr=class extends Ne{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var re=class extends Ne{constructor(t,e,n){super(new Float32Array(t),e,n)}},mf=new Vn,Ws=new L,Ul=new L,Cn=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):mf.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ws.subVectors(t,this.center);let e=Ws.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ws,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ul.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ws.copy(t.center).add(Ul)),this.expandByPoint(Ws.copy(t.center).sub(Ul))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},gf=0,gn=new ae,Fl=new ke,os=new L,ln=new Vn,Xs=new Vn,Oe=new L,we=class s extends Gn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(tf(t)?hr:cr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return gn.makeRotationFromQuaternion(t),this.applyMatrix4(gn),this}rotateX(t){return gn.makeRotationX(t),this.applyMatrix4(gn),this}rotateY(t){return gn.makeRotationY(t),this.applyMatrix4(gn),this}rotateZ(t){return gn.makeRotationZ(t),this.applyMatrix4(gn),this}translate(t,e,n){return gn.makeTranslation(t,e,n),this.applyMatrix4(gn),this}scale(t,e,n){return gn.makeScale(t,e,n),this.applyMatrix4(gn),this}lookAt(t){return Fl.lookAt(t),Fl.updateMatrix(),this.applyMatrix4(Fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new re(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Xt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];ln.setFromBufferAttribute(r),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Xs.setFromBufferAttribute(a),this.morphTargetsRelative?(Oe.addVectors(ln.min,Xs.min),ln.expandByPoint(Oe),Oe.addVectors(ln.max,Xs.max),ln.expandByPoint(Oe)):(ln.expandByPoint(Xs.min),ln.expandByPoint(Xs.max))}ln.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Oe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Oe));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Oe.fromBufferAttribute(a,c),l&&(os.fromBufferAttribute(t,c),Oe.add(os)),i=Math.max(i,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ne(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<n.count;y++)a[y]=new L,l[y]=new L;let c=new L,h=new L,d=new L,u=new ft,f=new ft,g=new ft,v=new L,m=new L;function p(y,A,P){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,A),d.fromBufferAttribute(n,P),u.fromBufferAttribute(r,y),f.fromBufferAttribute(r,A),g.fromBufferAttribute(r,P),h.sub(c),d.sub(c),f.sub(u),g.sub(u);let F=1/(f.x*g.y-g.x*f.y);isFinite(F)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(F),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(F),a[y].add(v),a[A].add(v),a[P].add(v),l[y].add(m),l[A].add(m),l[P].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let y=0,A=M.length;y<A;++y){let P=M[y],F=P.start,B=P.count;for(let G=F,U=F+B;G<U;G+=3)p(t.getX(G+0),t.getX(G+1),t.getX(G+2))}let E=new L,_=new L,b=new L,w=new L;function I(y){b.fromBufferAttribute(i,y),w.copy(b);let A=a[y];E.copy(A),E.sub(b.multiplyScalar(b.dot(A))).normalize(),_.crossVectors(w,A);let F=_.dot(l[y])<0?-1:1;o.setXYZW(y,E.x,E.y,E.z,F)}for(let y=0,A=M.length;y<A;++y){let P=M[y],F=P.start,B=P.count;for(let G=F,U=F+B;G<U;G+=3)I(t.getX(G+0)),I(t.getX(G+1)),I(t.getX(G+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ne(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let i=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,d=new L;if(t)for(let u=0,f=t.count;u<f;u+=3){let g=t.getX(u+0),v=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Ne(u,h,d)}if(this.index===null)return Xt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ur=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Tc,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},$e=new L,bs=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix4(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyNormalMatrix(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.transformDirection(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Bn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Bn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Bn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Bn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array),r=_e(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){sr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ne(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){sr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ol=new L,xf=new L,_f=new Zt,En=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Ol.subVectors(n,e).cross(xf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(Ol),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||_f.getNormalMatrix(t),i=this.coplanarPoint(Ol).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},yf=0,Wn=class extends Gn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yf++}),this.uuid=ei(),this.name="",this.type="Material",this.blending=Ls,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=cc,this.blendDst=hc,this.blendEquation=Gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Su,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wo,this.stencilZFail=wo,this.stencilZPass=wo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Xt(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Xt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new $t().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new En().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ft().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ft().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ii=class extends Wn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},as,qs=new L,ls=new L,cs=new L,hs=new ft,Ys=new ft,Nu=new ae,no=new L,Zs=new L,io=new L,Ah=new ft,Bl=new ft,Rh=new ft,mi=class extends ke{constructor(t=new ii){if(super(),this.isSprite=!0,this.type="Sprite",as===void 0){as=new we;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ur(e,5);as.setIndex([0,1,2,0,2,3]),as.setAttribute("position",new bs(n,3,0,!1)),as.setAttribute("uv",new bs(n,2,3,!1))}this.geometry=as,this.material=t,this.center=new ft(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Gt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ls.setFromMatrixScale(this.matrixWorld),Nu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),cs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ls.multiplyScalar(-cs.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;so(no.set(-.5,-.5,0),cs,o,ls,i,r),so(Zs.set(.5,-.5,0),cs,o,ls,i,r),so(io.set(.5,.5,0),cs,o,ls,i,r),Ah.set(0,0),Bl.set(1,0),Rh.set(1,1);let a=t.ray.intersectTriangle(no,Zs,io,!1,qs);if(a===null&&(so(Zs.set(-.5,.5,0),cs,o,ls,i,r),Bl.set(0,1),a=t.ray.intersectTriangle(no,io,Zs,!1,qs),a===null))return;let l=t.ray.origin.distanceTo(qs);l<t.near||l>t.far||e.push({distance:l,point:qs.clone(),uv:ti.getInterpolation(qs,no,Zs,io,Ah,Bl,Rh,new ft),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function so(s,t,e,n,i,r){hs.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Ys.x=r*hs.x-i*hs.y,Ys.y=i*hs.x+r*hs.y):Ys.copy(hs),s.copy(t),s.x+=Ys.x,s.y+=Ys.y,s.applyMatrix4(Nu)}var jn=new L,kl=new L,ro=new L,oo=new L,ws=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,jn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=jn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(jn.copy(this.origin).addScaledVector(this.direction,e),jn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){kl.copy(t).add(e).multiplyScalar(.5),ro.copy(e).sub(t).normalize(),oo.copy(this.origin).sub(kl);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ro),a=oo.dot(this.direction),l=-oo.dot(ro),c=oo.lengthSq(),h=Math.abs(1-o*o),d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let v=1/h;d*=v,u*=v,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(kl).addScaledVector(ro,u),f}intersectSphere(t,e){if(t.radius<0)return null;jn.subVectors(t.center,this.origin);let n=jn.dot(this.direction),i=jn.dot(jn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,jn)!==null}intersectTriangle(t,e,n,i,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,g=e.x-o.x,v=e.y-o.y,m=e.z-o.z,p=n.x-o.x,M=n.y-o.y,E=n.z-o.z,_=Math.abs(l),b=Math.abs(c),w=Math.abs(h),I,y,A,P,F,B,G,U,k,Z,K,at;if(_>=b&&_>=w?(A=l,B=d,k=g,at=p,l>=0?(I=c,y=h,P=u,F=f,G=v,U=m,Z=M,K=E):(I=h,y=c,P=f,F=u,G=m,U=v,Z=E,K=M)):b>=w?(A=c,B=u,k=v,at=M,c>=0?(I=h,y=l,P=f,F=d,G=m,U=g,Z=E,K=p):(I=l,y=h,P=d,F=f,G=g,U=m,Z=p,K=E)):(A=h,B=f,k=m,at=E,h>=0?(I=l,y=c,P=d,F=u,G=g,U=v,Z=p,K=M):(I=c,y=l,P=u,F=d,G=v,U=g,Z=M,K=p)),A===0)return null;let $=I/A,et=y/A,rt=1/A,Nt=P-$*B,Ct=F-et*B,le=G-$*k,Kt=U-et*k,te=Z-$*at,tt=K-et*at,j=te*Kt-tt*le,vt=Nt*tt-Ct*te,Ht=le*Ct-Kt*Nt;if(i){if(j<0||vt<0||Ht<0)return null}else if((j<0||vt<0||Ht<0)&&(j>0||vt>0||Ht>0))return null;let At=j+vt+Ht;if(At===0)return null;let Vt=rt*(j*B+vt*k+Ht*at);return(At>0?Vt<0:Vt>0)?null:this.at(Vt/At,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},gi=class extends Wn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=aa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Ch=new ae,Fi=new ws,ao=new Cn,Ih=new L,lo=new L,co=new L,ho=new L,zl=new L,uo=new L,Ph=new L,fo=new L,Et=class extends ke{constructor(t=new we,e=new gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){uo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(zl.fromBufferAttribute(d,t),o?uo.addScaledVector(zl,h):uo.addScaledVector(zl.sub(e),h))}e.add(uo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(r),Fi.copy(t.ray).recast(t.near),!(ao.containsPoint(Fi.origin)===!1&&(Fi.intersectSphere(ao,Ih)===null||Fi.origin.distanceToSquared(Ih)>(t.far-t.near)**2))&&(Ch.copy(r).invert(),Fi.copy(t.ray).applyMatrix4(Ch),!(n.boundingBox!==null&&Fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Fi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){let m=u[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),E=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let _=M,b=E;_<b;_+=3){let w=a.getX(_),I=a.getX(_+1),y=a.getX(_+2);i=po(this,p,t,n,c,h,d,w,I,y),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){let M=a.getX(m),E=a.getX(m+1),_=a.getX(m+2);i=po(this,o,t,n,c,h,d,M,E,_),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){let m=u[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=M,b=E;_<b;_+=3){let w=_,I=_+1,y=_+2;i=po(this,p,t,n,c,h,d,w,I,y),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){let M=m,E=m+1,_=m+2;i=po(this,o,t,n,c,h,d,M,E,_),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function vf(s,t,e,n,i,r,o,a){let l;if(t.side===Qe?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===wi,a),l===null)return null;fo.copy(a),fo.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(fo);return c<e.near||c>e.far?null:{distance:c,point:fo.clone(),object:s}}function po(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,lo),s.getVertexPosition(l,co),s.getVertexPosition(c,ho);let h=vf(s,t,e,n,lo,co,ho,Ph);if(h){let d=new L;ti.getBarycoord(Ph,lo,co,ho,d),i&&(h.uv=ti.getInterpolatedAttribute(i,a,l,c,d,new ft)),r&&(h.uv1=ti.getInterpolatedAttribute(r,a,l,c,d,new ft)),o&&(h.normal=ti.getInterpolatedAttribute(o,a,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new L,materialIndex:0};ti.getNormal(lo,co,ho,u.normal),h.face=u,h.barycoord=d}return h}var dr=class extends Je{constructor(t=null,e=1,n=1,i,r,o,a,l,c=De,h=De,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ts=class extends Ne{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},us=new ae,Lh=new ae,mo=[],Dh=new Vn,Mf=new ae,$s=new Et,Js=new Cn,fr=class extends Et{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ts(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Mf)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,us),Dh.copy(t.boundingBox).applyMatrix4(us),this.boundingBox.union(Dh)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Cn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,us),Js.copy(t.boundingSphere).applyMatrix4(us),this.boundingSphere.union(Js)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if($s.geometry=this.geometry,$s.material=this.material,$s.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Js.copy(this.boundingSphere),Js.applyMatrix4(n),t.ray.intersectsSphere(Js)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,us),Lh.multiplyMatrices(n,us),$s.matrixWorld=Lh,$s.raycast(t,mo);for(let o=0,a=mo.length;o<a;o++){let l=mo[o];l.instanceId=r,l.object=this,e.push(l)}mo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Ts(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new dr(new Float32Array(i*this.count),i,this.count,pa,vn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Oi=new Cn,Sf=new ft(.5,.5),go=new L,xi=class{constructor(t=new En,e=new En,n=new En,i=new En,r=new En,o=new En){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=An,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],M=r[12],E=r[13],_=r[14],b=r[15];if(i[0].setComponents(c-o,f-h,p-g,b-M).normalize(),i[1].setComponents(c+o,f+h,p+g,b+M).normalize(),i[2].setComponents(c+a,f+d,p+v,b+E).normalize(),i[3].setComponents(c-a,f-d,p-v,b-E).normalize(),n)i[4].setComponents(l,u,m,_).normalize(),i[5].setComponents(c-l,f-u,p-m,b-_).normalize();else if(i[4].setComponents(c-l,f-u,p-m,b-_).normalize(),e===An)i[5].setComponents(c+l,f+u,p+m,b+_).normalize();else if(e===_s)i[5].setComponents(l,u,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Oi)}intersectsSprite(t){Oi.center.set(0,0,0);let e=Sf.distanceTo(t.center);return Oi.radius=.7071067811865476+e,Oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Oi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(go.x=i.normal.x>0?t.max.x:t.min.x,go.y=i.normal.y>0?t.max.y:t.min.y,go.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(go)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Es=class extends Wn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Nh=new ae,Jl=new ws,xo=new Cn,_o=new L,pr=class extends ke{constructor(t=new we,e=new Es){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xo.copy(n.boundingSphere),xo.applyMatrix4(i),xo.radius+=r,t.ray.intersectsSphere(xo)===!1)return;Nh.copy(i).invert(),Jl.copy(t.ray).applyMatrix4(Nh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=u,v=f;g<v;g++){let m=c.getX(g);_o.fromBufferAttribute(d,m),Uh(_o,m,l,i,t,e,this)}}else{let u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=u,v=f;g<v;g++)_o.fromBufferAttribute(d,g),Uh(_o,g,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Uh(s,t,e,n,i,r,o){let a=Jl.distanceSqToPoint(s);if(a<e){let l=new L;Jl.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var mr=class extends Je{constructor(t=[],e=Ti,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},gr=class extends Je{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var _i=class extends Je{constructor(t,e,n=Ln,i,r,o,a=De,l=De,c,h=Hn,d=1){if(h!==Hn&&h!==Ai)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new vs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Oo=class extends _i{constructor(t,e=Ln,n=Ti,i,r,o=De,a=De,l,c=Hn){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},xr=class extends Je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},_n=class s extends we{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(d,2));function g(v,m,p,M,E,_,b,w,I,y,A){let P=_/I,F=b/y,B=_/2,G=b/2,U=w/2,k=I+1,Z=y+1,K=0,at=0,$=new L;for(let et=0;et<Z;et++){let rt=et*F-G;for(let Nt=0;Nt<k;Nt++){let Ct=Nt*P-B;$[v]=Ct*M,$[m]=rt*E,$[p]=U,c.push($.x,$.y,$.z),$[v]=0,$[m]=0,$[p]=w>0?1:-1,h.push($.x,$.y,$.z),d.push(Nt/I),d.push(1-et/y),K+=1}}for(let et=0;et<y;et++)for(let rt=0;rt<I;rt++){let Nt=u+rt+k*et,Ct=u+rt+k*(et+1),le=u+(rt+1)+k*(et+1),Kt=u+(rt+1)+k*et;l.push(Nt,Ct,Kt),l.push(Ct,le,Kt),at+=6}a.addGroup(f,at,A),f+=at,u+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var As=class s extends we{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new L,h=new ft;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){let f=n+d/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(a,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ce=class s extends we{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],u=[],f=[],g=0,v=[],m=n/2,p=0;M(),o===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new re(d,3)),this.setAttribute("normal",new re(u,3)),this.setAttribute("uv",new re(f,2));function M(){let _=new L,b=new L,w=0,I=(e-t)/n;for(let y=0;y<=r;y++){let A=[],P=y/r,F=P*(e-t)+t;for(let B=0;B<=i;B++){let G=B/i,U=G*l+a,k=Math.sin(U),Z=Math.cos(U);b.x=F*k,b.y=-P*n+m,b.z=F*Z,d.push(b.x,b.y,b.z),_.set(k,I,Z).normalize(),u.push(_.x,_.y,_.z),f.push(G,1-P),A.push(g++)}v.push(A)}for(let y=0;y<i;y++)for(let A=0;A<r;A++){let P=v[A][y],F=v[A+1][y],B=v[A+1][y+1],G=v[A][y+1];(t>0||A!==0)&&(h.push(P,F,G),w+=3),(e>0||A!==r-1)&&(h.push(F,B,G),w+=3)}c.addGroup(p,w,0),p+=w}function E(_){let b=g,w=new ft,I=new L,y=0,A=_===!0?t:e,P=_===!0?1:-1;for(let B=1;B<=i;B++)d.push(0,m*P,0),u.push(0,P,0),f.push(.5,.5),g++;let F=g;for(let B=0;B<=i;B++){let U=B/i*l+a,k=Math.cos(U),Z=Math.sin(U);I.x=A*Z,I.y=m*P,I.z=A*k,d.push(I.x,I.y,I.z),u.push(0,P,0),w.x=k*.5+.5,w.y=Z*.5*P+.5,f.push(w.x,w.y),g++}for(let B=0;B<i;B++){let G=b+B,U=F+B;_===!0?h.push(U,U+1,G):h.push(U+1,U,G),y+=3}c.addGroup(p,y,_===!0?1:2),p+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ke=class s extends Ce{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Bo=class s extends we{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(r.slice(),3)),this.setAttribute("uv",new re(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let E=new L,_=new L,b=new L;for(let w=0;w<e.length;w+=3)f(e[w+0],E),f(e[w+1],_),f(e[w+2],b),l(E,_,b,M)}function l(M,E,_,b){let w=b+1,I=[];for(let y=0;y<=w;y++){I[y]=[];let A=M.clone().lerp(_,y/w),P=E.clone().lerp(_,y/w),F=w-y;for(let B=0;B<=F;B++)B===0&&y===w?I[y][B]=A:I[y][B]=A.clone().lerp(P,B/F)}for(let y=0;y<w;y++)for(let A=0;A<2*(w-y)-1;A++){let P=Math.floor(A/2);A%2===0?(u(I[y][P+1]),u(I[y+1][P]),u(I[y][P])):(u(I[y][P+1]),u(I[y+1][P+1]),u(I[y+1][P]))}}function c(M){let E=new L;for(let _=0;_<r.length;_+=3)E.x=r[_+0],E.y=r[_+1],E.z=r[_+2],E.normalize().multiplyScalar(M),r[_+0]=E.x,r[_+1]=E.y,r[_+2]=E.z}function h(){let M=new L;for(let E=0;E<r.length;E+=3){M.x=r[E+0],M.y=r[E+1],M.z=r[E+2];let _=m(M)/2/Math.PI+.5,b=p(M)/Math.PI+.5;o.push(_,1-b)}g(),d()}function d(){for(let M=0;M<o.length;M+=6){let E=o[M+0],_=o[M+2],b=o[M+4],w=Math.max(E,_,b),I=Math.min(E,_,b);w>.9&&I<.1&&(E<.2&&(o[M+0]+=1),_<.2&&(o[M+2]+=1),b<.2&&(o[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,E){let _=M*3;E.x=t[_+0],E.y=t[_+1],E.z=t[_+2]}function g(){let M=new L,E=new L,_=new L,b=new L,w=new ft,I=new ft,y=new ft;for(let A=0,P=0;A<r.length;A+=9,P+=6){M.set(r[A+0],r[A+1],r[A+2]),E.set(r[A+3],r[A+4],r[A+5]),_.set(r[A+6],r[A+7],r[A+8]),w.set(o[P+0],o[P+1]),I.set(o[P+2],o[P+3]),y.set(o[P+4],o[P+5]),b.copy(M).add(E).add(_).divideScalar(3);let F=m(b);v(w,P+0,M,F),v(I,P+2,E,F),v(y,P+4,_,F)}}function v(M,E,_,b){b<0&&M.x===1&&(o[E]=M.x-1),_.x===0&&_.z===0&&(o[E]=b/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}};var cn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Xt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);let h=n[i],u=n[i+1]-h,f=(o-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new ft:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,i=[],r=[],o=[],a=new L,l=new ae;for(let f=0;f<=t;f++){let g=f/t;i[f]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(se(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(se(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Rs=class extends cn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ft){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ko=class extends Rs{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ac(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,i(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var Fh=new L,Oh=new L,Hl=new Ac,Gl=new Ac,Vl=new Ac,zo=class extends cn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new L){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(Oh.subVectors(i[0],i[1]).add(i[0]),c=Oh);let d=i[a%r],u=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(Fh.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Fh),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Hl.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,v,m),Gl.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,v,m),Vl.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Hl.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Gl.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Vl.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Hl.calc(l),Gl.calc(l),Vl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new L().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Bh(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function bf(s,t){let e=1-s;return e*e*t}function wf(s,t){return 2*(1-s)*s*t}function Tf(s,t){return s*s*t}function Qs(s,t,e,n){return bf(s,t)+wf(s,e)+Tf(s,n)}function Ef(s,t){let e=1-s;return e*e*e*t}function Af(s,t){let e=1-s;return 3*e*e*s*t}function Rf(s,t){return 3*(1-s)*s*s*t}function Cf(s,t){return s*s*s*t}function js(s,t,e,n,i){return Ef(s,t)+Af(s,e)+Rf(s,n)+Cf(s,i)}var _r=class extends cn{constructor(t=new ft,e=new ft,n=new ft,i=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ft){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(js(t,i.x,r.x,o.x,a.x),js(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ho=class extends cn{constructor(t=new L,e=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new L){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(js(t,i.x,r.x,o.x,a.x),js(t,i.y,r.y,o.y,a.y),js(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},yr=class extends cn{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Go=class extends cn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},vr=class extends cn{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Qs(t,i.x,r.x,o.x),Qs(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Vo=class extends cn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Qs(t,i.x,r.x,o.x),Qs(t,i.y,r.y,o.y),Qs(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Mr=class extends cn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],d=i[o>i.length-3?i.length-1:o+2];return n.set(Bh(a,l.x,c.x,h.x,d.x),Bh(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new ft().fromArray(i))}return this}},Kl=Object.freeze({__proto__:null,ArcCurve:ko,CatmullRomCurve3:zo,CubicBezierCurve:_r,CubicBezierCurve3:Ho,EllipseCurve:Rs,LineCurve:yr,LineCurve3:Go,QuadraticBezierCurve:vr,QuadraticBezierCurve3:Vo,SplineCurve:Mr}),Wo=class extends cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Kl[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Kl[i.type]().fromJSON(i))}return this}},Sr=class extends Wo{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new yr(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new vr(this.currentPoint.clone(),new ft(t,e),new ft(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new _r(this.currentPoint.clone(),new ft(t,e),new ft(n,i),new ft(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Mr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){let c=new Rs(t,e,n,i,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},yi=class extends Sr{constructor(t){super(t),this.uuid=ei(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new Sr().fromJSON(i))}return this}};function If(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=Uu(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Uf(s,t,r,e)),s.length>80*e){a=s[0],l=s[1];let h=a,d=l;for(let u=e;u<i;u+=e){let f=s[u],g=s[u+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return br(r,o,e,a,l,c,0),o}function Uu(s,t,e,n,i){let r;if(i===qf(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=kh(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=kh(o/n|0,s[o],s[o+1],r);return r&&Cs(r,r.next)&&(Tr(r),r=r.next),r}function ki(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Cs(e,e.next)||Ee(e.prev,e,e.next)===0)){if(Tr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function br(s,t,e,n,i,r,o){if(!s)return;!o&&r&&zf(s,n,i,r);let a=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?Lf(s,n,i,r):Pf(s)){t.push(l.i,s.i,c.i),Tr(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=Df(ki(s),t),br(s,t,e,n,i,r,2)):o===2&&Nf(s,t,e,n,i,r):br(ki(s),t,e,n,i,r,1);break}}}function Pf(s){let t=s.prev,e=s,n=s.next;if(Ee(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,r,o),d=Math.min(a,l,c),u=Math.max(i,r,o),f=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Ks(i,a,r,l,o,c,g.x,g.y)&&Ee(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Lf(s,t,e,n){let i=s.prev,r=s,o=s.next;if(Ee(i,r,o)>=0)return!1;let a=i.x,l=r.x,c=o.x,h=i.y,d=r.y,u=o.y,f=Math.min(a,l,c),g=Math.min(h,d,u),v=Math.max(a,l,c),m=Math.max(h,d,u),p=Ql(f,g,t,e,n),M=Ql(v,m,t,e,n),E=s.prevZ,_=s.nextZ;for(;E&&E.z>=p&&_&&_.z<=M;){if(E.x>=f&&E.x<=v&&E.y>=g&&E.y<=m&&E!==i&&E!==o&&Ks(a,h,l,d,c,u,E.x,E.y)&&Ee(E.prev,E,E.next)>=0||(E=E.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==o&&Ks(a,h,l,d,c,u,_.x,_.y)&&Ee(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=v&&E.y>=g&&E.y<=m&&E!==i&&E!==o&&Ks(a,h,l,d,c,u,E.x,E.y)&&Ee(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;_&&_.z<=M;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==o&&Ks(a,h,l,d,c,u,_.x,_.y)&&Ee(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Df(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Cs(n,i)&&Ou(n,e,e.next,i)&&wr(n,i)&&wr(i,n)&&(t.push(n.i,e.i,i.i),Tr(e),Tr(e.next),e=s=i),e=e.next}while(e!==s);return ki(e)}function Nf(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Vf(o,a)){let l=Bu(o,a);o=ki(o,o.next),l=ki(l,l.next),br(o,t,e,n,i,r,0),br(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Uf(s,t,e,n){let i=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=Uu(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Gf(c))}i.sort(Ff);for(let r=0;r<i.length;r++)e=Of(i[r],e);return e}function Ff(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function Of(s,t){let e=Bf(s,t);if(!e)return t;let n=Bu(e,s);return ki(n,n.next),ki(e,e.next)}function Bf(s,t){let e=t,n=s.x,i=s.y,r=-1/0,o;if(Cs(s,e))return e;do{if(Cs(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Fu(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){let d=Math.abs(i-e.y)/(n-e.x);wr(e,s)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&kf(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function kf(s,t){return Ee(s.prev,s,t.prev)<0&&Ee(t.next,s,s.next)<0}function zf(s,t,e,n){let i=s;do i.z===0&&(i.z=Ql(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Hf(i)}function Hf(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Ql(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Gf(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Fu(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Ks(s,t,e,n,i,r,o,a){return!(s===o&&t===a)&&Fu(s,t,e,n,i,r,o,a)}function Vf(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Wf(s,t)&&(wr(s,t)&&wr(t,s)&&Xf(s,t)&&(Ee(s.prev,s,t.prev)||Ee(s,t.prev,t))||Cs(s,t)&&Ee(s.prev,s,s.next)>0&&Ee(t.prev,t,t.next)>0)}function Ee(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Cs(s,t){return s.x===t.x&&s.y===t.y}function Ou(s,t,e,n){let i=vo(Ee(s,t,e)),r=vo(Ee(s,t,n)),o=vo(Ee(e,n,s)),a=vo(Ee(e,n,t));return!!(i!==r&&o!==a||i===0&&yo(s,e,t)||r===0&&yo(s,n,t)||o===0&&yo(e,s,n)||a===0&&yo(e,t,n))}function yo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function vo(s){return s>0?1:s<0?-1:0}function Wf(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Ou(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function wr(s,t){return Ee(s.prev,s,s.next)<0?Ee(s,t,s.next)>=0&&Ee(s,s.prev,t)>=0:Ee(s,t,s.prev)<0||Ee(s,s.next,t)<0}function Xf(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Bu(s,t){let e=jl(s.i,s.x,s.y),n=jl(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function kh(s,t,e,n){let i=jl(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Tr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function jl(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function qf(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var tc=class{static triangulate(t,e,n=2){return If(t,e,n)}},zn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];zh(t),Hh(n,t);let o=t.length;e.forEach(zh);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,Hh(n,e[l]);let a=tc.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function zh(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Hh(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var Er=class s extends we{constructor(t=new yi([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new re(i,3)),this.setAttribute("uv",new re(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:Yf,E,_=!1,b,w,I,y;if(p){E=p.getSpacedPoints(h),_=!0,u=!1;let st=p.isCatmullRomCurve3?p.closed:!1;b=p.computeFrenetFrames(h,st),w=new L,I=new L,y=new L}u||(m=0,f=0,g=0,v=0);let A=a.extractPoints(c),P=A.shape,F=A.holes;if(!zn.isClockWise(P)){P=P.reverse();for(let st=0,lt=F.length;st<lt;st++){let ut=F[st];zn.isClockWise(ut)&&(F[st]=ut.reverse())}}function G(st){let ut=10000000000000001e-36,dt=st[0];for(let gt=1;gt<=st.length;gt++){let zt=gt%st.length,kt=st[zt],Wt=kt.x-dt.x,qt=kt.y-dt.y,N=Wt*Wt+qt*qt,de=Math.max(Math.abs(kt.x),Math.abs(kt.y),Math.abs(dt.x),Math.abs(dt.y)),ne=ut*de*de;if(N<=ne){st.splice(zt,1),gt--;continue}dt=kt}}G(P),F.forEach(G);let U=F.length,k=P;for(let st=0;st<U;st++){let lt=F[st];P=P.concat(lt)}function Z(st,lt,ut){return lt||Gt("ExtrudeGeometry: vec does not exist"),st.clone().addScaledVector(lt,ut)}let K=P.length;function at(st,lt,ut){let dt,gt,zt,kt=st.x-lt.x,Wt=st.y-lt.y,qt=ut.x-st.x,N=ut.y-st.y,de=kt*kt+Wt*Wt,ne=kt*N-Wt*qt;if(Math.abs(ne)>Number.EPSILON){let R=Math.sqrt(de),x=Math.sqrt(qt*qt+N*N),z=lt.x-Wt/R,V=lt.y+kt/R,Q=ut.x-N/x,pt=ut.y+qt/x,xt=((Q-z)*N-(pt-V)*qt)/(kt*N-Wt*qt);dt=z+kt*xt-st.x,gt=V+Wt*xt-st.y;let T=dt*dt+gt*gt;if(T<=2)return new ft(dt,gt);zt=Math.sqrt(T/2)}else{let R=!1;kt>Number.EPSILON?qt>Number.EPSILON&&(R=!0):kt<-Number.EPSILON?qt<-Number.EPSILON&&(R=!0):Math.sign(Wt)===Math.sign(N)&&(R=!0),R?(dt=-Wt,gt=kt,zt=Math.sqrt(de)):(dt=kt,gt=Wt,zt=Math.sqrt(de/2))}return new ft(dt/zt,gt/zt)}let $=[];for(let st=0,lt=k.length,ut=lt-1,dt=st+1;st<lt;st++,ut++,dt++)ut===lt&&(ut=0),dt===lt&&(dt=0),$[st]=at(k[st],k[ut],k[dt]);let et=[],rt,Nt=$.concat();for(let st=0,lt=U;st<lt;st++){let ut=F[st];rt=[];for(let dt=0,gt=ut.length,zt=gt-1,kt=dt+1;dt<gt;dt++,zt++,kt++)zt===gt&&(zt=0),kt===gt&&(kt=0),rt[dt]=at(ut[dt],ut[zt],ut[kt]);et.push(rt),Nt=Nt.concat(rt)}let Ct;if(m===0)Ct=zn.triangulateShape(k,F);else{let st=[],lt=[];for(let ut=0;ut<m;ut++){let dt=ut/m,gt=f*Math.cos(dt*Math.PI/2),zt=g*Math.sin(dt*Math.PI/2)+v;for(let kt=0,Wt=k.length;kt<Wt;kt++){let qt=Z(k[kt],$[kt],zt);vt(qt.x,qt.y,-gt),dt===0&&st.push(qt)}for(let kt=0,Wt=U;kt<Wt;kt++){let qt=F[kt];rt=et[kt];let N=[];for(let de=0,ne=qt.length;de<ne;de++){let R=Z(qt[de],rt[de],zt);vt(R.x,R.y,-gt),dt===0&&N.push(R)}dt===0&&lt.push(N)}}Ct=zn.triangulateShape(st,lt)}let le=Ct.length,Kt=g+v;for(let st=0;st<K;st++){let lt=u?Z(P[st],Nt[st],Kt):P[st];_?(I.copy(b.normals[0]).multiplyScalar(lt.x),w.copy(b.binormals[0]).multiplyScalar(lt.y),y.copy(E[0]).add(I).add(w),vt(y.x,y.y,y.z)):vt(lt.x,lt.y,0)}for(let st=1;st<=h;st++)for(let lt=0;lt<K;lt++){let ut=u?Z(P[lt],Nt[lt],Kt):P[lt];_?(I.copy(b.normals[st]).multiplyScalar(ut.x),w.copy(b.binormals[st]).multiplyScalar(ut.y),y.copy(E[st]).add(I).add(w),vt(y.x,y.y,y.z)):vt(ut.x,ut.y,d/h*st)}for(let st=m-1;st>=0;st--){let lt=st/m,ut=f*Math.cos(lt*Math.PI/2),dt=g*Math.sin(lt*Math.PI/2)+v;for(let gt=0,zt=k.length;gt<zt;gt++){let kt=Z(k[gt],$[gt],dt);vt(kt.x,kt.y,d+ut)}for(let gt=0,zt=F.length;gt<zt;gt++){let kt=F[gt];rt=et[gt];for(let Wt=0,qt=kt.length;Wt<qt;Wt++){let N=Z(kt[Wt],rt[Wt],dt);_?vt(N.x,N.y+E[h-1].y,E[h-1].x+ut):vt(N.x,N.y,d+ut)}}}te(),tt();function te(){let st=i.length/3;if(u){let lt=0,ut=K*lt;for(let dt=0;dt<le;dt++){let gt=Ct[dt];Ht(gt[2]+ut,gt[1]+ut,gt[0]+ut)}lt=h+m*2,ut=K*lt;for(let dt=0;dt<le;dt++){let gt=Ct[dt];Ht(gt[0]+ut,gt[1]+ut,gt[2]+ut)}}else{for(let lt=0;lt<le;lt++){let ut=Ct[lt];Ht(ut[2],ut[1],ut[0])}for(let lt=0;lt<le;lt++){let ut=Ct[lt];Ht(ut[0]+K*h,ut[1]+K*h,ut[2]+K*h)}}n.addGroup(st,i.length/3-st,0)}function tt(){let st=i.length/3,lt=0;j(k,lt),lt+=k.length;for(let ut=0,dt=F.length;ut<dt;ut++){let gt=F[ut];j(gt,lt),lt+=gt.length}n.addGroup(st,i.length/3-st,1)}function j(st,lt){let ut=st.length;for(;--ut>=0;){let dt=ut,gt=ut-1;gt<0&&(gt=st.length-1);for(let zt=0,kt=h+m*2;zt<kt;zt++){let Wt=K*zt,qt=K*(zt+1),N=lt+dt+Wt,de=lt+gt+Wt,ne=lt+gt+qt,R=lt+dt+qt;At(N,de,ne,R)}}}function vt(st,lt,ut){l.push(st),l.push(lt),l.push(ut)}function Ht(st,lt,ut){Vt(st),Vt(lt),Vt(ut);let dt=i.length/3,gt=M.generateTopUV(n,i,dt-3,dt-2,dt-1);ee(gt[0]),ee(gt[1]),ee(gt[2])}function At(st,lt,ut,dt){Vt(st),Vt(lt),Vt(dt),Vt(lt),Vt(ut),Vt(dt);let gt=i.length/3,zt=M.generateSideWallUV(n,i,gt-6,gt-3,gt-2,gt-1);ee(zt[0]),ee(zt[1]),ee(zt[3]),ee(zt[1]),ee(zt[2]),ee(zt[3])}function Vt(st){i.push(l[st*3+0]),i.push(l[st*3+1]),i.push(l[st*3+2])}function ee(st){r.push(st.x),r.push(st.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Zf(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Kl[i.type]().fromJSON(i)),new s(n,t.options)}},Yf={generateTopUV:function(s,t,e,n,i){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new ft(r,o),new ft(a,l),new ft(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],g=t[i*3+2],v=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ft(o,1-l),new ft(c,1-d),new ft(u,1-g),new ft(v,1-p)]:[new ft(a,1-l),new ft(h,1-d),new ft(f,1-g),new ft(m,1-p)]}};function Zf(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Ar=class s extends Bo{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}},In=class s extends we{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,u=e/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){let M=p*u-o;for(let E=0;E<c;E++){let _=E*d-r;g.push(_,-M,0),v.push(0,0,1),m.push(E/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let E=M+c*p,_=M+c*(p+1),b=M+1+c*(p+1),w=M+1+c*p;f.push(E,_,w),f.push(_,b,w)}this.setIndex(f),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}};var Rr=class s extends we{constructor(t=new yi([new ft(0,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],o=[],a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new re(i,3)),this.setAttribute("normal",new re(r,3)),this.setAttribute("uv",new re(o,2));function c(h){let d=i.length/3,u=h.extractPoints(e),f=u.shape,g=u.holes;zn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let M=g[m];zn.isClockWise(M)===!0&&(g[m]=M.reverse())}let v=zn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let M=g[m];f=f.concat(M)}for(let m=0,p=f.length;m<p;m++){let M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=v.length;m<p;m++){let M=v[m],E=M[0]+d,_=M[1]+d,b=M[2]+d;n.push(E,_,b),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return $f(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let o=e[t.shapes[i]];n.push(o)}return new s(n,t.curveSegments)}};function $f(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var hn=class s extends we{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new L,u=new L,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){let M=[],E=p/n,_=o+E*a,b=t*Math.cos(_),w=Math.sqrt(t*t-b*b),I=0;p===0&&o===0?I=.5/e:p===n&&l===Math.PI&&(I=-.5/e);for(let y=0;y<=e;y++){let A=y/e,P=i+A*r;d.x=-w*Math.cos(P),d.y=b,d.z=w*Math.sin(P),g.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),m.push(A+I,1-E),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){let E=h[p][M+1],_=h[p][M],b=h[p+1][M],w=h[p+1][M+1];(p!==0||o>0)&&f.push(E,_,w),(p!==n-1||l<Math.PI)&&f.push(_,b,w)}this.setIndex(f),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var vi=class s extends we{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],d=[],u=new L,f=new L,g=new L;for(let v=0;v<=n;v++){let m=o+v/n*a;for(let p=0;p<=i;p++){let M=p/i*r;f.x=(t+e*Math.cos(m))*Math.cos(M),f.y=(t+e*Math.cos(m))*Math.sin(M),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/i),d.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=i;m++){let p=(i+1)*v+m-1,M=(i+1)*(v-1)+m-1,E=(i+1)*(v-1)+m,_=(i+1)*v+m;l.push(p,M,_),l.push(M,E,_)}this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Xi(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(Gh(i))i.isRenderTargetTexture?(Xt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Gh(i[0])){let r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Ye(s){let t={};for(let e=0;e<s.length;e++){let n=Xi(s[e]);for(let i in n)t[i]=n[i]}return t}function Gh(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Jf(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Rc(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}var ku={clone:Xi,merge:Ye},Kf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,un=class extends Wn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kf,this.fragmentShader=Qf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=Jf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new $t().setHex(i.value);break;case"v2":this.uniforms[n].value=new ft().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Te().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Zt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ae().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Xo=class extends un{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var en=class extends Wn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Za,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=aa,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},qo=class extends Wn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Yo=class extends Wn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ds(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Wl(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var Mi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Zo=class extends Mi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yl,endingEnd:Yl}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Zl:r=t,a=2*e-n;break;case $l:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Zl:o=t,l=2*n-e;break;case $l:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-e)/(i-e),v=g*g,m=v*g,p=-u*m+2*u*v-u*g,M=(1+u)*m+(-1.5-2*u)*v+(-.5+u)*g+1,E=(-1-f)*m+(1.5+f)*v+.5*g,_=f*m-f*v;for(let b=0;b!==a;++b)r[b]=p*o[h+b]+M*o[c+b]+E*o[l+b]+_*o[d+b];return r}},$o=class extends Mi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},Jo=class extends Mi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Ko=class extends Mi{interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-e)/(i-e),v=1-g;for(let m=0;m!==a;++m)r[m]=o[c+m]*v+o[l+m]*g;return r}let u=a*2,f=t-1;for(let g=0;g!==a;++g){let v=o[c+g],m=o[l+g],p=f*u+g*2,M=d[p],E=d[p+1],_=t*u+g*2,b=h[_],w=h[_+1],I=tp(n,e,M,b,i);r[g]=zu(I,v,E,w,m)}return r}};function zu(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function jf(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function tp(s,t,e,n,i){let r=(s-t)/(i-t);for(let o=0;o<8;o++){let a=zu(r,t,e,n,i)-s;if(Math.abs(a)<1e-10)break;let l=jf(r,t,e,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var dn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ds(e,this.TimeBufferType),this.values=ds(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ds(t.times,Array),values:ds(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),Wl(t.settings)&&(n.settings={inTangents:ds(t.settings.inTangents,Array),outTangents:ds(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Jo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new $o(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Zo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Ko(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case tr:e=this.InterpolantFactoryMethodDiscrete;break;case Do:e=this.InterpolantFactoryMethodLinear;break;case bo:e=this.InterpolantFactoryMethodSmooth;break;case ql:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Xt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return tr;case this.InterpolantFactoryMethodLinear:return Do;case this.InterpolantFactoryMethodSmooth:return bo;case this.InterpolantFactoryMethodBezier:return ql}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;Wl(this.settings)&&(Vh(this.settings.inTangents,t),Vh(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Gt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Gt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Gt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Gt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&ef(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){Gt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===bo,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let d=a*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){let v=e[d+g];if(v!==e[u+g]||v!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,Wl(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Vh(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}dn.prototype.ValueTypeName="";dn.prototype.TimeBufferType=Float32Array;dn.prototype.ValueBufferType=Float32Array;dn.prototype.DefaultInterpolation=Do;var Si=class extends dn{constructor(t,e,n){super(t,e,n)}};Si.prototype.ValueTypeName="bool";Si.prototype.ValueBufferType=Array;Si.prototype.DefaultInterpolation=tr;Si.prototype.InterpolantFactoryMethodLinear=void 0;Si.prototype.InterpolantFactoryMethodSmooth=void 0;var Qo=class extends dn{constructor(t,e,n,i){super(t,e,n,i)}};Qo.prototype.ValueTypeName="color";var jo=class extends dn{constructor(t,e,n,i){super(t,e,n,i)}};jo.prototype.ValueTypeName="number";var ta=class extends Mi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)xn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Cr=class extends dn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new ta(this.times,this.values,this.getValueSize(),t)}};Cr.prototype.ValueTypeName="quaternion";Cr.prototype.InterpolantFactoryMethodSmooth=void 0;var bi=class extends dn{constructor(t,e,n){super(t,e,n)}};bi.prototype.ValueTypeName="string";bi.prototype.ValueBufferType=Array;bi.prototype.DefaultInterpolation=tr;bi.prototype.InterpolantFactoryMethodLinear=void 0;bi.prototype.InterpolantFactoryMethodSmooth=void 0;var ea=class extends dn{constructor(t,e,n,i){super(t,e,n,i)}};ea.prototype.ValueTypeName="vector";var na=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Hu=new na,ia=class{constructor(t){this.manager=t!==void 0?t:Hu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ia.DEFAULT_MATERIAL_NAME="__DEFAULT";var Is=class extends ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Ir=class extends Is{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Xl=new ae,Wh=new L,Xh=new L,Pr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=nn,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xi,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new Te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Wh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wh),Xh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Xh),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){Xl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Xl,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=i?i.z/r.x:1,a=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===_s||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Xl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Mo=new L,So=new xn,On=new L,Lr=class extends ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Mo,So,On),On.x===1&&On.y===1&&On.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mo,So,On.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Mo,So,On),On.x===1&&On.y===1&&On.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mo,So,On.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},pi=new L,qh=new ft,Yh=new ft,Be=class extends Lr{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=rr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(yl*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return rr*2*Math.atan(Math.tan(yl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(pi.x,pi.y).multiplyScalar(-t/pi.z),pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(pi.x,pi.y).multiplyScalar(-t/pi.z)}getViewSize(t,e){return this.getViewBounds(t,qh,Yh),e.subVectors(Yh,qh)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(yl*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ec=class extends Pr{constructor(){super(new Be(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){let e=this.camera,n=rr*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){let t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}},Dr=class extends Is{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.target=new ke,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new ec}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}},nc=class extends Pr{constructor(){super(new Be(90,1,.5,500)),this.isPointLightShadow=!0}},zi=class extends Is{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new nc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Nr=class extends Lr{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var fs=-90,ps=1,sa=class extends ke{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Be(fs,ps,t,e);i.layers=this.layers,this.add(i);let r=new Be(fs,ps,t,e);r.layers=this.layers,this.add(r);let o=new Be(fs,ps,t,e);o.layers=this.layers,this.add(o);let a=new Be(fs,ps,t,e);a.layers=this.layers,this.add(a);let l=new Be(fs,ps,t,e);l.layers=this.layers,this.add(l);let c=new Be(fs,ps,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===An)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===_s)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ra=class extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Cc="\\[\\]\\.:\\/",ep=new RegExp("["+Cc+"]","g"),Ic="[^"+Cc+"]",np="[^"+Cc.replace("\\.","")+"]",ip=/((?:WC+[\/:])*)/.source.replace("WC",Ic),sp=/(WCOD+)?/.source.replace("WCOD",np),rp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ic),op=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ic),ap=new RegExp("^"+ip+sp+rp+op+"$"),lp=["material","materials","bones","map"],ic=class{constructor(t,e,n){let i=n||be.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},be=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(ep,"")}static parseTrackName(t){let e=ap.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);lp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Xt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Gt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Gt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Gt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Gt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Gt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;Gt("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};be.Composite=ic;be.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};be.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};be.prototype.GetterByBindingType=[be.prototype._getValue_direct,be.prototype._getValue_array,be.prototype._getValue_arrayElement,be.prototype._getValue_toArray];be.prototype.SetterByBindingTypeAndVersioning=[[be.prototype._setValue_direct,be.prototype._setValue_direct_setNeedsUpdate,be.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[be.prototype._setValue_array,be.prototype._setValue_array_setNeedsUpdate,be.prototype._setValue_array_setMatrixWorldNeedsUpdate],[be.prototype._setValue_arrayElement,be.prototype._setValue_arrayElement_setNeedsUpdate,be.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[be.prototype._setValue_fromArray,be.prototype._setValue_fromArray_setNeedsUpdate,be.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var f_=new Float32Array(1);var Zh=new ae,Ur=class{constructor(t,e,n=0,i=1/0){this.ray=new ws(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Gt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Zh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zh),this}intersectObject(t,e=!0,n=[]){return sc(t,this,n,e),n.sort($h),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)sc(t[i],this,n,e);return n.sort($h),n}};function $h(s,t){return s.distance-t.distance}function sc(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)sc(r[o],t,e,!0)}}var Fc=class Fc{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Fc.prototype.isMatrix2=!0;var rc=Fc;function Pc(s,t,e,n){let i=cp(n);switch(e){case bc:return s*t;case pa:return s*t/i.components*i.byteLength;case ma:return s*t/i.components*i.byteLength;case Ri:return s*t*2/i.components*i.byteLength;case ga:return s*t*2/i.components*i.byteLength;case wc:return s*t*3/i.components*i.byteLength;case Mn:return s*t*4/i.components*i.byteLength;case xa:return s*t*4/i.components*i.byteLength;case Or:case Br:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case kr:case zr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ya:case Ma:return Math.max(s,16)*Math.max(t,8)/4;case _a:case va:return Math.max(s,8)*Math.max(t,8)/2;case Sa:case ba:case Ta:case Ea:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case wa:case Hr:case Aa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ra:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ca:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Ia:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Pa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case La:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Da:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Na:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Ua:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Fa:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Oa:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ba:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ka:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case za:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Ha:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Ga:case Va:case Wa:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Xa:case qa:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Gr:case Ya:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cp(s){switch(s){case nn:case yc:return{byteLength:1,components:1};case Ds:case vc:case Dn:return{byteLength:2,components:1};case da:case fa:return{byteLength:2,components:4};case Ln:case ua:case vn:return{byteLength:4,components:1};case Mc:case Sc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Xt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function cd(){let s=null,t=!1,e=null,n=null;function i(r,o){n=s.requestAnimationFrame(i),e(r,o)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function pp(s){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(s.bindBuffer(c,a),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){let g=d[u],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){let v=d[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var mp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,xp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_p=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Sp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,wp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ep=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ap=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Rp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Cp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Np=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Up=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Fp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Bp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,kp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,zp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Hp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xp="gl_FragColor = linearToOutputTexel( gl_FragColor );",qp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Zp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$p=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Jp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,em=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,im=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,om=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,am=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,lm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,um=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,fm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,pm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,mm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,gm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,_m=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ym=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Tm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Em=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Am=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Im=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Lm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Nm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Om=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Bm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,km=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Wm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Xm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ym=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$m=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Km=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Qm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,t0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,e0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,n0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,i0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,s0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,r0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,o0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,a0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,l0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,c0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,h0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,u0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,d0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,f0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,p0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,m0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,g0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,y0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,v0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,S0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,b0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,w0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,T0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,E0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,R0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,C0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,I0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,L0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,N0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,U0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,F0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,O0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,B0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,z0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,H0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,G0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,W0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,X0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,q0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Y0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Z0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jt={alphahash_fragment:mp,alphahash_pars_fragment:gp,alphamap_fragment:xp,alphamap_pars_fragment:_p,alphatest_fragment:yp,alphatest_pars_fragment:vp,aomap_fragment:Mp,aomap_pars_fragment:Sp,batching_pars_vertex:bp,batching_vertex:wp,begin_vertex:Tp,beginnormal_vertex:Ep,bsdfs:Ap,iridescence_fragment:Rp,bumpmap_pars_fragment:Cp,clipping_planes_fragment:Ip,clipping_planes_pars_fragment:Pp,clipping_planes_pars_vertex:Lp,clipping_planes_vertex:Dp,color_fragment:Np,color_pars_fragment:Up,color_pars_vertex:Fp,color_vertex:Op,common:Bp,cube_uv_reflection_fragment:kp,defaultnormal_vertex:zp,displacementmap_pars_vertex:Hp,displacementmap_vertex:Gp,emissivemap_fragment:Vp,emissivemap_pars_fragment:Wp,colorspace_fragment:Xp,colorspace_pars_fragment:qp,envmap_fragment:Yp,envmap_common_pars_fragment:Zp,envmap_pars_fragment:$p,envmap_pars_vertex:Jp,envmap_physical_pars_fragment:am,envmap_vertex:Kp,fog_vertex:Qp,fog_pars_vertex:jp,fog_fragment:tm,fog_pars_fragment:em,gradientmap_pars_fragment:nm,lightmap_pars_fragment:im,lights_lambert_fragment:sm,lights_lambert_pars_fragment:rm,lights_pars_begin:om,lights_toon_fragment:lm,lights_toon_pars_fragment:cm,lights_phong_fragment:hm,lights_phong_pars_fragment:um,lights_physical_fragment:dm,lights_physical_pars_fragment:fm,lights_fragment_begin:pm,lights_fragment_maps:mm,lights_fragment_end:gm,lightprobes_pars_fragment:xm,logdepthbuf_fragment:_m,logdepthbuf_pars_fragment:ym,logdepthbuf_pars_vertex:vm,logdepthbuf_vertex:Mm,map_fragment:Sm,map_pars_fragment:bm,map_particle_fragment:wm,map_particle_pars_fragment:Tm,metalnessmap_fragment:Em,metalnessmap_pars_fragment:Am,morphinstance_vertex:Rm,morphcolor_vertex:Cm,morphnormal_vertex:Im,morphtarget_pars_vertex:Pm,morphtarget_vertex:Lm,normal_fragment_begin:Dm,normal_fragment_maps:Nm,normal_pars_fragment:Um,normal_pars_vertex:Fm,normal_vertex:Om,normalmap_pars_fragment:Bm,clearcoat_normal_fragment_begin:km,clearcoat_normal_fragment_maps:zm,clearcoat_pars_fragment:Hm,iridescence_pars_fragment:Gm,opaque_fragment:Vm,packing:Wm,premultiplied_alpha_fragment:Xm,project_vertex:qm,dithering_fragment:Ym,dithering_pars_fragment:Zm,roughnessmap_fragment:$m,roughnessmap_pars_fragment:Jm,shadowmap_pars_fragment:Km,shadowmap_pars_vertex:Qm,shadowmap_vertex:jm,shadowmask_pars_fragment:t0,skinbase_vertex:e0,skinning_pars_vertex:n0,skinning_vertex:i0,skinnormal_vertex:s0,specularmap_fragment:r0,specularmap_pars_fragment:o0,tonemapping_fragment:a0,tonemapping_pars_fragment:l0,transmission_fragment:c0,transmission_pars_fragment:h0,uv_pars_fragment:u0,uv_pars_vertex:d0,uv_vertex:f0,worldpos_vertex:p0,background_vert:m0,background_frag:g0,backgroundCube_vert:x0,backgroundCube_frag:_0,cube_vert:y0,cube_frag:v0,depth_vert:M0,depth_frag:S0,distance_vert:b0,distance_frag:w0,equirect_vert:T0,equirect_frag:E0,linedashed_vert:A0,linedashed_frag:R0,meshbasic_vert:C0,meshbasic_frag:I0,meshlambert_vert:P0,meshlambert_frag:L0,meshmatcap_vert:D0,meshmatcap_frag:N0,meshnormal_vert:U0,meshnormal_frag:F0,meshphong_vert:O0,meshphong_frag:B0,meshphysical_vert:k0,meshphysical_frag:z0,meshtoon_vert:H0,meshtoon_frag:G0,points_vert:V0,points_frag:W0,shadow_vert:X0,shadow_frag:q0,sprite_vert:Y0,sprite_frag:Z0},Mt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Yn={basic:{uniforms:Ye([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:Ye([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new $t(0)},envMapIntensity:{value:1}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:Ye([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:Ye([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:Ye([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new $t(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:Ye([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:Ye([Mt.points,Mt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:Ye([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:Ye([Mt.common,Mt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:Ye([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:Ye([Mt.sprite,Mt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distance:{uniforms:Ye([Mt.common,Mt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distance_vert,fragmentShader:jt.distance_frag},shadow:{uniforms:Ye([Mt.lights,Mt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};Yn.physical={uniforms:Ye([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var Ka={r:0,b:0,g:0},$0=new ae,hd=new Zt;hd.set(-1,0,0,0,1,0,0,0,1);function J0(s,t,e,n,i,r){let o=new $t(0),a=i===!0?0:1,l,c,h=null,d=0,u=null;function f(M){let E=M.isScene===!0?M.background:null;if(E&&E.isTexture){let _=M.backgroundBlurriness>0;E=t.get(E,_)}return E}function g(M){let E=!1,_=f(M);_===null?m(o,a):_&&_.isColor&&(m(_,1),E=!0);let b=s.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(M,E){let _=f(E);_&&(_.isCubeTexture||_.mapping===Fr)?(c===void 0&&(c=new Et(new _n(1,1,1),new un({name:"BackgroundCubeMaterial",uniforms:Xi(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:Qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,w,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4($0.makeRotationFromEuler(E.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(hd),c.material.toneMapped=oe.getTransfer(_.colorSpace)!==me,(h!==_||d!==_.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=_,d=_.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Et(new In(2,2),new un({name:"BackgroundMaterial",uniforms:Xi(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=oe.getTransfer(_.colorSpace)!==me,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||d!==_.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=_,d=_.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,E){M.getRGB(Ka,Rc(s)),e.buffers.color.setClear(Ka.r,Ka.g,Ka.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,E=1){o.set(M),a=E,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(M){a=M,m(o,a)},render:g,addToRenderList:v,dispose:p}}function K0(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null),r=i,o=!1;function a(F,B,G,U,k){let Z=!1,K=d(F,U,G,B);r!==K&&(r=K,c(r.object)),Z=f(F,U,G,k),Z&&g(F,U,G,k),k!==null&&t.update(k,s.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,_(F,B,G,U),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return s.createVertexArray()}function c(F){return s.bindVertexArray(F)}function h(F){return s.deleteVertexArray(F)}function d(F,B,G,U){let k=U.wireframe===!0,Z=n[B.id];Z===void 0&&(Z={},n[B.id]=Z);let K=F.isInstancedMesh===!0?F.id:0,at=Z[K];at===void 0&&(at={},Z[K]=at);let $=at[G.id];$===void 0&&($={},at[G.id]=$);let et=$[k];return et===void 0&&(et=u(l()),$[k]=et),et}function u(F){let B=[],G=[],U=[];for(let k=0;k<e;k++)B[k]=0,G[k]=0,U[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:G,attributeDivisors:U,object:F,attributes:{},index:null}}function f(F,B,G,U){let k=r.attributes,Z=B.attributes,K=0,at=G.getAttributes();for(let $ in at)if(at[$].location>=0){let rt=k[$],Nt=Z[$];if(Nt===void 0&&($==="instanceMatrix"&&F.instanceMatrix&&(Nt=F.instanceMatrix),$==="instanceColor"&&F.instanceColor&&(Nt=F.instanceColor)),rt===void 0||rt.attribute!==Nt||Nt&&rt.data!==Nt.data)return!0;K++}return r.attributesNum!==K||r.index!==U}function g(F,B,G,U){let k={},Z=B.attributes,K=0,at=G.getAttributes();for(let $ in at)if(at[$].location>=0){let rt=Z[$];rt===void 0&&($==="instanceMatrix"&&F.instanceMatrix&&(rt=F.instanceMatrix),$==="instanceColor"&&F.instanceColor&&(rt=F.instanceColor));let Nt={};Nt.attribute=rt,rt&&rt.data&&(Nt.data=rt.data),k[$]=Nt,K++}r.attributes=k,r.attributesNum=K,r.index=U}function v(){let F=r.newAttributes;for(let B=0,G=F.length;B<G;B++)F[B]=0}function m(F){p(F,0)}function p(F,B){let G=r.newAttributes,U=r.enabledAttributes,k=r.attributeDivisors;G[F]=1,U[F]===0&&(s.enableVertexAttribArray(F),U[F]=1),k[F]!==B&&(s.vertexAttribDivisor(F,B),k[F]=B)}function M(){let F=r.newAttributes,B=r.enabledAttributes;for(let G=0,U=B.length;G<U;G++)B[G]!==F[G]&&(s.disableVertexAttribArray(G),B[G]=0)}function E(F,B,G,U,k,Z,K){K===!0?s.vertexAttribIPointer(F,B,G,k,Z):s.vertexAttribPointer(F,B,G,U,k,Z)}function _(F,B,G,U){v();let k=U.attributes,Z=G.getAttributes(),K=B.defaultAttributeValues;for(let at in Z){let $=Z[at];if($.location>=0){let et=k[at];if(et===void 0&&(at==="instanceMatrix"&&F.instanceMatrix&&(et=F.instanceMatrix),at==="instanceColor"&&F.instanceColor&&(et=F.instanceColor)),et!==void 0){let rt=et.normalized,Nt=et.itemSize,Ct=t.get(et);if(Ct===void 0)continue;let le=Ct.buffer,Kt=Ct.type,te=Ct.bytesPerElement,tt=Kt===s.INT||Kt===s.UNSIGNED_INT||et.gpuType===ua;if(et.isInterleavedBufferAttribute){let j=et.data,vt=j.stride,Ht=et.offset;if(j.isInstancedInterleavedBuffer){for(let At=0;At<$.locationSize;At++)p($.location+At,j.meshPerAttribute);F.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let At=0;At<$.locationSize;At++)m($.location+At);s.bindBuffer(s.ARRAY_BUFFER,le);for(let At=0;At<$.locationSize;At++)E($.location+At,Nt/$.locationSize,Kt,rt,vt*te,(Ht+Nt/$.locationSize*At)*te,tt)}else{if(et.isInstancedBufferAttribute){for(let j=0;j<$.locationSize;j++)p($.location+j,et.meshPerAttribute);F.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let j=0;j<$.locationSize;j++)m($.location+j);s.bindBuffer(s.ARRAY_BUFFER,le);for(let j=0;j<$.locationSize;j++)E($.location+j,Nt/$.locationSize,Kt,rt,Nt*te,Nt/$.locationSize*j*te,tt)}}else if(K!==void 0){let rt=K[at];if(rt!==void 0)switch(rt.length){case 2:s.vertexAttrib2fv($.location,rt);break;case 3:s.vertexAttrib3fv($.location,rt);break;case 4:s.vertexAttrib4fv($.location,rt);break;default:s.vertexAttrib1fv($.location,rt)}}}}M()}function b(){A();for(let F in n){let B=n[F];for(let G in B){let U=B[G];for(let k in U){let Z=U[k];for(let K in Z)h(Z[K].object),delete Z[K];delete U[k]}}delete n[F]}}function w(F){if(n[F.id]===void 0)return;let B=n[F.id];for(let G in B){let U=B[G];for(let k in U){let Z=U[k];for(let K in Z)h(Z[K].object),delete Z[K];delete U[k]}}delete n[F.id]}function I(F){for(let B in n){let G=n[B];for(let U in G){let k=G[U];if(k[F.id]===void 0)continue;let Z=k[F.id];for(let K in Z)h(Z[K].object),delete Z[K];delete k[F.id]}}}function y(F){for(let B in n){let G=n[B],U=F.isInstancedMesh===!0?F.id:0,k=G[U];if(k!==void 0){for(let Z in k){let K=k[Z];for(let at in K)h(K[at].object),delete K[at];delete k[Z]}delete G[U],Object.keys(G).length===0&&delete n[B]}}}function A(){P(),o=!0,r!==i&&(r=i,c(r.object))}function P(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:A,resetDefaultState:P,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfObject:y,releaseStatesOfProgram:I,initAttributes:v,enableAttribute:m,disableUnusedAttributes:M}}function Q0(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function j0(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let I=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(I){return!(I!==Mn&&n.convert(I)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(I){let y=I===Dn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==nn&&I!==vn&&!y&&n.convert(I)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(I){if(I==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Xt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Xt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),w=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:E,maxFragmentUniforms:_,maxSamples:b,samples:w}}function tg(s){let t=this,e=null,n=0,i=!1,r=!1,o=new En,a=new Zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,p=s.get(d);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:n,E=M*4,_=p.clippingState||null;l.value=_,_=h(g,u,E,f);for(let b=0;b!==E;++b)_[b]=e[b];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){let v=d!==null?d.length:0,m=null;if(v!==0){if(m=l.value,g!==!0||m===null){let p=f+v*4,M=u.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,_=f;E!==v;++E,_+=4)o.copy(d[E]).applyMatrix4(M,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}var Fs=4,eg=6,ng=20,ig=256,Vr=new Nr,Gu=new $t,Oc=null,Bc=0,kc=0,zc=!1,sg=new L,qi=new L,ja=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=sg}=r;Oc=this._renderer.getRenderTarget(),Bc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),zc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Oc,Bc,kc),this._renderer.xr.enabled=zc,t.scissorTest=!1,Us(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ti||t.mapping===Vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Oc=this._renderer.getRenderTarget(),Bc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),zc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ve,minFilter:Ve,generateMipmaps:!1,type:Dn,format:Mn,colorSpace:er,depthBuffer:!1},i=Vu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vu(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=rg(r)),this._blurMaterial=ag(r,t,e),this._ggxMaterial=og(r,t,e)}return i}_compileMaterial(t){let e=new Et(new we,t);this._renderer.compile(e,Vr)}_sceneToCubeUV(t,e,n,i,r){let l=new Be(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Gu),d.toneMapping=Pn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Et(new _n,new gi({name:"PMREM.Background",side:Qe,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,m=v.material,p=!1,M=t.background;M?M.isColor&&(m.color.copy(M),t.background=null,p=!0):(m.color.copy(Gu),p=!0);for(let E=0;E<6;E++){let _=E%3;_===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):_===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));let b=this._cubeSize;Us(i,_*b,E>2?b:0,b,b),d.setRenderTarget(i),p&&d.render(v,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=M}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Ti||t.mapping===Vi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wu());let r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Us(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Vr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:g}=this,v=this._sizeLods[n],m=3*v*(n>g-Fs?n-g+Fs:0),p=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,Us(r,m,p,3*v,2*v),i.setRenderTarget(r),i.render(a,Vr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Us(t,m,p,3*v,2*v),i.setRenderTarget(t),i.render(a,Vr)}_blur(t,e,n,i){let r=this._pingPongRenderTarget,o=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,i,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[i];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],d=3*h*(i>this._lodMax-Fs?i-this._lodMax+Fs:0),u=4*(this._cubeSize-h);Us(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Vr)}};function rg(s){let t=[],e=[],n=s,i=s-Fs+1+eg;for(let r=0;r<i;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,g=new Float32Array(f*u*d),v=new Float32Array(f*u*d);for(let p=0;p<d;p++){let M=p%3*2/3-1,E=p>2?0:-1,_=[M,E,0,M+2/3,E,0,M+2/3,E+1,0,M,E,0,M+2/3,E+1,0,M,E+1,0];g.set(_,f*u*p);for(let b=0;b<u;b++){let w=h[b*2]*2-1,I=h[b*2+1]*2-1;p===0?qi.set(1,I,w):p===1?qi.set(-w,1,-I):p===2?qi.set(-w,I,1):p===3?qi.set(-1,I,-w):p===4?qi.set(-w,-1,I):qi.set(w,I,-1),qi.toArray(v,(p*u+b)*f)}}let m=new we;m.setAttribute("position",new Ne(g,f)),m.setAttribute("outputDirection",new Ne(v,f)),e.push(new Et(m,null)),n>Fs&&n--}return{lodMeshes:e,sizeLods:t}}function Vu(s,t,e){let n=new tn(s,t,e);return n.texture.mapping=Fr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Us(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function og(s,t,e){return new un({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ig,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:nl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function ag(s,t,e){return new un({name:"SphericalGaussianBlur",defines:{SAMPLES:ng,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:nl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Wu(){return new un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Xu(){return new un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function nl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var tl=class extends tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new mr(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new _n(5,5,5),r=new un({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qe,blending:Xn});r.uniforms.tEquirect.value=e;let o=new Et(i,r),a=e.minFilter;return e.minFilter===Ei&&(e.minFilter=Ve),new sa(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}};function lg(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===la||f===ca)if(t.has(u)){let g=t.get(u).texture;return a(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let v=new tl(g.height);return v.fromEquirectangularTexture(s,u),t.set(u,v),u.addEventListener("dispose",c),a(v.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let f=u.mapping,g=f===la||f===ca,v=f===Ti||f===Vi;if(g||v){let m=e.get(u),p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new ja(s)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{let M=u.image;return g&&M&&M.height>0||v&&M&&l(M)?(n===null&&(n=new ja(s)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function a(u,f){return f===la?u.mapping=Ti:f===ca&&(u.mapping=Vi),u}function l(u){let f=0,g=6;for(let v=0;v<g;v++)u[v]!==void 0&&f++;return f===g}function c(u){let f=u.target;f.removeEventListener("dispose",c);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function cg(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Bi("WebGLRenderer: "+n+" extension not supported."),i}}}function hg(s,t,e,n){let i={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete i[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],s.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,g=d.attributes.position,v=0;if(g===void 0)return;if(f!==null){let M=f.array;v=f.version;for(let E=0,_=M.length;E<_;E+=3){let b=M[E+0],w=M[E+1],I=M[E+2];u.push(b,w,w,I,I,b)}}else{let M=g.array;v=g.version;for(let E=0,_=M.length/3-1;E<_;E+=3){let b=E+0,w=E+1,I=E+2;u.push(b,w,w,I,I,b)}}let m=new(g.count>=65535?hr:cr)(u,1);m.version=v;let p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function ug(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){s.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*o,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let m=0;m<f;m++)v+=u[m];e.update(v,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function dg(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:Gt("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function fg(s,t,e){let n=new WeakMap,i=new Te;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let A=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],E=0;f===!0&&(E=1),g===!0&&(E=2),v===!0&&(E=3);let _=a.attributes.position.count*E,b=1;_>t.maxTextureSize&&(b=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);let w=new Float32Array(_*b*4*d),I=new or(w,_,b,d);I.type=vn,I.needsUpdate=!0;let y=E*4;for(let P=0;P<d;P++){let F=m[P],B=p[P],G=M[P],U=_*b*4*P;for(let k=0;k<F.count;k++){let Z=k*y;f===!0&&(i.fromBufferAttribute(F,k),w[U+Z+0]=i.x,w[U+Z+1]=i.y,w[U+Z+2]=i.z,w[U+Z+3]=0),g===!0&&(i.fromBufferAttribute(B,k),w[U+Z+4]=i.x,w[U+Z+5]=i.y,w[U+Z+6]=i.z,w[U+Z+7]=0),v===!0&&(i.fromBufferAttribute(G,k),w[U+Z+8]=i.x,w[U+Z+9]=i.y,w[U+Z+10]=i.z,w[U+Z+11]=G.itemSize===4?i.w:1)}}u={count:d,texture:I,size:new ft(_,b)},n.set(a,u),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function pg(s,t,e,n,i){let r=new WeakMap;function o(c){let h=i.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var mg={[uc]:"LINEAR_TONE_MAPPING",[dc]:"REINHARD_TONE_MAPPING",[fc]:"CINEON_TONE_MAPPING",[pc]:"ACES_FILMIC_TONE_MAPPING",[gc]:"AGX_TONE_MAPPING",[xc]:"NEUTRAL_TONE_MAPPING",[mc]:"CUSTOM_TONE_MAPPING"};function gg(s,t,e,n,i,r){let o=new tn(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new we;c.setAttribute("position",new re([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new re([0,2,0,0,2,0],2));let h=new Xo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Et(c,h),u=new Nr(-1,1,1,-1,0,1),f=null,g=null,v=!1,m,p=null,M=[],E=!1;this.setSize=function(_,b){o.setSize(_,b),a!==null&&a.setSize(_,b),l!==null&&l.setSize(_,b);for(let w=0;w<M.length;w++){let I=M[w];I.setSize&&I.setSize(_,b)}},this.setEffects=function(_){M=_,E=M.length>0&&M[0].isRenderPass===!0;let b=o.width,w=o.height;M.length>0&&a===null&&(a=new tn(b,w,{type:Dn,depthBuffer:!1,stencilBuffer:!1}),l=new tn(b,w,{type:Dn,depthBuffer:!1,stencilBuffer:!1}));for(let I=0;I<M.length;I++){let y=M[I];y.setSize&&y.setSize(b,w)}},this.begin=function(_,b){if(v||_.toneMapping===Pn&&M.length===0)return!1;if(p=b,b!==null){let w=b.width,I=b.height;(o.width!==w||o.height!==I)&&this.setSize(w,I)}return E===!1&&_.setRenderTarget(o),m=_.toneMapping,_.toneMapping=Pn,!0},this.hasRenderPass=function(){return E},this.end=function(_,b){_.toneMapping=m,v=!0;let w=o,I=a;for(let y=0;y<M.length;y++){let A=M[y];A.enabled!==!1&&(A.render(_,I,w,b),A.needsSwap!==!1&&(w=I,I=I===a?l:a))}if(f!==_.outputColorSpace||g!==_.toneMapping){f=_.outputColorSpace,g=_.toneMapping,h.defines={},oe.getTransfer(f)===me&&(h.defines.SRGB_TRANSFER="");let y=mg[g];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=w.texture,_.setRenderTarget(p),_.render(d,u),p=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var ud=new Je,Vc=new _i(1,1),dd=new or,fd=new Fo,pd=new mr,qu=[],Yu=[],Zu=new Float32Array(16),$u=new Float32Array(9),Ju=new Float32Array(4);function Bs(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=qu[i];if(r===void 0&&(r=new Float32Array(i),qu[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Ue(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Fe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function il(s,t){let e=Yu[t];e===void 0&&(e=new Int32Array(t),Yu[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function xg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function _g(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;s.uniform2fv(this.addr,t),Fe(e,t)}}function yg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;s.uniform3fv(this.addr,t),Fe(e,t)}}function vg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;s.uniform4fv(this.addr,t),Fe(e,t)}}function Mg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,n))return;Ju.set(n),s.uniformMatrix2fv(this.addr,!1,Ju),Fe(e,n)}}function Sg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,n))return;$u.set(n),s.uniformMatrix3fv(this.addr,!1,$u),Fe(e,n)}}function bg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,n))return;Zu.set(n),s.uniformMatrix4fv(this.addr,!1,Zu),Fe(e,n)}}function wg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Tg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;s.uniform2iv(this.addr,t),Fe(e,t)}}function Eg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;s.uniform3iv(this.addr,t),Fe(e,t)}}function Ag(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;s.uniform4iv(this.addr,t),Fe(e,t)}}function Rg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Cg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;s.uniform2uiv(this.addr,t),Fe(e,t)}}function Ig(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;s.uniform3uiv(this.addr,t),Fe(e,t)}}function Pg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;s.uniform4uiv(this.addr,t),Fe(e,t)}}function Lg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Vc.compareFunction=e.isReversedDepthBuffer()?Ja:$a,r=Vc):r=ud,e.setTexture2D(t||r,i)}function Dg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||fd,i)}function Ng(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||pd,i)}function Ug(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||dd,i)}function Fg(s){switch(s){case 5126:return xg;case 35664:return _g;case 35665:return yg;case 35666:return vg;case 35674:return Mg;case 35675:return Sg;case 35676:return bg;case 5124:case 35670:return wg;case 35667:case 35671:return Tg;case 35668:case 35672:return Eg;case 35669:case 35673:return Ag;case 5125:return Rg;case 36294:return Cg;case 36295:return Ig;case 36296:return Pg;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Ng;case 36289:case 36303:case 36311:case 36292:return Ug}}function Og(s,t){s.uniform1fv(this.addr,t)}function Bg(s,t){let e=Bs(t,this.size,2);s.uniform2fv(this.addr,e)}function kg(s,t){let e=Bs(t,this.size,3);s.uniform3fv(this.addr,e)}function zg(s,t){let e=Bs(t,this.size,4);s.uniform4fv(this.addr,e)}function Hg(s,t){let e=Bs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Gg(s,t){let e=Bs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Vg(s,t){let e=Bs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Wg(s,t){s.uniform1iv(this.addr,t)}function Xg(s,t){s.uniform2iv(this.addr,t)}function qg(s,t){s.uniform3iv(this.addr,t)}function Yg(s,t){s.uniform4iv(this.addr,t)}function Zg(s,t){s.uniform1uiv(this.addr,t)}function $g(s,t){s.uniform2uiv(this.addr,t)}function Jg(s,t){s.uniform3uiv(this.addr,t)}function Kg(s,t){s.uniform4uiv(this.addr,t)}function Qg(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ue(n,r)||(s.uniform1iv(this.addr,r),Fe(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=Vc:o=ud;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function jg(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ue(n,r)||(s.uniform1iv(this.addr,r),Fe(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||fd,r[o])}function tx(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ue(n,r)||(s.uniform1iv(this.addr,r),Fe(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||pd,r[o])}function ex(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ue(n,r)||(s.uniform1iv(this.addr,r),Fe(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||dd,r[o])}function nx(s){switch(s){case 5126:return Og;case 35664:return Bg;case 35665:return kg;case 35666:return zg;case 35674:return Hg;case 35675:return Gg;case 35676:return Vg;case 5124:case 35670:return Wg;case 35667:case 35671:return Xg;case 35668:case 35672:return qg;case 35669:case 35673:return Yg;case 5125:return Zg;case 36294:return $g;case 36295:return Jg;case 36296:return Kg;case 35678:case 36198:case 36298:case 36306:case 35682:return Qg;case 35679:case 36299:case 36307:return jg;case 35680:case 36300:case 36308:case 36293:return tx;case 36289:case 36303:case 36311:case 36292:return ex}}var Wc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Fg(e.type)}},Xc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=nx(e.type)}},qc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},Hc=/(\w+)(\])?(\[|\.)?/g;function Ku(s,t){s.seq.push(t),s.map[t.id]=t}function ix(s,t,e){let n=s.name,i=n.length;for(Hc.lastIndex=0;;){let r=Hc.exec(n),o=Hc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ku(e,c===void 0?new Wc(a,s,t):new Xc(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new qc(a),Ku(e,d)),e=d}}}var Os=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);ix(a,l,this)}let i=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function Qu(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var sx=37297,rx=0;function ox(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var ju=new Zt;function ax(s){oe._getMatrix(ju,oe.workingColorSpace,s);let t=`mat3( ${ju.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(s)){case nr:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return Xt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function td(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+ox(s.getShaderSource(t),a)}else return r}function lx(s,t){let e=ax(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var cx={[uc]:"Linear",[dc]:"Reinhard",[fc]:"Cineon",[pc]:"ACESFilmic",[gc]:"AgX",[xc]:"Neutral",[mc]:"Custom"};function hx(s,t){let e=cx[t];return e===void 0?(Xt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Qa=new L;function ux(){oe.getLuminanceCoefficients(Qa);let s=Qa.x.toFixed(4),t=Qa.y.toFixed(4),e=Qa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function dx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xr).join(`
`)}function fx(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function px(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Xr(s){return s!==""}function ed(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function nd(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var mx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yc(s){return s.replace(mx,xx)}var gx=new Map;function xx(s,t){let e=jt[t];if(e===void 0){let n=gx.get(t);if(n!==void 0)e=jt[n],Xt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Yc(e)}var _x=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function id(s){return s.replace(_x,yx)}function yx(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function sd(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var vx={[Hi]:"SHADOWMAP_TYPE_PCF",[Ps]:"SHADOWMAP_TYPE_VSM"};function Mx(s){return vx[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Sx={[Ti]:"ENVMAP_TYPE_CUBE",[Vi]:"ENVMAP_TYPE_CUBE",[Fr]:"ENVMAP_TYPE_CUBE_UV"};function bx(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Sx[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var wx={[Vi]:"ENVMAP_MODE_REFRACTION"};function Tx(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":wx[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Ex={[aa]:"ENVMAP_BLENDING_MULTIPLY",[xu]:"ENVMAP_BLENDING_MIX",[_u]:"ENVMAP_BLENDING_ADD"};function Ax(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Ex[s.combine]||"ENVMAP_BLENDING_NONE"}function Rx(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Cx(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Mx(e),c=bx(e),h=Tx(e),d=Ax(e),u=Rx(e),f=dx(e),g=fx(r),v=i.createProgram(),m,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Xr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Xr).join(`
`),p.length>0&&(p+=`
`)):(m=[sd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xr).join(`
`),p=[sd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Pn?"#define TONE_MAPPING":"",e.toneMapping!==Pn?jt.tonemapping_pars_fragment:"",e.toneMapping!==Pn?hx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,lx("linearToOutputTexel",e.outputColorSpace),ux(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xr).join(`
`)),o=Yc(o),o=ed(o,e),o=nd(o,e),a=Yc(a),a=ed(a,e),a=nd(a,e),o=id(o),a=id(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Ec?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ec?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let E=M+m+o,_=M+p+a,b=Qu(i,i.VERTEX_SHADER,E),w=Qu(i,i.FRAGMENT_SHADER,_);i.attachShader(v,b),i.attachShader(v,w),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function I(F){if(s.debug.checkShaderErrors){let B=i.getProgramInfoLog(v)||"",G=i.getShaderInfoLog(b)||"",U=i.getShaderInfoLog(w)||"",k=B.trim(),Z=G.trim(),K=U.trim(),at=!0,$=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(at=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,b,w);else{let et=td(i,b,"vertex"),rt=td(i,w,"fragment");Gt("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+k+`
`+et+`
`+rt)}else k!==""?Xt("WebGLProgram: Program Info Log:",k):(Z===""||K==="")&&($=!1);$&&(F.diagnostics={runnable:at,programLog:k,vertexShader:{log:Z,prefix:m},fragmentShader:{log:K,prefix:p}})}i.deleteShader(b),i.deleteShader(w),y=new Os(i,v),A=px(i,v)}let y;this.getUniforms=function(){return y===void 0&&I(this),y};let A;this.getAttributes=function(){return A===void 0&&I(this),A};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=i.getProgramParameter(v,sx)),P},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=rx++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=w,this}var Ix=0,Zc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new $c(t),e.set(t,n)),n}},$c=class{constructor(t){this.id=Ix++,this.code=t,this.usedTimes=0}};function Px(s){return s===Ri||s===Hr||s===Gr}function Lx(s,t,e,n,i,r){let o=new Ms,a=new Zc,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function v(y,A,P,F,B,G){let U=F.fog,k=B.geometry,Z=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,K=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,at=t.get(y.envMap||Z,K),$=at&&at.mapping===Fr?at.image.height:null,et=f[y.type];y.precision!==null&&(u=n.getMaxPrecision(y.precision),u!==y.precision&&Xt("WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));let rt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Nt=rt!==void 0?rt.length:0,Ct=0;k.morphAttributes.position!==void 0&&(Ct=1),k.morphAttributes.normal!==void 0&&(Ct=2),k.morphAttributes.color!==void 0&&(Ct=3);let le,Kt,te,tt;if(et){let ge=Yn[et];le=ge.vertexShader,Kt=ge.fragmentShader}else{le=y.vertexShader,Kt=y.fragmentShader;let ge=a.getVertexShaderStage(y),ce=a.getFragmentShaderStage(y);a.update(y,ge,ce),te=ge.id,tt=ce.id}let j=s.getRenderTarget(),vt=s.state.buffers.depth.getReversed(),Ht=B.isInstancedMesh===!0,At=B.isBatchedMesh===!0,Vt=!!y.map,ee=!!y.matcap,st=!!at,lt=!!y.aoMap,ut=!!y.lightMap,dt=!!y.bumpMap&&y.wireframe===!1,gt=!!y.normalMap,zt=!!y.displacementMap,kt=!!y.emissiveMap,Wt=!!y.metalnessMap,qt=!!y.roughnessMap,N=y.anisotropy>0,de=y.clearcoat>0,ne=y.dispersion>0,R=y.retroreflectivity>0,x=y.iridescence>0,z=y.sheen>0,V=y.transmission>0,Q=N&&!!y.anisotropyMap,pt=de&&!!y.clearcoatMap,xt=de&&!!y.clearcoatNormalMap,T=de&&!!y.clearcoatRoughnessMap,C=x&&!!y.iridescenceMap,H=x&&!!y.iridescenceThicknessMap,q=z&&!!y.sheenColorMap,Y=z&&!!y.sheenRoughnessMap,it=!!y.specularMap,ct=!!y.specularColorMap,ht=!!y.specularIntensityMap,Ut=V&&!!y.transmissionMap,D=V&&!!y.thicknessMap,_t=!!y.gradientMap,nt=!!y.alphaMap,yt=y.alphaTest>0,bt=!!y.alphaHash,ot=!!y.extensions,Ft=Pn;y.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ft=s.toneMapping);let Rt={shaderID:et,shaderType:y.type,shaderName:y.name,vertexShader:le,fragmentShader:Kt,defines:y.defines,customVertexShaderID:te,customFragmentShaderID:tt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:At,batchingColor:At&&B._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&B.instanceColor!==null,instancingMorph:Ht&&B.morphTexture!==null,outputColorSpace:j===null?s.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:oe.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Vt,matcap:ee,envMap:st,envMapMode:st&&at.mapping,envMapCubeUVHeight:$,aoMap:lt,lightMap:ut,bumpMap:dt,normalMap:gt,displacementMap:zt,emissiveMap:kt,normalMapObjectSpace:gt&&y.normalMapType===Mu,normalMapTangentSpace:gt&&y.normalMapType===Za,packedNormalMap:gt&&y.normalMapType===Za&&Px(y.normalMap.format),metalnessMap:Wt,roughnessMap:qt,anisotropy:N,anisotropyMap:Q,clearcoat:de,clearcoatMap:pt,clearcoatNormalMap:xt,clearcoatRoughnessMap:T,dispersion:ne,retroreflection:R,iridescence:x,iridescenceMap:C,iridescenceThicknessMap:H,sheen:z,sheenColorMap:q,sheenRoughnessMap:Y,specularMap:it,specularColorMap:ct,specularIntensityMap:ht,transmission:V,transmissionMap:Ut,thicknessMap:D,gradientMap:_t,opaque:y.transparent===!1&&y.blending===Ls&&y.alphaToCoverage===!1,alphaMap:nt,alphaTest:yt,alphaHash:bt,combine:y.combine,mapUv:Vt&&g(y.map.channel),aoMapUv:lt&&g(y.aoMap.channel),lightMapUv:ut&&g(y.lightMap.channel),bumpMapUv:dt&&g(y.bumpMap.channel),normalMapUv:gt&&g(y.normalMap.channel),displacementMapUv:zt&&g(y.displacementMap.channel),emissiveMapUv:kt&&g(y.emissiveMap.channel),metalnessMapUv:Wt&&g(y.metalnessMap.channel),roughnessMapUv:qt&&g(y.roughnessMap.channel),anisotropyMapUv:Q&&g(y.anisotropyMap.channel),clearcoatMapUv:pt&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:xt&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:T&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:C&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:H&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:q&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:Y&&g(y.sheenRoughnessMap.channel),specularMapUv:it&&g(y.specularMap.channel),specularColorMapUv:ct&&g(y.specularColorMap.channel),specularIntensityMapUv:ht&&g(y.specularIntensityMap.channel),transmissionMapUv:Ut&&g(y.transmissionMap.channel),thicknessMapUv:D&&g(y.thicknessMap.channel),alphaMapUv:nt&&g(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(gt||N),vertexNormals:!!k.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(Vt||nt),fog:!!U,useFog:y.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||k.attributes.normal===void 0&&gt===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:vt,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Nt,morphTextureStride:Ct,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ft,decodeVideoTexture:Vt&&y.map.isVideoTexture===!0&&oe.getTransfer(y.map.colorSpace)===me,decodeVideoTextureEmissive:kt&&y.emissiveMap.isVideoTexture===!0&&oe.getTransfer(y.emissiveMap.colorSpace)===me,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===yn,flipSided:y.side===Qe,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ot&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ot&&y.extensions.multiDraw===!0||At)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Rt.vertexUv1s=l.has(1),Rt.vertexUv2s=l.has(2),Rt.vertexUv3s=l.has(3),l.clear(),Rt}function m(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let P in y.defines)A.push(P),A.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(p(A,y),M(A,y),A.push(s.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function p(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function M(y,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function E(y){let A=f[y.type],P;if(A){let F=Yn[A];P=ku.clone(F.uniforms)}else P=y.uniforms;return P}function _(y,A){let P=h.get(A);return P!==void 0?++P.usedTimes:(P=new Cx(s,A,y,i),c.push(P),h.set(A,P)),P}function b(y){if(--y.usedTimes===0){let A=c.indexOf(y);c[A]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function w(y){a.remove(y)}function I(){a.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:E,acquireProgram:_,releaseProgram:b,releaseShaderCache:w,programs:c,dispose:I}}function Dx(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Nx(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function rd(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function od(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,g,v,m,p){let M=s[t];return M===void 0?(M={id:u.id,object:u,geometry:f,material:g,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:m,group:p},s[t]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=g,M.materialVariant=o(u),M.groupOrder=v,M.renderOrder=u.renderOrder,M.z=m,M.group=p),t++,M}function l(u,f,g,v,m,p,M){M.reversedDepth===!0&&(m=-m);let E=a(u,f,g,v,m,p);g.transmission>0?n.push(E):g.transparent===!0?i.push(E):e.push(E)}function c(u,f,g,v,m,p){let M=a(u,f,g,v,m,p);g.transmission>0?n.unshift(M):g.transparent===!0?i.unshift(M):e.unshift(M)}function h(u,f){e.length>1&&e.sort(u||Nx),n.length>1&&n.sort(f||rd),i.length>1&&i.sort(f||rd)}function d(){for(let u=t,f=s.length;u<f;u++){let g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:h}}function Ux(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new od,s.set(n,[o])):i>=r.length?(o=new od,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Fx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new L,color:new $t};break;case"SpotLight":e={position:new L,direction:new L,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new L,halfWidth:new L,halfHeight:new L};break}return s[t.id]=e,e}}}function Ox(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var Bx=0;function kx(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function zx(s){let t=new Fx,e=Ox(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let i=new L,r=new ae,o=new ae;function a(c){let h=0,d=0,u=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,M=0,E=0,_=0,b=0,w=0,I=0,y=0,A=0,P=0;c.sort(kx);for(let B=0,G=c.length;B<G;B++){let U=c[B],k=U.color,Z=U.intensity,K=U.distance,at=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Ri?at=U.shadow.map.texture:at=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)h+=k.r*Z,d+=k.g*Z,u+=k.b*Z;else if(U.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(U.sh.coefficients[$],Z);P++}else if(U.isSunLight){let $=t.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let et=U.shadow,rt=e.get(U);rt.shadowIntensity=et.intensity,rt.shadowBias=et.bias,rt.shadowNormalBias=et.normalBias,rt.shadowRadius=et.radius,rt.shadowMapSize.copy(et.mapSize).multiply(et.getFrameExtents()),n.sunShadow[g]=rt,n.sunShadowMap[g]=at;let Nt=et.getViewportCount();for(let Ct=0;Ct<Nt;Ct++)n.sunShadowMatrix[v+Ct]=et.getMatrix(Ct),n.sunShadowCascade[v+Ct]=et._cascadeData[Ct];v+=Nt,g++}n.sun[f]=$,f++}else if(U.isDirectionalLight){let $=t.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let et=U.shadow,rt=e.get(U);rt.shadowIntensity=et.intensity,rt.shadowBias=et.bias,rt.shadowNormalBias=et.normalBias,rt.shadowRadius=et.radius,rt.shadowMapSize=et.mapSize,n.directionalShadow[m]=rt,n.directionalShadowMap[m]=at,n.directionalShadowMatrix[m]=U.shadow.matrix,b++}n.directional[m]=$,m++}else if(U.isSpotLight){let $=t.get(U);$.position.setFromMatrixPosition(U.matrixWorld),$.color.copy(k).multiplyScalar(Z),$.distance=K,$.coneCos=Math.cos(U.angle),$.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),$.decay=U.decay,n.spot[M]=$;let et=U.shadow;if(U.map&&(n.spotLightMap[y]=U.map,y++,et.updateMatrices(U),U.castShadow&&A++),n.spotLightMatrix[M]=et.matrix,U.castShadow){let rt=e.get(U);rt.shadowIntensity=et.intensity,rt.shadowBias=et.bias,rt.shadowNormalBias=et.normalBias,rt.shadowRadius=et.radius,rt.shadowMapSize=et.mapSize,n.spotShadow[M]=rt,n.spotShadowMap[M]=at,I++}M++}else if(U.isRectAreaLight){let $=t.get(U);$.color.copy(k).multiplyScalar(Z),$.halfWidth.set(U.width*.5,0,0),$.halfHeight.set(0,U.height*.5,0),n.rectArea[E]=$,E++}else if(U.isPointLight){let $=t.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),$.distance=U.distance,$.decay=U.decay,U.castShadow){let et=U.shadow,rt=e.get(U);rt.shadowIntensity=et.intensity,rt.shadowBias=et.bias,rt.shadowNormalBias=et.normalBias,rt.shadowRadius=et.radius,rt.shadowMapSize=et.mapSize,rt.shadowCameraNear=et.camera.near,rt.shadowCameraFar=et.camera.far,n.pointShadow[p]=rt,n.pointShadowMap[p]=at,n.pointShadowMatrix[p]=U.shadow.matrix,w++}n.point[p]=$,p++}else if(U.isHemisphereLight){let $=t.get(U);$.skyColor.copy(U.color).multiplyScalar(Z),$.groundColor.copy(U.groundColor).multiplyScalar(Z),n.hemi[_]=$,_++}}E>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Mt.LTC_FLOAT_1,n.rectAreaLTC2=Mt.LTC_FLOAT_2):(n.rectAreaLTC1=Mt.LTC_HALF_1,n.rectAreaLTC2=Mt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let F=n.hash;(F.sunLength!==f||F.directionalLength!==m||F.pointLength!==p||F.spotLength!==M||F.rectAreaLength!==E||F.hemiLength!==_||F.numSunShadows!==g||F.numDirectionalShadows!==b||F.numPointShadows!==w||F.numSpotShadows!==I||F.numSpotMaps!==y||F.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=m,n.spot.length=M,n.rectArea.length=E,n.point.length=p,n.hemi.length=_,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=I,n.spotShadowMap.length=I,n.spotLightMatrix.length=I+y-A,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,F.sunLength=f,F.directionalLength=m,F.pointLength=p,F.spotLength=M,F.rectAreaLength=E,F.hemiLength=_,F.numSunShadows=g,F.numDirectionalShadows=b,F.numPointShadows=w,F.numSpotShadows=I,F.numSpotMaps=y,F.numLightProbes=P,n.version=Bx++)}function l(c,h){let d=0,u=0,f=0,g=0,v=0,m=0,p=h.matrixWorldInverse;for(let M=0,E=c.length;M<E;M++){let _=c[M];if(_.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(p),d++}else if(_.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),u++}else if(_.isSpotLight){let b=n.spot[g];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),g++}else if(_.isRectAreaLight){let b=n.rectArea[v];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(_.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),v++}else if(_.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(p),f++}else if(_.isHemisphereLight){let b=n.hemi[m];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:n}}function ad(s){let t=new zx(s),e=[],n=[],i=[];function r(u){d.camera=u,e.length=0,n.length=0,i.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){i.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Hx(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new ad(s),t.set(i,[a])):r>=o.length?(a=new ad(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Gx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Wx=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Xx=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],ld=new ae,Wr=new L,Gc=new L;function qx(s,t,e){let n=new xi,i=new ft,r=new ft,o=new Te,a=new qo,l=new Yo,c={},h=e.maxTextureSize,d={[wi]:Qe,[Qe]:wi,[yn]:yn},u=new un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Gx,fragmentShader:Vx}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let g=new we;g.setAttribute("position",new Ne(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Et(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hi;let p=this.type;this.render=function(w,I,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Qh&&(Xt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Hi);let A=s.getRenderTarget(),P=s.getActiveCubeFace(),F=s.getActiveMipmapLevel(),B=s.state;B.setBlending(Xn),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let G=p!==this.type;G&&I.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(k=>k.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,k=w.length;U<k;U++){let Z=w[U],K=Z.shadow;if(K===void 0){Xt("WebGLShadowMap:",Z,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;i.copy(K.mapSize);let at=K.getFrameExtents();i.multiply(at),r.copy(K.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/at.x),i.x=r.x*at.x,K.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/at.y),i.y=r.y*at.y,K.mapSize.y=r.y));let $=s.state.buffers.depth.getReversed();if(K.camera._reversedDepth=$,K.map===null||G===!0){if(K.map!==null&&(K.map.depthTexture!==null&&(K.map.depthTexture.dispose(),K.map.depthTexture=null),K.map.dispose()),this.type===Ps){if(Z.isPointLight){Xt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}K.map=new tn(i.x,i.y,{format:Ri,type:Dn,minFilter:Ve,magFilter:Ve,generateMipmaps:!1}),K.map.texture.name=Z.name+".shadowMap",K.map.depthTexture=new _i(i.x,i.y,vn),K.map.depthTexture.name=Z.name+".shadowMapDepth",K.map.depthTexture.format=Hn,K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=De,K.map.depthTexture.magFilter=De}else Z.isPointLight?(K.map=new tl(i.x),K.map.depthTexture=new Oo(i.x,Ln)):(K.map=new tn(i.x,i.y),K.map.depthTexture=new _i(i.x,i.y,Ln)),K.map.depthTexture.name=Z.name+".shadowMap",K.map.depthTexture.format=Hn,this.type===Hi?(K.map.depthTexture.compareFunction=$?Ja:$a,K.map.depthTexture.minFilter=Ve,K.map.depthTexture.magFilter=Ve):(K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=De,K.map.depthTexture.magFilter=De);K.camera.updateProjectionMatrix()}K.map.isWebGLCubeRenderTarget!==!0&&(K.map.width!==i.x||K.map.height!==i.y)&&K.map.setSize(i.x,i.y);let et=K.map.isWebGLCubeRenderTarget?6:K.getViewportCount();Z.isPointLight!==!0&&K.updateMatrices(Z,y);for(let rt=0;rt<et;rt++){let Nt=K.getCamera(rt);if(Z.isPointLight){let Ct=K.camera,le=K.matrix,Kt=Z.distance||Ct.far;Kt!==Ct.far&&(Ct.far=Kt,Ct.updateProjectionMatrix()),Wr.setFromMatrixPosition(Z.matrixWorld),Ct.position.copy(Wr),Gc.copy(Ct.position),Gc.add(Wx[rt]),Ct.up.copy(Xx[rt]),Ct.lookAt(Gc),Ct.updateMatrixWorld(),le.makeTranslation(-Wr.x,-Wr.y,-Wr.z),ld.multiplyMatrices(Ct.projectionMatrix,Ct.matrixWorldInverse),K._frustum.setFromProjectionMatrix(ld,Ct.coordinateSystem,Ct.reversedDepth)}if(K.map.isWebGLCubeRenderTarget)s.setRenderTarget(K.map,rt),s.clear();else{rt===0&&(s.setRenderTarget(K.map),s.clear());let Ct=K.getViewport(rt);o.set(r.x*Ct.x,r.y*Ct.y,r.x*Ct.z,r.y*Ct.w),B.viewport(o)}n=K.getFrustum(rt),_(I,y,Nt,Z,this.type)}K.isPointLightShadow!==!0&&this.type===Ps&&M(K,y),K.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(A,P,F)};function M(w,I){let y=t.update(v);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new tn(i.x,i.y,{format:Ri,type:Dn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value.set(w.map.width,w.map.height),u.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(I,null,y,u,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(I,null,y,f,v,null)}function E(w,I,y,A){let P=null,F=y.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(F!==void 0)P=F;else if(P=y.isPointLight===!0?l:a,s.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let B=P.uuid,G=I.uuid,U=c[B];U===void 0&&(U={},c[B]=U);let k=U[G];k===void 0&&(k=P.clone(),U[G]=k,I.addEventListener("dispose",b)),P=k}if(P.visible=I.visible,P.wireframe=I.wireframe,A===Ps?P.side=I.shadowSide!==null?I.shadowSide:I.side:P.side=I.shadowSide!==null?I.shadowSide:d[I.side],P.alphaMap=I.alphaMap,P.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,P.map=I.map,P.clipShadows=I.clipShadows,P.clippingPlanes=I.clippingPlanes,P.clipIntersection=I.clipIntersection,P.displacementMap=I.displacementMap,P.displacementScale=I.displacementScale,P.displacementBias=I.displacementBias,P.wireframeLinewidth=I.wireframeLinewidth,P.linewidth=I.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let B=s.properties.get(P);B.light=y}return P}function _(w,I,y,A,P){if(w.visible===!1)return;if(w.layers.test(I.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&P===Ps)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,w.matrixWorld);let G=t.update(w),U=w.material;if(Array.isArray(U)){let k=G.groups;for(let Z=0,K=k.length;Z<K;Z++){let at=k[Z],$=U[at.materialIndex];if($&&$.visible){let et=E(w,$,A,P);w.onBeforeShadow(s,w,I,y,G,et,at),s.renderBufferDirect(y,null,G,et,w,at),w.onAfterShadow(s,w,I,y,G,et,at)}}}else if(U.visible){let k=E(w,U,A,P);w.onBeforeShadow(s,w,I,y,G,k,null),s.renderBufferDirect(y,null,G,k,w,null),w.onAfterShadow(s,w,I,y,G,k,null)}}let B=w.children;for(let G=0,U=B.length;G<U;G++)_(B[G],I,y,A,P)}function b(w){w.target.removeEventListener("dispose",b);for(let y in c){let A=c[y],P=w.target.uuid;P in A&&(A[P].dispose(),delete A[P])}}}function Yx(s,t){function e(){let D=!1,_t=new Te,nt=null,yt=new Te(0,0,0,0);return{setMask:function(bt){nt!==bt&&!D&&(s.colorMask(bt,bt,bt,bt),nt=bt)},setLocked:function(bt){D=bt},setClear:function(bt,ot,Ft,Rt,ge){ge===!0&&(bt*=Rt,ot*=Rt,Ft*=Rt),_t.set(bt,ot,Ft,Rt),yt.equals(_t)===!1&&(s.clearColor(bt,ot,Ft,Rt),yt.copy(_t))},reset:function(){D=!1,nt=null,yt.set(-1,0,0,0)}}}function n(){let D=!1,_t=!1,nt=null,yt=null,bt=null;return{setReversed:function(ot){if(_t!==ot){let Ft=t.get("EXT_clip_control");ot?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),_t=ot;let Rt=bt;bt=null,this.setClear(Rt)}},getReversed:function(){return _t},setTest:function(ot){ot?j(s.DEPTH_TEST):vt(s.DEPTH_TEST)},setMask:function(ot){nt!==ot&&!D&&(s.depthMask(ot),nt=ot)},setFunc:function(ot){if(_t&&(ot=Lu[ot]),yt!==ot){switch(ot){case To:s.depthFunc(s.NEVER);break;case Eo:s.depthFunc(s.ALWAYS);break;case Ao:s.depthFunc(s.LESS);break;case gs:s.depthFunc(s.LEQUAL);break;case Ro:s.depthFunc(s.EQUAL);break;case Co:s.depthFunc(s.GEQUAL);break;case Io:s.depthFunc(s.GREATER);break;case Po:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}yt=ot}},setLocked:function(ot){D=ot},setClear:function(ot){bt!==ot&&(bt=ot,_t&&(ot=1-ot),s.clearDepth(ot))},reset:function(){D=!1,nt=null,yt=null,bt=null,_t=!1}}}function i(){let D=!1,_t=null,nt=null,yt=null,bt=null,ot=null,Ft=null,Rt=null,ge=null;return{setTest:function(ce){D||(ce?j(s.STENCIL_TEST):vt(s.STENCIL_TEST))},setMask:function(ce){_t!==ce&&!D&&(s.stencilMask(ce),_t=ce)},setFunc:function(ce,pn,Un){(nt!==ce||yt!==pn||bt!==Un)&&(s.stencilFunc(ce,pn,Un),nt=ce,yt=pn,bt=Un)},setOp:function(ce,pn,Un){(ot!==ce||Ft!==pn||Rt!==Un)&&(s.stencilOp(ce,pn,Un),ot=ce,Ft=pn,Rt=Un)},setLocked:function(ce){D=ce},setClear:function(ce){ge!==ce&&(s.clearStencil(ce),ge=ce)},reset:function(){D=!1,_t=null,nt=null,yt=null,bt=null,ot=null,Ft=null,Rt=null,ge=null}}}let r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,g=[],v=null,m=!1,p=null,M=null,E=null,_=null,b=null,w=null,I=null,y=new $t(0,0,0),A=0,P=!1,F=null,B=null,G=null,U=null,k=null,Z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,at=0,$=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(at=parseFloat(/^WebGL (\d)/.exec($)[1]),K=at>=1):$.indexOf("OpenGL ES")!==-1&&(at=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),K=at>=2);let et=null,rt={},Nt=s.getParameter(s.SCISSOR_BOX),Ct=s.getParameter(s.VIEWPORT),le=new Te().fromArray(Nt),Kt=new Te().fromArray(Ct);function te(D,_t,nt,yt){let bt=new Uint8Array(4),ot=s.createTexture();s.bindTexture(D,ot),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ft=0;Ft<nt;Ft++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(_t,0,s.RGBA,1,1,yt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(_t+Ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return ot}let tt={};tt[s.TEXTURE_2D]=te(s.TEXTURE_2D,s.TEXTURE_2D,1),tt[s.TEXTURE_CUBE_MAP]=te(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),tt[s.TEXTURE_2D_ARRAY]=te(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),tt[s.TEXTURE_3D]=te(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(s.DEPTH_TEST),o.setFunc(gs),dt(!1),gt(oc),j(s.CULL_FACE),lt(Xn);function j(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function vt(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function Ht(D,_t){return u[D]!==_t?(s.bindFramebuffer(D,_t),u[D]=_t,D===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=_t),D===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=_t),!0):!1}function At(D,_t){let nt=g,yt=!1;if(D){nt=f.get(_t),nt===void 0&&(nt=[],f.set(_t,nt));let bt=D.textures;if(nt.length!==bt.length||nt[0]!==s.COLOR_ATTACHMENT0){for(let ot=0,Ft=bt.length;ot<Ft;ot++)nt[ot]=s.COLOR_ATTACHMENT0+ot;nt.length=bt.length,yt=!0}}else nt[0]!==s.BACK&&(nt[0]=s.BACK,yt=!0);yt&&s.drawBuffers(nt)}function Vt(D){return v!==D?(s.useProgram(D),v=D,!0):!1}let ee={[Gi]:s.FUNC_ADD,[tu]:s.FUNC_SUBTRACT,[eu]:s.FUNC_REVERSE_SUBTRACT};ee[nu]=s.MIN,ee[iu]=s.MAX;let st={[su]:s.ZERO,[ru]:s.ONE,[ou]:s.SRC_COLOR,[cc]:s.SRC_ALPHA,[du]:s.SRC_ALPHA_SATURATE,[hu]:s.DST_COLOR,[lu]:s.DST_ALPHA,[au]:s.ONE_MINUS_SRC_COLOR,[hc]:s.ONE_MINUS_SRC_ALPHA,[uu]:s.ONE_MINUS_DST_COLOR,[cu]:s.ONE_MINUS_DST_ALPHA,[fu]:s.CONSTANT_COLOR,[pu]:s.ONE_MINUS_CONSTANT_COLOR,[mu]:s.CONSTANT_ALPHA,[gu]:s.ONE_MINUS_CONSTANT_ALPHA};function lt(D,_t,nt,yt,bt,ot,Ft,Rt,ge,ce){if(D===Xn){m===!0&&(vt(s.BLEND),m=!1);return}if(m===!1&&(j(s.BLEND),m=!0),D!==jh){if(D!==p||ce!==P){if((M!==Gi||b!==Gi)&&(s.blendEquation(s.FUNC_ADD),M=Gi,b=Gi),ce)switch(D){case Ls:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case si:s.blendFunc(s.ONE,s.ONE);break;case ac:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case lc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Gt("WebGLState: Invalid blending: ",D);break}else switch(D){case Ls:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case si:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ac:Gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case lc:Gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Gt("WebGLState: Invalid blending: ",D);break}E=null,_=null,w=null,I=null,y.set(0,0,0),A=0,p=D,P=ce}return}bt=bt||_t,ot=ot||nt,Ft=Ft||yt,(_t!==M||bt!==b)&&(s.blendEquationSeparate(ee[_t],ee[bt]),M=_t,b=bt),(nt!==E||yt!==_||ot!==w||Ft!==I)&&(s.blendFuncSeparate(st[nt],st[yt],st[ot],st[Ft]),E=nt,_=yt,w=ot,I=Ft),(Rt.equals(y)===!1||ge!==A)&&(s.blendColor(Rt.r,Rt.g,Rt.b,ge),y.copy(Rt),A=ge),p=D,P=!1}function ut(D,_t){D.side===yn?vt(s.CULL_FACE):j(s.CULL_FACE);let nt=D.side===Qe;_t&&(nt=!nt),dt(nt),D.blending===Ls&&D.transparent===!1?lt(Xn):lt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let yt=D.stencilWrite;a.setTest(yt),yt&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),kt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?j(s.SAMPLE_ALPHA_TO_COVERAGE):vt(s.SAMPLE_ALPHA_TO_COVERAGE)}function dt(D){F!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),F=D)}function gt(D){D!==Jh?(j(s.CULL_FACE),D!==B&&(D===oc?s.cullFace(s.BACK):D===Kh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):vt(s.CULL_FACE),B=D}function zt(D){D!==G&&(K&&s.lineWidth(D),G=D)}function kt(D,_t,nt){D?(j(s.POLYGON_OFFSET_FILL),(U!==_t||k!==nt)&&(U=_t,k=nt,o.getReversed()&&(_t=-_t),s.polygonOffset(_t,nt))):vt(s.POLYGON_OFFSET_FILL)}function Wt(D){D?j(s.SCISSOR_TEST):vt(s.SCISSOR_TEST)}function qt(D){D===void 0&&(D=s.TEXTURE0+Z-1),et!==D&&(s.activeTexture(D),et=D)}function N(D,_t,nt){nt===void 0&&(et===null?nt=s.TEXTURE0+Z-1:nt=et);let yt=rt[nt];yt===void 0&&(yt={type:void 0,texture:void 0},rt[nt]=yt),(yt.type!==D||yt.texture!==_t)&&(et!==nt&&(s.activeTexture(nt),et=nt),s.bindTexture(D,_t||tt[D]),yt.type=D,yt.texture=_t)}function de(){let D=rt[et];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ne(){try{s.compressedTexImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function x(){try{s.texSubImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function z(){try{s.texSubImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function V(){try{s.compressedTexSubImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function Q(){try{s.compressedTexSubImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function pt(){try{s.texStorage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function xt(){try{s.texStorage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function T(){try{s.texImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function C(){try{s.texImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function H(D){return d[D]!==void 0?d[D]:s.getParameter(D)}function q(D,_t){d[D]!==_t&&(s.pixelStorei(D,_t),d[D]=_t)}function Y(D){le.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),le.copy(D))}function it(D){Kt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),Kt.copy(D))}function ct(D,_t){let nt=c.get(_t);nt===void 0&&(nt=new WeakMap,c.set(_t,nt));let yt=nt.get(D);yt===void 0&&(yt=s.getUniformBlockIndex(_t,D.name),nt.set(D,yt))}function ht(D,_t){let yt=c.get(_t).get(D);l.get(_t)!==yt&&(s.uniformBlockBinding(_t,yt,D.__bindingPointIndex),l.set(_t,yt))}function Ut(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},et=null,rt={},u={},f=new WeakMap,g=[],v=null,m=!1,p=null,M=null,E=null,_=null,b=null,w=null,I=null,y=new $t(0,0,0),A=0,P=!1,F=null,B=null,G=null,U=null,k=null,le.set(0,0,s.canvas.width,s.canvas.height),Kt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:j,disable:vt,bindFramebuffer:Ht,drawBuffers:At,useProgram:Vt,setBlending:lt,setMaterial:ut,setFlipSided:dt,setCullFace:gt,setLineWidth:zt,setPolygonOffset:kt,setScissorTest:Wt,activeTexture:qt,bindTexture:N,unbindTexture:de,compressedTexImage2D:ne,compressedTexImage3D:R,texImage2D:T,texImage3D:C,pixelStorei:q,getParameter:H,updateUBOMapping:ct,uniformBlockBinding:ht,texStorage2D:pt,texStorage3D:xt,texSubImage2D:x,texSubImage3D:z,compressedTexSubImage2D:V,compressedTexSubImage3D:Q,scissor:Y,viewport:it,reset:Ut}}function Zx(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap,d=new Set,u,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,x){return g?new OffscreenCanvas(R,x):ir("canvas")}function m(R,x,z){let V=1,Q=ne(R);if((Q.width>z||Q.height>z)&&(V=z/Math.max(Q.width,Q.height)),V<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let pt=Math.floor(V*Q.width),xt=Math.floor(V*Q.height);u===void 0&&(u=v(pt,xt));let T=x?v(pt,xt):u;return T.width=pt,T.height=xt,T.getContext("2d").drawImage(R,0,0,pt,xt),Xt("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+pt+"x"+xt+")."),T}else return"data"in R&&Xt("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),R;return R}function p(R){return R.generateMipmaps}function M(R){s.generateMipmap(R)}function E(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(R,x,z,V,Q,pt=!1){if(R!==null){if(s[R]!==void 0)return s[R];Xt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let xt;V&&(xt=t.get("EXT_texture_norm16"),xt||Xt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let T=x;if(x===s.RED&&(z===s.FLOAT&&(T=s.R32F),z===s.HALF_FLOAT&&(T=s.R16F),z===s.UNSIGNED_BYTE&&(T=s.R8),z===s.UNSIGNED_SHORT&&xt&&(T=xt.R16_EXT),z===s.SHORT&&xt&&(T=xt.R16_SNORM_EXT)),x===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(T=s.R8UI),z===s.UNSIGNED_SHORT&&(T=s.R16UI),z===s.UNSIGNED_INT&&(T=s.R32UI),z===s.BYTE&&(T=s.R8I),z===s.SHORT&&(T=s.R16I),z===s.INT&&(T=s.R32I)),x===s.RG&&(z===s.FLOAT&&(T=s.RG32F),z===s.HALF_FLOAT&&(T=s.RG16F),z===s.UNSIGNED_BYTE&&(T=s.RG8),z===s.UNSIGNED_SHORT&&xt&&(T=xt.RG16_EXT),z===s.SHORT&&xt&&(T=xt.RG16_SNORM_EXT)),x===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(T=s.RG8UI),z===s.UNSIGNED_SHORT&&(T=s.RG16UI),z===s.UNSIGNED_INT&&(T=s.RG32UI),z===s.BYTE&&(T=s.RG8I),z===s.SHORT&&(T=s.RG16I),z===s.INT&&(T=s.RG32I)),x===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(T=s.RGB8UI),z===s.UNSIGNED_SHORT&&(T=s.RGB16UI),z===s.UNSIGNED_INT&&(T=s.RGB32UI),z===s.BYTE&&(T=s.RGB8I),z===s.SHORT&&(T=s.RGB16I),z===s.INT&&(T=s.RGB32I)),x===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(T=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(T=s.RGBA16UI),z===s.UNSIGNED_INT&&(T=s.RGBA32UI),z===s.BYTE&&(T=s.RGBA8I),z===s.SHORT&&(T=s.RGBA16I),z===s.INT&&(T=s.RGBA32I)),x===s.RGB&&(z===s.UNSIGNED_SHORT&&xt&&(T=xt.RGB16_EXT),z===s.SHORT&&xt&&(T=xt.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(T=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(T=s.R11F_G11F_B10F)),x===s.RGBA){let C=pt?nr:oe.getTransfer(Q);z===s.FLOAT&&(T=s.RGBA32F),z===s.HALF_FLOAT&&(T=s.RGBA16F),z===s.UNSIGNED_BYTE&&(T=C===me?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&xt&&(T=xt.RGBA16_EXT),z===s.SHORT&&xt&&(T=xt.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(T=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(T=s.RGB5_A1)}return(T===s.R16F||T===s.R32F||T===s.RG16F||T===s.RG32F||T===s.RGBA16F||T===s.RGBA32F)&&t.get("EXT_color_buffer_float"),T}function b(R,x){let z;return R?x===null||x===Ln||x===Ns?z=s.DEPTH24_STENCIL8:x===vn?z=s.DEPTH32F_STENCIL8:x===Ds&&(z=s.DEPTH24_STENCIL8,Xt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Ln||x===Ns?z=s.DEPTH_COMPONENT24:x===vn?z=s.DEPTH_COMPONENT32F:x===Ds&&(z=s.DEPTH_COMPONENT16),z}function w(R,x){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==De&&R.minFilter!==Ve?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function I(R){let x=R.target;x.removeEventListener("dispose",I),A(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function y(R){let x=R.target;x.removeEventListener("dispose",y),F(x)}function A(R){let x=n.get(R);if(x.__webglInit===void 0)return;let z=R.source,V=f.get(z);if(V){let Q=V[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&P(R),Object.keys(V).length===0&&f.delete(z)}n.remove(R)}function P(R){let x=n.get(R);s.deleteTexture(x.__webglTexture);let z=R.source,V=f.get(z);delete V[x.__cacheKey],o.memory.textures--}function F(R){let x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(x.__webglFramebuffer[V]))for(let Q=0;Q<x.__webglFramebuffer[V].length;Q++)s.deleteFramebuffer(x.__webglFramebuffer[V][Q]);else s.deleteFramebuffer(x.__webglFramebuffer[V]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[V])}else{if(Array.isArray(x.__webglFramebuffer))for(let V=0;V<x.__webglFramebuffer.length;V++)s.deleteFramebuffer(x.__webglFramebuffer[V]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let V=0;V<x.__webglColorRenderbuffer.length;V++)x.__webglColorRenderbuffer[V]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[V]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let z=R.textures;for(let V=0,Q=z.length;V<Q;V++){let pt=n.get(z[V]);pt.__webglTexture&&(s.deleteTexture(pt.__webglTexture),o.memory.textures--),n.remove(z[V])}n.remove(R)}let B=0;function G(){B=0}function U(){return B}function k(R){B=R}function Z(){let R=B;return R>=i.maxTextures&&Xt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+i.maxTextures),B+=1,R}function K(R){let x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function at(R,x){let z=n.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){let V=R.image;if(V===null)Xt("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Xt("WebGLRenderer: Texture marked for update but image is incomplete");else{vt(z,R,x);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+x)}function $(R,x){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){vt(z,R,x);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+x)}function et(R,x){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){vt(z,R,x);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+x)}function rt(R,x){let z=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){Ht(z,R,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+x)}let Nt={[xs]:s.REPEAT,[kn]:s.CLAMP_TO_EDGE,[Lo]:s.MIRRORED_REPEAT},Ct={[De]:s.NEAREST,[yu]:s.NEAREST_MIPMAP_NEAREST,[Wi]:s.NEAREST_MIPMAP_LINEAR,[Ve]:s.LINEAR,[ha]:s.LINEAR_MIPMAP_NEAREST,[Ei]:s.LINEAR_MIPMAP_LINEAR},le={[bu]:s.NEVER,[Ru]:s.ALWAYS,[wu]:s.LESS,[$a]:s.LEQUAL,[Tu]:s.EQUAL,[Ja]:s.GEQUAL,[Eu]:s.GREATER,[Au]:s.NOTEQUAL};function Kt(R,x){if(x.type===vn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ve||x.magFilter===ha||x.magFilter===Wi||x.magFilter===Ei||x.minFilter===Ve||x.minFilter===ha||x.minFilter===Wi||x.minFilter===Ei)&&Xt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,Nt[x.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,Nt[x.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,Nt[x.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,Ct[x.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,Ct[x.minFilter]),x.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,le[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===De||x.minFilter!==Wi&&x.minFilter!==Ei||x.type===vn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function te(R,x){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",I));let V=x.source,Q=f.get(V);Q===void 0&&(Q={},f.set(V,Q));let pt=K(x);if(pt!==R.__cacheKey){Q[pt]===void 0&&(Q[pt]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),Q[pt].usedTimes++;let xt=Q[R.__cacheKey];xt!==void 0&&(Q[R.__cacheKey].usedTimes--,xt.usedTimes===0&&P(x)),R.__cacheKey=pt,R.__webglTexture=Q[pt].texture}return z}function tt(R,x,z){return Math.floor(Math.floor(R/z)/x)}function j(R,x,z,V){let pt=R.updateRanges;if(pt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,z,V,x.data);else{pt.sort((q,Y)=>q.start-Y.start);let xt=0;for(let q=1;q<pt.length;q++){let Y=pt[xt],it=pt[q],ct=Y.start+Y.count,ht=tt(it.start,x.width,4),Ut=tt(Y.start,x.width,4);it.start<=ct+1&&ht===Ut&&tt(it.start+it.count-1,x.width,4)===ht?Y.count=Math.max(Y.count,it.start+it.count-Y.start):(++xt,pt[xt]=it)}pt.length=xt+1;let T=e.getParameter(s.UNPACK_ROW_LENGTH),C=e.getParameter(s.UNPACK_SKIP_PIXELS),H=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let q=0,Y=pt.length;q<Y;q++){let it=pt[q],ct=Math.floor(it.start/4),ht=Math.ceil(it.count/4),Ut=ct%x.width,D=Math.floor(ct/x.width),_t=ht,nt=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Ut),e.pixelStorei(s.UNPACK_SKIP_ROWS,D),e.texSubImage2D(s.TEXTURE_2D,0,Ut,D,_t,nt,z,V,x.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,T),e.pixelStorei(s.UNPACK_SKIP_PIXELS,C),e.pixelStorei(s.UNPACK_SKIP_ROWS,H)}}function vt(R,x,z){let V=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(V=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(V=s.TEXTURE_3D);let Q=te(R,x),pt=x.source;e.bindTexture(V,R.__webglTexture,s.TEXTURE0+z);let xt=n.get(pt);if(pt.version!==xt.__version||Q===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let nt=oe.getPrimaries(oe.workingColorSpace),yt=x.colorSpace===ri?null:oe.getPrimaries(x.colorSpace),bt=x.colorSpace===ri||nt===yt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment);let C=m(x.image,!1,i.maxTextureSize);C=de(x,C);let H=r.convert(x.format,x.colorSpace),q=r.convert(x.type),Y=_(x.internalFormat,H,q,x.normalized,x.colorSpace,x.isVideoTexture);Kt(V,x);let it,ct=x.mipmaps,ht=x.isVideoTexture!==!0,Ut=xt.__version===void 0||Q===!0,D=pt.dataReady,_t=w(x,C);if(x.isDepthTexture)Y=b(x.format===Ai,x.type),Ut&&(ht?e.texStorage2D(s.TEXTURE_2D,1,Y,C.width,C.height):e.texImage2D(s.TEXTURE_2D,0,Y,C.width,C.height,0,H,q,null));else if(x.isDataTexture)if(ct.length>0){ht&&Ut&&e.texStorage2D(s.TEXTURE_2D,_t,Y,ct[0].width,ct[0].height);for(let nt=0,yt=ct.length;nt<yt;nt++)it=ct[nt],ht?D&&e.texSubImage2D(s.TEXTURE_2D,nt,0,0,it.width,it.height,H,q,it.data):e.texImage2D(s.TEXTURE_2D,nt,Y,it.width,it.height,0,H,q,it.data);x.generateMipmaps=!1}else ht?(Ut&&e.texStorage2D(s.TEXTURE_2D,_t,Y,C.width,C.height),D&&j(x,C,H,q)):e.texImage2D(s.TEXTURE_2D,0,Y,C.width,C.height,0,H,q,C.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ht&&Ut&&e.texStorage3D(s.TEXTURE_2D_ARRAY,_t,Y,ct[0].width,ct[0].height,C.depth);for(let nt=0,yt=ct.length;nt<yt;nt++)if(it=ct[nt],x.format!==Mn)if(H!==null)if(ht){if(D)if(x.layerUpdates.size>0){let bt=Pc(it.width,it.height,x.format,x.type);for(let ot of x.layerUpdates){let Ft=it.data.subarray(ot*bt/it.data.BYTES_PER_ELEMENT,(ot+1)*bt/it.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,ot,it.width,it.height,1,H,Ft)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,0,it.width,it.height,C.depth,H,it.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,nt,Y,it.width,it.height,C.depth,0,it.data,0,0);else Xt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ht?D&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,0,it.width,it.height,C.depth,H,q,it.data):e.texImage3D(s.TEXTURE_2D_ARRAY,nt,Y,it.width,it.height,C.depth,0,H,q,it.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{ht&&Ut&&e.texStorage2D(s.TEXTURE_2D,_t,Y,ct[0].width,ct[0].height);for(let nt=0,yt=ct.length;nt<yt;nt++)it=ct[nt],x.format!==Mn?H!==null?ht?D&&e.compressedTexSubImage2D(s.TEXTURE_2D,nt,0,0,it.width,it.height,H,it.data):e.compressedTexImage2D(s.TEXTURE_2D,nt,Y,it.width,it.height,0,it.data):Xt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ht?D&&e.texSubImage2D(s.TEXTURE_2D,nt,0,0,it.width,it.height,H,q,it.data):e.texImage2D(s.TEXTURE_2D,nt,Y,it.width,it.height,0,H,q,it.data)}else if(x.isDataArrayTexture)if(ht){if(Ut&&e.texStorage3D(s.TEXTURE_2D_ARRAY,_t,Y,C.width,C.height,C.depth),D)if(x.layerUpdates.size>0){let nt=Pc(C.width,C.height,x.format,x.type);for(let yt of x.layerUpdates){let bt=C.data.subarray(yt*nt/C.data.BYTES_PER_ELEMENT,(yt+1)*nt/C.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,yt,C.width,C.height,1,H,q,bt)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,C.width,C.height,C.depth,H,q,C.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Y,C.width,C.height,C.depth,0,H,q,C.data);else if(x.isData3DTexture)ht?(Ut&&e.texStorage3D(s.TEXTURE_3D,_t,Y,C.width,C.height,C.depth),D&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,C.width,C.height,C.depth,H,q,C.data)):e.texImage3D(s.TEXTURE_3D,0,Y,C.width,C.height,C.depth,0,H,q,C.data);else if(x.isFramebufferTexture){if(Ut)if(ht)e.texStorage2D(s.TEXTURE_2D,_t,Y,C.width,C.height);else{let nt=C.width,yt=C.height;for(let bt=0;bt<_t;bt++)e.texImage2D(s.TEXTURE_2D,bt,Y,nt,yt,0,H,q,null),nt>>=1,yt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in s){let nt=s.canvas;if(nt.hasAttribute("layoutsubtree")||nt.setAttribute("layoutsubtree","true"),C.parentNode!==nt){nt.appendChild(C),d.add(x),nt.onpaint=yt=>{let bt=yt.changedElements;for(let ot of d)bt.includes(ot.image)&&(ot.needsUpdate=!0)},nt.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,C);else{let bt=s.RGBA,ot=s.RGBA,Ft=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,bt,ot,Ft,C)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ct.length>0){if(ht&&Ut){let nt=ne(ct[0]);e.texStorage2D(s.TEXTURE_2D,_t,Y,nt.width,nt.height)}for(let nt=0,yt=ct.length;nt<yt;nt++)it=ct[nt],ht?D&&e.texSubImage2D(s.TEXTURE_2D,nt,0,0,H,q,it):e.texImage2D(s.TEXTURE_2D,nt,Y,H,q,it);x.generateMipmaps=!1}else if(ht){if(Ut){let nt=ne(C);e.texStorage2D(s.TEXTURE_2D,_t,Y,nt.width,nt.height)}D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,H,q,C)}else e.texImage2D(s.TEXTURE_2D,0,Y,H,q,C);p(x)&&M(V),xt.__version=pt.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Ht(R,x,z){if(x.image.length!==6)return;let V=te(R,x),Q=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+z);let pt=n.get(Q);if(Q.version!==pt.__version||V===!0){e.activeTexture(s.TEXTURE0+z);let xt=oe.getPrimaries(oe.workingColorSpace),T=x.colorSpace===ri?null:oe.getPrimaries(x.colorSpace),C=x.colorSpace===ri||xt===T?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,C);let H=x.isCompressedTexture||x.image[0].isCompressedTexture,q=x.image[0]&&x.image[0].isDataTexture,Y=[];for(let ot=0;ot<6;ot++)!H&&!q?Y[ot]=m(x.image[ot],!0,i.maxCubemapSize):Y[ot]=q?x.image[ot].image:x.image[ot],Y[ot]=de(x,Y[ot]);let it=Y[0],ct=r.convert(x.format,x.colorSpace),ht=r.convert(x.type),Ut=_(x.internalFormat,ct,ht,x.normalized,x.colorSpace),D=x.isVideoTexture!==!0,_t=pt.__version===void 0||V===!0,nt=Q.dataReady,yt=w(x,it);Kt(s.TEXTURE_CUBE_MAP,x);let bt;if(H){D&&_t&&e.texStorage2D(s.TEXTURE_CUBE_MAP,yt,Ut,it.width,it.height);for(let ot=0;ot<6;ot++){bt=Y[ot].mipmaps;for(let Ft=0;Ft<bt.length;Ft++){let Rt=bt[Ft];x.format!==Mn?ct!==null?D?nt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,0,0,Rt.width,Rt.height,ct,Rt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,Ut,Rt.width,Rt.height,0,Rt.data):Xt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?nt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,0,0,Rt.width,Rt.height,ct,ht,Rt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft,Ut,Rt.width,Rt.height,0,ct,ht,Rt.data)}}}else{if(bt=x.mipmaps,D&&_t){bt.length>0&&yt++;let ot=ne(Y[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,yt,Ut,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(q){D?nt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Y[ot].width,Y[ot].height,ct,ht,Y[ot].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Ut,Y[ot].width,Y[ot].height,0,ct,ht,Y[ot].data);for(let Ft=0;Ft<bt.length;Ft++){let ge=bt[Ft].image[ot].image;D?nt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,0,0,ge.width,ge.height,ct,ht,ge.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,Ut,ge.width,ge.height,0,ct,ht,ge.data)}}else{D?nt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,ct,ht,Y[ot]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Ut,ct,ht,Y[ot]);for(let Ft=0;Ft<bt.length;Ft++){let Rt=bt[Ft];D?nt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,0,0,ct,ht,Rt.image[ot]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Ft+1,Ut,ct,ht,Rt.image[ot])}}}p(x)&&M(s.TEXTURE_CUBE_MAP),pt.__version=Q.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function At(R,x,z,V,Q,pt){let xt=r.convert(z.format,z.colorSpace),T=r.convert(z.type),C=_(z.internalFormat,xt,T,z.normalized,z.colorSpace),H=n.get(x),q=n.get(z);if(q.__renderTarget=x,!H.__hasExternalTextures){let Y=Math.max(1,x.width>>pt),it=Math.max(1,x.height>>pt);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,pt,C,Y,it,x.depth,0,xt,T,null):e.texImage2D(Q,pt,C,Y,it,0,xt,T,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),qt(x)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,V,Q,q.__webglTexture,0,Wt(x)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,V,Q,q.__webglTexture,pt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(R,x,z){if(s.bindRenderbuffer(s.RENDERBUFFER,R),x.depthBuffer){let V=x.depthTexture,Q=V&&V.isDepthTexture?V.type:null,pt=b(x.stencilBuffer,Q),xt=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;qt(x)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Wt(x),pt,x.width,x.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt(x),pt,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,pt,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,xt,s.RENDERBUFFER,R)}else{let V=x.textures;for(let Q=0;Q<V.length;Q++){let pt=V[Q],xt=r.convert(pt.format,pt.colorSpace),T=r.convert(pt.type),C=_(pt.internalFormat,xt,T,pt.normalized,pt.colorSpace);qt(x)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Wt(x),C,x.width,x.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt(x),C,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,C,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ee(R,x,z){let V=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Q=n.get(x.depthTexture);if(Q.__renderTarget=x,(!Q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),V){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,x.depthTexture.addEventListener("dispose",I)),Q.__webglTexture===void 0){Q.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,Q.__webglTexture),Kt(s.TEXTURE_CUBE_MAP,x.depthTexture);let H=r.convert(x.depthTexture.format),q=r.convert(x.depthTexture.type),Y;x.depthTexture.format===Hn?Y=s.DEPTH_COMPONENT24:x.depthTexture.format===Ai&&(Y=s.DEPTH24_STENCIL8);for(let it=0;it<6;it++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Y,x.width,x.height,0,H,q,null)}}else at(x.depthTexture,0);let pt=Q.__webglTexture,xt=Wt(x),T=V?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,C=x.depthTexture.format===Ai?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(x.depthTexture.format===Hn)qt(x)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,C,T,pt,0,xt):s.framebufferTexture2D(s.FRAMEBUFFER,C,T,pt,0);else if(x.depthTexture.format===Ai)qt(x)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,C,T,pt,0,xt):s.framebufferTexture2D(s.FRAMEBUFFER,C,T,pt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function st(R){let x=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){let V=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),V){let Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,V.removeEventListener("dispose",Q)};V.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=V}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let V=0;V<6;V++)ee(x.__webglFramebuffer[V],R,V);else{let V=R.texture.mipmaps;V&&V.length>0?ee(x.__webglFramebuffer[0],R,0):ee(x.__webglFramebuffer,R,0)}else if(z){x.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[V]),x.__webglDepthbuffer[V]===void 0)x.__webglDepthbuffer[V]=s.createRenderbuffer(),Vt(x.__webglDepthbuffer[V],R,!1);else{let Q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=x.__webglDepthbuffer[V];s.bindRenderbuffer(s.RENDERBUFFER,pt),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,pt)}}else{let V=R.texture.mipmaps;if(V&&V.length>0?e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),Vt(x.__webglDepthbuffer,R,!1);else{let Q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,pt),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,pt)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function lt(R,x,z){let V=n.get(R);x!==void 0&&At(V.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&st(R)}function ut(R){let x=R.texture,z=n.get(R),V=n.get(x);R.addEventListener("dispose",y);let Q=R.textures,pt=R.isWebGLCubeRenderTarget===!0,xt=Q.length>1;if(xt||(V.__webglTexture===void 0&&(V.__webglTexture=s.createTexture()),V.__version=x.version,o.memory.textures++),pt){z.__webglFramebuffer=[];for(let T=0;T<6;T++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[T]=[];for(let C=0;C<x.mipmaps.length;C++)z.__webglFramebuffer[T][C]=s.createFramebuffer()}else z.__webglFramebuffer[T]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let T=0;T<x.mipmaps.length;T++)z.__webglFramebuffer[T]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(xt)for(let T=0,C=Q.length;T<C;T++){let H=n.get(Q[T]);H.__webglTexture===void 0&&(H.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&qt(R)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let T=0;T<Q.length;T++){let C=Q[T];z.__webglColorRenderbuffer[T]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[T]);let H=r.convert(C.format,C.colorSpace),q=r.convert(C.type),Y=_(C.internalFormat,H,q,C.normalized,C.colorSpace,R.isXRRenderTarget===!0),it=Wt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,it,Y,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+T,s.RENDERBUFFER,z.__webglColorRenderbuffer[T])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Vt(z.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(pt){e.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture),Kt(s.TEXTURE_CUBE_MAP,x);for(let T=0;T<6;T++)if(x.mipmaps&&x.mipmaps.length>0)for(let C=0;C<x.mipmaps.length;C++)At(z.__webglFramebuffer[T][C],R,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+T,C);else At(z.__webglFramebuffer[T],R,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+T,0);p(x)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(xt){for(let T=0,C=Q.length;T<C;T++){let H=Q[T],q=n.get(H),Y=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Y=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Y,q.__webglTexture),Kt(Y,H),At(z.__webglFramebuffer,R,H,s.COLOR_ATTACHMENT0+T,Y,0),p(H)&&M(Y)}e.unbindTexture()}else{let T=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(T=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(T,V.__webglTexture),Kt(T,x),x.mipmaps&&x.mipmaps.length>0)for(let C=0;C<x.mipmaps.length;C++)At(z.__webglFramebuffer[C],R,x,s.COLOR_ATTACHMENT0,T,C);else At(z.__webglFramebuffer,R,x,s.COLOR_ATTACHMENT0,T,0);p(x)&&M(T),e.unbindTexture()}R.depthBuffer&&st(R)}function dt(R){let x=R.textures;for(let z=0,V=x.length;z<V;z++){let Q=x[z];if(p(Q)){let pt=E(R),xt=n.get(Q).__webglTexture;e.bindTexture(pt,xt),M(pt),e.unbindTexture()}}}let gt=[],zt=[];function kt(R){if(R.samples>0){if(qt(R)===!1){let x=R.textures,z=R.width,V=R.height,Q=s.COLOR_BUFFER_BIT,pt=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xt=n.get(R),T=x.length>1;if(T)for(let H=0;H<x.length;H++)e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+H,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+H,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer);let C=R.texture.mipmaps;C&&C.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,xt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let H=0;H<x.length;H++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),T){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,xt.__webglColorRenderbuffer[H]);let q=n.get(x[H]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,q,0)}s.blitFramebuffer(0,0,z,V,0,0,z,V,Q,s.NEAREST),l===!0&&(gt.length=0,zt.length=0,gt.push(s.COLOR_ATTACHMENT0+H),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(gt.push(pt),zt.push(pt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,zt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,gt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),T)for(let H=0;H<x.length;H++){e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+H,s.RENDERBUFFER,xt.__webglColorRenderbuffer[H]);let q=n.get(x[H]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+H,s.TEXTURE_2D,q,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let x=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function Wt(R){return Math.min(i.maxSamples,R.samples)}function qt(R){let x=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(R){let x=o.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function de(R,x){let z=R.colorSpace,V=R.format,Q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==er&&z!==ri&&(oe.getTransfer(z)===me?(V!==Mn||Q!==nn)&&Xt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Gt("WebGLTextures: Unsupported texture color space:",z)),x}function ne(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=Z,this.resetTextureUnits=G,this.getTextureUnits=U,this.setTextureUnits=k,this.setTexture2D=at,this.setTexture2DArray=$,this.setTexture3D=et,this.setTextureCube=rt,this.rebindTextures=lt,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=dt,this.updateMultisampleRenderTarget=kt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=At,this.useMultisampledRTT=qt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function $x(s,t){function e(n,i=ri){let r,o=oe.getTransfer(i);if(n===nn)return s.UNSIGNED_BYTE;if(n===da)return s.UNSIGNED_SHORT_4_4_4_4;if(n===fa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Mc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Sc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===yc)return s.BYTE;if(n===vc)return s.SHORT;if(n===Ds)return s.UNSIGNED_SHORT;if(n===ua)return s.INT;if(n===Ln)return s.UNSIGNED_INT;if(n===vn)return s.FLOAT;if(n===Dn)return s.HALF_FLOAT;if(n===bc)return s.ALPHA;if(n===wc)return s.RGB;if(n===Mn)return s.RGBA;if(n===Hn)return s.DEPTH_COMPONENT;if(n===Ai)return s.DEPTH_STENCIL;if(n===pa)return s.RED;if(n===ma)return s.RED_INTEGER;if(n===Ri)return s.RG;if(n===ga)return s.RG_INTEGER;if(n===xa)return s.RGBA_INTEGER;if(n===Or||n===Br||n===kr||n===zr)if(o===me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Or)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Or)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===zr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_a||n===ya||n===va||n===Ma)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===_a)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ya)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===va)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ma)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Sa||n===ba||n===wa||n===Ta||n===Ea||n===Hr||n===Aa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Sa||n===ba)return o===me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===wa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ta)return r.COMPRESSED_R11_EAC;if(n===Ea)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Hr)return r.COMPRESSED_RG11_EAC;if(n===Aa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ra||n===Ca||n===Ia||n===Pa||n===La||n===Da||n===Na||n===Ua||n===Fa||n===Oa||n===Ba||n===ka||n===za||n===Ha)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ra)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ca)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ia)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Pa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===La)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Da)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Na)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ua)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Fa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Oa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ba)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ka)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===za)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ha)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ga||n===Va||n===Wa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ga)return o===me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Va)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Wa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xa||n===qa||n===Gr||n===Ya)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===qa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Gr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ya)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ns?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var Jx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Kx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Jc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new xr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new un({vertexShader:Jx,fragmentShader:Kx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Et(new In(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Kc=class extends Gn{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null,v=typeof XRWebGLBinding<"u",m=new Jc,p={},M=e.getContextAttributes(),E=null,_=null,b=[],w=[],I=new ft,y=null,A=null,P=new Be;P.viewport=new Te;let F=new Be;F.viewport=new Te;let B=[P,F],G=new ra,U=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(tt){let j=b[tt];return j===void 0&&(j=new Ss,b[tt]=j),j.getTargetRaySpace()},this.getControllerGrip=function(tt){let j=b[tt];return j===void 0&&(j=new Ss,b[tt]=j),j.getGripSpace()},this.getHand=function(tt){let j=b[tt];return j===void 0&&(j=new Ss,b[tt]=j),j.getHandSpace()};function Z(tt){let j=w.indexOf(tt.inputSource);if(j===-1)return;let vt=b[j];vt!==void 0&&(vt.update(tt.inputSource,tt.frame,c||o),vt.dispatchEvent({type:tt.type,data:tt.inputSource}))}function K(){i.removeEventListener("select",Z),i.removeEventListener("selectstart",Z),i.removeEventListener("selectend",Z),i.removeEventListener("squeeze",Z),i.removeEventListener("squeezestart",Z),i.removeEventListener("squeezeend",Z),i.removeEventListener("end",K),i.removeEventListener("inputsourceschange",at);for(let tt=0;tt<b.length;tt++){let j=w[tt];j!==null&&(w[tt]=null,b[tt].disconnect(j))}U=null,k=null,m.reset();for(let tt in p)delete p[tt];if(t.setRenderTarget(E),f=null,u=null,d=null,i=null,_=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(I.width,I.height,!1),A!==null){let tt=A.camera;tt.fov=A.fov,tt.zoom=A.zoom,tt.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(tt){r=tt,n.isPresenting===!0&&Xt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(tt){a=tt,n.isPresenting===!0&&Xt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(tt){c=tt},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(tt){if(i=tt,i!==null){if(E=t.getRenderTarget(),i.addEventListener("select",Z),i.addEventListener("selectstart",Z),i.addEventListener("selectend",Z),i.addEventListener("squeeze",Z),i.addEventListener("squeezestart",Z),i.addEventListener("squeezeend",Z),i.addEventListener("end",K),i.addEventListener("inputsourceschange",at),M.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(I),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,Ht=null,At=null;M.depth&&(At=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=M.stencil?Ai:Hn,Ht=M.stencil?Ns:Ln);let Vt={colorFormat:e.RGBA8,depthFormat:At,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Vt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new tn(u.textureWidth,u.textureHeight,{format:Mn,type:nn,depthTexture:new _i(u.textureWidth,u.textureHeight,Ht,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let vt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,vt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new tn(f.framebufferWidth,f.framebufferHeight,{format:Mn,type:nn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),te.setContext(i),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function at(tt){for(let j=0;j<tt.removed.length;j++){let vt=tt.removed[j],Ht=w.indexOf(vt);Ht>=0&&(w[Ht]=null,b[Ht].disconnect(vt))}for(let j=0;j<tt.added.length;j++){let vt=tt.added[j],Ht=w.indexOf(vt);if(Ht===-1){for(let Vt=0;Vt<b.length;Vt++)if(Vt>=w.length){w.push(vt),Ht=Vt;break}else if(w[Vt]===null){w[Vt]=vt,Ht=Vt;break}if(Ht===-1)break}let At=b[Ht];At&&At.connect(vt)}}let $=new L,et=new L;function rt(tt,j,vt){$.setFromMatrixPosition(j.matrixWorld),et.setFromMatrixPosition(vt.matrixWorld);let Ht=$.distanceTo(et),At=j.projectionMatrix.elements,Vt=vt.projectionMatrix.elements,ee=At[14]/(At[10]-1),st=At[14]/(At[10]+1),lt=(At[9]+1)/At[5],ut=(At[9]-1)/At[5],dt=(At[8]-1)/At[0],gt=(Vt[8]+1)/Vt[0],zt=ee*dt,kt=ee*gt,Wt=Ht/(-dt+gt),qt=Wt*-dt;if(j.matrixWorld.decompose(tt.position,tt.quaternion,tt.scale),tt.translateX(qt),tt.translateZ(Wt),tt.matrixWorld.compose(tt.position,tt.quaternion,tt.scale),tt.matrixWorldInverse.copy(tt.matrixWorld).invert(),At[10]===-1)tt.projectionMatrix.copy(j.projectionMatrix),tt.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let N=ee+Wt,de=st+Wt,ne=zt-qt,R=kt+(Ht-qt),x=lt*st/de*N,z=ut*st/de*N;tt.projectionMatrix.makePerspective(ne,R,x,z,N,de),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert()}}function Nt(tt,j){j===null?tt.matrixWorld.copy(tt.matrix):tt.matrixWorld.multiplyMatrices(j.matrixWorld,tt.matrix),tt.matrixWorldInverse.copy(tt.matrixWorld).invert()}this.updateCamera=function(tt){if(i===null)return;let j=tt.near,vt=tt.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(vt=m.depthFar)),G.near=F.near=P.near=j,G.far=F.far=P.far=vt,(U!==G.near||k!==G.far)&&(i.updateRenderState({depthNear:G.near,depthFar:G.far}),U=G.near,k=G.far),G.layers.mask=tt.layers.mask|6,P.layers.mask=G.layers.mask&-5,F.layers.mask=G.layers.mask&-3;let Ht=tt.parent,At=G.cameras;Nt(G,Ht);for(let Vt=0;Vt<At.length;Vt++)Nt(At[Vt],Ht);At.length===2?rt(G,P,F):G.projectionMatrix.copy(P.projectionMatrix),A===null&&tt.isPerspectiveCamera&&(A={camera:tt,fov:tt.fov,zoom:tt.zoom}),Ct(tt,G,Ht)};function Ct(tt,j,vt){vt===null?tt.matrix.copy(j.matrixWorld):(tt.matrix.copy(vt.matrixWorld),tt.matrix.invert(),tt.matrix.multiply(j.matrixWorld)),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.updateMatrixWorld(!0),tt.projectionMatrix.copy(j.projectionMatrix),tt.projectionMatrixInverse.copy(j.projectionMatrixInverse),tt.isPerspectiveCamera&&(tt.fov=rr*2*Math.atan(1/tt.projectionMatrix.elements[5]),tt.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(tt){l=tt,u!==null&&(u.fixedFoveation=tt),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=tt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(G)},this.getCameraTexture=function(tt){return p[tt]};let le=null;function Kt(tt,j){if(h=j.getViewerPose(c||o),g=j,h!==null){let vt=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Ht=!1;vt.length!==G.cameras.length&&(G.cameras.length=0,Ht=!0);for(let st=0;st<vt.length;st++){let lt=vt[st],ut=null;if(f!==null)ut=f.getViewport(lt);else{let gt=d.getViewSubImage(u,lt);ut=gt.viewport,st===0&&(t.setRenderTargetTextures(_,gt.colorTexture,gt.depthStencilTexture),t.setRenderTarget(_))}let dt=B[st];dt===void 0&&(dt=new Be,dt.layers.enable(st),dt.viewport=new Te,B[st]=dt),dt.matrix.fromArray(lt.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(lt.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set(ut.x,ut.y,ut.width,ut.height),st===0&&(G.matrix.copy(dt.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Ht===!0&&G.cameras.push(dt)}let At=i.enabledFeatures;if(At&&At.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let st=d.getDepthInformation(vt[0]);st&&st.isValid&&st.texture&&m.init(st,i.renderState)}if(At&&At.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let st=0;st<vt.length;st++){let lt=vt[st].camera;if(lt){let ut=p[lt];ut||(ut=new xr,p[lt]=ut);let dt=d.getCameraImage(lt);ut.sourceTexture=dt}}}}for(let vt=0;vt<b.length;vt++){let Ht=w[vt],At=b[vt];Ht!==null&&At!==void 0&&At.update(Ht,j,c||o)}le&&le(tt,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}let te=new cd;te.setAnimationLoop(Kt),this.setAnimationLoop=function(tt){le=tt},this.dispose=function(){}}},Qx=new ae,md=new Zt;md.set(-1,0,0,0,1,0,0,0,1);function jx(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Rc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,E,_){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=t.get(p),E=M.envMap,_=M.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(Qx.makeRotationFromEuler(_)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(md),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=E*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Qe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){let M=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function t_(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,b){let w=b.program;n.uniformBlockBinding(_,w)}function c(_,b){let w=i[_.id];w===void 0&&(m(_),w=h(_),i[_.id]=w,_.addEventListener("dispose",M));let I=b.program;n.updateUBOMapping(_,I);let y=t.render.frame;r[_.id]!==y&&(u(_),r[_.id]=y)}function h(_){let b=d();_.__bindingPointIndex=b;let w=s.createBuffer(),I=_.__size,y=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,I,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,w),w}function d(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return Gt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){let b=i[_.id],w=_.uniforms,I=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let y=0,A=w.length;y<A;y++){let P=w[y];if(Array.isArray(P))for(let F=0,B=P.length;F<B;F++)f(P[F],y,F,I);else f(P,y,0,I)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(_,b,w,I){if(v(_,b,w,I)===!0){let y=_.__offset,A=_.value;if(Array.isArray(A)){let P=0;for(let F=0;F<A.length;F++){let B=A[F],G=p(B);g(B,_.__data,P),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(P+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,_.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,y,_.__data)}}function g(_,b,w){typeof _=="number"||typeof _=="boolean"?b[0]=_:_.isMatrix3?(b[0]=_.elements[0],b[1]=_.elements[1],b[2]=_.elements[2],b[3]=0,b[4]=_.elements[3],b[5]=_.elements[4],b[6]=_.elements[5],b[7]=0,b[8]=_.elements[6],b[9]=_.elements[7],b[10]=_.elements[8],b[11]=0):ArrayBuffer.isView(_)?b.set(new _.constructor(_.buffer,_.byteOffset,b.length)):_.toArray(b,w)}function v(_,b,w,I){let y=_.value,A=b+"_"+w;if(I[A]===void 0)return typeof y=="number"||typeof y=="boolean"?I[A]=y:ArrayBuffer.isView(y)?I[A]=y.slice():I[A]=y.clone(),!0;{let P=I[A];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return I[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function m(_){let b=_.uniforms,w=0,I=16;for(let A=0,P=b.length;A<P;A++){let F=Array.isArray(b[A])?b[A]:[b[A]];for(let B=0,G=F.length;B<G;B++){let U=F[B],k=Array.isArray(U.value)?U.value:[U.value];for(let Z=0,K=k.length;Z<K;Z++){let at=k[Z],$=p(at),et=w%I,rt=et%$.boundary,Nt=et+rt;w+=rt,Nt!==0&&I-Nt<$.storage&&(w+=I-Nt),U.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=w,w+=$.storage}}}let y=w%I;return y>0&&(w+=I-y),_.__size=w,_.__cache={},this}function p(_){let b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?Xt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(b.boundary=16,b.storage=_.byteLength):Xt("WebGLRenderer: Unsupported uniform value type.",_),b}function M(_){let b=_.target;b.removeEventListener("dispose",M);let w=o.indexOf(b.__bindingPointIndex);o.splice(w,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function E(){for(let _ in i)s.deleteBuffer(i[_]);o=[],i={},r={}}return{bind:l,update:c,dispose:E}}var e_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),qn=null;function n_(){return qn===null&&(qn=new dr(e_,16,16,Ri,Dn),qn.name="DFG_LUT",qn.minFilter=Ve,qn.magFilter=Ve,qn.wrapS=kn,qn.wrapT=kn,qn.generateMipmaps=!1,qn.needsUpdate=!0),qn}var el=class{constructor(t={}){let{canvas:e=Cu(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=nn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let v=f,m=new Set([xa,ga,ma]),p=new Set([nn,Ln,Ds,Ns,da,fa]),M=new Uint32Array(4),E=new Int32Array(4),_=new L,b=null,w=null,I=[],y=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,F=!1,B=null,G=null,U=null,k=null;this._outputColorSpace=Ge;let Z=0,K=0,at=null,$=-1,et=null,rt=new Te,Nt=new Te,Ct=null,le=new $t(0),Kt=0,te=e.width,tt=e.height,j=1,vt=null,Ht=null,At=new Te(0,0,te,tt),Vt=new Te(0,0,te,tt),ee=!1,st=new xi,lt=!1,ut=!1,dt=new ae,gt=new L,zt=new Te,kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Wt=!1;function qt(){return at===null?j:1}let N=n;function de(S,O){return e.getContext(S,O)}let ne,R,x,z,V,Q,pt,xt,T,C,H,q,Y,it,ct,ht,Ut,D,_t,nt,yt,bt,ot;try{let S={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",ce,!1),e.addEventListener("webglcontextcreationerror",pn,!1),N===null){let O="webgl2";if(N=de(O,S),N===null)throw de(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ft()}catch(S){throw e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ce,!1),e.removeEventListener("webglcontextcreationerror",pn,!1),Gt("WebGLRenderer: "+S.message),S}function Ft(){ne=new cg(N),ne.init(),yt=new $x(N,ne),R=new j0(N,ne,t,yt),x=new Yx(N,ne),R.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),G=N.createFramebuffer(),U=N.createFramebuffer(),k=N.createFramebuffer(),z=new dg(N),V=new Dx,Q=new Zx(N,ne,x,V,R,yt,z),pt=new lg(P),xt=new pp(N),bt=new K0(N,xt),T=new hg(N,xt,z,bt),C=new pg(N,T,xt,bt,z),D=new fg(N,R,Q),ct=new tg(V),H=new Lx(P,pt,ne,R,bt,ct),q=new jx(P,V),Y=new Ux,it=new Hx(ne),Ut=new J0(P,pt,x,C,g,l),ht=new qx(P,C,R),ot=new t_(N,z,R,x),_t=new Q0(N,ne,z),nt=new ug(N,ne,z),z.programs=H.programs,P.capabilities=R,P.extensions=ne,P.properties=V,P.renderLists=Y,P.shadowMap=ht,P.state=x,P.info=z}v!==nn&&(A=new gg(v,e.width,e.height,a,i,r));let Rt=new Kc(P,N);this.xr=Rt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let S=ne.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=ne.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(S){S!==void 0&&(j=S,this.setSize(te,tt,!1))},this.getSize=function(S){return S.set(te,tt)},this.setSize=function(S,O,J=!0){if(Rt.isPresenting){Xt("WebGLRenderer: Can't change size while VR device is presenting.");return}te=S,tt=O,e.width=Math.floor(S*j),e.height=Math.floor(O*j),J===!0&&(e.style.width=S+"px",e.style.height=O+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(te*j,tt*j).floor()},this.setDrawingBufferSize=function(S,O,J){te=S,tt=O,j=J,e.width=Math.floor(S*J),e.height=Math.floor(O*J),this.setViewport(0,0,S,O)},this.setEffects=function(S){if(v===nn){Gt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let O=0;O<S.length;O++)if(S[O].isOutputPass===!0){Xt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(rt)},this.getViewport=function(S){return S.copy(At)},this.setViewport=function(S,O,J,W){S.isVector4?At.set(S.x,S.y,S.z,S.w):At.set(S,O,J,W),x.viewport(rt.copy(At).multiplyScalar(j).round())},this.getScissor=function(S){return S.copy(Vt)},this.setScissor=function(S,O,J,W){S.isVector4?Vt.set(S.x,S.y,S.z,S.w):Vt.set(S,O,J,W),x.scissor(Nt.copy(Vt).multiplyScalar(j).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(S){x.setScissorTest(ee=S)},this.setOpaqueSort=function(S){vt=S},this.setTransparentSort=function(S){Ht=S},this.getClearColor=function(S){return S.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(S=!0,O=!0,J=!0){let W=0;if(S){let X=!1;if(at!==null){let wt=at.texture.format;X=m.has(wt)}if(X){let wt=at.texture.type,Pt=p.has(wt),St=Ut.getClearColor(),Lt=Ut.getClearAlpha(),Ot=St.r,Qt=St.g,ie=St.b;Pt?(M[0]=Ot,M[1]=Qt,M[2]=ie,M[3]=Lt,N.clearBufferuiv(N.COLOR,0,M)):(E[0]=Ot,E[1]=Qt,E[2]=ie,E[3]=Lt,N.clearBufferiv(N.COLOR,0,E))}else W|=N.COLOR_BUFFER_BIT}O&&(W|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(W|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&N.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),B=S},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ce,!1),e.removeEventListener("webglcontextcreationerror",pn,!1),Ut.dispose(),Y.dispose(),it.dispose(),V.dispose(),pt.dispose(),C.dispose(),bt.dispose(),ot.dispose(),H.dispose(),Rt.dispose(),Rt.removeEventListener("sessionstart",oh),Rt.removeEventListener("sessionend",ah),Di.stop()};function ge(S){S.preventDefault(),sr("WebGLRenderer: Context Lost."),F=!0}function ce(){sr("WebGLRenderer: Context Restored."),F=!1;let S=z.autoReset,O=ht.enabled,J=ht.autoUpdate,W=ht.needsUpdate,X=ht.type;Ft(),z.autoReset=S,ht.enabled=O,ht.autoUpdate=J,ht.needsUpdate=W,ht.type=X}function pn(S){Gt("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Un(S){let O=S.target;O.removeEventListener("dispose",Un),Yd(O)}function Yd(S){Zd(S),V.remove(S)}function Zd(S){let O=V.get(S).programs;O!==void 0&&(O.forEach(function(J){H.releaseProgram(J)}),S.isShaderMaterial&&H.releaseShaderCache(S))}this.renderBufferDirect=function(S,O,J,W,X,wt){O===null&&(O=kt);let Pt=X.isMesh&&X.matrixWorld.determinantAffine()<0,St=Kd(S,O,J,W,X);x.setMaterial(W,Pt);let Lt=J.index,Ot=1;if(W.wireframe===!0){if(Lt=T.getWireframeAttribute(J),Lt===void 0)return;Ot=2}let Qt=J.drawRange,ie=J.attributes.position,Dt=Qt.start*Ot,pe=(Qt.start+Qt.count)*Ot;wt!==null&&(Dt=Math.max(Dt,wt.start*Ot),pe=Math.min(pe,(wt.start+wt.count)*Ot)),Lt!==null?(Dt=Math.max(Dt,0),pe=Math.min(pe,Lt.count)):ie!=null&&(Dt=Math.max(Dt,0),pe=Math.min(pe,ie.count));let Pe=pe-Dt;if(Pe<0||Pe===1/0)return;bt.setup(X,W,St,J,Lt);let Se,ye=_t;if(Lt!==null&&(Se=xt.get(Lt),ye=nt,ye.setIndex(Se)),X.isMesh)W.wireframe===!0?(x.setLineWidth(W.wireframeLinewidth*qt()),ye.setMode(N.LINES)):ye.setMode(N.TRIANGLES);else if(X.isLine){let We=W.linewidth;We===void 0&&(We=1),x.setLineWidth(We*qt()),X.isLineSegments?ye.setMode(N.LINES):X.isLineLoop?ye.setMode(N.LINE_LOOP):ye.setMode(N.LINE_STRIP)}else X.isPoints?ye.setMode(N.POINTS):X.isSprite&&ye.setMode(N.TRIANGLES);if(X.isBatchedMesh)if(ne.get("WEBGL_multi_draw"))ye.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let We=X._multiDrawStarts,It=X._multiDrawCounts,Ze=X._multiDrawCount,he=Lt?xt.get(Lt).bytesPerElement:1,mn=V.get(W).currentProgram.getUniforms();for(let Fn=0;Fn<Ze;Fn++)mn.setValue(N,"_gl_DrawID",Fn),ye.render(We[Fn]/he,It[Fn])}else if(X.isInstancedMesh)ye.renderInstances(Dt,Pe,X.count);else if(J.isInstancedBufferGeometry){let We=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,It=Math.min(J.instanceCount,We);ye.renderInstances(Dt,Pe,It)}else ye.render(Dt,Pe)};function rh(S,O,J,W){B!==null&&S.isNodeMaterial&&B.setObject(W,S),lt===!0&&ct.setState(S,J,!1),S.transparent===!0&&S.side===yn&&S.forceSinglePass===!1?(S.side=Qe,S.needsUpdate=!0,Zr(S,O,W),S.side=wi,S.needsUpdate=!0,Zr(S,O,W),S.side=yn):Zr(S,O,W)}this.compile=function(S,O,J=null){J===null&&(J=S),B!==null&&B.renderStart(S,O,J),w=it.get(J),w.init(O),y.push(w),J.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(w.pushLight(X),X.castShadow&&w.pushShadow(X))}),S!==J&&S.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(w.pushLight(X),X.castShadow&&w.pushShadow(X))}),w.setupLights(),B!==null&&B.updateLights(w.state.lightsArray),ut=this.localClippingEnabled,lt=ct.init(this.clippingPlanes,ut),lt===!0&&ct.setGlobalState(this.clippingPlanes,O),B!==null&&ht.render(w.state.shadowsArray,J,O);let W=new Set;return S.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let wt=X.material;if(wt)if(Array.isArray(wt))for(let Pt=0;Pt<wt.length;Pt++){let St=wt[Pt];rh(St,J,O,X),W.add(St)}else rh(wt,J,O,X),W.add(wt)}),w=y.pop(),B!==null&&B.renderEnd(),W},this.compileAsync=function(S,O,J=null){let W=this.compile(S,O,J);return new Promise(X=>{function wt(){if(W.forEach(function(Pt){let Lt=V.get(Pt).currentProgram;(Lt===void 0||Lt.isReady())&&W.delete(Pt)}),W.size===0){X(S);return}setTimeout(wt,10)}ne.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let xl=null;function $d(S){xl&&xl(S)}function oh(){Di.stop()}function ah(){Di.start()}let Di=new cd;Di.setAnimationLoop($d),typeof self<"u"&&Di.setContext(self),this.setAnimationLoop=function(S){xl=S,Rt.setAnimationLoop(S),S===null?Di.stop():Di.start()},Rt.addEventListener("sessionstart",oh),Rt.addEventListener("sessionend",ah),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){Gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;B!==null&&B.renderStart(S,O);let J=Rt.enabled===!0&&Rt.isPresenting===!0,W=A!==null&&(at===null||J)&&A.begin(P,at);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Rt.enabled===!0&&Rt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Rt.cameraAutoUpdate===!0&&Rt.updateCamera(O),O=Rt.getCamera()),S.isScene===!0&&S.onBeforeRender(P,S,O,at),w=it.get(S,y.length),w.init(O),w.state.textureUnits=Q.getTextureUnits(),y.push(w),dt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),st.setFromProjectionMatrix(dt,An,O.reversedDepth),ut=this.localClippingEnabled,lt=ct.init(this.clippingPlanes,ut),b=Y.get(S,I.length),b.init(),I.push(b),Rt.enabled===!0&&Rt.isPresenting===!0){let Pt=P.xr.getDepthSensingMesh();Pt!==null&&_l(Pt,O,-1/0,P.sortObjects)}_l(S,O,0,P.sortObjects),b.finish(),B!==null&&B.updateLights(w.state.lightsArray),P.sortObjects===!0&&b.sort(vt,Ht),Wt=Rt.enabled===!1||Rt.isPresenting===!1||Rt.hasDepthSensing()===!1,Wt&&Ut.addToRenderList(b,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),lt===!0&&ct.beginShadows();let X=w.state.shadowsArray;if(ht.render(X,S,O),lt===!0&&ct.endShadows(),(W&&A.hasRenderPass())===!1){let Pt=b.opaque,St=b.transmissive;if(w.setupLights(),O.isArrayCamera){let Lt=O.cameras;if(St.length>0)for(let Ot=0,Qt=Lt.length;Ot<Qt;Ot++){let ie=Lt[Ot];ch(Pt,St,S,ie)}Wt&&Ut.render(S);for(let Ot=0,Qt=Lt.length;Ot<Qt;Ot++){let ie=Lt[Ot];lh(b,S,ie,ie.viewport)}}else St.length>0&&ch(Pt,St,S,O),Wt&&Ut.render(S),lh(b,S,O)}at!==null&&K===0&&(Q.updateMultisampleRenderTarget(at),Q.updateRenderTargetMipmap(at)),W&&A.end(P),S.isScene===!0&&S.onAfterRender(P,S,O),bt.resetDefaultState(),$=-1,et=null,y.pop(),y.length>0?(w=y[y.length-1],Q.setTextureUnits(w.state.textureUnits),lt===!0&&ct.setGlobalState(P.clippingPlanes,w.state.camera)):w=null,I.pop(),I.length>0?b=I[I.length-1]:b=null,B!==null&&B.renderEnd()};function _l(S,O,J,W){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)J=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLightProbeGrid)w.pushLightProbeGrid(S);else if(S.isLight)w.pushLight(S),S.castShadow&&w.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(st)){W&&zt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(dt);let Pt=C.update(S),St=S.material;St.visible&&b.push(S,Pt,St,J,zt.z,null,O)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(st))){let Pt=C.update(S),St=S.material;if(W&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),zt.copy(S.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),zt.copy(Pt.boundingSphere.center)),zt.applyMatrix4(S.matrixWorld).applyMatrix4(dt)),Array.isArray(St)){let Lt=Pt.groups;for(let Ot=0,Qt=Lt.length;Ot<Qt;Ot++){let ie=Lt[Ot],Dt=St[ie.materialIndex];Dt&&Dt.visible&&b.push(S,Pt,Dt,J,zt.z,ie,O)}}else St.visible&&b.push(S,Pt,St,J,zt.z,null,O)}}let wt=S.children;for(let Pt=0,St=wt.length;Pt<St;Pt++)_l(wt[Pt],O,J,W)}function lh(S,O,J,W){let{opaque:X,transmissive:wt,transparent:Pt}=S;w.setupLightsView(J),lt===!0&&ct.setGlobalState(P.clippingPlanes,J),W&&x.viewport(rt.copy(W)),X.length>0&&Yr(X,O,J),wt.length>0&&Yr(wt,O,J),Pt.length>0&&Yr(Pt,O,J),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function ch(S,O,J,W){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[W.id]===void 0){let Dt=ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[W.id]=new tn(1,1,{generateMipmaps:!0,type:Dt?Dn:nn,minFilter:Ei,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:oe.workingColorSpace})}let wt=w.state.transmissionRenderTarget[W.id],Pt=W.viewport||rt;wt.setSize(Pt.z*P.transmissionResolutionScale,Pt.w*P.transmissionResolutionScale);let St=P.getRenderTarget(),Lt=P.getActiveCubeFace(),Ot=P.getActiveMipmapLevel();P.setRenderTarget(wt),P.getClearColor(le),Kt=P.getClearAlpha(),Kt<1&&P.setClearColor(16777215,.5),P.clear(),Wt&&Ut.render(J);let Qt=P.toneMapping;P.toneMapping=Pn;let ie=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),w.setupLightsView(W),lt===!0&&ct.setGlobalState(P.clippingPlanes,W),Yr(S,J,W),Q.updateMultisampleRenderTarget(wt),Q.updateRenderTargetMipmap(wt),ne.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let pe=0,Pe=O.length;pe<Pe;pe++){let Se=O[pe],{object:ye,geometry:We,material:It,group:Ze}=Se;if(It.side===yn&&ye.layers.test(W.layers)){let he=It.side;It.side=Qe,It.needsUpdate=!0,hh(ye,J,W,We,It,Ze),It.side=he,It.needsUpdate=!0,Dt=!0}}Dt===!0&&(Q.updateMultisampleRenderTarget(wt),Q.updateRenderTargetMipmap(wt))}P.setRenderTarget(St,Lt,Ot),P.setClearColor(le,Kt),ie!==void 0&&(W.viewport=ie),P.toneMapping=Qt}function Yr(S,O,J){let W=O.isScene===!0?O.overrideMaterial:null;for(let X=0,wt=S.length;X<wt;X++){let Pt=S[X],{object:St,geometry:Lt,group:Ot}=Pt,Qt=Pt.material;Qt.allowOverride===!0&&W!==null&&(Qt=W),St.layers.test(J.layers)&&hh(St,O,J,Lt,Qt,Ot)}}function hh(S,O,J,W,X,wt){B!==null&&X.isNodeMaterial&&B.setObject(S,X),S.onBeforeRender(P,O,J,W,X,wt),S.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),X.onBeforeRender(P,O,J,W,S,wt),X.transparent===!0&&X.side===yn&&X.forceSinglePass===!1?(X.side=Qe,X.needsUpdate=!0,P.renderBufferDirect(J,O,W,X,S,wt),X.side=wi,X.needsUpdate=!0,P.renderBufferDirect(J,O,W,X,S,wt),X.side=yn):P.renderBufferDirect(J,O,W,X,S,wt),S.onAfterRender(P,O,J,W,X,wt)}function Zr(S,O,J){O.isScene!==!0&&(O=kt);let W=V.get(S),X=w.state.lights,wt=w.state.shadowsArray,Pt=X.state.version,St=H.getParameters(S,X.state,wt,O,J,w.state.lightProbeGridArray),Lt=H.getProgramCacheKey(St),Ot=W.programs;W.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?O.environment:null,W.fog=O.fog;let Qt=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;W.envMap=pt.get(S.envMap||W.environment,Qt),W.envMapRotation=W.environment!==null&&S.envMap===null?O.environmentRotation:S.envMapRotation,Ot===void 0&&(S.addEventListener("dispose",Un),Ot=new Map,W.programs=Ot);let ie=Ot.get(Lt);if(ie!==void 0){if(W.currentProgram===ie&&W.lightsStateVersion===Pt)return dh(S,St),ie}else St.uniforms=H.getUniforms(S),B!==null&&S.isNodeMaterial&&B.build(S,J,St),S.onBeforeCompile(St,P),ie=H.acquireProgram(St,Lt),Ot.set(Lt,ie),W.uniforms=St.uniforms;let Dt=W.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Dt.clippingPlanes=ct.uniform),dh(S,St),W.needsLights=jd(S),W.lightsStateVersion=Pt,W.needsLights&&(Dt.ambientLightColor.value=X.state.ambient,Dt.lightProbe.value=X.state.probe,Dt.sunLights.value=X.state.sun,Dt.sunLightShadows.value=X.state.sunShadow,Dt.directionalLights.value=X.state.directional,Dt.directionalLightShadows.value=X.state.directionalShadow,Dt.spotLights.value=X.state.spot,Dt.spotLightShadows.value=X.state.spotShadow,Dt.rectAreaLights.value=X.state.rectArea,Dt.ltc_1.value=X.state.rectAreaLTC1,Dt.ltc_2.value=X.state.rectAreaLTC2,Dt.pointLights.value=X.state.point,Dt.pointLightShadows.value=X.state.pointShadow,Dt.hemisphereLights.value=X.state.hemi,Dt.sunShadowMatrix.value=X.state.sunShadowMatrix,Dt.sunShadowCascade.value=X.state.sunShadowCascade,Dt.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Dt.spotLightMatrix.value=X.state.spotLightMatrix,Dt.spotLightMap.value=X.state.spotLightMap,Dt.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=w.state.lightProbeGridArray.length>0,W.currentProgram=ie,W.uniformsList=null,ie}function uh(S){if(S.uniformsList===null){let O=S.currentProgram.getUniforms();S.uniformsList=Os.seqWithValue(O.seq,S.uniforms)}return S.uniformsList}function dh(S,O){let J=V.get(S);J.outputColorSpace=O.outputColorSpace,J.batching=O.batching,J.batchingColor=O.batchingColor,J.instancing=O.instancing,J.instancingColor=O.instancingColor,J.instancingMorph=O.instancingMorph,J.skinning=O.skinning,J.morphTargets=O.morphTargets,J.morphNormals=O.morphNormals,J.morphColors=O.morphColors,J.morphTargetsCount=O.morphTargetsCount,J.numClippingPlanes=O.numClippingPlanes,J.numIntersection=O.numClipIntersection,J.vertexAlphas=O.vertexAlphas,J.vertexTangents=O.vertexTangents,J.toneMapping=O.toneMapping}function Jd(S,O){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;_.setFromMatrixPosition(O.matrixWorld);for(let J=0,W=S.length;J<W;J++){let X=S[J];if(X.texture!==null&&X.boundingBox.containsPoint(_))return X}return null}function Kd(S,O,J,W,X){O.isScene!==!0&&(O=kt),Q.resetTextureUnits();let wt=O.fog,Pt=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?O.environment:null,St=at===null?P.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:oe.workingColorSpace,Lt=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Ot=pt.get(W.envMap||Pt,Lt),Qt=W.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,ie=!!J.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Dt=!!J.morphAttributes.position,pe=!!J.morphAttributes.normal,Pe=!!J.morphAttributes.color,Se=Pn;W.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(Se=P.toneMapping);let ye=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,We=ye!==void 0?ye.length:0,It=V.get(W),Ze=w.state.lights;if(lt===!0&&(ut===!0||S!==et)){let ve=S===et&&W.id===$;ct.setState(W,S,ve)}let he=!1;W.version===It.__version?(It.needsLights&&It.lightsStateVersion!==Ze.state.version||It.outputColorSpace!==St||X.isBatchedMesh&&It.batching===!1||!X.isBatchedMesh&&It.batching===!0||X.isBatchedMesh&&It.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&It.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&It.instancing===!1||!X.isInstancedMesh&&It.instancing===!0||X.isSkinnedMesh&&It.skinning===!1||!X.isSkinnedMesh&&It.skinning===!0||X.isInstancedMesh&&It.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&It.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&It.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&It.instancingMorph===!1&&X.morphTexture!==null||It.envMap!==Ot||W.fog===!0&&It.fog!==wt||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==ct.numPlanes||It.numIntersection!==ct.numIntersection)||It.vertexAlphas!==Qt||It.vertexTangents!==ie||It.morphTargets!==Dt||It.morphNormals!==pe||It.morphColors!==Pe||It.toneMapping!==Se||It.morphTargetsCount!==We||!!It.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(he=!0):(he=!0,It.__version=W.version);let mn=It.currentProgram;he===!0&&(mn=Zr(W,O,X),B&&W.isNodeMaterial&&B.onUpdateProgram(W,mn,It));let Fn=!1,ai=!1,$i=!1,xe=mn.getUniforms(),Re=It.uniforms;if(x.useProgram(mn.program)&&(Fn=!0,ai=!0,$i=!0),W.id!==$&&($=W.id,ai=!0),It.needsLights){let ve=Jd(w.state.lightProbeGridArray,X);It.lightProbeGrid!==ve&&(It.lightProbeGrid=ve,ai=!0)}if(Fn||et!==S){x.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),xe.setValue(N,"projectionMatrix",S.projectionMatrix),xe.setValue(N,"viewMatrix",S.matrixWorldInverse);let ci=xe.map.cameraPosition;ci!==void 0&&ci.setValue(N,gt.setFromMatrixPosition(S.matrixWorld)),R.logarithmicDepthBuffer&&xe.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&xe.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),et!==S&&(et=S,ai=!0,$i=!0)}if(It.needsLights&&(Ze.state.sunShadowMap.length>0&&xe.setValue(N,"sunShadowMap",Ze.state.sunShadowMap,Q),Ze.state.directionalShadowMap.length>0&&xe.setValue(N,"directionalShadowMap",Ze.state.directionalShadowMap,Q),Ze.state.spotShadowMap.length>0&&xe.setValue(N,"spotShadowMap",Ze.state.spotShadowMap,Q),Ze.state.pointShadowMap.length>0&&xe.setValue(N,"pointShadowMap",Ze.state.pointShadowMap,Q)),X.isSkinnedMesh){xe.setOptional(N,X,"bindMatrix"),xe.setOptional(N,X,"bindMatrixInverse");let ve=X.skeleton;ve&&(ve.boneTexture===null&&ve.computeBoneTexture(),xe.setValue(N,"boneTexture",ve.boneTexture,Q))}X.isBatchedMesh&&(xe.setOptional(N,X,"batchingTexture"),xe.setValue(N,"batchingTexture",X._matricesTexture,Q),xe.setOptional(N,X,"batchingIdTexture"),xe.setValue(N,"batchingIdTexture",X._indirectTexture,Q),xe.setOptional(N,X,"batchingColorTexture"),X._colorsTexture!==null&&xe.setValue(N,"batchingColorTexture",X._colorsTexture,Q));let li=J.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0)&&D.update(X,J,mn),(ai||It.receiveShadow!==X.receiveShadow)&&(It.receiveShadow=X.receiveShadow,xe.setValue(N,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&O.environment!==null&&(Re.envMapIntensity.value=O.environmentIntensity),Re.dfgLUT!==void 0&&(Re.dfgLUT.value=n_()),ai){if(xe.setValue(N,"toneMappingExposure",P.toneMappingExposure),It.needsLights&&Qd(Re,$i),wt&&W.fog===!0&&q.refreshFogUniforms(Re,wt),q.refreshMaterialUniforms(Re,W,j,tt,w.state.transmissionRenderTarget[S.id]),It.needsLights&&It.lightProbeGrid){let ve=It.lightProbeGrid;Re.probesSH.value=ve.texture,Re.probesMin.value.copy(ve.boundingBox.min),Re.probesMax.value.copy(ve.boundingBox.max),Re.probesResolution.value.copy(ve.resolution)}Os.upload(N,uh(It),Re,Q)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Os.upload(N,uh(It),Re,Q),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&xe.setValue(N,"center",X.center),xe.setValue(N,"modelViewMatrix",X.modelViewMatrix),xe.setValue(N,"normalMatrix",X.normalMatrix),xe.setValue(N,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){let ve=W.uniformsGroups;for(let ci=0,Ji=ve.length;ci<Ji;ci++){let ph=ve[ci];ot.update(ph,mn),ot.bind(ph,mn)}}return mn}function Qd(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.sunLights.needsUpdate=O,S.sunLightShadows.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function jd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return K},this.getRenderTarget=function(){return at},this.setRenderTargetTextures=function(S,O,J){let W=V.get(S);W.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),V.get(S.texture).__webglTexture=O,V.get(S.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:J,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,O){let J=V.get(S);J.__webglFramebuffer=O,J.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(S,O=0,J=0){at=S,Z=O,K=J;let W=null,X=!1,wt=!1;if(S){let St=V.get(S);if(St.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,St.__webglFramebuffer),rt.copy(S.viewport),Nt.copy(S.scissor),Ct=S.scissorTest,x.viewport(rt),x.scissor(Nt),x.setScissorTest(Ct),$=-1;return}else if(St.__webglFramebuffer===void 0)Q.setupRenderTarget(S);else if(St.__hasExternalTextures)Q.rebindTextures(S,V.get(S.texture).__webglTexture,V.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Qt=S.depthTexture;if(St.__boundDepthTexture!==Qt){if(Qt!==null&&V.has(Qt)&&(S.width!==Qt.image.width||S.height!==Qt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(S)}}let Lt=S.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(wt=!0);let Ot=V.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ot[O])?W=Ot[O][J]:W=Ot[O],X=!0):S.samples>0&&Q.useMultisampledRTT(S)===!1?W=V.get(S).__webglMultisampledFramebuffer:Array.isArray(Ot)?W=Ot[J]:W=Ot,rt.copy(S.viewport),Nt.copy(S.scissor),Ct=S.scissorTest}else rt.copy(At).multiplyScalar(j).floor(),Nt.copy(Vt).multiplyScalar(j).floor(),Ct=ee;if(J!==0&&(W=G),x.bindFramebuffer(N.FRAMEBUFFER,W)&&x.drawBuffers(S,W),x.viewport(rt),x.scissor(Nt),x.setScissorTest(Ct),X){let St=V.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+O,St.__webglTexture,J)}else if(wt){let St=O;for(let Lt=0;Lt<S.textures.length;Lt++){let Ot=V.get(S.textures[Lt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Lt,Ot.__webglTexture,J,St)}}else if(S!==null&&J!==0){let St=V.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,St.__webglTexture,J)}$=-1};function fh(S){let O=V.get(S);return(O.__readFormat!==S.format||O.__readType!==S.type)&&(O.__readFormat=S.format,O.__readType=S.type,O.__formatReadable=R.textureFormatReadable(S.format),O.__typeReadable=R.textureTypeReadable(S.type)),O}this.readRenderTargetPixels=function(S,O,J,W,X,wt,Pt,St=0){if(!(S&&S.isWebGLRenderTarget)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=V.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Pt!==void 0&&(Lt=Lt[Pt]),Lt){x.bindFramebuffer(N.FRAMEBUFFER,Lt);try{let Ot=S.textures[St],Qt=Ot.format,ie=Ot.type;S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+St);let Dt=fh(Ot);if(Dt.__formatReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Dt.__typeReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=S.width-W&&J>=0&&J<=S.height-X&&N.readPixels(O,J,W,X,yt.convert(Qt),yt.convert(ie),wt)}finally{let Ot=at!==null?V.get(at).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Ot)}}},this.readRenderTargetPixelsAsync=async function(S,O,J,W,X,wt,Pt,St=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=V.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Pt!==void 0&&(Lt=Lt[Pt]),Lt)if(O>=0&&O<=S.width-W&&J>=0&&J<=S.height-X){x.bindFramebuffer(N.FRAMEBUFFER,Lt);let Ot=S.textures[St],Qt=Ot.format,ie=Ot.type;S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+St);let Dt=fh(Ot);if(Dt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Dt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let pe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,pe),N.bufferData(N.PIXEL_PACK_BUFFER,wt.byteLength,N.STREAM_READ),N.readPixels(O,J,W,X,yt.convert(Qt),yt.convert(ie),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Pe=at!==null?V.get(at).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Pe);let Se=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Pu(N,Se,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,pe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,wt),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(pe),N.deleteSync(Se),wt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,O=null,J=0){let W=Math.pow(2,-J),X=Math.floor(S.image.width*W),wt=Math.floor(S.image.height*W),Pt=O!==null?O.x:0,St=O!==null?O.y:0;Q.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,Pt,St,X,wt),x.unbindTexture()},this.copyTextureToTexture=function(S,O,J=null,W=null,X=0,wt=0){let Pt,St,Lt,Ot,Qt,ie,Dt,pe,Pe,Se=S.isCompressedTexture?S.mipmaps[wt]:S.image;if(J!==null)Pt=J.max.x-J.min.x,St=J.max.y-J.min.y,Lt=J.isBox3?J.max.z-J.min.z:1,Ot=J.min.x,Qt=J.min.y,ie=J.isBox3?J.min.z:0;else{let Re=Math.pow(2,-X);Pt=Math.floor(Se.width*Re),St=Math.floor(Se.height*Re),S.isDataArrayTexture?Lt=Se.depth:S.isData3DTexture?Lt=Math.floor(Se.depth*Re):Lt=1,Ot=0,Qt=0,ie=0}W!==null?(Dt=W.x,pe=W.y,Pe=W.z):(Dt=0,pe=0,Pe=0);let ye=yt.convert(O.format),We=yt.convert(O.type),It;O.isData3DTexture?(Q.setTexture3D(O,0),It=N.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Q.setTexture2DArray(O,0),It=N.TEXTURE_2D_ARRAY):(Q.setTexture2D(O,0),It=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,O.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,O.unpackAlignment);let Ze=x.getParameter(N.UNPACK_ROW_LENGTH),he=x.getParameter(N.UNPACK_IMAGE_HEIGHT),mn=x.getParameter(N.UNPACK_SKIP_PIXELS),Fn=x.getParameter(N.UNPACK_SKIP_ROWS),ai=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,Se.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Se.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Ot),x.pixelStorei(N.UNPACK_SKIP_ROWS,Qt),x.pixelStorei(N.UNPACK_SKIP_IMAGES,ie);let $i=S.isDataArrayTexture||S.isData3DTexture,xe=O.isDataArrayTexture||O.isData3DTexture;if(S.isDepthTexture){let Re=V.get(S),li=V.get(O),ve=V.get(Re.__renderTarget),ci=V.get(li.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,ve.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,ci.__webglFramebuffer);for(let Ji=0;Ji<Lt;Ji++)$i&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,V.get(S).__webglTexture,X,ie+Ji),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,V.get(O).__webglTexture,wt,Pe+Ji)),N.blitFramebuffer(Ot,Qt,Pt,St,Dt,pe,Pt,St,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(X!==0||S.isRenderTargetTexture||V.has(S)){let Re=V.get(S),li=V.get(O);x.bindFramebuffer(N.READ_FRAMEBUFFER,U),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,k);for(let ve=0;ve<Lt;ve++)$i?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Re.__webglTexture,X,ie+ve):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Re.__webglTexture,X),xe?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,li.__webglTexture,wt,Pe+ve):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,li.__webglTexture,wt),X!==0?N.blitFramebuffer(Ot,Qt,Pt,St,Dt,pe,Pt,St,N.COLOR_BUFFER_BIT,N.NEAREST):xe?N.copyTexSubImage3D(It,wt,Dt,pe,Pe+ve,Ot,Qt,Pt,St):N.copyTexSubImage2D(It,wt,Dt,pe,Ot,Qt,Pt,St);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else xe?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(It,wt,Dt,pe,Pe,Pt,St,Lt,ye,We,Se.data):O.isCompressedArrayTexture?N.compressedTexSubImage3D(It,wt,Dt,pe,Pe,Pt,St,Lt,ye,Se.data):N.texSubImage3D(It,wt,Dt,pe,Pe,Pt,St,Lt,ye,We,Se):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,wt,Dt,pe,Pt,St,ye,We,Se.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,wt,Dt,pe,Se.width,Se.height,ye,Se.data):N.texSubImage2D(N.TEXTURE_2D,wt,Dt,pe,Pt,St,ye,We,Se);x.pixelStorei(N.UNPACK_ROW_LENGTH,Ze),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,he),x.pixelStorei(N.UNPACK_SKIP_PIXELS,mn),x.pixelStorei(N.UNPACK_SKIP_ROWS,Fn),x.pixelStorei(N.UNPACK_SKIP_IMAGES,ai),wt===0&&O.generateMipmaps&&N.generateMipmap(It),x.unbindTexture()},this.initRenderTarget=function(S){V.get(S).__webglFramebuffer===void 0&&Q.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Q.setTextureCube(S,0):S.isData3DTexture?Q.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Q.setTexture2DArray(S,0):Q.setTexture2D(S,0),x.unbindTexture()},this.resetState=function(){Z=0,K=0,at=null,x.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}};function i_(s){let t=s>>>0;return function(){t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Ae=class{constructor(t){this.r=i_(t)}next(){return this.r()}range(t,e){return t+(e-t)*this.r()}int(t,e){return Math.floor(t+(e-t+1)*this.r())}pick(t){return t[Math.floor(this.r()*t.length)]}chance(t){return this.r()<t}shuffle(t){for(let e=t.length-1;e>0;e--){let n=Math.floor(this.r()*(e+1)),i=t[e];t[e]=t[n],t[n]=i}return t}},zs=(s,t,e)=>s<t?t:s>e?e:s,s_=(s,t,e)=>s+(t-s)*e,Ii=(s,t,e,n)=>s_(s,t,1-Math.exp(-e*n));function qr(s,t){let e=t-s;for(;e>Math.PI;)e-=Math.PI*2;for(;e<-Math.PI;)e+=Math.PI*2;return e}function Qc(s,t,e,n){return s+qr(s,t)*(1-Math.exp(-e*n))}var Me=(s,t,e,n)=>Math.hypot(s-e,t-n),ks=class{constructor(){this.items=[],this.prio=[]}get size(){return this.items.length}push(t,e){let n=this.items,i=this.prio;n.push(t),i.push(e);let r=n.length-1;for(;r>0;){let o=r-1>>1;if(i[o]<=i[r])break;[n[o],n[r]]=[n[r],n[o]],[i[o],i[r]]=[i[r],i[o]],r=o}}pop(){let t=this.items,e=this.prio,n=t[0],i=t.pop(),r=e.pop();if(t.length>0){t[0]=i,e[0]=r;let o=0,a=t.length;for(;;){let l=o*2+1,c=l+1,h=o;if(l<a&&e[l]<e[h]&&(h=l),c<a&&e[c]<e[h]&&(h=c),h===o)break;[t[h],t[o]]=[t[o],t[h]],[e[h],e[o]]=[e[o],e[h]],o=h}}return n}};var Bt={ROCK:0,FLOOR:1,SAFE:2,DOOR:3,PIT:4},Ie={radius:.35,eye:1.62,crouchEye:1,walk:3.4,run:6.4,crouch:1.7,jumpV:6,gravity:18,baseHealth:100,baseStamina:100,runDrain:20,jumpCost:12,staminaRegen:16,startLives:3},sn={clip:6,damage:34,fireDelay:.42,reloadTime:1.7,range:45,noise:38},Sn={walk:6,run:14,crouch:1.6,land:9,glass:22,glassCrouch:9,crate:7,hide:4,bearTrap:18,spikes:14,pit:12},Yi=[{id:"life",name:"Extra Life",desc:"One more chance when the dark takes you.",base:480,grow:1.35,icon:"\u2620"},{id:"medkit",name:"Med Kit",desc:"Restores 50 health. Use with [H].",base:120,icon:"\u271A"},{id:"health",name:"Vitality",desc:"+20 maximum health.",base:260,upgrade:!0,max:6,icon:"\u2665"},{id:"speed",name:"Swiftness",desc:"+7% movement speed.",base:300,upgrade:!0,max:6,icon:"\xBB"},{id:"stamina",name:"Endurance",desc:"+25 max stamina and faster recovery.",base:230,upgrade:!0,max:6,icon:"\u2248"},{id:"greed",name:"Midas' Touch",desc:"+25% gold from every pickup.",base:290,upgrade:!0,max:6,icon:"$"},{id:"map",name:"Cartographer's Map",desc:"Reveals this level and every diamond on it.",base:170,perLevel:!0,icon:"\u25A6"},{id:"key",name:"Skeleton Key",desc:"Opens one locked crate. Single use.",base:140,icon:"\u26B7"},{id:"beartrap",name:"Bear Trap",desc:"Place with [T]. Snares and wounds a monster.",base:115,icon:"\u2297"},{id:"ammo",name:"Revolver Rounds",desc:"Six bullets. Gunfire is loud.",base:95,icon:"\u204D"}];function sl(s,t,e){let n=s.base*(1+.18*(t-1));return s.upgrade&&(n*=Math.pow(1.6,e.upgrades[s.id]||0)),s.id==="life"&&(n*=Math.pow(s.grow,e.livesBought||0)),Math.round(n/5)*5}var rl=[[1,0],[-1,0],[0,1],[0,-1]];function r_(s){return Math.min(32+(s-1)*6,104)}function o_(s){return{grunt:Math.min(2+s,12),hound:s>=2?Math.min(1+Math.floor((s-2)/2),6):0,brute:s>=3?Math.min(1+Math.floor((s-3)/3),4):0,angel:s>=4?Math.min(1+Math.floor((s-4)/2),6):0}}function gd(s,t){let e=new Ae(t),n=r_(s),i=n,r=new Uint8Array(n*i),o=new Int16Array(n*i).fill(-1),a=new Uint8Array(n*i),l=(T,C)=>C*n+T,c=(T,C)=>T>=1&&C>=1&&T<n-1&&C<i-1,h=6,d={x:e.int(3,n-h-4),y:e.int(3,i-h-4),w:h,h,id:0,safe:!0};d.cx=d.x+(h-1)/2,d.cy=d.y+(h-1)/2;for(let T=d.y-1;T<=d.y+h;T++)for(let C=d.x-1;C<=d.x+h;C++)a[l(C,T)]=1;for(let T=d.y;T<d.y+h;T++)for(let C=d.x;C<d.x+h;C++)r[l(C,T)]=Bt.SAFE,o[l(C,T)]=0;let u=[d],f=Math.floor(n*i/100);for(let T=0;T<900&&u.length<f+1;T++){let C=e.int(4,9),H=e.int(4,9),q=e.int(2,n-C-2),Y=e.int(2,i-H-2),it=!0;for(let ht of u){let Ut=ht.safe?4:2;if(q<ht.x+ht.w+Ut&&q+C+Ut>ht.x&&Y<ht.y+ht.h+Ut&&Y+H+Ut>ht.y){it=!1;break}}if(!it)continue;let ct={x:q,y:Y,w:C,h:H,id:u.length,cx:q+(C-1)/2,cy:Y+(H-1)/2};u.push(ct);for(let ht=Y;ht<Y+H;ht++)for(let Ut=q;Ut<q+C;Ut++)r[l(Ut,ht)]=Bt.FLOOR,o[l(Ut,ht)]=ct.id}let g=u[1],v=1/0;for(let T=1;T<u.length;T++){let C=Math.hypot(u[T].cx-d.cx,u[T].cy-d.cy);C<v&&(v=C,g=u[T])}let m=g.cx-d.cx,p=g.cy-d.cy,M;Math.abs(m)>Math.abs(p)?M=m>0?[1,0]:[-1,0]:M=p>0?[0,1]:[0,-1];let E=Math.floor(h/2),_={x:M[0]===1?d.x+h:M[0]===-1?d.x-1:d.x+E,y:M[1]===1?d.y+h:M[1]===-1?d.y-1:d.y+E,dir:M};r[l(_.x,_.y)]=Bt.DOOR;let b={x:_.x+M[0],y:_.y+M[1]};r[l(b.x,b.y)]=Bt.FLOOR;let w=u.map(T=>T.safe?{x:b.x,y:b.y}:{x:Math.round(T.cx),y:Math.round(T.cy)}),I=[],y=new Set([0]),A=new Set;for(;y.size<u.length;){let T=null,C=1/0;for(let H of y)for(let q=0;q<u.length;q++){if(y.has(q))continue;let Y=Math.hypot(w[H].x-w[q].x,w[H].y-w[q].y);Y<C&&(C=Y,T=[H,q])}y.add(T[1]),I.push(T),A.add(T[0]+","+T[1]),A.add(T[1]+","+T[0])}for(let T=1;T<u.length;T++){if(!e.chance(.35))continue;let C=[];for(let q=1;q<u.length;q++)q!==T&&!A.has(T+","+q)&&C.push([q,Math.hypot(w[T].x-w[q].x,w[T].y-w[q].y)]);if(C.sort((q,Y)=>q[1]-Y[1]),!C.length)continue;let H=C[e.int(0,Math.min(2,C.length-1))][0];I.push([T,H]),A.add(T+","+H),A.add(H+","+T)}let P=new Float32Array(n*i);for(let T=0;T<P.length;T++)P[T]=e.next()*1.5;function F(T,C){let H=l(T.x,T.y),q=l(C.x,C.y),Y=new Float32Array(n*i).fill(1/0),it=new Int32Array(n*i).fill(-1),ct=new ks;for(Y[H]=0,ct.push(H,0);ct.size;){let D=ct.pop();if(D===q)break;let _t=D%n,nt=D/n|0;for(let[yt,bt]of rl){let ot=_t+yt,Ft=nt+bt;if(!c(ot,Ft))continue;let Rt=l(ot,Ft);if(a[Rt]&&Rt!==q)continue;let ge=r[Rt]===Bt.FLOOR?1:3.2+P[Rt];it[D]>=0&&D-it[D]!==Rt-D&&(ge+=.6);let ce=Y[D]+ge;ce<Y[Rt]&&(Y[Rt]=ce,it[Rt]=D,ct.push(Rt,ce+(Math.abs(ot-C.x)+Math.abs(Ft-C.y))))}}let ht=q,Ut=0;for(;ht!==-1&&ht!==H&&Ut++<n*i;)r[ht]===Bt.ROCK&&(r[ht]=Bt.FLOOR),ht=it[ht]}for(let[T,C]of I)F(w[T],w[C]);for(let T=2;T<i-2;T++)for(let C=2;C<n-2;C++){let H=l(C,T);if(r[H]!==Bt.FLOOR||o[H]>=0||!e.chance(.04))continue;let q=C+1;!a[l(q,T)]&&r[l(q,T)]===Bt.ROCK&&c(q+1,T)&&(r[l(q,T)]=Bt.FLOOR)}let B=null,G=[{dir:[-1,0],tiles:()=>ol(d.y+1,d.y+h-2).map(T=>[d.x-1,T])},{dir:[1,0],tiles:()=>ol(d.y+1,d.y+h-2).map(T=>[d.x+h,T])},{dir:[0,-1],tiles:()=>ol(d.x+1,d.x+h-2).map(T=>[T,d.y-1])},{dir:[0,1],tiles:()=>ol(d.x+1,d.x+h-2).map(T=>[T,d.y+h])}],U=[];for(let T of G)for(let[C,H]of T.tiles()){if(Math.abs(C-_.x)+Math.abs(H-_.y)<=1)continue;let q=C+T.dir[0],Y=H+T.dir[1];c(q,Y)&&r[l(q,Y)]===Bt.FLOOR&&U.push({x:C,y:H,dir:T.dir})}if(U.length)B=e.pick(U);else for(let T of e.shuffle(G.slice())){if(T.dir[0]===M[0]&&T.dir[1]===M[1])continue;let[C,H]=T.tiles()[1],q=C+T.dir[0],Y=H+T.dir[1],it=[];for(;c(q,Y)&&r[l(q,Y)]!==Bt.FLOOR;)it.push([q,Y]),q+=T.dir[0],Y+=T.dir[1];if(c(q,Y)){for(let[ct,ht]of it)r[l(ct,ht)]=Bt.FLOOR;B={x:C,y:H,dir:T.dir};break}}let k=new Uint8Array(n*i),Z=new Uint8Array(n*i),K=(T,C)=>r[l(T,C)]===Bt.FLOOR,at=(T,C)=>!c(T,C)||r[l(T,C)]===Bt.ROCK,$=(T,C)=>({x:(T+.5)*3,z:(C+.5)*3}),et=new Int32Array(n*i).fill(-1);{let T=[l(b.x,b.y)];et[T[0]]=0;for(let C=0;C<T.length;C++){let H=T[C],q=H%n,Y=H/n|0;for(let[it,ct]of rl){let ht=l(q+it,Y+ct);et[ht]<0&&(r[ht]===Bt.FLOOR||r[ht]===Bt.PIT)&&(et[ht]=et[H]+1,T.push(ht))}}}let rt=()=>{let T=0;for(let C=0;C<r.length;C++)r[C]===Bt.FLOOR&&!k[C]&&T++;return T};function Nt(){let T=new Uint8Array(n*i),C=[l(b.x,b.y)];T[C[0]]=1;let H=0;for(let q=0;q<C.length;q++){let Y=C[q];H++;let it=Y%n,ct=Y/n|0;for(let[ht,Ut]of rl){let D=l(it+ht,ct+Ut);!T[D]&&r[D]===Bt.FLOOR&&!k[D]&&(T[D]=1,C.push(D))}}return H===rt()}function Ct(T,C,H){for(let q=-1;q<=1;q++)for(let Y=-1;Y<=1;Y++){let it=T+Y,ct=C+q;if(!c(it,ct))continue;let ht=l(it,ct);if(r[ht]===Bt.FLOOR&&o[ht]!==H.id)return!0}return!1}function le(T,C){return rl.filter(([H,q])=>at(T+H,C+q)&&!(B&&T+H===B.x&&C+q===B.y))}function Kt(T){let C=[];for(let H=T.y;H<T.y+T.h;H++)for(let q=T.x;q<T.x+T.w;q++)r[l(q,H)]===Bt.FLOOR&&C.push([q,H]);return C}let te=u.filter(T=>!T.safe);function tt(T,C,H){let q=e.shuffle(Kt(T));for(let[Y,it]of q){let ct=l(Y,it);if(Z[ct]||Ct(Y,it,T))continue;let ht=le(Y,it);if(!ht.length)continue;let[Ut,D]=e.pick(ht);if(k[ct]=1,!Nt()){k[ct]=0;continue}Z[ct]=1;let _t=$(Y,it),nt=3/2-H/2-.05;return{kind:C,tx:Y,ty:it,x:_t.x+Ut*nt,z:_t.z+D*nt,fx:-Ut,fz:-D,angle:Math.atan2(-Ut,-D)}}return null}let j={level:s,seed:t,W:n,H:i,tiles:r,roomOf:o,rooms:u,safe:d,door:_,outside:b,window:B,blocked:k,hiding:[],crates:[],gold:[],diamonds:[],ammo:[],pits:[],bearTraps:[],tripwires:[],glass:[],torches:[],decor:[],enemies:[]},vt=Math.min(.12+s*.03,.45);for(let T of te){if(T.w<5||T.h<5||!e.chance(vt))continue;let C=e.int(1,T.w*T.h>40?3:1);for(let H=0;H<C;H++){let q=e.int(T.x+1,T.x+T.w-2),Y=e.int(T.y+1,T.y+T.h-2),it=!0;for(let ct=-1;ct<=1;ct++)for(let ht=-1;ht<=1;ht++)r[l(q+ht,Y+ct)]===Bt.PIT&&(it=!1);if(!(!it||Ct(q,Y,T))){if(r[l(q,Y)]=Bt.PIT,!Nt()){r[l(q,Y)]=Bt.FLOOR;continue}Z[l(q,Y)]=1,j.pits.push({tx:q,ty:Y})}}}let Ht=["locker","closet","bed","bench"],At={locker:.65,closet:.75,bed:1.15,bench:.6};for(let T of te){let C=T.w*T.h>=36?e.int(1,3):e.int(0,2);for(let H=0;H<C;H++){let q=e.pick(Ht),Y=tt(T,q,At[q]);Y&&j.hiding.push(Y)}}let Vt=5+Math.floor(s*1.6);for(let T=0;T<Vt;T++){let C=e.pick(te),H=tt(C,"crate",1);H&&(H.locked=T===0||e.chance(.25),H.angle+=e.range(-.3,.3),j.crates.push(H))}let ee=[];for(let T=1;T<i-1;T++)for(let C=1;C<n-1;C++)r[l(C,T)]===Bt.FLOOR&&ee.push([C,T]);let st=ee.filter(([T,C])=>o[l(T,C)]>0),lt=ee.filter(([T,C])=>o[l(T,C)]<0);function ut(T,C=0,H=!0){for(let q=0;q<60;q++){let[Y,it]=e.pick(T),ct=l(Y,it);if(!(Z[ct]||k[ct]||et[ct]<C))return H&&(Z[ct]=1),[Y,it]}return null}let dt=te.map(T=>({r:T,d:et[l(Math.round(T.cx),Math.round(T.cy))]})).sort((T,C)=>C.d-T.d),gt=dt.slice(0,Math.max(s,Math.ceil(dt.length*.6)));e.shuffle(gt);for(let T=0;T<s;T++){let C=gt[T%gt.length].r,H=e.shuffle(Kt(C)),q=!1;for(let[Y,it]of H){let ct=l(Y,it);if(Z[ct]||k[ct])continue;Z[ct]=1;let ht=$(Y,it);j.diamonds.push({x:ht.x,z:ht.z}),q=!0;break}if(!q){let Y=ut(ee,8);Y&&j.diamonds.push($(Y[0],Y[1]))}}let zt=16+s*5;for(let T=0;T<zt;T++){let C=ut(e.chance(.72)?st:lt,2);if(!C)continue;let H=$(C[0],C[1]);j.gold.push({x:H.x+e.range(-.9,.9),z:H.z+e.range(-.9,.9),value:e.int(8,18)+s*2})}let kt=2+Math.floor(s/2);for(let T=0;T<kt;T++){let C=ut(st,4);if(!C)continue;let H=$(C[0],C[1]);j.ammo.push({x:H.x+e.range(-.7,.7),z:H.z+e.range(-.7,.7)})}let Wt=1+Math.floor(s*.8);for(let T=0;T<Wt;T++){let C=ut(ee,5);if(!C)continue;let H=$(C[0],C[1]);j.bearTraps.push({x:H.x+e.range(-.6,.6),z:H.z+e.range(-.6,.6)})}let qt=lt.filter(([T,C])=>{let H=K(T-1,C)&&K(T+1,C)&&at(T,C-1)&&at(T,C+1),q=K(T,C-1)&&K(T,C+1)&&at(T-1,C)&&at(T+1,C);return(H||q)&&et[l(T,C)]>5}),N=Math.min(Math.floor(s*.7)+1,qt.length);e.shuffle(qt);for(let T=0,C=0;T<qt.length&&C<N;T++){let[H,q]=qt[T],Y=l(H,q);if(Z[Y])continue;Z[Y]=1,C++;let it=$(H,q),ct=K(H-1,q)&&K(H+1,q);j.tripwires.push({tx:H,ty:q,x:it.x,z:it.z,alongX:ct})}let de=2+s;for(let T=0;T<de;T++){let C=ut(ee,3);C&&j.glass.push({tx:C[0],ty:C[1]})}for(let T of te){if(!e.chance(.55))continue;let C=e.shuffle(Kt(T));for(let[H,q]of C){let Y=le(H,q);if(!Y.length)continue;let[it,ct]=e.pick(Y),ht=$(H,q);j.torches.push({x:ht.x+it*(3/2-.12),z:ht.z+ct*(3/2-.12),fx:-it,fz:-ct});break}}let ne=25+s*6;for(let T=0;T<ne;T++){let[C,H]=e.pick(ee),q=$(C,H);j.decor.push({kind:e.pick(["blood","blood","bones","skull","blood","chain"]),x:q.x+e.range(-1,1),z:q.z+e.range(-1,1),rot:e.range(0,Math.PI*2),s:e.range(.7,1.4),tx:C,ty:H})}let R=o_(s),x=e.shuffle(ee.filter(([T,C])=>et[l(T,C)]>14&&!k[l(T,C)]&&o[l(T,C)]>0)),z=e.shuffle(ee.filter(([T,C])=>et[l(T,C)]>8&&!k[l(T,C)])),V=x.length>6?x:z,Q=0,pt=[];for(let T of["grunt","hound","brute","angel"])for(let C=0;C<R[T];C++){let H=null;for(let Y=0;Y<V.length;Y++){let it=V[(Q+Y)%V.length];if(pt.every(([ct,ht])=>Math.abs(ct-it[0])+Math.abs(ht-it[1])>5)){H=it,Q+=Y+1;break}}H||(H=V[Q++%V.length]),pt.push(H);let q=$(H[0],H[1]);j.enemies.push({type:T,x:q.x,z:q.z})}let xt=$(d.x,d.y);return j.safeWorld={x0:d.x*3,z0:d.y*3,x1:(d.x+h)*3,z1:(d.y+h)*3,cx:(d.x+h/2)*3,cz:(d.y+h/2)*3},j.spawn={x:j.safeWorld.cx,z:j.safeWorld.cz,yaw:Math.atan2(-_.dir[0],-_.dir[1])},j}function ol(s,t){let e=[];for(let n=s;n<=t;n++)e.push(n);return e}var jc=new Map;function ze(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,e}function He(s,{repeat:t=!0,nearest:e=!0,srgb:n=!0}={}){let i=new gr(s);return e&&(i.magFilter=De,i.minFilter=Wi),t&&(i.wrapS=i.wrapT=xs),n&&(i.colorSpace=Ge),i.generateMipmaps=!0,i}function je(s,t){return`rgb(${Math.max(0,Math.min(255,s[0]*t))|0},${Math.max(0,Math.min(255,s[1]*t))|0},${Math.max(0,Math.min(255,s[2]*t))|0})`}function rn(s,t,e,n,i,r=.25){let o=s.getImageData(0,0,t,e),a=o.data;for(let l=0;l<a.length;l+=4){let c=1+(n.next()-.5)*i;a[l]*=c,a[l+1]*=c,a[l+2]*=c,n.next()<.02&&(a[l]*=r,a[l+1]*=r,a[l+2]*=r)}s.putImageData(o,0,0)}function Nn(s,t,e,n,i,r){for(let o=0;o<i;o++)s.fillStyle=r,s.globalAlpha=n.range(.08,.25),s.beginPath(),s.ellipse(n.range(0,t),n.range(0,e),n.range(2,10),n.range(2,10),0,0,Math.PI*2),s.fill();s.globalAlpha=1}function xd(s,t,e,n,i){for(let r=0;r<i;r++){let o=n.int(0,t-2),a=n.int(6,e*.7);s.fillStyle=je([90,6,6],n.range(.6,1)),s.fillRect(o,0,n.int(1,2),a),s.fillRect(o-1,a-1,3,2)}}var a_={brick(s=1){let t=new Ae(s),e=64,n=64,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#1b1816",r.fillRect(0,0,e,n);let o=8;for(let a=0;a<n/o;a++){let l=a%2?8:0;for(let c=-16;c<e;c+=16){let h=[70+t.int(-12,12),64+t.int(-12,10),56+t.int(-10,10)];r.fillStyle=je(h,t.range(.75,1.1)),r.fillRect(c+l+1,a*o+1,15,o-1),r.fillStyle=je(h,1.25),r.fillRect(c+l+1,a*o+1,15,1),r.fillStyle=je(h,.6),r.fillRect(c+l+1,a*o+o-1,15,1)}}return rn(r,e,n,t,.35),Nn(r,e,n,t,14,"#0a0806"),Nn(r,e,n,t,4,"#2a3a1a"),t.chance(.5)&&xd(r,e,n,t,t.int(1,3)),He(i)},stoneBlocks(s=2){let t=new Ae(s),e=64,n=64,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#141414",r.fillRect(0,0,e,n);for(let o=0;o<2;o++)for(let a=0;a<2;a++){let l=[58+t.int(-8,8),58+t.int(-8,8),62+t.int(-8,8)];r.fillStyle=je(l,1),r.fillRect(a*32+1,o*32+1,30,30),r.fillStyle=je(l,1.3),r.fillRect(a*32+1,o*32+1,30,1),r.fillRect(a*32+1,o*32+1,1,30),r.fillStyle=je(l,.55),r.fillRect(a*32+1,o*32+30,30,1),r.fillRect(a*32+30,o*32+1,1,30)}rn(r,e,n,t,.4),Nn(r,e,n,t,18,"#050505"),r.strokeStyle="#0c0c0c";for(let o=0;o<3;o++){r.beginPath();let a=t.range(0,e),l=t.range(0,n);r.moveTo(a,l);for(let c=0;c<5;c++)a+=t.range(-6,6),l+=t.range(-6,6),r.lineTo(a,l);r.stroke()}return t.chance(.4)&&xd(r,e,n,t,2),He(i)},floor(s=3){let t=new Ae(s),e=64,n=64,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#121010",r.fillRect(0,0,e,n);let o=[[0,0,26,20],[26,0,38,20],[0,20,18,24],[18,20,28,24],[46,20,18,24],[0,44,34,20],[34,44,30,20]];for(let[a,l,c,h]of o){let d=[52+t.int(-8,8),48+t.int(-6,6),44+t.int(-6,6)];r.fillStyle=je(d,1),r.fillRect(a+1,l+1,c-2,h-2),r.fillStyle=je(d,1.2),r.fillRect(a+1,l+1,c-2,1),r.fillStyle=je(d,.6),r.fillRect(a+1,l+h-2,c-2,1)}return rn(r,e,n,t,.45),Nn(r,e,n,t,20,"#060404"),Nn(r,e,n,t,3,"#3a0505"),He(i)},ceiling(s=4){let t=new Ae(s),e=64,n=64,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#1a1817",r.fillRect(0,0,e,n),rn(r,e,n,t,.8,.4),Nn(r,e,n,t,30,"#050403"),r.fillStyle="#0a0908";for(let o=0;o<4;o++)r.fillRect(0,o*16,e,1);return He(i)},wood(s=5){let t=new Ae(s),e=64,n=64,i=ze(e,n),r=i.getContext("2d");for(let o=0;o<8;o++){let a=[92+t.int(-14,10),58+t.int(-10,8),34+t.int(-8,6)];r.fillStyle=je(a,1),r.fillRect(o*8,0,8,n),r.fillStyle=je(a,.55),r.fillRect(o*8,0,1,n);for(let l=0;l<6;l++)r.fillStyle=je(a,t.range(.7,.9)),r.fillRect(o*8+t.int(2,6),t.int(0,n),1,t.int(6,20));r.fillStyle="#222",r.fillRect(o*8+3,4,1,1),r.fillRect(o*8+3,59,1,1)}return rn(r,e,n,t,.2),He(i)},woodFloor(s=6){let t=new Ae(s),e=64,n=64,i=ze(e,n),r=i.getContext("2d");for(let o=0;o<4;o++){let a=o%2*16;for(let l=-1;l<2;l++){let c=[80+t.int(-10,10),50+t.int(-8,8),30+t.int(-6,6)],h=l*32+a;r.fillStyle=je(c,1),r.fillRect(h,o*16,32,16),r.fillStyle=je(c,.5),r.fillRect(h,o*16,1,16)}r.fillStyle="#1a0f08",r.fillRect(0,o*16,e,1)}return rn(r,e,n,t,.25),He(i)},metal(s=7){let t=new Ae(s),e=32,n=64,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#4a5050",r.fillRect(0,0,e,n),r.fillStyle="#2a2e2e",r.fillRect(0,0,e,1),r.fillRect(0,0,1,n),r.fillRect(e-1,0,1,n);for(let o=0;o<5;o++)r.fillStyle="#0c0d0d",r.fillRect(8,6+o*3,16,1);return r.fillStyle="#8a8a7a",r.fillRect(25,30,2,6),rn(r,e,n,t,.25),Nn(r,e,n,t,10,"#3a1c08"),Nn(r,e,n,t,2,"#400000"),He(i,{repeat:!1})},closet(s=8){let t=new Ae(s),e=32,n=64,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#3c2416",r.fillRect(0,0,e,n),r.fillStyle="#24140a",r.fillRect(15,0,2,n);for(let o of[2,18])r.strokeStyle="#4e3020",r.strokeRect(o+1.5,4.5,10,24),r.strokeRect(o+1.5,34.5,10,24);return r.fillStyle="#a08040",r.fillRect(13,30,1,3),r.fillRect(18,30,1,3),rn(r,e,n,t,.3),He(i,{repeat:!1})},crate(s=9){let t=new Ae(s),e=32,n=32,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#6b4a28",r.fillRect(0,0,e,n);for(let o=0;o<4;o++)r.fillStyle="#4a3018",r.fillRect(0,o*8,e,1);return r.fillStyle="#3e2810",r.fillRect(0,0,e,3),r.fillRect(0,n-3,e,3),r.fillRect(0,0,3,n),r.fillRect(e-3,0,3,n),r.save(),r.translate(e/2,n/2),r.rotate(Math.PI/4),r.fillRect(-22,-1.5,44,3),r.restore(),rn(r,e,n,t,.3),He(i,{repeat:!1})},lockedCrate(s=10){let t=new Ae(s),e=32,n=32,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#3a2814",r.fillRect(0,0,e,n),r.fillStyle="#555a5a",r.fillRect(0,0,e,3),r.fillRect(0,n-3,e,3),r.fillRect(0,0,3,n),r.fillRect(e-3,0,3,n),r.fillRect(0,14,e,4),r.fillStyle="#9a9a8a";for(let[o,a]of[[1,1],[e-2,1],[1,n-2],[e-2,n-2],[8,15],[24,15]])r.fillRect(o,a,1,1);return rn(r,e,n,t,.3),He(i,{repeat:!1})},flesh(s=11){let t=new Ae(s),e=32,n=32,i=ze(e,n),r=i.getContext("2d");r.fillStyle="#ffffff",r.fillRect(0,0,e,n),rn(r,e,n,t,.5,.6),Nn(r,e,n,t,12,"#704040"),r.strokeStyle="rgba(80,20,30,0.5)";for(let o=0;o<6;o++)r.beginPath(),r.moveTo(t.range(0,e),t.range(0,n)),r.lineTo(t.range(0,e),t.range(0,n)),r.stroke();return He(i)},stone(s=12){let t=new Ae(s),e=32,n=32,i=ze(e,n),r=i.getContext("2d");return r.fillStyle="#bbbbb4",r.fillRect(0,0,e,n),rn(r,e,n,t,.35,.7),Nn(r,e,n,t,14,"#555550"),Nn(r,e,n,t,5,"#3a4a30"),He(i)},blood(s=13){let t=new Ae(s),i=ze(64,64),r=i.getContext("2d");r.fillStyle="rgba(80,0,0,0.95)",r.beginPath(),r.ellipse(32,32,t.range(12,18),t.range(10,16),t.range(0,3),0,Math.PI*2),r.fill();for(let o=0;o<14;o++){let a=t.range(0,Math.PI*2),l=t.range(10,28);r.fillStyle=`rgba(${t.int(60,100)},0,0,${t.range(.6,.95)})`,r.beginPath(),r.arc(32+Math.cos(a)*l,32+Math.sin(a)*l,t.range(1,5),0,Math.PI*2),r.fill()}return r.fillStyle="rgba(30,0,0,0.6)",r.beginPath(),r.ellipse(30,34,8,6,.4,0,Math.PI*2),r.fill(),He(i,{repeat:!1})},glow(){let s=ze(64,64),t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.25,"rgba(255,255,255,0.45)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),He(s,{repeat:!1,nearest:!1})},flame(){let s=ze(16,32),t=s.getContext("2d"),e=t.createRadialGradient(8,22,1,8,20,14);return e.addColorStop(0,"rgba(255,250,200,1)"),e.addColorStop(.3,"rgba(255,170,40,0.95)"),e.addColorStop(.7,"rgba(200,50,0,0.5)"),e.addColorStop(1,"rgba(100,0,0,0)"),t.fillStyle=e,t.beginPath(),t.moveTo(8,0),t.quadraticCurveTo(16,18,13,26),t.quadraticCurveTo(8,33,3,26),t.quadraticCurveTo(0,18,8,0),t.fill(),He(s,{repeat:!1})},rug(){let s=new Ae(77),t=ze(32,48),e=t.getContext("2d");return e.fillStyle="#4a1010",e.fillRect(0,0,32,48),e.strokeStyle="#a07020",e.strokeRect(2.5,2.5,27,43),e.strokeStyle="#2a0808",e.strokeRect(5.5,5.5,21,37),e.fillStyle="#a07020",e.beginPath(),e.moveTo(16,12),e.lineTo(24,24),e.lineTo(16,36),e.lineTo(8,24),e.closePath(),e.fill(),rn(e,32,48,s,.3),He(t,{repeat:!1})},rune(){let s=ze(64,64),t=s.getContext("2d");t.strokeStyle="rgba(120,255,170,1)",t.lineWidth=2,t.beginPath(),t.arc(32,32,28,0,Math.PI*2),t.stroke(),t.beginPath(),t.arc(32,32,22,0,Math.PI*2),t.stroke(),t.beginPath();for(let e=0;e<5;e++){let n=-Math.PI/2+e*4*Math.PI/5,i=32+Math.cos(n)*22,r=32+Math.sin(n)*22;e===0?t.moveTo(i,r):t.lineTo(i,r)}return t.closePath(),t.stroke(),He(s,{repeat:!1,nearest:!1})},hatch(){let s=new Ae(5),t=ze(32,32),e=t.getContext("2d");e.fillStyle="#3a2614",e.fillRect(0,0,32,32);for(let n=0;n<4;n++)e.fillStyle="#24160a",e.fillRect(n*8,0,1,32);return e.fillStyle="#505555",e.fillRect(0,5,32,3),e.fillRect(0,24,32,3),rn(e,32,32,s,.3),He(t,{repeat:!1})}};function fe(s,t){let e=s+":"+(t??"");return jc.has(e)||jc.set(e,a_[s](t)),jc.get(e)}var Zn=class{constructor(){this.pos=[],this.nor=[],this.uv=[],this.idx=[]}quad(t,e,n,i,r,o=0,a=0,l=1,c=1){let h=this.pos.length/3;this.pos.push(...t,...e,...n,...i);for(let m=0;m<4;m++)this.nor.push(r[0],r[1],r[2]);this.uv.push(o,a,l,a,l,c,o,c);let d=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],u=[n[0]-t[0],n[1]-t[1],n[2]-t[2]],f=d[1]*u[2]-d[2]*u[1],g=d[2]*u[0]-d[0]*u[2],v=d[0]*u[1]-d[1]*u[0];f*r[0]+g*r[1]+v*r[2]>=0?this.idx.push(h,h+1,h+2,h,h+2,h+3):this.idx.push(h,h+2,h+1,h,h+3,h+2)}build(){let t=new we;return t.setAttribute("position",new re(this.pos,3)),t.setAttribute("normal",new re(this.nor,3)),t.setAttribute("uv",new re(this.uv,2)),t.setIndex(this.idx),t.computeBoundingSphere(),t}};function _d(s,t,e,n,i,r,o,a=1/3){let l=(t+.5)*3+n*3/2,c=(e+.5)*3+i*3/2,h=-i,d=n,u=3/2,f=[l-h*u,r,c-d*u],g=[l+h*u,r,c+d*u],v=[l+h*u,o,c+d*u],m=[l-h*u,o,c-d*u];s.quad(f,g,v,m,[-n,0,-i],0,r*a,1,o*a)}var al=class{constructor(t){this.d=t,this.W=t.W,this.H=t.H,this.tiles=t.tiles,this.group=new Jt,this.props=new Map,this.buildGeometry()}t(t,e){return t<0||e<0||t>=this.W||e>=this.H?Bt.ROCK:this.tiles[e*this.W+t]}isSafeTile(t,e){let n=this.t(t,e);return n===Bt.SAFE||n===Bt.DOOR}isSafePos(t,e){return this.isSafeTile(Math.floor(t/3),Math.floor(e/3))}inSafeRoom(t,e){return this.t(Math.floor(t/3),Math.floor(e/3))===Bt.SAFE}tileOf(t,e){return[Math.floor(t/3),Math.floor(e/3)]}walkableForMonster(t,e){return this.t(t,e)===Bt.FLOOR&&!this.d.blocked[e*this.W+t]}buildGeometry(){let t=this.d,e={wall:new Zn,wall2:new Zn,floor:new Zn,ceil:new Zn,safeWall:new Zn,safeFloor:new Zn,safeCeil:new Zn,pit:new Zn},n=(a,l)=>this.t(a,l)!==Bt.ROCK,i=t.window;for(let a=0;a<this.H;a++)for(let l=0;l<this.W;l++){let c=this.t(l,a);if(c===Bt.ROCK)continue;let h=c===Bt.SAFE,d=t.roomOf[a*this.W+l],u=l*3,f=a*3,g=u+3,v=f+3,m=c===Bt.PIT?-2.4:0;(h?e.safeFloor:c===Bt.PIT?e.pit:e.floor).quad([u,m,f],[u,m,v],[g,m,v],[g,m,f],[0,1,0]),(h?e.safeCeil:e.ceil).quad([u,3.6,f],[g,3.6,f],[g,3.6,v],[u,3.6,v],[0,-1,0]);let E=h?e.safeWall:d>0&&d%3===0?e.wall2:e.wall;for(let[_,b]of[[1,0],[-1,0],[0,1],[0,-1]]){let w=l+_,I=a+b;if(n(w,I)){c===Bt.PIT&&this.t(w,I)!==Bt.PIT&&_d(e.pit,l,a,_,b,-2.4,0);continue}i&&w===i.x&&I===i.y?this.windowWall(E,l,a,_,b):_d(E,l,a,_,b,c===Bt.PIT?-2.4:0,3.6)}}i&&this.windowTunnel(e.wall);let r=(a,l=16777215,c=0)=>{let h=a.clone();return h.needsUpdate=!0,new en({map:h,color:l,emissive:c,emissiveMap:c?h:null})},o={wall:r(fe("brick",1)),wall2:r(fe("stoneBlocks",2)),floor:r(fe("floor",3)),ceil:r(fe("ceiling",4)),safeWall:r(fe("wood",5),13676688,8014372),safeFloor:r(fe("woodFloor",6),12624e3,6962202),safeCeil:r(fe("wood",5),8413264,3810322),pit:r(fe("stoneBlocks",2),6702148)};this.materials=o;for(let a in e){if(!e[a].pos.length)continue;let l=new Et(e[a].build(),o[a]);l.receiveShadow=!0,l.matrixAutoUpdate=!1,l.updateMatrix(),this.group.add(l)}}windowWall(t,e,n,i,r){let o=(e+.5)*3+i*3/2,a=(n+.5)*3+r*3/2,l=-r,c=i,h=3/2,d=.45,u=1.3,f=1.85,g=(E,_)=>[o+l*E,_,a+c*E],v=[-i,0,-r],m=1/3,p=E=>(E+h)/3,M=(E,_,b,w)=>t.quad(g(E,b),g(_,b),g(_,w),g(E,w),v,p(E),b*m,p(_),w*m);M(-h,-d,0,3.6),M(d,h,0,3.6),M(-d,d,0,u),M(-d,d,f,3.6),this.windowInfo={y0:u,y1:f,hw:d}}windowTunnel(t){let e=this.d.window,{y0:n,y1:i,hw:r}=this.windowInfo||{y0:1.3,y1:1.85,hw:.45},o=(e.x+.5)*3,a=(e.y+.5)*3,l=e.dir[0],c=e.dir[1],h=-c,d=l,u=3/2,f=(p,M,E)=>[o+h*p+l*E,M,a+d*p+c*E];t.quad(f(-r,n,-u),f(-r,n,u),f(r,n,u),f(r,n,-u),[0,1,0]),t.quad(f(-r,i,-u),f(r,i,-u),f(r,i,u),f(-r,i,u),[0,-1,0]);let g=(p,M)=>{let E=[h*M,0,d*M],_=f(p,n,-u),b=f(p,n,u),w=f(p,i,u),I=f(p,i,-u);M>0?t.quad(_,I,w,b,E):t.quad(_,b,w,I,E)};g(-r,1),g(r,-1);let v=new en({color:2763306}),m=[-e.dir[0],-e.dir[1]];for(let p=-2;p<=2;p++){let M=new Et(new _n(.04,i-n,.04),v),E=p/2.5*r;M.position.set(o+h*E+m[0]*(u-.1),(n+i)/2,a+d*E+m[1]*(u-.1)),this.group.add(M)}}addCollider(t,e,n,i,r){let o={minX:t,minZ:e,maxX:n,maxZ:i,ref:r},a=Math.floor(t/3),l=Math.floor(n/3),c=Math.floor(e/3),h=Math.floor(i/3);for(let d=c;d<=h;d++)for(let u=a;u<=l;u++){let f=d*this.W+u;this.props.has(f)||this.props.set(f,[]),this.props.get(f).push(o)}return o}removeCollider(t){for(let e of this.props.values()){let n=e.indexOf(t);n>=0&&e.splice(n,1)}}collide(t,e,n=!1){for(let i=0;i<2;i++){let r=Math.floor(t.x/3),o=Math.floor(t.z/3);for(let a=o-1;a<=o+1;a++)for(let l=r-1;l<=r+1;l++){let c=this.t(l,a),h=c===Bt.ROCK;n&&(c===Bt.SAFE||c===Bt.DOOR||c===Bt.PIT)&&(h=!0),h&&this.pushOut(t,e,l*3,a*3,(l+1)*3,(a+1)*3);let d=this.props.get(a*this.W+l);if(d)for(let u of d)this.pushOut(t,e,u.minX,u.minZ,u.maxX,u.maxZ)}}}pushOut(t,e,n,i,r,o){let a=Math.max(n,Math.min(t.x,r)),l=Math.max(i,Math.min(t.z,o)),c=t.x-a,h=t.z-l,d=c*c+h*h;if(d>=e*e)return!1;if(d<1e-8){let f=t.x-n,g=r-t.x,v=t.z-i,m=o-t.z,p=Math.min(f,g,v,m);return p===f?t.x=n-e:p===g?t.x=r+e:p===v?t.z=i-e:t.z=o+e,!0}let u=Math.sqrt(d);return t.x=a+c/u*e,t.z=l+h/u*e,!0}los(t,e,n,i){return this.rayDist(t,e,n,i)>=Math.hypot(n-t,i-e)-1e-4}rayDist(t,e,n,i){let r=n-t,o=i-e,a=Math.hypot(r,o);if(a<1e-6)return 0;let l=r/a,c=o/a,h=Math.floor(t/3),d=Math.floor(e/3),u=l>0?1:-1,f=c>0?1:-1,g=l!==0?Math.abs(3/l):1/0,v=c!==0?Math.abs(3/c):1/0,m=l!==0?((l>0?(h+1)*3:h*3)-t)/l:1/0,p=c!==0?((c>0?(d+1)*3:d*3)-e)/c:1/0,M=0;for(let E=0;E<256;E++){if(this.t(h,d)===Bt.ROCK)return M;if(m<p?(M=m,m+=g,h+=u):(M=p,p+=v,d+=f),M>a)return a}return a}ray3D(t,e,n){let i=Math.hypot(e.x,e.z),r=n;if(i>1e-5){let o=this.rayDist(t.x,t.z,t.x+e.x/i*n*i,t.z+e.z/i*n*i);r=Math.min(r,o/i)}return e.y<-1e-5&&(r=Math.min(r,-t.y/e.y)),e.y>1e-5&&(r=Math.min(r,(3.6-t.y)/e.y)),Math.max(0,r)}findPath(t,e,n,i,r=4e3){let o=this.W,[a,l]=this.tileOf(t,e),[c,h]=this.tileOf(n,i);if(!this.walkableForMonster(a,l)){let b=!1;for(let[w,I]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]])if(this.walkableForMonster(a+w,l+I)){a+=w,l+=I,b=!0;break}if(!b)return null}let d=h*o+c,u=l*o+a,f=(b,w)=>this.walkableForMonster(b,w)||w*o+b===d;if(this.t(c,h)===Bt.ROCK||this.isSafeTile(c,h))return null;let g=new Map,v=new Map,m=new Set,p=new ks;g.set(u,0),p.push(u,0);let M=0;for(;p.size&&M++<r;){let b=p.pop();if(b===d)break;if(m.has(b))continue;m.add(b);let w=b%o,I=b/o|0,y=g.get(b);for(let A=-1;A<=1;A++)for(let P=-1;P<=1;P++){if(!P&&!A)continue;let F=w+P,B=I+A;if(!f(F,B)||P&&A&&(!this.walkableForMonster(w+P,I)||!this.walkableForMonster(w,I+A)))continue;let G=B*o+F,U=y+(P&&A?1.414:1);if(U<(g.get(G)??1/0)){g.set(G,U),v.set(G,b);let k=Math.abs(F-c),Z=Math.abs(B-h);p.push(G,U+Math.max(k,Z)+.414*Math.min(k,Z))}}}if(!v.has(d)&&d!==u)return null;let E=[],_=d;for(;_!==void 0&&_!==u;)E.push({x:(_%o+.5)*3,z:((_/o|0)+.5)*3}),_=v.get(_);return E.reverse(),E.length?E[E.length-1]={x:n,z:i}:E.push({x:n,z:i}),E}clearLine(t,e,n,i,r){let o=Math.hypot(n-t,i-e),a=Math.ceil(o/.5);for(let l=0;l<=a;l++){let c=l/Math.max(1,a),h=t+(n-t)*c,d=e+(i-e)*c;for(let[u,f]of[[r,0],[-r,0],[0,r],[0,-r]]){let[g,v]=this.tileOf(h+u,d+f);if(!this.walkableForMonster(g,v)){let[m,p]=this.tileOf(n,i);if(!(g===m&&v===p&&this.t(g,v)===Bt.FLOOR))return!1}}}return!0}dispose(){this.group.traverse(t=>{t.geometry&&t.geometry.dispose()});for(let t in this.materials)this.materials[t].map?.dispose(),this.materials[t].dispose()}};function vd(s,t=!1){let e=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,l=new we,c=0;for(let h=0;h<s.length;++h){let d=s[h],u=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(t){let f;if(e)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,d=[];for(let u=0;u<s.length;++u){let f=s[u].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+h);h+=s[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=yd(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][u]);let g=yd(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function yd(s){let t,e,n,i=-1,r=0;for(let c=0;c<s.length;++c){let h=s[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ne(o,e,n),l=0;for(let c=0;c<s.length;++c){let h=s[c];if(h.isInterleavedBufferAttribute){let d=l/e;for(let u=0,f=h.count;u<f;u++)for(let g=0;g<e;g++){let v=h.getComponent(u,g);a.setComponent(u+d,g,v)}}else o.set(h.array,l);l+=h.count*e}return i!==void 0&&(a.gpuType=i),a}var Yt=s=>new en(s),Li=s=>new gi(s);function Tt(s,t,e,n,i=0,r=0,o=0){let a=new Et(new _n(s,t,e),n);return a.position.set(i,r,o),a.castShadow=!0,a}function ue(s,t,e,n){let i=new Jt;return i.position.set(t,e,n),s.add(i),i}function Hs(s,t,e=1){let n=new mi(new ii({map:fe("glow"),color:s,transparent:!0,opacity:e,blending:si,depthWrite:!1,fog:!0}));return n.scale.set(t,t,t),n}function oi(s,t=!0){s.updateMatrixWorld(!0);let e=new ae().copy(s.matrixWorld).invert(),n=new Map,i=[];s.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh){let a=o.geometry.index?o.geometry:null;if(!a)return i.push(o);let l=a.clone().applyMatrix4(new ae().multiplyMatrices(e,o.matrixWorld));n.has(o.material)||n.set(o.material,[]),n.get(o.material).push(l)}else o.isSprite&&o.parent===s&&i.push(o)});let r=new Jt;for(let[o,a]of n){let l=new Et(vd(a),o);l.castShadow=t,l.receiveShadow=!0,r.add(l),a.forEach(c=>c.dispose())}for(let o of i)r.add(o);return r}function Sd(){let s=Yt({color:9209462,map:fe("flesh",11)}),t=Yt({color:2760728}),e=Li({color:16722432}),n=Yt({color:12103318}),i=new Jt,r=ue(i,0,.95,0),o=ue(r,0,0,0);o.rotation.x=.45,o.add(Tt(.62,.8,.36,s,0,.42,0)),o.add(Tt(.5,.25,.3,t,0,-.02,0));for(let u=0;u<4;u++)o.add(Tt(.06,.06,.08,n,0,.15+u*.18,-.2));let a=ue(o,0,.92,.14),l=new Et(new hn(.2,8,6),s);l.scale.set(1,1.15,1.05),l.castShadow=!0,a.add(l);let c=ue(a,0,-.1,.02);c.add(Tt(.26,.08,.22,s,0,-.04,.06));for(let u=-2;u<=2;u++){let f=new Et(new Ke(.015,.06,4),n);f.position.set(u*.045,.02,.16),c.add(f)}for(let u of[-1,1]){let f=new Et(new hn(.035,6,4),e);f.position.set(u*.075,.03,.17),a.add(f)}let h=[];for(let u of[-1,1]){let f=ue(o,u*.38,.74,.02);f.add(Tt(.13,.72,.13,s,0,-.36,0));let g=ue(f,0,-.72,0);g.add(Tt(.11,.68,.11,s,0,-.34,0));for(let v=-1;v<=1;v++){let m=new Et(new Ke(.02,.2,4),n);m.position.set(v*.035,-.75,.02),m.rotation.x=Math.PI,g.add(m)}h.push({sh:f,fore:g,s:u})}let d=[];for(let u of[-1,1]){let f=ue(r,u*.17,0,0);f.add(Tt(.17,.5,.17,s,0,-.25,0));let g=ue(f,0,-.5,0);g.add(Tt(.14,.45,.14,s,0,-.22,0)),g.add(Tt(.16,.06,.28,t,0,-.44,.06)),d.push({hip:f,knee:g,s:u})}return{root:i,hips:r,torso:o,head:a,jaw:c,arms:h,legs:d,height:1.85,baseLean:.45}}function bd(){let s=Yt({color:8016452,map:fe("flesh",21)}),t=Yt({color:3815994}),e=Yt({color:1840142}),n=new Jt,i=ue(n,0,1.3,0),r=ue(i,0,0,0);r.rotation.x=.25,r.add(Tt(1.25,1.15,.8,s,0,.6,0)),r.add(Tt(1,.5,.75,s,0,.05,.08)),r.add(Tt(1.3,.12,.85,e,0,.3,0)),r.add(Tt(.12,1.2,.86,e,.3,.6,0));let o=ue(r,0,1.3,.25),a=new Et(new hn(.27,8,6),s);a.castShadow=!0,o.add(a),o.add(Tt(.5,.18,.4,t,0,.04,.06));for(let d=-2;d<=2;d++)o.add(Tt(.02,.12,.02,e,d*.05,-.14,.24));let l=ue(o,0,-.16,.05);l.add(Tt(.32,.1,.25,s,0,-.03,.06));let c=[];for(let d of[-1,1]){let u=ue(r,d*.78,1.05,0);u.add(Tt(.42,.42,.42,s,0,0,0)),u.add(Tt(.32,.85,.32,s,0,-.45,0));let f=ue(u,0,-.88,0);f.add(Tt(.36,.8,.36,s,0,-.38,0)),f.add(Tt(.44,.38,.44,s,0,-.88,0)),f.add(Tt(.4,.1,.4,t,0,-.15,0)),c.push({sh:u,fore:f,s:d})}let h=[];for(let d of[-1,1]){let u=ue(i,d*.33,0,0);u.add(Tt(.36,.68,.36,s,0,-.34,0));let f=ue(u,0,-.66,0);f.add(Tt(.32,.6,.32,s,0,-.3,0)),f.add(Tt(.36,.08,.48,e,0,-.62,.08)),h.push({hip:u,knee:f,s:d})}return{root:n,hips:i,torso:r,head:o,jaw:l,arms:c,legs:h,height:2.8,baseLean:.25}}function wd(){let s=Yt({color:10111554,map:fe("flesh",31)}),t=Yt({color:13682352}),e=Li({color:16768290}),n=new Jt,i=ue(n,0,.5,0),r=ue(i,0,0,0);r.add(Tt(.36,.32,.9,s,0,0,0));for(let h=0;h<5;h++){let d=new Et(new Ke(.03,.14,4),t);d.position.set(0,.2,-.3+h*.14),r.add(d)}for(let h=0;h<4;h++)r.add(Tt(.38,.03,.04,t,0,-.05,-.15+h*.1));let o=ue(r,0,.12,.48);o.add(Tt(.26,.2,.3,s,0,.02,.1)),o.add(Tt(.2,.08,.2,s,0,.06,.3));for(let h=-1;h<=1;h+=2){let d=new Et(new hn(.03,6,4),e);d.position.set(h*.08,.08,.24),o.add(d);let u=new Et(new Ke(.04,.16,4),s);u.position.set(h*.1,.18,.02),u.rotation.z=-h*.4,o.add(u)}let a=ue(o,0,-.06,.12);a.add(Tt(.18,.06,.3,s,0,-.03,.12));for(let h=-2;h<=2;h++){let d=new Et(new Ke(.012,.05,4),t);d.position.set(h*.035,.02,.25),a.add(d)}let l=[];for(let[h,d]of[[-.14,.35],[.14,.35],[-.14,-.35],[.14,-.35]]){let u=ue(r,h,-.08,d);u.add(Tt(.07,.25,.07,s,0,-.12,0));let f=ue(u,0,-.24,0);f.add(Tt(.05,.22,.05,s,0,-.1,0)),l.push({hip:u,knee:f,s:h*d>0?1:-1})}let c=ue(r,0,.05,-.45);return c.add(Tt(.04,.04,.4,s,0,0,-.2)),{root:n,hips:i,torso:r,head:o,jaw:a,arms:[],legs:l,tail:c,height:.75,baseLean:0,quad:!0}}function l_(){let s=new yi;s.moveTo(0,0),s.quadraticCurveTo(.3,.55,.15,1.15),s.lineTo(.05,.9),s.lineTo(-.1,1),s.lineTo(-.15,.7),s.lineTo(-.32,.75),s.lineTo(-.3,.45),s.lineTo(-.48,.42),s.lineTo(-.38,.15),s.lineTo(-.55,.05),s.quadraticCurveTo(-.2,-.15,0,0);let t=new Er(s,{depth:.04,bevelEnabled:!1});return t.translate(0,0,-.02),t}function Td(){let s=Yt({color:10132114,map:fe("stone",12)}),t=Li({color:328965}),e=new Jt,n=ue(e,0,1.15,0),i=new Et(new Ce(.24,.5,1.2,10),s);i.position.y=-.55,i.castShadow=!0,n.add(i);let r=ue(n,0,0,0),o=new Et(new Ce(.21,.24,.62,8),s);o.position.y=.3,o.castShadow=!0,r.add(o);let a=ue(r,0,.78,0),l=new Et(new hn(.16,10,8),s);l.scale.set(1,1.15,1),l.castShadow=!0,a.add(l);let c=new Et(new hn(.17,10,6,0,Math.PI*2,0,Math.PI/2),s);c.position.set(0,.03,-.02),a.add(c);let h=new Jt;h.add(Tt(.12,.08,.02,t,0,-.07,.15));for(let v=-2;v<=2;v++){let m=new Et(new Ke(.01,.045,4),s);m.position.set(v*.022,-.04,.16),m.rotation.x=Math.PI,h.add(m);let p=m.clone();p.position.y=-.1,p.rotation.x=0,h.add(p)}for(let v of[-1,1])h.add(Tt(.04,.02,.02,t,v*.06,.03,.15));a.add(h);let d=ue(a,0,-.1,0),u=[];for(let v of[-1,1]){let m=ue(r,v*.27,.56,0),p=new Et(new Ce(.065,.055,.46,6),s);p.position.y=-.23,p.castShadow=!0,m.add(p);let M=ue(m,0,-.46,0),E=new Et(new Ce(.055,.045,.42,6),s);E.position.y=-.21,E.castShadow=!0,M.add(E);let _=Tt(.08,.14,.04,s,0,-.48,0);M.add(_);for(let b=-1;b<=1;b++){let w=new Et(new Ke(.012,.09,4),s);w.position.set(b*.025,-.58,0),w.rotation.x=Math.PI,M.add(w)}u.push({sh:m,fore:M,s:v})}let f=l_(),g=[];for(let v of[-1,1]){let m=new Et(f,s);m.castShadow=!0,m.position.set(v*.12,.25,-.2),m.rotation.set(.15,v*-.5,0),m.scale.set(-v,1,1),r.add(m),g.push(m)}return{root:e,hips:n,torso:r,head:a,jaw:d,arms:u,legs:[],face:h,wings:g,height:2,baseLean:0}}function ll(s,t){let[e,n]=s.arms,i=(r,o,a,l)=>{r.sh.rotation.set(o,0,a),r.fore.rotation.set(l,0,0)};switch(s.face.visible=t>=2,s.torso.rotation.set(0,0,0),s.head.rotation.set(0,0,0),s.wings.forEach((r,o)=>r.rotation.y=(o?1:-1)*-.5),t){case 0:i(e,-2.3,-.5,-1.4),i(n,-2.3,.5,-1.4),s.head.rotation.x=.35,s.torso.rotation.x=.15;break;case 1:i(e,-1.4,-.1,-.2),i(n,-1.5,.15,-.1),s.head.rotation.x=.1;break;case 2:i(e,-2.2,-.4,-.5),i(n,-1.2,.3,-.3),s.torso.rotation.x=.3,s.head.rotation.x=-.15,s.wings.forEach((r,o)=>r.rotation.y=(o?1:-1)*-.95);break;default:i(e,-1.7,-.6,-.9),i(n,-2.6,.2,-.4),s.torso.rotation.set(.35,.2,0),s.head.rotation.set(-.2,-.2,.15),s.wings.forEach((r,o)=>r.rotation.y=(o?1:-1)*-1.1)}}function Ed(){let s=Yt({color:4080708}),t=Yt({map:fe("metal",7)}),e=new Jt,n=new Et(new _n(.85,2.1,.6),[s,s,s,s,t,s]);return n.position.y=1.05,n.castShadow=n.receiveShadow=!0,e.add(n),e}function Ad(){let s=Yt({color:3021328}),t=Yt({map:fe("closet",8)}),e=new Jt,n=new Et(new _n(1.3,2.2,.72),[s,s,s,s,t,s]);return n.position.y=1.1,n.castShadow=n.receiveShadow=!0,e.add(n),e.add(Tt(1.4,.1,.8,s,0,2.25,0)),e}function th(s=!1){let t=Yt({color:3810324,map:fe("wood",5)}),e=Yt({color:s?9075306:6971472,map:fe("flesh",s?41:42)}),n=Yt({color:3801088}),i=new Jt;i.add(Tt(2,.1,1.05,t,0,.42,0)),i.add(Tt(1.9,.16,.98,e,0,.55,0)),i.add(Tt(.4,.12,.7,e,-.72,.68,0)),s||i.add(Tt(.6,.02,.5,n,.2,.64,.1));for(let[r,o]of[[-.95,-.48],[.95,-.48],[-.95,.48],[.95,.48]])i.add(Tt(.08,.42,.08,t,r,.21,o));return i.add(Tt(.08,1,1.05,t,-1,.5,0)),i}function Rd(){let s=Yt({color:4861976,map:fe("wood",5)}),t=new Jt;t.add(Tt(2,.08,.56,s,0,.52,0));for(let e of[-.85,.85])t.add(Tt(.08,.5,.5,s,e,.25,0));return t.add(Tt(1.7,.06,.06,s,0,.2,0)),t}function Cd(s){let t=Yt({map:fe(s?"lockedCrate":"crate",s?10:9)}),e=new Jt,n=Tt(1,.86,1,t,0,.43,0);n.receiveShadow=!0,e.add(n);let i=ue(e,0,.86,-.5);if(i.add(Tt(1.02,.12,1.02,t,0,.06,.5)),s){let r=Yt({color:11571248,emissive:2101248});e.add(Tt(.16,.18,.06,r,0,.72,.53));let o=new Et(new vi(.05,.015,4,8,Math.PI),Yt({color:7829367}));o.position.set(0,.81,.53),e.add(o)}return{group:e,lid:i}}var Md=null;function Id(s){Md||(Md=new Ce(.07,.07,.025,8));let t=Yt({color:16761402,emissive:4861952}),e=new Jt,n=Math.min(4+Math.floor(s/4),12);for(let r=0;r<n;r++){let o=new Et(Md,t),a=Math.random()*Math.PI*2,l=Math.random()*.18;o.position.set(Math.cos(a)*l,.013+r%4*.025,Math.sin(a)*l),o.rotation.set((Math.random()-.5)*.4,0,(Math.random()-.5)*.4),e.add(o)}let i=Hs(16755234,.7,.35);return i.position.y=.15,e.add(i),e}function Pd(){let s=new Jt,t=new Et(new Ar(.26,0),Yt({color:10479871,emissive:1734848,flatShading:!0}));t.scale.y=1.5,t.castShadow=!1,s.add(t);let e=Hs(4504575,2,.9);return s.add(e),{group:s,gem:t,glow:e}}function Ld(){let s=new Jt;s.add(Tt(.32,.16,.22,Yt({color:2898460}),0,.08,0));let t=Yt({color:13148224,emissive:2102272});for(let n=0;n<3;n++){let i=new Et(new Ce(.025,.025,.1,6),t);i.position.set(-.08+n*.08,.2,0),s.add(i)}let e=Hs(11175987,.5,.25);return e.position.y=.2,s.add(e),s}function Dd(){let s=new Jt,t=Yt({color:2236962});s.add(Tt(.06,.06,.25,t,0,1.95,.1));let e=new Et(new Ce(.04,.03,.45,6),Yt({color:3810320}));e.position.set(0,2.1,.22),e.rotation.x=.25,s.add(e);let n=new mi(new ii({map:fe("flame"),transparent:!0,blending:si,depthWrite:!1}));n.scale.set(.25,.45,1),n.position.set(0,2.45,.28),s.add(n);let i=Hs(16746547,1.6,.45);return i.position.copy(n.position),s.add(i),{group:s,flame:n,glow:i}}function Nd(){let s=new Jt,t=Yt({color:5920080,emissive:657414}),e=new Et(new Ce(.12,.14,.04,8),t);e.position.y=.02,s.add(e);let n=[];for(let i of[-1,1]){let r=ue(s,0,.03,0),o=new Et(new vi(.3,.02,4,12,Math.PI),t);o.rotation.y=Math.PI/2,o.castShadow=!0,r.add(o);for(let a=1;a<8;a++){let l=a/8*Math.PI,c=new Et(new Ke(.018,.07,4),t);o.add(c),c.position.set(Math.cos(l)*.27,Math.sin(l)*.27,0),c.rotation.set(0,0,l+Math.PI/2)}r.userData.side=i,n.push(r)}return cl(n,!0),{group:s,jaws:n}}function cl(s,t){for(let e of s)e.rotation.z=t?e.userData.side*(Math.PI/2):e.userData.side*.08}function Ud(s,t){let e=new Ke(.07,.8,4),n=Yt({color:6969936}),i=new fr(e,n,s),r=new ae;for(let o=0;o<s;o++){let a=.6+Math.random()*.6;r.compose(new L((Math.random()-.5)*t,a*.4,(Math.random()-.5)*t),new xn().setFromEuler(new Rn((Math.random()-.5)*.3,0,(Math.random()-.5)*.3)),new L(1,a,1)),i.setMatrixAt(o,r)}return i}function Fd(s){let t=new Jt,e=Yt({color:12574958,emissive:858655,transparent:!0,opacity:.85,side:yn});for(let n=0;n<26;n++){let i=new yi,r=.04+s.next()*.12;i.moveTo(0,0),i.lineTo(r,s.next()*r*.5),i.lineTo(s.next()*r,r);let o=new Et(new Rr(i),e);o.rotation.set(-Math.PI/2+(s.next()-.5)*.3,0,s.next()*6.28),o.position.set((s.next()-.5)*2.6,.012,(s.next()-.5)*2.6),t.add(o)}return t}function Od(s){let t=new Jt,e=new Et(new Ce(.008,.008,s,4),Yt({color:10132106,emissive:1118481}));e.rotation.z=Math.PI/2,e.position.y=.22,t.add(e);for(let r of[-1,1])t.add(Tt(.05,.3,.05,Yt({color:2760728}),r*s/2,.15,0));let n=new Jt,i=Yt({color:8024166});for(let r of[-1,1])for(let o=0;o<6;o++){let a=new Et(new Ke(.05,1.2,4),i);a.rotation.z=r*Math.PI/2,a.position.set(r*(s/2-.6),.5+o%3*.45,-.3+Math.floor(o/3)*.6),a.userData.s=r,n.add(a)}return n.visible=!1,t.add(n),{group:t,wire:e,spikes:n}}function Bd(s){let t=new Et(new In(1,1),Yt({map:fe("blood",13+s.int(0,3)),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}));return t.rotation.x=-Math.PI/2,t}function eh(s,t){let e=new Jt,n=Yt({color:11050116}),i=t?3:5;for(let r=0;r<i;r++){let o=new Et(new Ce(.025,.03,.35+s.next()*.2,5),n);o.rotation.set(Math.PI/2,0,s.next()*6.28),o.position.set((s.next()-.5)*.6,.03,(s.next()-.5)*.6),e.add(o)}if(t){let r=new Et(new hn(.12,7,6),n);r.position.y=.11,r.scale.set(1,.9,1.15),e.add(r);let o=Li({color:328965});for(let a of[-.04,.04])e.add(Tt(.035,.035,.02,o,a,.13,.13));e.add(Tt(.12,.05,.1,n,0,.03,.05))}return e}function kd(){let s=new Jt,t=Yt({color:3814962}),e=new vi(.05,.012,4,8),n=6+Math.floor(Math.random()*8);for(let r=0;r<n;r++){let o=new Et(e,t);o.position.y=-r*.085,o.rotation.y=r%2?Math.PI/2:0,o.rotation.x=Math.PI/2,o.rotation.z=0,s.add(o)}let i=new Et(new vi(.08,.015,4,8,Math.PI*1.4),t);return i.position.y=-n*.085-.06,s.add(i),s}function zd(){let s=new Jt,t=Yt({color:1708558}),e=Yt({color:4860950,map:fe("wood",5)}),n=new Et(new Ke(.45,1.6,10),t);n.position.set(0,.8,-.35),s.add(n);let i=new Et(new hn(.24,10,8),t);i.position.set(0,1.65,-.32),i.scale.set(1,1.2,1),s.add(i);let r=new Et(new As(.14,10),Li({color:0}));r.position.set(0,1.62,-.1),s.add(r);let o=[];for(let c of[-.05,.05]){let h=new Et(new hn(.014,6,4),Li({color:16760944}));h.position.set(c,1.65,-.08),s.add(h),o.push(h)}s.add(Tt(1.8,.1,.7,e,0,1,.2)),s.add(Tt(1.7,.95,.08,e,0,.48,.5));for(let c of[-.82,.82])s.add(Tt(.08,.95,.6,e,c,.48,.2));s.add(Tt(.4,.05,.3,Yt({color:5902352}),-.3,1.08,.2)),s.add(Tt(.36,.01,.26,Yt({color:13154448}),-.3,1.11,.2));let a=Yt({color:16761402,emissive:3809792});for(let c=0;c<5;c++){let h=new Et(new Ce(.05,.05,.02,8),a);h.position.set(.35+c%2*.03,1.07+c*.02,.15),s.add(h)}let l=nh();return l.position.set(.6,1.05,.3),s.add(l),{group:s,eyes:o}}function nh(){let s=new Jt,t=new Et(new Ce(.035,.04,.2,6),Yt({color:14209200,emissive:2103824}));t.position.y=.1,s.add(t);let e=new mi(new ii({map:fe("flame"),transparent:!0,blending:si,depthWrite:!1}));e.scale.set(.06,.12,1),e.position.y=.25,s.add(e);let n=Hs(16752704,.5,.4);return n.position.y=.25,s.add(n),s.userData.flame=e,s}function Hd(){let s=new Jt,t=Yt({color:2763306}),e=new Et(new In(1.5,1.5),Li({color:0}));e.rotation.x=-Math.PI/2,e.position.y=.01,s.add(e);let n=Hs(16723984,2.2,0);n.position.y=.2,s.add(n);for(let[a,l,c,h]of[[0,-.8,1.7,.1],[0,.8,1.7,.1],[-.8,0,.1,1.5],[.8,0,.1,1.5]])s.add(Tt(c,.06,h,t,a,.03,l));let i=ue(s,0,.05,-.75);i.add(Tt(1.5,.07,1.5,Yt({map:fe("hatch")}),0,0,.75));let r=new Jt,o=Yt({color:5591114});for(let a of[Math.PI/4,-Math.PI/4]){let l=new Et(new Ce(.03,.03,2,4),o);l.rotation.set(Math.PI/2,0,0);let c=new Jt;c.rotation.y=a,c.position.y=.12,c.add(l),r.add(c)}return r.add(Tt(.2,.22,.1,Yt({color:9072672,emissive:1708032}),0,.16,0)),s.add(r),{group:s,door:i,chains:r,glow:n}}function Gd(s){let t=new Jt,e=Yt({color:5913120,map:fe("wood",5)});for(let r of[-1,1])t.add(Tt(.25,3,.4,e,r*s/2,1.5,0));t.add(Tt(s+.25,.3,.4,e,0,3,0));let n=ue(t,-s/2+.1,0,.1);n.add(Tt(s*.85,2.85,.12,e,s*.85/2,1.45,0)),n.rotation.y=-1.9;let i=new Et(new In(2,2),Li({map:fe("rune"),transparent:!0,blending:si,depthWrite:!1,color:4521881}));return i.rotation.x=-Math.PI/2,i.position.y=.02,t.add(i),{group:t,rune:i}}function Vd(){let s=new Jt,t=new en({color:3815998,emissive:2500138}),e=new en({color:4860438,emissive:3021324}),n=new en({color:9071192,emissive:3811360}),i=new en({color:1841172,emissive:1315344}),r=new Jt;r.add(Tt(.045,.05,.32,t,0,.035,-.2)),r.add(Tt(.012,.025,.02,t,0,.07,-.34));let o=new Et(new Ce(.048,.048,.1,8),t);o.rotation.x=Math.PI/2,o.position.set(0,0,-.02),r.add(o),r.add(Tt(.05,.08,.1,t,0,.01,.06));let a=Tt(.045,.15,.065,e,0,-.08,.11);a.rotation.x=.35,r.add(a),r.add(Tt(.075,.09,.12,n,0,-.1,.14)),r.add(Tt(.085,.085,.14,i,0,-.12,.25)),r.position.set(.2,-.2,-.55),r.scale.setScalar(.65),s.add(r);let l=new mi(new ii({map:fe("glow"),color:16764006,transparent:!0,blending:si,depthWrite:!1,opacity:0}));l.scale.set(.35,.35,.35),l.position.set(0,.035,-.42),r.add(l);let c=new Jt,h=new Et(new Ce(.03,.03,.24,8),t);h.rotation.x=Math.PI/2,c.add(h);let d=new Et(new Ce(.03,.05,.07,8),t);d.rotation.x=Math.PI/2,d.position.z=-.15,c.add(d);let u=new Et(new As(.044,10),new gi({color:16773836}));return u.position.z=-.187,u.rotation.y=Math.PI,c.add(u),c.add(Tt(.07,.08,.1,n,0,-.03,.06)),c.add(Tt(.08,.08,.12,i,0,-.05,.17)),c.position.set(-.22,-.22,-.5),c.scale.setScalar(.65),s.add(c),s.traverse(f=>{f.isMesh&&(f.castShadow=!1,f.renderOrder=10)}),{group:s,gun:r,torch:c,flash:l,lens:u}}var h_={grunt:{hp:90,radius:.42,walk:2,run:5.55,sight:1,fov:2.1,stride:1.4,gold:18},hound:{hp:30,radius:.32,walk:2.6,run:5.9,sight:1.25,fov:2.4,stride:.55,gold:12},brute:{hp:420,radius:.75,walk:1.6,run:4.9,sight:0,fov:0,stride:2.1,gold:90},angel:{hp:1/0,radius:.4,walk:0,run:11.5,sight:0,fov:0,stride:0,gold:0}},PM=new L,hl=class{constructor(t,e,n,i){this.game=t,this.type=e;let r=h_[e];this.s=r,this.hp=r.hp,this.maxHp=r.hp,this.radius=r.radius,this.pos=new L(n,0,i),this.yaw=Math.random()*Math.PI*2,this.model=e==="grunt"?Sd():e==="brute"?bd():e==="hound"?wd():Td(),this.root=this.model.root,this.root.traverse(o=>{o.isMesh&&(o.userData.enemy=this)}),t.level.group.add(this.root),this.state="patrol",this.stateT=0,this.path=null,this.pathI=0,this.pathGoal=null,this.repath=0,this.target=null,this.lastSeen=new L(n,0,i),this.lostT=0,this.attackCd=0,this.attackAnim=0,this.windup=0,this.stun=0,this.knowsSpot=null,this.speedNow=0,this.phase=Math.random()*10,this.stepDist=0,this.vocalCd=3+Math.random()*8,this.shriekCd=0,this.enraged=0,this.fightWith=null,this.deadT=0,this.pauseT=0,this.jaw=0,this.awake=!1,this.observed=!1,this.wasMoving=!1,this.movedRecently=0,this.grind=null,this.flinch=0,e==="angel"&&(this.pose=Math.floor(Math.random()*2),ll(this.model,this.pose)),this.syncModel(0)}get alive(){return this.state!=="dead"}get hunting(){return!this.alive||this.stun>0?!1:this.type==="angel"?this.awake&&this.movedRecently>0:["chase","alert","pullout","shriek","charge","bark"].includes(this.state)||this.enraged>0}setState(t){this.state!=="dead"&&(t==="bark"&&this.state!=="bark"&&(this.shriekCd=Math.min(this.shriekCd,.6)),this.state=t,this.stateT=0,this.path=null)}dist(){let t=this.game.player;return Me(this.pos.x,this.pos.z,t.pos.x,t.pos.z)}canSee(t=!1){if(this.s.sight===0)return!1;let e=this.game.player;if(!e.alive||e.inSafe||e.hidden&&!t)return!1;let n=this.dist(),i=e.visibility()*this.s.sight;if(n>i)return!1;let r=["chase","pullout","bark","alert"].includes(this.state);if(n>2.2&&!r){let o=Math.atan2(e.pos.x-this.pos.x,e.pos.z-this.pos.z);if(Math.abs(qr(this.yaw,o))>this.s.fov/2)return!1}return this.game.level.world.los(this.pos.x,this.pos.z,e.pos.x,e.pos.z)}hear(t){if(!this.alive||this.stun>0||this.type==="angel"||this.state==="fight")return;let e=this.type==="brute"?t.kind==="glass"?2:1.5:this.type==="hound"?1:.85,n=Me(this.pos.x,this.pos.z,t.x,t.z);if(!(n>t.r*e)&&!(t.kind==="hide"&&this.type!=="brute")){if(this.type==="brute"){(t.kind==="player"||t.kind==="glass"||t.kind==="gun"||t.kind==="hide")&&n<11?(this.state!=="charge"&&this.game.audio.growl("brute",this.pos),this.setState("charge"),this.target=new L(t.x,0,t.z),this.lastHeard=this.game.time):this.state!=="charge"&&this.state!=="pullout"?(this.state==="patrol"&&this.game.audio.growl("brute",this.pos,.6),this.setState("investigate"),this.target=new L(t.x,0,t.z)):this.state==="charge"&&(this.target=new L(t.x,0,t.z));return}["chase","alert","shriek","pullout","bark"].includes(this.state)||(this.setState("investigate"),this.target=new L(t.x,0,t.z))}}alerted(t,e,n){if(!(!this.alive||this.type==="angel"||this.stun>0||this.state==="fight")){if(n&&this.game.player.hidden===n){this.knowsSpot=n,this.setState("pullout");return}if(this.type!=="hound"&&!["chase","pullout"].includes(this.state)){if(this.type==="brute"){this.setState("charge"),this.target=new L(t,0,e),this.lastHeard=this.game.time;return}this.setState("investigate"),this.target=new L(t,0,e),this.alertRun=!0}}}goTo(t,e,n,i,r=.6){let o=this.game.level.world,a=Me(this.pos.x,this.pos.z,t,e);if(a<r)return this.speedNow=0,!0;if(this.repath-=i,!this.path||!this.pathGoal||Me(this.pathGoal.x,this.pathGoal.z,t,e)>1.2||this.repath<=0){if(this.path=o.findPath(this.pos.x,this.pos.z,t,e),this.pathI=0,this.pathGoal={x:t,z:e},this.repath=.5+Math.random()*.4,!this.path)return this.speedNow=0,this.unreachable=(this.unreachable||0)+1,!1;this.unreachable=0}if(!this.path)return!1;for(let m=0;m<3&&this.pathI<this.path.length-1;m++){let p=this.path[this.pathI+1];if(o.clearLine(this.pos.x,this.pos.z,p.x,p.z,this.radius))this.pathI++;else break}let l=this.path[this.pathI],c=l.x-this.pos.x,h=l.z-this.pos.z,d=Math.hypot(c,h);if(d<.25&&this.pathI<this.path.length-1&&(this.pathI++,l=this.path[this.pathI],c=l.x-this.pos.x,h=l.z-this.pos.z,d=Math.hypot(c,h)),d<1e-4)return this.speedNow=0,a<r+.4;let u=Math.min(n*i,d),f=this.pos.x,g=this.pos.z;this.pos.x+=c/d*u,this.pos.z+=h/d*u,o.collide(this.pos,this.radius,!0);let v=Math.hypot(this.pos.x-f,this.pos.z-g);return this.speedNow=v/Math.max(i,1e-4),this.yaw=Qc(this.yaw,Math.atan2(c,h),this.type==="angel"?30:8,i),this.stepDist+=v,!1}face(t,e,n,i=8){this.yaw=Qc(this.yaw,Math.atan2(t-this.pos.x,e-this.pos.z),i,n)}pickPatrol(){let t=this.game.level,e=t.d.rooms;for(let n=0;n<8;n++){let i=e[1+Math.floor(Math.random()*(e.length-1))],r=(i.x+.5+Math.random()*(i.w-1))*3,o=(i.y+.5+Math.random()*(i.h-1))*3,[a,l]=t.world.tileOf(r,o);if(t.world.walkableForMonster(a,l)&&!(n<6&&Me(r,o,this.pos.x,this.pos.z)>55)){this.target=new L(r,0,o);return}}this.target=this.pos.clone()}hit(t){if(!this.alive||this.type==="angel")return;this.hp-=t,this.flinch=1;let e=this.game;if(e.audio.flesh(this.pos),this.hp<=0){this.die();return}this.type==="brute"?(this.enraged=6,e.audio.growl("brute",this.pos,1.3),this.setState("charge"),this.target=e.player.pos.clone()):this.state!=="fight"&&this.stun<=0&&(this.lastSeen.copy(e.player.pos),this.type==="hound"&&this.state!=="chase"?this.startShriek():this.state!=="chase"&&(this.setState("chase"),e.audio.growl(this.type,this.pos)))}die(){let t=this.game;this.state="dead",this.deadT=0,this.speedNow=0,t.audio.monsterDeath(this.type,this.pos),t.player.stats.kills++,this.fightWith&&this.fightWith.fightWith===this&&(this.fightWith.fightWith=null,this.fightWith.setState("search")),this.s.gold&&t.level.addGold(this.pos.x,this.pos.z,this.s.gold+t.levelNum*3),this.grind?.stop(),this.grind=null}trap(t,e){return this.type==="angel"||!this.alive?!1:(this.stun=t,this.hit(e),this.alive&&(this.game.audio.growl(this.type,this.pos,1.2),this.setState("stunned")),!0)}startShriek(){this.setState("shriek"),this.shriekCd=7}doShriek(t){let e=this.game;e.audio.shriek(this.pos),e.alert(this.pos.x,this.pos.z,40,t,this),this.jaw=1}update(t){this.stateT+=t,this.attackCd=Math.max(0,this.attackCd-t),this.attackAnim=Math.max(0,this.attackAnim-t*3),this.flinch=Math.max(0,this.flinch-t*4),this.jaw=Math.max(0,this.jaw-t*.8),this.vocalCd-=t,this.shriekCd-=t,this.enraged=Math.max(0,this.enraged-t),this.movedRecently=Math.max(0,this.movedRecently-t);let e=this.game,n=e.player;if(this.state==="dead"){this.deadT+=t,this.syncModel(t);return}if(this.stun>0){this.stun-=t,this.speedNow=0,this.stun<=0&&(this.setState("investigate"),this.target=n.pos.clone()),this.syncModel(t);return}this.type==="angel"?this.updateAngel(t):this.type==="brute"?this.updateBrute(t):this.updateSighted(t);let i=this.s.stride;i&&this.stepDist>i&&(this.stepDist=0,this.dist()<32&&e.audio.monsterStep(this.type,this.pos)),this.vocalCd<=0&&this.type!=="angel"&&(this.vocalCd=5+Math.random()*9,this.dist()<28&&e.audio.growl(this.type,this.pos,this.hunting?1:.55)),this.syncModel(t)}updateSighted(t){let e=this.game,n=e.player,i=this.type==="hound",r=this.canSee(),o=this.dist();switch(r&&["patrol","investigate","search"].includes(this.state)&&(this.lastSeen.copy(n.pos),i?this.startShriek():(this.setState("alert"),e.audio.growl("grunt",this.pos,1.2),e.anyHunting()||e.audio.stinger())),this.state){case"patrol":{if(!this.target||this.pauseT>0){this.pauseT-=t,this.speedNow=0,this.pauseT<=0&&!this.target&&this.pickPatrol();break}(this.goTo(this.target.x,this.target.z,this.s.walk,t,.8)||this.unreachable>2||this.stateT>40)&&(this.target=null,this.pauseT=1+Math.random()*3,this.stateT=0);break}case"alert":{this.speedNow=0,this.face(n.pos.x,n.pos.z,t,12),this.attackAnim=.4,this.stateT>.45&&this.setState("chase");break}case"shriek":{this.speedNow=0,this.face(n.pos.x,n.pos.z,t,12),this.stateT<t*1.5&&this.doShriek(null),this.stateT>.9&&this.setState("chase");break}case"chase":{if(n.inSafe||!n.alive){this.setState("search");break}if(n.hidden){this.knowsSpot===n.hidden?this.setState(i?"bark":"pullout"):(this.setState("investigate"),this.target=this.lastSeen.clone(),this.alertRun=!0);break}if(r?(this.lastSeen.copy(n.pos),this.lostT=0):this.lostT+=t,i&&r&&this.shriekCd<=0&&(this.shriekCd=8,this.doShriek(null)),o<(i?1.25:1.55)&&r)this.face(n.pos.x,n.pos.z,t,14),this.speedNow=0,this.attack(t);else{this.windup=0;let l=r?n.pos:this.lastSeen,c=this.goTo(l.x,l.z,this.s.run,t,.5);(!r&&c||this.lostT>6)&&this.setState("search")}break}case"investigate":{let a=this.alertRun?this.s.run*.85:this.s.walk*1.5;(this.goTo(this.target.x,this.target.z,a,t,1)||this.unreachable>2||this.stateT>25)&&(this.alertRun=!1,this.setState("search"));break}case"search":{this.speedNow=0,this.yaw+=Math.sin(this.stateT*2.2)*t*2.2,this.stateT>3.5+Math.random()*.02&&(this.knowsSpot=null,this.setState("patrol"),this.target=null,this.pauseT=.3);break}case"pullout":{let a=this.knowsSpot;if(!a||n.hidden!==a){this.knowsSpot=null,n.alive&&!n.inSafe&&!n.hidden?(this.lastSeen.copy(n.pos),this.setState("chase")):this.setState("search");break}(this.goTo(a.exit.x,a.exit.z,this.s.run,t,.7)||Me(this.pos.x,this.pos.z,a.exit.x,a.exit.z)<1)&&(this.face(a.x,a.z,t,14),this.attackAnim=1,e.pullOut(this,30),this.knowsSpot=null,this.attackCd=1.4,this.lastSeen.copy(n.pos),this.setState("chase"));break}case"bark":{let a=this.knowsSpot;if(!a||n.hidden!==a){this.knowsSpot=null,this.setState(n.alive&&!n.inSafe&&!n.hidden?"chase":"search");break}this.goTo(a.exit.x,a.exit.z,this.s.run,t,.8)&&(this.face(a.x,a.z,t,10),this.shriekCd<=0&&(this.shriekCd=3.5,this.doShriek(a)));break}case"fight":this.updateFight(t);break;case"stunned":this.setState("search");break}}attack(t){let e=this.game,n=e.player;if(this.attackCd>0)return;this.windup+=t,this.attackAnim=Math.min(1,this.windup*3);let i=this.type==="hound"?.2:this.type==="brute"?.55:.35;if(this.windup>=i){this.windup=0,this.attackCd=this.type==="hound"?.75:this.type==="brute"?1.7:1.1,this.attackAnim=1,e.audio.swipe(this.pos);let r=this.type==="brute"?2.4:this.type==="hound"?1.6:2;if(this.dist()<r&&!n.hidden&&n.alive){let o=this.type==="hound"?9:this.type==="brute"?42:20;n.damage(o,this.type),this.type==="hound"&&(this.jaw=1)}}}updateBrute(t){let e=this.game,n=e.player,i=this.dist(),r=n.alive&&!n.hidden&&!n.inSafe;switch(r&&i<2.6&&(n.moving||i<1.8)&&this.state!=="fight"&&(this.state!=="charge"&&e.audio.growl("brute",this.pos,1.2),this.state!=="charge"&&this.setState("charge"),this.target=n.pos.clone(),this.lastHeard=e.time),this.enraged>0&&r&&this.state!=="fight"&&(this.state!=="charge"&&this.setState("charge"),this.target=n.pos.clone(),this.lastHeard=e.time),this.state){case"patrol":{if(!this.target||this.pauseT>0){this.pauseT-=t,this.speedNow=0,this.pauseT<=0&&!this.target&&this.pickPatrol();break}(this.goTo(this.target.x,this.target.z,this.s.walk,t,.9)||this.unreachable>2||this.stateT>45)&&(this.target=null,this.pauseT=2+Math.random()*3,this.stateT=0);break}case"investigate":{(this.goTo(this.target.x,this.target.z,3,t,1)||this.unreachable>2||this.stateT>25)&&this.setState("search");break}case"charge":{if(n.inSafe){this.setState("search");break}if(r&&i<2){this.face(n.pos.x,n.pos.z,t,10),this.speedNow=0,this.attack(t);break}if(this.windup=0,n.hidden&&this.knowsSpot===n.hidden){this.setState("pullout");break}let o=this.enraged>0?this.s.run*1.12:this.s.run;(this.goTo(this.target.x,this.target.z,o,t,1)||this.unreachable>2||e.time-(this.lastHeard||0)>7)&&this.setState("search");break}case"search":{this.speedNow=0,this.yaw+=Math.sin(this.stateT*1.5)*t*1.5,this.stateT>4&&(this.knowsSpot=null,this.setState("patrol"),this.target=null);break}case"pullout":{let o=this.knowsSpot;if(!o||n.hidden!==o){this.knowsSpot=null,this.setState("search");break}(this.goTo(o.exit.x,o.exit.z,this.s.run,t,.9)||Me(this.pos.x,this.pos.z,o.exit.x,o.exit.z)<1.2)&&(this.face(o.x,o.z,t,14),this.attackAnim=1,e.pullOut(this,40),this.knowsSpot=null,this.attackCd=1.8,this.target=n.pos.clone(),this.lastHeard=e.time,this.setState("charge"));break}case"fight":this.updateFight(t);break;case"stunned":this.setState("search");break}}updateFight(t){let e=this.fightWith;if(!e||!e.alive){this.fightWith=null,this.setState("search");return}if(this.speedNow=0,this.face(e.pos.x,e.pos.z,t,10),Me(this.pos.x,this.pos.z,e.pos.x,e.pos.z)>2.2){this.goTo(e.pos.x,e.pos.z,2.5,t,1.6);return}if(this.attackCd<=0){let i=this.type==="brute";this.attackCd=i?1.35:.85,this.attackAnim=1,this.game.audio.swipe(this.pos);let r=i?30+Math.random()*10:9+Math.random()*6;!i&&Math.random()<.08&&(r*=4),e.hp-=r,e.flinch=1,this.game.audio.flesh(e.pos),e.hp<=0&&e.die()}this.stateT>1.5&&Math.random()<t*.7&&(this.game.emitNoise(this.pos.x,this.pos.z,16,"fight"),this.game.audio.growl(this.type,this.pos,1.1))}updateAngel(t){let e=this.game,n=e.player,i=this.dist(),r=e.level.world,o=n.alive&&!n.hidden&&!n.inSafe;if(this.observed=e.isObserved(this),this.awake?(i>42||!n.alive)&&(this.awake=!1):o&&i<24&&r.los(this.pos.x,this.pos.z,n.pos.x,n.pos.z)&&(this.awake=!0),!(this.awake&&o&&!this.observed)){this.wasMoving&&this.observed&&(this.pose=i<10?2+Math.floor(Math.random()*2):Math.floor(Math.random()*3),ll(this.model,this.pose)),this.wasMoving=!1,this.speedNow=0,this.grind?.set(this.pos,0);return}if(this.wasMoving||(this.pose=i<10?2+Math.floor(Math.random()*2):Math.floor(Math.random()*2),ll(this.model,this.pose)),this.wasMoving=!0,this.movedRecently=2.5,!this.grind&&e.audio.ctx&&(this.grind=e.audio.loop(240,2.5)),this.grind?.set(this.pos,1),i<1.15){e.killPlayer("angel",this);return}this.goTo(n.pos.x,n.pos.z,this.s.run,t,.9),this.yaw=Math.atan2(n.pos.x-this.pos.x,n.pos.z-this.pos.z)}syncModel(t){let e=this.model;if(this.root.position.set(this.pos.x,0,this.pos.z),this.root.rotation.y=this.yaw,this.type==="angel")return;if(this.state==="dead"){let h=Math.min(1,this.deadT/.7),d=h*h;this.root.rotation.order="YXZ",e.quad?this.root.rotation.z=d*1.45:this.root.rotation.x=-d*1.45,this.root.position.y=d*.12,e.jaw.rotation.x=.4;for(let u of e.arms)u.sh.rotation.x=-1.2*d;return}let n=this.speedNow,i=this.type==="hound"?2.8:this.type==="brute"?1.9:2.3;this.phase+=t*Math.max(n,0)*i;let r=Math.min(1,n/3)*(this.type==="hound"?.8:.65),o=Math.sin(this.phase);for(let h of e.legs)e.quad?(h.hip.rotation.x=Math.sin(this.phase*1.6+(h.s>0?0:Math.PI))*r,h.knee.rotation.x=Math.max(0,-Math.sin(this.phase*1.6+(h.s>0?0:Math.PI)))*r*.9):(h.hip.rotation.x=o*r*h.s,h.knee.rotation.x=Math.max(0,o*h.s)*r*1.1);let a=this.attackAnim;for(let h of e.arms){let d=-o*r*.6*h.s;h.sh.rotation.x=d-a*2.2-(this.state==="chase"?.5:0),h.sh.rotation.z=h.s*(.08+a*.25),h.fore.rotation.x=-.25-a*.6}let l=this.game.time,c=e.baseLean+(n>3.5?.15:0)+this.flinch*-.3;e.torso.rotation.x=c+Math.sin(l*1.7+this.phase)*.03,e.hips.position.y=(e.quad?.5:e.height===2.8?1.3:.95)+Math.abs(Math.sin(this.phase))*.04,this.type==="grunt"&&Math.random()<.01&&(this.twitch=.25),this.twitch=Math.max(0,(this.twitch||0)-t),e.head.rotation.z=this.twitch>0?Math.sin(l*60)*.25:Math.sin(l*.7)*.08,e.jaw.rotation.x=Math.max(this.jaw,a*.5)*.6,e.tail&&(e.tail.rotation.y=Math.sin(l*9)*.4),e.quad&&(e.head.rotation.x=-this.jaw*.5)}dispose(){this.grind?.stop(),this.grind=null}};var u_={locker:{w:.85,d:.6,label:"Hide in locker"},closet:{w:1.3,d:.72,label:"Hide in wardrobe"},bed:{w:2,d:1.05,label:"Crawl under bed"},bench:{w:2,d:.56,label:"Crawl under bench"}},ul=class{constructor(t,e,n){this.game=t,t.level=this,this.num=e,this.d=gd(e,n),this.rng=new Ae((n^2654435769)>>>0),this.world=new al(this.d),this.group=new Jt,t.scene.add(this.world.group),t.scene.add(this.group),this.hiding=[],this.crates=[],this.golds=[],this.ammos=[],this.diamonds=[],this.bearTraps=[],this.wires=[],this.torches=[],this.candles=[],this.glassTiles=new Set,this.enemies=[],this.needed=this.d.diamonds.length,this.found=0,this.mapOwned=!1,this.unlocked=!1,this.revealT=0,this.lightT=0;let i=this.d.W,r=this.d.H;this.explored=new Uint8Array(i*r),this.mapCanvas=document.createElement("canvas"),this.mapCanvas.width=i,this.mapCanvas.height=r,this.mapCtx=this.mapCanvas.getContext("2d"),this.mapCtx.fillStyle="#000",this.mapCtx.fillRect(0,0,i,r),this.buildSafeRoom(),this.buildHiding(),this.buildCrates(),this.buildPickups(),this.buildTraps(),this.buildTorches(),this.buildDecor();for(let o of this.d.enemies)this.enemies.push(new hl(t,o.type,o.x,o.z));for(let o=this.d.safe.y-1;o<=this.d.safe.y+this.d.safe.h;o++)for(let a=this.d.safe.x-1;a<=this.d.safe.x+this.d.safe.w;a++)this.markExplored(a,o)}buildSafeRoom(){let t=this.d,e=t.safeWorld,n=t.door.dir,i=t.safe.w*3/2,r=[-n[1],n[0]],o=Math.atan2(n[0],n[1]),a=zd(),l=e.cx-n[0]*(i-1),c=e.cz-n[1]*(i-1);a.group.position.set(l,0,c),a.group.rotation.y=o,this.group.add(a.group),this.keeper={x:l,z:c,eyes:a.eyes,label:"Trade with the Keeper"};let h=Math.abs(n[0])?1.4:1.95,d=Math.abs(n[0])?1.95:1.4;this.world.addCollider(l-h/2,c-d/2,l+h/2,c+d/2);let u=e.cx-n[0]*(i-2)+r[0]*(i-2),f=e.cz-n[1]*(i-2)+r[1]*(i-2),g=Hd();g.group.position.set(u,0,f),g.group.rotation.y=o,this.group.add(g.group),this.hatch={x:u,z:f,...g,open:0};let v=oi(th(!0)),m=e.cx-n[0]*(i-2.2)-r[0]*(i-.65),p=e.cz-n[1]*(i-2.2)-r[1]*(i-.65);v.position.set(m,0,p),v.rotation.y=Math.atan2(r[0],r[1]),this.group.add(v);let M=Math.abs(r[0])?1.1:2.05,E=Math.abs(r[0])?2.05:1.1;this.world.addCollider(m-M/2,p-E/2,m+M/2,p+E/2);let _=new Et(new In(3,4.5),new en({map:fe("rug")}));_.rotation.x=-Math.PI/2,_.rotation.z=o,_.position.set(e.cx,.01,e.cz),this.group.add(_);for(let[y,A]of[[1,1],[1,-1],[-1,1],[-1,-1]]){let P=nh();P.position.set(e.cx+y*(i-.5),0,e.cz+A*(i-.5)),!(Math.hypot(P.position.x-u,P.position.z-f)<1.5)&&(this.group.add(P),this.candles.push(P))}let b=Gd(3-.5),w=(t.door.x+.5)*3,I=(t.door.y+.5)*3;b.group.position.set(w+n[0]*3/2,0,I+n[1]*3/2),b.group.rotation.y=Math.atan2(r[0],r[1])+Math.PI/2,this.group.add(b.group),b.group.remove(b.rune),b.rune.position.set(w,.02,I),this.group.add(b.rune),this.rune=b.rune,this.safeLightPos=new L(l+n[0]*1.5,2.6,c+n[1]*1.5)}buildHiding(){for(let t of this.d.hiding){let e=u_[t.kind],n=t.kind==="locker"?Ed():oi(t.kind==="closet"?Ad():t.kind==="bed"?th():Rd());n.position.set(t.x,0,t.z),n.rotation.y=t.angle,this.group.add(n);let i=t.fx!==0?e.d:e.w,r=t.fx!==0?e.w:e.d,o=this.world.addCollider(t.x-i/2,t.z-r/2,t.x+i/2,t.z+r/2),a=e.d/2+.7;this.hiding.push({kind:t.kind,x:t.x,z:t.z,fx:t.fx,fz:t.fz,exit:{x:t.x+t.fx*a,z:t.z+t.fz*a},model:n,collider:o,label:e.label})}}buildCrates(){for(let t of this.d.crates){let e=Cd(t.locked);e.group.position.set(t.x,0,t.z),e.group.rotation.y=t.angle,this.group.add(e.group),this.world.addCollider(t.x-.55,t.z-.55,t.x+.55,t.z+.55),this.crates.push({x:t.x,z:t.z,locked:t.locked,opened:!1,lid:e.lid,open:0,model:e.group})}}buildPickups(){for(let t of this.d.gold)this.addGold(t.x,t.z,t.value);for(let t of this.d.ammo){let e=oi(Ld(),!1);e.position.set(t.x,0,t.z),e.rotation.y=this.rng.range(0,6.28),this.group.add(e),this.ammos.push({x:t.x,z:t.z,model:e,taken:!1})}for(let t of this.d.diamonds){let e=Pd();e.group.position.set(t.x,1,t.z),this.group.add(e.group),this.diamonds.push({x:t.x,z:t.z,...e,taken:!1,known:!1})}}addGold(t,e,n){let i=oi(Id(n),!1);i.position.set(t,0,e),this.group.add(i),this.golds.push({x:t,z:e,value:n,model:i,taken:!1})}addBearTrap(t,e,n){let i=Nd();i.group.position.set(t,0,e),i.group.rotation.y=this.rng.range(0,6.28),this.group.add(i.group),this.bearTraps.push({x:t,z:e,owned:n,armed:!0,jaws:i.jaws,model:i.group,holding:null,holdT:0})}buildTraps(){let t=this.d;for(let e of t.pits){let n=Ud(26,3-.4);n.position.set((e.tx+.5)*3,-2.4,(e.ty+.5)*3),this.group.add(n);let i=oi(eh(this.rng,!0),!1);i.position.set((e.tx+.5)*3+.4,-2.4+.05,(e.ty+.5)*3-.3),this.group.add(i)}for(let e of t.bearTraps)this.addBearTrap(e.x,e.z,!1);for(let e of t.tripwires){let n=Od(3);n.group.position.set(e.x,0,e.z),n.group.rotation.y=e.alongX?Math.PI/2:0,this.group.add(n.group),this.wires.push({...e,...n,triggered:!1,t:0})}for(let e of t.glass){let n=oi(Fd(this.rng),!1);n.position.set((e.tx+.5)*3,0,(e.ty+.5)*3),this.group.add(n),this.glassTiles.add(e.ty*t.W+e.tx)}}buildTorches(){for(let t of this.d.torches){let e=Dd();e.group.position.set(t.x,0,t.z),e.group.rotation.y=Math.atan2(t.fx,t.fz),this.group.add(e.group);let n=new L(t.x+t.fx*.35,2.4,t.z+t.fz*.35);this.torches.push({...e,pos:n,phase:this.rng.range(0,10)})}}buildDecor(){for(let t of this.d.decor){let e;t.kind==="blood"?(e=Bd(this.rng),e.scale.set(t.s*1.6,t.s*1.6,1),e.position.set(t.x,.012,t.z),e.rotation.z=t.rot):t.kind==="chain"?(e=oi(kd()),e.position.set(t.x,3.6,t.z)):(e=oi(eh(this.rng,t.kind==="skull"),!1),e.position.set(t.x,0,t.z),e.rotation.y=t.rot),this.group.add(e)}}markExplored(t,e){let n=this.d.W;if(t<0||e<0||t>=n||e>=this.d.H)return;let i=e*n+t;if(this.explored[i])return;this.explored[i]=1;let r=this.d.tiles[i],o=this.mapCtx;r===Bt.ROCK?o.fillStyle="#2a2420":r===Bt.SAFE?o.fillStyle="#3f7a46":r===Bt.DOOR?o.fillStyle="#7affa0":r===Bt.PIT?o.fillStyle="#8a1c1c":o.fillStyle=this.glassTiles.has(i)?"#8a9aa8":"#857462",o.fillRect(t,e,1,1)}revealAround(t,e){let n=this.world,[i,r]=n.tileOf(t,e),o=5;for(let a=r-o;a<=r+o;a++)for(let l=i-o;l<=i+o;l++){if(l<0||a<0||l>=this.d.W||a>=this.d.H||this.explored[a*this.d.W+l])continue;let c=(l+.5)*3,h=(a+.5)*3,d=Math.hypot(c-t,h-e);if(d>o*3)continue;n.t(l,a)===Bt.ROCK?n.rayDist(t,e,c,h)>=d-3*.75&&this.markExplored(l,a):n.los(t,e,c,h)&&this.markExplored(l,a)}for(let a of this.diamonds)a.known||a.taken||Me(a.x,a.z,t,e)<16&&n.los(t,e,a.x,a.z)&&(a.known=!0,this.game.ui.message("You glimpse a diamond glinting in the dark...","diamond"))}revealAll(){this.mapOwned=!0;let t=this.mapCtx,e=this.d.W;for(let n=0;n<this.d.H;n++)for(let i=0;i<e;i++){let r=n*e+i;this.explored[r]||this.d.tiles[r]===Bt.ROCK||(t.fillStyle=this.d.tiles[r]===Bt.PIT?"#4a1414":"#3c3644",t.fillRect(i,n,1,1))}for(let n of this.diamonds)n.known=!0}interactables(){let t=[];for(let e of this.hiding)t.push({type:"hide",obj:e,x:e.x,z:e.z,label:e.label,range:2});for(let e of this.crates)e.opened||t.push({type:"crate",obj:e,x:e.x,z:e.z,label:e.locked?"Open locked crate":"Open crate",range:1.9});return t.push({type:"keeper",obj:this.keeper,x:this.keeper.x,z:this.keeper.z,label:this.keeper.label,range:2.6}),t.push({type:"hatch",obj:this.hatch,x:this.hatch.x,z:this.hatch.z,label:this.unlocked?`Descend to level ${this.num+1}`:"The hatch is chained shut",range:1.9}),t}openCrate(t){let e=this.game,n=e.player,i=e.ui;if(t.locked){if(n.inv.key<=0){e.audio.rattle(),i.message("Locked tight. A skeleton key would open it.","dim");return}n.inv.key--,i.message("The skeleton key turns... and crumbles to dust.","dim")}t.opened=!0,e.audio.crate(t.locked),e.emitNoise(t.x,t.z,Sn.crate,"player");let r=this.rng,o=this.num,a=[];if(t.locked){a.push(["gold",r.int(80,150)+o*12]);let l=r.next();l<.12?a.push(["life",1]):l<.45?a.push(["medkit",1]):l<.7?a.push(["ammo",6]):l<.85?a.push(["beartrap",1]):a.push(["gold",r.int(40,80)])}else{let l=r.next();l<.45?a.push(["gold",r.int(20,45)+o*4]):l<.63?a.push(["ammo",r.int(2,5)]):l<.75?a.push(["medkit",1]):l<.83?a.push(["beartrap",1]):l<.88?a.push(["key",1]):a.push(["nothing",0])}for(let[l,c]of a)if(l==="gold"){let h=n.addGold(c);i.message(`+${h} gold`,"gold"),e.audio.coin()}else l==="ammo"?(n.reserve+=c,i.message(`+${c} revolver rounds`,"good")):l==="medkit"?(n.inv.medkit++,i.message("Found a med kit","good")):l==="beartrap"?(n.inv.beartrap++,i.message("Found a bear trap","good")):l==="key"?(n.inv.key++,i.message("Found a skeleton key","good")):l==="life"?(n.lives++,i.message("A strange relic... +1 LIFE","diamond")):i.message("Empty. Only dust and bone.","dim");a.some(([l])=>l!=="gold"&&l!=="nothing")&&e.audio.pickup()}update(t){let e=this.game,n=e.player,i=e.time;for(let r of this.diamonds)r.taken||(r.group.position.y=1+Math.sin(i*2+r.x)*.12,r.gem.rotation.y+=t*1.5,r.glow.material.opacity=.7+Math.sin(i*3)*.2,n.alive&&!n.hidden&&Me(r.x,r.z,n.pos.x,n.pos.z)<1.1&&n.pos.y>-.5&&(r.taken=!0,r.group.visible=!1,this.found++,n.stats.diamonds++,e.audio.diamond(),this.found>=this.needed?(this.unlocked=!0,this.hatch.chains.visible=!1,e.audio.allDiamonds(),e.ui.message("All diamonds found! Return to the safe room and descend.","diamond",6),e.ui.banner("THE WAY DOWN IS OPEN","Return to the sanctuary",3.5)):e.ui.message(`Diamond found (${this.found}/${this.needed})`,"diamond")));for(let r of this.golds)if(!r.taken&&n.alive&&!n.hidden&&Me(r.x,r.z,n.pos.x,n.pos.z)<.95&&n.pos.y>-.5){r.taken=!0,r.model.visible=!1;let o=n.addGold(r.value);e.audio.coin(),e.ui.message(`+${o} gold`,"gold")}for(let r of this.ammos)r.taken||n.alive&&!n.hidden&&Me(r.x,r.z,n.pos.x,n.pos.z)<.95&&(r.taken=!0,r.model.visible=!1,n.reserve+=4,e.audio.pickup(),e.ui.message("+4 revolver rounds","good"));for(let r of this.crates)r.opened&&r.open<1&&(r.open=Math.min(1,r.open+t*2),r.lid.rotation.x=-r.open*1.9);this.unlocked&&this.hatch.open<1&&(this.hatch.open=Math.min(1,this.hatch.open+t*.6),this.hatch.door.rotation.x=-this.hatch.open*1.75,this.hatch.glow.material.opacity=this.hatch.open*.9,this.hatch.open===1&&e.audio.hatch()),this.unlocked&&(this.hatch.glow.material.opacity=.75+Math.sin(i*2)*.15),this.rune.material.opacity=.55+Math.sin(i*1.3)*.25;for(let r of this.candles){let o=r.userData.flame;o.scale.y=.12*(.85+Math.random()*.3)}this.keeper.eyes.forEach(r=>r.visible=Math.sin(i*.6)>-.97);for(let r of this.enemies)if(!r.hunting&&Me(r.pos.x,r.pos.z,n.pos.x,n.pos.z)>55){if(r.lodAcc=(r.lodAcc||0)+t,r.lodAcc<.2)continue;r.update(r.lodAcc),r.lodAcc=0}else r.update(t);this.enemyInteractions(t),this.updateTraps(t);for(let r of this.torches){let o=.85+Math.sin(i*13+r.phase)*.08+Math.random()*.1;r.flame.scale.set(.25*o,.45*o,1),r.glow.material.opacity=.35*o}this.revealT-=t,this.revealT<=0&&(this.revealT=.15,n.hidden||this.revealAround(n.pos.x,n.pos.z))}enemyInteractions(){let t=this.enemies;for(let e=0;e<t.length;e++){let n=t[e];if(n.alive)for(let i=e+1;i<t.length;i++){let r=t[i];if(!r.alive)continue;let o=r.pos.x-n.pos.x,a=r.pos.z-n.pos.z,l=Math.hypot(o,a),c=n.radius+r.radius;if(l<c&&l>1e-4){let d=(c-l)/2,u=o/l,f=a/l;n.type!=="angel"&&(n.pos.x-=u*d*(r.type==="angel"?2:1),n.pos.z-=f*d*(r.type==="angel"?2:1)),r.type!=="angel"&&(r.pos.x+=u*d*(n.type==="angel"?2:1),r.pos.z+=f*d*(n.type==="angel"?2:1))}(n.type==="brute"&&r.type==="grunt"||n.type==="grunt"&&r.type==="brute")&&l<2.6&&n.state!=="fight"&&r.state!=="fight"&&n.stun<=0&&r.stun<=0&&this.game.level.world.los(n.pos.x,n.pos.z,r.pos.x,r.pos.z)&&(n.setState("fight"),r.setState("fight"),n.fightWith=r,r.fightWith=n,n.attackCd=.3,r.attackCd=.5,this.game.audio.growl("brute",(n.type==="brute"?n:r).pos,1.2),this.game.audio.growl("grunt",(n.type==="grunt"?n:r).pos,1.2))}}}updateTraps(t){let e=this.game,n=e.player;for(let r of this.bearTraps)if(r.armed){if(!r.owned&&n.alive&&!n.hidden&&n.pos.y<.25&&Me(r.x,r.z,n.pos.x,n.pos.z)<.5){r.armed=!1,cl(r.jaws,!1),e.audio.bearSnap(r),e.emitNoise(r.x,r.z,Sn.bearTrap,"player"),n.trapped=2.5,n.damage(25,"beartrap"),e.ui.message("A bear trap bites into your leg!","bad");continue}for(let o of this.enemies)if(!(!o.alive||o.type==="angel"||o.stun>0)&&Me(r.x,r.z,o.pos.x,o.pos.z)<.45+o.radius*.5){r.armed=!1,cl(r.jaws,!1),e.audio.bearSnap(r);let a=o.type==="brute"?5:o.type==="hound"?7:6;o.trap(a,o.type==="brute"?60:40),r.owned&&Me(r.x,r.z,n.pos.x,n.pos.z)<30&&e.ui.message("Something is caught in your trap!","good");break}}let i=this.prevPlayer||n.pos.clone();for(let r of this.wires){if(r.triggered){r.t+=t;let a=r.t<.12?r.t/.12:r.t<1.5?1:Math.max(0,1-(r.t-1.5)/.6);r.spikes.visible=a>0;for(let l of r.spikes.children)l.position.x=l.userData.s*(3/2+.6-1.2*a);continue}if(!n.alive||n.hidden||n.pos.y>.3)continue;(r.alongX?(i.x-r.x)*(n.pos.x-r.x)<=0&&Math.abs(n.pos.z-r.z)<1.5&&i.x!==n.pos.x:(i.z-r.z)*(n.pos.z-r.z)<=0&&Math.abs(n.pos.x-r.x)<1.5&&i.z!==n.pos.z)&&(r.triggered=!0,r.wire.visible=!1,e.audio.spikes(r),e.emitNoise(r.x,r.z,Sn.spikes,"player"),n.damage(30,"spikes"),e.ui.message("Tripwire! Spikes lance from the walls!","bad"))}this.prevPlayer=n.pos.clone()}assignLights(t,e,n){let i=this.torches.map(r=>({t:r,d:Me(r.pos.x,r.pos.z,e,n)})).sort((r,o)=>r.d-o.d);t.forEach((r,o)=>{let a=i[o];a&&a.d<30?(r.position.copy(a.t.pos),r.userData.torch=a.t,r.userData.on=!0):(r.userData.on=!1,r.intensity=0)})}dispose(){for(let t of this.enemies)t.dispose();this.game.scene.remove(this.group),this.game.scene.remove(this.world.group),this.group.traverse(t=>{if(t.geometry&&t.geometry.dispose(),t.material){let e=Array.isArray(t.material)?t.material:[t.material];for(let n of e)n.dispose()}}),this.world.dispose()}};var Wd={locker:{y:1.5,fwd:-.02,yawLim:.55,pitchMin:-.35,pitchMax:.25},closet:{y:1.55,fwd:0,yawLim:.6,pitchMin:-.35,pitchMax:.25},bed:{y:.2,fwd:.3,yawLim:.8,pitchMin:-.15,pitchMax:.12},bench:{y:.2,fwd:.05,yawLim:.8,pitchMin:-.15,pitchMax:.15}},dl=class{constructor(t){this.game=t,this.pos=new L,this.vel=new L,this.yaw=0,this.pitch=0,this.lives=Ie.startLives,this.gold=0,this.stats={gold:0,diamonds:0,kills:0},this.upgrades={health:0,speed:0,stamina:0,greed:0},this.livesBought=0,this.inv={medkit:1,beartrap:0,key:0},this.clip=sn.clip,this.reserve=6,this.flashlight=!0,this.resetTransient()}get maxHealth(){return Ie.baseHealth+this.upgrades.health*20}get maxStamina(){return Ie.baseStamina+this.upgrades.stamina*25}get speedMul(){return 1+this.upgrades.speed*.07}get goldMul(){return 1+this.upgrades.greed*.25}resetTransient(){this.health=this.maxHealth,this.stamina=this.maxStamina,this.exhausted=!1,this.staminaDelay=0,this.velY=0,this.onGround=!0,this.crouch=!1,this.eyeH=Ie.eye,this.hidden=null,this.hideT=0,this.trapped=0,this.inPit=0,this.alive=!0,this.invuln=0,this.stepDist=0,this.bob=0,this.shake=0,this.running=!1,this.moving=!1,this.reloading=0,this.fireCd=0,this.recoil=0,this.lastSafe=new L,this.breathCd=0,this.deathT=0}spawn(t){this.pos.set(t.x,0,t.z),this.vel.set(0,0,0),this.yaw=t.yaw,this.pitch=0,this.lastSafe.copy(this.pos)}get eye(){return this.pos.y+this.eyeH}get inSafe(){return this.game.level.world.inSafeRoom(this.pos.x,this.pos.z)}visibility(){let t=this.flashlight?22:10;return this.crouch&&(t*=.6),this.running&&(t*=1.15),t}forward(t=new L){return t.set(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}update(t,e){let n=this.game,i=n.level.world;this.invuln=Math.max(0,this.invuln-t),this.fireCd=Math.max(0,this.fireCd-t),this.recoil=Ii(this.recoil,0,10,t),this.shake=Math.max(0,this.shake-t*2.5);let r=.0022*e.sensitivity;if(this.yaw-=e.mouseDX*r,this.pitch-=e.mouseDY*r,this.pitch=zs(this.pitch,-1.45,1.45),!this.alive)return;if(this.hidden){this.updateHidden(t,e);return}if(this.reloading>0&&(this.reloading-=t,this.reloading<=0)){let b=Math.min(sn.clip-this.clip,this.reserve);this.clip+=b,this.reserve-=b}(e.wasPressed("KeyC")||e.wasPressed("ControlLeft"))&&(this.crouch=!this.crouch);let o=0,a=0;(e.down("KeyW")||e.down("ArrowUp"))&&(a-=1),(e.down("KeyS")||e.down("ArrowDown"))&&(a+=1),(e.down("KeyA")||e.down("ArrowLeft"))&&(o-=1),(e.down("KeyD")||e.down("ArrowRight"))&&(o+=1);let l=Math.hypot(o,a);l>0&&(o/=l,a/=l),this.moving=l>0;let c=(e.down("ShiftLeft")||e.down("ShiftRight"))&&this.moving&&a<=.2;c&&this.crouch&&(this.crouch=!1),this.running=c&&!this.exhausted&&this.stamina>0&&this.trapped<=0,this.running?(this.stamina-=Ie.runDrain*t,this.staminaDelay=.9,this.stamina<=0&&(this.stamina=0,this.exhausted=!0)):(this.staminaDelay-=t,this.staminaDelay<=0&&(this.stamina=Math.min(this.maxStamina,this.stamina+(Ie.staminaRegen+this.upgrades.stamina*3)*t)),this.exhausted&&this.stamina>this.maxStamina*.3&&(this.exhausted=!1)),this.breathCd-=t,this.exhausted&&this.breathCd<=0&&(n.audio.breath(.7),this.breathCd=1.4);let h=this.crouch?Ie.crouch:this.running?Ie.run:Ie.walk;h*=this.speedMul,this.trapped>0&&(this.trapped-=t,h=0),this.inPit>0&&(h=0);let d=Math.sin(this.yaw),u=Math.cos(this.yaw),f=(o*u+a*d)*h,g=(-o*d+a*u)*h,v=this.onGround?12:2.5;this.vel.x=Ii(this.vel.x,f,v,t),this.vel.z=Ii(this.vel.z,g,v,t),e.wasPressed("Space")&&this.onGround&&this.trapped<=0&&this.inPit<=0&&this.stamina>=Ie.jumpCost*.5&&(this.velY=Ie.jumpV,this.onGround=!1,this.stamina=Math.max(0,this.stamina-Ie.jumpCost),this.staminaDelay=.9,this.crouch=!1,n.audio.jump());let m=this.pos.x,p=this.pos.z;this.pos.x+=this.vel.x*t,this.pos.z+=this.vel.z*t,this.pos.y>-.2?i.collide(this.pos,Ie.radius,!1):(this.pos.x=m,this.pos.z=p);let M=this.groundAt(this.pos.x,this.pos.z);if(this.velY-=Ie.gravity*t,this.pos.y+=this.velY*t,this.pos.y+this.eyeH>3.6-.15&&(this.pos.y=3.6-.15-this.eyeH,this.velY=Math.min(0,this.velY)),this.pos.y<=M){let b=this.velY;this.pos.y=M,this.velY=0,this.onGround||(this.onGround=!0,M<-1?this.landInPit():b<-4&&(n.audio.playerStep(this.surface(),1.2),n.emitNoise(this.pos.x,this.pos.z,Sn.land,"player")))}else this.pos.y>M+.05&&(this.onGround=!1);this.inPit>0?(this.inPit-=t,this.inPit<=0&&(this.pos.copy(this.lastSafe),this.velY=0,n.ui.message("You claw your way out of the pit."))):this.onGround&&M===0&&this.lastSafe.copy(this.pos);let E=this.crouch?Ie.crouchEye:Ie.eye;this.eyeH=Ii(this.eyeH,E,10,t);let _=Math.hypot(this.pos.x-m,this.pos.z-p);if(this.onGround&&_>.001){this.stepDist+=_,this.bob+=_*(this.running?2.6:3.2);let b=this.crouch?1.25:this.running?2.3:1.75;this.stepDist>b&&(this.stepDist=0,this.footstep())}e.wasPressed("KeyF")&&this.toggleFlashlight(),e.wasPressed("KeyR")&&this.startReload(),(e.wasPressed("KeyH")||e.wasPressed("Digit1"))&&this.useMedkit(),(e.wasPressed("KeyT")||e.wasPressed("Digit2"))&&this.placeTrap(),e.clicked&&this.fire()}groundAt(t,e){let n=this.game.level.world,i=Math.floor(t/3),r=Math.floor(e/3);if(n.t(i,r)!==Bt.PIT)return 0;let o=t-i*3,a=e-r*3,l=.3;return o<l||a<l||o>3-l||a>3-l?0:-2.4}surface(){let t=this.game.level;if(t.world.isSafePos(this.pos.x,this.pos.z))return"wood";let[e,n]=t.world.tileOf(this.pos.x,this.pos.z);return t.glassTiles.has(n*t.world.W+e)?"glass":"stone"}footstep(){let t=this.surface(),e=this.game,n=this.crouch?.35:this.running?1.1:.7;e.audio.playerStep(t,n);let i=this.crouch?Sn.crouch:this.running?Sn.run:Sn.walk,r="player";t==="glass"&&(i=this.crouch?Sn.glassCrouch:Sn.glass,r="glass"),t!=="wood"&&e.emitNoise(this.pos.x,this.pos.z,i,r)}landInPit(){this.inPit=1.4,this.game.audio.fallPit(),this.game.emitNoise(this.pos.x,this.pos.z,Sn.pit,"player"),this.damage(35,"spikes"),this.game.ui.message("Impaled on spikes!","bad")}enterHide(t){this.game.onPlayerHide(t),this.hidden=t,this.hideT=0,this.hideFrom={x:this.pos.x,y:this.pos.y+this.eyeH,z:this.pos.z,yaw:this.yaw,pitch:this.pitch},this.crouch=!1,this.running=!1,this.moving=!1,this.vel.set(0,0,0),this.spotYaw=Math.atan2(-t.fx,-t.fz),this.yaw=this.spotYaw,this.pitch=0,this.game.audio.locker(t,t.kind),this.game.emitNoise(t.x,t.z,4,"hide")}exitHide(t=!1){let e=this.hidden;e&&(this.hidden=null,this.pos.set(e.exit.x,0,e.exit.z),this.eyeH=Ie.eye,this.velY=0,this.onGround=!0,this.yaw=this.spotYaw,t||this.game.audio.locker(e,e.kind),this.game.level.world.collide(this.pos,Ie.radius))}updateHidden(t,e){let n=this.hidden,i=Wd[n.kind];this.hideT=Math.min(1,this.hideT+t*3.5);let r=qr(this.spotYaw,this.yaw);this.yaw=this.spotYaw+zs(r,-i.yawLim,i.yawLim),this.pitch=zs(this.pitch,i.pitchMin,i.pitchMax),this.stamina=Math.min(this.maxStamina,this.stamina+Ie.staminaRegen*1.3*t),this.exhausted&&this.stamina>this.maxStamina*.3&&(this.exhausted=!1),e.wasPressed("KeyF")&&this.toggleFlashlight(),(e.wasPressed("KeyH")||e.wasPressed("Digit1"))&&this.useMedkit()}hideCamera(){let t=this.hidden,e=Wd[t.kind];return{x:t.x+t.fx*e.fwd,y:e.y,z:t.z+t.fz*e.fwd}}toggleFlashlight(){this.flashlight=!this.flashlight,this.game.audio.flashlight()}useMedkit(){if(this.inv.medkit<=0)return this.game.ui.message("No med kits.","dim");if(this.health>=this.maxHealth)return this.game.ui.message("Already at full health.","dim");this.inv.medkit--,this.health=Math.min(this.maxHealth,this.health+50),this.game.audio.pickup(),this.game.ui.message("+50 health","good")}placeTrap(){let t=this.game;if(this.inv.beartrap<=0)return t.ui.message("No bear traps.","dim");if(this.inSafe||t.level.world.isSafePos(this.pos.x,this.pos.z))return t.ui.message("Traps are useless in the sanctuary.","dim");let e=this.pos.x-Math.sin(this.yaw)*1.1,n=this.pos.z-Math.cos(this.yaw)*1.1,i=t.level.world,[r,o]=i.tileOf(e,n);if(i.t(r,o)!==Bt.FLOOR)return t.ui.message("Can't place a trap there.","dim");this.inv.beartrap--,t.level.addBearTrap(e,n,!0),t.audio.click(.8),t.ui.message("Bear trap set.","good")}startReload(){this.reloading>0||this.clip>=sn.clip||this.reserve<=0||(this.reloading=sn.reloadTime,this.game.audio.reload())}fire(){let t=this.game;if(!(this.hidden||this.reloading>0||this.fireCd>0||this.inPit>0)){if(this.clip<=0){t.audio.click(.6),this.fireCd=.3,this.reserve>0?this.startReload():t.ui.message("Out of ammo.","dim");return}this.clip--,this.fireCd=sn.fireDelay,this.recoil=1,this.shake=Math.max(this.shake,.25),t.audio.gunshot(),t.shoot(),this.inSafe||t.emitNoise(this.pos.x,this.pos.z,sn.noise,"gun")}}addGold(t){let e=Math.round(t*this.goldMul);return this.gold+=e,this.stats.gold+=e,e}damage(t,e){!this.alive||this.invuln>0||(this.health-=t,this.shake=Math.max(this.shake,Math.min(1,t/30)),this.game.ui.hurt(Math.min(1,t/40)),this.game.audio.impactPlayer(t>=35),this.health<=0&&(this.health=0,this.game.playerDied(e)))}};var fn=s=>440*Math.pow(2,(s-69)/12),fl=class{constructor(){this.ctx=null,this.volume={master:.85,music:.7,sfx:1},this.mode="explore",this.occluded=null}init(){if(this.ctx){this.ctx.state!=="running"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=this.ctx=new t;this.master=e.createGain(),this.master.gain.value=this.volume.master;let n=e.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=6,this.master.connect(n).connect(e.destination),this.musicBus=e.createGain(),this.musicBus.gain.value=this.volume.music,this.musicBus.connect(this.master),this.sfxBus=e.createGain(),this.sfxBus.gain.value=this.volume.sfx,this.sfxBus.connect(this.master),this.reverb=e.createConvolver(),this.reverb.buffer=this.impulse(3.2,2.2),this.reverbOut=e.createGain(),this.reverbOut.gain.value=.55,this.reverb.connect(this.reverbOut).connect(this.master),this.noiseBuf=this.makeNoise(2),this.distCurve=this.makeDistortion(40),this.layers={};for(let i of["safe","explore","chase"]){let r=e.createGain();r.gain.value=0,r.connect(this.musicBus);let o=e.createGain();o.gain.value=i==="chase"?.15:.5,r.connect(o).connect(this.reverb),this.layers[i]={gain:r,target:0,next:e.currentTime+.1,step:0}}this.startDrone(),this.startScreech(),this.setMode(this.mode,!0)}setVolume(t,e){if(this.volume[t]=e,!this.ctx)return;(t==="master"?this.master:t==="music"?this.musicBus:this.sfxBus).gain.setTargetAtTime(e,this.ctx.currentTime,.05)}impulse(t,e){let n=this.ctx,i=Math.floor(n.sampleRate*t),r=n.createBuffer(2,i,n.sampleRate);for(let o=0;o<2;o++){let a=r.getChannelData(o);for(let l=0;l<i;l++)a[l]=(Math.random()*2-1)*Math.pow(1-l/i,e)}return r}makeNoise(t){let e=this.ctx,n=Math.floor(e.sampleRate*t),i=e.createBuffer(1,n,e.sampleRate),r=i.getChannelData(0);for(let o=0;o<n;o++)r[o]=Math.random()*2-1;return i}makeDistortion(t){let n=new Float32Array(1024);for(let i=0;i<1024;i++){let r=i*2/1024-1;n[i]=(3+t)*r*20*(Math.PI/180)/(Math.PI+t*Math.abs(r))}return n}setListener(t,e){if(!this.ctx)return;let n=this.ctx.listener,i=this.ctx.currentTime;n.positionX?(n.positionX.setTargetAtTime(t.x,i,.02),n.positionY.setTargetAtTime(t.y,i,.02),n.positionZ.setTargetAtTime(t.z,i,.02),n.forwardX.setTargetAtTime(e.x,i,.02),n.forwardY.setTargetAtTime(e.y,i,.02),n.forwardZ.setTargetAtTime(e.z,i,.02),n.upX.value=0,n.upY.value=1,n.upZ.value=0):(n.setPosition(t.x,t.y,t.z),n.setOrientation(e.x,e.y,e.z,0,1,0))}out(t,e=1,{hrtf:n=!1,reverb:i=.15,max:r=60}={}){let o=this.ctx,a=o.createGain();a.gain.value=e;let l=a;if(t){let c=o.createPanner();if(c.panningModel=n?"HRTF":"equalpower",c.distanceModel="inverse",c.refDistance=2.5,c.rolloffFactor=1.3,c.maxDistance=r,c.positionX?(c.positionX.value=t.x,c.positionY.value=t.y??1,c.positionZ.value=t.z):c.setPosition(t.x,t.y??1,t.z),l.connect(c),l=c,this.occluded&&this.occluded(t)){let h=o.createBiquadFilter();h.type="lowpass",h.frequency.value=650;let d=o.createGain();d.gain.value=.65,l.connect(h).connect(d),l=d}}if(l.connect(this.sfxBus),i>0){let c=o.createGain();c.gain.value=i,l.connect(c).connect(this.reverb)}return a}osc(t,e,n,i,r,{gain:o=.3,attack:a=.005,f1:l=null,curve:c="exp",detune:h=0}={}){let d=this.ctx,u=d.createOscillator();u.type=t,u.frequency.setValueAtTime(e,n),u.detune.value=h,l!==null&&(c==="exp"?u.frequency.exponentialRampToValueAtTime(Math.max(1,l),n+i):u.frequency.linearRampToValueAtTime(l,n+i));let f=d.createGain();return f.gain.setValueAtTime(1e-4,n),f.gain.exponentialRampToValueAtTime(o,n+a),f.gain.exponentialRampToValueAtTime(1e-4,n+i),u.connect(f).connect(r),u.start(n),u.stop(n+i+.05),u}noise(t,e,n,{type:i="bandpass",freq:r=1e3,Q:o=1,gain:a=.3,attack:l=.003,f1:c=null}={}){let h=this.ctx,d=h.createBufferSource();d.buffer=this.noiseBuf,d.loop=!0;let u=h.createBiquadFilter();u.type=i,u.frequency.setValueAtTime(r,t),c&&u.frequency.exponentialRampToValueAtTime(c,t+e),u.Q.value=o;let f=h.createGain();f.gain.setValueAtTime(1e-4,t),f.gain.exponentialRampToValueAtTime(a,t+l),f.gain.exponentialRampToValueAtTime(1e-4,t+e),d.connect(u).connect(f).connect(n),d.start(t,Math.random()*1.5),d.stop(t+e+.05)}get now(){return this.ctx.currentTime}ok(){return!!this.ctx&&this.ctx.state==="running"}playerStep(t,e=1){if(!this.ok())return;let n=this.now,i=this.out(null,e,{reverb:.12});if(t==="wood")this.noise(n,.08,i,{freq:500,Q:1.5,gain:.25}),this.osc("sine",150,n,.1,i,{gain:.25,f1:80});else if(t==="glass"){this.noise(n,.14,i,{type:"highpass",freq:3e3,gain:.35});for(let r=0;r<4;r++)this.osc("sine",3e3+Math.random()*4500,n+Math.random()*.06,.08,i,{gain:.08});this.osc("sine",90,n,.08,i,{gain:.2,f1:50})}else this.noise(n,.09,i,{freq:700+Math.random()*400,Q:1.2,gain:.22}),this.osc("sine",95,n,.09,i,{gain:.25,f1:45})}monsterStep(t,e){if(!this.ok())return;let n=this.now;if(t==="brute"){let i=this.out(e,1.1,{reverb:.3,max:80});this.osc("sine",60,n,.4,i,{gain:.9,f1:28}),this.noise(n,.3,i,{type:"lowpass",freq:220,gain:.7})}else if(t==="hound"){let i=this.out(e,.7,{reverb:.05});this.noise(n,.03,i,{freq:2600,Q:4,gain:.5}),this.noise(n+.04,.03,i,{freq:3100,Q:4,gain:.35})}else{let i=this.out(e,.9,{reverb:.2});this.noise(n,.13,i,{type:"lowpass",freq:500,gain:.5}),this.osc("sine",75,n,.14,i,{gain:.45,f1:38}),Math.random()<.3&&this.noise(n+.05,.25,i,{freq:1200,Q:3,gain:.08})}}growl(t,e,n=1){if(!this.ok())return;let i=this.now;if(t==="grunt"){let r=this.out(e,.9*n,{hrtf:!0,reverb:.3}),o=85+Math.random()*30,a=.7+Math.random()*.6;for(let[l,c]of[[550,5],[1150,7]]){let h=this.ctx.createBiquadFilter();h.type="bandpass",h.frequency.value=l,h.Q.value=c,h.connect(r),this.osc("sawtooth",o,i,a,h,{gain:.9,attack:.08,f1:o*.7}),this.osc("sawtooth",o*1.02,i,a,h,{gain:.6,attack:.1,f1:o*.66})}this.noise(i,a,r,{freq:400,Q:1,gain:.15,attack:.1})}else if(t==="brute"){let r=this.out(e,1.3*n,{hrtf:!0,reverb:.45,max:90}),o=this.ctx.createWaveShaper();o.curve=this.distCurve;let a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=520,o.connect(a).connect(r);let l=1.4;this.osc("sawtooth",58,i,l,o,{gain:.9,attack:.15,f1:40}),this.osc("square",44,i,l,o,{gain:.5,attack:.2,f1:32}),this.noise(i,l,r,{type:"lowpass",freq:300,gain:.4,attack:.2})}else if(t==="hound"){let r=this.out(e,.8*n,{hrtf:!0,reverb:.2});this.osc("sawtooth",420,i,.25,r,{gain:.25,f1:220}),this.noise(i,.2,r,{freq:1500,Q:4,gain:.2})}}shriek(t){if(!this.ok())return;let e=this.now,n=this.out(t,1,{hrtf:!0,reverb:.5,max:100}),i=this.ctx.createWaveShaper();i.curve=this.distCurve;let r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.value=2200,r.Q.value=1.2,i.connect(r).connect(n);let o=1.5;for(let[a,l]of[[1700,.5],[2390,.35],[1130,.3]]){let c=this.ctx.createOscillator();c.type="sawtooth",c.frequency.setValueAtTime(a,e),c.frequency.linearRampToValueAtTime(a*1.35,e+.25),c.frequency.linearRampToValueAtTime(a*.9,e+o);let h=this.ctx.createOscillator();h.frequency.value=23+Math.random()*10;let d=this.ctx.createGain();d.gain.value=a*.08,h.connect(d).connect(c.frequency);let u=this.ctx.createGain();u.gain.setValueAtTime(1e-4,e),u.gain.exponentialRampToValueAtTime(l,e+.06),u.gain.setValueAtTime(l,e+o*.6),u.gain.exponentialRampToValueAtTime(1e-4,e+o),c.connect(u).connect(i),c.start(e),h.start(e),c.stop(e+o+.1),h.stop(e+o+.1)}}swipe(t){if(!this.ok())return;let e=this.now,n=this.out(t,.8,{reverb:.1});this.noise(e,.25,n,{freq:600,f1:2400,Q:2,gain:.5,attack:.05})}impactPlayer(t=!1){if(!this.ok())return;let e=this.now,n=this.out(null,1,{reverb:.1});this.osc("sine",t?70:110,e,.3,n,{gain:.9,f1:35}),this.noise(e,.2,n,{type:"lowpass",freq:1200,gain:.6});let i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.value=900,i.Q.value=3,i.connect(n),this.osc("sawtooth",190,e+.03,.3,i,{gain:.5,f1:120,attack:.02})}gunshot(){if(!this.ok())return;let t=this.now,e=this.out(null,1.1,{reverb:.9});this.noise(t,.45,e,{type:"lowpass",freq:5e3,f1:250,gain:1,attack:.001}),this.osc("sine",150,t,.25,e,{gain:.9,f1:38,attack:.001}),this.osc("square",80,t,.06,e,{gain:.4,f1:40,attack:.001})}click(t=.4){if(!this.ok())return;let e=this.now,n=this.out(null,t,{reverb:.05});this.noise(e,.025,n,{type:"highpass",freq:2500,gain:.6}),this.osc("square",1800,e,.02,n,{gain:.1})}reload(){if(!this.ok())return;let t=this.now,e=this.out(null,.5,{reverb:.05});for(let n=0;n<6;n++)this.noise(t+.2+n*.17,.03,e,{freq:3e3,Q:3,gain:.4});this.noise(t+1.45,.06,e,{freq:1600,Q:2,gain:.6})}ricochet(t){if(!this.ok())return;let e=this.now,n=this.out(t,.5,{reverb:.3});this.osc("sine",3200,e,.35,n,{gain:.2,f1:1400}),this.noise(e,.05,n,{type:"highpass",freq:2e3,gain:.4})}flesh(t){if(!this.ok())return;let e=this.now,n=this.out(t,.8,{reverb:.1});this.noise(e,.12,n,{type:"lowpass",freq:900,gain:.7}),this.osc("sine",90,e,.12,n,{gain:.5,f1:50})}coin(){if(!this.ok())return;let t=this.now,e=this.out(null,.5,{reverb:.25});this.osc("sine",1318,t,.25,e,{gain:.3}),this.osc("sine",1760,t+.07,.35,e,{gain:.3}),this.osc("triangle",2637,t+.07,.2,e,{gain:.08})}pickup(){if(!this.ok())return;let t=this.now,e=this.out(null,.5,{reverb:.2});this.osc("triangle",520,t,.15,e,{gain:.3,f1:780}),this.noise(t,.08,e,{freq:2e3,Q:2,gain:.2})}diamond(){if(!this.ok())return;let t=this.now,e=this.out(null,.7,{reverb:.7});[76,81,83,88,93].forEach((n,i)=>{this.osc("sine",fn(n),t+i*.08,1.6,e,{gain:.22}),this.osc("triangle",fn(n+12),t+i*.08,.8,e,{gain:.05})})}allDiamonds(){if(!this.ok())return;let t=this.now,e=this.out(null,.8,{reverb:.8});[57,64,69,72,76].forEach((n,i)=>this.osc("sawtooth",fn(n),t,3.5,e,{gain:.06,attack:.4+i*.1})),this.osc("sine",55,t,3,e,{gain:.5,attack:.3})}crate(t){if(!this.ok())return;let e=this.now,n=this.out(null,.7,{reverb:.25});if(t){for(let i=0;i<3;i++)this.osc("square",900+i*230,e+i*.05,.25,n,{gain:.1});this.noise(e,.15,n,{freq:3e3,Q:4,gain:.3})}this.osc("sawtooth",140,e+.05,.6,n,{gain:.15,f1:260,curve:"lin"}),this.noise(e+.55,.15,n,{type:"lowpass",freq:700,gain:.6})}denied(){if(!this.ok())return;let t=this.now,e=this.out(null,.5,{reverb:.1});this.osc("square",140,t,.15,e,{gain:.15}),this.osc("square",110,t+.15,.2,e,{gain:.15})}rattle(){if(!this.ok())return;let t=this.now,e=this.out(null,.6,{reverb:.2});for(let n=0;n<5;n++)this.noise(t+n*.06,.05,e,{freq:2500+Math.random()*1500,Q:6,gain:.4})}locker(t,e){if(!this.ok())return;let n=this.now,i=this.out(t,.7,{reverb:.3});e==="locker"?(this.osc("square",300,n,.3,i,{gain:.08,f1:220}),[523,811,1240].forEach(r=>this.osc("sine",r,n+.25,.6,i,{gain:.1})),this.noise(n+.25,.08,i,{type:"lowpass",freq:900,gain:.5})):e==="closet"?(this.osc("sawtooth",120,n,.5,i,{gain:.12,f1:210,curve:"lin"}),this.noise(n+.45,.1,i,{type:"lowpass",freq:600,gain:.5})):this.noise(n,.35,i,{freq:800,Q:1,gain:.25,attack:.05})}bearSnap(t){if(!this.ok())return;let e=this.now,n=this.out(t,1,{reverb:.5,max:80});[820,1263,1977,2810].forEach(i=>this.osc("sine",i,e,.9,n,{gain:.18,attack:.001})),this.noise(e,.08,n,{type:"highpass",freq:1500,gain:.9,attack:.001}),this.osc("sine",120,e,.15,n,{gain:.6,f1:50})}spikes(t){if(!this.ok())return;let e=this.now,n=this.out(t,1,{reverb:.4});this.noise(e,.2,n,{freq:800,f1:3500,Q:2,gain:.6}),[400,610,950].forEach(i=>this.osc("sine",i,e+.12,.5,n,{gain:.15}))}glass(t){if(!this.ok())return;let e=this.now,n=this.out(t,.8,{reverb:.4});this.noise(e,.2,n,{type:"highpass",freq:3500,gain:.5});for(let i=0;i<6;i++)this.osc("sine",3500+Math.random()*5e3,e+Math.random()*.15,.1,n,{gain:.07})}fallPit(){if(!this.ok())return;let t=this.now,e=this.out(null,1,{reverb:.6});this.noise(t,.4,e,{freq:400,f1:150,Q:1,gain:.4,attack:.1}),this.osc("sine",80,t+.35,.4,e,{gain:.9,f1:30}),this.noise(t+.35,.2,e,{type:"lowpass",freq:1500,gain:.8})}jump(){if(!this.ok())return;let t=this.out(null,.3,{reverb:0});this.noise(this.now,.12,t,{freq:600,Q:1,gain:.25,attack:.03})}heartbeat(t){if(!this.ok())return;let e=this.now,n=this.out(null,t,{reverb:0});this.osc("sine",55,e,.18,n,{gain:.9,f1:35}),this.osc("sine",50,e+.24,.2,n,{gain:.7,f1:32})}breath(t){if(!this.ok())return;let e=this.now,n=this.out(null,t,{reverb:.05});this.noise(e,.55,n,{freq:1100,Q:.8,gain:.18,attack:.25}),this.noise(e+.6,.6,n,{freq:700,Q:.8,gain:.12,attack:.2})}buy(){if(!this.ok())return;let t=this.now,e=this.out(null,.6,{reverb:.3});[1046,1318,1568].forEach((n,i)=>this.osc("triangle",n,t+i*.06,.4,e,{gain:.15}));for(let n=0;n<6;n++)this.osc("sine",2e3+Math.random()*1500,t+.1+n*.03,.15,e,{gain:.06})}uiClick(){if(!this.ok())return;let t=this.out(null,.3,{reverb:0});this.osc("triangle",660,this.now,.06,t,{gain:.2})}flashlight(){this.click(.5)}hatch(){if(!this.ok())return;let t=this.now,e=this.out(null,.9,{reverb:.7});for(let n=0;n<8;n++)this.noise(t+n*.05,.06,e,{freq:2200+Math.random()*1500,Q:5,gain:.3});this.osc("sawtooth",90,t+.4,1,e,{gain:.15,f1:160,curve:"lin"}),this.osc("sine",45,t+1.2,1.2,e,{gain:.8,f1:30})}stinger(){if(!this.ok())return;let t=this.now,e=this.out(null,.7,{reverb:.7});[45,46,51,57,58].forEach(n=>this.osc("sawtooth",fn(n+12),t,1.6,e,{gain:.09,attack:.01})),this.noise(t,1.2,e,{freq:3e3,Q:.7,gain:.15,attack:.01}),this.osc("sine",40,t,1,e,{gain:.7,f1:25})}death(){if(!this.ok())return;let t=this.now,e=this.out(null,1,{reverb:1});[33,34,39,45].forEach(n=>this.osc("sawtooth",fn(n),t,4,e,{gain:.15,attack:.02})),this.noise(t,2.5,e,{type:"lowpass",freq:800,f1:100,gain:.5}),this.osc("sine",60,t,3,e,{gain:.9,f1:20})}stoneGrind(t){if(!this.ok())return;let e=this.now,n=this.out(t,.9,{reverb:.3});this.noise(e,.35,n,{freq:260,Q:3,gain:.7,attack:.04}),this.noise(e,.3,n,{freq:1300,Q:6,gain:.15,attack:.05})}monsterDeath(t,e){if(!this.ok())return;let n=this.now,i=this.out(e,1,{hrtf:!0,reverb:.5}),r=t==="brute"?50:t==="hound"?500:110;this.osc("sawtooth",r,n,1.4,i,{gain:.3,f1:r*.4,attack:.02}),this.noise(n+.6,.3,i,{type:"lowpass",freq:400,gain:.6})}setMode(t,e=!1){if(this.mode=t,!this.ctx)return;let n=this.ctx.currentTime,i={safe:{safe:.9,explore:0,chase:0},explore:{safe:0,explore:.85,chase:0},chase:{safe:0,explore:.25,chase:.9},dead:{safe:0,explore:0,chase:0}}[t];for(let r in this.layers){let o=this.layers[r],a=e?.01:t==="chase"&&r==="chase"?.25:1.6;o.gain.gain.cancelScheduledValues(n),o.gain.gain.setTargetAtTime(i[r],n,a),i[r]>0&&o.target===0&&(o.next=Math.max(o.next,n+.05)),o.target=i[r]}}update(){if(!this.ctx||this.ctx.state!=="running")return;let t=this.ctx.currentTime;for(let e in this.layers){let n=this.layers[e];if(n.target===0&&n.gain.gain.value<.002){n.next=t+.05;continue}let i=0;for(;n.next<t+.25&&i++<32;)n.next<t&&(n.next=t+.01),n.next+=this["music_"+e](n.next,n)}if(this.screech){let e=this.layers.chase.target;this.screech.g.gain.setTargetAtTime(e*.022,t,.5),Math.random()<.01&&this.screech.o.frequency.setTargetAtTime(1200+Math.random()*800,t,.6)}}pad(t,e,n,i,r){for(let o of t)for(let[a,l]of[["triangle",-5],["sine",6]]){let c=this.ctx.createOscillator();c.type=a,c.frequency.value=o,c.detune.value=l;let h=this.ctx.createGain();h.gain.setValueAtTime(1e-4,e),h.gain.exponentialRampToValueAtTime(r,e+n*.35),h.gain.setValueAtTime(r,e+n*.65),h.gain.exponentialRampToValueAtTime(1e-4,e+n*1.15),c.connect(h).connect(i),c.start(e),c.stop(e+n*1.2)}}music_safe(t,e){let n=[[45,57,60,64],[41,57,60,65],[48,55,60,64],[40,56,59,64]],i=.75,r=Math.floor(e.step/12)%n.length;if(e.step%12===0&&(e.lp||(e.lp=this.ctx.createBiquadFilter(),e.lp.type="lowpass",e.lp.frequency.value=1100,e.lp.connect(e.gain)),this.pad(n[r].map(fn),t,i*12,e.lp,.035)),Math.random()<.55){let o=[69,71,72,74,76,77,79,80,81,84];e.mi=Math.max(0,Math.min(o.length-1,(e.mi??4)+Math.floor(Math.random()*5)-2));let a=fn(o[e.mi]+(r===3&&o[e.mi]===79?1:0));this.osc("sine",a,t,2.2,e.gain,{gain:.06,attack:.004}),this.osc("sine",a*3,t,.5,e.gain,{gain:.012,attack:.004})}return e.step++,i}startDrone(){let t=this.ctx,e=t.createBiquadFilter();e.type="lowpass",e.frequency.value=200,e.Q.value=5;let n=t.createGain();n.gain.value=.16,e.connect(n).connect(this.layers.explore.gain);for(let[o,a]of[["sawtooth",55],["sawtooth",55.35],["sine",27.5],["sawtooth",82.6]]){let l=t.createOscillator();l.type=o,l.frequency.value=a;let c=t.createGain();c.gain.value=a===82.6?.25:.6,l.connect(c).connect(e),l.start()}let i=t.createOscillator();i.frequency.value=.06;let r=t.createGain();r.gain.value=120,i.connect(r).connect(e.frequency),i.start()}music_explore(t,e){let n=e.gain,i=Math.random();if(i<.28){let r=fn(45+Math.floor(Math.random()*12));this.pad([r,r*1.0595,r*1.414],t,6,n,.02)}else if(i<.45){let r=70+Math.random()*120;[1,2.76,5.4,8.93].forEach((o,a)=>this.osc("sine",r*o,t,3.5-a*.6,n,{gain:.05/(a+1),attack:.002}))}else if(i<.62){let r=this.ctx.createStereoPanner();r.pan.value=Math.random()*2-1,r.connect(n);for(let o=0;o<3;o++)this.noise(t+o*.35,.5+Math.random()*.4,r,{freq:900+Math.random()*1600,f1:600+Math.random()*2400,Q:9,gain:.12,attack:.12})}else if(i<.75){let r=fn(33+Math.floor(Math.random()*6)),o=this.ctx.createBiquadFilter();o.type="lowpass",o.frequency.value=500,o.connect(n),this.osc("sawtooth",r,t,5,o,{gain:.08,attack:2.2,f1:r*.97})}else i<.85&&(this.osc("sine",38,t,1.8,n,{gain:.25,attack:.02,f1:30}),this.osc("sine",38,t+.9,1.8,n,{gain:.18,attack:.02,f1:30}));return 2.5+Math.random()*4}startScreech(){let t=this.ctx,e=t.createOscillator();e.type="sine",e.frequency.value=1500;let n=t.createOscillator();n.frequency.value=6.5;let i=t.createGain();i.gain.value=35,n.connect(i).connect(e.frequency);let r=t.createGain();r.gain.value=0,e.connect(r).connect(this.musicBus),e.start(),n.start(),this.screech={o:e,g:r}}music_chase(t,e){let n=.0872093023255814,i=e.step%16,r=Math.floor(e.step/16),o=e.gain;if((i===0||i===3||i===8||i===10||i===14&&r%2)&&(this.osc("sine",130,t,.25,o,{gain:.7,f1:38,attack:.002}),this.noise(t,.03,o,{type:"lowpass",freq:2e3,gain:.25})),(i===4||i===12)&&(this.noise(t,.16,o,{freq:1700,Q:.8,gain:.35}),this.osc("triangle",210,t,.1,o,{gain:.2,f1:140})),i%2===0&&this.noise(t,.03,o,{type:"highpass",freq:7e3,gain:.06}),i%2===0){let l=[45,45,46,45,45,51,46,44][i/2%8]-12+(r%4===3?1:0);e.bass||(e.bass=this.ctx.createBiquadFilter(),e.bass.type="lowpass",e.bass.frequency.value=420,e.bass.Q.value=4,e.bass.connect(o)),this.osc("sawtooth",fn(l),t,n*1.8,e.bass,{gain:.35,attack:.004})}return i===0&&r%2===0&&[57,58,63,64].forEach(a=>this.osc("sawtooth",fn(a),t,.45,o,{gain:.05,attack:.01})),i===8&&r%4===3&&[69,70,75].forEach(a=>this.osc("sawtooth",fn(a),t,.7,o,{gain:.04,attack:.3,f1:fn(a-2)})),e.step++,n}loop(t,e){if(!this.ctx)return null;let n=this.ctx,i=n.createBufferSource();i.buffer=this.noiseBuf,i.loop=!0;let r=n.createBiquadFilter();r.type="bandpass",r.frequency.value=t,r.Q.value=e;let o=n.createGain();o.gain.value=0;let a=n.createPanner();return a.panningModel="HRTF",a.distanceModel="inverse",a.refDistance=2.5,a.rolloffFactor=1.2,i.connect(r).connect(o).connect(a).connect(this.sfxBus),i.start(),{set:(l,c)=>{let h=n.currentTime;a.positionX?(a.positionX.setTargetAtTime(l.x,h,.03),a.positionY.setTargetAtTime(1,h,.03),a.positionZ.setTargetAtTime(l.z,h,.03)):a.setPosition(l.x,1,l.z),o.gain.setTargetAtTime(c,h,.04)},stop:()=>{try{i.stop()}catch{}i.disconnect(),a.disconnect()}}}};var ih=s=>document.getElementById(s),d_={grunt:"Torn apart by a Grunt.",hound:"Mauled by a Blood Hound.",brute:"Crushed by the Blind Brute.",angel:"You looked away. The Angel did not.",spikes:"Impaled on rusted spikes.",beartrap:"Bled out in the jaws of a trap."},pl=class{constructor(t){this.game=t,this.el={};for(let e of["hud","lvl","dia","gold","lives","hpFill","hpText","stFill","inv","ammo","ammoSub","prompt","msgs","banner","bannerT","bannerS","hurt","hideMask","fade","title","pause","shop","shopItems","shopGold","mapScreen","bigmap","death","deathCause","deathSub","gameover","goStats","minimap","status","bestLine","cross","vignette","mapLegend","shopLevel"])this.el[e]=ih(e);this.mini=this.el.minimap.getContext("2d"),this.big=this.el.bigmap.getContext("2d"),this.cache={},this.messages=[],this.bannerT=0,this.hurtV=0,this.fadeV=0,this.fadeTarget=0,this.fadeSpeed=1,this.mapOpen=!1,this.buildShop(),this.bindSettings()}set(t,e,n,i="textContent"){this.cache[t]!==n&&(this.cache[t]=n,e[i]=n)}message(t,e="",n=3){let i=document.createElement("div");for(i.className="msg "+e,i.textContent=t,this.el.msgs.prepend(i),this.messages.push({div:i,t:n});this.el.msgs.children.length>6;){let r=this.el.msgs.lastChild;this.el.msgs.removeChild(r),this.messages=this.messages.filter(o=>o.div!==r)}}banner(t,e="",n=3){this.el.bannerT.innerHTML=t,this.el.bannerS.textContent=e,this.el.banner.classList.add("show"),this.bannerT=n}hurt(t){this.hurtV=Math.min(1,this.hurtV+t*.9+.2)}fade(t,e=1){this.fadeTarget=t,this.fadeSpeed=1/Math.max(.01,e)}update(t){let e=this.game,n=e.player,i=e.level;if(!n||!i)return;for(let c of this.messages)c.t-=t,c.t<.6&&(c.div.style.opacity=Math.max(0,c.t/.6)),c.t<=0&&c.div.remove();this.messages=this.messages.filter(c=>c.t>0),this.bannerT>0&&(this.bannerT-=t,this.bannerT<=0&&this.el.banner.classList.remove("show")),this.hurtV=Math.max(0,this.hurtV-t*1.2);let r=n.alive&&n.health/n.maxHealth<.3?.25+Math.sin(e.time*5)*.08:0;if(this.el.hurt.style.opacity=Math.max(this.hurtV,r).toFixed(3),this.fadeV!==this.fadeTarget){let c=this.fadeSpeed*t;this.fadeV=this.fadeV<this.fadeTarget?Math.min(this.fadeTarget,this.fadeV+c):Math.max(this.fadeTarget,this.fadeV-c),this.el.fade.style.opacity=this.fadeV.toFixed(3)}this.set("lvl",this.el.lvl,`LEVEL <span class="num">${e.levelNum}</span>`,"innerHTML"),this.set("dia",this.el.dia,`${i.found} / ${i.needed}`),this.set("gold",this.el.gold,String(n.gold)),this.set("lives",this.el.lives,"\u2620".repeat(Math.max(0,Math.min(n.lives,12)))+(n.lives>12?` \xD7${n.lives}`:""));let o=Math.max(0,n.health/n.maxHealth);this.set("hpw",this.el.hpFill.style,(o*100).toFixed(1)+"%","width"),this.set("hpt",this.el.hpText,`${Math.ceil(n.health)} / ${n.maxHealth}`);let a=n.stamina/n.maxStamina;this.set("stw",this.el.stFill.style,(a*100).toFixed(1)+"%","width"),this.set("stc",this.el.stFill,n.exhausted?"fill exhausted":"fill","className"),this.set("inv",this.el.inv,`<div class="slot ${n.inv.medkit?"":"empty"}"><b>H</b><span class="ico">\u271A</span>${n.inv.medkit}<small>Med kit</small></div><div class="slot ${n.inv.beartrap?"":"empty"}"><b>T</b><span class="ico">\u2297</span>${n.inv.beartrap}<small>Bear trap</small></div><div class="slot ${n.inv.key?"":"empty"}"><b>&nbsp;</b><span class="ico">\u26B7</span>${n.inv.key}<small>Skel. key</small></div><div class="slot ${i.mapOwned?"":"empty"}"><b>M</b><span class="ico">\u25A6</span>${i.mapOwned?"\u2713":"\u2013"}<small>Map</small></div>`,"innerHTML"),this.set("ammo",this.el.ammo,n.reloading>0?"RELOADING":`${n.clip} / ${sn.clip}`),this.set("ammoSub",this.el.ammoSub,`${n.reserve} spare`);let l=[];n.hidden?l.push("HIDDEN"):n.crouch&&l.push("CROUCHED"),n.flashlight||l.push("LIGHT OFF"),n.trapped>0&&l.push("TRAPPED"),n.inSafe&&l.push("SANCTUARY"),this.set("status",this.el.status,l.join(" \xB7 ")),this.set("hideMask",this.el.hideMask,"overlay mask"+(n.hidden?" "+n.hidden.kind:""),"className"),this.set("cross",this.el.cross.style,n.hidden||!n.alive?"none":"block","display"),this.drawMinimap(),this.mapOpen&&this.drawBigMap()}setPrompt(t){this.set("prompt",this.el.prompt,t||"","innerHTML"),this.set("promptVis",this.el.prompt.style,t?"1":"0","opacity")}drawMarkers(t,e,n,i,r){let o=this.game,a=o.level,l=o.player,c=M=>(M/3-e)*i,h=M=>(M/3-n)*i,d=Math.max(3,i*.6);t.fillStyle=a.unlocked?"#ff5a3a":"#6a4a3a",t.fillRect(c(a.hatch.x)-d/2,h(a.hatch.z)-d/2,d,d);for(let M of a.diamonds){if(M.taken||!M.known)continue;let E=c(M.x),_=h(M.z),b=Math.max(3.5,i*.55);t.fillStyle="#5fd8ff",t.beginPath(),t.moveTo(E,_-b),t.lineTo(E+b*.7,_),t.lineTo(E,_+b),t.lineTo(E-b*.7,_),t.closePath(),t.fill(),r&&(t.strokeStyle="rgba(95,216,255,"+(.4+Math.sin(o.time*4)*.3)+")",t.beginPath(),t.arc(E,_,b*2,0,Math.PI*2),t.stroke())}let u=c(l.pos.x),f=h(l.pos.z),g=l.yaw,v=-Math.sin(g),m=-Math.cos(g),p=Math.max(5,i*.8);t.fillStyle="#ffe8a0",t.strokeStyle="#000",t.beginPath(),t.moveTo(u+v*p,f+m*p),t.lineTo(u-v*p*.6+m*p*.6,f-m*p*.6-v*p*.6),t.lineTo(u-v*p*.25,f-m*p*.25),t.lineTo(u-v*p*.6-m*p*.6,f-m*p*.6+v*p*.6),t.closePath(),t.fill(),t.lineWidth=1,t.stroke()}drawMinimap(){let t=this.game,e=t.level,n=t.player,i=this.mini,r=this.el.minimap.width,o=26,a=r/o,l=n.pos.x/3-o/2,c=n.pos.z/3-o/2;i.fillStyle="#000",i.fillRect(0,0,r,r),i.imageSmoothingEnabled=!1,i.drawImage(e.mapCanvas,-l*a,-c*a,e.d.W*a,e.d.H*a),this.drawMarkers(i,l,c,a,!1)}drawBigMap(){let e=this.game.level,n=this.el.bigmap,i=e.d.W,r=e.d.H,o=Math.min(window.innerWidth*.86,window.innerHeight*.74),a=Math.max(2,Math.floor(o/Math.max(i,r)));n.width!==i*a&&(n.width=i*a,n.height=r*a);let l=this.big;l.fillStyle="#050403",l.fillRect(0,0,n.width,n.height),l.imageSmoothingEnabled=!1,l.drawImage(e.mapCanvas,0,0,i*a,r*a),this.drawMarkers(l,0,0,a,!0)}toggleMap(t){this.mapOpen=t??!this.mapOpen,this.el.mapScreen.classList.toggle("show",this.mapOpen);let e=this.game.level;e&&(this.el.mapLegend.textContent=e.mapOwned?"Cartographer's map \u2014 every diamond revealed.":"Only what you have seen. Buy a map from the Keeper to reveal the level.")}buildShop(){let t=this.el.shopItems;t.innerHTML="",Yi.forEach((e,n)=>{let i=document.createElement("button");i.className="card",i.dataset.id=e.id,i.innerHTML=`<div class="key">${(n+1)%10}</div><div class="icon">${e.icon}</div>
        <div class="name">${e.name}</div><div class="desc">${e.desc}</div>
        <div class="tier"></div><div class="price"></div>`,i.addEventListener("click",()=>this.game.buy(e.id)),t.appendChild(i)})}refreshShop(){let t=this.game,e=t.player;this.el.shopGold.textContent=e.gold,this.el.shopLevel.textContent=`Level ${t.levelNum}`;for(let n of this.el.shopItems.children){let i=Yi.find(a=>a.id===n.dataset.id),r=sl(i,t.levelNum,e),o=t.shopState(i);n.querySelector(".price").textContent=o.maxed?"\u2014":`${r} gold`,n.querySelector(".tier").textContent=o.info,n.disabled=o.maxed||e.gold<r,n.classList.toggle("poor",!o.maxed&&e.gold<r),n.classList.toggle("maxed",o.maxed)}}showShop(t){this.el.shop.classList.toggle("show",t),this.el.hud.classList.toggle("dim",t),t&&this.refreshShop()}showTitle(t,e){this.el.title.classList.toggle("show",t),e&&(this.el.bestLine.textContent=e)}showPause(t){this.el.pause.classList.toggle("show",t)}showHud(t){this.el.hud.classList.toggle("show",t)}showDeath(t,e){this.el.deathCause.textContent=d_[t]||"The dark takes you.",this.el.deathSub.textContent=e>0?`${e} ${e===1?"life":"lives"} remaining. You will wake in the sanctuary.`:"No lives remain.",this.el.death.classList.add("show")}hideDeath(){this.el.death.classList.remove("show")}showGameOver(t,e=!0){this.el.gameover.classList.toggle("show",e),e&&(this.el.goStats.innerHTML=`
      <div><span>Deepest level</span><b>${t.level}</b></div>
      <div><span>Diamonds recovered</span><b>${t.diamonds}</b></div>
      <div><span>Gold collected</span><b>${t.gold}</b></div>
      <div><span>Monsters slain</span><b>${t.kills}</b></div>
      <div class="best"><span>Best ever</span><b>Level ${t.best}</b></div>`)}bindSettings(){let t=this.game,e=t.settings,n=(r,o,a)=>{let l=ih(r);l&&(l.value=e[o],l.addEventListener("input",()=>{e[o]=parseFloat(l.value),a(e[o]),t.saveSettings()}))};n("setSens","sens",r=>t.input.sensitivity=r),n("setMaster","master",r=>t.audio.setVolume("master",r)),n("setMusic","music",r=>t.audio.setVolume("music",r)),n("setSfx","sfx",r=>t.audio.setVolume("sfx",r));let i=ih("setRetro");i&&(i.checked=!!e.retro,i.addEventListener("change",()=>{e.retro=i.checked,t.applyResolution(),t.saveSettings()}))}};var ml=class{constructor(t){this.canvas=t,this.keys=new Set,this.pressed=new Set,this.mouseDX=0,this.mouseDY=0,this.mouseDown=!1,this.clicked=!1,this.locked=!1,this.sensitivity=1,this.onLockChange=null,this.onKey=null,window.addEventListener("keydown",e=>{["Space","Tab","ArrowUp","ArrowDown"].includes(e.code)&&e.preventDefault(),e.repeat||this.pressed.add(e.code),this.keys.add(e.code),this.onKey?.(e)}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>this.keys.clear()),document.addEventListener("mousemove",e=>{this.locked&&(Math.abs(e.movementX)>400||Math.abs(e.movementY)>400||(this.mouseDX+=e.movementX,this.mouseDY+=e.movementY))}),document.addEventListener("mousedown",e=>{e.button===0&&this.locked&&(this.mouseDown=!0,this.clicked=!0)}),document.addEventListener("mouseup",e=>{e.button===0&&(this.mouseDown=!1)}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.onLockChange?.(this.locked)}),document.addEventListener("pointerlockerror",()=>{this.locked=!1,this.onLockChange?.(!1)})}lock(){try{let t=this.canvas.requestPointerLock();t&&t.catch&&t.catch(()=>this.onLockChange?.(!1))}catch{this.onLockChange?.(!1)}}unlock(){document.pointerLockElement&&document.exitPointerLock()}down(t){return this.keys.has(t)}wasPressed(t){return this.pressed.has(t)}endFrame(){this.pressed.clear(),this.mouseDX=0,this.mouseDY=0,this.clicked=!1}};var Zi=400,gl=class{constructor(t){this.pos=new Float32Array(Zi*3),this.col=new Float32Array(Zi*3),this.vel=new Float32Array(Zi*3),this.life=new Float32Array(Zi),this.next=0;let e=new we;e.setAttribute("position",new Ne(this.pos,3)),e.setAttribute("color",new Ne(this.col,3)),this.geo=e,this.points=new pr(e,new Es({size:.07,vertexColors:!0,sizeAttenuation:!0,transparent:!0,depthWrite:!1})),this.points.frustumCulled=!1;for(let n=0;n<Zi;n++)this.pos[n*3+1]=-999;t.add(this.points)}burst(t,e,n,i=2.5,r=1){let o=new $t(n);for(let a=0;a<e;a++){let l=this.next;this.next=(this.next+1)%Zi,this.pos[l*3]=t.x,this.pos[l*3+1]=t.y,this.pos[l*3+2]=t.z,this.vel[l*3]=(Math.random()-.5)*i,this.vel[l*3+1]=Math.random()*i*r,this.vel[l*3+2]=(Math.random()-.5)*i;let c=.7+Math.random()*.3;this.col[l*3]=o.r*c,this.col[l*3+1]=o.g*c,this.col[l*3+2]=o.b*c,this.life[l]=.6+Math.random()*.6}}update(t){for(let e=0;e<Zi;e++)if(!(this.life[e]<=0)){if(this.life[e]-=t,this.life[e]<=0){this.pos[e*3+1]=-999;continue}this.vel[e*3+1]-=9*t,this.pos[e*3]+=this.vel[e*3]*t,this.pos[e*3+1]+=this.vel[e*3+1]*t,this.pos[e*3+2]+=this.vel[e*3+2]*t,this.pos[e*3+1]<.02&&(this.pos[e*3+1]=.02,this.vel[e*3]*=.3,this.vel[e*3+1]=0,this.vel[e*3+2]*=.3)}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0}};var Xd="dreaddepths.settings",qd="dreaddepths.best",sh=class{constructor(){this.canvas=document.getElementById("game"),this.settings={sens:1,master:.85,music:.7,sfx:1,retro:!0};try{Object.assign(this.settings,JSON.parse(localStorage.getItem(Xd)||"{}"))}catch{}let t=this.renderer=new el({canvas:this.canvas,antialias:!1,powerPreference:"high-performance"});t.shadowMap.enabled=!0,t.shadowMap.type=Hi,t.outputColorSpace=Ge,this.scene=new lr,this.scene.background=new $t(0),this.scene.fog=new ar(0,.058),this.camera=new Be(72,1,.05,80),this.camera.rotation.order="YXZ",this.scene.add(this.camera),this.hemi=new Ir(4539742,1708044,.85),this.scene.add(this.hemi);let e=this.flashlight=new Dr(16773330,90,32,.46,.5,1.35);e.position.set(-.22,-.22,-.7),e.target.position.set(0,-.15,-8),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),e.shadow.camera.near=.3,e.shadow.camera.far=30,e.shadow.bias=-8e-4,this.camera.add(e),this.camera.add(e.target),this.torchLights=[];for(let n=0;n<4;n++){let i=new zi(16742960,0,10,1.3);this.scene.add(i),this.torchLights.push(i)}this.safeLight=new zi(16754784,0,15,1.1),this.scene.add(this.safeLight),this.muzzle=new zi(16762992,0,14,1.5),this.muzzle.position.set(.25,-.1,-.7),this.camera.add(this.muzzle),this.vm=Vd(),this.vm.group.visible=!1,this.camera.add(this.vm.group),this.particles=new gl(this.scene),this.audio=new fl,this.audio.volume={master:this.settings.master,music:this.settings.music,sfx:this.settings.sfx},this.input=new ml(this.canvas),this.input.sensitivity=this.settings.sens,this.ui=new pl(this),this.state="title",this.time=0,this.levelNum=1,this.player=null,this.level=null,this.raycaster=new Ur,this.frustum=new xi,this.projM=new ae,this.sphere=new Cn,this.chaseHold=0,this.heartCd=0,this.lightFlicker=0,this.fov=72,this.shriekMsgCd=0,this.audio.occluded=n=>{if(!this.level)return!1;let i=this.camera.position;return!this.level.world.los(i.x,i.z,n.x,n.z)},this.input.onLockChange=n=>{!n&&this.state==="playing"&&this.pause(!0),n&&this.state==="paused"&&this.pause(!1)},this.input.onKey=n=>this.onKey(n),this.bindButtons(),window.addEventListener("resize",()=>this.resize()),this.resize(),this.ui.showTitle(!0,this.bestLine()),this.last=performance.now(),requestAnimationFrame(n=>this.frame(n))}bindButtons(){document.getElementById("startBtn").addEventListener("click",()=>this.startGame()),document.getElementById("resumeBtn").addEventListener("click",()=>this.input.lock()),document.getElementById("quitBtn").addEventListener("click",()=>this.toTitle()),document.getElementById("retryBtn").addEventListener("click",()=>this.startGame()),document.getElementById("shopClose").addEventListener("click",()=>this.closeShop()),document.getElementById("mapScreen").addEventListener("click",()=>this.ui.toggleMap(!1)),this.canvas.addEventListener("click",()=>{this.state==="playing"&&!this.input.locked&&this.input.lock()})}resize(){let t=window.innerWidth,e=window.innerHeight;this.renderer.setSize(t,e,!1),this.applyResolution(),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}applyResolution(){let t=Math.min(window.devicePixelRatio||1,2);this.renderer.setPixelRatio(this.settings.retro?.5:Math.min(t,1.5)),this.renderer.setSize(window.innerWidth,window.innerHeight,!1),this.canvas.classList.toggle("retro",!!this.settings.retro)}saveSettings(){try{localStorage.setItem(Xd,JSON.stringify(this.settings))}catch{}}best(){try{return parseInt(localStorage.getItem(qd)||"0",10)||0}catch{return 0}}bestLine(){let t=this.best();return t?`Deepest descent: Level ${t}`:""}startGame(){this.audio.init(),this.ui.showTitle(!1),this.ui.showGameOver(null,!1),this.ui.hideDeath(),this.player=new dl(this),this.levelNum=1,this.loadLevel(1),this.state="playing",this.ui.showHud(!0),this.ui.fadeV=1,this.ui.fade(0,2),this.input.lock(),this.ui.message("Find the diamonds. Gold buys survival. The Keeper waits in the sanctuary.","",7)}loadLevel(t){this.level&&(this.level.dispose(),this.level=null);let e=Math.random()*4294967295>>>0;new ul(this,t,e),this.player.spawn(this.level.d.spawn),this.player.trapped=0,this.player.inPit=0,this.player.hidden=null,this.level.assignLights(this.torchLights,this.player.pos.x,this.player.pos.z),this.safeLight.position.copy(this.level.safeLightPos),this.safeLight.intensity=9,this.ui.toggleMap(!1);let n=this.level.needed;this.ui.banner(`LEVEL <span class="num">${t}</span>`,`Find ${n} ${n===1?"diamond":"diamonds"}`,4),this.updateCamera(0)}toTitle(){this.state="title",this.ui.showPause(!1),this.ui.showHud(!1),this.ui.showTitle(!0,this.bestLine()),this.audio.setMode("safe")}pause(t){t?(this.state="paused",this.ui.showPause(!0),this.ui.toggleMap(!1),this.audio.ctx&&this.audio.ctx.suspend()):(this.state="playing",this.ui.showPause(!1),this.audio.ctx&&this.audio.ctx.resume())}onKey(t){if(this.state==="shop"){(t.code==="Escape"||t.code==="KeyE"||t.code==="Tab")&&this.closeShop();let e=t.code.match(/^Digit(\d)$/);if(e){let n=(parseInt(e[1],10)+9)%10;Yi[n]&&this.buy(Yi[n].id)}return}this.state==="gameover"&&(t.code==="Enter"||t.code==="Space")&&this.startGame(),this.state==="title"&&t.code==="Enter"&&this.startGame()}shopState(t){let e=this.player;if(t.upgrade){let i=e.upgrades[t.id]||0;return{maxed:i>=t.max,info:`Rank ${i} / ${t.max}`}}return t.id==="map"?{maxed:this.level.mapOwned,info:this.level.mapOwned?"Owned for this level":"This level only"}:{maxed:!1,info:`Owned: ${{life:e.lives,medkit:e.inv.medkit,key:e.inv.key,beartrap:e.inv.beartrap,ammo:e.reserve}[t.id]}`}}openShop(){this.state="shop",this.input.unlock(),this.ui.setPrompt(""),this.ui.showShop(!0),this.audio.uiClick()}closeShop(){this.state==="shop"&&(this.ui.showShop(!1),this.state="playing",this.input.pressed.clear(),this.input.lock())}buy(t){let e=Yi.find(o=>o.id===t),n=this.player,i=sl(e,this.levelNum,n);if(this.shopState(e).maxed||n.gold<i){this.audio.denied();return}switch(n.gold-=i,t){case"life":n.lives++,n.livesBought++;break;case"medkit":n.inv.medkit++;break;case"health":n.upgrades.health++,n.health+=20;break;case"speed":n.upgrades.speed++;break;case"stamina":n.upgrades.stamina++,n.stamina=n.maxStamina;break;case"greed":n.upgrades.greed++;break;case"map":this.level.revealAll();break;case"key":n.inv.key++;break;case"beartrap":n.inv.beartrap++;break;case"ammo":n.reserve+=6;break}this.audio.buy(),this.ui.refreshShop()}emitNoise(t,e,n,i){if(!this.level)return;let r={x:t,z:e,r:n,kind:i};for(let o of this.level.enemies)o.hear(r)}alert(t,e,n,i,r){for(let a of this.level.enemies)a!==r&&Me(a.pos.x,a.pos.z,t,e)<n&&a.alerted(t,e,i);let o=this.player;this.shriekMsgCd<=0&&Me(o.pos.x,o.pos.z,t,e)<45&&(this.shriekMsgCd=6,this.ui.message(i?"The Blood Hound shrieks at your hiding place!":"A Blood Hound shrieks! The others are coming...","bad"))}onPlayerHide(t){for(let e of this.level.enemies){if(!e.alive||e.type==="angel"||e.stun>0)continue;let n=!1;e.type==="grunt"?n=e.canSee(!0):e.type==="hound"?n=e.canSee(!0)||["chase","alert","shriek","bark"].includes(e.state)&&e.dist()<40:e.type==="brute"&&(n=(e.state==="charge"||e.enraged>0)&&e.dist()<9),n&&(e.knowsSpot=t,e.type==="hound"?e.state!=="shriek"&&e.setState("bark"):e.state!=="fight"&&e.setState("pullout"))}}pullOut(t,e){let n=this.player;n.hidden&&(n.exitHide(!0),n.yaw=Math.atan2(-(t.pos.x-n.pos.x),-(t.pos.z-n.pos.z)),n.invuln=0,n.damage(e,t.type),n.invuln=.9,this.audio.growl(t.type,t.pos,1.4),n.alive&&this.ui.message("It saw you hide. You are dragged out!","bad"))}killPlayer(t){let e=this.player;e.alive&&(e.invuln=0,this.killer=t,e.damage(9999,t))}playerDied(t){let e=this.player;e.alive&&(e.alive=!1,e.deathT=0,e.lives--,e.hidden&&e.exitHide(!0),this.state="dying",this.deathCause=t,t==="angel"&&this.audio.stinger(),this.audio.death(),this.audio.setMode("dead"),this.ui.toggleMap(!1),setTimeout(()=>this.ui.showDeath(t,e.lives),900))}respawn(){let t=this.player,e=Math.floor(t.gold*.25);t.gold-=e,t.resetTransient(),t.spawn(this.level.d.spawn);for(let n of this.level.enemies)n.alive&&n.type!=="angel"?(n.knowsSpot=null,n.enraged=0,n.state!=="fight"&&(n.setState("patrol"),n.target=null)):n.type==="angel"&&(n.awake=!1);t.invuln=2,this.ui.hideDeath(),this.ui.fadeV=1,this.ui.fade(0,1.5),this.state="playing",this.ui.message(e?`You wake in the sanctuary, ${e} gold lighter.`:"You wake in the sanctuary.","dim",5)}gameOver(){let t=this.player,e=Math.max(this.best(),this.levelNum);try{localStorage.setItem(qd,String(e))}catch{}this.state="gameover",this.ui.hideDeath(),this.ui.showHud(!1),this.input.unlock(),this.ui.showGameOver({level:this.levelNum,diamonds:t.stats.diamonds,gold:t.stats.gold,kills:t.stats.kills,best:e})}descend(){this.state==="playing"&&(this.state="transition",this.transT=0,this.audio.hatch(),this.ui.fade(1,1.2))}shoot(){let t=this.camera,e=t.getWorldPosition(new L),n=t.getWorldDirection(new L),i=this.level.world.ray3D(e,n,sn.range);this.raycaster.set(e,n),this.raycaster.far=i;let r=this.level.enemies.filter(l=>l.alive&&l.pos.distanceTo(e)<sn.range+2).map(l=>l.root),o=this.raycaster.intersectObjects(r,!0);if(this.vm.flash.material.opacity=1,this.muzzle.intensity=25,o.length){let l=o[0],c=l.object.userData.enemy;if(c.type==="angel")this.audio.ricochet(l.point),this.particles.burst(l.point,10,12303274,3),this.ui.message("The bullet ricochets off cold stone.","dim");else{let h=l.point.y>c.model.height*.82;c.hit(sn.damage*(h?1.6:1)),this.particles.burst(l.point,18,7995392,3)}return}let a=e.clone().addScaledVector(n,Math.max(0,i-.05));this.particles.burst(a,8,10127984,2)}isObserved(t){let e=this.player;if(!e.alive||e.hidden)return!1;let n=this.camera,i=Me(t.pos.x,t.pos.z,n.position.x,n.position.z);if(i>36||!e.flashlight&&i>5&&!this.nearTorch(t.pos)||(this.projM.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projM),this.sphere.center.set(t.pos.x,1,t.pos.z),this.sphere.radius=.7,!this.frustum.intersectsSphere(this.sphere)))return!1;let r=this.level.world,o=Math.cos(e.yaw)*.32,a=-Math.sin(e.yaw)*.32;return r.los(n.position.x,n.position.z,t.pos.x,t.pos.z)||r.los(n.position.x,n.position.z,t.pos.x+o,t.pos.z+a)||r.los(n.position.x,n.position.z,t.pos.x-o,t.pos.z-a)}nearTorch(t){for(let e of this.torchLights)if(e.userData.on&&Me(e.position.x,e.position.z,t.x,t.z)<5)return!0;return!1}anyHunting(){let t=this.player;return this.level.enemies.some(e=>e.hunting&&Me(e.pos.x,e.pos.z,t.pos.x,t.pos.z)<45)}frame(t){requestAnimationFrame(n=>this.frame(n));let e=Math.min(.05,(t-this.last)/1e3);this.last=t,this.step(e),this.renderer.render(this.scene,this.camera),this.input.endFrame()}step(t){let e=this.state;if(e==="playing"||e==="dying"||e==="transition"){this.time+=t;let n=this.player;e==="playing"?(n.update(t,this.input),this.handleInteraction(),(this.input.wasPressed("KeyM")||this.input.wasPressed("Tab"))&&this.ui.toggleMap()):this.ui.setPrompt(""),e==="dying"&&(n.deathT+=t,n.deathT>4&&(n.lives>0?this.respawn():this.gameOver())),e==="transition"&&(this.transT+=t,this.transT>1.4&&(this.levelNum++,this.loadLevel(this.levelNum),this.state="playing",this.ui.fade(0,1.5),this.audio.setMode("safe"))),this.updateCamera(t),this.camera.updateMatrixWorld(),this.level&&this.state!=="transition"&&this.level.update(t),this.updateLights(t),this.updateAudio(t),this.particles.update(t),this.shriekMsgCd-=t,this.ui.update(t)}else this.player&&this.level&&this.ui.update(0);e==="title"&&(this.time+=t),this.audio.update()}handleInteraction(){let t=this.player,e=this.input;if(t.hidden){this.ui.setPrompt("<b>E</b> Leave hiding place"),e.wasPressed("KeyE")&&t.hideT>.6&&t.exitHide();return}if(!t.alive||t.inPit>0)return this.ui.setPrompt("");let n=t.forward(),i=Math.hypot(n.x,n.z)||1,r=null,o=1/0;for(let c of this.level.interactables()){let h=c.x-t.pos.x,d=c.z-t.pos.z,u=Math.hypot(h,d);if(u>c.range)continue;let f=(h*n.x+d*n.z)/(i*(u||1));if(f<.35&&u>1.1)continue;let g=u-f*1.5;g<o&&(o=g,r=c)}if(!r)return this.ui.setPrompt("");let a=r.type==="crate"&&r.obj.locked&&t.inv.key<=0,l=`<b>E</b> ${r.label}`;if(a&&(l=`<b>E</b> ${r.label} <i>(needs skeleton key)</i>`),r.type==="hatch"&&!this.level.unlocked&&(l=`The hatch is chained shut \u2014 <i>${this.level.needed-this.level.found} diamond(s) remain</i>`),this.ui.setPrompt(l),!!e.wasPressed("KeyE"))switch(r.type){case"hide":t.enterHide(r.obj);break;case"crate":this.level.openCrate(r.obj);break;case"keeper":this.openShop();break;case"hatch":this.level.unlocked?this.descend():(this.audio.rattle(),this.ui.message(`Find all ${this.level.needed} diamond(s) to break the chains.`,"dim"));break}}updateCamera(t){let e=this.player;if(!e)return;let n=this.camera,i=0;if(e.hidden){let h=e.hideCamera(),d=e.hideT*e.hideT*(3-2*e.hideT),u=e.hideFrom;n.position.set(u.x+(h.x-u.x)*d,u.y+(h.y-u.y)*d,u.z+(h.z-u.z)*d)}else{let d=e.onGround&&e.moving&&e.trapped<=0?e.running?.065:e.crouch?.02:.035:0;this.bobAmt=Ii(this.bobAmt||0,d,8,t),n.position.set(e.pos.x,e.pos.y+e.eyeH+Math.sin(e.bob)*this.bobAmt,e.pos.z),i=Math.cos(e.bob*.5)*this.bobAmt*.25}if(!e.alive){let h=Math.min(1,e.deathT/1.2);n.position.y=Math.max(.25,e.pos.y+e.eyeH*(1-h)+.25*h),i=h*1.2}let r=e.shake*.06;n.position.x+=(Math.random()-.5)*r,n.position.y+=(Math.random()-.5)*r,n.rotation.set(e.pitch+e.recoil*.06+(Math.random()-.5)*r*.5,e.yaw,i);let o=e.running&&e.moving?79:72;this.fov=Ii(this.fov,o,6,t),Math.abs(n.fov-this.fov)>.01&&(n.fov=this.fov,n.updateProjectionMatrix());let a=this.vm;a.group.visible=e.alive&&!e.hidden;let l=Math.sin(e.bob)*(this.bobAmt||0)*.6;a.group.position.set(Math.cos(e.bob*.5)*(this.bobAmt||0)*.5,l-(e.crouch?.02:0),0);let c=e.reloading>0?Math.sin((1-e.reloading/sn.reloadTime)*Math.PI):0;a.gun.rotation.set(e.recoil*.5+c*.6,0,-c*.9),a.gun.position.set(.2,-.2-c*.12,-.55+e.recoil*.06),a.flash.material.opacity=Math.max(0,a.flash.material.opacity-t*14),a.lens.material.color.setHex(e.flashlight?16773836:2236962)}updateLights(t){let e=this.player,n=this.level;if(!e||!n)return;this.lightFlicker-=t;let i=1,r=this.chaseHold>0;this.lightFlicker<0?Math.random()<(r?.08:.01)?this.lightFlicker=.05+Math.random()*.25:this.lightFlicker=0:i=Math.random()<.5?.15:.7,this.flashlight.intensity=e.flashlight&&e.alive?90*i:0,this.muzzle.intensity=Math.max(0,this.muzzle.intensity-t*160),this.lightT=(this.lightT||0)-t,this.lightT<=0&&(this.lightT=.3,n.assignLights(this.torchLights,e.pos.x,e.pos.z));for(let o of this.torchLights)if(o.userData.on){let a=o.userData.torch;o.intensity=9*(.8+Math.sin(this.time*11+a.phase)*.1+Math.random()*.12)}this.safeLight.intensity=26*(.92+Math.sin(this.time*7)*.04+Math.random()*.04)}updateAudio(t){let e=this.player,n=this.camera,i=n.getWorldDirection(new L);if(this.audio.setListener(n.position,i),this.state==="dying")return;let r=1/0;for(let h of this.level.enemies)h.hunting&&(r=Math.min(r,Me(h.pos.x,h.pos.z,e.pos.x,e.pos.z)));r<45?this.chaseHold=4:this.chaseHold-=t;let o=e.inSafe?"safe":this.chaseHold>0?"chase":"explore";o!==this.audio.mode&&this.audio.setMode(o),this.heartCd-=t;let a=e.health/e.maxHealth,l=zs(1-r/14,0,1),c=Math.max(l,a<.35?.6:0);c>0&&this.heartCd<=0&&e.alive&&(this.audio.heartbeat(.4+c*.6),this.heartCd=1.1-c*.6),this.ui.el.vignette.style.opacity=(.75+c*.25).toFixed(2)}};window.addEventListener("DOMContentLoaded",()=>{window.__game=new sh});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
