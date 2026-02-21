# AutoPilot X
A browser-based self-driving car simulation built completely from scratch using **Vanilla JavaScript** and **HTML5 Canvas**.

This project demonstrates how a car can learn to drive autonomously using:

* Ray-casting sensors
* A custom feedforward neural network
* Genetic mutation for improvement
* Collision detection using polygon intersection
* LocalStorage for saving trained models

No machine learning libraries. Everything implemented manually.
![Untitled video - Made with Clipchamp](https://github.com/user-attachments/assets/568f2662-e23b-4eef-af80-781794fdce92)

---

## 🧠 How It Works

### 1️⃣ Car Physics

* Acceleration, friction, steering angle
* Forward and reverse motion
* Realistic turning behavior
* Polygon-based collision detection

### 2️⃣ Sensor System

Each AI car has:

* 5 rays spread across 90°
* Ray casting detects:

  * Road borders
  * Other traffic cars
* Distance to obstacles is converted into neural network inputs

### 3️⃣ Neural Network

Architecture:

```
Input Layer  →  Hidden Layer  →  Output Layer
  (5 rays)         (6 neurons)       (4 controls)
```

Outputs control:

* Forward
* Left
* Right
* Reverse

Neurons fire using:

```
if (sum > bias) → 1
else → 0
```

---

### 4️⃣ Genetic Learning

* 100 AI cars are generated.
* The car that reaches the furthest distance becomes the **best car**.
* Its neural network is:

  * Saved
  * Cloned
  * Mutated slightly for other cars

This allows gradual improvement over generations.

---

## 💾 Save & Load Brain

Buttons on the UI:

* 💾 Save → Stores best neural network in `localStorage`
* 🗑️ Discard → Deletes saved brain

This allows persistent training between sessions.

---

## 🛣️ Project Structure

```
index.html      → Canvas + UI
style.css       → Styling

main.js         → Simulation loop
car.js          → Car physics + AI integration
controls.js     → Keyboard control logic
sensor.js       → Ray casting logic
road.js         → Road rendering
network.js      → Neural Network implementation
utils.js        → Math helpers (lerp, intersection, collision)
```

---

## ▶️ How To Run

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Open `index.html` in your browser.

That’s it.

No build tools required.
