import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState(null);
  const [index, setIndex] = useState('');

  const fetchSeenIndexes = async () => {
    try {
      const result = await axios.get('/api/values/all');
      console.log('fetchSeenIndexes', result);
      setSeenIndexes(result.data);
    } catch (error) {
      console.error(error)
    }
  };

  const fetchValues = async () => {
    try {
      const result = await axios.get('/api/values/current');
      console.log('fetchValues', result);
      setValues(result.data);
    } catch (error) {
      console.error(error)
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post('/api/values', {
        index
      });
  
      if (result.data.working) {
        setIndex('');
        await fetchSeenIndexes()
        await fetchValues();
      } else {
        throw new Error('Error when posted new index');
      }
    } catch (error) {
      console.error(error)
    }
    
  };

  useEffect(() => {
    fetchSeenIndexes();
  }, []);

  useEffect(() => {
    fetchValues();
  }, [])

 

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
