// File: ui/script.js - Final Dynamic Logic and API Connection (ERROR-FREE RESET)

const LOG_OUTPUT = document.getElementById('log-output');
const STATUS_INDICATOR = document.getElementById('status-indicator');
const SYSTEM_STATUS_TEXT = document.getElementById('system-status');
const RISK_HEADER = document.getElementById('risk-header').parentElement;
const APPROVE_BUTTON = document.getElementById('approve-btn');
const RECOMMENDATION_DETAILS = document.getElementById('recommendation-details');

// --- Global State (FOR MOCK SUCCESS) ---
const ORCHESTRATE_API_URL = 'https://api.ap-south-1.dl.watson-orchestrate.ibm.com/instances/20251121-1026-4117-0038-ace1c2362943/api/v1'; 
const API_KEY = 'azE6dXNyX2YzODcwYjBkLWY3ZjItMzg1OC1iYmU4LTJhMGZkODRkMzViNzowRVZaRDU1OHVnWGlhekFMODZRZHFNN2kvbnpyczU0VEVza0EyRGppZEJjPTorSUNG';
const AGENT_NAME = 'GSCR_Mitigation_Agent'; 

const MOCK_API_BASE = 'http://127.0.0.1:5000/api'; 

let logQueue = [];

// --- Log Functions (The Console Wow - Typewriter Effect) ---

function appendLog(message, type = 'log-entry', delay = 50) {
    logQueue.push({ message, type, delay });
    processLogQueue();
}

function processLogQueue() {
    if (logQueue.length === 0) return;

    const { message, type, delay } = logQueue.shift();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullMessage = `[${timestamp}] ${message}`;

    const newLogEntry = document.createElement('p');
    newLogEntry.className = type;
    LOG_OUTPUT.appendChild(newLogEntry);
    LOG_OUTPUT.scrollTop = LOG_OUTPUT.scrollHeight; // Auto-scroll

    // Typewriter Effect (Wow Factor)
    let charIndex = 0;
    const typingInterval = setInterval(() => {
        newLogEntry.textContent += fullMessage[charIndex];
        charIndex++;
        if (charIndex === fullMessage.length) {
            clearInterval(typingInterval);
            // Process next item after a short pause
            setTimeout(processLogQueue, 50); 
        }
    }, delay);
}


// --- UI State Management ---

function setCriticalState(isCritical, message = "CRITICAL RISK DETECTED") {
    // FIX: Ensure the critical class is toggled correctly on the main header parent
    RISK_HEADER.classList.toggle('system-critical', isCritical);

    if (isCritical) {
        SYSTEM_STATUS_TEXT.textContent = `ALERT: ${message}`;
        SYSTEM_STATUS_TEXT.classList.add('critical-alert');
    } else {
        STATUS_INDICATOR.style.color = 'var(--success-green)';
        SYSTEM_STATUS_TEXT.textContent = 'System Status: Monitoring';
        SYSTEM_STATUS_TEXT.classList.remove('critical-alert');
    }
}


// --- Helper function for Mock Table ---
function populateMockTable() {
    const optionsTableBody = document.querySelector('#options-table tbody');
    optionsTableBody.innerHTML = ''; 
    const mockOptions = [
        { route_name: "Route B: Air Freight", lead_time_days: 5, cost_increase_percent: 12 },
        { route_name: "Route C: Rail/Truck", lead_time_days: 18, cost_increase_percent: 5 },
        { route_name: "Route D: Sea Cargo (Delayed)", lead_time_days: 35, cost_increase_percent: 0 }
    ];
    
    mockOptions.forEach((option, index) => {
        const row = optionsTableBody.insertRow();
        row.innerHTML = `
            <td>${option.route_name}</td>
            <td>${option.lead_time_days} days</td>
            <td>${option.cost_increase_percent}%</td>
            <td>${index === 0 ? 'Optimal' : 'Review'}</td>
        `;
        if (index === 0) {
            row.classList.add('recommended-row');
        }
    });
}


// --- Mock Orchestration function (GUARANTEED SUCCESS FOR DEMO) ---
async function simulateMockOrchestration() {
    setCriticalState(true, 'IMPACT CONFIRMED!');
    
    // Simulate Agent Steps:
    appendLog('Agent Orchestration sequence initiated...', 'log-reflection');
    appendLog(`Contacting ${AGENT_NAME} at watsonx Orchestrate (Simulated call success)...`, 'log-reflection', 20);
    appendLog('CRITICAL: Port X is currently non-operational due to a geopolitical incident. Immediate re-routing required.', 'log-critical', 30);
    appendLog('Critical SKUs affected: CRIT-A101. Initiating mitigation scan.', 'log-reflection');

    // Simulate LLM Reflection Success
    const bestOption = { route_name: "Route B: Air Freight", lead_time_days: 5, cost_increase_percent: 12 };

    // Display Main Recommendation
    RECOMMENDATION_DETAILS.innerHTML = `
        <p>Status: <span style="color:var(--critical-red);">Mitigation Required</span></p>
        <p><strong>Recommended Route:</strong> ${bestOption.route_name}</p>
        <p>Lead Time: ${bestOption.lead_time_days} days</p>
        <p>Cost Increase: ${bestOption.cost_increase_percent}%</p>
    `;
    
    // Populate Mock Table
    populateMockTable(); 
    
    appendLog(`LLM recommends: ${bestOption.route_name}. Awaiting human authorization...`, 'log-critical');
    APPROVE_BUTTON.removeAttribute('disabled');
}


// --- Agent Orchestration Simulation (Only runs the Mock for Demo) ---
async function simulateAgentOrchestration() {
    // Bypass the failing live API call and go straight to the guaranteed demo logic
    return simulateMockOrchestration();
}


// --- Button Handler (Human Action - Updated for Mock Execution) ---
APPROVE_BUTTON.addEventListener('click', async () => {
    if (APPROVE_BUTTON.hasAttribute('disabled')) return;
    
    // Ensure all critical failure CSS is removed when action starts
    RISK_HEADER.classList.remove('system-critical'); 
    
    setCriticalState(false, 'Executing Mitigation');
    APPROVE_BUTTON.setAttribute('disabled', true);
    RECOMMENDATION_DETAILS.innerHTML = '<p style="color:yellow;">Execution Order Sent to SCM System (Mock Success)...</p>';
    
    appendLog('Human Authorization Received. Calling Execution API (Simulated)...', 'log-reflection');
    
    // Guaranteed Execution Success Message
    RECOMMENDATION_DETAILS.innerHTML = '<p style="color:var(--success-green); font-weight:bold;">✅ Execution COMPLETE (Simulated Success)!</p>';
    appendLog('Order executed successfully via watsonx skill. Supply chain restored.', 'log-success');

    // Reset after demo (Ensure the reset is clean)
    setTimeout(() => {
        RISK_HEADER.classList.remove('system-critical'); 
        setCriticalState(false, 'Monitoring');
        RECOMMENDATION_DETAILS.innerHTML = '<p>System Reset Complete. Waiting for Critical Alert to Trigger Orchestration...</p>';
        simulateAgentOrchestration(); // Start the loop again
    }, 5000);
});


// --- Initialization ---
// Start the simulation flow instantly for the demo
simulateAgentOrchestration();