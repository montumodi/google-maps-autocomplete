import React from 'react';

function get_address_components(place: google.maps.places.Place) {
    const resultDict = {};

    for (const item of place.addressComponents) {
        for (const type of item.types) {
            if (type !== "political" && !(type in resultDict)) {
                resultDict[type] = item.longText;
            }
        }
    }

    if (place.formattedAddress) {
        resultDict["formatted_address"] = place.formattedAddress;
    }

    resultDict["lat, long"] = `${place.location?.lat()}, ${place.location?.lng()}`;

    if (place.internationalPhoneNumber) {
        resultDict["international_phone_number"] = place.internationalPhoneNumber;
    }

    if (place.websiteURI) {
        resultDict["website"] = place.websiteURI;
    }

    if (place.types) {
        resultDict["types"] = place.types.join("\n");
    }

    if (place.displayName) {
        resultDict["displayName"] = place.displayName;
    }

    if (place.editorialSummary) {
        resultDict["editorial_summary"] = place.editorialSummary;
    }

    if (place.plusCode) {
        resultDict["compound_code"] = place.plusCode.compoundCode;
        resultDict["global_code"] = place.plusCode.globalCode;
    }

    return resultDict;
}

function AddressTable({ selectedPlace }) {
    const addressData = get_address_components(selectedPlace);
    return (
        <table style={{ width: '70%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ "border": "1px solid #ddd", "textAlign": "left", "padding": "8px", "backgroundColor": "#f2f2f2" }}>Type</th>
                    <th style={{ "border": "1px solid #ddd", "textAlign": "left", "padding": "8px", "backgroundColor": "#f2f2f2" }}>Long Name</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(addressData).map(([type, longName]) => (
                    <tr key={type}>
                        <td style={{ "border": "1px solid #ddd", "padding": "8px" }}>{type}</td>
                        <td style={{ "border": "1px solid #ddd", "padding": "8px" }}>{longName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AddressTable;