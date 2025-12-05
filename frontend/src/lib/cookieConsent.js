// ============================================
// FILE: src/lib/cookieConsent.js - NEW
// ============================================
// Cookie Consent Utility
//
// Usage Examples:
//
// // Check if user has given consent
// if (cookieConsent.hasConsent()) { ... }
//
// // Check specific permissions
// if (cookieConsent.canUseAnalytics()) {
//   // Initialize Google Analytics
//   initializeGoogleAnalytics();
// }
//
// if (cookieConsent.canUseMarketing()) {
//   // Load marketing pixels
//   loadFacebookPixel();
// }
//
// // Get detailed consent info
// const details = cookieConsent.getDetails();
// console.log(details); // { consent: 'accepted', analytics: true, marketing: true }
//
// // For testing - clear consent
// cookieConsent.clearConsent();
//

export const cookieConsent = {
  // Check if user has given consent
  hasConsent: () => {
    return localStorage.getItem('cookie-consent') !== null;
  },

  // Get consent status
  getConsent: () => {
    return localStorage.getItem('cookie-consent');
  },

  // Check if analytics cookies are allowed
  canUseAnalytics: () => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') return true;
    if (consent === 'custom') {
      return localStorage.getItem('cookie-analytics') === 'true';
    }
    return false;
  },

  // Check if marketing cookies are allowed
  canUseMarketing: () => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') return true;
    if (consent === 'custom') {
      return localStorage.getItem('cookie-marketing') === 'true';
    }
    return false;
  },

  // Accept all cookies
  acceptAll: () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-analytics', 'true');
    localStorage.setItem('cookie-marketing', 'true');
  },

  // Reject all cookies
  rejectAll: () => {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-analytics', 'false');
    localStorage.setItem('cookie-marketing', 'false');
  },

  // Set custom preferences
  setCustom: (analytics, marketing) => {
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-analytics', analytics ? 'true' : 'false');
    localStorage.setItem('cookie-marketing', marketing ? 'true' : 'false');
  },

  // Clear all consent data (for testing or reset)
  clearConsent: () => {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-analytics');
    localStorage.removeItem('cookie-marketing');
  },

  // Get detailed consent information
  getDetails: () => {
    return {
      consent: localStorage.getItem('cookie-consent'),
      analytics: localStorage.getItem('cookie-analytics') === 'true',
      marketing: localStorage.getItem('cookie-marketing') === 'true',
    };
  },
};