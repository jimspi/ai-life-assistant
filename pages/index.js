import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Video, Brain, Calendar, Map, Utensils, Home, Car, Heart, Briefcase, GraduationCap, CheckCircle, Clock, Star, ArrowRight, Lightbulb, Target, AlertCircle, User, TrendingUp, Zap, Settings, MessageCircle } from 'lucide-react';

const SmartAILifeAssistant = () => {
  const [uploads, setUploads] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('aiAssistantProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [showOnboarding, setShowOnboarding] = useState(!userProfile);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const fileInputRef = useRef(null);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('aiAssistantProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Helper functions for dynamic styling
  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' }
    };
    return colorMap[color] || colorMap.gray;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (type) => {
    const icons = {
      planning: Calendar,
      optimization: TrendingUp,
      organization: Home,
      habit: Zap,
      system: Settings,
      tracking: Target,
      research: Brain,
      shopping: Target,
      fitness: Heart,
      maintenance: Car,
      nutrition: Utensils,
      safety: AlertCircle
    };
    return icons[type] || Lightbulb;
  };

  const generateSmartAnalysis = (file, userContext) => {
    if (!userContext) return null;
    
    const { preferences, context } = userContext;
    
    const analysisExamples = [
      {
        category: 'Smart Home Optimization',
        icon: Home,
        color: 'blue',
        name: 'Kitchen Counter Organization',
        summary: `High-traffic workspace with optimization potential for your ${preferences.lifestyle} lifestyle`,
        contextualInsights: [
          `Based on your ${preferences.lifestyle} lifestyle, this setup wastes 15-20 minutes daily in search time`,
          `Your budget preference (${preferences.budget}) suggests $50-150 solutions rather than full renovation`,
          `${context.season} season means more indoor cooking - perfect timing for organization project`,
          'Previous success with quick organization tips indicates you will implement these changes'
        ],
        smartActionItems: [
          { 
            type: 'organization', 
            text: 'Install 3-tier counter organizer ($25-40) - matches your preference for budget-friendly solutions',
            priority: 'high',
            timeEstimate: '30 minutes',
            whyRecommended: 'You followed similar quick-setup advice before',
            costBreakdown: '$35 avg, saves 15 min/day = $2700/year in time value'
          },
          { 
            type: 'habit', 
            text: 'Create "2-minute rule" for counter items - put away anything that takes less than 2 min immediately',
            priority: 'high',
            timeEstimate: '0 minutes (habit)',
            whyRecommended: 'Aligns with your preference for productivity gains',
            costBreakdown: 'Free, prevents 90% of future clutter'
          }
        ],
        personalizedSuggestions: [
          `${context.location} area: Check local stores for organizers at 30% below online prices`,
          `Your goal of "home improvement" + ${context.season} timing = perfect project for this weekend`,
          'Since you prefer moderate budget solutions, avoiding $200+ cabinet systems'
        ]
      },
      {
        category: 'Health & Fitness Optimization',
        icon: Heart,
        color: 'red',
        name: 'Home Workout Space Assessment',
        summary: 'Functional fitness area with strategic improvement opportunities for your health goals',
        contextualInsights: [
          `Your health optimization goal + intermediate experience = ready for systematic approach`,
          `${preferences.lifestyle} lifestyle needs efficient 20-30 minute routines, not hour-long sessions`,
          'Previous interest in quick tips suggests you will use streamlined equipment setup',
          `${context.season} season = indoor fitness becomes primary option for 4-5 months`
        ],
        smartActionItems: [
          { 
            type: 'optimization', 
            text: 'Create 5-minute setup zone: weights, mat, towel in single grab-and-go container',
            priority: 'high',
            timeEstimate: '20 minutes setup',
            whyRecommended: 'Removes friction - your biggest barrier to consistency',
            costBreakdown: 'Storage bin $15, saves 5 min/workout = 25 hours/year'
          }
        ],
        personalizedSuggestions: [
          `${context.season} fitness: supplement with Vitamin D (consult doctor) - affects energy for workouts`,
          `Your ${preferences.budget} budget: focus on bodyweight + basic equipment vs expensive machines`,
          'Busy schedule: compound exercises that work multiple muscle groups simultaneously'
        ]
      },
      {
        category: 'Nutrition & Meal Planning',
        icon: Utensils,
        color: 'green',
        name: 'Meal Prep Ingredients Analysis',
        summary: `Fresh ingredients with strategic meal prep potential for your ${preferences.lifestyle} lifestyle`,
        contextualInsights: [
          `Recent interest in meal prep + ${preferences.lifestyle} = need for 2-3 hour Sunday sessions`,
          `Your ${preferences.budget} budget suggests batch cooking vs daily fresh meals or meal delivery`,
          `${context.location} location affects cooking times and ingredient availability`,
          `${context.season} season = hearty, warming meals that reheat well preferred over cold salads`
        ],
        smartActionItems: [
          { 
            type: 'planning', 
            text: 'Sunday 2-hour prep: protein base + grain base + 3 veggie variations = 12 meals',
            priority: 'high',
            timeEstimate: '2 hours weekly',
            whyRecommended: 'Matches your preference for time-efficient solutions',
            costBreakdown: '$40 groceries = $3.33/meal vs $12 restaurant average'
          }
        ],
        personalizedSuggestions: [
          `${context.location} grocery tip: Research local bulk stores for proteins and fresh produce`,
          'Your health optimization goal: add superfood boosts without expensive supplements',
          'Busy schedule backup: freeze half portions for extra-busy weeks'
        ]
      }
    ];

    // Select most relevant analysis based on user goals
    const relevantAnalyses = analysisExamples.filter(analysis => {
      return preferences.goals && preferences.goals.some(goal => 
        analysis.category.toLowerCase().includes(goal.split('_')[0])
      );
    });

    return relevantAnalyses[0] || analysisExamples[0];
  };

  const onboardingQuestions = [
    {
      title: "Welcome! Let's personalize your AI assistant",
      subtitle: "Tell us about yourself so we can provide better insights",
      type: "intro"
    },
    {
      title: "What's your name?",
      subtitle: "We'll use this to personalize your experience",
      type: "text",
      field: "name",
      placeholder: "Enter your first name"
    },
    {
      title: "How old are you?",
      subtitle: "This helps us understand your life stage and priorities",
      type: "select",
      field: "age",
      options: [
        { value: "18-25", label: "18-25 (Student/Early Career)" },
        { value: "26-35", label: "26-35 (Career Building)" },
        { value: "36-45", label: "36-45 (Established Professional)" },
        { value: "46-55", label: "46-55 (Peak Career)" },
        { value: "56-65", label: "56-65 (Pre-Retirement)" },
        { value: "65+", label: "65+ (Retirement)" }
      ]
    },
    {
      title: "What's your profession?",
      subtitle: "This helps us understand your schedule and constraints",
      type: "select",
      field: "profession",
      options: [
        { value: "student", label: "Student" },
        { value: "tech_professional", label: "Tech Professional" },
        { value: "healthcare", label: "Healthcare Worker" },
        { value: "teacher_educator", label: "Teacher/Educator" },
        { value: "business_finance", label: "Business/Finance" },
        { value: "creative_arts", label: "Creative/Arts" },
        { value: "trades_services", label: "Trades/Services" },
        { value: "entrepreneur", label: "Entrepreneur/Self-Employed" },
        { value: "retired", label: "Retired" },
        { value: "other", label: "Other" }
      ]
    },
    {
      title: "What's your lifestyle like?",
      subtitle: "This helps us recommend solutions that fit your reality",
      type: "select",
      field: "lifestyle",
      options: [
        { value: "very_busy", label: "Very Busy - Always on the go, minimal free time" },
        { value: "busy_professional", label: "Busy Professional - Full schedule but some flexibility" },
        { value: "balanced", label: "Balanced - Good work-life balance" },
        { value: "flexible", label: "Flexible - Significant control over schedule" },
        { value: "retired_leisurely", label: "Retired/Leisurely - Lots of free time" }
      ]
    },
    {
      title: "What's your budget approach?",
      subtitle: "We'll tailor recommendations to your spending comfort level",
      type: "select",
      field: "budget",
      options: [
        { value: "tight", label: "Tight Budget - Focus on free/very low cost solutions" },
        { value: "moderate", label: "Moderate - Willing to spend $25-150 for good solutions" },
        { value: "comfortable", label: "Comfortable - Can invest $150-500 in worthwhile improvements" },
        { value: "flexible", label: "Flexible - Budget isn't a primary constraint" }
      ]
    },
    {
      title: "Where are you located?",
      subtitle: "This helps with local recommendations and seasonal considerations",
      type: "text",
      field: "location",
      placeholder: "City, State (e.g., Denver, CO)"
    },
    {
      title: "What areas of life interest you most?",
      subtitle: "Select all that apply - we'll focus on these areas",
      type: "multi-select",
      field: "goals",
      options: [
        { value: "home_improvement", label: "🏠 Home Improvement & Organization" },
        { value: "health_fitness", label: "💪 Health & Fitness" },
        { value: "productivity", label: "⚡ Productivity & Work" },
        { value: "cooking_nutrition", label: "🍳 Cooking & Nutrition" },
        { value: "travel_adventure", label: "✈️ Travel & Adventure" },
        { value: "learning_skills", label: "📚 Learning & Skills" },
        { value: "relationships", label: "❤️ Relationships & Social" },
        { value: "finance_investing", label: "💰 Finance & Investing" },
        { value: "creativity_hobbies", label: "🎨 Creativity & Hobbies" }
      ]
    },
    {
      title: "How do you prefer to receive advice?",
      subtitle: "We'll adapt our communication style to match your preferences",
      type: "select",
      field: "communication_style",
      options: [
        { value: "detailed", label: "Detailed - Give me all the context and reasoning" },
        { value: "actionable", label: "Actionable - Just tell me what to do step-by-step" },
        { value: "quick", label: "Quick & Concise - Keep it brief and to the point" },
        { value: "creative", label: "Creative - I like innovative and unique suggestions" }
      ]
    }
  ];

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const fileUrl = URL.createObjectURL(file);
      const newUpload = {
        id: Date.now() + Math.random(),
        file,
        url: fileUrl,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        name: file.name,
        status: 'uploaded',
        timestamp: new Date()
      };

      setUploads(prev => [...prev, newUpload]);
      
      // Start smart analysis
      setAnalyzing(true);
      setCurrentAnalysis(newUpload.id);
      
      // Simulate intelligent processing time
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      const smartAnalysis = generateSmartAnalysis(file, userProfile);
      
      if (smartAnalysis) {
        setUploads(prev => prev.map(upload => 
          upload.id === newUpload.id 
            ? { ...upload, status: 'analyzed', analysis: smartAnalysis }
            : upload
        ));
        
        updateUserLearning(smartAnalysis);
      }
      
      setAnalyzing(false);
      setCurrentAnalysis(null);
    }
  };

  const updateUserLearning = (analysis) => {
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev,
        context: {
          ...prev.context,
          recent_interests: [analysis.category.toLowerCase(), ...(prev.context.recent_interests || []).slice(0, 4)]
        }
      }));
    }
  };

  const simulateUserFeedback = (upload, feedback) => {
    if (!userProfile || !upload.analysis) return;
    
    const analysisType = upload.analysis.category.toLowerCase();
    
    setUserProfile(prev => ({
      ...prev,
      learning_data: {
        ...prev.learning_data,
        followed_advice: feedback === 'helpful' 
          ? [...(prev.learning_data.followed_advice || []), analysisType]
          : prev.learning_data.followed_advice || [],
        ignored_suggestions: feedback === 'not_helpful'
          ? [...(prev.learning_data.ignored_suggestions || []), analysisType]
          : prev.learning_data.ignored_suggestions || []
      }
    }));
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const updateOnboardingData = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const completeOnboarding = () => {
    const currentSeason = new Date().getMonth() >= 2 && new Date().getMonth() <= 4 ? 'spring' :
                         new Date().getMonth() >= 5 && new Date().getMonth() <= 7 ? 'summer' :
                         new Date().getMonth() >= 8 && new Date().getMonth() <= 10 ? 'fall' : 'winter';
    
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        budget: prev.budget,
        lifestyle: prev.lifestyle,
        goals: prev.goals || [],
        experience_level: 'beginner',
        communication_style: prev.communication_style
      },
      context: {
        location: prev.location,
        season: currentSeason,
        recent_interests: [],
        profession: prev.profession,
        age: prev.age
      },
      learning_data: {
        ignored_suggestions: [],
        followed_advice: [],
        interaction_patterns: []
      },
      created_at: new Date().toISOString()
    }));
    
    setShowOnboarding(false);
  };

  const resetProfile = () => {
    localStorage.removeItem('aiAssistantProfile');
    setUserProfile(null);
    setShowOnboarding(true);
    setOnboardingStep(0);
    setUploads([]);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const OnboardingFlow = () => {
    const currentQuestion = onboardingQuestions[onboardingStep];
    const [currentValue, setCurrentValue] = useState('');
    const [selectedGoals, setSelectedGoals] = useState([]);

    useEffect(() => {
      if (currentQuestion?.field && userProfile?.[currentQuestion.field]) {
        if (currentQuestion.type === 'multi-select') {
          setSelectedGoals(userProfile[currentQuestion.field] || []);
        } else {
          setCurrentValue(userProfile[currentQuestion.field] || '');
        }
      }
    }, [onboardingStep, currentQuestion, userProfile]);

    const handleInputChange = (value) => {
      setCurrentValue(value);
      if (currentQuestion.field) {
        updateOnboardingData(currentQuestion.field, value);
      }
    };

    const handleMultiSelect = (value) => {
      const newSelection = selectedGoals.includes(value)
        ? selectedGoals.filter(g => g !== value)
        : [...selectedGoals, value];
      setSelectedGoals(newSelection);
      updateOnboardingData(currentQuestion.field, newSelection);
    };

    const canProceed = () => {
      if (currentQuestion.type === 'intro') return true;
      if (currentQuestion.type === 'multi-select') return selectedGoals.length > 0;
      return currentValue.trim() !== '';
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step {onboardingStep + 1} of {onboardingQuestions.length}</span>
                <span>{Math.round(((onboardingStep + 1) / onboardingQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((onboardingStep + 1) / onboardingQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Content */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentQuestion.title}</h2>
              <p className="text-gray-600">{currentQuestion.subtitle}</p>
            </div>

            {/* Input Fields */}
            <div className="mb-8">
              {currentQuestion.type === 'intro' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-lg text-gray-700">Let's create your personalized AI assistant!</p>
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'select' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(option.value)}
                      className={`w-full p-4 text-left border rounded-lg transition-all ${
                        currentValue === option.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'multi-select' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleMultiSelect(option.value)}
                      className={`w-full p-4 text-left border rounded-lg transition-all ${
                        selectedGoals.includes(option.value)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedGoals.includes(option.value)
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedGoals.includes(option.value) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleOnboardingBack}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  onboardingStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled={onboardingStep === 0}
              >
                Back
              </button>
              
              <button
                onClick={handleOnboardingNext}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {onboardingStep === onboardingQuestions.length - 1 ? 'Complete Setup' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UploadZone = () => (
    <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-purple-100 rounded-full">
          <Upload className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Any Photo or Video</h3>
          <p className="text-gray-600 mb-4">Smart AI learns your preferences and provides personalized insights</p>
          <button
            onClick={triggerFileUpload}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Analyze with AI
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );

  const UserProfileCard = () => {
    if (!userProfile) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">AI Learning Profile</h3>
            <p className="text-sm text-gray-500">Personalized for {userProfile.name}</p>
          </div>
          <button
            onClick={resetProfile}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 border border-gray-200 rounded"
          >
            Reset
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Style:</span>
            <span className="ml-2 text-gray-800 capitalize">{userProfile.preferences?.lifestyle?.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-600">Budget:</span>
            <span className="ml-2 text-gray-800 capitalize">{userProfile.preferences?.budget}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Focus Areas:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(userProfile.preferences?.goals || []).map((goal, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {goal.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SmartAnalysisCard = ({ upload }) => {
    if (!upload.analysis) return null;
    
    const { analysis } = upload;
    const IconComponent = analysis.icon;
    const colorClasses = getColorClasses(analysis.color);
    
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {upload.type === 'image' ? (
                <img src={upload.url} alt="Upload" className="w-full h-full object-cover" />
              ) : (
                <video src={upload.url} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                  <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{analysis.name}</h3>
                  <p className="text-sm text-gray-500">{analysis.category}</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <Brain className="w-3 h-3" />
                    <span>Smart AI</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{analysis.summary}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-800">Personalized Insights</h4>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">AI Learning</span>
            </div>
            <div className="space-y-3">
              {analysis.contextualInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-800">Smart Action Plan</h4>
            </div>
            <div className="space-y-4">
              {analysis.smartActionItems.map((action, index) => {
                const ActionIcon = getActionIcon(action.type);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <ActionIcon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 mb-1">{action.text}</div>
                        <div className="text-sm text-gray-600 mb-2">{action.whyRecommended}</div>
                        <div className="text-sm text-green-700 font-medium">{action.costBreakdown}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                        <span className="text-xs text-gray-500">{action.timeEstimate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-800">Personalized for You</h4>
            </div>
            <div className="space-y-2">
              {analysis.personalizedSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Was this analysis helpful?</span>
            <div className="flex gap-2">
              <button
                onClick={() => simulateUserFeedback(upload, 'helpful')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
              >
                👍 Yes
              </button>
              <button
                onClick={() => simulateUserFeedback(upload, 'not_helpful')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
              >
                👎 No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UploadItem = ({ upload }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {upload.type === 'image' ? (
            <img src={upload.url} alt="Upload" className="w-full h-full object-cover" />
          ) : (
            <video src={upload.url} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-800 truncate">{upload.name}</div>
          <div className="text-sm text-gray-500">
            {upload.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {upload.type === 'image' ? (
            <Camera className="w-4 h-4 text-gray-400" />
          ) : (
            <Video className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {upload.status === 'uploaded' && currentAnalysis === upload.id && (
        <div className="flex items-center gap-2 text-purple-600">
          <Clock className="w-4 h-4 animate-spin" />
          <span className="text-sm">Smart AI analyzing...</span>
        </div>
      )}
      
      {upload.status === 'analyzed' && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Personalized analysis ready</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Onboarding Flow */}
      {showOnboarding && <OnboardingFlow />}
      
      {/* Main App - Only show if onboarding is complete */}
      {!showOnboarding && userProfile && (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Smart AI Life Assistant
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI that learns your preferences, understands your context, 
              and provides increasingly personalized insights for every aspect of your life
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section with User Profile */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <UserProfileCard />
                <UploadZone />
                
                {uploads.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis History</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {uploads.slice().reverse().map(upload => (
                        <UploadItem key={upload.id} upload={upload} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            <div className="lg:col-span-2">
              {uploads.filter(u => u.status === 'analyzed').length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">AI Ready to Learn</h3>
                  <p className="text-gray-500">Upload content to get personalized insights that improve over time</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Smart Personalized Analysis</h2>
                  </div>
                  
                  {uploads
                    .filter(upload => upload.status === 'analyzed')
                    .slice()
                    .reverse()
                    .map(upload => (
                      <SmartAnalysisCard key={upload.id} upload={upload} />
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Learning Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Learns Your Preferences</h3>
              <p className="text-gray-600 text-sm">AI adapts to your budget, lifestyle, and goals for increasingly relevant advice</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Contextual Intelligence</h3>
              <p className="text-gray-600 text-sm">Considers your location, season, schedule, and previous interactions</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Continuously Improving</h3>
              <p className="text-gray-600 text-sm">Every interaction makes the AI smarter and more helpful for your specific needs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAILifeAssistant;
