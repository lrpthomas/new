# Maptap

Enhanced Mobile Map CSV Editor for quickly editing and previewing geospatial data.

## 🚀 Project Overview

Maptap is a browser-based tool for visualizing, editing, and exporting geospatial point data (e.g., latitude/longitude) via CSV. It supports:
- Map view with live marker updates
- CSV import/export with validation
- Editable point metadata
- Integration with Firebase or local storage (if enabled)

## 📦 Installing Dependencies

Use [pnpm](https://pnpm.io/) for dependency management:

```bash
pnpm install
```

## 🧹 Linting

Run ESLint to check code quality:

```bash
pnpm lint
```

## 🏃‍♂️ Running Maptap

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

To build and run for production:

```bash
pnpm build
pnpm start
```

## 🧪 Running Tests

Run the test suite with:

```bash
pnpm test
```

Use `pnpm test:watch` while developing to re-run tests on file changes.


## 📥 Importing and Exporting Data

- Use the **Import** button to upload a CSV file. The map and table update automatically.
- GeoJSON files can be imported through the same dialog.
- Select **Export CSV** from the toolbar to download your current dataset.

## 🗺️ Map Interaction

- Click on the map to add a new point.
- Drag existing markers to update their coordinates.

## 🔌 Running the Backend Server

Start the API server (useful for production builds):

```bash
pnpm start
```

Set `PORT` in your environment to change the listening port.

## ⚙️ Environment Configuration

For optional Firebase integration, create a `.env` file with your Firebase credentials:

```bash
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
```

These variables are loaded at runtime if present.
