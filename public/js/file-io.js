// File import/export operations
import { addMarker } from './map-init.js';
import { showToast } from './ui-handlers.js';

// Export points to CSV
export function exportToCSV() {
    try {
        const csv = Papa.unparse(points.map(point => ({
            name: point.name,
            status: point.status,
            description: point.description,
            group: point.group,
            latitude: point.latlng.lat,
            longitude: point.latlng.lng,
            ...point.customFields
        })));

        downloadFile(csv, 'points.csv', 'text/csv');
    } catch (error) {
        showToast('Error exporting CSV file');
        console.error('CSV Export Error:', error);
    }
}

// Import points from CSV
export function importFromCSV(file) {
    if (!file) {
        showToast('No file selected');
        return;
    }

    Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: header => header.trim(),
                transform: value => value.trim(),
                complete: function(results) {
                        try {
                            if (results.errors && results.errors.length > 0) {
                                throw new Error('CSV parsing errors: ' + results.errors.map(e => e.message).join(', '));
                            }

                            if (!results.data || results.data.length === 0) {
                                throw new Error('No data found in CSV file');
                            }

                            const previewModal = document.getElementById('csvPreviewModal');
                            const previewTable = document.getElementById('csvPreviewTable');
                            const latField = document.getElementById('latField');
                            const lngField = document.getElementById('lngField');
                            const labelField = document.getElementById('labelField');

                            // Clear previous options
                            latField.innerHTML = '';
                            lngField.innerHTML = '';
                            labelField.innerHTML = '';

                            // Add field options
                            const fields = Object.keys(results.data[0]);
                            fields.forEach(field => {
                                const option = document.createElement('option');
                                option.value = field;
                                option.textContent = field;

                                latField.appendChild(option.cloneNode(true));
                                lngField.appendChild(option.cloneNode(true));
                                labelField.appendChild(option.cloneNode(true));

                                // Auto-select likely fields
                                if (field.toLowerCase().includes('lat')) latField.value = field;
                                if (field.toLowerCase().includes('lng')) lngField.value = field;
                                if (field.toLowerCase().includes('name')) labelField.value = field;
                            });

                            // Show preview
                            previewTable.innerHTML = `
                    <table class="preview-table">
                        <thead>
                            <tr>${fields.map(f => `<th>${f}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${results.data.slice(0, 5).map(row => `
                                <tr>${fields.map(f => `<td>${row[f]}</td>`).join('')}</tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                
                previewModal.style.display = 'block';
                
                // Handle import confirmation
                document.getElementById('confirmCsvImportBtn').onclick = () => {
                    try {
                        const lat = latField.value;
                        const lng = lngField.value;
                        const label = labelField.value;

                        if (!lat || !lng || !label) {
                            throw new Error('Required fields not selected');
                        }
                        
                        const newPoints = results.data.map(row => {
                            const latValue = parseFloat(row[lat]);
                            const lngValue = parseFloat(row[lng]);

                            if (isNaN(latValue) || isNaN(lngValue)) {
                                throw new Error(`Invalid coordinates in row: ${JSON.stringify(row)}`);
                            }

                            if (latValue < -90 || latValue > 90 || lngValue < -180 || lngValue > 180) {
                                throw new Error(`Coordinates out of range in row: ${JSON.stringify(row)}`);
                            }

                            return {
                                name: row[label] || 'Unnamed Point',
                                latlng: L.latLng(latValue, lngValue),
                                status: 'active',
                                description: '',
                                group: '',
                                customFields: Object.fromEntries(
                                    Object.entries(row).filter(([key]) => 
                                        ![lat, lng, label].includes(key)
                                    )
                                )
                            };
                        });
                        
                        importPoints(newPoints);
                        previewModal.style.display = 'none';
                    } catch (error) {
                        showToast(`Error processing CSV data: ${error.message}`);
                        console.error('CSV Processing Error:', error);
                    }
                };
            } catch (error) {
                showToast(`Error importing CSV: ${error.message}`);
                console.error('CSV Import Error:', error);
            }
        },
        error: function(error) {
            showToast(`Error reading CSV file: ${error.message}`);
            console.error('CSV Read Error:', error);
        }
    });
}

// Export points to GeoJSON
export function exportToGeoJSON() {
    const geojson = {
        type: 'FeatureCollection',
        features: points.map(point => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [point.latlng.lng, point.latlng.lat]
            },
            properties: {
                name: point.name,
                status: point.status,
                description: point.description,
                group: point.group,
                ...point.customFields
            }
        }))
    };
    
    downloadFile(JSON.stringify(geojson), 'points.geojson', 'application/json');
}

// Import points from GeoJSON
export function importFromGeoJSON(file) {
    if (!file) {
        showToast('No file selected');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const geojson = JSON.parse(e.target.result);
            
            if (!geojson.type || geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
                throw new Error('Invalid GeoJSON format: Must be a FeatureCollection');
            }

            const newPoints = geojson.features.map(feature => {
                if (!feature.geometry || !feature.geometry.coordinates || !Array.isArray(feature.geometry.coordinates)) {
                    throw new Error(`Invalid feature geometry in GeoJSON: ${JSON.stringify(feature)}`);
                }

                const [lng, lat] = feature.geometry.coordinates;
                if (typeof lat !== 'number' || typeof lng !== 'number' || 
                    lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    throw new Error(`Invalid coordinates in feature: ${JSON.stringify(feature)}`);
                }

                return {
                    name: feature.properties?.name || 'Unnamed Point',
                    latlng: L.latLng(lat, lng),
                    status: feature.properties?.status || 'active',
                    description: feature.properties?.description || '',
                    group: feature.properties?.group || '',
                    customFields: Object.fromEntries(
                        Object.entries(feature.properties || {}).filter(([key]) => 
                            !['name', 'status', 'description', 'group'].includes(key)
                        )
                    )
                };
            });
            
            importPoints(newPoints);
        } catch (error) {
            showToast(`Error importing GeoJSON: ${error.message}`);
            console.error('GeoJSON Import Error:', error);
        }
    };
    reader.onerror = function() {
        showToast('Error reading GeoJSON file');
        console.error('GeoJSON Read Error:', reader.error);
    };
    reader.readAsText(file);
}

// Import points from JSON
export function importFromJSON(file) {
    if (!file) {
        showToast('No file selected');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid JSON format: Must be an array of points');
            }

            const newPoints = data.map(point => {
                if (!point.latlng || typeof point.latlng.lat !== 'number' || typeof point.latlng.lng !== 'number') {
                    throw new Error(`Invalid point data: ${JSON.stringify(point)}`);
                }

                if (point.latlng.lat < -90 || point.latlng.lat > 90 || 
                    point.latlng.lng < -180 || point.latlng.lng > 180) {
                    throw new Error(`Invalid coordinates in point: ${JSON.stringify(point)}`);
                }

                return {
                    name: point.name || 'Unnamed Point',
                    latlng: L.latLng(point.latlng.lat, point.latlng.lng),
                    status: point.status || 'active',
                    description: point.description || '',
                    group: point.group || '',
                    customFields: point.customFields || {}
                };
            });
            
            importPoints(newPoints);
        } catch (error) {
            showToast(`Error importing JSON: ${error.message}`);
            console.error('JSON Import Error:', error);
        }
    };
    reader.onerror = function() {
        showToast('Error reading JSON file');
        console.error('JSON Read Error:', reader.error);
    };
    reader.readAsText(file);
}

// Export points to JSON
export function exportToJSON() {
    downloadFile(JSON.stringify(points), 'points.json', 'application/json');
}

// Helper function to download files
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import points and update UI
function importPoints(newPoints) {
    points = [...points, ...newPoints];
    newPoints.forEach(point => addMarker(point.latlng, point));
    updatePointsList();
    updateStatistics();
    showToast(`Imported ${newPoints.length} points`);
}