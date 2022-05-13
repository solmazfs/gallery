import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


let winsize = {width: window.innerWidth, height: window.innerHeight};
window.addEventListener('resize', () => {
    winsize = {width: window.innerWidth, height: window.innerHeight};
});

let getStyle = function (elem) {
    return elem.getBoundingClientRect();
    //return window.getComputedStyle(elem);
}

export class Grid {
    DOM = {
        // .base
        el: null,
        // .heading, .columns
        heading: null,
        columns: null,
        // rev left, rev right, center
        left: null,
        right: null,
        center: null,
        // heading
        up: null,
        down: null,
        middle: null,
        bottom: null,
        // cursor
        cursor: null,
    }
    constructor(DOM_el){
        this.DOM.el = DOM_el;
        this.DOM.heading = this.DOM.el.querySelector(".heading");
        this.DOM.columns = this.DOM.el.querySelector(".columns");
        // heading
        this.DOM.up = this.DOM.heading.querySelector(".title--up");
        this.DOM.down = this.DOM.heading.querySelector(".title--down");
        this.DOM.middle = this.DOM.heading.querySelector(".title--middle");
        this.DOM.bottom = this.DOM.heading.querySelector(".title--bottom");
        // columns
        this.DOM.left = this.DOM.columns.querySelector(".column-reverse-left");
        this.DOM.right = this.DOM.columns.querySelector(".column-reverse-right");
        this.DOM.center = this.DOM.columns.querySelector(".column-section");
        // cursor
        this.DOM.cursor = document.querySelector(".Cursor");

        this.initColumns();
        this.initHeading();
        this.initViewport();
    }
    initColumns() {
        this.timeLine = gsap.timeline({
            scrollTrigger: {
                pin: this.DOM.columns,
                trigger: this.DOM.columns,
                start: "top top",
                end: window.innerHeight * 1.3,
                scrub: 1,
                pinSpacing: false,
                //invalidateOnRefresh: true, // resize
            }
        });
        this.timeLine.from(this.DOM.left, {
            duration:1,
            rotationX:-0.3,
            y: () => -1 * (this.DOM.right.offsetHeight - window.innerHeight),
        },0).to(this.DOM.center, {
            duration:1,
            rotationX: 0.3,
            y: () => -1 * (this.DOM.center.offsetHeight - window.innerHeight)
        },0).from(this.DOM.right, {
            duration:1,
            rotationX:-0.3,
            y: () => -1 * (this.DOM.right.offsetHeight - window.innerHeight),
        },0);
    }
    initHeading() {
        this.enableFilter = () => {
            // for fixing performance issue
            gsap.set(this.DOM.cursor, {filter:"url(#goo)"});
        }
        this.transitionEnd = () => {
            //this.titleSize = parseFloat(getStyle(this.DOM.up).fontSize);
            this.titleSize = getStyle(this.DOM.up).height;
            winsize = {width: window.innerWidth, height: Math.max(window.innerHeight || 0, document.body.clientHeight || 0)};
            gsap.to(this.DOM.middle,{duration:.5,opacity:0});

            this.tweenEnd = gsap.to([this.DOM.up,this.DOM.down], {
                duration:1,
                y: gsap.utils.wrap([-((winsize.height/2 - this.titleSize/2)-12),((winsize.height/2 - this.titleSize/2)+18)]),
            });
            this.tweenEnd.play();

            gsap.to(this.DOM.cursor.firstElementChild,{duration:1.1,scale:1,onComplete:this.enableFilter});
            gsap.to([this.DOM.left,this.DOM.right],{duration:1,yPercent:gsap.utils.wrap([0,0]),ease:"Sine.out"});
            gsap.to(this.DOM.center,{duration:1,yPercent:0,ease:"Sine.out"});

            // bottom title
            //tood : need to look
            this.ss = gsap.to(this.DOM.bottom, {autoAlpha:1,y:'+=10', duration:.3, ease:'Power1.in',paused:true});
            ScrollTrigger.create({
                trigger: this.DOM.bottom,
                start: "bottom bottom",
                end: "99999",
                pinSpacing:false,
                onUpdate: ({progress, direction, isActive}) => {
                    if (direction == -1) {
                        this.ss.reverse();
                    } if (direction == 1 ) {
                        this.ss.play();
                    } else if (direction == 1 && isActive == true) {
                        this.ss.play();
                    }
                }
            });

        }
        gsap.set([this.DOM.right,this.DOM.left],{yPercent:gsap.utils.wrap([-50,-50])});
        gsap.set(this.DOM.center,{yPercent:50});
        gsap.set([this.DOM.up,this.DOM.down],{opacity:1,opacity:1});
        gsap.set(this.DOM.cursor.firstElementChild,{scale:100,x:winsize.height/2,y:winsize.height/2});
        this.tweenStart = gsap.from([this.DOM.up,this.DOM.down], {
            duration: 1.6,
            yPercent: gsap.utils.wrap([-(winsize.height/2)/12, (winsize.height/2)/12]),
            onComplete:this.transitionEnd, // tood
        });
    }
    initViewport() {
        if(winsize.width < 600 ) {
            this.timeLine.scrollTrigger.kill(); // tood: scrolltrigger for mobile maybe ...
            gsap.set([this.DOM.left,this.DOM.right,this.DOM.center,this.DOM.columns], { clearProps: true });
        }
        window.addEventListener('resize', () => {
            // tood: need to fix
            if (winsize.width < 600) {
                this.timeLine.scrollTrigger.refresh();
                this.timeLine.scrollTrigger.disable();
                gsap.set([this.DOM.left,this.DOM.right,this.DOM.center,this.DOM.columns], { clearProps: true });
            }
            if (winsize.width > 600) {
                //gsap.set([this.DOM.left,this.DOM.right,this.DOM.center,this.DOM.columns], { clearProps: true });
                this.timeLine.scrollTrigger.enable();
            }
            //tl.scrollTrigger.refresh();
        });
    }
}
