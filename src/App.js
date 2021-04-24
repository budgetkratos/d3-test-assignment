import React, { useEffect, useState } from 'react'
import './App.css';
import Chart from './features/Multiples/Chart';
import * as d3 from 'd3';
import inputData from './features/Multiples/data/Multiples.csv';



function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv(inputData).then((inputData) => {
        setData([...inputData])
    });
}, []);

// Group data into map of maps
const groupByCategory = d3.group(data, d => d.Category);
const groupByDistrict = d3.group(data, d => d.District);

// Define carrier of data for sum of individual row values
let rowValues = [];

// Reduce group entries to a sum of each row, then push name of the row and its
// sum to ''rowValues'' array
groupByCategory.forEach((entries, i) => {
  const rowSum = entries.reduce((a, row) => {
    const rowValue = parseInt(row['This Year Sales'].substring(1));
    return a + rowValue;
  }, 0);

  rowValues.push({
    name: entries[0].Category,
    value: rowSum,
  });
});
const rowNameOrder = [];

// Sort array from min to max value in order to get a blueprint how the standard
// chart data object will look like, then push row names to new array
// eslint-disable-next-line array-callback-return
rowValues.sort((a, b) =>  b.value - a.value).map(entry => {
  rowNameOrder.push(entry.name);
});

// Sort the order of rows in the map object
groupByDistrict.forEach(entry => {
  entry.sort(function(a, b) {
    return rowNameOrder.indexOf(a.Category) - rowNameOrder.indexOf(b.Category);
  });
})

  return (
    <div className="Container">
      {Array.from(groupByDistrict).map((entry) => {
        return <Chart key={entry[0]} data={entry[1]} title={entry[0]}/>
      })}
    </div>
  );
}

export default App;
