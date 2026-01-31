'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ChevronRight, ChevronLeft, Check, User, MapPin, Hash, Globe } from 'lucide-react';
import styles from './OnboardingModal.module.css';

interface OnboardingData {
  language: string;
  name: string;
  state: string;
  district: string;
  pincode: string;
  isLoggedIn: boolean;
}

interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const LANGUAGES = [
  { code: 'hi', name: 'हिंदी', english: 'Hindi', flag: '🇮🇳' },
  { code: 'en', name: 'English', english: 'English', flag: '🇬🇧' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', english: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', english: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', english: 'Bengali', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', english: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati', flag: '🇮🇳' }
];

const QUESTIONS = {
  en: [
    'Welcome to Kisan Unnati! 🙏 Please select your preferred language',
    'May I know your good name?',
    'Which state do you belong to?',
    'Which district do you reside in?',
    'Please share your pincode'
  ],
  hi: [
    'किसान उन्नति में आपका स्वागत है! 🙏 कृपया अपनी भाषा चुनें',
    'कृपया अपना शुभ नाम बताइए',
    'आप किस राज्य से हैं?',
    'आप किस जिले में रहते हैं?',
    'कृपया अपना पिनकोड बताइए'
  ]
};

const STEP_ICONS = [Globe, User, MapPin, MapPin, Hash];

export default function OnboardingModal({ onComplete, onSkip }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    language: 'hi',
    name: '',
    state: '',
    district: '',
    pincode: '',
    isLoggedIn: false
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const stepRef = useRef(step);

  // Keep stepRef in sync with step
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = data.language === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        
        // Update input field in real-time as user speaks
        const currentStep = stepRef.current;
        if (currentStep === 1) {
          setData(prev => ({ ...prev, name: transcript }));
        } else if (currentStep === 3) {
          setData(prev => ({ ...prev, district: transcript }));
        } else if (currentStep === 4) {
          const pincodeMatch = transcript.replace(/\s/g, '').match(/\d{6}/);
          if (pincodeMatch) {
            setData(prev => ({ ...prev, pincode: pincodeMatch[0] }));
          }
        }
        
        if (event.results[0].isFinal) {
          handleVoiceInput(transcript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setVoiceText('');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = data.language === 'hi' ? 'hi-IN' : 'en-IN';
    }
  }, [data.language]);

  // Auto speak question when step changes
  useEffect(() => {
    // Only speak if user has interacted (browser autoplay policy)
    if (!hasInteracted && step === 0) return;
    
    // Wait a bit for speechSynthesis to be ready on first load
    const timer = setTimeout(() => {
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const questions = data.language === 'hi' ? QUESTIONS.hi : QUESTIONS.en;
        const utterance = new SpeechSynthesisUtterance(questions[step]);
        utterance.lang = data.language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.9;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          // Auto start listening after question (except language selection)
          if (step > 0 && recognitionRef.current) {
            setTimeout(() => {
              try {
                setIsListening(true);
                recognitionRef.current.start();
              } catch (e) {
                console.log('Speech recognition already started');
              }
            }, 500);
          }
        };
        
        synth.speak(utterance);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [step, data.language, hasInteracted]);

  // Function to start voice on first interaction
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Speak the first question after user interaction
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const questions = data.language === 'hi' ? QUESTIONS.hi : QUESTIONS.en;
        const utterance = new SpeechSynthesisUtterance(questions[0]);
        utterance.lang = data.language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        synth.speak(utterance);
      }
    }
  };

  const speakQuestion = (questionIndex: number) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const questions = data.language === 'hi' ? QUESTIONS.hi : QUESTIONS.en;
      const utterance = new SpeechSynthesisUtterance(questions[questionIndex]);
      utterance.lang = data.language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto start listening after question (except language selection)
        if (questionIndex > 0 && recognitionRef.current) {
          setTimeout(() => {
            try {
              setIsListening(true);
              recognitionRef.current.start();
            } catch (e) {
              console.log('Speech recognition already started');
            }
          }, 500);
        }
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setVoiceText('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    const text = transcript.toLowerCase().trim();
    
    switch (step) {
      case 0: // Language selection
        const selectedLang = LANGUAGES.find(lang => 
          text.includes(lang.english.toLowerCase()) || 
          text.includes(lang.name.toLowerCase())
        );
        if (selectedLang) {
          setData(prev => ({ ...prev, language: selectedLang.code }));
          setTimeout(() => handleNext({ language: selectedLang.code }), 500);
        }
        break;
      case 1: // Name
        setData(prev => ({ ...prev, name: transcript }));
        break;
      case 2: // State
        const selectedState = INDIAN_STATES.find(state => 
          text.includes(state.toLowerCase())
        );
        if (selectedState) {
          setData(prev => ({ ...prev, state: selectedState }));
        }
        break;
      case 3: // District
        setData(prev => ({ ...prev, district: transcript }));
        break;
      case 4: // Pincode
        const pincodeMatch = transcript.replace(/\s/g, '').match(/\d{6}/);
        if (pincodeMatch) {
          setData(prev => ({ ...prev, pincode: pincodeMatch[0] }));
        }
        break;
    }
    setVoiceText('');
  };

  const handleNext = (updates: Partial<OnboardingData> = {}) => {
    const newData = { ...data, ...updates };
    setData(newData);
    setVoiceText('');

    if (step < 4) {
      setStep(step + 1);
      // Question will be spoken automatically by useEffect
    } else {
      setShowSuccess(true);
      setTimeout(() => handleComplete(newData), 1500);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setVoiceText('');
      // Question will be spoken automatically by useEffect
    }
  };

  const handleComplete = (finalData: OnboardingData) => {
    localStorage.setItem('userOnboarded', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(finalData));
    onComplete(finalData);
  };

  const handleSkipClick = () => {
    localStorage.setItem('userOnboarded', 'true');
    onSkip();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!data.language;
      case 1: return !!data.name.trim();
      case 2: return !!data.state;
      case 3: return !!data.district.trim();
      case 4: return data.pincode.length === 6;
      default: return false;
    }
  };

  const questions = data.language === 'hi' ? QUESTIONS.hi : QUESTIONS.en;
  const currentQuestion = questions[step];
  const StepIcon = STEP_ICONS[step];

  if (showSuccess) {
    return (
      <div className={styles.overlay}>
        <div className={styles.successModal}>
          <div className={styles.successIcon}>
            <Check size={48} />
          </div>
          <h2 className={styles.successTitle}>
            {data.language === 'hi' ? 'स्वागत है!' : 'Welcome!'}
          </h2>
          <p className={styles.successText}>
            {data.language === 'hi' 
              ? `नमस्ते ${data.name} जी! आपका सेटअप पूरा हो गया है।` 
              : `Hello ${data.name}! Your setup is complete.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>🌾</div>
            <span className={styles.brandName}>Kisan Unnati</span>
          </div>
          <button onClick={handleSkipClick} className={styles.skipBtn}>
            {data.language === 'hi' ? 'छोड़ें' : 'Skip'}
          </button>
        </div>

        {/* Progress Steps */}
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className={styles.progressSteps}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${styles.stepDot} ${i < step ? styles.completed : ''} ${i === step ? styles.current : ''}`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          {/* Step Icon & Question */}
          <div className={styles.questionSection}>
            <div className={styles.stepIconWrapper}>
              <StepIcon size={28} />
            </div>
            <h2 className={styles.question}>{currentQuestion}</h2>
            
            {/* Start Voice Button - shown only on first step before interaction */}
            {step === 0 && !hasInteracted && (
              <button 
                onClick={handleFirstInteraction}
                className={styles.startVoiceBtn}
              >
                <Volume2 size={20} />
                {data.language === 'hi' ? '🔊 सवाल सुनें' : '🔊 Listen to Question'}
              </button>
            )}
          </div>

          {/* Voice Status */}
          {(isListening || voiceText) && (
            <div className={styles.voiceStatus}>
              {isListening && (
                <div className={styles.listeningIndicator}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              )}
              {voiceText && <p className={styles.voiceTranscript}>"{voiceText}"</p>}
            </div>
          )}

          {/* Step-specific input */}
          <div className={styles.inputArea}>
            {step === 0 && (
              <div className={styles.languageGrid}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleNext({ language: lang.code })}
                    className={`${styles.languageCard} ${data.language === lang.code ? styles.selected : ''}`}
                  >
                    <span className={styles.langFlag}>{lang.flag}</span>
                    <div className={styles.langText}>
                      <span className={styles.langNative}>{lang.name}</span>
                      <span className={styles.langEnglish}>{lang.english}</span>
                    </div>
                    {data.language === lang.code && (
                      <div className={styles.checkBadge}><Check size={16} /></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  placeholder={data.language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className={styles.input}
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className={styles.inputWrapper}>
                <MapPin className={styles.inputIcon} size={20} />
                <select
                  value={data.state}
                  onChange={(e) => setData({ ...data, state: e.target.value })}
                  className={styles.select}
                  autoFocus
                  title={data.language === 'hi' ? 'राज्य चुनें' : 'Select state'}
                >
                  <option value="">{data.language === 'hi' ? '-- राज्य चुनें --' : '-- Select State --'}</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 3 && (
              <div className={styles.inputWrapper}>
                <MapPin className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  placeholder={data.language === 'hi' ? 'जिले का नाम' : 'Enter district name'}
                  value={data.district}
                  onChange={(e) => setData({ ...data, district: e.target.value })}
                  className={styles.input}
                  autoFocus
                />
              </div>
            )}

            {step === 4 && (
              <div className={styles.inputWrapper}>
                <Hash className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  placeholder={data.language === 'hi' ? '6 अंकों का पिनकोड' : '6-digit pincode'}
                  value={data.pincode}
                  onChange={(e) => setData({ ...data, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className={styles.input}
                  maxLength={6}
                  autoFocus
                />
                <div className={styles.pincodeHint}>
                  {data.pincode.length}/6
                </div>
              </div>
            )}
          </div>

          {/* Voice controls - Farmer Friendly */}
          <div className={styles.voiceSection}>
            <p className={styles.voiceHint}>
              {data.language === 'hi' ? '🎤 बोलकर भी जवाब दें' : '🎤 Or speak your answer'}
            </p>
            <div className={styles.voiceControls}>
              <button
                onClick={() => speakQuestion(step)}
                className={styles.speakerBtn}
                disabled={isSpeaking}
                title={data.language === 'hi' ? 'सवाल सुनें' : 'Hear question'}
              >
                <Volume2 size={22} />
                <span>{data.language === 'hi' ? 'सुनें' : 'Listen'}</span>
              </button>
              <button
                onClick={isListening ? stopListening : startListening}
                className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
                disabled={isSpeaking}
              >
                {isListening ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
              <div className={styles.micLabel}>
                {isListening 
                  ? (data.language === 'hi' ? 'सुन रहा हूं...' : 'Listening...')
                  : (data.language === 'hi' ? 'बोलें' : 'Speak')
                }
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.actions}>
            {step > 0 && (
              <button onClick={handleBack} className={styles.backBtn}>
                <ChevronLeft size={20} />
                {data.language === 'hi' ? 'पीछे' : 'Back'}
              </button>
            )}
            <button
              onClick={() => canProceed() && handleNext()}
              className={`${styles.nextBtn} ${!canProceed() ? styles.disabled : ''}`}
              disabled={!canProceed()}
            >
              {step === 4 
                ? (data.language === 'hi' ? 'शुरू करें' : 'Get Started')
                : (data.language === 'hi' ? 'आगे बढ़ें' : 'Continue')
              }
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}