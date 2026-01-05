// @input SceneObject vinyl
// @input Component.ScriptComponent[] audioControllers
// @input Component.ScriptComponent handController
// @input string propertyName
// @input string trackPropertyName
// @input string onDeckPropertyName

let transform = script.vinyl.getTransform();

const DEFAULT_POSITION = transform.getWorldPosition();
const DEFAULT_ROTATION = transform.getWorldRotation();

let playIndex = 0;
let rotation = transform.getLocalRotation().toEulerAngles();
rotation.z = 0.0;
const MEDIAN_COUNT = 100;
let prevSpeed = 1.0;
let prevSpeeds = [];
for (let i = 0; i < MEDIAN_COUNT; i++) {
  prevSpeeds[i] = 1.0;
}

let numPerMin = 33;
let T = numPerMin / 60;
let w0 = 2.0 * Math.PI * T; //rad/sec
let AnglePrev = rotation.z;
let isPaused = false;
let pauseTween = null;
let speed = 1.0;
let currentSpeed = 1.0;

let isOnDeck = false;
script.vinyl.enabled = false;

script.setOnDeck = (state) => {
  script.audioControllers.forEach((controller) => {
    controller[script.trackPropertyName]();
  });
  isOnDeck = state;
};

script.isOnDeck = () => {
  return isOnDeck;
};

script.getDeckPosition = () => {
  return DEFAULT_POSITION;
};

script.getDeckRotation = () => {
  return DEFAULT_ROTATION;
};

script.setSpeed = (inputSpeed) => {
  currentSpeed = inputSpeed;
  speed = inputSpeed;
};

script.pause = () => {
  isPaused = !isPaused;
};

class VinylInertia {
  // To obtain solution we assume that exist Vinil resistance force
  // Fv = - k * v(t) (which proportinal to velocity in analogy to aerodynamic force) | d(t) - Dirac func
  // Fh = -Fv , Fh - force by hand move, we assume that we set immediate accellaration | a(t) = a0*d(t)
  // Fh(t) = m * a(t), -> m*a0*d(t) = - k * v(t); So Fh just determine initial velocity a0*integ(d(t)) = a0
  // Transient responce: m *dv(t)/dt = -k*v(t) ; -> 1-ODE -> v(t) = c1 *exp(-k*t/m)
  // Also we can emulate it with finite difference y[n] = a*y[n-1] -> c2 * a^(n-1)

  constructor(decayTimeConstSec) {
    this.decayTimeConstSec = decayTimeConstSec;
    this.decay = -2.30258 / decayTimeConstSec; //-ln(0.1)
    this.playbackRate = 0.0;
    this.timePassed = 100.0;
  }

  getPlaybackRate(currentTime) {
    if (this.timePassed > 3 * this.decayTimeConstSec) {
      return 0.0;
    } else {
      this.timePassed += currentTime;
      return this.playbackRate * Math.exp(this.decay * this.timePassed);
    }
  }

  setPlaybackRate(playbackRate) {
    this.timePassed = 0.0;
    this.playbackRate = playbackRate;
  }
}

class ExponentAverageFilter {
  //y[n] = (1 - alpha) * x[n] + alpha * y[n-1]
  constructor(alpha) {
    this.alpha = alpha;
    this.prevRes = 0.0;
  }

  process(inSample) {
    let res = inSample * (1.0 - this.alpha) + this.alpha * this.prevRes;
    this.prevRes = res;

    return res;
  }
}

class DerivativeFilter {
  // dy(t)/ dt ~= (y[n] - y[n-1]) / T Error: O(h)
  // y'(t) ~= (y[n] - y[n-2]) / 2*T   Error: O(h^2)
  // We will use a second type of approximation
  constructor() {
    this.prevSample0 = 0.0;
    this.prevSample1 = 0.0;
    this.prevSample2 = 0.0;
    this.prevDeltaTime0 = 0.0;
    this.prevDeltaTime1 = 0.0;
  }

  push(sample, deltaTime) {
    this.prevSample2 = this.prevSample1;
    this.prevSample1 = this.prevSample0;
    this.prevSample0 = sample;
    this.prevDeltaTime1 = this.prevDeltaTime0;
    this.prevDeltaTime0 = deltaTime;
  }

  get() {
    return (this.prevSample0 - this.prevSample2) / (this.prevDeltaTime0 + this.prevDeltaTime1);
  }
}

const vinylInertial = new VinylInertia(0.75);
const smoothingFilter = new ExponentAverageFilter(0.4);
const derivativeFilter = new DerivativeFilter();

script.createEvent("UpdateEvent").bind(() => {
  if (script.vinyl.enabled && transform.getWorldPosition().distance(DEFAULT_POSITION) > 30) {
    script.vinyl.enabled = false;
    isOnDeck = false;
    script.audioControllers.forEach((controller) => {
      controller[script.onDeckPropertyName](false);
    });
  }
  if (!isOnDeck) {
    script.audioControllers.forEach((controller) => {
      controller[script.propertyName] = 0.0;
    });
    return;
  }
  transform.setWorldPosition(DEFAULT_POSITION);
  script.vinyl.enabled = true;
  let deltaTime = getDeltaTime();
  let w1 = 0.0;
  let rate = 1.0;

  if (isPaused) {
    if (pauseTween === null) {
      pauseTween = new TWEEN.Tween({x: currentSpeed})
        .to({x: 0.0}, 500)
        .onUpdate((value) => {
          speed = value.x;
          rate = rate + vinylInertial.getPlaybackRate(deltaTime);
          rotation.y = rotation.y - rate * w0 * deltaTime;
          derivativeFilter.push(rotation.y, deltaTime);
        })
        .start();
    }
  } else if (!script.handController.isTracking) {
    if (pauseTween) {
      pauseTween = new TWEEN.Tween({x: 0.0})
        .to({x: currentSpeed}, 500)
        .onUpdate((value) => {
          speed = value.x;
        })
        .onComplete(() => {
          pauseTween = null;
        })
        .start();
    }
    rate = rate + vinylInertial.getPlaybackRate(deltaTime);
    rotation.y = rotation.y - rate * w0 * deltaTime;
    derivativeFilter.push(rotation.y, deltaTime);
  } else {
    if (pauseTween) {
      pauseTween = new TWEEN.Tween({x: 0.0})
        .to({x: currentSpeed}, 500)
        .onUpdate((value) => {
          speed = value.x;
        })
        .onComplete(() => {
          pauseTween = null;
        })
        .start();
    }
    handControl = true;
    time = 0.0;
    let sign = 1.0;
    if (script.handController.angle > 0) {
      sign = -1.0;
    }

    rotation.y = rotation.y - sign * Math.sqrt(script.handController.speed);
    derivativeFilter.push(rotation.y, deltaTime);
    w1 = -derivativeFilter.get();
    w1 = smoothingFilter.process(w1);
    rate = w1 / w0;

    vinylInertial.setPlaybackRate(rate * speed);
  }
  script.audioControllers.forEach((controller) => {
    controller[script.propertyName] = rate * speed;
  });
  transform.setLocalRotation(quat.fromEulerVec(rotation));
});
