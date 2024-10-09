// src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

export const initializeDB = () => axios.get(`${API_URL}/initialize`);

export const getTransactions = (month, page = 1, perPage = 10, search = '') =>
  axios.get(API_URL, { params: { month, page, perPage, search } });

export const getStatistics = (month) => axios.get(`${API_URL}/statistics`, { params: { month } });

export const getBarChartData = (month) => axios.get(`${API_URL}/bar-chart`, { params: { month } });

export const getPieChartData = (month) => axios.get(`${API_URL}/pie-chart`, { params: { month } });

export const getCombinedData = (month) => axios.get(`${API_URL}/combined`, { params: { month } });
