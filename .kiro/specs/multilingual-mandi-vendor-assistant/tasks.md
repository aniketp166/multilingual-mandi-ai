# Implementation Plan: Multilingual Mandi - Vendor Assistant

## Overview

This implementation plan breaks down the Multilingual Mandi - Vendor Assistant into discrete coding tasks that build incrementally. The approach prioritizes core functionality first, then adds AI features, and finally integrates everything with comprehensive testing. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [ ] 1. Set up project structure and development environment
  - Create React TypeScript project with Next.js
  - Set up Tailwind CSS configuration
  - Create Python FastAPI backend project structure
  - Configure CORS and environment variables
  - Set up development scripts and basic routing
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 2. Implement core data models and types
  - [x] 2.1 Create TypeScript interfaces for all data models
    - Define Product, ProductInput, Message, ChatSession, PriceSuggestion interfaces
    - Create API request/response type definitions
    - Set up LocalStorage data schema types
    - _Requirements: 1.2, 5.1, 6.1_
  
  - [ ]* 2.2 Write property test for data model validation
    - **Property 1: Product Creation Validation**
    - **Validates: Requirements 1.2**
  
  - [ ] 2.3 Create Python Pydantic models for API
    - Define backend data models matching frontend interfaces
    - Add validation rules and constraints
    - _Requirements: 9.4, 9.5_

- [ ] 3. Implement LocalStorage persistence layer
  - [x] 3.1 Create storage utility functions
    - Implement save/load functions for products and preferences
    - Add error handling for storage quota and failures
    - Create data migration utilities for schema changes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 3.2 Write property tests for storage persistence
    - **Property 16: LocalStorage Data Persistence**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 3.3 Write property test for storage quota management
    - **Property 17: Storage Quota Management**
    - **Validates: Requirements 6.4, 6.5**

- [ ] 4. Build core product management functionality
  - [x] 4.1 Create ProductCard component
    - Display product information with actions
    - Handle edit, delete, and price suggestion triggers
    - Implement responsive card layout
    - _Requirements: 1.1, 1.4_
  
  - [ ] 4.2 Create AddProductModal component
    - Form for creating new products with validation
    - Dropdown for sample products (Tomato, Onion, Potato, Banana, Apple)
    - Integration with storage layer
    - _Requirements: 1.2, 1.5_
  
  - [x] 4.3 Implement VendorDashboard component
    - Product grid layout with responsive design
    - Floating action button for adding products
    - Product CRUD operations integration
    - _Requirements: 1.1, 1.3_
  
  - [ ]* 4.4 Write property test for product update behavior
    - **Property 2: Product Update Timestamp Preservation**
    - **Validates: Requirements 1.3**
  
  - [ ]* 4.5 Write property test for soft delete functionality
    - **Property 3: Soft Delete Behavior**
    - **Validates: Requirements 1.4**

- [ ] 5. Checkpoint - Core product management complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement backend API endpoints
  - [ ] 6.1 Create FastAPI application structure
    - Set up main application with CORS configuration
    - Create router modules for different endpoints
    - Add environment variable configuration
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ] 6.2 Implement /translate endpoint
    - Accept text and language pairs
    - Integrate with Gemini API for translation
    - Handle translation failures gracefully
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 6.3 Implement /price-suggest endpoint
    - Accept product details and return pricing recommendations
    - Integrate with Gemini API for market analysis
    - Provide fallback pricing when market data unavailable
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 6.4 Implement /negotiate endpoint
    - Accept conversation context and return reply suggestions
    - Generate contextual negotiation responses
    - Handle cases where suggestions cannot be generated
    - _Requirements: 4.1, 4.2, 4.5_
  
  - [ ]* 6.5 Write property tests for API error handling
    - **Property 21: API Error Response Consistency**
    - **Validates: Requirements 9.4, 9.5**

- [ ] 7. Implement translation functionality
  - [ ] 7.1 Create translation service integration
    - API client for backend translation endpoint
    - Error handling and retry logic
    - Caching for repeated translations
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 7.2 Build translation UI components
    - Display original and translated text
    - Language indicators and selection
    - Error states and retry options
    - _Requirements: 2.4, 2.5_
  
  - [ ]* 7.3 Write property tests for translation behavior
    - **Property 4: Bidirectional Translation Consistency**
    - **Validates: Requirements 2.1, 2.2, 2.4**
  
  - [ ]* 7.4 Write property test for translation error handling
    - **Property 5: Translation Error Handling**
    - **Validates: Requirements 2.3**
  
  - [ ]* 7.5 Write property test for language indication
    - **Property 6: Translation Language Indication**
    - **Validates: Requirements 2.5**

- [ ] 8. Implement price discovery features
  - [ ] 8.1 Create PriceSuggestionModal component
    - Display price ranges with visual indicators
    - Show reasoning for price suggestions
    - Allow price acceptance or manual adjustment
    - _Requirements: 3.1, 3.2, 3.5_
  
  - [ ] 8.2 Integrate price discovery with product management
    - Add price suggestion buttons to product cards
    - Handle API calls and loading states
    - Implement fallback pricing logic
    - _Requirements: 3.3, 3.4_
  
  - [ ]* 8.3 Write property tests for price discovery
    - **Property 7: Price Discovery Completeness**
    - **Validates: Requirements 3.1, 3.2, 3.5**
  
  - [ ]* 8.4 Write property test for price discovery fallback
    - **Property 8: Price Discovery Fallback**
    - **Validates: Requirements 3.3**
  
  - [ ]* 8.5 Write property test for price input sensitivity
    - **Property 9: Price Discovery Input Sensitivity**
    - **Validates: Requirements 3.4**

- [ ] 9. Build chat and negotiation system
  - [ ] 9.1 Create NegotiationChat component
    - Real-time chat interface with message bubbles
    - Display translated messages with original text toggle
    - Message history and scrolling
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 9.2 Implement negotiation assistance
    - AI reply suggestions as quick action buttons
    - Allow editing of suggested replies before sending
    - Handle suggestion generation failures
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [ ] 9.3 Add chat session management
    - Create and manage chat sessions
    - Preserve conversation state during inactivity
    - Handle multiple concurrent chats
    - _Requirements: 5.1, 5.5_
  
  - [ ]* 9.4 Write property tests for negotiation features
    - **Property 10: Negotiation Suggestion Generation**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ]* 9.5 Write property test for suggestion editability
    - **Property 11: Negotiation Suggestion Editability**
    - **Validates: Requirements 4.3**
  
  - [ ]* 9.6 Write property test for negotiation fallbacks
    - **Property 12: Negotiation Fallback Responses**
    - **Validates: Requirements 4.5**
  
  - [ ]* 9.7 Write property tests for chat functionality
    - **Property 13: Chat Session Creation**
    - **Property 14: Real-time Message Delivery**
    - **Property 15: Message History Persistence**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 10. Checkpoint - Core features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement multi-language interface
  - [ ] 11.1 Set up internationalization (i18n)
    - Configure react-i18next for frontend localization
    - Create language resource files for major Indian languages
    - Implement language detection and switching
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 11.2 Add language preference management
    - Separate settings for interface and communication languages
    - Persist language preferences in localStorage
    - Implement fallback to English when resources unavailable
    - _Requirements: 7.4, 7.5_
  
  - [ ]* 11.3 Write property tests for language features
    - **Property 18: Language Detection and Switching**
    - **Property 19: Language Fallback Behavior**
    - **Validates: Requirements 7.1, 7.2, 7.4, 7.5**

- [ ] 12. Implement responsive design and mobile optimization
  - [ ] 12.1 Create mobile-responsive layouts
    - Implement mobile-first CSS with Tailwind
    - Optimize touch interactions and button sizes
    - Ensure usability on screens as small as 320px
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ] 12.2 Add responsive behavior for screen size changes
    - Dynamic layout reorganization
    - Adaptive content display
    - Mobile navigation patterns
    - _Requirements: 8.2_
  
  - [ ]* 12.3 Write property test for responsive interface
    - **Property 20: Responsive Interface Adaptation**
    - **Validates: Requirements 8.1, 8.2, 8.4**

- [ ] 13. Implement comprehensive error handling
  - [ ] 13.1 Add network resilience features
    - Message queuing for offline scenarios
    - Connection status indicators
    - Automatic retry with exponential backoff
    - _Requirements: 10.1, 10.3_
  
  - [ ] 13.2 Implement service fallback mechanisms
    - Fallback functionality when AI services unavailable
    - Clear status indicators for service health
    - Graceful degradation of features
    - _Requirements: 10.2_
  
  - [ ] 13.3 Add user-friendly error messaging
    - Descriptive error messages with solutions
    - Error recovery options and data preservation
    - Error boundary components for React
    - _Requirements: 10.4, 10.5_
  
  - [ ]* 13.4 Write property tests for error handling
    - **Property 22: Network Resilience**
    - **Property 23: Service Fallback Reliability**
    - **Property 24: Error Recovery and Data Preservation**
    - **Property 25: User-Friendly Error Communication**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [ ] 14. Final integration and testing
  - [ ] 14.1 Wire all components together
    - Connect frontend components with backend APIs
    - Ensure proper data flow between all features
    - Add loading states and user feedback
    - _Requirements: All requirements integration_
  
  - [ ]* 14.2 Write integration tests
    - End-to-end workflow testing
    - Cross-component interaction validation
    - API integration testing
    - _Requirements: All requirements validation_
  
  - [ ] 14.3 Performance optimization
    - Code splitting and lazy loading
    - API response caching
    - Bundle size optimization
    - _Requirements: 8.5_

- [ ] 15. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and user feedback
- The implementation follows mobile-first responsive design principles
- All AI integrations include fallback mechanisms for reliability