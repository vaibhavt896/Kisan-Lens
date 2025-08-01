# Kisan-Lens 🌱

An AI-Powered Progressive Web App (PWA) for farmers to diagnose plant diseases instantly, with full offline functionality.

[![Deploy with Vercel](https://vercel.com/button)](https://kisan-lens.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech Stack](https://img.shields.io/badge/React-TensorFlow.js-blueviolet)](https://react.dev/)

I developed Kisan-Lens to bridge the technology gap for smallholder farmers in regions with low connectivity. The goal was to create a free, accessible, and reliable tool that works without an internet connection, putting the power of on-device AI directly into the hands of those who feed the world.

---

## 🚀 Live Demo & Screenshot

**You can try the live application here:** **[https://kisan-lens.vercel.app/](https://kisan-lens.vercel.app/)**

<img width="1439" height="630" alt="Screenshot 2025-08-01 at 1 54 26 AM" src="https://github.com/user-attachments/assets/7f21b417-ddd8-4b00-b59e-1faca66fb270" />


---

## ✨ Key Features

### 🔬 AI Plant Disease Detection
- **On-Device Analysis:** Uses TensorFlow.js to run the model directly in the browser, ensuring it works completely offline.
- **Targeted Crop Support:** The MVP is focused on identifying 5 common diseases in **Tomato** plants.
- **Confidence Scoring:** Provides a confidence score with each diagnosis for transparency.

### 📱 Farmer-Friendly Interface
- **Mobile-First & Accessible:** Designed with large touch targets (48px+) and a high-contrast UI for outdoor use.
- **Icon-Driven Navigation:** Minimizes text dependency to overcome literacy barriers.
- **Camera & Upload Support:** Allows users to either take a live photo or upload one from their gallery.

### 🌍 Multi-Language & Voice Support
- **3 Languages:** Full support for **English, Hindi (हिंदी), and Swahili (Kiswahili)**.
- **Text-to-Speech:** Integrated Web Speech API to provide voice guidance for all diagnoses and recommendations.

### 💡 Actionable Guidance
- **Step-by-Step Treatment:** Provides simple, clear instructions for treating identified diseases.
- **Prevention Advice:** Offers recommendations to protect future crops.
- **Offline First:** All core features, including diagnosis and guidance, are available without an internet connection.

---

## 🏗️ Tech Stack & Architecture

This project was built with a focus on performance, accessibility, and offline capabilities.

* **Frontend:** **React 19**
* **On-Device AI:** **TensorFlow.js**
* **Styling:** **Tailwind CSS**
* **Camera Integration:** React Webcam
* **Icons:** Lucide React
* **PWA Core:** Service Workers, Web App Manifest
* **Deployment:** **Vercel**

### Technical Highlights
The primary technical challenge was implementing an efficient, on-device AI model. The architecture is built to support a real **EfficientNet-Lite** or **MobileNetV2** model. All image processing happens on the client-side, which was a key decision to guarantee user privacy and enable the app's powerful offline functionality.

---

## 🚀 Getting Started Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites
You will need `node.js` and `yarn` installed on your machine.

### Installation
1.  Clone the repository:
    ```sh
    git clone [https://github.com/vaibhavt896/Kisan-Lens.git](https://github.com/vaibhavt896/Kisan-Lens.git)
    ```
2.  Navigate to the frontend directory:
    ```sh
    cd Kisan-Lens/frontend
    ```
3.  Install dependencies:
    ```sh
    yarn install
    ```
4.  Start the development server:
    ```sh
    yarn start
    ```
    The application will be available at `http://localhost:3000`.

---

## 🔐 Privacy & Security

User privacy is a core principle of this project.

- **No Image Uploads:** All photos are processed directly on the user's device and are never uploaded to a server.
- **No User Tracking:** The application does not include any user tracking or analytics.
- **Client-Side Only:** All core functionality is handled within the browser.

---

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.

<p align="center">
  Built with ❤️ for farmers everywhere.
</p>
