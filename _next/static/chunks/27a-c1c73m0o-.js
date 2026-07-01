(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,38972,e=>{"use strict";let i;var s=e.i(11577),t=e.i(61288),d=e.i(26719),l=e.i(17594),a=e.i(26617);e.i(3488),e.i(17595),e.i(834),e.i(26755);let o=t.default.getComponent("Component");async function c(e,s,t,l){var a;(0,d.Q)(i),a=i,document.getElementById(`${a}`).classList.add("vjs-waiting"),(0,d.T)(i,s).then(e=>{(0,d.h)(e.response),(0,d.P)(i)})}function n(e,i){let s=`<div class="hover-div"></div>
    ${(0,l.E)()}
  <div  class="player-season-list-container on-click-toggle">
  <div id="season-list" class="season-list">
    <div class="season-list-head">seasons</div>
    <div class="season-name-container">
    ${i.map((e,i)=>`<div
                    class="season-title-sdk"
                    key=title-${e.title}
                >  <div class="season-container">
                    ${e.title}
                    </div>
                </div>
    `).join("")}
    </div>
    </div>
    <div id="episode-list" class="episode-list hide-container"><div id="episodes-back-btn" class="episodes-back-btn" >
    <svg class='icon icon-backward' height="22px" width="22px" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.383092 19.5818C-0.0882695 19.0669 -0.124672 18.2566 0.273985 17.6961L0.382714 17.5615L7.30134 9.99714L0.383092 2.43893C-0.0882694 1.92406 -0.124672 1.11374 0.273985 0.553232L0.382714 0.418625C0.853882 -0.0964584 1.59542 -0.136236 2.10835 0.299398L2.23153 0.418213L11 9.99608L2.23191 19.5814C1.72148 20.1394 0.893733 20.1396 0.383092 19.5818Z" fill="white"/>
    </svg>
    <span>Episodes<span></div> <div id="episode-container" class="episode-container"> </div></div>
    </div>`;for(;e?.firstChild;)e.removeChild(e.firstChild);let t=(0,a.f)(s);for(;t?.firstChild;)e.appendChild(t.firstChild)}e.s(["customSeasonList",0,n,"handleSeasonChange",0,function(e,i,s,t){let l=document.getElementById("season-list"),o=document.getElementById("episode-list"),n=document.getElementById("episode-container");e.id;let r=e.episodes.map((e,i)=>`
  <div id="episode-wrapper" class="episode-wrapper">
  <div class="episode-title" id="episode-title">
      <div class="details-wrapper">
          <div id="title-wrapper" class="title-wrapper">${i+1} ${e.title} </div>
          <div class="progress-bar-div">
          <div id="progress-div" class="progress-div"></div>
          </div>
      </div>
      <div class="meta-details">
          <div class="episode-image lazy" style="width:124px; height: 70px;">
              <img src=${e.gist.videoImageUrl} alt="${e.title}'s cover"></img>
          </div>
          <div class="description-wrapper">${e.gist.description}</div>
      </div>
  </div>
  </div>`).join("");for(;n?.firstChild;)n.removeChild(n.firstChild);let p=(0,a.f)(r);for(;p?.firstChild;)n.appendChild(p.firstChild);(0,d.aa)(t).then(e=>{let i=e.data,s=document.querySelectorAll("#progress-div");s&&i.map((e,i)=>{e&&e.watchedPercentage&&s[i]&&(s[i].style.width=e.watchedPercentage+"px")})}).catch(e=>{}),l.classList.toggle("hide-container"),o.classList.toggle("hide-container");let v=document.querySelectorAll(".details-wrapper"),h=document.querySelectorAll("#episode-title"),m=document.querySelectorAll(".meta-details"),g=document.querySelector("#episodes-back-btn"),u=e.id,f=e.episodes;g.addEventListener("click",()=>{l.classList.remove("hide-container"),o.classList.add("hide-container")});for(let i=0;i<v.length;i++)v[i].addEventListener("click",()=>(function(e,i,s){let t=i.querySelector(".meta-details");i.classList.toggle("episode-active"),t.classList.toggle("metadetails-active"),s.forEach((i,t)=>{t!==e&&(s[t].classList.remove("episode-active"),s[t].querySelector(".meta-details").classList.remove("metadetails-active"))})})(i,h[i],h)),m[i].addEventListener("click",()=>c(0,f[i].id)),e.episodes[i].id==u&&h[i].classList.add("highlight-active-eps")},"seriesModule",0,class extends o{constructor(e,t={}){super(e,t),(0,s.default)(this,"seriesData",[]),this.seriesData=t.seriesData,i=t.playerId,n(this.el(),this.seriesData),this.loadCSS()}createEl(){let e=document.createElement("div");return e.classList.add("vjs-season-list"),e}loadCSS(){e.A(26788).then(e=>{let i=document.createElement("style");i.id="series",i.append(`${e.default}`),document.head.appendChild(i)})}}])},26788,e=>{e.v(i=>Promise.all(["static/chunks/2qcqi7q4zcx6a.js"].map(i=>e.l(i))).then(()=>i(19090)))}]);