import { useCallback, useEffect, useState } from "react";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import Dropdown from "./Dropdown";

const Converter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currencyFrom, setCurrencyFrom] = useState("INR");
  const [currencyTo, setCurrencyTo] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [amount, setAmount] = useState("");

  const fetchCurrencies = useCallback(async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      if (!res.ok) {
        throw new Error("Failed to fetch currencies");
      }
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!amount) return;
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currencyFrom}&to=${currencyTo}`
      );
      if (!res.ok) {
        throw new Error(
          `Failed to convert from ${currencyFrom} to ${currencyTo}`
        );
      }
      const result = await res.json();
      let ans = result.amount * result.rates[currencyTo];
      ans = ans.toFixed(2);
      ans = `${ans} ${Object.keys(result.rates)[0]}`;
      setConvertedAmount(ans);
    } catch (error) {
      console.error(error);
    }
  }, [currencyFrom, currencyTo, amount, setConvertedAmount]);

  const addToFavorites = useCallback(
    (currency) => {
      if (favorites.includes(currency)) {
        let newFav = favorites.filter((fav) => fav !== currency);
        setFavorites(newFav);
        return;
      }
      setFavorites((prev) => [...prev, currency]);
    },
    [favorites, setFavorites]
  );

  const handleSwap = useCallback(() => {
    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
  }, [currencyFrom, currencyTo]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <div className="max-w-xl mx-auto bg-white p-5 shadow rounded-lg">
      <h1 className="text-gray-600 text-2xl font-bold">Currency Converter</h1>
      <div className="grid grid-cols-3 my-4">
        <Dropdown
          currencies={currencies}
          type="From"
          selectedCurrency={currencyFrom}
          setSelectedCurrency={setCurrencyFrom}
          favorites={favorites}
          addToFavorites={addToFavorites}
        />
        <div className="relative">
          <HiOutlineArrowsRightLeft
            className="absolute left-1/2 bottom-1 -translate-x-1/2 h-8 w-8 p-1 cursor-pointer rounded-full bg-gray-200"
            onClick={handleSwap}
          />
        </div>
        <Dropdown
          currencies={currencies}
          type="To"
          selectedCurrency={currencyTo}
          setSelectedCurrency={setCurrencyTo}
          favorites={favorites}
          addToFavorites={addToFavorites}
        />
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <span className="self-start text-gray-600">Amount:</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-10 border border-gray-300 p-2 text-gray-900 rounded-lg outline-none"
        />
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={handleConvert}
          className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Convert
        </button>
        {convertedAmount && (
          <div className="self-end text-red-600">
            Converted Amount: {convertedAmount} {}
          </div>
        )}
      </div>
    </div>
  );
};

export default Converter;
