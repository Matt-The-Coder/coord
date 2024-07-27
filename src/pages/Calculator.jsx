import { useEffect, useRef, useState } from "react"
import axios from 'axios'
import Map from 'react-map-gl';
import Mapbox from 'mapbox-gl'
const Calculator = () => {

    const server = import.meta.env.VITE_SERVER
    const map = useRef()
    const  mapContainer = useRef()
    const [isSaved, setIsSaved] = useState(false)
    const [latitude, setLatitude] = useState('27.964157')
    const [longitude, setLongitude] = useState('-82.452606')
    const [zoom, setZoom] = useState(11)
    const [latitudeData, setLatitudeData] = useState({
        latDegrees: 0,
        latMinutes: 0,
        latSeconds: 0
    })
    const [longitudeData, setLongitudeData] = useState({
        longDegrees: 0,
        longMinutes: 0,
        longSeconds: 0
    })

    const setupMap = (lat, lng) => {
        Mapbox.accessToken = 'pk.eyJ1Ijoibm9haGtseWRlMTciLCJhIjoiY2xvaHluYnE2MDdnODJpbzV2MDB3aG5pMiJ9.doCuGnlTGiK8h44qAgBo6A';
            map.current = new Mapbox.Map({
            container: mapContainer.current,
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: 13
        });

    }
    useEffect(()=>{
        setupMap(latitude, longitude)

    },[])
    const calculate = (e) => {
        e.preventDefault()
        const latDegrees = latitude
        const longDegrees = longitude
        const latMinutes = latDegrees * 60
        const longMinutes = longDegrees * 60
        const latSeconds = latMinutes * 60
        const longSeconds = longMinutes * 60

        setLatitudeData({
            latDegrees: Math.round(latDegrees),
            latMinutes: Math.round(latMinutes.toFixed(4)),
            latSeconds: latSeconds.toFixed(4)
        })
        setLongitudeData({
            longDegrees: longDegrees,
            longMinutes: longMinutes.toFixed(4),
            longSeconds: longSeconds.toFixed(4)
        })
        
        map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            screenSpeed: 2, // pixels/second
            maxDuration: 5000 // milliseconds
        })
        map.current.Marker().setLngLat([longitude, latitude]).addTo(mapContainer.current)
    }

    const saveData = async () => {

        try {
            setIsSaved(true)
            const data = await axios.post(`${server}/insertData`,{
                lat: latitude,
                lng: longitude
            }) 
            const result = data.data
            console.log(result)
            setTimeout(()=>{
                setIsSaved(false)
            },700)
    
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className="h-lvh w-lvw flex items-center justify-around">

                <div className="box h-auto w-[26rem] bg-neutral-200 rounded-lg p-10">
                    <form onSubmit={(e) => { calculate(e) }} className="flex flex-col gap-3 ">
                        <h1 className="text-center text-3xl font-semibold">Decimal Degrees to Degrees Minutes Seconds</h1>
                        <input type="number" step="0.000001" min="-90" max="90" required
                            onChange={(e) => { setLatitude(e.currentTarget.value) }}
                            className="py-2 px-4 bg-white rounded-lg" placeholder="Enter Latitude" />
                        <input type="number" step="0.000001" min="-180" max="180" required
                            onChange={(e) => { setLongitude(e.currentTarget.value) }}
                            className="py-2 px-4 bg-white rounded-lg" placeholder="Enter Longitude" />
                        <div className="flex justify-around relative">
                            <button type="submit" className="py-2 px-4 bg-white rounded-lg">Convert Coords</button>
                            <button type="button" className="py-2 px-4 bg-white rounded-lg" onClick={saveData}>Save
                            
                            </button>
                            {isSaved && 
                            <svg className="text-white h-10 w-10 absolute right-[-1rem]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#06D001"></path> </g></svg>}
                            
                        </div>

                    </form>

                    <div className="flex py-10 gap-2">
                        <div className="sec1 h-auto w-1/2 border px-3 rounded-sm bg-white">
                            <h1 className="text-center text-xl font-semibold mb-1">Latitude</h1>
                            <h1 className="font-semibold text-center">Degrees</h1>
                            <p>{latitudeData?.latDegrees}°</p>
                            <h1 className="font-semibold text-center">Minutes</h1>
                            <p>{latitudeData.latMinutes} minutes</p>
                            <h1 className="font-semibold text-center">Seconds</h1>
                            <p>{latitudeData.latSeconds} seconds</p>
                        </div>
                        <div className="sec2 h-auto w-1/2 border px-3 rounded-sm bg-white">
                            <h1 className="text-center text-xl font-semibold mb-1">Longitude</h1>
                            <h1 className="font-semibold text-center">Degrees</h1>
                            <p>{longitudeData.longDegrees}°</p>
                            <h1 className="font-semibold text-center">Minutes</h1>
                            <p>{longitudeData.longMinutes} minutes</p>
                            <h1 className="font-semibold text-center">Seconds</h1>
                            <p>{longitudeData.longSeconds} seconds</p>
                        </div>
                    </div>


                </div>
                <div className="google-map h-96 w-96" ref={mapContainer}>
                </div>
            </div>
        </>
    )
}

export default Calculator