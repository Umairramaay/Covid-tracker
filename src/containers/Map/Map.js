import React from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'

import "./Map.css";
import { showDataOnMap } from '../../util';

function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map

{/* <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
        /> */}