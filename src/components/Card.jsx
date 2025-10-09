import { BiRefresh } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";

function LocationCard({ card, refreshCard, deleteCard }) {
  const { id, zip, country, details, loading, error } = card;

  return (
    <div className="bg-white  rounded-lg shadow-md p-4 relative  hover:bg-blue-100">
      <div className=" absolute top-3 right-3 flex items-center justify-center ">
        <button
          onClick={() => deleteCard(id)}
          className="p-1  rounded-md bg-gray-200 hover:bg-red-200"
          title="Delete"
          disabled={loading}
        >
          <FiTrash2 className="w-6 h-5 text-gray-800 " />
        </button>
      </div>

      <div className="mb-2 text-sm font-medium text-gray-700">
        ZIP: {zip} - {country.toUpperCase()} (India)
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium  mb-2">{error}</div>
      )}

      {details && !loading ? (
        <div>
          <h3 className="text-lg text-gray-800 font-bold mb-2 text-center">
            {details.cityName}
          </h3>

          <div className="text-gray-700  space-y-2">
            <div>
              <strong>Temperature:</strong> {details.temp}°C
            </div>
            <div>
              <strong>Feels Like:</strong> {details.feelsLike}°C
            </div>
            <div>
              <strong>Condition:</strong> {details.weather} (
              {details.weatherDescription})
            </div>
            <div>
              <strong>Humidity:</strong> {details.humidity}%
            </div>
          </div>
        </div>
      ) : (
        !error && (
          <div className="text-lg font-medium text-gray-700 flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )
      )}
      <div className="mt-8">
        <div className=" absolute bottom-3 right-3 flex items-center justify-center ">
          {!loading && !error && (
            <p className=" mr-1 text-sm font-medium text-gray-500">
              Last updated: {details.lastUpdated}
            </p>
          )}

          <button
            onClick={() => refreshCard(card)}
            className="p-1  rounded-md bg-gray-200 hover:bg-green-200"
            title="Refresh"
            disabled={loading}
          >
            <BiRefresh
              className={`w-6 h-6 text-gray-800 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
