# Maptap

Enhanced Mobile Map CSV Editor for quickly editing and previewing geospatial data.

## 🚀 Project Overview

Maptap is a browser-based tool for visualizing, editing, and exporting geospatial point data (e.g., latitude/longitude) via CSV. It supports:
- Map view with live marker updates
- CSV import/export with validation
- Editable point metadata
- Integration with Firebase or local storage (if enabled)

## 🏗️ Architecture Overview

- **Frontend** – React and TypeScript components live in `src/components` with supporting hooks in `src/hooks`.
- **Backend** – Express server code is in `src/server.ts` with API routes under `src/routes`.

## 📦 Installing Dependencies

Use [pnpm](https://pnpm.io/) for dependency management:

```bash
pnpm install
```
After installing, run `pnpm lint` and `pnpm test` to ensure the project is set up correctly.

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

Use `--` to pass Node flags to the underlying `ts-node` process. For example:

```bash
pnpm dev -- --inspect
```

Set the `PORT` environment variable to change the listening port.

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

### Step-by-Step CSV Workflow

1. Click **Import** and choose a CSV file to load your points.
2. Edit point data directly on the map or in the table.
3. Click **Export CSV** when you're ready to download the updated dataset.

- GeoJSON files can also be imported through the same dialog.

### Example CSV

```csv
id,name,lat,lng
1,Site A,48.2,-122.3
2,Site B,47.8,-122.5
```

### Example GeoJSON

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-122.3, 48.2] },
      "properties": { "id": 1, "name": "Site A" }
    }
  ]
}
```

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

For optional Firebase integration, create a `.env` file with your Firebase credentials. The app will fall back to local storage when these values are not provided:

```bash
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_APP_ID=your-firebase-app-id
```

These variables are loaded at runtime if present.
