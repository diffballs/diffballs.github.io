/**
 * Copyright (c) 2023
 * |   MaksymMNM                |
 * |   arschedev                |
 * |   A. Proydenko (wert1x),   |
 * https://github.com/wert1x
 * https://github.com/arschedev
 * https://github.com/MaksymMNM
 */


/**
 * ! Utils
 */

function $getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function $getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function $getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

/**
 * ! Parameters
 */

let params = {
  fps: 36,
  size: () => 40 /* medium */,
  form: 'smooth',
  border: false
}

// to default
document.getElementById('fps').value = params.fps;
document.getElementById('size').value = params.size();
document.getElementById('form').value = params.form;
document.getElementById('border').checked = params.border;

// fps
function on_fps_select(e) {
  params.fps = +e.options[e.selectedIndex].value;
  update();
}

// size
function on_size_select(e) {
  // random
  if (e.options[e.selectedIndex].value === 'random') {
    params.size = () =>
      // tiny..medium
      $getRandomInt(10, 40);
  } else {
    // fixed
    params.size = () => +e.options[e.selectedIndex].value;
  }
}

// form
function on_form_select(e) {
  params.form = e.options[e.selectedIndex].value;
}

// border
function on_border_check(e) {
  if (!e.checked) {
    document.getElementById('container').style.border = '0';
  } else {
    document.getElementById('container').style.border = '2px dashed #000';
  }
}

/**
 * ! Counters
 */

let ballons_counter = document.getElementById('ballons');
let caught_counter = document.getElementById('caught');

/**
 * ! Game
 */

let container = document.getElementById('container');

// click event
document.getElementById('container').addEventListener('mousedown', click);

// ballons data array
let ballons = [];

// game update interval
let interval;

//! click
function click(event) {
  // was caught?
  if (wasCaught(event)) return;

  // create ballon
  let ballon = createBall(event);
  ballon.element.className = 'ballon';
  ballon.element.style.width = ballon.w + 'px';
  ballon.element.style.height = ballon.h + 'px';

  // add ballon to container
  container.append(ballon.element);

  // add ballon data to the array of ballons
  ballons.push(ballon);

  // increment Balls counter
  const ballonsN = +ballons_counter.textContent;
  ballons_counter.textContent = String(ballonsN + 1).length < 2 ?
    '0' + String(ballonsN + 1) : String(ballonsN + 1);

  // start Update
  if (!interval) update();
}

// createBall
function createBall(event) {
  let ballon = {
    x: event.clientX,
    y: event.clientY,
    xS: Math.floor(Math.random() * 20) - 10, // FIXME
    yS: Math.floor(Math.random() * 20) - 10, // FIXME
    w: Math.floor(Math.random() * 20) + params.size(),
    h: Math.floor(Math.random() * 20) + params.size(),
    element: document.createElement('div')
  }
  if (params.form === 'smooth') ballon.h = ballon.w;
  return ballon;
}

// wasCaught
function wasCaught(event) {
  for (let i = 0; i < ballons.length; i++) {
    if (event.clientX >= ballons[i].x && event.clientX <= ballons[i].x + ballons[i].w && event.clientY >= ballons[i].y && event.clientY <= ballons[i].y + ballons[i].h) {
      // remove ballon from screen
      ballons[i].element.remove();

      // remove ballon data from the array of ballons
      ballons.splice(i, 1);

      // increment "caught" counter
      const caughtN = +caught_counter.textContent;
      caught_counter.textContent = String(caughtN + 1).length < 2 ?
        '0' + String(caughtN + 1) : String(caughtN + 1);

      // decrement "ballons" counter
      const ballonsN = +ballons_counter.textContent;
      ballons_counter.textContent = String(ballonsN - 1).length < 2 ?
        '0' + String(ballonsN - 1) : String(ballonsN - 1);

      return true;
    }
  }
}

//! interval
function update() {
  clearInterval(interval);
  interval = setInterval(Update, Math.floor(1000 / params.fps));
}

//! Update
function Update() {
  for (let i = 0; i < ballons.length; i++) {
    // change position
    /* TODO decrease speed proportionally to fps */
    ballons[i].x += ballons[i].xS;
    ballons[i].y += ballons[i].yS;

    // make visible
    if (ballons[i].element.style.display !== 'initial')
      ballons[i].element.style.display = 'initial';

    // bounce off container walls
    /* collision check && change position */
    if (ballons[i].x < 0 || ballons[i].x > $getWidth() - ballons[i].w)
      ballons[i].xS *= -1;
    /* collision check && change position */
    if (ballons[i].y < 0 || ballons[i].y > $getHeight() - ballons[i].h)
      ballons[i].yS *= -1;

    // apply position
    ballons[i].element.style.top = ballons[i].y + 'px';
    ballons[i].element.style.left = ballons[i].x + 'px';
  }

  // FIXME
  // bounce off ballons
  for (let single in ballons) {
    for (let others in ballons) {
      if (others === single) continue;
      // collision check
      if ((Math.abs(ballons[single].x - ballons[others].x) + Math.abs(ballons[single].y - ballons[others].y)) <= 60) {
        // change position
        ballons[single].xS *= -1;
        ballons[single].yS *= -1;

        // apply position
        ballons[single].element.style.top = ballons[single].y + 'px';
        ballons[single].element.style.left = ballons[single].x + 'px';
      }
    }
  }
}

/**
 * ! Timer
 * by MaksymMNM
 */

let hour = 0;
let min = 0;
let sec = 0;

let timer = document.getElementById('timer');

function timer_init() {
  setInterval(timerTick, 1000);
}

function timerTick() {
  sec++;
  if (sec >= 60) {
    min++;
    sec = sec - 60;
  }
  if (min >= 60) {
    hour++;
    min = min - 60;
  }
  if (sec <= 9) {
    if (min <= 9) {
      if (hour <= 9) {
        timer.innerHTML = '0' + hour + ':0' + min + ':0' + sec;
      } else {
        timer.innerHTML = hour + ':0' + min + ':0' + sec;
      }
    } else {
      if (hour <= 9) {
        timer.innerHTML = '0' + hour + ':' + min + ':0' + sec;
      } else {
        timer.innerHTML = hour + ':' + min + ':0' + sec;
      }
    }
  } else {
    if (min < 10) {
      if (hour <= 9) {
        timer.innerHTML = '0' + hour + ':0' + min + ':' + sec;
      } else {
        timer.innerHTML = hour + ':0' + min + ':' + sec;
      }
    } else {
      if (hour <= 9) {
        timer.innerHTML = '0' + hour + ':' + min + ':' + sec;
      } else {
        timer.innerHTML = hour + ':' + min + ':' + sec;
      }
    }
  }
}
