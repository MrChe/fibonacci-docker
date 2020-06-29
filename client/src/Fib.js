import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState(null);
  const [index, setIndex] = useState('');

  const fetchSeenIndexes = async () => {
    const result = await axios.get('/api/values/all');
    console.log('fetchSeenIndexes', result);
    setSeenIndexes(result.data);
  };

  const fetchValues = async () => {
    const result = await axios.get('/api/values/current');
    console.log('fetchValues', result);
    setValues(result.data);
  };

  useEffect(() => {
    fetchSeenIndexes();
  }, []);

  useEffect(() => {
    fetchValues();
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/values', {
      index
    });

    const newSeenIndexes = await axios.get('/api/values/all');
    setSeenIndexes(newSeenIndexes.data);
    const newValues = await axios.get('/api/values/current');
    setValues(newValues.data);
  };

  const renderSeenIndexes = () => {
    console.log('renderSeenIndexes', seenIndexes);
    return seenIndexes && seenIndexes.map(({ number }) => number).join(', ');
  }

  const renderValues = () => {
    return values && Object.keys(values).map((item, key) => {
      return (
        <div key={key}>
          For index {item} I calculated {values[item]}
        </div>
      )
    })
  }

  const onChange = (event) => {
    setIndex(event.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={onChange}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
}

export default Fib;
