import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { doc, getDoc, setDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Upload, Camera, Video, Brain, Calendar, Map, Utensils, Home, Car, Heart, Briefcase, GraduationCap, CheckCircle, Clock, Star, ArrowRight, Lightbulb, Target, AlertCircle, User, TrendingUp, Zap, Settings, LogOut } from 'lucide-react';
import Head from 'next/head';

export default function AILifeAssistant() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserProfile();
      loadUserAnalyses();
    }
  }, [session]);

  const loadUserProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', session.user.id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data.profile);
        setShowOnboarding(!data.profile?.completed);
      } else {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setShowOnboarding(true);
    }
  };

  const loadUserAnalyses = () => {
    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', session.user.id),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const analyses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUploads(analyses);
    });
  };

  const handleFileUpload = async (files) => {
    if (!session?.user?.id) {
      alert('Please sign in to upload files');
      return;
    }

    setAnalyzing(true);
    const fileArray = Array.from(files);

    try {
      for (const file of fileArray) {
        const storageRef = ref(storage, `uploads/${session.user.id}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const base64 = await convertToBase64(file);

        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: base64.split(',')[1],
            fileName: file.name,
            fileUrl: downloadURL,
          }),
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const result = await response.json();
        console.log('Analysis completed:', result);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const completeOnboarding = async (profileData) => {
    try {
      const completeProfile = {
        ...profileData,
        completed: true,
        createdAt: new Date(),
        userId: session.user.id,
      };

      await setDoc(doc(db, 'users', session.user.id), {
        profile: completeProfile,
        email: session.user.email,
        name: session.user.name,
        updatedAt: new Date(),
      });

      setUserProfile(completeProfile);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const submitFeedback = async (analysisId, feedback) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId,
          feedback,
          userId: session.user.id,
        }),
      });

      setUploads(prev => prev.map(upload => 
        upload.id === analysisId 
          ? { ...upload, userFeedback: feedback }
          : upload
      ));
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  if (status === 'loading') {
    return (
      
        
          
          Loading...
        
      
    );
  }

  if (!session) {
    return (
      
        
          AI Life Assistant - Smart Insights for Every Aspect of Life
          
        
        
        
          
            
              
                
              
              
                AI Life Assistant
              
            
            
            
              Upload any photo or video and get intelligent insights, actionable recommendations, 
              and personalized suggestions for every aspect of your life
            

            
              
                
                Upload Anything
                Photos of your space, food, projects, or any life situation
              
              
              
                
                AI Analysis
                Smart insights tailored to your lifestyle, budget, and goals
              
              
              
                
                Take Action
                Prioritized steps, cost breakdowns, and personalized recommendations
              
            

            <button
              onClick={() => signIn('google')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started with Google
            

            Free to start • Secure • No spam
          
        
      
    );
  }

  return (
    
      
        AI Life Assistant Dashboard
      

      
        
          
            
              
              AI Life Assistant
            
            
            
              {session.user.image && (
                
              )}
              {session.user.name}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                
                Sign Out
              
            
          
        
      

      {showOnboarding && (
        
      )}

      {!showOnboarding && userProfile && (
        
          
            
              
                <UserProfileCard 
                  profile={userProfile} 
                  onEdit={() => setShowOnboarding(true)} 
                />
                
                

                {uploads.length > 0 && (
                  
                )}
              
            

            
              {uploads.length === 0 ? (
                
              ) : (
                
                  
                    
                    Your AI Insights
                  
                  
                  {uploads.map(upload => (
                    <AnalysisCard 
                      key={upload.id}
                      upload={upload}
                      onFeedback={(feedback) => submitFeedback(upload.id, feedback)}
                    />
                  ))}
                
              )}
            
          
        
      )}
    
  );
}

const UserProfileCard = ({ profile, onEdit }) => (
  
    
      Your Profile
      
        Edit
      
    
    
    
      
        Name:
        {profile.name}
      
      
        Lifestyle:
        {profile.lifestyle?.replace('_', ' ')}
      
      
        Budget:
        {profile.budget}
      
      
        Location:
        {profile.location}
      
      
        Focus Areas:
        
          {(profile.goals || []).map((goal, index) => (
            
              {goal.replace('_', ' ')}
            
          ))}
        
      
    
  
);

const UploadZone = ({ onUpload, analyzing, fileInputRef }) => (
  
    
      
        {analyzing ? (
          
        ) : (
          
        )}
      
      
        
          {analyzing ? 'AI Analyzing...' : 'Upload Photo or Video'}
        
        
          {analyzing ? 'Getting personalized insights' : 'Get smart insights for any life situation'}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={analyzing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Processing...' : 'Choose Files'}
        
      
    
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*,video/*"
      onChange={(e) => onUpload(e.target.files)}
      className="hidden"
    />
  
);

const AnalysisHistory = ({ uploads }) => (
  
    Recent Analysis
    
      {uploads.map(upload => (
        
          
            {upload.fileName?.includes('video') ? (
              
            ) : (
              
            )}
          
          
            
              {upload.analysis?.name || upload.fileName}
            
            
              {upload.timestamp?.toDate?.()?.toLocaleDateString() || 'Recently'}
            
          
          
        
      ))}
    
  
);

const EmptyState = () => (
  
    
      
    
    Ready to Get Smart Insights
    
      Upload your first photo or video to see how AI can help optimize any aspect of your life
    
    
      
        
        Home & Organization
        Space optimization, decluttering, design tips
      
      
        
        Health & Fitness
        Workout planning, nutrition analysis, wellness
      
      
        
        Food & Cooking
        Meal planning, recipe suggestions, nutrition
      
    
  
);

const AnalysisCard = ({ upload, onFeedback }) => {
  if (!upload.analysis) return null;

  const { analysis } = upload;

  return (
    
      
        
          {upload.fileUrl && (
            
              
            
          )}
          
            
              
                
              
              
                {analysis.name}
                {analysis.category}
              
              
                
                  
                  AI Analysis
                
              
            
            {analysis.summary}
          
        

        {analysis.insights && (
          
            
              
              Key Insights
            
            
              {analysis.insights.map((insight, index) => (
                
                  
                  {insight}
                
              ))}
            
          
        )}

        {analysis.actionItems && (
          
            
              
              Recommended Actions
            
            
              {analysis.actionItems.map((action, index) => (
                
                  
                    
                    
                      {action.text}
                      {action.whyRecommended && (
                        {action.whyRecommended}
                      )}
                      {action.costBreakdown && (
                        {action.costBreakdown}
                      )}
                    
                    
                      {action.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          action.priority === 'high' ? 'bg-red-100 text-red-700' :
                          action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {action.priority}
                        
                      )}
                      {action.timeEstimate && (
                        {action.timeEstimate}
                      )}
                    
                  
                
              ))}
            
          
        )}

        {analysis.suggestions && (
          
            
              
              Additional Suggestions
            
            
              {analysis.suggestions.map((suggestion, index) => (
                
                  {suggestion}
                
              ))}
            
          
        )}

        {!upload.userFeedback && (
          
            Was this analysis helpful?
            
              <button
                onClick={() => onFeedback('helpful')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
              >
                👍 Yes
              
              <button
                onClick={() => onFeedback('not_helpful')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
              >
                👎 No
              
            
          
        )}

        {upload.userFeedback && (
          
            
              Thanks for your feedback! 
              {upload.userFeedback === 'helpful' ? ' 👍' : ' 👎'}
            
          
        )}
      
    
  );
};

const OnboardingFlow = ({ onComplete, userInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: userInfo.name || '',
    email: userInfo.email || '',
  });

  const questions = [
    {
      title: "Welcome to AI Life Assistant!",
      subtitle: `Hi ${userInfo.name}! Let's personalize your experience`,
      type: "intro"
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
      title: "What areas interest you most?",
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
        { value: "finance_investing", label: "💰 Finance & Investing" },
        { value: "creativity_hobbies", label: "🎨 Creativity & Hobbies" }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const [currentValue, setCurrentValue] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);

  const handleNext = () => {
    if (currentQuestion.type === 'multi-select') {
      setFormData(prev => ({ ...prev, [currentQuestion.field]: selectedGoals }));
    } else if (currentQuestion.field) {
      setFormData(prev => ({ ...prev, [currentQuestion.field]: currentValue }));
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentValue('');
    } else {
      const finalData = {
        ...formData,
        [currentQuestion.field]: currentQuestion.type === 'multi-select' ? selectedGoals : currentValue
      };
      onComplete(finalData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentQuestion.type === 'intro') return true;
    if (currentQuestion.type === 'multi-select') return selectedGoals.length > 0;
    return currentValue.trim() !== '';
  };

  const handleMultiSelect = (value) => {
    setSelectedGoals(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    
      
        
          
            
              Step {currentStep + 1} of {questions.length}
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            
            
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              >
            
          

          
            {currentQuestion.title}
            {currentQuestion.subtitle}
          

          
            {currentQuestion.type === 'intro' && (
              
                
                  
                
                Let's get started!
              
            )}

            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
            )}

            {currentQuestion.type === 'select' && (
              
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCurrentValue(option.value)}
                    className={`w-full p-4 text-left border rounded-lg transition-all ${
                      currentValue === option.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  
                ))}
              
            )}

            {currentQuestion.type === 'multi-select' && (
              
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
                    
                      
                        {selectedGoals.includes(option.value) && (
                          
                        )}
                      
                      {option.label}
                    
                  
                ))}
              
            )}
          

          
            <button
              onClick={handleBack}
              className={`px-6 py-3 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              disabled={currentStep === 0}
            >
              Back
            
            
            
              {currentStep === questions.length - 1 ? 'Complete Setup' : 'Next'}
            
          
        
      
    
  );
};
