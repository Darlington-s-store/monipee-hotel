import { useEffect } from 'react';

// To use Tawk.to:
// 1. Sign up at https://www.tawk.to
// 2. Create a property for your hotel
// 3. Get your Property ID and Widget ID from the widget code
// 4. Replace the values below

const TAWK_PROPERTY_ID = 'YOUR_PROPERTY_ID'; // Replace with your Tawk.to property ID
const TAWK_WIDGET_ID = 'YOUR_WIDGET_ID'; // Replace with your Tawk.to widget ID

declare global {
  interface Window {
    Tawk_API?: {
      toggle?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export function TawkToChat() {
  useEffect(() => {
    // Don't load if not configured
    if (TAWK_PROPERTY_ID === 'YOUR_PROPERTY_ID') {
      console.log('Tawk.to not configured. Please add your Property ID and Widget ID.');
      return;
    }

    // Check if script already exists
    if (document.getElementById('tawk-script')) {
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

export default TawkToChat;
