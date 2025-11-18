// File: ui/script.js - Final Dynamic Logic and API Connection

const LOG_OUTPUT = document.getElementById('log-output');
const STATUS_INDICATOR = document.getElementById('status-indicator');
const SYSTEM_STATUS_TEXT = document.getElementById('system-status');
const RISK_HEADER = document.getElementById('risk-header').parentElement;
const APPROVE_BUTTON = document.getElementById('approve-btn');
const RECOMMENDATION_DETAILS = document.getElementById('recommendation-details');

// Ensure this matches the port our Python server is running on
const MOCK_API_BASE = 'http://127.0.0.1:5000/api'; 

// --- Global State ---
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


// --- Agent Orchestration Simulation (The Core Logic) ---

async function simulateAgentOrchestration() {
    appendLog('Agent Orchestration sequence initiated...', 'log-reflection');
    setCriticalState(false, 'Evaluating Risk');
    
    try {
        // 1. Digital Skill: Check Risk (Call to Mock API)
        const riskEndpoint = `${MOCK_API_BASE}/check_risk/Port X`;
        const riskResponse = await fetch(riskEndpoint).then(res => res.json());

        if (riskResponse.impact_detected) {
            setCriticalState(true, 'IMPACT CONFIRMED!');
            appendLog(riskResponse.message, 'log-critical', 30);
            appendLog(`Critical SKUs affected: ${riskResponse.impacted_skus.join(', ')}. Initiating mitigation scan.`, 'log-reflection');
            
            // 2. Digital Skill: Get Alternatives
            const alternativesEndpoint = `${MOCK_API_BASE}/get_alternatives/${riskResponse.impacted_skus[0]}`;
            const altResponse = await fetch(alternativesEndpoint).then(res => res.json());

            if (altResponse.options.length > 0) {
                appendLog('Successfully retrieved 3 alternative logistics quotes. LLM reflection imminent.', 'log-reflection');

                // 3. LLM Reflection (Mock Logic based on Knowledge Base)
                const bestOption = altResponse.options[0]; 
                
                // Display Main Recommendation
                RECOMMENDATION_DETAILS.innerHTML = `
                    <p>Status: <span style="color:var(--critical-red);">Mitigation Required</span></p>
                    <p><strong>Recommended Route:</strong> ${bestOption.route_name}</p>
                    <p>Lead Time: ${bestOption.lead_time_days} days</p>
                    <p>Cost Increase: ${bestOption.cost_increase_percent}%</p>
                `;

                // --- Populate Comparison Table (Wow Factor) ---
                const optionsTableBody = document.querySelector('#options-table tbody');
                optionsTableBody.innerHTML = ''; 
                
                altResponse.options.forEach((option, index) => {
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
                // --- End Table Population ---
                
                appendLog(`LLM recommends: ${bestOption.route_name}. Awaiting human authorization...`, 'log-critical');
                
                // Activate Wow Button
                APPROVE_BUTTON.removeAttribute('disabled');
            }

        } else {
            appendLog('Risk Check Complete. No critical risks detected at primary nodes.', 'log-success');
        }
    } catch (error) {
        console.error('Orchestration failed:', error);
        appendLog('FATAL ERROR: Could not connect to Digital Skills backend (CORS/Server down). Check CMD 1.', 'log-critical');
        setCriticalState(true, 'SYSTEM FAILURE');
    }
}


// --- Button Handler (Human Action) ---
APPROVE_BUTTON.addEventListener('click', async () => {
    if (APPROVE_BUTTON.hasAttribute('disabled')) return;
    
    setCriticalState(false, 'Executing Mitigation');
    APPROVE_BUTTON.setAttribute('disabled', true);
    RECOMMENDATION_DETAILS.innerHTML = '<p style="color:yellow;">Execution Order Sent to SCM System...</p>';
    
    appendLog('Human Authorization Received. Calling Execution API...', 'log-reflection');

    // 4. Digital Skill: Execute Change (Mock Call)
    const executeEndpoint = `${MOCK_API_BASE}/execute_change`;
    const executeData = {
        sku_id: 'CRIT-A101', 
        new_supplier_id: 'SUP003',
        route_name: 'Route B: Air Freight' 
    };

    const executeResponse = await fetch(executeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(executeData)
    }).then(res => res.json());

    if (executeResponse.status === 'SUCCESS') {
        RECOMMENDATION_DETAILS.innerHTML = '<p style="color:var(--success-green); font-weight:bold;">✅ Execution COMPLETE!</p>';
        appendLog(`Order ${executeResponse.order_id} executed successfully. Supply chain restored.`, 'log-success');
    } else {
        appendLog('Execution failed. Manual intervention required.', 'log-critical');
    }
    
    // Reset after demo
    setTimeout(() => {
        setCriticalState(false, 'Monitoring');
        RECOMMENDATION_DETAILS.innerHTML = '<p>System Reset Complete. Waiting for Critical Alert to Trigger Orchestration...</p>';
        simulateAgentOrchestration(); // Start the loop again
    }, 5000);
});


// --- Initialization ---
// Start the simulation flow instantly for the demo
simulateAgentOrchestration();