import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    setIsCopied(false); // Reset copied state when password changes
  }, [length, numberAllowed, charAllowed, setPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard
      .writeText(password)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy password: ", err);
      });
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <div className="w-full max-w-md mx-auto shadow-lg rounded-lg px-6 py-6 my-8 bg-gradient-to-br from-purple-700 to-indigo-800 text-white">
      <h1 className="text-center my-4 text-3xl font-bold">
        Password Generator
      </h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-6">
        <input
          type="text"
          value={password}
          className="outline-none w-full py-3 px-4 bg-white/10 backdrop-blur-sm placeholder-gray-300 text-white"
          placeholder="Generate Password"
          readOnly
          ref={passwordRef}
        />
        <button
          onClick={copyPasswordToClipboard}
          className={`outline-none ${
            isCopied ? "bg-green-500" : "bg-pink-500"
          } text-white px-6 py-3 shrink-0 hover:bg-pink-600 transition-colors`}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="flex items-center justify-between">
          <label htmlFor="lengthRange" className="text-sm text-gray-200">
            Length: {length}
          </label>
          <input
            type="range"
            min={6}
            max={100}
            value={length}
            id="lengthRange"
            className="cursor-pointer w-48 accent-pink-500"
            onChange={(e) => {
              setLength(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-x-3">
          <input
            type="checkbox"
            checked={numberAllowed}
            id="numberInput"
            onChange={() => {
              setNumberAllowed((prev) => !prev);
            }}
            className="form-checkbox h-5 w-5 text-pink-500 rounded focus:ring-pink-500"
          />
          <label htmlFor="numberInput" className="text-sm text-gray-200">
            Include Numbers
          </label>
        </div>
        <div className="flex items-center gap-x-3">
          <input
            type="checkbox"
            checked={charAllowed}
            id="characterInput"
            onChange={() => {
              setCharAllowed((prev) => !prev);
            }}
            className="form-checkbox h-5 w-5 text-pink-500 rounded focus:ring-pink-500"
          />
          <label htmlFor="characterInput" className="text-sm text-gray-200">
            Include Special Characters
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
