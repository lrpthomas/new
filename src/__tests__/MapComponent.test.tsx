import React from 'react';
import { render } from '@testing-library/react';
import { MapComponent } from '../components/map/map-component';

const onMock = jest.fn();
const offMock = jest.fn();
const getCenterMock = jest.fn();
const getZoomMock = jest.fn();

const mockMap = {
  on: onMock,
  off: offMock,
  getCenter: getCenterMock,
  getZoom: getZoomMock,
};

jest.mock('react-leaflet', () => {
  const MockMapContainer = React.forwardRef<any, any>((props, ref) => {
    React.useImperativeHandle(ref, () => mockMap, []);
    return React.createElement('div', null, props.children);
  });
  MockMapContainer.displayName = 'MapContainer';
  return {
    MapContainer: MockMapContainer,
    TileLayer: (props: unknown) => React.createElement('div', null, props.children),
    Marker: (props: unknown) => React.createElement('div', null, props.children),
    Popup: (props: unknown) => React.createElement('div', null, props.children),
  };
});

const setMapState = jest.fn();

jest.mock('../hooks/useMapState', () => ({
  useMapState: () => ({
    center: { lat: 0, lng: 0 },
    zoom: 0,
    setMapState,
  }),
}));

describe('MapComponent moveend handler', () => {
  it('registers moveend listener and updates map state', () => {
    onMock.mockClear();
    offMock.mockClear();
    getCenterMock.mockReturnValue({ lat: 10, lng: 20 });
    getZoomMock.mockReturnValue(5);

    const { unmount } = render(<MapComponent markers={[]} />);

    const call = onMock.mock.calls.find(c => c[0] === 'moveend');
    expect(call).toBeTruthy();
    const handler = call ? call[1] : undefined;
    expect(typeof handler).toBe('function');

    if (handler) handler();

    expect(setMapState).toHaveBeenCalledWith({ center: { lat: 10, lng: 20 }, zoom: 5 });

    unmount();

    const offCall = offMock.mock.calls.find(c => c[0] === 'moveend');
    expect(offCall).toBeTruthy();
    if (offCall) {
      expect(offCall[1]).toBe(handler);
    }
  });
});
