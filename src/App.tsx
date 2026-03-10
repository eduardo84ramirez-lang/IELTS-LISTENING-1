import React, { useState, useEffect, useRef } from 'react';
import { ieltsTestData, Section, Question } from './data/ieltsData';
import { generateIeltsAudio } from './services/audioService';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  User, 
  Trophy,
  Loader2,
  Headphones,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({});
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSection = ieltsTestData[currentSectionIndex];

  const handleStart = () => {
    if (studentName.trim()) {
      setIsStarted(true);
      loadAudio(0);
    }
  };

  const loadAudio = async (index: number) => {
    if (audioUrls[index]) return;
    
    setIsLoadingAudio(true);
    try {
      const section = ieltsTestData[index];
      const url = await generateIeltsAudio(section.script, section.isMultiSpeaker, section.speakers);
      setAudioUrls(prev => ({ ...prev, [index]: url }));
    } catch (error) {
      console.error("Audio generation failed:", error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentSectionIndex < ieltsTestData.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setIsPlaying(false);
      loadAudio(nextIndex);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setIsPlaying(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    ieltsTestData.forEach(section => {
      section.questions.forEach(q => {
        if (answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
          score++;
        }
      });
    });
    return score;
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 font-serif">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-[#5A5A40]/10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shadow-lg">
              <Headphones size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#1a1a1a]">IELTS Listening</h1>
              <p className="text-[#5A5A40] italic">Test your proficiency with 40 questions</p>
            </div>
            
            <div className="w-full space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/50" size={20} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all outline-none text-lg"
                />
              </div>
              <button
                onClick={handleStart}
                disabled={!studentName.trim()}
                className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4A4A30] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                Start Practice Test
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <div className="bg-[#F5F5F0] p-4 rounded-2xl text-center">
                <p className="text-2xl font-bold text-[#5A5A40]">40</p>
                <p className="text-xs uppercase tracking-widest opacity-60">Questions</p>
              </div>
              <div className="bg-[#F5F5F0] p-4 rounded-2xl text-center">
                <p className="text-2xl font-bold text-[#5A5A40]">4</p>
                <p className="text-xs uppercase tracking-widest opacity-60">Sections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-[#F5F5F0] p-6 font-serif">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-[#5A5A40]/10 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                <Trophy size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-[#1a1a1a]">Test Complete!</h2>
              <p className="text-xl text-[#5A5A40]">Excellent work, {studentName}!</p>
            </div>
            
            <div className="flex justify-center gap-12 py-6">
              <div className="text-center">
                <p className="text-6xl font-black text-[#5A5A40]">{score}</p>
                <p className="text-sm uppercase tracking-widest opacity-60">Total Score</p>
              </div>
              <div className="text-center">
                <p className="text-6xl font-black text-[#5A5A40]">{Math.round((score / 40) * 9 * 10) / 10}</p>
                <p className="text-sm uppercase tracking-widest opacity-60">Band Score</p>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#5A5A40] text-white rounded-full font-bold hover:bg-[#4A4A30] transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
              <ClipboardList className="text-[#5A5A40]" />
              Detailed Report
            </h3>
            
            {ieltsTestData.map((section) => (
              <div key={section.id} className="bg-white rounded-3xl shadow-md overflow-hidden border border-[#5A5A40]/10">
                <div className="bg-[#5A5A40] px-6 py-4 text-white">
                  <h4 className="text-lg font-bold">{section.title}</h4>
                </div>
                <div className="p-6 space-y-4">
                  {section.questions.map((q) => {
                    const isCorrect = answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim();
                    return (
                      <div key={q.id} className={cn(
                        "flex items-start gap-4 p-4 rounded-2xl border-l-4",
                        isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
                      )}>
                        <div className="mt-1">
                          {isCorrect ? <CheckCircle2 className="text-green-600" size={20} /> : <XCircle className="text-red-600" size={20} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1a1a1a]">Question {q.id}: {q.text}</p>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-[#5A5A40]/60 uppercase text-[10px] font-bold tracking-wider">Your Answer</p>
                              <p className={cn("font-bold", isCorrect ? "text-green-700" : "text-red-700")}>
                                {answers[q.id] || "(No answer)"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#5A5A40]/60 uppercase text-[10px] font-bold tracking-wider">Correct Answer</p>
                              <p className="font-bold text-green-700">{q.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-serif pb-20">
      {/* Header */}
      <header className="bg-white border-b border-[#5A5A40]/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white">
              <Headphones size={20} />
            </div>
            <div>
              <h2 className="font-bold text-[#1a1a1a] leading-tight">IELTS Listening</h2>
              <p className="text-xs text-[#5A5A40] opacity-60">Progress: {Math.round(((currentSectionIndex) / 4) * 100)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[#5A5A40] opacity-60 uppercase tracking-widest font-bold">Student</p>
              <p className="font-bold text-[#1a1a1a]">{studentName}</p>
            </div>
            <div className="w-10 h-10 bg-[#F5F5F0] rounded-full flex items-center justify-center text-[#5A5A40]">
              <User size={20} />
            </div>
          </div>
        </div>
        <div className="h-1 bg-[#F5F5F0] w-full">
          <div 
            className="h-full bg-[#5A5A40] transition-all duration-500" 
            style={{ width: `${((currentSectionIndex + 1) / 4) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Section Info */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-[#5A5A40]/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A5A40] opacity-60">Section {currentSection.id} of 4</span>
              <h1 className="text-3xl font-bold text-[#1a1a1a]">{currentSection.title}</h1>
              <p className="text-[#5A5A40] italic">{currentSection.description}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-[#F5F5F0] p-4 rounded-2xl min-w-[280px]">
              {isLoadingAudio ? (
                <div className="flex items-center gap-3 text-[#5A5A40]">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="font-medium">Generating audio...</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-[#5A5A40] text-white rounded-full flex items-center justify-center hover:bg-[#4A4A30] transition-all shadow-md"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-1">Listen to Audio</p>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div className={cn("h-full bg-[#5A5A40]", isPlaying ? "animate-pulse" : "")} style={{ width: isPlaying ? '100%' : '0%' }} />
                    </div>
                  </div>
                </>
              )}
              {audioUrls[currentSectionIndex] && (
                <audio 
                  ref={audioRef} 
                  src={audioUrls[currentSectionIndex]} 
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentSection.questions.map((q) => (
            <div key={q.id} className="bg-white rounded-3xl shadow-sm p-6 border border-[#5A5A40]/10 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#F5F5F0] rounded-lg flex items-center justify-center text-[#5A5A40] font-bold text-sm shrink-0">
                  {q.id}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[#1a1a1a] font-medium leading-relaxed">{q.text}</p>
                  
                  {q.type === 'gap-fill' && (
                    <input
                      type="text"
                      placeholder={q.placeholder}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full px-4 py-3 bg-[#F5F5F0] border-none rounded-xl focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    />
                  )}

                  {q.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      {q.options?.map((option) => (
                        <label 
                          key={option} 
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                            answers[q.id] === option ? "bg-[#5A5A40] text-white" : "bg-[#F5F5F0] hover:bg-[#E5E5DF]"
                          )}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={option}
                            checked={answers[q.id] === option}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="hidden"
                          />
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            answers[q.id] === option ? "border-white" : "border-[#5A5A40]/30"
                          )}>
                            {answers[q.id] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#5A5A40] hover:bg-white transition-all disabled:opacity-30"
          >
            <ChevronLeft size={20} />
            Previous Section
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-[#5A5A40] text-white rounded-full font-bold hover:bg-[#4A4A30] shadow-lg hover:shadow-xl transition-all group"
          >
            {currentSectionIndex === ieltsTestData.length - 1 ? 'Finish Test' : 'Next Section'}
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>
    </div>
  );
}
