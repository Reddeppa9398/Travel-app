import { useState ,useEffect} from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import "./App.css";

const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    description: "A timeless city of art, culture, food and unforgettable moments.",
    lat:48.8566,
    lon:2.3522,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    description: "A vibrant mix of tradition, technology, food and modern culture.",
    lat:35.6762,
    lon:139.6503,
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    description: "Tropical beaches, peaceful temples and beautiful island experiences.",
    lat:-8.4095,
    lon:115.1889,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Dubai",
    country: "UAE",
    description: "A futuristic destination filled with luxury, architecture and adventure.",
    lat:25.2048,
    lon:55.2708,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
];

function App() {
  const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
  const [search, setSearch] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
useEffect(() => {
  const location = selectedDestination || userLocation;

  if (!location) {
    setWeather(null);
    return;
  }

  setLoadingWeather(true);

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,wind_speed_10m` 
  ) 
    .then((response) => response.json()) 
    .then((data) => { 
      setWeather(data.current); 
      setLoadingWeather(false); 
    }) 
    .catch(() => { 
      setLoadingWeather(false); 
    }); 
}, [userLocation, selectedDestination]); 
const askAI = async () => { 
  if (!question.trim()) { 
    setAiResponse("Please enter a question."); 
    return; 
  } 
 
  setLoadingAI(true); 
  setAiResponse(""); 
 
  try { 
    const response = await ai.models.generateContent({ 
      model: "gemini-3.6-flash", 
      contents: question, 
    }); 
 
    setAiResponse(response.text); 
  } catch (error) { 
    console.error("Gemini API Error:", error); 
 
    if (error?.status === 429) { 
      setAiResponse( 
        "AI quota exceeded. Please wait for the quota to reset and try again." 
      ); 
    } else { 
      setAiResponse( 
        `AI Error: ${error.message || "Something went wrong."}` 
      ); 
    } 
  } finally { 
    setLoadingAI(false); 
  } 
 
}; 
  const filteredDestinations = destinations.filter((destination) => 
    `${destination.name} ${destination.country}` 
      .toLowerCase() 
      .includes(search.toLowerCase()) 
  ); 
 
  return ( 
    <div className="app"> 
      <nav className="navbar"> 
        <div className="logo">Wanderly</div> 
 
        <div className="nav-links"> 
          <a href="#destinations">Destinations</a> 
          <a href="#weather">Weather</a> 
          <a href="#assistant">AI Assistant</a> 
        </div> 
<button 
  className="location-btn" 
  onClick={() => { 
    if (!navigator.geolocation) { 
      setLocationError("Location is not supported by your browser."); 
      return; 
    } 
 
    navigator.geolocation.getCurrentPosition( 
      (position) => { 
  setSelectedDestination(null); 
 
  setUserLocation({ 
    lat: position.coords.latitude, 
    lon: position.coords.longitude, 
  }); 
 
  setLocationError(""); 
}, 
      () => { 
        setLocationError("Unable to get your location."); 
      } 
    ); 
  }} 
> 
  Use my location 
</button> 
{userLocation && ( 
  <p> 
    Your location: {userLocation.lat.toFixed(2)},{" "} 
    {userLocation.lon.toFixed(2)} 
  </p> 
)} 
 
{locationError && <p>{locationError}</p>} 
         
      </nav> 
 
      <main> 
        <section className="hero"> 
          <video 
            className="hero-video" 
            autoPlay 
            muted 
            loop 
            playsInline 
          > 
            <source 
              src="/video.mp4" 
              type="video/mp4"  
            /> 
          </video> 
 
          <div className="hero-overlay"></div> 
 
          <div className="hero-content"> 
            <p className="eyebrow">TRAVEL • DISCOVER • EXPERIENCE</p> 
 
            <h1> 
              Explore the world. 
              <br /> 
              Find your next story. 
            </h1> 
 
            <p className="hero-description"> 
              Discover inspiring destinations, real-time weather and places 
              worth experiencing. 
            </p> 
 
            <a href="#destinations" className="primary-btn"> 
              Explore destinations 
            </a> 
          </div> 
        </section> 
 
        <section className="destinations-section" id="destinations"> 
          <div className="section-heading"> 
            <div> 
              <p className="eyebrow dark">DISCOVER</p> 
              <h2>Where will you go next?</h2> 
            </div> 
 
            <p> 
              Search through our hand-picked destinations and start planning 
              your next adventure. 
            </p> 
          </div> 
 
          <div className="search-box"> 
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            /> 
          </div> 
 
          <div className="destination-grid"> 
            {filteredDestinations.length > 0 ? ( 
              filteredDestinations.map((destination) => ( 
                <article className="destination-card" key={destination.id}> 
                  <img 
                    src={destination.image} 
                    alt={`${destination.name}, ${destination.country}`} 
                  /> 
 
                  <div className="card-content"> 
                    <p className="country">{destination.country}</p> 
                    <h3>{destination.name}</h3> 
                    <p>{destination.description}</p> 
 
                   <button 
                className="explore-btn" 
                   onClick={() => { 
                    setSelectedDestination(destination); 
                    setUserLocation(null); 
                    }} 
                      > 
                         Explore → 
                        </button> 
                  </div> 
                </article> 
              )) 
            ) : ( 
              <div className="empty-state"> 
                <h3>No destinations found</h3> 
                <p>Try searching for another destination.</p> 
              </div> 
            )} 
          </div> 
        </section> 
 
        <section className="feature-section" id="weather"> 
  <div> 
    <p className="eyebrow dark">REAL-TIME WEATHER</p> 
    <h2>Know before you go.</h2> 
    <p> 
      Check live weather conditions for the destination you are 
      planning to visit. 
    </p> 
  </div> 
 
  <div className="feature-card"> 
  <span>☀️</span> 
  <h3>Live Weather</h3> 
 
{!userLocation && !selectedDestination ? ( 
  <p>Select a destination or use your location to see weather information.</p> 
) : loadingWeather ? ( 
  <p>Loading weather...</p> 
) : weather ? ( 
  <> 
    <p> 
      Weather for{" "} 
      {userLocation ? "your location" : selectedDestination.name} 
    </p> 
    <p>🌡️ Temperature: {weather.temperature_2m}°C</p> 
    <p>💨 Wind Speed: {weather.wind_speed_10m} km/h</p> 
    <p>☁️ Weather Code: {weather.weather_code}</p> 
  </> 
) : ( 
  <p>Unable to load weather information.</p> 
)} 
</div> 
</section> 
 
        <section className="feature-section assistant-section" id="assistant"> 
          <div> 
            <p className="eyebrow dark">AI TRAVEL ASSISTANT</p> 
            <h2>Plan your journey with AI.</h2> 
            <p> 
              Ask questions about destinations, places to visit and the best 
              time to travel. 
            </p> 
          </div> 
 
          <div className="feature-card"> 
            <span>✦</span> 
            <h3>Your AI travel companion</h3> 
            
            <input 
  type="text" 
  placeholder="Ask me about your trip..." 
  value={question} 
  onChange={(e) => setQuestion(e.target.value)} 
/> 
 {aiResponse && ( 
  <div className="ai-response"> 
    <ReactMarkdown>{aiResponse}</ReactMarkdown> 
  </div> 
)} 
          <button 
  className="primary-btn small" 
  onClick={askAI} 
> 
  {loadingAI ? "Planning..." : "Start planning"} 
</button> 
          </div> 
        </section> 
      </main> 
 
      <footer> 
        <div className="logo">Wanderly</div> 
        <p>Discover more. Travel further.</p> 
      </footer> 
    </div> 
  ); 
} 
 
export default App; 
 
