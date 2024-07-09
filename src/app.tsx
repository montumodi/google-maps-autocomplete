import React, { useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, ControlPosition, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

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

  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLng>();

  useEffect(() => {
    if (selectedPlace?.location) {
      setMarkerPosition(selectedPlace.location);
      // setMapCenter(selectedPlace.location);
    }
  }, [selectedPlace]);

  const handleMarkerDragEnd = async (event) => {
    setMarkerPosition(event.latLng);
    // Reverse geocode to get the address for the new position
    const geocoder = new window.google.maps.Geocoder();
    console.log(event.latLng);
    const results = await geocoder.geocode({ location: event.latLng });
    if (results.results.length > 0) {

      const { Place } = await google.maps.importLibrary(
        "places"
      ) as google.maps.PlacesLibrary;

      const place = new Place({"id": results.results[0].place_id});
      await place?.fetchFields({
        fields: ["displayName", "types", "addressComponents", "formattedAddress", "location", "plusCode", "viewport", "websiteURI", "internationalPhoneNumber", "editorialSummary"],
      });

      setSelectedPlace(place);
    }
  }

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
            center={mapCenter}
            defaultCenter={{ lat: 51.52059819765926, lng: -0.3138373625656573 }}
            disableDefaultUI={true}
            mapId={'1ba3b93c3e1caec2'}
          />
          {markerPosition && (
            <AdvancedMarker
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              position={markerPosition}
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
