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
  // Helper function to check if user is executive-level
  const isExecutiveUser = (designation: string): boolean => {
    const executiveDesignations = [
      "Founder & CEO",
      "CEO",
      "Founder",
      "Executive",
      "VP",
      "Vice President",
      "CTO",
      "Chief Technology Officer",
      "COO",
      "Chief Operating Officer",
      "CFO",
      "Chief Financial Officer"
    ];
    return executiveDesignations.some(execRole =>
      designation.toLowerCase().includes(execRole.toLowerCase())
    );
  };

  // Helper function to generate insight titles from AI responses
  const generateInsightTitle = (response: string): string => {
    const titlePatterns = [
      "Strategic Recommendation",
      "Business Analysis",
      "Action Plan",
      "Key Insight",
      "Growth Opportunity",
      "Risk Assessment",
      "Performance Review",
      "Market Analysis"
    ];

    // Try to extract a meaningful title from the response
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim();
      if (firstSentence.length < 60) {
        return firstSentence;
      }
    }

    return titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
  };

  // Helper function to determine impact level from response
  const determineImpact = (response: string): "low" | "medium" | "high" | "critical" => {
    const criticalKeywords = ["urgent", "critical", "immediate", "crisis", "emergency", "severe", "dangerous"];
    const highKeywords = ["important", "significant", "major", "substantial", "priority", "attention needed"];
    const mediumKeywords = ["consider", "review", "monitor", "attention", "moderate"];

    const lowerResponse = response.toLowerCase();

    if (criticalKeywords.some(keyword => lowerResponse.includes(keyword))) {
      return "critical";
    }
    if (highKeywords.some(keyword => lowerResponse.includes(keyword))) {
      return "high";
    }
    if (mediumKeywords.some(keyword => lowerResponse.includes(keyword))) {
      return "medium";
    }

    return Math.random() > 0.5 ? "medium" : "low";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Good morning team! I've completed a comprehensive analysis of our current business metrics and identified several critical areas that require immediate attention. Let me provide you with a strategic overview and actionable recommendations.",
      sender: "Native IQ Assistant",
      role: "assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 20)
    },
    {
      id: "2",
      content: "Our churn rate jumped to 12% this month. What're we doing about customer retention?",
      sender: "Alex Martinez",
      role: "user",
      designation: "Founder & CEO",
      department: "Leadership",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      avatar: "👨‍💼"
    },
    {
      id: "3",
      content: "Maybe we should survey the customers who left to understand why. Also noticed our trial-to-paid conversion dropped from 25% to 18%.",
      sender: "Taylor Brooks",
      role: "user",
      designation: "Customer Success",
      department: "Support",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      avatar: "👩‍💻"
    },
    {
      id: "4",
      content: "Just got off a call with a potential enterprise client - they're interested but want custom pricing. They represent $50K+ ARR if we land them. What's our enterprise pricing strategy?",
      sender: "Jordan Lee",
      role: "user",
      designation: "Sales Manager",
      department: "Sales",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      avatar: "👨‍🚀"
    },
    {
      id: "5",
      content: "Our cash flow is getting tight - we have 2.5 months runway left. Can we delay some vendor payments or cut back on marketing spend?",
      sender: "Jamie Wilson",
      role: "user",
      designation: "Operations Lead",
      department: "Operations",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      avatar: "👩‍💼"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(propCurrentUser || USER_PROFILES[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update local user state when prop changes
  useEffect(() => {
    if (propCurrentUser) {
      setCurrentUser(propCurrentUser);
    }
  }, [propCurrentUser]);

  // Handle scroll detection for fade effect
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      setIsScrolled(scrollTop > 10);
    };

    const messagesContainer = document.querySelector('.chat-interface__messages');
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send initial AI response after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 0 && messages[messages.length - 1].role === "user") {
        handleAIResponse(messages);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  const generateContextData = () => {
    return {
      monthlyRevenue: "$45K MRR",
      customerChurn: "12% monthly churn (up from 8%)",
      supportTickets: "23 open tickets",
      cashFlow: "2.5 months runway",
      monthlyBurn: "$12.8K monthly costs",
      trialConversion: "18% trial-to-paid (down from 25%)",
      growthRate: "8% MoM (down from 15%)",
      topRisks: ["Customer churn spike", "Cash flow runway dropping", "Trial conversion declining", "Team capacity issues"],
      recentInsights: [
        { title: "Churn analysis shows onboarding complexity as main issue" },
        { title: "Enterprise opportunity worth $50K+ ARR identified" },
        { title: "Team velocity dropped 30% due to workload" },
        { title: "Competitive pricing pressure increasing" }
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

      // Generate dashboard insight only for executive-level users
      if (onInsightGenerated && isExecutiveUser(currentUser.designation)) {
        console.log('🎯 Generating insight for executive user:', currentUser.designation);
        const insightTitle = generateInsightTitle(data.response);
        const insightSummary = data.response.length > 150
          ? data.response.slice(0, 150) + "..."
          : data.response;

        const insight = {
          title: insightTitle,
          summary: insightSummary,
          confidence: 0.85 + Math.random() * 0.1, // 0.85-0.95 confidence
          source: "AI Assistant Analysis",
          impact: determineImpact(data.response),
          userRole: currentUser.designation
        };

        console.log('📊 Generated insight:', insight);
        onInsightGenerated(insight);
      } else {
        console.log('❌ Not generating insight - User designation:', currentUser.designation, 'Is Executive:', isExecutiveUser(currentUser.designation));
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

      // Generate dashboard insight for simulated AI responses if from executive user
      if (onInsightGenerated && currentMessages.length > 0) {
        const lastUserMessage = currentMessages[currentMessages.length - 1];
        if (lastUserMessage.designation && isExecutiveUser(lastUserMessage.designation)) {
          const insightTitle = generateInsightTitle(data.response);
          const insightSummary = data.response.length > 150
            ? data.response.slice(0, 150) + "..."
            : data.response;

          onInsightGenerated({
            title: insightTitle,
            summary: insightSummary,
            confidence: 0.85 + Math.random() * 0.1,
            source: "AI Assistant Analysis",
            impact: determineImpact(data.response),
            userRole: lastUserMessage.designation
          });
        }
      }
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Simulate realistic team conversations with context
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // More frequent conversations
        const randomUser = USER_PROFILES[Math.floor(Math.random() * USER_PROFILES.length)];

        // Context-aware business scenarios
        const businessScenarios = [
          {
            messages: [
              "Our churn rate jumped to 12% this month. What're we doing about customer retention?",
              "Maybe we should survey the customers who left to understand why.",
              "Also noticed our trial-to-paid conversion dropped from 25% to 18%."
            ],
            trigger: "churn"
          },
          {
            messages: [
              "The new feature rollout went well - user engagement is up 40%!",
              "But we're seeing some performance issues with the new dashboard.",
              "Should we roll back or can dev team optimize it quickly?"
            ],
            trigger: "feature"
          },
          {
            messages: [
              "Just got off a call with a potential enterprise client - they're interested but want custom pricing.",
              "They represent $50K+ ARR if we land them. What's our enterprise pricing strategy?",
              "We should create a pricing tier for companies with 100+ employees."
            ],
            trigger: "enterprise"
          },
          {
            messages: [
              "Our cash flow is getting tight - we have 2.5 months runway left.",
              "Can we delay some vendor payments or cut back on marketing spend?",
              "Maybe we should look into invoice financing options."
            ],
            trigger: "cashflow"
          },
          {
            messages: [
              "Competitor just launched a similar product at half our price point.",
              "They're targeting the same SMB market segment.",
              "We need to differentiate our value proposition - what makes us unique?"
            ],
            trigger: "competition"
          },
          {
            messages: [
              "The team is feeling overwhelmed with the current workload.",
              "Maybe we should hire a junior developer or outsource some tasks.",
              "Our velocity has dropped 30% in the last sprint due to burnout."
            ],
            trigger: "team"
          },
          {
            messages: [
              "Just finished the customer interviews - main pain points are setup complexity.",
              "Users want a simpler onboarding flow and better documentation.",
              "We should prioritize UX improvements in the next sprint."
            ],
            trigger: "ux"
          },
          {
            messages: [
              "Our MRR growth slowed to 8% this month from 15% last month.",
              "The market might be getting saturated - should we expand to new segments?",
              "Maybe we need to improve our referral program or partner channels."
            ],
            trigger: "growth"
          }
        ];

        const scenario = businessScenarios[Math.floor(Math.random() * businessScenarios.length)];

        // Start a conversation thread
        const startConversation = () => {
          const messages = scenario.messages;
          let messageIndex = 0;

          const sendNextMessage = () => {
            if (messageIndex < messages.length) {
              // Use different users for different messages in the thread
              const messageUser = messageIndex === 0 ?
                randomUser :
                USER_PROFILES[Math.floor(Math.random() * USER_PROFILES.length)];

              simulateUserMessage(messageUser, messages[messageIndex]);

              messageIndex++;
              // Schedule next message in thread with shorter delay
              setTimeout(sendNextMessage, 3000 + Math.random() * 4000);
            }
          };

          sendNextMessage();
        };

        startConversation();
      }
    }, 20000 + Math.random() * 40000); // More frequent: 20-60 seconds

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

  // Format assistant responses for better readability while preserving insights
  const formatAssistantResponse = (text: string): string => {
    if (!text) return "I recommend focusing on these key priorities:\n\n1. Assess the current situation\n2. Develop an action plan\n3. Implement and measure results";

    // Normalize whitespace and remove system-style prefixes
    let cleaned = text
      .replace(/\s+/g, ' ')
      .replace(/^\[.*?\]:\s*/g, '')
      .trim();

    // Remove common greetings but preserve business context
    cleaned = cleaned.replace(/^(hi|hey|hello)[,!\s]+[a-zA-Z]+[,!\s]*?/i, '');

    // Allow longer responses for more comprehensive business insights
    // Only truncate if extremely long (over 800 characters)
    if (cleaned.length > 800) {
      // Try to truncate at a natural break point
      const truncated = cleaned.slice(0, 800);
      const lastSentence = truncated.lastIndexOf('.');
      if (lastSentence > 600) {
        return truncated.slice(0, lastSentence + 1).trim();
      }
      return truncated + '...';
    }

    return cleaned;
  };

  return (
    <div className={`chat-interface ${className || ""}`}>
      <GlassCard
        className="chat-interface__container"
      >
        {/* User Selector removed as requested */}

        <div className={`chat-interface__messages ${isScrolled ? 'scrolled' : ''}`}>
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
