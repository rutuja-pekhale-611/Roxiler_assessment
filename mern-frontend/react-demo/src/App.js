/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
// App.js
/*import React, { useState } from 'react';
import monthSelector from './components/monthSelector';
import TransactionsTable from './components/TransactionTable';
import TransactionStatistics from './components/TransactionStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';
import piechart from './components/piechart';
import barChart from './components/barCharts';

function App() { 
  const [month, setMonth] = useState(3);  // Default to March
  const [searchText, setSearchText] = useState('');

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <MonthSelector selectedMonth={month} onChange={handleMonthChange} />

      <input
        type="text"
        placeholder="Search transactions"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <TransactionsTable month={month} searchText={searchText} />
      <TransactionsStatistics month={month} />
      <TransactionsBarChart month={month} />
    </div>
  );
}

export default App;
*/
// src/App.js

import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import TransactionStatistics from './components/TransactionStatistics';
import BarChart from './components/barChart';
import PieChart from './components/piechart';

const App = () => {
  const [month, setMonth] = useState('03'); // Default to March

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <label>Select Month: </label>
      <select value={month} onChange={handleMonthChange}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      <TransactionStatistics month={month} />
      <TransactionsTable month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default App;
