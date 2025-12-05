// ============================================
// FILE: src/components/CookieConsent.jsx - NEW
// ============================================
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, Cookie, Settings, CheckCircle, XCircle } from 'lucide-react';
import { cookieConsent } from '../lib/cookieConsent';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    if (!cookieConsent.hasConsent()) {
      // Show consent popup after a brief delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    cookieConsent.acceptAll();
    setShowConsent(false);
    // Here you can initialize analytics, etc.
    // Example: if (cookieConsent.canUseAnalytics()) { initializeGoogleAnalytics(); }
    console.log('All cookies accepted');
  };

  const handleRejectAll = () => {
    cookieConsent.rejectAll();
    setShowConsent(false);
    console.log('All cookies rejected');
  };

  const handleCustomize = () => {
    setShowDetails(true);
  };

  const handleSavePreferences = (analytics, marketing) => {
    cookieConsent.setCustom(analytics, marketing);
    setShowConsent(false);
    setShowDetails(false);
    console.log('Custom preferences saved:', { analytics, marketing });
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2">
        <CardContent className="p-0">
          {!showDetails ? (
            // Main Consent Banner
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2">
                    🍪 We Use Cookies
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    We use cookies to enhance your experience, analyze site traffic, and personalize content.
                    By continuing to use our site, you agree to our use of cookies. You can manage your preferences
                    or learn more about how we use cookies in our{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </a>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleAcceptAll} size="sm" className="flex-1 sm:flex-none">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept All
                    </Button>
                    <Button onClick={handleCustomize} variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    <Button onClick={handleRejectAll} variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject All
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setShowConsent(false)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // Detailed Preferences
            <CookiePreferences onSave={handleSavePreferences} onBack={() => setShowDetails(false)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Detailed Cookie Preferences Component
const CookiePreferences = ({ onSave, onBack }) => {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    onSave(analytics, marketing);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Cookie Preferences</h3>
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Essential Cookies */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Essential Cookies</h4>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
              Always Active
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            These cookies are necessary for the website to function and cannot be switched off in our systems.
            They are usually only set in response to actions made by you which amount to a request for services.
          </p>
        </div>

        {/* Analytics Cookies */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Analytics Cookies</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
            They help us to know which pages are the most and least popular and see how visitors move around the site.
          </p>
        </div>

        {/* Marketing Cookies */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Marketing Cookies</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            These cookies may be set through our site by our advertising partners. They may be used by those companies
            to build a profile of your interests and show you relevant adverts on other sites.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          <Button onClick={onBack} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;