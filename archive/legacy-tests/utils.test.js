// Unit tests for utility functions
import { debounce, sanitizeInput, Cache, RateLimiter, Pagination, UndoRedoManager } from '../utils.js';

describe('Utility Functions', () => {
    describe('debounce', () => {
        it('should only call the function once after the wait period', (done) => {
            let callCount = 0;
            const debouncedFn = debounce(() => callCount++, 100);

            debouncedFn();
            debouncedFn();
            debouncedFn();

            setTimeout(() => {
                expect(callCount).toBe(1);
                done();
            }, 200);
        });
    });

    describe('sanitizeInput', () => {
        it('should sanitize HTML input', () => {
            const input = '<script>alert("xss")</script>';
            const sanitized = sanitizeInput(input);
            expect(sanitized).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
        });

        it('should handle null input', () => {
            expect(sanitizeInput(null)).toBe('');
        });
    });

    describe('Cache', () => {
        it('should store and retrieve values', () => {
            const cache = new Cache();
            cache.set('test', 'value');
            expect(cache.get('test')).toBe('value');
        });

        it('should expire values after TTL', (done) => {
            const cache = new Cache(100);
            cache.set('test', 'value');

            setTimeout(() => {
                expect(cache.get('test')).toBeNull();
                done();
            }, 200);
        });
    });

    describe('RateLimiter', () => {
        it('should limit requests within time window', () => {
            const limiter = new RateLimiter(2, 1000);
            expect(limiter.canMakeRequest('test')).toBe(true);
            expect(limiter.canMakeRequest('test')).toBe(true);
            expect(limiter.canMakeRequest('test')).toBe(false);
        });
    });

    describe('Pagination', () => {
        it('should return correct page of items', () => {
            const items = [1, 2, 3, 4, 5];
            const pagination = new Pagination(items, 2);

            expect(pagination.getCurrentPage()).toEqual([1, 2]);
            pagination.setPage(2);
            expect(pagination.getCurrentPage()).toEqual([3, 4]);
        });

        it('should handle empty items array', () => {
            const pagination = new Pagination([]);
            expect(pagination.getCurrentPage()).toEqual([]);
            expect(pagination.getTotalPages()).toBe(0);
        });
    });

    describe('UndoRedoManager', () => {
        it('should handle undo/redo operations', () => {
            const manager = new UndoRedoManager();

            manager.push({ type: 'add', point: { id: 1 } });
            manager.push({ type: 'edit', point: { id: 2 } });

            expect(manager.canUndo()).toBe(true);
            expect(manager.canRedo()).toBe(false);

            const undoAction = manager.undo();
            expect(undoAction.type).toBe('edit');

            expect(manager.canRedo()).toBe(true);
            const redoAction = manager.redo();
            expect(redoAction.type).toBe('edit');
        });
    });
});
