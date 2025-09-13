import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const getStartOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
};

const DashboardPage = () => {
  const navigate = useNavigate();

  // State for all app data and UI status
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the manual "Add Transaction" form
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  });

  
  const [dateRange, setDateRange] = useState({
    startDate: getStartOfMonth(),
    endDate: new Date().toISOString().slice(0, 10),
  });

  // State for the "Upload Receipt" feature
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // State for the Upload History bonus feature
  const [historyFile, setHistoryFile] = useState(null);
  const [historyUploading, setHistoryUploading] = useState(false);
  const [historyUploadError, setHistoryUploadError] = useState('');

  
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => { //fetching the data
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) navigate('/login');

    const fetchData = async () => {
      setLoading(true); 
      try {
        const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
        const response = await apiClient.get('/transactions', { params });
        setTransactions(response.data);
        processChartData(response.data);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if both dates in the range are selected
    if (dateRange.startDate && dateRange.endDate) fetchData();
    
  }, [navigate, dateRange.startDate, dateRange.endDate, refetchTrigger]);

  // Processes transaction data for the analytics chart
  const processChartData = (transactionsData) => {
    const allCategories = [...new Set(transactionsData.map(tx => tx.category))];
    const expenseTotals = transactionsData
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => ({ ...acc, [tx.category]: (acc[tx.category] || 0) + tx.amount }), {});
    const incomeTotals = transactionsData
      .filter(tx => tx.type === 'income')
      .reduce((acc, tx) => ({ ...acc, [tx.category]: (acc[tx.category] || 0) + tx.amount }), {});
    const expenseDataForChart = allCategories.map(category => expenseTotals[category] || 0);
    const incomeDataForChart = allCategories.map(category => incomeTotals[category] || 0);

    setChartData({
      labels: allCategories,
      datasets: [
        { label: 'Expenses', data: expenseDataForChart, backgroundColor: 'rgba(255, 99, 132, 0.7)' },
        { label: 'Income', data: incomeDataForChart, backgroundColor: 'rgba(75, 192, 192, 0.7)' }
      ]
    });
  };

  // --- HANDLER FUNCTIONS ---

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) return alert('Please fill all fields.');
    try {
        await apiClient.post('/transactions', form);
        setRefetchTrigger(prev => !prev); // Trigger a refetch
        setForm({ type: 'expense', amount: '', category: '', date: new Date().toISOString().slice(0, 10) });
    } catch (err) {
        alert('Failed to add transaction.');
    }
  };
  
  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile) return setUploadError('Please select a file.');
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('receipt', receiptFile);
    try {
      await apiClient.post('/receipts/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRefetchTrigger(prev => !prev); 
      setReceiptFile(null);
      document.getElementById('receipt-file-input').value = null;
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed.';
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleHistoryUpload = async (e) => {
    e.preventDefault();
    if (!historyFile) return setHistoryUploadError('Please select a file.');
    setHistoryUploading(true);
    setHistoryUploadError('');
    const formData = new FormData();
    formData.append('history', historyFile);
    try {
      await apiClient.post('/history/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRefetchTrigger(prev => !prev); 
      setHistoryFile(null);
      document.getElementById('history-file-input').value = null;
    } catch (err) {
      const message = err.response?.data?.message || 'History upload failed.';
      setHistoryUploadError(message);
    } finally {
      setHistoryUploading(false);
    }
  };

  // --- RENDER LOGIC ---

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1>Personal Finance Assistant</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>
      
      <main style={styles.mainContent}>
        <div style={styles.leftColumn}>
          {/* Card 1: Add Transaction */}
          <div style={styles.card}>
            <h2>Add Transaction</h2>
            <form onSubmit={handleFormSubmit}>
              <select name="type" value={form.type} onChange={handleFormChange} style={styles.input}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleFormChange} style={styles.input} required/>
              <input type="text" name="category" placeholder="Category (e.g., Food, Salary)" value={form.category} onChange={handleFormChange} style={styles.input} required/>
              <input type="date" name="date" value={form.date} onChange={handleFormChange} style={styles.input} required/>
              <button type="submit" style={styles.formButton}>Add Manually</button>
            </form>
          </div>

          {/* Card 2: Uploading Receipt */}
          <div style={styles.card}>
            <h2>Upload Receipt</h2>
            <form onSubmit={handleReceiptUpload}>
              <input 
                id="receipt-file-input"
                type="file" 
                onChange={(e) => setReceiptFile(e.target.files[0])} 
                style={styles.input} 
                accept="image/png, image/jpeg, application/pdf"
              />
              <button type="submit" style={styles.formButton} disabled={uploading}>
                {uploading ? 'Processing...' : 'Upload & Scan'}
              </button>
              {uploadError && <p style={{ color: 'red', marginTop: '10px' }}>{uploadError}</p>}
            </form>
          </div>

          {/* Card 3: History Upload Form (Bonus Feature) */}
          <div style={styles.card}>
            <h2>Upload Transaction History (PDF)</h2>
            <form onSubmit={handleHistoryUpload}>
              <input 
                id="history-file-input"
                type="file" 
                onChange={(e) => setHistoryFile(e.target.files[0])} 
                style={styles.input} 
                accept="application/pdf"
              />
              <button type="submit" style={styles.formButton} disabled={historyUploading}>
                {historyUploading ? 'Processing...' : 'Upload History'}
              </button>
              {historyUploadError && <p style={{ color: 'red', marginTop: '10px' }}>{historyUploadError}</p>}
            </form>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.card}>
            <h2>Analytics</h2>
            {chartData && chartData.labels.length > 0 ? (
              <Bar options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={chartData} />
            ) : (
              <p>No transaction data to display for the selected range.</p>
            )}
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div>
                <label htmlFor="startDate" style={{ marginRight: '0.5rem' }}>From:</label>
                <input id="startDate" type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} style={{...styles.input, marginBottom: 0, width: 'auto'}} />
              </div>
              <div>
                <label htmlFor="endDate" style={{ marginRight: '0.5rem' }}>To:</label>
                <input id="endDate" type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} style={{...styles.input, marginBottom: 0, width: 'auto'}} />
              </div>
            </div>

            <h2>Transactions</h2>
            <ul style={styles.transactionList}>
              {transactions.length > 0 ? (
                transactions.map(tx => (
                  <li key={tx._id} style={styles.transactionItem}>
                    <span style={styles.txCategory}>{tx.category}</span>
                    <span style={{ color: tx.type === 'expense' ? '#d9534f' : '#5cb85c', fontWeight: 'bold' }}>
                      {tx.type === 'expense' ? '-' : '+'}${tx.amount}
                    </span>
                  </li>
                ))
              ) : (
                <p>No transactions found for the selected date range.</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
    dashboardContainer: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    logoutButton: { padding: '0.6rem 1.2rem', cursor: 'pointer', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' },
    mainContent: { display: 'flex', flexWrap: 'wrap', padding: '2rem', gap: '2rem' },
    leftColumn: { flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' },
    rightColumn: { flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' },
    card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '1rem', fontSize: '14px' },
    formButton: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    transactionList: { listStyle: 'none', padding: 0, margin: 0 },
    transactionItem: { display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0.2rem', borderBottom: '1px solid #eee' },
    txCategory: { textTransform: 'capitalize' }
};

export default DashboardPage;