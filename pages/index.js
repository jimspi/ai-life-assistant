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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Head>
          <title>AI Life Assistant - Smart Insights for Every Aspect of Life</title>
          <meta name="description" content="Upload photos and videos to get personalized AI insights for home, health, productivity, and more." />
        </Head>
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Life Assistant
              </h1>
            </div>
            
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
              Upload any photo or video and get intelligent insights, actionable recommendations, 
              and personalized suggestions for every aspect of your life
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Upload Anything</h3>
                <p className="text-gray-600">Photos of your space, food, projects, or any life situation</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-gray-600">Smart insights tailored to your lifestyle, budget, and goals</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Take Action</h3>
                <p className="text-gray-600">Prioritized steps, cost breakdowns, and personalized recommendations</p>
              </div>
            </div>

            <button
              onClick={() => signIn('google')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started with Google
            </button>

            <p className="text-gray-500 mt-6">Free to start • Secure • No spam</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Head>
        <title>AI Life Assistant Dashboard</title>
      </Head>

      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-800">AI Life Assistant</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-700">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {showOnboarding && (
        <OnboardingFlow 
          onComplete={completeOnboarding}
          userInfo={{
            name: session.user.name?.split(' ')[0],
            email: session.user.email
          }}
        />
      )}

      {!showOnboarding && userProfile && (
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <UserProfileCard 
                  profile={userProfile} 
                  onEdit={() => setShowOnboarding(true)} 
                />
                
                <UploadZone 
                  onUpload={handleFileUpload}
                  analyzing={analyzing}
                  fileInputRef={fileInputRef}
                />

                {uploads.length > 0 && (
                  <AnalysisHistory uploads={uploads.slice(0, 5)} />
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {uploads.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Your AI Insights</h2>
                  </div>
                  
                  {uploads.map(upload => (
                    <AnalysisCard 
                      key={upload.id}
                      upload={upload}
                      onFeedback={(feedback) => submitFeedback(upload.id, feedback)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

const UserProfileCard = ({ profile, onEdit }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-800">Your Profile</h3>
      <button 
        onClick={onEdit}
        className="text-sm text-purple-600 hover:text-purple-700"
      >
        Edit
      </button>
    </div>
    
    <div className="space-y-3 text-sm">
      <div>
        <span className="text-gray-600">Name:</span>
        <span className="ml-2 text-gray-800">{profile.name}</span>
      </div>
      <div>
        <span className="text-gray-600">Lifestyle:</span>
        <span className="ml-2 text-gray-800 capitalize">{profile.lifestyle?.replace('_', ' ')}</span>
      </div>
      <div>
        <span className="text-gray-600">Budget:</span>
        <span className="ml-2 text-gray-800 capitalize">{profile.budget}</span>
      </div>
      <div>
        <span className="text-gray-600">Location:</span>
        <span className="ml-2 text-gray-800">{profile.location}</span>
      </div>
      <div>
        <span className="text-gray-600">Focus Areas:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {(profile.goals || []).map((goal, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {goal.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const UploadZone = ({ onUpload, analyzing, fileInputRef }) => (
  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-purple-100 rounded-full">
        {analyzing ? (
          <Clock className="w-8 h-8 text-purple-600 animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-purple-600" />
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {analyzing ? 'AI Analyzing...' : 'Upload Photo or Video'}
        </h3>
        <p className="text-gray-600 mb-4">
          {analyzing ? 'Getting personalized insights' : 'Get smart insights for any life situation'}
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={analyzing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Processing...' : 'Choose Files'}
        </button>
      </div>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*,video/*"
      onChange={(e) => onUpload(e.target.files)}
      className="hidden"
    />
  </div>
);

const AnalysisHistory = ({ uploads }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <h3 className="font-semibold text-gray-800 mb-4">Recent Analysis</h3>
    <div className="space-y-3">
      {uploads.map(upload => (
        <div key={upload.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
            {upload.fileName?.includes('video') ? (
              <Video className="w-4 h-4 text-gray-500" />
            ) : (
              <Camera className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 truncate">
              {upload.analysis?.name || upload.fileName}
            </div>
            <div className="text-sm text-gray-500">
              {upload.timestamp?.toDate?.()?.toLocaleDateString() || 'Recently'}
            </div>
          </div>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Brain className="w-12 h-12 text-purple-600" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-600 mb-4">Ready to Get Smart Insights</h3>
    <p className="text-gray-500 max-w-md mx-auto mb-8">
      Upload your first photo or video to see how AI can help optimize any aspect of your life
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <Home className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <h4 className="font-semibold mb-2">Home & Organization</h4>
        <p className="text-sm text-gray-600">Space optimization, decluttering, design tips</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <Heart className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h4 className="font-semibold mb-2">Health & Fitness</h4>
        <p className="text-sm text-gray-600">Workout planning, nutrition analysis, wellness</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <Utensils className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h4 className="font-semibold mb-2">Food & Cooking</h4>
        <p className="text-sm text-gray-600">Meal planning, recipe suggestions, nutrition</p>
      </div>
    </div>
  </div>
);

const AnalysisCard = ({ upload, onFeedback }) => {
  if (!upload.analysis) return null;

  const { analysis } = upload;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          {upload.fileUrl && (
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={upload.fileUrl} alt="Upload" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{analysis.name}</h3>
                <p className="text-sm text-gray-500">{analysis.category}</p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <Brain className="w-3 h-3" />
                  <span>AI Analysis</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{analysis.summary}</p>
          </div>
        </div>

        {analysis.insights && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-800">Key Insights</h4>
            </div>
            <div className="space-y-3">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.actionItems && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-800">Recommended Actions</h4>
            </div>
            <div className="space-y-4">
              {analysis.actionItems.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-1">{action.text}</div>
                      {action.whyRecommended && (
                        <div className="text-sm text-gray-600 mb-2">{action.whyRecommended}</div>
                      )}
                      {action.costBreakdown && (
                        <div className="text-sm text-green-700 font-medium">{action.costBreakdown}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {action.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          action.priority === 'high' ? 'bg-red-100 text-red-700' :
                          action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {action.priority}
                        </span>
                      )}
                      {action.timeEstimate && (
                        <span className="text-xs text-gray-500">{action.timeEstimate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.suggestions && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-800">Additional Suggestions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full text-sm"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}

        {!upload.userFeedback && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Was this analysis helpful?</span>
            <div className="flex gap-2">
              <button
                onClick={() => onFeedback('helpful')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
              >
                👍 Yes
              </button>
              <button
                onClick={() => onFeedback('not_helpful')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
              >
                👎 No
              </button>
            </div>
          </div>
        )}

        {upload.userFeedback && (
          <div className="pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Thanks for your feedback! 
              {upload.userFeedback === 'helpful' ? ' 👍' : ' 👎'}
            </span>
          </div>
        )}
      </div>
    </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentQuestion.title}</h2>
            <p className="text-gray-600">{currentQuestion.subtitle}</p>
          </div>

          <div className="mb-8">
            {currentQuestion.type === 'intro' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-purple-600" />
                </div>
                <p className="text-lg text-gray-700">Let's get started!</p>
              </div>
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
              <div className="space-y-3">
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

          <div className="flex justify-between">
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
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
