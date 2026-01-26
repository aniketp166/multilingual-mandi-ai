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
  private migrateData(oldData: any): LocalStorageData {
    const newData = getDefaultData();
    
    // Preserve existing products if they exist
    if (oldData.products && Array.isArray(oldData.products)) {
      newData.products = oldData.products;
    }

    // Preserve user preferences if they exist
    if (oldData.user_preferences) {
      newData.user_preferences = {
        ...newData.user_preferences,
        ...oldData.user_preferences,
      };
    }

    return newData;
  }

  // Product management methods
  public getProducts(): Product[] {
    return this.data.products;
  }

  public addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: now,
      updated_at: now,
    };

    this.data.products.push(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Product | null {
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

  public deleteProduct(id: string): boolean {
    const initialLength = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    
    if (this.data.products.length < initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public getProduct(id: string): Product | null {
    return this.data.products.find(p => p.id === id) || null;
  }

  // User preferences methods
  public getUserPreferences() {
    return this.data.user_preferences;
  }

  public updateUserPreferences(updates: Partial<LocalStorageData['user_preferences']>): void {
    this.data.user_preferences = {
      ...this.data.user_preferences,
      ...updates,
    };
    this.saveToStorage();
  }

  // Chat session methods
  public getChatSessions(): ChatSession[] {
    return this.data.chat_sessions;
  }

  public addChatSession(session: Omit<ChatSession, 'id' | 'created_at'>): ChatSession {
    const newSession: ChatSession = {
      ...session,
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    this.data.chat_sessions.push(newSession);
    this.saveToStorage();
    return newSession;
  }

  public updateChatSession(id: string, updates: Partial<Omit<ChatSession, 'id' | 'created_at'>>): ChatSession | null {
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
    } catch (error) {
      return { used: 0, available: 0, total: 0 };
    }
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();