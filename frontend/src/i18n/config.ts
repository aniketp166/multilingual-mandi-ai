import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      navbar: {
        home: 'Home',
        about: 'About',
        marketAccess: 'Market Access',
        vendorMode: 'Vendor Mode',
        buyerMode: 'Buyer Mode',
        manageInventory: 'Manage Inventory',
        browseNegotiate: 'Browse & Negotiate',
        selectRole: 'Select Your Role',
        brand: 'Mandi',
        multilingual: 'Multilingual',
        subtitle: 'MULILINGUAL MANDI'
      },
      home: {
        badge: 'In Viksit Bharat • 26 Jan Challenge',
        title: 'MANDI',
        subtitle: 'Breaking Language Barriers in Local Trade',
        desc: 'Empowering India\'s vendors and buyers with AI-powered multilingual chat, smart pricing, and real-time negotiations across 8+ Indian languages.',
        startSelling: 'Start Selling',
        browseMandi: 'Browse Mandi',
        aiEcosystem: 'AI-First Ecosystem',
        aiDesc: 'Revolutionizing traditional trade with cutting-edge intelligence',
        realTimeTranslation: 'Real-Time Translation',
        realTimeTranslationDesc: 'Automatic bridge between consumer & vendor dialects.',
        smartPricing: 'Smart Pricing',
        smartPricingDesc: 'Real-time market data to ensure fair trade for all.',
        aiNegotiation: 'AI Negotiation',
        aiNegotiationDesc: 'Context-aware suggestions for closing every deal.',
        vernacularChat: 'Vernacular Chat',
        vernacularChatDesc: 'Built for 8+ major Indian languages natively.',
        whyTransact: 'Why Transact at',
        zeroCommission: 'Zero Commission Trade',
        zeroCommissionDesc: 'Direct peer-to-peer connection without any hidden fees.',
        verifiedLocal: 'Verified Local Quality',
        verifiedLocalDesc: 'Source directly from verified farmers and distributors.',
        aiEfficiency: 'AI-Led Efficiency',
        aiEfficiencyDesc: 'Save hours of negotiation with smart reply systems.',
        viksitMandi: 'Viksit Mandi',
        viksitMandiDesc: 'Pioneering digital equality for India\'s local traders.',
        readyToEvolve: 'Ready to Evolve Your Business?',
        joinOthers: 'Join thousands of local traders breaking language barriers with India\'s first AI-powered marketplace.',
        launchApp: 'Launch Vendor App',
        browseMarketplace: 'Browse Marketplace',
        joinVendors: 'JOIN +10,000 VENDORS ACROSS INDIA'
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success'
      }
    }
  },
  hi: {
    translation: {
      navbar: {
        home: 'होम',
        about: 'हमारे बारे में',
        marketAccess: 'बाज़ार प्रवेश',
        vendorMode: 'विक्रेता मोड',
        buyerMode: 'खरीदार मोड',
        manageInventory: 'इन्वेंटरी प्रबंधित करें',
        browseNegotiate: 'ब्राउज़ और मोलभाव करें',
        selectRole: 'अपनी भूमिका चुनें',
        brand: 'मंडी',
        multilingual: 'बहुभाषी',
        subtitle: 'मल्टीलिंगुअल मंडी'
      },
      home: {
        badge: 'विकसित भारत • २६ जनवरी चुनौती',
        title: 'मंडी',
        subtitle: 'स्थानीय व्यापार में भाषा बाधाओं को तोड़ना',
        desc: 'भारत के विक्रेताओं और खरीदारों को एआई-संचालित बहुभाषी चैट, स्मार्ट मूल्य निर्धारण और 8+ भारतीय भाषाओं में वास्तविक समय वार्ता के साथ सशक्त बनाना।',
        startSelling: 'बेचना शुरू करें',
        browseMandi: 'मंडी में घूमें',
        aiEcosystem: 'एआई-प्रथम पारिस्थितिकी तंत्र',
        aiDesc: 'अत्याधुनिक बुद्धिमत्ता के साथ पारंपरिक व्यापार में क्रांति लाना',
        realTimeTranslation: 'वास्तविक समय अनुवाद',
        realTimeTranslationDesc: 'उपभोक्ता और विक्रेता बोलियों के बीच स्वचालित पुल।',
        smartPricing: 'स्मार्ट मूल्य निर्धारण',
        smartPricingDesc: 'सभी के लिए निष्पक्ष व्यापार सुनिश्चित करने के लिए बाजार डेटा।',
        aiNegotiation: 'एआई वार्ता',
        aiNegotiationDesc: 'हर सौदा पक्का करने के लिए संदर्भ-जागरूक सुझाव।',
        vernacularChat: 'वर्नाक्यूलर चैट',
        vernacularChatDesc: '8+ प्रमुख भारतीय भाषाओं के लिए मूल रूप से बनाया गया।',
        whyTransact: 'लेन-देन क्यों करें',
        zeroCommission: 'शून्य कमीशन व्यापार',
        zeroCommissionDesc: 'बिना किसी छिपी फीस के सीधे पीयर-टू-पीयर कनेक्शन।',
        verifiedLocal: 'सत्यापित स्थानीय गुणवत्ता',
        verifiedLocalDesc: 'सीधे सत्यापित किसानों और वितरकों से स्रोत।',
        aiEfficiency: 'एआई-नेतृत्व दक्षता',
        aiEfficiencyDesc: 'स्मार्ट रिप्लाई सिस्टम के साथ घंटों की बातचीत बचाएं।',
        viksitMandi: 'विकसित मंडी',
        viksitMandiDesc: 'भारत के स्थानीय व्यापारियों के लिए डिजिटल समानता की अग्रणी।',
        readyToEvolve: 'क्या आप अपने व्यवसाय को विकसित करने के लिए तैयार हैं?',
        joinOthers: 'भारत के पहले एआई-संचालित बाज़ार के साथ भाषा अवरोधों को तोड़ने वाले हज़ारों स्थानीय व्यापारियों से जुड़ें।',
        launchApp: 'विक्रेता ऐप लॉन्च करें',
        browseMarketplace: 'बाज़ार ब्राउज़ करें',
        joinVendors: 'भारत भर में +१०,००० विक्रेताओं से जुड़ें'
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'कोई त्रुटि हुई',
        success: 'सफल'
      }
    }
  },
  mr: {
    translation: {
      navbar: {
        home: 'होम',
        about: 'आमच्याबद्दल',
        marketAccess: 'बाजार प्रवेश',
        vendorMode: 'विक्रेता मोड',
        buyerMode: 'खरेदीदार मोड',
        manageInventory: 'इन्व्हेंटरी व्यवस्थापित करा',
        browseNegotiate: 'ब्राउझ आणि वाटाघाटी करा',
        selectRole: 'तुमची भूमिका निवडा',
        brand: 'मंडी',
        multilingual: 'बहुभाषी',
        subtitle: 'मल्टीलिंगुअल मंडी'
      },
      home: {
        badge: 'विकसित भारत • २६ जानेवारी आव्हान',
        title: 'मंडी',
        subtitle: 'स्थानिक व्यापारातील भाषेचे अडथळे तोडणे',
        desc: 'भारतातील विक्रेते आणि खरेदीदारांना एआय-व्युत्पन्न बहुभाषिक चॅट, स्मार्ट किंमत आणि ८+ भारतीय भाषांमध्ये रिअल-टाइम वाटाघाटीसह सक्षम करणे.',
        startSelling: 'विक्री सुरू करा',
        browseMandi: 'मंडी एक्सप्लोर करा',
        aiEcosystem: 'एआय-फर्स्ट इकोसिस्टम',
        aiDesc: 'प्रगत बुद्धिमत्तेसह पारंपरिक व्यापारात क्रांती घडवून आणणे',
        realTimeTranslation: 'रिअल-टाइम भाषांतर',
        realTimeTranslationDesc: 'ग्राहक आणि विक्रेता बोलीभाषांमधील स्वयंचलित पूल.',
        smartPricing: 'स्मार्ट किंमत',
        smartPricingDesc: 'सर्वांसाठी वाजवी व्यापार सुनिश्चित करण्यासाठी रिअल-टाइम बाजार डेटा.',
        aiNegotiation: 'एआय वाटाघाटी',
        aiNegotiationDesc: 'प्रत्येक व्यवहार पूर्ण करण्यासाठी संदर्भ-जागरूक सूचना.',
        vernacularChat: 'स्थानिक चॅट',
        vernacularChatDesc: '८+ प्रमुख भारतीय भाषांसाठी मूळतः तयार केलेले.',
        whyTransact: 'व्यवहार का करावा',
        zeroCommission: 'शून्य कमिशन व्यापार',
        zeroCommissionDesc: 'कोणत्याही छुपे शुल्काशिवाय थेट पीअर-टू-पीअर कनेक्शन.',
        verifiedLocal: 'सत्यापित स्थानिक गुणवत्ता',
        verifiedLocalDesc: 'थेट सत्यापित शेतकरी आणि वितरकांकडून स्रोत.',
        aiEfficiency: 'एआय-नेतृत्व कार्यक्षमता',
        aiEfficiencyDesc: 'स्मार्ट रिप्लाय सिस्टमसह वाटाघाटीचे तास वाचवा.',
        viksitMandi: 'विकसित मंडी',
        viksitMandiDesc: 'भारतातील स्थानिक व्यापाऱ्यांसाठी डिजिटल समानतेचे प्रणेते.',
        readyToEvolve: 'तुम्ही तुमचा व्यवसाय विकसित करण्यास तयार आहात का?',
        joinOthers: 'भारतातील पहिल्या एआय-सक्षम बाजारपेठेसह भाषेचे अडथळे तोडणाऱ्या हजारो स्थानिक व्यापाऱ्यांमध्ये सामील व्हा.',
        launchApp: 'विक्रेता ॲप लाँच करा',
        browseMarketplace: 'मार्केटप्लेस ब्राउझ करा',
        joinVendors: 'भारतभर +१०,००० विक्रेत्यांमध्ये सामील व्हा'
      },
      common: {
        loading: 'लोड होत आहे...',
        error: 'त्रुटी आली',
        success: 'यशस्वी'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
