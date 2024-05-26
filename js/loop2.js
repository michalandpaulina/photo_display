import { gsap } from "../node_modules/gsap/index.js";

var photoList

let sideSpeed = 0.9
let sideMidSpeed = 1.1
let midSpeed = 1.3

// sideSpeed = 0.09
// sideMidSpeed = 0.1
// midSpeed = 0.13
midSpeed = 2

// var loop_left
// var loop_left_mid
var loop_mid
// var loop_right_mid
// var loop_right

// let loop = verticalLoop("#loop_left .box1", {repeat: -1, draggable: true, paused: true});

setup()


export function myFunction() {
    console.log(loop_mid)
    // console.log(loop_left.parent)
    // console.log(loop_left)
    // console.log(loop_left.closestIndex())
    // loop_left.refresh(true)
}


async function setup() {
  await initialiseLoops(['loop_mid'])

  // loop_left = verticalLoop("#loop_left .box_left", {repeat: -1, 
  //   speed: sideSpeed,
  //   center: true});
  // loop_left_mid = verticalLoop("#loop_left_mid .box_left_mid", {repeat: -1, 
  //   speed: sideMidSpeed,
  //   center: true});
  loop_mid = verticalLoop("#loop_mid .box_mid", {repeat: 0, 
    speed: midSpeed,
    center: true});
  // loop_right_mid = verticalLoop("#loop_right_mid .box_right_mid", {repeat: -1, 
  //   speed: sideMidSpeed,
  //   center: true});
  // loop_right = verticalLoop("#loop_right .box_right", {repeat: -1, 
  //   speed: sideSpeed,
  //   center: true});
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



function verticalLoop(items, config) {
    let timeline;
      items = gsap.utils.toArray(items);
      config = config || {};
      console.log(config)
    gsap.context(() => {
      let onChange = config.onChange,
          lastIndex = 0,
          tl = gsap.timeline(
            {repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}}),
          length = items.length,
          startY = items[0].offsetTop,
          times = [],
          heights = [],
          spaceBefore = [],
          yPercents = [],
          initPosistions = [],
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
              if (i == 0) {
                initPosistions[i] = 0
              }
              else {
                initPosistions[i] = initPosistions[i - 1] + heights[i - 1]
              }
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
            console.log('poptime')
            let i, item, curY, distanceToStart, distanceToLoop;
            tl.clear();
            let px_to_travel = 0;
            for (i = 0; i < length; i++) {
              item = items[i];
              curY = yPercents[i] / 100 * heights[i];
              console.log("yPercents")
              console.log(curY)
              console.log("yPercents")
              distanceToStart = item.offsetTop + curY - startY + spaceBefore[0];
              distanceToLoop = distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");
              let target_px_change = heights[i] + initPosistions[i]

              // console.log(heights[i])
              // console.log(snap((curY - distanceToLoop) / heights[i] * 100))
              tl.to(item,
                {
                  // yPercent: snap(-target_px_change / heights[i] * 100),
                  yPercent: snap((curY - distanceToLoop) / heights[i] * 100),
                  // y: -heights[i],
                  duration: target_px_change / pixelsPerSecond,
                  data: i
                },
                0
              )
              tl.recent().eventCallback("onComplete", function(){
                console.log("ASD")
                console.log(this.targets()[0])
                console.log(this)
                populateHeights()
                let this_idx = this.data;
                let last_idx = (this.data + 1) % heights.length;
                curY = yPercents[this_idx] / 100 * heights[this_idx];
                distanceToStart = item.offsetTop + curY - startY + spaceBefore[0];
                distanceToLoop = distanceToStart + heights[this_idx] * gsap.getProperty(this.targets()[0], "scaleY");
                console.log(yPercents[this_idx])
                console.log(yPercents[last_idx])
                // console.log(curY)
                // console.log(distanceToStart)
                console.log(totalHeight)
                console.log(this_idx)
                console.log(last_idx)
                console.log(tl.elements[last_idx])
                // console.log(snap((totalHeight) / heights[this_idx] * 100))
                // this.kill()
                console.log(heights)
                console.log(heights.reduce((partialSum, a) => partialSum + a, 0))
                var bot_of_last = gsap.getProperty(tl.elements[last_idx], "yPercent") * heights[last_idx] / 100 + initPosistions[last_idx] + heights[last_idx] - initPosistions[this_idx]
                console.log(bot_of_last)
                console.log(bot_of_last / heights[this_idx] * 100)
                console.log(snap(bot_of_last / heights[this_idx] * 100))
                // console.log(parseFloat(gsap.getProperty(tl.elements[last_idx], "y", "px")))
                // bot_of_last = (100 + yPercents[last_idx]) * heights[last_idx] / 100
                console.log(heights)
                tl.to(
                  this.targets()[0],
                  {
                    yPercent: snap(bot_of_last / heights[this_idx] * 100),
                    // yPercent: snap((curY - distanceToLoop + totalHeight) / heights[i] * 100),
                    // yPercent: 100,
                    immediateRender: true,
                    duration: 0,
                    onComplete: function(){
                      console.log("tl.recent()")
                      console.log("tl.recent()")
                      console.log("tl.recent()")
                      console.log("tl.recent()")
                      console.log("tl.recent()")
                      console.log("tl.recent()")
                      console.log(tl.recent())
                      refresh(true)
                    }
                  }
                )
                let target_px_pos = -(heights[this_idx] + initPosistions[this_idx])
                let total_change = bot_of_last - target_px_pos
                console.log("bot_of_last")
                console.log(bot_of_last)
                console.log("target_px_pos")
                console.log(target_px_pos)
                console.log("total_change")
                console.log(total_change)
                console.log(tl.duration())
                // tl.recent().eventCallback("onComplete", function(){
                //   console.log(tl.recent())
                //   refresh(true)
                // })
                // refresh(true)
                // tl.to(this.targets()[0],
                // {
                //   yPercent: snap(target_px_pos) / heights[this_idx] * 100,
                //   // immediateRender: true,
                //   duration: total_change / pixelsPerSecond,
                //   overwrite: true
                // }
                // )
                // console.log(tl.duration())
                // timeWrap = gsap.utils.wrap(0, tl.duration())
              })

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
          // onResize = () => refresh(true),
          // onDocChange = () => console.log('ADS'),
          proxy;
      gsap.set(items, {y: 0});
      populateHeights();
      populateTimeline();
      populateOffsets();
      // customAnimations();
      // window.addEventListener("resize", onResize);
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
      // return () => window.removeEventListener("resize", onResize); // cleanup
    });
    return timeline;
  }