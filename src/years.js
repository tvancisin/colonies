// src/selectedYearsStore.js
import { writable } from 'svelte/store';

// Create a writable store to hold the selected years
export const selectedYearsStore = writable([]);