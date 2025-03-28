// import axios, { AxiosResponse } from 'axios';
import { FormData } from './types';


// const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // Replace with your actual API base URL
const API_BASE_URL = "http://localhost:4000/api"; // local url for frontend


export async function generateRoadmap(formData: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // ✅ Parse JSON response
      console.log("Roadmap:", data.roadmap); // ✅ Now this will log correctly
      window.localStorage.setItem("roadmap", JSON.stringify(data.roadmap));
      return data; // ✅ Return data for further use
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    }
  }
  

