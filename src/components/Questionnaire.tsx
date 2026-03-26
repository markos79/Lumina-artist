import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { UserPreferences } from '../types';

interface QuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void;
  initialPreferences?: UserPreferences;
}

const STEPS = [
  {
    id: 'styles',
    title: 'Which art styles resonate with you?',
    subtitle: 'Select all that apply',
    options: ['Abstract', 'Impressionism', 'Realism', 'Contemporary', 'Minimalism', 'Expressionism', 'Pop Art', 'Surrealism']
  },
  {
    id: 'colors',
    title: 'What color palettes do you prefer?',
    subtitle: 'Choose your favorite tones',
    options: ['Vibrant & Bold', 'Muted & Earthy', 'Monochrome (B&W)', 'Cool Blues & Greens', 'Warm Reds & Oranges', 'Pastels', 'Deep & Moody']
  },
  {
    id: 'moods',
    title: 'What mood should the artwork evoke?',
    subtitle: 'Think about the feeling of your space',
    options: ['Calm & Serene', 'Energetic & Inspiring', 'Sophisticated & Elegant', 'Mysterious & Deep', 'Joyful & Playful', 'Thought-provoking']
  },
  {
    id: 'budget',
    title: 'What is your investment range?',
    subtitle: 'This helps us find the right pieces',
    options: ['Under $1,000', '$1,000 - $3,000', '$3,000 - $7,000', '$7,000 - $15,000', '$15,000+']
  }
];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, initialPreferences }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<UserPreferences>(initialPreferences || {
    styles: [],
    colors: [],
    moods: [],
    budget: ''
  });

  const step = STEPS[currentStep];

  const handleToggleOption = (option: string) => {
    const key = step.id as keyof UserPreferences;
    if (key === 'budget') {
      setSelections(prev => ({ ...prev, [key]: option }));
    } else {
      setSelections(prev => {
        const current = prev[key] as string[];
        const updated = current.includes(option)
          ? current.filter(o => o !== option)
          : [...current, option];
        return { ...prev, [key]: updated };
      });
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(selections);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    const key = step.id as keyof UserPreferences;
    const val = selections[key];
    if (Array.isArray(val)) return val.length > 0;
    return val !== '';
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest text-gray-400">Step {currentStep + 1} of {STEPS.length}</span>
          <div className="flex space-x-1">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-8 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-gallery-ink' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
        <h2 className="text-3xl font-serif mb-2">{step.title}</h2>
        <p className="text-gray-500 italic">{step.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {step.options.map((option) => {
              const key = step.id as keyof UserPreferences;
              const isSelected = Array.isArray(selections[key]) 
                ? (selections[key] as string[]).includes(option)
                : selections[key] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleToggleOption(option)}
                  className={`flex items-center justify-between p-5 border transition-all duration-300 text-left ${
                    isSelected 
                      ? 'border-gallery-ink bg-gallery-ink text-white shadow-lg' 
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <span className="text-sm font-medium">{option}</span>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 text-sm uppercase tracking-widest transition-opacity ${
            currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`btn-primary flex items-center space-x-3 px-8 py-4 ${
            !isStepValid() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{currentStep === STEPS.length - 1 ? 'See Recommendations' : 'Next Step'}</span>
          {currentStep === STEPS.length - 1 ? <Sparkles size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
