// MP-5: Complete error handling service with all expected methods
import { ApplicationError, ErrorCategory, ErrorSeverity } from '../types';

export class ErrorHandlerManager {
  private errors: ApplicationError[] = [];
  private listeners: ((error: ApplicationError) => void)[] = [];
  private maxErrors = 100;

  addError(error: ApplicationError): void {
    if (!error.timestamp) {
      error.timestamp = Date.now();
    }
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in error handler listener:', err);
      }
    });
  }

  handleError(error: ApplicationError): void {
    this.addError(error);
  }

  subscribe(listener: (error: ApplicationError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  createError(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    code: string,
    context?: Record<string, unknown>
  ): ApplicationError {
    return {
      message,
      category,
      severity,
      code,
      timestamp: Date.now(),
      context,
      details: undefined
    };
  }

  createNetworkError(message: string, context?: Record<string, unknown>): ApplicationError {
    return this.createError(message, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, 'NETWORK_ERROR', context);
  }

  createDataError(message: string, context?: Record<string, unknown>): ApplicationError {
    return this.createError(message, ErrorCategory.VALIDATION, ErrorSeverity.MEDIUM, 'DATA_ERROR', context);
  }

  createOfflineError(message: string, context?: Record<string, unknown>): ApplicationError {
    return this.createError(message, ErrorCategory.NETWORK, ErrorSeverity.LOW, 'OFFLINE_ERROR', context);
  }

  getErrors(): ApplicationError[] {
    return [...this.errors];
  }

  getErrorsByCategory(category: ErrorCategory): ApplicationError[] {
    return this.errors.filter(error => error.category === category);
  }

  getErrorsBySeverity(severity: ErrorSeverity): ApplicationError[] {
    return this.errors.filter(error => error.severity === severity);
  }

  getCriticalErrors(): ApplicationError[] {
    return this.getErrorsBySeverity(ErrorSeverity.CRITICAL);
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorCount(): number {
    return this.errors.length;
  }
}

export class OfflineStateManager {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: ((online: boolean) => void)[] = [];
  private pendingActions: Array<{ type: string; payload: any }> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.setOnlineStatus(true));
      window.addEventListener('offline', () => this.setOnlineStatus(false));
    }
  }

  private setOnlineStatus(online: boolean): void {
    this.isOnline = online;
    this.listeners.forEach(listener => {
      try {
        listener(online);
      } catch (err) {
        console.error('Error in offline state listener:', err);
      }
    });
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  isOnlineStatus(): boolean {
    return this.getOnlineStatus();
  }

  queueOfflineAction(type: string, payload: any): void {
    this.pendingActions.push({ type, payload });
  }

  getPendingActionsCount(): number {
    return this.pendingActions.length;
  }

  clearOfflineQueue(): void {
    this.pendingActions = [];
  }

  subscribe(listener: (online: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export class StorageErrorHandler {
  private errorHandler: ErrorHandlerManager;

  constructor(errorHandler: ErrorHandlerManager) {
    this.errorHandler = errorHandler;
  }

  static handleStorageError(error: unknown, context?: Record<string, unknown>): ApplicationError {
    const message = error instanceof Error ? error.message : 'Storage operation failed';
    const code = error instanceof Error && error.name ? error.name : 'STORAGE_ERROR';
    
    return {
      message,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.MEDIUM,
      code,
      timestamp: Date.now(),
      context,
      details: error
    };
  }

  async safeGetItem(key: string, defaultValue?: string): Promise<string | null> {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue || null;
    } catch (error) {
      this.errorHandler.addError(StorageErrorHandler.handleStorageError(error, { key, operation: 'get' }));
      return defaultValue || null;
    }
  }

  async safeSetItem(key: string, value: string): Promise<boolean> {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      this.errorHandler.addError(StorageErrorHandler.handleStorageError(error, { key, value, operation: 'set' }));
      return false;
    }
  }

  async safeRemoveItem(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      this.errorHandler.addError(StorageErrorHandler.handleStorageError(error, { key, operation: 'remove' }));
      return false;
    }
  }
}

// Global instances
export const errorHandler = new ErrorHandlerManager();
export const offlineManager = new OfflineStateManager();

// Re-export types
export { ApplicationError, ErrorCategory, ErrorSeverity } from '../types';
