"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [showNativeIQ, setShowNativeIQ] = useState(false);
  const [nativeIQText, setNativeIQText] = useState("");
  const [showTagline, setShowTagline] = useState(false);
  const [taglineText, setTaglineText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const fullNativeIQ = "Native IQ";
  const fullTagline = "Business Intelligence, Information, Instruments Reinforced by Al";

  useEffect(() => {
    // Start typing Native IQ immediately
    setShowNativeIQ(true);
  }, []);

  useEffect(() => {
    if (showNativeIQ && nativeIQText.length < fullNativeIQ.length) {
      const timeout = setTimeout(() => {
        setNativeIQText(fullNativeIQ.slice(0, nativeIQText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    } else if (nativeIQText === fullNativeIQ) {
      // Start typing tagline after Native IQ is complete
      const timeout = setTimeout(() => {
        setShowTagline(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [showNativeIQ, nativeIQText]);

  useEffect(() => {
    if (showTagline && taglineText.length < fullTagline.length) {
      const timeout = setTimeout(() => {
        setTaglineText(fullTagline.slice(0, taglineText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (taglineText === fullTagline) {
      // Fade out and navigate to auth after tagline is complete
      const timeout = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [showTagline, taglineText, router]);

  return (
    <div className={`landing-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="landing-content">
        <h1 className="native-iq-text">
          {nativeIQText}
          {showNativeIQ && nativeIQText.length < fullNativeIQ.length && (
            <span className="cursor">|</span>
          )}
        </h1>
        {showTagline && (
          <p className="tagline-text">
            {taglineText}
            {taglineText.length < fullTagline.length && (
              <span className="cursor">|</span>
            )}
          </p>
        )}
      </div>

      <style jsx>{`
        .landing-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #1a1a2e 100%);
          opacity: 1;
          transition: opacity 1s ease-out;
          overflow: hidden;
        }

        .landing-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .landing-container.fade-out {
          opacity: 0;
        }

        .landing-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .native-iq-text {
          font-size: 4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          font-family: system-ui, -apple-system, sans-serif;
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
        }

        .tagline-text {
          font-size: 1.5rem;
          color: rgba(96, 165, 250, 0.9);
          font-weight: 400;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .cursor {
          animation: blink 0.7s infinite;
          margin-left: 2px;
          color: #3b82f6;
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .native-iq-text {
            font-size: 2.5rem;
          }
          
          .tagline-text {
            font-size: 1rem;
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}

