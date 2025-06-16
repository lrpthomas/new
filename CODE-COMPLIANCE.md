# Code Compliance Guidelines

This document outlines the code compliance rules for the MAP TAP project. All contributors must follow these guidelines to ensure code quality, maintainability, and project integrity.

# Feature Verification Checklist

> Mark each item as `[x]` when verified complete and working. For each section in the code, add a comment: `// DO NOT ALTER - VERIFIED COMPLETE` once checked off here.

- [ ] CSV Import (all fields, template mode) [MP-1]
- [ ] CSV Export [MP-1]
- [ ] Multiple CSV Imports (field merge/template logic) [MP-1]
- [ ] GeoJSON Import [MP-2]
- [ ] GeoJSON Export [MP-2]
- [x] Map Display (clustering, layers, fallback) [MP-3]
- [ ] Draggable Markers [MP-3]
- [x] Click-to-Add Points [MP-3]
- [ ] Dynamic Marker Icon Color Updates [MP-3]
- [ ] Editable Fields (all CSV/GeoJSON fields)
- [ ] Field Type Detection
- [ ] Field Reordering
- [x] Bulk Edit/Delete
- [ ] Search/Filter by Any Field
- [ ] Virtualized List (large datasets)
- [x] Manual Save/Restore as JSON
- [ ] Custom SVG Marker Icon Support
- [ ] Map Print/Export
- [ ] Accessibility (ARIA, keyboard, modals) [MP-4]
- [ ] User Feedback (toasts, banners)
- [x] Offline/PWA Support [MP-5]
- [ ] Error Handling & User Feedback
- [ ] Performance (no major bottlenecks)
- [ ] General Maintainability (comments, structure)

## Remaining Gaps

The following items are not yet completed:

- Draggable Markers
- Dynamic Marker Icon Color Updates
- Editable Fields
- Field Type Detection
- Field Reordering
- Search/Filter by Any Field
- Virtualized List (large datasets)
- Custom SVG Marker Icon Support
- Map Print/Export
- User Feedback (toasts, banners)
- Error Handling & User Feedback
- Performance improvements
- General Maintainability

---

## 1. Targeted Modifications Only

- Modify **only** the specific section or function explicitly requested.
- **Do not** alter unrelated code or remove existing debugging and logging statements.

## 2. Preserve Original Logic & Context

- Retain the original code's intent, logic, comments, and formatting
- **Do not** refactor code unless specifically instructed to do so
- Maintain existing debugging statements and logging
- Keep code organization and structure consistent

## 3. Minimize Impact

- Suggest the **minimum necessary changes** to achieve the stated goal.
- Avoid large-scale modifications unless explicitly required.

## 4. Accuracy and Functionality

- Ensure all code adheres strictly to programming language standards.
- Code suggestions must compile and function as intended.

## 5. Security and Confidentiality

- Avoid introducing security vulnerabilities or exposing sensitive data.

## 6. Code Style & Structure

- Use 2 spaces for indentation unless a project `.editorconfig` specifies otherwise.
- Prefer named functions over anonymous functions for debugging clarity.
- Use ES modules (`import/export`) syntax over CommonJS (`require/module.exports`) for JavaScript.
- Avoid inline styles in React components. Use Tailwind CSS or modular CSS files.

## 7. Tech Stack Awareness

- Assume React (with JSX), Next.js, Tailwind CSS, Firebase, Supabase, or Express may be used depending on the project.
- Assume ES2021+ features are available unless otherwise specified.
- TypeScript is preferred when available—use correct typings and infer where possible.

## 8. Dependency Management

- Suggest `pnpm` for installs unless specified otherwise.
- Always confirm version compatibility when suggesting new packages.
- Avoid deprecated or unstable packages.

## 9. Testing & Validation

- Include testability in all suggestions. Highlight how a feature/component could be tested (unit, integration, or E2E).
- If creating a function or API endpoint, suggest test cases unless excluded.

## 10. File Structure & Naming

- Use kebab-case for filenames and folders unless otherwise specified.
- React components should live in `/components`, and pages in `/pages` (if Next.js).
- Group similar functionality by feature, not by type (prefer "feature-first" structure).

## 11. Error Handling, Fail-Safes, and Robustness

- All code must include appropriate error handling and fail-safes to prevent crashes and data loss.
- Use try/catch blocks or equivalent error boundaries where exceptions may occur.
- Validate all user input and external data before processing.
- Provide clear, actionable user feedback for errors (e.g., error messages, toasts, or banners).
- Log errors for debugging, but avoid exposing sensitive information in logs or user-facing messages.
- Ensure the application degrades gracefully if a feature or dependency fails (e.g., offline mode, fallback UI).
- Test error scenarios and edge cases as part of the validation process.
- Never suppress errors silently—always handle or report them appropriately.

---

## Project-Specific Guidance: Single-File HTML Map App

- This project is a single-file HTML application (HTML, CSS, JS in one file).
- All code changes must preserve the integrity and functionality of the existing app.
- Do not break or disrupt any working features; always test after changes.
- Keep code organized with clear comments and logical sectioning (e.g., separate style, script, and markup with comments).
- Minimize global variable usage; use function scope or IIFE patterns where possible.
- Ensure all external dependencies (CDNs, libraries) are loaded securely and are version-pinned.
- Maintain accessibility and responsive design throughout all changes.
- Any new features or fixes must be backward compatible and not degrade user experience.
- Always back up the current file before making significant changes.

---

## Systematic Review & Enhancement Plan

Before making any code changes, follow this step-by-step review and planning process:

1. **Head Section**

   - Audit and clean up external resources (ensure HTTPS, version-pinned).
   - Add comments for clarity.
   - Check and improve accessibility (contrast, font choices).
   - (Optional) Add favicon.

2. **Controls and UI Elements**

   - Review and enhance ARIA roles/labels.
   - Ensure all controls are keyboard accessible.
   - Improve modal accessibility (focus trap, ESC close).
   - Add user feedback for errors (banners/toasts).

3. **Map Display**

   - Add error handling for map/layer load failures.
   - Ensure map resizes and loads layers robustly.
   - Provide fallback or user message if map fails to load.
   - Improve accessibility (keyboard navigation, alt text).

4. **Embedded JavaScript**

   - Minimize global variables (use IIFE/function scope).
   - Add try/catch and error handling for risky operations.
   - Validate and sanitize all user input.
   - Add logging and user feedback for errors.
   - Add comments and logical code sectioning.

5. **Offline/PWA Support**

   - Ensure offline banner and local save/restore work robustly.
   - Add error handling for offline storage failures.
   - Provide user feedback if offline changes cannot be saved.

6. **General Enhancements**
   - Accessibility improvements throughout.
   - User feedback for all major actions.
   - Maintainability: comments, logical code separation.
   - Performance: review for any obvious bottlenecks.

**No code changes should be made until this review and planning process is completed and approved.**

---

## Future Enhancements Roadmap

The following features are planned or under consideration for the Enhanced Mobile Map CSV Editor. All enhancements must follow the compliance guidelines above and be implemented in small, reviewable steps.

### High Priority / In Progress

- Field type detection (auto-detect string, number, date, boolean for CSV/GeoJSON fields)
- Field reordering (drag-and-drop or up/down controls in the form and table)
- Custom SVG marker icon support (user upload or selection)
- Bulk edit and bulk delete for points
- Search and filter by any field (including custom fields)
- Virtualized list for large datasets (performance)
- Manual save/restore as JSON (in addition to CSV/GeoJSON)
- Improved statistics and summary panel

### Medium Priority / Backlog

- Advanced filtering (multi-field, range, boolean logic)
- Field-level validation and constraints (e.g., required, min/max, regex)
- User-defined field templates (save/load field sets)
- Undo/redo for edits and deletions
- Export/import settings and field order
- Map print/export to image or PDF
- Multi-language (i18n) support

### Accessibility & UX

- Enhanced keyboard navigation for all controls and map features
- Screen reader improvements and ARIA live updates for all dynamic content
- Customizable color themes (for accessibility/branding)

### Offline & PWA

- Background sync for offline edits (when/if server sync is added)
- Improved service worker update flow and user notification

---

## AI Verification Step (Before Applying Changes)

- Confirm explicitly:
  - "Changes are strictly within scope and compliant with the above guidelines."
  - "No unnecessary code changes were introduced."

---

**All contributors must comply strictly with these rules to maintain code integrity and project standards.**

## Multi-File Application Structure

### Directory Organization

```
src/
├── components/         # React components
│   ├── map/           # Map-related components
│   ├── controls/      # UI control components
│   ├── modals/        # Modal components
│   └── common/        # Shared components
├── styles/            # CSS/SCSS files
│   ├── themes/        # Theme variables
│   ├── components/    # Component-specific styles
│   └── global/        # Global styles
├── utils/             # Utility functions
│   ├── map/          # Map-related utilities
│   ├── data/         # Data processing utilities
│   └── validation/   # Input validation
├── hooks/             # Custom React hooks
├── services/          # Service layer
│   ├── api/          # API integration
│   ├── storage/      # Local storage
│   └── map/          # Map services
└── types/            # TypeScript type definitions

public/
├── icons/            # Application icons
└── assets/           # Static assets
```

### File Naming Conventions

- Use kebab-case for all file names
- Component files: `component-name.tsx`
- Style files: `component-name.module.scss`
- Utility files: `utility-name.ts`
- Hook files: `use-hook-name.ts`
- Service files: `service-name.ts`

### Component Organization

- Each component should be in its own directory
- Include component-specific styles, tests, and types
- Example structure:

  ```
  components/
  └── map-marker/
      ├── index.tsx
      ├── map-marker.module.scss
      ├── map-marker.test.tsx
      └── types.ts
  ```

### Code Splitting

- Use dynamic imports for route-based code splitting
- Implement lazy loading for large components
- Keep bundle size optimized with proper chunking

### State Management

- Use React Context for global state
- Implement custom hooks for reusable state logic
- Keep component state local when possible

### Asset Management

- Store static assets in `public/assets`
- Use webpack/asset modules for imported assets
- Implement proper caching strategies

### Build and Deployment

- Maintain separate configs for development and production
- Implement proper source maps
- Use environment variables for configuration
- Follow security best practices for deployment

### Testing Structure

```
src/
└── __tests__/
    ├── components/
    ├── hooks/
    ├── utils/
    └── services/
```

### Documentation

- Maintain README.md in each major directory
- Document component props and usage
- Include JSDoc comments for functions
- Keep API documentation up to date

### Performance Considerations

- Implement proper code splitting
- Use React.memo for expensive components
- Optimize bundle size
- Implement proper caching strategies

### Security Guidelines

- Sanitize all user inputs
- Implement proper CORS policies
- Use environment variables for sensitive data
- Follow OWASP security guidelines

### Accessibility Standards

- Maintain ARIA attributes
- Ensure keyboard navigation
- Implement proper focus management
- Follow WCAG 2.1 guidelines

## Current Issues Documentation

### 1. Head Section Issues

- Missing favicon
- Missing meta description for accessibility
- Missing viewport-fit=cover for modern devices
- PWA manifest needs enhancement

### 2. Controls and UI Elements Issues

- Missing ARIA roles and labels
- Incomplete keyboard navigation
- Modal focus trap not implemented
- Missing error feedback system
- Incomplete screen reader support
- Missing focus management
- Incomplete tab order

### 3. Map Display Issues

- No error handling for map load failures
- Missing fallback UI for map failures
- Incomplete accessibility features
- No performance metrics
- Missing layer error handling
- Incomplete map controls accessibility
- Missing map keyboard navigation

### 4. JavaScript Implementation Issues

- Global variables present
- Basic error handling
- Limited input validation
- Minimal logging system
- Global scope pollution
- Incomplete error handling
- Missing input sanitization
- Inadequate logging
- Missing try/catch blocks
- Incomplete error boundaries

### 5. Offline/PWA Issues

- Incomplete service worker
- Missing offline data sync
- Inadequate storage error handling
- No background sync
- Missing update notifications
- Incomplete offline state management
- Missing offline data conflict resolution

### 6. Feature-Specific Issues

#### CSV Import/Export

- No template mode implementation
- Missing field type detection
- Incomplete error handling
- Missing validation for required fields
- No support for custom field types
- Missing field mapping validation
- Incomplete data type conversion

#### GeoJSON Import/Export

- Missing coordinate system validation
- Incomplete geometry type handling
- Missing property validation
- Incomplete error handling
- Missing data type conversion

#### Map Features

- Incomplete marker drag validation
- Missing click-to-add validation
- Incomplete marker clustering
- Missing layer management
- Incomplete map state management

#### Data Management

- Missing bulk operation validation
- Incomplete search functionality
- Missing filter persistence
- Incomplete data synchronization
- Missing undo/redo functionality

#### UI/UX Features

- Missing loading states
- Incomplete error messages
- Missing success feedback
- Incomplete progress indicators
- Missing confirmation dialogs

### 7. Performance Issues

- Missing code splitting
- Incomplete lazy loading
- Missing performance monitoring
- Incomplete caching strategy
- Missing bundle optimization

### 8. Security Issues

- Missing input sanitization
- Incomplete XSS protection
- Missing CSRF protection
- Incomplete data validation
- Missing secure headers

### 9. Testing Issues

- Missing unit tests
- Incomplete integration tests
- Missing E2E tests
- Incomplete test coverage
- Missing performance tests

### 10. Documentation Issues

- Missing API documentation
- Incomplete component documentation
- Missing usage examples
- Incomplete error documentation
- Missing performance guidelines
