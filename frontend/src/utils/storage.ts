import { Product, LocalStorageData, ChatSession } from '../types';
import { storageConfig } from '../config';

const STORAGE_KEY = `${storageConfig.keyPrefix}-data`;
const STORAGE_VERSION = storageConfig.version;
const MAX_STORAGE_SIZE = storageConfig.maxSize;

// Default data structure
const getDefaultData = (): LocalStorageData => ({
  products: [],
  user_preferences: {
    language: 'en',
    currency: 'INR',
  },
  chat_sessions: [],
  version: STORAGE_VERSION,
});

// Storage utility functions
export class StorageManager {
  private static instance: StorageManager;
  private data: LocalStorageData;

  private constructor() {
    this.data = this.loadFromStorage();
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Load data from localStorage with error handling
  private loadFromStorage(): LocalStorageData {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return getDefaultData();
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return getDefaultData();
      }

      const parsed = JSON.parse(stored) as LocalStorageData;
      
      // Handle version migration if needed
      if (parsed.version !== STORAGE_VERSION) {
        console.log('Storage version mismatch, migrating data...');
        return this.migrateData(parsed);
      }

      return parsed;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return getDefaultData();
    }
  }

  // Save data to localStorage with quota handling
  private saveToStorage(): boolean {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }

      const dataString = JSON.stringify(this.data);
      
      // Check size before saving
      const dataSize = new Blob([dataString]).size;
      if (dataSize > MAX_STORAGE_SIZE) {
        console.warn(`Data size (${dataSize}) exceeds max storage size (${MAX_STORAGE_SIZE}), cleaning up...`);
        this.cleanupOldData();
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // Storage quota exceeded
        console.warn('Storage quota exceeded, cleaning up old data...');
        this.cleanupOldData();
        try {
          const dataString = JSON.stringify(this.data);
          localStorage.setItem(STORAGE_KEY, dataString);
          return true;
        } catch (retryError) {
          console.error('Failed to save even after cleanup:', retryError);
          return false;
        }
      } else {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    }
  }

  // Clean up old data to free space
  private cleanupOldData(): void {
    // Keep only last 50 products
    if (this.data.products.length > 50) {
      this.data.products = this.data.products
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 50);
    }

    // Keep only active chat sessions
    this.data.chat_sessions = this.data.chat_sessions.filter(
      session => session.status === 'active'
    );
  }

  // Migrate data between versions
  private migrateData(oldData: unknown): LocalStorageData {
    const newData = getDefaultData();
    
    // Type guard to check if oldData is an object with the expected structure
    if (oldData && typeof oldData === 'object' && oldData !== null) {
      const data = oldData as Record<string, unknown>;
      
      // Preserve existing products if they exist
      if (data.products && Array.isArray(data.products)) {
        newData.products = data.products;
      }

      // Preserve user preferences if they exist
      if (data.user_preferences && typeof data.user_preferences === 'object') {
        newData.user_preferences = {
          ...newData.user_preferences,
          ...(data.user_preferences as Record<string, unknown>),
        };
      }
    }

    return newData;
  }

  // Product management methods
  public getProducts(): Product[] {
    this.data = this.loadFromStorage();
    return this.data.products;
  }

  public addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    this.data = this.loadFromStorage();
    const now = new Date().toISOString();
    const uniqueId = `product_${Date.now()}_${Math.random().toString(36).substring(2, 14)}_${performance.now().toString(36)}`;
    
    const newProduct: Product = {
      ...product,
      id: uniqueId,
      created_at: now,
      updated_at: now,
    };

    const existingIndex = this.data.products.findIndex(p => p.id === newProduct.id);
    if (existingIndex !== -1) {
      return this.addProduct(product);
    }

    const existingNameIndex = this.data.products.findIndex(p => 
      p.name.toLowerCase().trim() === product.name.toLowerCase().trim()
    );
    if (existingNameIndex !== -1) {
      throw new Error(`Product with name "${product.name}" already exists`);
    }

    this.data.products.push(newProduct);
    
    const saved = this.saveToStorage();
    
    if (!saved) {
      this.data.products.pop();
      throw new Error('Failed to save product to storage');
    }
    
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Product | null {
    this.data = this.loadFromStorage();
    const productIndex = this.data.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return null;
    }

    const updatedProduct = {
      ...this.data.products[productIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.data.products[productIndex] = updatedProduct;
    this.saveToStorage();
    return updatedProduct;
  }

  public updateProductByObject(product: Product): boolean {
    this.data = this.loadFromStorage();
    const productIndex = this.data.products.findIndex(p => p.id === product.id);
    if (productIndex === -1) {
      return false;
    }

    this.data.products[productIndex] = {
      ...product,
      updated_at: new Date().toISOString(),
    };
    this.saveToStorage();
    return true;
  }

  public deleteProduct(id: string): boolean {
    this.data = this.loadFromStorage();
    const initialLength = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    
    if (this.data.products.length < initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public getProduct(id: string): Product | null {
    this.data = this.loadFromStorage();
    return this.data.products.find(p => p.id === id) || null;
  }

  public getUserPreferences() {
    this.data = this.loadFromStorage();
    return this.data.user_preferences;
  }

  public updateUserPreferences(updates: Partial<LocalStorageData['user_preferences']>): void {
    this.data = this.loadFromStorage();
    this.data.user_preferences = {
      ...this.data.user_preferences,
      ...updates,
    };
    this.saveToStorage();
  }

  public getChatSessions(): ChatSession[] {
    this.data = this.loadFromStorage();
    return this.data.chat_sessions;
  }

  public addChatSession(session: Omit<ChatSession, 'id' | 'created_at'>): ChatSession {
    this.data = this.loadFromStorage();
    const newSession: ChatSession = {
      ...session,
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      created_at: new Date().toISOString(),
    };

    this.data.chat_sessions.push(newSession);
    this.saveToStorage();
    return newSession;
  }

  public updateChatSession(id: string, updates: Partial<Omit<ChatSession, 'id' | 'created_at'>>): ChatSession | null {
    this.data = this.loadFromStorage();
    const sessionIndex = this.data.chat_sessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      return null;
    }

    const updatedSession = {
      ...this.data.chat_sessions[sessionIndex],
      ...updates,
    };

    this.data.chat_sessions[sessionIndex] = updatedSession;
    this.saveToStorage();
    return updatedSession;
  }

  // Utility methods
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(dataString: string): boolean {
    try {
      const importedData = JSON.parse(dataString) as LocalStorageData;
      this.data = importedData;
      return this.saveToStorage();
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  public clearAllData(): void {
    this.data = getDefaultData();
    this.saveToStorage();
  }

  public getStorageInfo(): { used: number; available: number; total: number } {
    try {
      const dataString = JSON.stringify(this.data);
      const used = new Blob([dataString]).size;
      
      // Estimate available storage (5MB typical limit)
      const total = 5 * 1024 * 1024; // 5MB in bytes
      const available = total - used;

      return { used, available, total };
    } catch (err) {
      console.error('Error calculating storage info:', err);
      return { used: 0, available: 0, total: 0 };
    }
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();