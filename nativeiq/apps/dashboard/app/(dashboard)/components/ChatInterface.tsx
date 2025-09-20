"use client";

import { useState, useRef, useEffect } from "react";
import { GlassCard, Button, Badge } from "@nativeiq/ui";

// Component to format chat messages with better styling
function FormattedMessage({ content }: { content: string }) {
  // Handle markdown-style formatting
  const formatContent = (text: string) => {
    // Split by lines and process each one
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        elements.push(<br key={`br-${index}`} />);
        return;
      }
      
      // Handle bold text (**text**)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle bullet points (- text)
      if (line.trim().startsWith('- ')) {
        elements.push(
          <div key={index} className="message-bullet-point">
            • {line.trim().substring(2)}
          </div>
        );
      }
      // Handle numbered lists (1. text)
      else if (/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <div key={index} className="message-numbered-point">
            {line.trim()}
          </div>
        );
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={index} className="message-paragraph" 
             dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
    });
    
    return elements;
  };
  
  return <div className="formatted-message">{formatContent(content)}</div>;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  role: "user" | "assistant";
  designation?: string;
  department?: string;
  timestamp: Date;
  avatar?: string;
}

interface UserProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar?: string;
  color: string;
}

interface ChatInterfaceProps {
  className?: string;
  onInsightGenerated?: (insight: any) => void;
  onUserChange?: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

// Mock user profiles for SMB demonstration
const USER_PROFILES: UserProfile[] = [
  {
    id: "user1",
    name: "Alex Martinez",
    designation: "Founder & CEO",
    department: "Leadership",
    avatar: "👨‍💼",
    color: "#FF3EA5"
  },
  {
    id: "user2", 
    name: "Jamie Wilson",
    designation: "Operations Lead",
    department: "Operations",
    avatar: "👩‍💼",
    color: "#FF8A5B"
  },
  {
    id: "user3",
    name: "Taylor Brooks",
    designation: "Customer Success", 
    department: "Support",
    avatar: "👩‍💻",
    color: "#4ADEEF"
  },
  {
    id: "user4",
    name: "Jordan Lee",
    designation: "Sales Manager",
    department: "Sales", 
    avatar: "👨‍🚀",
    color: "#9333EA"
  }
];

export function ChatInterface({ className, onInsightGenerated, onUserChange, currentUser: propCurrentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to your team chat! I'm your Native IQ Assistant, here to help analyze conversations and provide insights to grow your business. Let's discuss what's on your mind!",
      sender: "Native IQ Assistant",
      role: "assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: "2", 
      content: "Morning everyone! Our biggest client TechStart is asking for a discount on their renewal. They're threatening to leave if we don't match a competitor's price. What should we do?",
      sender: "Alex Martinez",
      role: "user",
      designation: "Founder & CEO",
      department: "Leadership",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      avatar: "👨‍💼"
    },
    {
      id: "3",
      content: "That's 30% of our monthly revenue! Can we offer them added value instead? Maybe extended support or additional features?",
      sender: "Jamie Wilson", 
      role: "user",
      designation: "Operations Lead",
      department: "Operations",
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      avatar: "👩‍💼"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(propCurrentUser || USER_PROFILES[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update local user state when prop changes
  useEffect(() => {
    if (propCurrentUser) {
      setCurrentUser(propCurrentUser);
    }
  }, [propCurrentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContextData = () => {
    return {
      monthlyRevenue: "$45K MRR",
      customerChurn: "8% monthly churn", 
      supportTickets: "23 open tickets",
      cashFlow: "3.2 months runway",
      monthlyBurn: "$12.8K monthly costs",
      topRisks: ["TechStart renewal at risk ($13.5K)", "High support volume", "Over budget by $0.8K"],
      recentInsights: [
        { title: "Customer retention strategies needed" },
        { title: "Support efficiency improvements required" }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: currentUser.name,
      role: "user",
      designation: currentUser.designation,
      department: currentUser.department,
      avatar: currentUser.avatar,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call OpenAI API for intelligent response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          currentUser: currentUser,
          contextData: generateContextData()
        }),
      });

      if (!response.ok) throw new Error('API call failed');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formatAssistantResponse(data.response),
        sender: "Native IQ Assistant",
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate dashboard insight if callback provided
      if (onInsightGenerated && Math.random() > 0.6) {
        onInsightGenerated({
          title: "New insight from conversation",
          summary: data.response.slice(0, 100) + "...",
          confidence: 0.85,
          source: "Team Chat Analysis"
        });
      }
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm currently analyzing the conversation context. Let me review the latest business metrics and provide an update shortly.",
        sender: "Native IQ Assistant",
        role: "assistant", 
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const simulateUserMessage = (userProfile: UserProfile, content: string) => {
    const simulatedMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: userProfile.name,
      role: "user",
      designation: userProfile.designation,
      department: userProfile.department,
      avatar: userProfile.avatar,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, simulatedMessage]);
    
    // Trigger AI response after user simulation
    setTimeout(() => {
      handleAIResponse([...messages, simulatedMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleAIResponse = async (currentMessages: Message[]) => {
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages,
          currentUser: { name: "Native IQ Assistant", designation: "AI Assistant" },
          contextData: generateContextData()
        }),
      });

      if (!response.ok) throw new Error('API call failed');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        content: formatAssistantResponse(data.response),
        sender: "Native IQ Assistant",
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Simulate periodic team activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomUser = USER_PROFILES[Math.floor(Math.random() * USER_PROFILES.length)];
        const businessMessages = [
          "Just lost another trial customer - they said our onboarding was too confusing. We need to simplify this ASAP.",
          "Great news! LocalBiz just upgraded to our premium plan. That's +$400 MRR!",
          "Our support queue is getting backed up again - 23 open tickets. Maybe we should hire a part-time support person?", 
          "The new pricing page is working - conversion rate is up 12% this week!",
          "Should we offer a payment plan for smaller businesses? Getting lots of requests.",
          "TechStart is still pushing for that 40% discount. That's $13.5K at risk - 30% of our MRR.",
          "We're $800 over budget this month. Need to review our software subscriptions.",
          "The competitor analysis shows we're priced 35% higher. Is our value prop strong enough?"
        ];
        
        const randomMessage = businessMessages[Math.floor(Math.random() * businessMessages.length)];
        simulateUserMessage(randomUser, randomMessage);
      }
    }, 30000 + Math.random() * 60000); // Random interval between 30-90 seconds

    return () => clearInterval(interval);
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserColor = (sender: string) => {
    const user = USER_PROFILES.find(u => u.name === sender);
    return user?.color || '#6B7280';
  };

  // Make assistant messages concise and human-like. Keeps lists short and trims verbosity.
  const formatAssistantResponse = (text: string): string => {
    if (!text) return "Here's a quick plan: 1) Next step 2) Optional stretch.";

    // Normalize whitespace and remove system-style prefixes
    let cleaned = text
      .replace(/\s+/g, ' ')
      .replace(/^\[.*?\]:\s*/g, '')
      .trim();

    // Remove greetings like "Hi Alex," / "Hey team" at the start
    cleaned = cleaned.replace(/^(hi|hey|hello)[,!\s]+[a-zA-Z]+[,!\s]*?/i, '');

    // Keep the first complete sentence as a lead
    const leadMatch = cleaned.match(/^[^.!?]+[.!?]/);
    const lead = (leadMatch ? leadMatch[0] : cleaned).trim();

    // Extract up to 3 enumerated items or hyphen bullets
    const bulletMatches = Array.from(
      cleaned.matchAll(/(?:^|\s)(?:\d+\.|[-•])\s([^\n]+?)(?=(?:\s\d+\.|\s[-•]|$))/g)
    )
      .map(m => m[1].trim())
      .filter(Boolean)
      .slice(0, 3);

    const message = [lead, ...bulletMatches.map((b, i) => `${i + 1}. ${b.replace(/\s*[:;,.]$/,'')}`)]
      .join(' ')
      .trim();

    return message.length > 320 ? message.slice(0, 317) + '…' : message;
  };

  return (
    <div className={`chat-interface ${className || ""}`}>
      <GlassCard
        title="Team Chat - Native IQ"
        caption="Smart business insights for growing companies"
        className="chat-interface__container"
      >
        {/* User Selector */}
        <div className="chat-interface__user-selector">
          <span className="chat-interface__user-label">Chatting as:</span>
          <select 
            value={currentUser.id}
            onChange={(e) => {
              const user = USER_PROFILES.find(u => u.id === e.target.value);
              if (user) {
                setCurrentUser(user);
                onUserChange?.(user);
              }
            }}
            className="chat-interface__user-select"
          >
            {USER_PROFILES.map(user => (
              <option key={user.id} value={user.id}>
                {user.avatar} {user.name} ({user.designation})
              </option>
            ))}
          </select>
        </div>

        <div className="chat-interface__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role === "assistant" ? "chat-message--assistant" : "chat-message--user"}`}
            >
              {message.role !== "assistant" && (
                <div className="chat-message__avatar" style={{ backgroundColor: getUserColor(message.sender) }}>
                  {message.avatar || "👤"}
                </div>
              )}
              
              <div className="chat-message__content">
                {message.role !== "assistant" && (
                  <div className="chat-message__header">
                    <span className="chat-message__sender">{message.sender}</span>
                    {message.designation && (
                      <Badge className="chat-message__designation">
                        {message.designation}
                      </Badge>
                    )}
                    <span className="chat-message__timestamp">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                
                {message.role === "assistant" && (
                  <div className="chat-message__header">
                    <span className="chat-message__sender">🤖 Native IQ Assistant</span>
                    <span className="chat-message__timestamp">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className="chat-message__text">
                  <FormattedMessage content={message.content} />
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__content">
                <div className="chat-message__header">
                  <span className="chat-message__sender">🤖 Native IQ Assistant</span>
                  <span className="chat-message__typing-label">is analyzing...</span>
                </div>
                <div className="chat-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-interface__input">
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <span className="chat-input-user">
                {currentUser.avatar} {currentUser.name}:
              </span>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share business updates, ask questions, or discuss team matters..."
                className="chat-input"
                rows={1}
                disabled={isTyping}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="chat-send-button"
            >
              Send
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
