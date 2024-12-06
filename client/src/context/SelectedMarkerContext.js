import { createContext, useState } from "react";

export const SelectMarkerContext = createContext()

export const StatePovider = (props) => {
    const [selectedMarker, setSelectedMarker] = useState()

    return (
        <SelectMarkerContext.Provider value={[selectedMarker, setSelectedMarker]}>
            {props.children}
        </SelectMarkerContext.Provider>
    )
}
