async function populate_place(place) {
    await place?.fetchFields({
        fields: ["displayName", "types", "addressComponents", "formattedAddress", "location", "plusCode", "viewport", "websiteURI", "internationalPhoneNumber", "editorialSummary"],
      });
}