import React from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ghanaRegions from '../data/ghana_regions.json';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap = ({ className, outlets, onRegionSelect }) => {
    const ghanaCenter = [7.9465, -1.0232]; // Approximate center of Ghana

    return (
        <div className={className} style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer
                center={ghanaCenter}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                minZoom={6}
                maxBounds={[
                    [4.5, -3.5], // Southwest
                    [11.5, 1.5]  // Northeast
                ]}
                maxBoundsViscosity={1.0}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Standard Map">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satellite View">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {/* Ghana Regions Layer */}
                <GeoJSON
                    data={ghanaRegions}
                    style={() => ({
                        color: '#008751', // Brand Green
                        weight: 1,
                        fillColor: '#008751',
                        fillOpacity: 0.05,
                        dashArray: '3'
                    })}
                    onEachFeature={(feature, layer) => {
                        layer.on({
                            mouseover: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    weight: 2,
                                    color: '#008751',
                                    dashArray: '',
                                    fillOpacity: 0.2
                                });
                            },
                            mouseout: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    weight: 1,
                                    color: '#008751',
                                    dashArray: '3',
                                    fillOpacity: 0.05
                                });
                            },
                            click: (e) => {
                                console.log("Region clicked:", feature.properties.region);
                                if (onRegionSelect && feature.properties.region) {
                                    onRegionSelect(feature.properties.region);
                                }
                            }
                        });
                    }}
                />

                {/* Render Outlet Markers as small dots */}
                {outlets && outlets.map(outlet => {
                    const lat = parseFloat(outlet.coordinates.lat);
                    const lng = parseFloat(outlet.coordinates.lng);

                    if (isNaN(lat) || isNaN(lng)) return null;

                    return (
                        <CircleMarker
                            key={outlet.id}
                            center={[lat, lng]}
                            radius={4}
                            pathOptions={{
                                color: '#ffffff', // White border
                                weight: 1,
                                fillColor: '#008751', // Brand Green fill
                                fillOpacity: 0.9
                            }}
                        >
                            <Popup>
                                <strong>{outlet.name}</strong>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
