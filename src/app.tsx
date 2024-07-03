import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, ControlPosition, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

import { CustomMapControl } from './map-control';
import MapHandler from './map-handler';
import AddressTable from './address-data';
import styled from 'styled-components'; // Use styled-components for easier styling

const API_KEY = '';

const MapContainer = styled.div`
  display: flex;
  .map {
    width: 70%;
    height: 100vh;
  }
  .address-table {
    width: 30%;
    padding: 20px;
    height: 100vh;
    overflow: scroll;
  }
`;

export type AutocompleteMode = { id: string; label: string };

const autocompleteModes: Array<AutocompleteMode> = [
  { id: 'custom', label: 'Custom Build' },
];

const App = () => {
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
    useState<AutocompleteMode>(autocompleteModes[0]);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null);

  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // const handleMarkerDragEnd = async (event) => {
  //   const newPosition = event.latLng.toJSON();
  //   setMarkerPosition(newPosition);
  
  //   // Reverse geocode to get the address for the new position
  //   const geocoder = new window.google.maps.Geocoder();
  //   const results = await geocoder.geocode({ location: newPosition });
  //   if (results.results.length > 0) {
  //     setSelectedPlace(results.results[0]);
  //   }
  // }

  return (
    <APIProvider apiKey={API_KEY}>
      <MapContainer>
        <div className='address-table'>
          <CustomMapControl
            controlPosition={ControlPosition.LEFT}
            selectedAutocompleteMode={selectedAutocompleteMode}
            onPlaceSelect={setSelectedPlace}
          />
          {selectedPlace && <AddressTable selectedPlace={selectedPlace} />}
        </div>
        <div className="map">
          <Map
            defaultZoom={3}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={'1ba3b93c3e1caec2'}
          />
          {selectedPlace && (
            <AdvancedMarker
              draggable={true}
              // onDragEnd={handleMarkerDragEnd}
              position={{
                lat: selectedPlace.location?.lat() ?? 0,
                lng: selectedPlace.location?.lng() ?? 0,
              }}
            />
          )}
        </div>
      </MapContainer>
      <MapHandler place={selectedPlace} />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(<App />);
}
