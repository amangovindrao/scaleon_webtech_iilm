/**
 * ╔══════════════════════════════════════════════╗
 * ║          CHATBOT QUESTIONS & ANSWERS          ║
 * ╠══════════════════════════════════════════════╣
 * ║  Edit this file to update chatbot responses.  ║
 * ╚══════════════════════════════════════════════╝
 */

export interface ChatbotQA {
  keywords: string[];
  question: string;
  answer: string;
}

export const chatbotQuestions: ChatbotQA[] = [
  {
    keywords: ["what", "do", "scaleon", "services", "offer", "help", "about"],
    question: "What does ScaleOn do?",
    answer: "ScaleOn is a growth-focused digital marketing agency. We help creators and brands grow on social media through content strategy, video editing, performance marketing, and growth systems that actually work."
  },
  {
    keywords: ["price", "cost", "pricing", "money", "charge", "fee", "budget", "plan", "package"],
    question: "What's your pricing?",
    answer: "We don't follow fixed pricing. Every brand has different goals, so we create custom plans based on your needs, content requirements, and growth stage. Reach out and we'll share a plan tailored for you."
  },
  {
    keywords: ["result", "results", "time", "long", "how", "when", "growth", "guarantee"],
    question: "Do you guarantee results?",
    answer: "Yes — we focus on performance-driven strategies. If we fail to deliver the promised results within the agreed timeline, we offer a 70% refund. Most clients start seeing improvement in reach and engagement within a few weeks."
  },
  {
    keywords: ["content", "create", "edit", "video", "reel", "reels", "design", "creative"],
    question: "Do you create content?",
    answer: "Yes! We offer complete content creation — from video editing, reels, and design to creative direction. You can stay completely hands-off while we handle everything."
  },
  {
    keywords: ["manage", "social", "media", "instagram", "youtube", "handle", "posting"],
    question: "What do you manage?",
    answer: "We handle everything — content strategy, video editing, design, posting, optimization, and growth tracking. We don't just manage accounts — we build growth systems."
  },
  {
    keywords: ["contact", "email", "phone", "talk", "speak", "whatsapp", "reach", "connect"],
    question: "How can I contact you?",
    answer: "You can fill the contact form on our website, message us on WhatsApp at +91 9026240970, or DM us on Instagram @thescaleon. We usually respond within a few hours!"
  },
  {
    keywords: ["who", "for", "work", "clients", "creator", "brand", "business", "small"],
    question: "Who do you work with?",
    answer: "We work with creators, small businesses, and growing brands who want real social media growth and better conversions. If you're serious about growth, we're the right fit."
  },
  {
    keywords: ["data", "safe", "security", "privacy", "secure", "account"],
    question: "Is my data safe?",
    answer: "Yes, 100%. Your accounts, data, and business information are handled with complete confidentiality. We take data security very seriously."
  }
];

export const fallbackResponse = "I'm not able to answer that properly right now. Would you like to connect directly with our team?";

export const contactOptions = [
  {
    label: "Chat on WhatsApp",
    url: "https://wa.me/919026240970?text=Hi%20ScaleOn,%20I%20have%20a%20question.",
    icon: "whatsapp",
    color: "bg-[#25D366]"
  },
  {
    label: "Message on Instagram",
    url: "https://instagram.com/thescaleon",
    icon: "instagram",
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    label: "Send Email",
    url: "mailto:info@thescaleon.com",
    icon: "email",
    color: "bg-blue-500"
  }
];
