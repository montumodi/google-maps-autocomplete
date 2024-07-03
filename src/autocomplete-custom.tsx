import React, { useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

export const AutocompleteCustom = ({ onPlaceSelect }: Props) => {
  const map = useMap();

  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);


  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<
    google.maps.places.AutocompleteSessionToken | null
  >(null);
 

  const fetchPredictions = async (input: string) => {
    try {
      const { AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary(
        "places"
      ) as google.maps.PlacesLibrary;
      
      const token = new AutocompleteSessionToken();
      setSessionToken(token);

      const request = {
        input,
        sessionToken: token, // Use the session token
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(
        request
      );
      setPredictions(suggestions);
      
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length >= 3) { // Fetch predictions only if input is long enough
      fetchPredictions(value);
    } else {
      setPredictions([]);
    }
  };

  const handleSuggestionClick = async (prediction: google.maps.places.AutocompleteSuggestion) => {
    try {
    //   const { Place } = await google.maps.importLibrary("places");

      let place = prediction?.placePrediction?.toPlace();

      await place?.fetchFields({
        fields: ["displayName", "types", "addressComponents", "formattedAddress", "location", "plusCode", "viewport", "websiteURI", "internationalPhoneNumber", "editorialSummary"],
      });

      onPlaceSelect(place);
      setSelectedPlace(place);
      setInputValue(place?.formattedAddress || "");
      setPredictions([]);
      // Update the session token for the next request
      setSessionToken(new google.maps.places.AutocompleteSessionToken()); 
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className="autocomplete-container">
      <input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for a place"
      />

      {predictions.length > 0 && (
        <ul className="custom-list">
          {predictions.map((prediction) => (
            <li
              key={prediction.placePrediction?.placeId}
              className="custom-list-item"
              onClick={() => handleSuggestionClick(prediction)}
            >
              {prediction.placePrediction?.text.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
