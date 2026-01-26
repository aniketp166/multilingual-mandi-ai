# 🧪 AI Features Testing Guide - Multilingual Mandi

Complete step-by-step guide to test all AI-powered features in the application.

## 📋 Prerequisites

1. **Dev server running**: `npm run dev` in `frontend` folder
2. **Gemini API Key**: Set in `frontend/.env` as `GEMINI_API_KEY=your_key_here`
3. **Browser**: Open http://localhost:3000
4. **Two browser windows/tabs**: One for vendor, one for buyer (or use incognito)

---

## 🎯 Test Scenarios

### **Test 1: AI Price Discovery** 💰

**What it tests**: Gemini API generates smart pricing recommendations

**Steps:**
1. Go to **Vendor Dashboard** (`/dashboard`)
2. Click **"Add Product"** button
3. Fill in:
   - Product: `Tomato`
   - Quantity: `50` kg
   - Price: `30` ₹/kg
   - Language: `English`
4. Click **"Add Product"**
5. On the product card, click **"💡 Get Price Suggestion"**
6. **Wait 2-3 seconds** for AI response

**Expected Result:**
- Modal opens with:
  - ✅ Min Price (e.g., ₹24)
  - ✅ Max Price (e.g., ₹36)
  - ✅ Recommended Price (e.g., ₹31.50)
  - ✅ AI Reasoning (2-3 sentences about market conditions)
  - ✅ Market Trend (rising/falling/stable)
- Click "Accept Price" to update product price

**What to check:**
- ✅ Prices are reasonable (not random)
- ✅ Reasoning mentions the product name
- ✅ No errors in browser console

---

### **Test 2: Multilingual Translation** 🗣️

**What it tests**: Gemini translates messages between languages

**Setup:**
1. **Vendor Window**: Dashboard → Set language to **Hindi** (हिंदी)
2. **Buyer Window**: Browse Products (`/buyer`) → Set language to **English**

**Steps:**
1. **Vendor**: Add a product (if not already added)
   - Product: `आलू` (Potato in Hindi)
   - Quantity: `100` kg
   - Price: `25` ₹/kg
   - Language: `Hindi`

2. **Buyer Window**: 
   - Go to `/buyer`
   - Select language: **English**
   - Find the product
   - Click **"💬 Contact Vendor"**

3. **Buyer sends message** (in English):
   ```
   Can you give me a discount for 50kg?
   ```

4. **Vendor Window**:
   - Click the **"Active Chats"** card in dashboard
   - See the message **translated to Hindi**
   - Check the "Show original" button works

**Expected Result:**
- ✅ Buyer's English message appears in Hindi for vendor
- ✅ Toggle shows original English text
- ✅ Translation is accurate (not gibberish)

**What to check:**
- ✅ No "[MOCK]" or "[FALLBACK]" in translation
- ✅ Both original and translated text are stored
- ✅ Language indicator shows correct languages

---

### **Test 3: AI Negotiation Assistant** 🤝

**What it tests**: Gemini generates smart reply suggestions for vendors

**Continuing from Test 2:**

**Steps:**
1. **Vendor Window** (chat is open with buyer's message)
2. **Wait 2-3 seconds** - AI suggestions should appear automatically
3. Look for **"💡 AI Suggestions:"** section below the chat

**Expected Result:**
- ✅ 3 reply suggestions appear in Hindi (vendor's language)
- ✅ Suggestions are contextual (mention discount, quantity, price)
- ✅ Suggestions are professional and culturally appropriate

**Example suggestions:**
```
1. "धन्यवाद! 50kg के लिए मैं आपको अच्छी कीमत दे सकता हूं।"
2. "चलिए बीच में मिलते हैं। ₹23 प्रति किलो कैसा रहेगा?"
3. "यह उचित मूल्य है, लेकिन मैं आपके लिए कुछ कर सकता हूं।"
```

**Steps to test:**
4. Click on **suggestion #2**
5. Text appears in message input box
6. Edit if needed, then click **Send**
7. **Buyer Window**: See the message **translated to English**

**What to check:**
- ✅ Suggestions are in vendor's language (Hindi)
- ✅ Suggestions are relevant to the conversation
- ✅ Clicking suggestion fills the input box
- ✅ Sent message is translated to buyer's language

---

### **Test 4: Full Conversation Flow** 💬

**What it tests**: Complete multilingual negotiation with AI assistance

**Steps:**

1. **Buyer** (English) sends:
   ```
   What's your best price for 100kg?
   ```

2. **Vendor** (Hindi) sees translated message and AI suggestions
3. **Vendor** clicks suggestion or types:
   ```
   100kg के लिए मैं ₹23 प्रति किलो दे सकता हूं
   ```

4. **Buyer** sees English translation:
   ```
   For 100kg I can give ₹23 per kg
   ```

5. **Buyer** replies:
   ```
   Deal! When can I pick it up?
   ```

6. **Vendor** sees Hindi translation and gets new AI suggestions

**Expected Result:**
- ✅ All messages are translated correctly
- ✅ AI suggestions update based on conversation context
- ✅ Message history is preserved
- ✅ Timestamps are shown
- ✅ "Show original" toggle works for all messages

---

### **Test 5: Language Combinations** 🌐

**What it tests**: Translation works between any language pair

**Test these combinations:**

| Vendor Language | Buyer Language | Test Message |
|----------------|----------------|--------------|
| Hindi | Tamil | "இந்த விலை மிக அதிகம்" (This price is too high) |
| English | Telugu | "ధర తగ్గించగలరా?" (Can you reduce the price?) |
| Marathi | Bengali | "আমি ৫০ কেজি চাই" (I want 50kg) |
| Gujarati | Kannada | "ಬೆಲೆ ಎಷ್ಟು?" (What's the price?) |

**Expected Result:**
- ✅ All language pairs translate correctly
- ✅ No errors or "[FALLBACK]" messages
- ✅ Native scripts display properly

---

### **Test 6: Error Handling** ⚠️

**What it tests**: Graceful fallback when API fails

**Steps:**
1. Stop the dev server
2. Try to send a message
3. **OR** Set invalid API key in `.env`
4. Restart server and try features

**Expected Result:**
- ✅ Shows "[MOCK]" or "[FALLBACK]" prefix
- ✅ App doesn't crash
- ✅ User-friendly error message
- ✅ Fallback responses are provided

---

## 🔍 What to Look For

### **In Browser Console:**
```
✅ No red errors
✅ API calls show 200 status
✅ Logs show: "Using gemini-2.0-flash-exp" or fallback model
```

### **In Network Tab:**
```
✅ POST /api/ai/translate → 200 OK
✅ POST /api/ai/price-suggestion → 200 OK
✅ POST /api/ai/negotiation → 200 OK
✅ Response times: 1-3 seconds
```

### **In UI:**
```
✅ No loading spinners stuck forever
✅ Translations appear within 3 seconds
✅ AI suggestions appear automatically
✅ No "[MOCK]" or "[FALLBACK]" in production
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Using mock translation"**
**Cause**: API key not set or invalid
**Fix**: 
```bash
# Check .env file
cat frontend/.env

# Should show:
GEMINI_API_KEY=AIza...your_key_here

# Restart server
npm run dev
```

### **Issue 2: "404 Not Found" from Gemini**
**Cause**: Wrong model name or API endpoint
**Fix**: Already fixed in code - uses gemini-2.0-flash-exp with fallback

### **Issue 3: Chat modal not visible**
**Cause**: Z-index issue
**Fix**: Already fixed - modal has `z-[9999]`

### **Issue 4: Translations are gibberish**
**Cause**: Wrong language codes
**Fix**: Check language selector uses correct codes (en, hi, ta, te, bn, mr, gu, kn)

### **Issue 5: AI suggestions not appearing**
**Cause**: Vendor role not detected or API error
**Fix**: 
- Check userRole prop is "vendor"
- Check console for API errors
- Verify conversation_history is being sent

---

## 📊 Performance Benchmarks

**Expected Response Times:**
- Translation: 1-2 seconds
- Price Suggestion: 2-3 seconds
- Negotiation Suggestions: 2-4 seconds

**If slower:**
- Check internet connection
- Check Gemini API status
- Try fallback model (gemini-1.5-flash)

---

## ✅ Final Checklist

Before submitting/deploying:

- [ ] All 3 AI features work without errors
- [ ] Translations are accurate (not mock/fallback)
- [ ] Price suggestions are reasonable
- [ ] Negotiation suggestions are contextual
- [ ] Chat modal is fully visible
- [ ] Language selector saves preference
- [ ] Multiple language pairs tested
- [ ] Error handling works gracefully
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

---

## 🎥 Quick Test Video Script

**30-second demo:**
1. Open vendor dashboard → Add product
2. Click "Get Price Suggestion" → Show AI pricing
3. Open buyer page → Start chat
4. Send message in English
5. Switch to vendor → Show Hindi translation
6. Show AI suggestions → Click one
7. Send reply → Show English translation to buyer
8. Done! ✅

---

## 🚀 Ready to Test!

Start with **Test 1** and work through all scenarios. The AI features should work seamlessly with proper Gemini API integration.

**Need help?** Check browser console for detailed error messages.

**Happy Testing! 🎉**
