import React, { useState, useEffect } from 'react';
import mainImage from '../Images/transly-translation-agency-fG7fzu-6lWA-unsplash.webp'
import { BiLocationPlus, BiSend } from "react-icons/bi";

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';




export function Main() {
    const [location, setLocation] = useState({ lat: undefined, lon: undefined });
    const [error, setError] = useState(null);
    const [pantanos, setPantanos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Configurar icono del marcador (para evitar problemas con iconos en Leaflet)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
    });

    const getAguaMedia = (id) => {
        fetch(`https://g856c7bcf4f198c-retomalackaton.adb.eu-madrid-1.oraclecloudapps.com/ords/admin/api/media-ano/1`)
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch(err => {
                return false
            });
    }


    const handleClickLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                    console.log({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    setError(error.message);
                    console.log(error.message);
                }
            );
        } else {
            setError("Geolocalización no es soportada por este navegador.");
        }
    };

    useEffect(() => {
        if (location.lat && location.lon) {
            // Realizar la petición a la API cuando las coordenadas están disponibles
            setLoading(true);
            fetch(`https://g856c7bcf4f198c-retomalackaton.adb.eu-madrid-1.oraclecloudapps.com/ords/admin/api/pantanos_cercanos/${location.lat}/${location.lon}`)
                .then(response => response.json())
                .then(data => {
                    setPantanos(data.items);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Error al obtener los pantanos.");
                    setLoading(false);
                });
        }
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                    console.log({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    setError(error.message);
                    console.log(error.message);
                }
            );
        } else {
            setError("Geolocalización no es soportada por este navegador.");
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        setLocation((prevState) => ({
            ...prevState,
            [name]: parseFloat(value)
        }));
    };

    return (
        <>
            <main className="flex items-center justify-center w-full main-component">
                <div className="flex flex-col items-center justify-center w-full gap-3 main-content">
                    <button className='flex items-center justify-center gap-2 p-2 text-black bg-white rounded-md'
                        onClick={handleClickLocation}
                    >
                        <BiLocationPlus className='text-3xl' />
                        Pulsar para obtener la ubicación actual
                    </button>

                    <div className="flex items-center justify-center gap-2">
                        <hr className='w-32 h-1' />
                        <span className='text-white'>o</span>
                        <hr className='w-32 h-1' />
                    </div>

                    <form className="flex flex-col w-[300px] gap-4 p-4 rounded-md">
                        <div className="flex flex-col">
                            <label htmlFor="longitud" className="mb-1 font-semibold text-[#eee]">Longitud</label>
                            <input
                                type="text"
                                id="longitud"
                                name='lon'
                                value={location.lon ? location.lon : ''}
                                onChange={handleChange}
                                className="p-2 text-black rounded-md"
                                placeholder="Introduce la longitud"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="latitud" className="mb-1 font-semibold text-[#eee]">Latitud</label>
                            <input
                                type="text"
                                id="latitud"
                                name='lat'
                                value={location.lat ? location.lat : ''}
                                onChange={handleChange}
                                className="p-2 text-black rounded-md"
                                placeholder="Introduce la latitud"
                                required
                            />
                        </div>

                        <button type="submit" className="p-2 mt-3 font-semibold text-black bg-white rounded-md">
                            Enviar
                        </button>
                    </form>

                    {/* {location.lat && location.lon ? (
                        <div className='flex flex-wrap gap-4 text-white'>
                            <p>Latitud: {location.lat}</p>
                            <p>Longitud: {location.lon}</p>
                        </div>
                    ) : ''} */}

                    <p></p>

                    {location.lat && location.lon && (
                        <div className="w-full h-[400px] flex flex-col justify-center items-center">
                            <p className='mb-4 text-xl font-bold'>Tus pantanos</p>
                            <MapContainer center={[location.lat, location.lon]} zoom={6} style={{ height: '100%', width: '90%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {pantanos.length > 0 ? (
                                    pantanos.map(pantano => (
                                        <Marker key={pantano.id} position={[parseFloat(pantano.x), parseFloat(pantano.y)]} />
                                    ))
                                ) : (
                                    <p className="text-white">No se encontraron pantanos cercanos.</p>
                                )}

                            </MapContainer>
                        </div>


                    )}


                    {loading ? (
                        <p className="text-white">Cargando pantanos cercanos...</p>
                    ) : (
                        <div className="flex flex-wrap items-center justify-center w-full gap-3 mt-8">
                            {pantanos.length > 0 ? (
                                pantanos.map(pantano => (
                                    <div key={pantano.codigo} className="flex flex-col items-center justify-center gap-3 p-3 text-black bg-white rounded-md bg-opacity-20 w-full max-w-[350px]">
                                        <h2 className='w-full font-bold text-center text-[#eee]'>{pantano.nombre}</h2>
                                        {
                                            pantano.provincia ?
                                                <div className="flex-col w-full p-2 text-center bg-white rounded-md">
                                                    <p className='font-semibold'>Provincia</p>
                                                    <span>{pantano.provincia}</span>
                                                </div> :
                                                ''
                                        }
                                        {
                                            console.log(getAguaMedia(pantano.codigo))
                                            
                                        }
                                        {
                                            pantano.provincia ?
                                                <div className="flex-col w-full p-2 text-center bg-white rounded-md">
                                                    <p className='font-semibold'>Agua Media </p>
                                                    <span>{JSON.stringify(getAguaMedia(pantano.codigo))}</span>
                                                </div> :
                                                ''
                                        }

                                        {/* <div className="flex-col w-full p-2 text-center bg-white rounded-md">
                                            <p className='font-semibold'>Agua Media</p>
                                            <span>{getAguaMedia(pantano.id)}</span>
                                        </div> */}

                                        {
                                            pantano.alt_cimien ?
                                                <div className="flex-col w-full p-2 text-center bg-white rounded-md">
                                                    <p className='font-semibold'>Altura Cimientos</p>
                                                    <span>{Math.round(pantano.alt_cimien)}</span>
                                                </div>
                                                : ''
                                        }

                                    </div>
                                ))
                            ) : (
                                <p className="text-white">No se encontraron pantanos cercanos.</p>
                            )}
                        </div>
                    )}




                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </main >
        </>
    );
}
