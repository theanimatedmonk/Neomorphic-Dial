# Neomorphic Dial

A modern, interactive volume control dial with neomorphic design and real-time audio feedback.

![Neomorphic Dial Interface](https://img.shields.io/badge/Style-Neomorphic-blueviolet) ![Built with Rive](https://img.shields.io/badge/Built%20with-Rive-ff6b6b)

## ✨ Features

- **Interactive Dial Control**: Smooth pointer movement with real-time feedback
- **Audio System**: Incremental sound feedback on every 2-unit change (25-175 range)  
- **Color-Coded Zones**: Green (25-100%), Yellow (100-125%), Red (125-175%)
- **Neomorphic Design**: Modern soft UI with subtle shadows and highlights
- **Responsive**: Works seamlessly on desktop and mobile devices

## 🛠️ Technical Implementation

- **Rive Data Binding**: Uses Rive's pointer move listener to expose real-time X,Y coordinates
- **Angle Calculation**: Custom JavaScript function converts coordinates to precise dial angles
- **Value Mapping**: Mathematical interpolation between angle positions and perceived dial values
- **Audio Integration**: Web Audio API with browser autoplay policy compliance

## 🚀 How It Works

1. Rive animation captures pointer coordinates via data binding
2. JavaScript calculates the angle from center point using `Math.atan2()`
3. Angle is mapped to dial value range (25-175%) with smooth interpolation  
4. Audio feedback triggers on increment changes with smart rounding
5. Visual feedback updates color zones and percentage display

## 📁 Project Structure

```
├── index.html              # Main HTML with Inter font integration
├── script.js               # Core logic + audio system
├── style.css               # Neomorphic styling with CSS variables  
├── neomorphic_dial.riv     # Rive animation file
└── sounds/
    └── dial-sound.mp3      # Audio feedback file
```

## 🎯 Usage

1. Open `index.html` in a modern browser
2. Click anywhere to enable audio (browser policy requirement)
3. Drag or click on the dial to adjust volume
4. Enjoy smooth animations and audio feedback!

---

**Built with**: Rive, JavaScript, CSS Variables, Web Audio API
