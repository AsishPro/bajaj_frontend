import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highestAlphabet', label: 'Highest Alphabet' },
];

function App() {
  useEffect(() => {
    document.title = "AP21110011239";
  }, []);

  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    try {
      console.log('JSON Input:', jsonData);

      const parsedData = JSON.parse(jsonData);
      console.log('Parsed Data:', parsedData);

      if (!parsedData || !parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON structure');
      }

      const res = await axios.post('https://bajaj-backend-dzok.onrender.com/bfhl', { data: parsedData.data });
      console.log('Response:', res.data);

      setResponse(res.data);
    } catch (error) {
      alert('Invalid JSON or request failed');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const selectedValues = selectedOptions.map((opt) => opt.value);
    return (
      <div>
        {selectedValues.includes('numbers') && (
          <div>
            <h2>Numbers</h2>
            <p>{response.numbers ? response.numbers.join(', ') : 'No numbers in response'}</p>
          </div>
        )}
        {selectedValues.includes('alphabets') && (
          <div>
            <h2>Alphabets</h2>
            <p>{response.alphabets ? response.alphabets.join(', ') : 'No alphabets in response'}</p>
          </div>
        )}
        {selectedValues.includes('highestAlphabet') && (
          <div>
            <h2>Highest Alphabet</h2>
            <p>{response.highest_alphabet ? response.highest_alphabet : 'No highest alphabet in response'}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          JSON Input:
        </label>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {loading && <p>Loading...</p>} {/* Show loading message while waiting */}

      {!loading && response && (
        <div>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className="dropdown"
          />
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
