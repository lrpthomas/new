# Priority Feature Tickets

This document lists the next feature tickets derived from `CODE-COMPLIANCE.md`.
Each ticket includes a unique ID, description, and rationale for priority.

## MP-1: Complete CSV Import/Export Support
- **Scope**: Implement template mode, multiple CSV imports with field merge logic, and robust error handling.
- **Priority**: High – core data flow relies on reliable CSV handling.

## MP-2: GeoJSON Import/Export Enhancements
- **Scope**: Add coordinate system validation, geometry type handling, and property validation. Improve export fidelity.
- **Priority**: High – ensures interoperability with mapping tools.

## MP-3: Map Controls and Interaction Improvements
- **Scope**: Draggable markers validation, click‑to‑add safeguards, cluster and layer management, and dynamic icon color updates.
- **Priority**: Medium – improves usability when editing points on the map.

## MP-4: Accessibility Compliance
- **Scope**: ARIA roles, keyboard navigation, focus management for modals, screen reader support, and descriptive feedback messages.
- **Priority**: Medium – required for broader user reach and compliance.

## MP-5: Offline and PWA Features
- **Scope**: Service worker completion, offline data sync, background sync, update notifications, and offline state management.
- **Priority**: Medium – enables usage without consistent network access.

Each ticket should be tracked in the project issue tracker and referenced in future commits.
