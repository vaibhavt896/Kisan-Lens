import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { Camera, Leaf, Volume2, RotateCcw, Check, AlertTriangle, Info, Upload } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import './App.css';

// Disease database with treatment recommendations
const DISEASES = {
  'tomato_late_blight': {
    name: 'Late Blight',
    severity: 'high',
    description: 'A serious fungal disease that can destroy entire crops quickly',
    symptoms: 'Dark, water-soaked spots on leaves, white mold on undersides',
    treatment: [
      'Remove all affected plant parts immediately',
      'Apply copper-based fungicide every 7-10 days',
      'Improve air circulation around plants',
      'Avoid overhead watering',
      'Consider resistant varieties for future planting'
    ],
    prevention: 'Space plants properly, water at soil level, rotate crops yearly'
  },
  'tomato_early_blight': {
    name: 'Early Blight',
    severity: 'medium',
    description: 'Common fungal disease affecting older leaves first',
    symptoms: 'Brown spots with concentric rings, yellowing leaves',
    treatment: [
      'Remove affected lower leaves',
      'Apply organic neem oil spray',
      'Mulch around plants to prevent soil splash',
      'Water at base of plant only',
      'Improve soil drainage'
    ],
    prevention: 'Regular pruning, proper spacing, drip irrigation'
  },
  'tomato_leaf_mold': {
    name: 'Leaf Mold',
    severity: 'medium',
    description: 'Fungal disease common in humid conditions',
    symptoms: 'Yellow spots on upper leaves, fuzzy growth underneath',
    treatment: [
      'Increase ventilation around plants',
      'Remove affected leaves',
      'Apply sulfur-based fungicide',
      'Reduce humidity levels',
      'Water early in the day'
    ],
    prevention: 'Good air circulation, avoid overhead watering'
  },
  'tomato_yellow_leaf_curl': {
    name: 'Yellow Leaf Curl Virus',
    severity: 'high',
    description: 'Viral disease spread by whiteflies',
    symptoms: 'Yellowing, curling leaves, stunted growth',
    treatment: [
      'Control whitefly population immediately',
      'Use yellow sticky traps',
      'Apply insecticidal soap',
      'Remove severely affected plants',
      'Plant virus-resistant varieties'
    ],
    prevention: 'Control whiteflies, use reflective mulch, plant resistant cultivars'
  },
  'tomato_healthy': {
    name: 'Healthy Plant',
    severity: 'none',
    description: 'Your tomato plant appears healthy!',
    symptoms: 'Green, vibrant leaves with no disease signs',
    treatment: [
      'Continue current care routine',
      'Monitor regularly for any changes',
      'Maintain proper watering schedule',
      'Keep up with fertilization',
      'Watch for early signs of problems'
    ],
    prevention: 'Regular inspection, proper nutrition, consistent watering'
  }
};

const TRANSLATIONS = {
  en: {
    appName: 'Agri-Sage',
    scanPlant: 'Scan Your Plant',
    takePicture: 'Take Picture',
    retake: 'Retake Photo',
    analyzing: 'Analyzing your plant...',
    listenTreatment: 'Listen to Treatment',
    symptoms: 'Symptoms',
    treatment: 'Treatment Steps',
    prevention: 'Prevention Tips',
    confidence: 'Confidence',
    switchLanguage: 'Language'
  },
  hi: {
    appName: 'कृषि-साधु',
    scanPlant: 'अपने पौधे को स्कैन करें',
    takePicture: 'फोटो लें',
    retake: 'फिर से फोटो लें',
    analyzing: 'आपके पौधे का विश्लेषण कर रहे हैं...',
    listenTreatment: 'उपचार सुनें',
    symptoms: 'लक्षण',
    treatment: 'उपचार के चरण',
    prevention: 'बचाव के तरीके',
    confidence: 'विश्वसनीयता',
    switchLanguage: 'भाषा'
  },
  sw: {
    appName: 'Agri-Sage',
    scanPlant: 'Pima Mmea Wako',
    takePicture: 'Piga Picha',
    retake: 'Piga Picha Tena',
    analyzing: 'Tunachunguza mmea wako...',
    listenTreatment: 'Sikiliza Matibabu',
    symptoms: 'Dalili',
    treatment: 'Hatua za Matibabu',
    prevention: 'Namna za Kuzuia',
    confidence: 'Uhakika',
    switchLanguage: 'Lugha'
  }
};

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = TRANSLATIONS[currentLanguage];

  // TensorFlow.js model simulation (in real implementation, this would load an actual model)
  const analyzeImage = useCallback(async (imageData) => {
    setIsAnalyzing(true);
    
    // Simulate model processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate model prediction (in real app, this would use tf.js inference)
    const diseases = Object.keys(DISEASES);
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
    
    setDiagnosis({
      disease: randomDisease,
      confidence: confidence,
      timestamp: new Date().toISOString()
    });
    
    setIsAnalyzing(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsCameraActive(false);
        analyzeImage(imageSrc);
      }
    }
  }, [analyzeImage]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        setCapturedImage(imageSrc);
        setIsCameraActive(false);
        setUseFileUpload(false);
        analyzeImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  }, [analyzeImage]);

  const handleCameraError = useCallback((error) => {
    console.error('Camera error:', error);
    setCameraError('Camera access denied or not available');
    setUseFileUpload(true);
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setDiagnosis(null);
    setCameraError(null);
    setIsCameraActive(true);
    setUseFileUpload(false);
  }, []);

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language for speech synthesis
      const langCodes = { en: 'en-US', hi: 'hi-IN', sw: 'sw-KE' };
      utterance.lang = langCodes[currentLanguage] || 'en-US';
      
      // Adjust speech rate for better comprehension
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    }
  }, [currentLanguage]);

  const handleTreatmentAudio = useCallback(() => {
    if (diagnosis && DISEASES[diagnosis.disease]) {
      const disease = DISEASES[diagnosis.disease];
      const treatmentText = `${disease.name}. ${disease.description}. Treatment steps: ${disease.treatment.join('. ')}. Prevention: ${disease.prevention}`;
      speakText(treatmentText);
    }
  }, [diagnosis, speakText]);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: 'environment' } // Use back camera on mobile
  };

  // Test camera availability
  useEffect(() => {
    const testCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        stream.getTracks().forEach(track => track.stop());
        setCameraError(null);
      } catch (error) {
        handleCameraError(error);
      }
    };
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      testCamera();
    } else {
      setUseFileUpload(true);
      setCameraError('Camera not supported in this browser');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{t.appName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-emerald-700 text-white border-none rounded px-3 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Camera Section */}
        <Card className="mb-6 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gray-900">
              {isCameraActive && !useFileUpload ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  width="100%"
                  height="100%"
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                  onUserMediaError={handleCameraError}
                />
              ) : capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured plant" 
                  className="w-full h-full object-cover"
                />
              ) : useFileUpload ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800">
                  <Upload className="w-16 h-16 mb-4 text-emerald-400" />
                  <p className="text-lg mb-2">Upload Plant Photo</p>
                  <p className="text-sm text-gray-400 text-center px-4">
                    {cameraError || 'Tap the button below to upload an image'}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                    <p>Loading camera...</p>
                  </div>
                </div>
              )}
              
              {/* Camera overlay - only show when camera is active */}
              {isCameraActive && !useFileUpload && (
                <div className="absolute inset-0 border-4 border-emerald-400 rounded-lg m-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {isCameraActive ? (
            useFileUpload ? (
              <>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
                  disabled={isAnalyzing}
                >
                  <Upload className="w-6 h-6 mr-2" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            ) : (
              <Button
                onClick={capturePhoto}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
                disabled={isAnalyzing}
              >
                <Camera className="w-6 h-6 mr-2" />
                {t.takePicture}
              </Button>
            )
          ) : (
            <Button
              onClick={retakePhoto}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              {t.retake}
            </Button>
          )}
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <Card className="mb-6 border-emerald-200">
            <CardContent className="p-6 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <Leaf className="w-12 h-12 text-emerald-600 animate-bounce mb-4" />
                <p className="text-lg text-gray-600">{t.analyzing}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis Results */}
        {diagnosis && !isAnalyzing && (
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {DISEASES[diagnosis.disease].severity === 'high' && (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                  {DISEASES[diagnosis.disease].severity === 'medium' && (
                    <Info className="w-6 h-6 text-yellow-500" />
                  )}
                  {DISEASES[diagnosis.disease].severity === 'none' && (
                    <Check className="w-6 h-6 text-green-500" />
                  )}
                  <h3 className="text-xl font-bold text-gray-800">
                    {DISEASES[diagnosis.disease].name}
                  </h3>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {t.confidence}: {Math.round(diagnosis.confidence * 100)}%
                </Badge>
              </div>

              <p className="text-gray-600 mb-4">
                {DISEASES[diagnosis.disease].description}
              </p>

              {/* Voice Button */}
              <Button
                onClick={handleTreatmentAudio}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {t.listenTreatment}
              </Button>

              {/* Symptoms */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {t.symptoms}
                </h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {DISEASES[diagnosis.disease].symptoms}
                </p>
              </div>

              {/* Treatment Steps */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {t.treatment}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  {DISEASES[diagnosis.disease].treatment.map((step, index) => (
                    <li key={index} className="bg-emerald-50 p-3 rounded-lg">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prevention */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  {t.prevention}
                </h4>
                <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">
                  {DISEASES[diagnosis.disease].prevention}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default App;