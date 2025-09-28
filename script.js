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

// Audio System
class DialAudioSystem {
  constructor() {
    this.audio = null;
    this.lastRoundedValue = 0;
    this.audioEnabled = false;
    this.loadDialSound();
    this.enableAudioOnInteraction();
  }

  // Load single dial sound MP3 file
  loadDialSound() {
    this.audio = new Audio('sounds/dial-sound.mp3');
    this.audio.preload = 'auto';
    this.audio.volume = 0.8; // Adjust volume as needed
    
    // Log when audio file is loaded
    this.audio.addEventListener('canplaythrough', () => {
      console.log('🎵 Dial sound loaded successfully');
    });
    
    // Handle audio loading errors
    this.audio.addEventListener('error', (e) => {
      console.error('❌ Failed to load dial-sound.mp3:', e);
    });
  }

  // Enable audio after user interaction (browser autoplay policy)
  enableAudioOnInteraction() {
    const enableAudio = () => {
      if (!this.audioEnabled && this.audio) {
        // Try to play and immediately pause to "unlock" audio
        this.audio.play().then(() => {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.audioEnabled = true;
          console.log('🔊 Audio unlocked - sounds will now play');
        }).catch(() => {
          console.log('⏳ Audio not yet unlocked - waiting for user interaction');
        });
      }
    };

    // Listen for any user interaction to enable audio
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, enableAudio, { once: true });
    });
  }

  // Check and trigger sound on every increment of 2
  checkIncrements(currentValue) {
    // Only play sounds within the valid range (25-175)
    if (currentValue < 25 || currentValue > 175) {
      return;
    }

    // Round current value to nearest 2
    const roundedValue = Math.round(currentValue / 2) * 2;
    
    // Play sound if we've moved to a different increment of 2
    if (roundedValue !== this.lastRoundedValue && roundedValue >= 25 && roundedValue <= 175) {
      this.playDialSound(roundedValue);
      this.lastRoundedValue = roundedValue;
    }
  }

  playDialSound(value) {
    if (this.audio && this.audioEnabled) {
      console.log(`🔊 Playing dial sound at: ${value}`);
      this.audio.currentTime = 0; // Reset to beginning for rapid playback
      this.audio.play().catch(error => {
        console.warn('Failed to play dial sound:', error);
      });
    } else if (this.audio && !this.audioEnabled) {
      console.log(`🔇 Audio not yet enabled - dial at: ${value}`);
    }
  }
}

// Initialize audio system
const audioSystem = new DialAudioSystem();

 const label = document.getElementById("label");
  
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
    src: "neomorphic_dial.riv",              // replace with your .riv path
    canvas: document.getElementById("riveCanvas"),
    artboard: "neomorphic dial",      // artboard name
    stateMachines: "Dial",            // state machine name
    autoplay: true,
    autoBind: false,                  // bind manually
    fit: rive.Fit.Contain,           // scale to fit within canvas
    alignment: rive.Alignment.Center, // center the animation
    onLoad: () => {
      console.log("✅ Rive loaded successfully");

      // Access view model
      const vm = riveInstance.viewModelByName("continuous dial");
      if (!vm) {
        console.error("❌ ViewModel 'continuous dial' not found");
        console.log("Available view models:", riveInstance.viewModelNames);
        return;
      }
  
      // Access instance
      const vmi = vm.instanceByName("default instance");
      if (!vmi) {
        console.error("❌ Instance 'default instance' not found");
        console.log("Available instances:", vm.instanceNames);
        return;
      }
  
      // Bind to the runtime
      riveInstance.bindViewModelInstance(vmi);
  
      // Get number props
      const propX = vmi.number("x-coordinate");
      const propY = vmi.number("y-coordinate");
      const propDial = vmi.number("dial-value");
  
      if (!propX || !propY || !propDial) {
        console.error("❌ Could not access properties (x-coordinate, y-coordinate, dial-value)");
        console.log("Available number properties:", vmi.numberNames);
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
          // Clamp display value between 25 and 175
          const clampedValue = Math.max(25, Math.min(175, Math.round(dval)));
          label.innerText = `${clampedValue}%`;
          
          // 🔊 Check for dial increments and trigger sounds
          audioSystem.checkIncrements(clampedValue);
          
          // Set color based on value range
          if (clampedValue >= 25 && clampedValue <= 100) {
            label.style.color = "#77FF88";
          } else if (clampedValue > 100 && clampedValue <= 125) {
            label.style.color = "#FFBD07";
          } else if (clampedValue > 125 && clampedValue <= 175) {
            label.style.color = "#F45255";
          }
        }
      };
  
      // Subscribe to changes
      propX.on(() => recompute());
      propY.on(() => recompute());
  
      // Initial sync
      recompute();
  
      console.log("Data binding active");
    },
    onError: (err) => {
      console.error("❌ Rive loading error:", err);
      console.log("Troubleshooting steps:");
      console.log("1. Check if 'neomorphic-dial.riv' file exists in the same directory");
      console.log("2. Verify the file is not corrupted");
      console.log("3. Check if the artboard name 'neomorphic dial' is correct");
      console.log("4. Check if the state machine 'Dial' exists");
      console.log("5. Try opening the file in Rive Editor to verify it's valid");
    },
  });
  