// src/__tests__/errorHandling.test.ts
// MP-5: test: comprehensive error handling and PWA system tests

import {
  ErrorHandlerManager,
  OfflineStateManager,
  StorageErrorHandler,
  ApplicationError,
  ErrorSeverity,
  ErrorCategory
} from '../services/errorHandling';

describe('MP-5: Error Handling & PWA System', () => {
  describe('ErrorHandlerManager', () => {
    let errorHandler: ErrorHandlerManager;

    beforeEach(() => {
      errorHandler = new ErrorHandlerManager();
    });

    it('should create and handle application errors', () => {
      const error = errorHandler.createError(
        'Test error',
        ErrorCategory.DATA,
        ErrorSeverity.HIGH,
        'TEST_ERROR',
        { test: true },
        'User friendly message'
      );

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.message).toBe('Test error');
      expect(error.category).toBe(ErrorCategory.DATA);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.userMessage).toBe('User friendly message');
    });

    it('should create network errors', () => {
      const error = errorHandler.createNetworkError('Network failed', { url: 'test' });
      
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('should create data errors', () => {
      const error = errorHandler.createDataError('Data processing failed');
      
      expect(error.category).toBe(ErrorCategory.DATA);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.code).toBe('DATA_ERROR');
    });

    it('should create offline errors', () => {
      const error = errorHandler.createOfflineError('App is offline');
      
      expect(error.category).toBe(ErrorCategory.OFFLINE);
      expect(error.severity).toBe(ErrorSeverity.LOW);
      expect(error.code).toBe('OFFLINE_ERROR');
    });

    it('should filter errors by category', () => {
      const networkError = errorHandler.createNetworkError('Network error');
      const dataError = errorHandler.createDataError('Data error');
      
      errorHandler.handleError(networkError);
      errorHandler.handleError(dataError);
      
      const networkErrors = errorHandler.getErrorsByCategory(ErrorCategory.NETWORK);
      expect(networkErrors).toHaveLength(1);
      expect(networkErrors[0]).toBe(networkError);
    });

    it('should identify critical errors', () => {
      const criticalError = errorHandler.createError(
        'Critical failure',
        ErrorCategory.DATA,
        ErrorSeverity.CRITICAL,
        'CRITICAL_ERROR'
      );
      
      errorHandler.handleError(criticalError);
      
      const criticalErrors = errorHandler.getCriticalErrors();
      expect(criticalErrors).toHaveLength(1);
      expect(criticalErrors[0]).toBe(criticalError);
    });
  });

  describe('OfflineStateManager', () => {
    let offlineManager: OfflineStateManager;

    beforeEach(() => {
      offlineManager = new OfflineStateManager();
      localStorage.clear();
    });

    it('should detect online status', () => {
      expect(typeof offlineManager.isOnlineStatus()).toBe('boolean');
    });

    it('should queue offline actions', () => {
      offlineManager.queueOfflineAction('ADD_POINT', { id: 1, name: 'Test' });
      
      expect(offlineManager.getPendingActionsCount()).toBe(1);
    });

    it('should clear offline queue', () => {
      offlineManager.queueOfflineAction('ADD_POINT', { id: 1 });
      offlineManager.clearOfflineQueue();
      
      expect(offlineManager.getPendingActionsCount()).toBe(0);
    });
  });

  describe('StorageErrorHandler', () => {
    let storageHandler: StorageErrorHandler;
    let errorHandler: ErrorHandlerManager;

    beforeEach(() => {
      errorHandler = new ErrorHandlerManager();
      storageHandler = new StorageErrorHandler(errorHandler);
      localStorage.clear();
    });

    it('should safely get items from localStorage', async () => {
      localStorage.setItem('test-key', 'test-value');
      
      const value = await storageHandler.safeGetItem('test-key');
      expect(value).toBe('test-value');
    });

    it('should safely set items to localStorage', async () => {
      const success = await storageHandler.safeSetItem('test-key', 'test-value');
      
      expect(success).toBe(true);
      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('should safely remove items from localStorage', async () => {
      localStorage.setItem('test-key', 'test-value');
      
      const success = await storageHandler.safeRemoveItem('test-key');
      
      expect(success).toBe(true);
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should return default values on storage errors', async () => {
      // Mock localStorage to throw an error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const value = await storageHandler.safeGetItem('test-key', 'default');
      expect(value).toBe('default');

      // Restore original
      localStorage.getItem = originalGetItem;
    });
  });
});
