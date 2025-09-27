// Angle → Value mapping
const angleMap = [
    { angle:   0, value: 0 }, // bottom
    { angle:  45, value: 25 },
    { angle:  90, value: 50 },  // left
    { angle: 135, value: 75 },
    { angle: 180, value: 100 }, // top
    { angle: 225, value: 125 },
    { angle: 270, value: 150 }, // right
    { angle: 315, value: 175 },
    { angle: 359, value: 200 },
    { angle: 360, value: 0 }
  ];
  
  // Function to compute dial value from (x,y)
  function getDialValue(x, y) {
    const cx = 150, cy = 150; // dial center
    const rawAngle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
    const angle = (rawAngle + 270) % 360; // 0° bottom, clockwise
  
    console.log(`rawAngle: ${rawAngle.toFixed(2)}°, adjustedAngle: ${angle.toFixed(2)}°`);
  
    for (let i = 0; i < angleMap.length - 1; i++) {
      const a1 = angleMap[i].angle, v1 = angleMap[i].value;
      const a2 = angleMap[i + 1].angle, v2 = angleMap[i + 1].value;
      if (angle >= a1 && angle <= a2) {
        const t = (angle - a1) / (a2 - a1);
        const val = v1 + t * (v2 - v1);
        console.log(`Interpolated value: ${val.toFixed(2)}`);
        return val;
      }
    }
    return null;
  }
  
  // Initialize Rive
  const riveInstance = new rive.Rive({
    src: "volume_app.riv",              // replace with your .riv path
    canvas: document.getElementById("riveCanvas"),
    stateMachines: "Dial",            // state machine name
    artboard: "Volume booster dial continuous",      // artboard name
    autoplay: true,
    autoBind: false,                  // bind manually
    fit: rive.Fit.Contain,           // scale to fit within canvas
    alignment: rive.Alignment.Center, // center the animation
    onLoad: () => {
      console.log("Rive loaded");
  
      // Access view model
      const vm = riveInstance.viewModelByName("continuous dial");
      if (!vm) {
        console.error("ViewModel 'continuous dial' not found");
        return;
      }
  
      // Access instance
      const vmi = vm.instanceByName("default instance");
      if (!vmi) {
        console.error("Instance 'default instance' not found");
        return;
      }
  
      // Bind to the runtime
      riveInstance.bindViewModelInstance(vmi);
  
      // Get number props
      const propX = vmi.number("x-coordinate");
      const propY = vmi.number("y-coordinate");
      const propDial = vmi.number("dial-value");
  
      if (!propX || !propY || !propDial) {
        console.error("Could not access properties in view model");
        return;
      }
  
      // Function to recompute dial
      const recompute = () => {
        const x = propX.value;
        const y = propY.value;
        console.log("VM coords:", x, y);
        const dval = getDialValue(x, y);
        if (dval !== null) {
          propDial.value = dval;
        }
      };
  
      // Subscribe to changes
      propX.on(() => recompute());
      propY.on(() => recompute());
  
      // Initial sync
      recompute();
  
      console.log("Data binding active");
    },
    onError: (err) => console.error("Rive error:", err),
  });
  