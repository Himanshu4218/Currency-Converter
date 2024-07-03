import { MdOutlineStarBorder } from "react-icons/md";

const Dropdown = ({
  currencies,
  type,
  selectedCurrency,
  setSelectedCurrency,
  favorites,
  addToFavorites,
}) => {
  return (
    <div>
      <span className="text-gray-600">{type}:</span>
      <div className="relative">
        <select
          className="bg-gray-200 text-gray-900 font-medium w-full h-10 p-2 outline-none rounded-lg"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          {favorites?.map((currency) => {
            return (
              <option key={currency} value={currency}>
                {currency}
              </option>
            );
          })}
          {currencies?.map((currency) => {
            if (!favorites.includes(currency)) {
              return (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              );
            }
          })}
        </select>
        <span
          className={`${
            favorites.includes(selectedCurrency) ? "text-orange-400" : ""
          } absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer`}
          onClick={() => addToFavorites(selectedCurrency)}
        >
          <MdOutlineStarBorder />
        </span>
      </div>
    </div>
  );
};

export default Dropdown;
