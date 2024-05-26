import { gsap } from "../node_modules/gsap/index.js";

var photoList

let sideSpeed = 0.9
let sideMidSpeed = 1.1
let midSpeed = 1.3

// sideSpeed = 0.09
// sideMidSpeed = 0.1
// midSpeed = 0.13

var loop_left
var loop_left_mid
var loop_mid
var loop_right_mid
var loop_right

var heights_global = { 
  "loop_left": [], 
  "loop_left_mid": [], 
  "loop_mid": [],
  "loop_right_mid": [],
  "loop_right": []
}

var total_heights_global = { 
  "loop_left": 0, 
  "loop_left_mid": 0, 
  "loop_mid": 0,
  "loop_right_mid": 0,
  "loop_right": 0
}

var top_global = { 
  "loop_left": 0, 
  "loop_left_mid": 0, 
  "loop_mid": 0,
  "loop_right_mid": 0,
  "loop_right": 0
}

// let loop = verticalLoop("#loop_left .box1", {repeat: -1, draggable: true, paused: true});

setup()


export function myFunction() {
    // console.log(loop_left.current())
    // console.log(loop_left.parent)
    // console.log(loop_left)
    // console.log(loop_left.closestIndex())
    // loop_left.refresh(true)
    photoList.shiftAndSetNext(document.getElementById('loop_mid'))
}

function test() {
  console.log("Someone's calling me!");
}

async function setup() {
  await initialiseLoops(['loop_left', 'loop_left_mid', 'loop_mid', 'loop_right_mid', 'loop_right'])
  // await initialiseLoops(['loop_mid'])

  verticalLoop("#loop_left .box_left", {repeat: 0, 
    speed: sideSpeed,
    center: true}, top_global['loop_left']);
  verticalLoop("#loop_left_mid .box_left_mid", {repeat: 0, 
    speed: sideMidSpeed,
    center: true}, top_global['loop_left_mid']);
  verticalLoop("#loop_mid .box_mid", {repeat: 0, 
    speed: midSpeed,
    center: true}, top_global['loop_mid']);
  verticalLoop("#loop_right_mid .box_right_mid", {repeat: 0, 
    speed: sideMidSpeed,
    center: true}, top_global['loop_right_mid']);
  verticalLoop("#loop_right .box_right", {repeat: 0, 
    speed: sideSpeed,
    center: true}, top_global['loop_right']);
}

async function initialiseLoops(div_id_array) {
    photoList = new PhotoList("assets/photos")
    var boxes_done = new Array(div_id_array.length).fill(0);
    // for (var i in div_id_array) {
      // console.log(document.getElementById(div_id_array[i]))
      // boxes_todo.push(document.getElementById(div_id_array[i]).children.length)
    // }
    var done = false
    while (!done) {
      done = true
      for (var i in div_id_array) {
        // boxes_todo.push(document.getElementById(div_id_array[i]).children.length)
        if (boxes_done[i] < document.getElementById(div_id_array[i]).children.length) {
          document.getElementById(div_id_array[i]).children[boxes_done[i]].children[0].src = await photoList.getNext()
          boxes_done[i] += 1
          done = false
        }
      }
    }
}

function verticalLoop(items, config, top_id) {
  let timeline;
    items = gsap.utils.toArray(items);
  config = config || {};
  gsap.context(() => {
    let tl = gsap.timeline(
          {
            repeat: config.repeat,
            defaults: {ease: "none"},
            onComplete: () => {
              // console.log("items[0].parent")
              // console.log(heights_global)
              // console.log(items[0].parentElement.id)
              // console.log("items[0].parent")
              // photoList.setNextAtHeight(
              //   items[top_id],
              //   total_heights_global[items[0].parentElement.id] - heights_global[items[0].parentElement.id][top_id]
              // )
              tl.kill()
              photoList.setNext(
                items[top_id].children[0],
              )
              verticalLoop(items, config, top_global[items[0].parentElement.id])
              // console.log('complete')
            }
          }
        ),
        length = items.length,
        heights = [],
        pixelsPerSecond = (config.speed || 1) * 100,
        populateHeights = () => {
          // console.log(items[0].offsetTop)
          total_heights_global[items[0].parentElement.id] = 0
          items.forEach((el, i) => {
            heights[i] = parseFloat(gsap.getProperty(el, "height", "px"));
            heights_global[items[0].parentElement.id][i] = heights[i]
            total_heights_global[items[0].parentElement.id] += heights[i]
            // yPercents[i] = snap(parseFloat(gsap.getProperty(el, "y", "px")) / heights[i] * 100 + gsap.getProperty(el, "yPercent"));
            // b2 = el.getBoundingClientRect();
            // spaceBefore[i] = b2.top - (i ? b1.bottom : b1.top);
            // b1 = b2;
          });
          // gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
          //   yPercent: i => yPercents[i]
          // });
          // totalHeight = getTotalHeight();
        },
        populateTimeline = () => {
          tl.clear()
          let i, item, top;
          top = 0
          let px_to_move = heights[top_id]
          for (i = top_id; i < length; i++) {
            item = items[i];
            // console.log(item)
            if (i != top_id) {
              top += heights[i - 1]
            }
            // tl.to(item,
            //   {
            //     y: top,
            //     duration: 0
            //   }
            // )
            // console.log(top)
            tl.fromTo(item,
              {
                y: top
              },
              {
                y: top - px_to_move,
                immediateRender: false,
                duration: px_to_move / pixelsPerSecond
              },
              0
            )
          }
          for (i = 0; i < top_id; i++) {
            item = items[i];
            // console.log(item)
            if (i == 0) {
              top += heights[length - 1]
            }
            else {
              top += heights[i - 1]
            }
            tl.fromTo(item,
              {
                y: top
              },
              {
                y: top - px_to_move,
                immediateRender: false,
                duration: px_to_move / pixelsPerSecond
              },
              0
            )
          }
          tl.to(items[top_id],
            {
              y: total_heights_global[items[0].parentElement.id] - heights[top_id],
              duration: 0
            }
          )
          top_global[items[0].parentElement.id] += 1
          top_global[items[0].parentElement.id] %= length
          // console.log(top_global)
        }
    
    populateHeights();
    populateTimeline();
  });
} 









function verticalLoop2(items, config) {
    let timeline;
      items = gsap.utils.toArray(items);
      config = config || {};
    gsap.context(() => {
      let onChange = config.onChange,
          lastIndex = 0,
          tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
          length = items.length,
          startY = items[0].offsetTop,
          times = [],
          heights = [],
          spaceBefore = [],
          yPercents = [],
          curIndex = 0,
          center = config.center,
          clone = obj => {
            let result = {}, p;
            for (p in obj) {
              result[p] = obj[p];
            }
            return result;
          },
          pixelsPerSecond = (config.speed || 1) * 100,
          snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
          timeOffset = 0, 
          container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
          totalHeight,
          getTotalHeight = () => items[length-1].offsetTop + yPercents[length-1] / 100 * heights[length-1] - startY + spaceBefore[0] + items[length-1].offsetHeight * gsap.getProperty(items[length-1], "scaleY") + (parseFloat(config.paddingBottom) || 0),
          populateHeights = () => {
            let b1 = container.getBoundingClientRect(), b2;
            startY = items[0].offsetTop;
            items.forEach((el, i) => {
              heights[i] = parseFloat(gsap.getProperty(el, "height", "px"));
              yPercents[i] = snap(parseFloat(gsap.getProperty(el, "y", "px")) / heights[i] * 100 + gsap.getProperty(el, "yPercent"));
              b2 = el.getBoundingClientRect();
              spaceBefore[i] = b2.top - (i ? b1.bottom : b1.top);
              b1 = b2;
            });
            gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
              yPercent: i => yPercents[i]
            });
            totalHeight = getTotalHeight();
          },
          timeWrap,
          populateOffsets = () => {
            timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalHeight : 0;
            center && times.forEach((t, i) => {
              times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * heights[i] / 2 / totalHeight - timeOffset);
            });
          },
          getClosest = (values, value, wrap) => {
            let i = values.length,
              closest = 1e10,
              index = 0, d;
            while (i--) {
              d = Math.abs(values[i] - value);
              if (d > wrap / 2) {
                d = wrap - d;
              }
              if (d < closest) {
                closest = d;
                index = i;
              }
            }
            return index;
          },
          populateTimeline = () => {
            let i, item, curY, distanceToStart, distanceToLoop;
            tl.clear();
            for (i = 0; i < length; i++) {
              item = items[i];
              curY = yPercents[i] / 100 * heights[i];
              distanceToStart = item.offsetTop + curY - startY + spaceBefore[0];
              distanceToLoop = distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");
              tl.to(item, {yPercent: snap((curY - distanceToLoop) / heights[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
              // tl.recent().eventCallback("onUpdate", function(){
              //   // var mtx = new WebKitCSSMatrix(window.getComputedStyle(this.targets()[0]).transform)
              //   // console.log(window.getComputedStyle(this.targets()[0]).transform);
              //   // console.log(window.getComputedStyle(this.targets()[0]).transformOrigin);
              //   // var matrix = new WebKitCSSMatrix(this.targets()[0].style.transform);
              //   // console.log(this.targets()[0].style.transform.match(/-?[\d\.]+/g)[1]);
              //   var translY = Number(this.targets()[0].style.transform.match(/-?[\d\.]+/g)[1])
              //   // console.log(translY);
              //   // console.log(this.targets()[0].children[0].src);
              //   if (this.targets()[0].children[0].src == "http://localhost:8080/assets/photos/0000_16_9.png") {
              //     // console.log(window.getComputedStyle(this.targets()[0]))
              //     console.log(this.targets()[0].getBoundingClientRect().y + globalThis.scrollY)
              //     // console.log(window.getComputedStyle(this.targets()[0]).transform)
              //     // console.log(this.targets()[0].style.transform);
              //     // console.log(this.targets()[0].style.transform.match(/-?[\d\.]+/g)[1]);
              //   }
              //   // this.targets()[0].children[0].src = await photoList.getNext()
              //   // photoList.setNext(this.targets()[0].children[0])
              //   // refresh(true)
              // }); 
              tl.fromTo(item, {yPercent: snap((curY - distanceToLoop + totalHeight) / heights[i] * 100)}, {yPercent: yPercents[i], duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
              tl.recent().eventCallback("onStart", function(){
                // console.log(this.targets()[0].children[0].src);
                // this.targets()[0].children[0].src = await photoList.getNext()
                photoList.setNext(this.targets()[0].children[0])
                // refresh(true)
              }); 
              // Write sth on duration copare transform and if increased on Y then change - it should change at the bottom then
              tl.add("label" + i, distanceToStart / pixelsPerSecond);
              times[i] = distanceToStart / pixelsPerSecond;
            }
            timeWrap = gsap.utils.wrap(0, tl.duration());
          }, 
          customAnimations = () => {
            let { enterAnimation, leaveAnimation } = config,
                eachDuration = tl.duration() / items.length;
            items.forEach((item, i) => {
              let anim = enterAnimation && enterAnimation(item, eachDuration, i),
                  isAtEnd = anim && (tl.duration() - timeWrap(times[i] - Math.min(eachDuration, anim.duration())) < eachDuration - 0.05);
              anim && tl.add(anim, isAtEnd ? 0 : timeWrap(times[i] - anim.duration()));
              anim = leaveAnimation && leaveAnimation(item, eachDuration, i);
              isAtEnd = times[i] === tl.duration();
              anim && anim.duration() > eachDuration && anim.duration(eachDuration);
              anim && tl.add(anim, isAtEnd ? 0 : times[i]);
            });
          },
          refresh = (deep) => {
            console.log('refresh')
             let progress = tl.progress();
             tl.progress(0, true);
             populateHeights();
             deep && populateTimeline();
             populateOffsets();
             customAnimations();
             deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
          },
          onResize = () => refresh(true),
          // onDocChange = () => console.log('ADS'),
          proxy;
      gsap.set(items, {y: 0});
      populateHeights();
      populateTimeline();
      populateOffsets();
      customAnimations();
      window.addEventListener("resize", onResize);
      // window.addEventListener("DOMAttrModified", onDocChange);
      function toIndex(index, vars) {
        vars = clone(vars);
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (vars.revolutions) {
          time += tl.duration() * Math.round(vars.revolutions);
          delete vars.revolutions;
        }
        if (time < 0 || time > tl.duration()) {
          vars.modifiers = {time: timeWrap};
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);
        return tl.tweenTo(time, vars);
      }
      tl.elements = items;
      tl.next = vars => toIndex(curIndex+1, vars);
      tl.previous = vars => toIndex(curIndex-1, vars);
      tl.current = () => curIndex;
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.closestIndex = setCurrent => {
        let index = getClosest(times, tl.time(), tl.duration());
        setCurrent && (curIndex = index);
        return index;
      };
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      // if (config.draggable && typeof(Draggable) === "function") {
      //   proxy = document.createElement("div")
      //   let wrap = gsap.utils.wrap(0, 1),
      //       ratio, startProgress, draggable, dragSnap,
      //       align = () => tl.progress(wrap(startProgress + (draggable.startY - draggable.y) * ratio)),
      //       syncIndex = () => tl.closestIndex(true);
      //   typeof(InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://gsap.com/pricing");
      //   // draggable = Draggable.create(proxy, {
      //   //   trigger: items[0].parentNode,
      //   //   type: "y",
      //   //   onPressInit() {
      //   //     gsap.killTweensOf(tl);
      //   //     startProgress = tl.progress();
      //   //     refresh();
      //   //     ratio = 1 / totalHeight;
      //   //     gsap.set(proxy, {y: startProgress / -ratio})
      //   //   },
      //   //   onDrag: align,
      //   //   onThrowUpdate: align,
      //   //   inertia: true,
      //   //   snap: value => {
      //   //     let time = -(value * ratio) * tl.duration(),
      //   //         wrappedTime = timeWrap(time),
      //   //         snapTime = times[getClosest(times, wrappedTime, tl.duration())],
      //   //         dif = snapTime - wrappedTime;
      //   //     Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
      //   //     return (time + dif) / tl.duration() / -ratio;
      //   //   },
      //   //   onRelease: syncIndex,
      //   //   onThrowComplete: syncIndex
      //   // })[0];
      //   // tl.draggable = draggable;
      // }
      tl.closestIndex(true);
      onChange && onChange(items[curIndex], curIndex);
      timeline = tl;
      return () => window.removeEventListener("resize", onResize); // cleanup
    });
    return timeline;
  }