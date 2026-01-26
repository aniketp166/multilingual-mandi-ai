"""
AI Prompt Templates for Multilingual Mandi
Centralized prompt management with reusable functions
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class PromptContext:
    """Context data for prompt generation"""
    user_language: str = "en"
    target_language: str = "hi"
    product_name: str = ""
    price: float = 0.0
    quantity: int = 0
    location: str = "India"


class PromptTemplates:
    """Centralized AI prompt templates"""
    
    @staticmethod
    def build_translate_prompt(
        text: str, 
        source_language: str, 
        target_language: str,
        context: str = "marketplace communication"
    ) -> str:
        """
        Build translation prompt for AI
        
        Args:
            text: Text to translate
            source_language: Source language code
            target_language: Target language code
            context: Context for better translation
        """
        return f"""
You are a professional translator specializing in Indian marketplace communication.

Task: Translate the following text from {source_language} to {target_language}.

Context: {context}
Source Language: {source_language}
Target Language: {target_language}

Text to translate: "{text}"

Requirements:
1. Maintain the original meaning and tone
2. Use appropriate marketplace terminology
3. Keep cultural context relevant to Indian markets
4. If the text contains prices, keep currency symbols as-is
5. For greetings, use culturally appropriate equivalents

Provide only the translated text without explanations.
"""

    @staticmethod
    def build_price_discovery_prompt(
        product_name: str,
        current_price: float,
        quantity: int,
        location: str = "India"
    ) -> str:
        """
        Build price discovery prompt for AI
        
        Args:
            product_name: Name of the product
            current_price: Current asking price
            quantity: Quantity available
            location: Market location
        """
        return f"""
You are a market analyst specializing in Indian agricultural and local market pricing.

Task: Provide price analysis for the following product.

Product Details:
- Name: {product_name}
- Current Price: ₹{current_price} per kg
- Quantity: {quantity} kg
- Location: {location}

Please provide:
1. Market price range (minimum to maximum)
2. Recommended selling price
3. Brief reasoning (2-3 sentences)
4. Market trend (rising/falling/stable)

Format your response as JSON:
{{
    "min_price": <number>,
    "max_price": <number>,
    "recommended_price": <number>,
    "reasoning": "<brief explanation>",
    "market_trend": "<rising|falling|stable>",
    "confidence": <0.0-1.0>
}}

Base your analysis on typical Indian market conditions and seasonal factors.
"""

    @staticmethod
    def build_negotiate_prompt(
        product_name: str,
        vendor_price: float,
        buyer_message: str,
        conversation_history: List[str],
        vendor_language: str = "en"
    ) -> str:
        """
        Build negotiation assistance prompt for AI
        
        Args:
            product_name: Product being negotiated
            vendor_price: Vendor's asking price
            buyer_message: Latest buyer message
            conversation_history: Previous messages
            vendor_language: Vendor's preferred language
        """
        history_text = "\n".join([f"- {msg}" for msg in conversation_history[-3:]])
        
        return f"""
You are a negotiation assistant for Indian marketplace vendors.

Context:
- Product: {product_name}
- Vendor's Price: ₹{vendor_price} per kg
- Vendor Language: {vendor_language}

Conversation History:
{history_text}

Latest Buyer Message: "{buyer_message}"

Task: Generate 3 professional reply suggestions for the vendor.

Requirements:
1. Maintain respectful and friendly tone
2. Consider Indian marketplace customs
3. Provide options: firm, flexible, and compromise
4. Keep responses concise (1-2 sentences each)
5. Include cultural politeness markers
6. Respond in {vendor_language}

Format as JSON:
{{
    "suggestions": [
        "suggestion 1",
        "suggestion 2", 
        "suggestion 3"
    ],
    "tone": "<friendly|professional|firm>",
    "context": "<brief explanation>"
}}

Focus on maintaining good business relationships while protecting vendor interests.
"""

    @staticmethod
    def build_product_description_prompt(
        product_name: str,
        language: str = "en"
    ) -> str:
        """
        Build product description generation prompt
        
        Args:
            product_name: Name of the product
            language: Target language for description
        """
        return f"""
Generate a brief, appealing product description for a marketplace listing.

Product: {product_name}
Language: {language}
Context: Indian local marketplace

Requirements:
1. 2-3 sentences maximum
2. Highlight freshness and quality
3. Use marketplace-appropriate language
4. Include typical uses or benefits
5. Sound natural and appealing to local buyers

Provide only the description without additional formatting.
"""

    @staticmethod
    def get_fallback_responses() -> Dict[str, Any]:
        """
        Get fallback responses when AI services fail
        """
        return {
            "translation": {
                "success": False,
                "translated_text": None,
                "original_text": None,
                "error_flag": True,
                "message": "Translation service temporarily unavailable"
            },
            "price_discovery": {
                "tomato": {"min_price": 30, "max_price": 50, "recommended_price": 40},
                "onion": {"min_price": 25, "max_price": 45, "recommended_price": 35},
                "potato": {"min_price": 20, "max_price": 35, "recommended_price": 28},
                "banana": {"min_price": 40, "max_price": 80, "recommended_price": 60},
                "apple": {"min_price": 80, "max_price": 150, "recommended_price": 120},
                "default": {"min_price": 20, "max_price": 100, "recommended_price": 50}
            },
            "negotiation": {
                "suggestions": [
                    "Thank you for your interest. This is our best quality product at a fair price.",
                    "I can offer a small discount for bulk purchase. How much quantity do you need?",
                    "The price reflects the premium quality. Would you like to see the product first?"
                ],
                "tone": "professional",
                "context": "Generic polite responses"
            }
        }

    @staticmethod
    def validate_input(text: str, max_length: int = 1000) -> tuple[bool, str]:
        """
        Validate AI input to prevent abuse
        
        Args:
            text: Input text to validate
            max_length: Maximum allowed length
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not text or not text.strip():
            return False, "Input cannot be empty"
        
        if len(text) > max_length:
            return False, f"Input too long. Maximum {max_length} characters allowed"
        
        # Check for potentially harmful content
        harmful_patterns = [
            "ignore previous instructions",
            "system prompt",
            "jailbreak",
            "pretend you are",
        ]
        
        text_lower = text.lower()
        for pattern in harmful_patterns:
            if pattern in text_lower:
                return False, "Invalid input detected"
        
        return True, ""

    @staticmethod
    def sanitize_output(text: str) -> str:
        """
        Sanitize AI output for safety
        
        Args:
            text: AI generated text
            
        Returns:
            Sanitized text
        """
        if not text:
            return ""
        
        # Remove potential harmful content
        text = text.strip()
        
        # Remove any system-like responses
        if text.lower().startswith(("i am", "i'm an ai", "as an ai")):
            return "I can help you with that request."
        
        return text[:1000]  # Limit output length


# Convenience functions for common use cases
def get_translation_prompt(text: str, source_lang: str, target_lang: str) -> str:
    """Convenience function for translation prompts"""
    return PromptTemplates.build_translate_prompt(text, source_lang, target_lang)


def get_price_prompt(product: str, price: float, quantity: int) -> str:
    """Convenience function for price discovery prompts"""
    return PromptTemplates.build_price_discovery_prompt(product, price, quantity)


def get_negotiation_prompt(product: str, price: float, buyer_msg: str, history: List[str]) -> str:
    """Convenience function for negotiation prompts"""
    return PromptTemplates.build_negotiate_prompt(product, price, buyer_msg, history)


def get_fallback_price(product_name: str) -> Dict[str, Any]:
    """Get fallback price for a product"""
    fallbacks = PromptTemplates.get_fallback_responses()["price_discovery"]
    product_key = product_name.lower()
    
    if product_key in fallbacks:
        price_data = fallbacks[product_key]
    else:
        price_data = fallbacks["default"]
    
    return {
        **price_data,
        "reasoning": f"Default price range for {product_name} based on typical market conditions",
        "market_trend": "stable",
        "confidence": 0.5
    }


def get_fallback_negotiation() -> Dict[str, Any]:
    """Get fallback negotiation responses"""
    return PromptTemplates.get_fallback_responses()["negotiation"]