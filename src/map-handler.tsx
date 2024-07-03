import {useMap} from '@vis.gl/react-google-maps';
import React, {useEffect} from 'react';

interface Props {
  place: google.maps.places.Place | null;
}

const MapHandler = ({place}: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;
    console.log(place.viewport);
    if (place.viewport) {
      map.fitBounds(place.viewport);
    }
  }, [map, place]);

  return null;
};

export default React.memo(MapHandler);
