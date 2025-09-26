// Global variables
let fingerprintData = null;
let puzzleSolved = false;
let currentToken = '';
let puzzleState = [3, 1, 5, 2, 6, 4]; // Shuffled numbers
const targetState = [1, 2, 3, 4, 5, 6]; // Correct order

// Utility functions
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessages');
    const statusEl = document.createElement('div');
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
    statusDiv.appendChild(statusEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (statusEl.parentNode) {
            statusEl.remove();
        }
    }, 5000);
}

function updateStep(stepNum, state) {
    const step = document.getElementById(`step${stepNum}`);
    step.className = `step ${state}`;
}

// Main fingerprinting function
function startFingerprinting() {
    const token = document.getElementById('tokenInput').value.trim();
    
    if (!token) {
        showStatus('Por favor ingresa un token válido', 'error');
        return;
    }

    currentToken = token;
    showStatus('Iniciando proceso de fingerprinting...', 'info');
    
    // Load fingerprinting library dynamically
    const script = document.createElement('script');
    script.src = './lib/fingerprint.js';
    
    console.log('🔗 Cargando librería desde:', script.src);
    
    // Initialize with token after loading
    script.onload = () => {
        showStatus('✅ Librería cargada exitosamente', 'success');
        
        // Initialize fingerprinting with token
        if (window.__deviceFingerprint__) {
            window.__deviceFingerprint__({ key: 'DEMO', token: token });
        }
        
        setupEventListeners();
        initializePuzzle();
        updateStep(1, 'completed');
        updateStep(2, 'active');
    };
    

    
    script.onerror = () => {
        showStatus('❌ Error al cargar la librería de fingerprinting', 'error');
    };
    
    document.head.appendChild(script);
}

// Event listeners for fingerprinting
function setupEventListeners() {
    // Main result event
    window.addEventListener('fingerprintResult', (event) => {
        console.log('Fingerprint Result:', event.detail);
        fingerprintData = event.detail;
        
        if (event.detail.success) {
            showStatus('✅ Huella digital capturada exitosamente', 'success');
        } else {
            showStatus(`❌ Error en fingerprinting: ${event.detail.error}`, 'error');
        }
        
        checkCompletion();
    });

    // Success event
    window.addEventListener('fingerprintSuccess', (event) => {
        showStatus('🎉 Fingerprinting completado con éxito', 'success');
    });

    // Token error event
    window.addEventListener('fingerprintTokenError', (event) => {
        showStatus('🔑 Error de token: Token inválido o expirado', 'error');
    });

    // Network error event
    window.addEventListener('fingerprintNetworkError', (event) => {
        showStatus('🌐 Error de red: Verifica tu conexión a internet', 'error');
    });

    // HTTP error event
    window.addEventListener('fingerprintError', (event) => {
        showStatus(`⚠️ Error HTTP: ${event.detail.statusCode} - ${event.detail.message}`, 'error');
    });
}

// Puzzle functions
function initializePuzzle() {
    // Shuffle the numbers
    puzzleState = [...targetState].sort(() => Math.random() - 0.5);
    
    renderPuzzle();
    showStatus('🧩 Juego iniciado. ¡Arrastra para ordenar los números del 1 al 6!', 'info');
}

function renderPuzzle() {
    const puzzleDiv = document.getElementById('puzzle');
    puzzleDiv.innerHTML = '';
    
    puzzleState.forEach((num, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.textContent = num;
        piece.draggable = true;
        piece.dataset.index = index;
        piece.setAttribute('aria-label', `Número ${num}`);
        
        // Drag events
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragend', handleDragEnd);
        
        puzzleDiv.appendChild(piece);
    });

    checkPuzzleSolved();
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedElement !== e.target) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(e.target.dataset.index);
        
        // Swap elements
        [puzzleState[draggedIndex], puzzleState[targetIndex]] = [puzzleState[targetIndex], puzzleState[draggedIndex]];
        renderPuzzle();
    }
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    draggedElement = null;
}

function checkPuzzleSolved() {
    const solved = puzzleState.every((num, index) => num === targetState[index]);
    
    if (solved && !puzzleSolved) {
        puzzleSolved = true;
        document.getElementById('puzzleStatus').innerHTML = 
            '<div class="status success">🎉 ¡Números ordenados correctamente!</div>';
        
        updateStep(2, 'completed');
        updateStep(3, 'active');
        showStatus('🎯 ¡Excelente! Secuencia completada', 'success');
        checkCompletion();
    }
}

function checkCompletion() {
    if (puzzleSolved && fingerprintData) {
        document.getElementById('analyzeBtn').disabled = false;
        showStatus('✅ Todo listo para el análisis final', 'success');
    }
}

// Analysis function
async function analyzeFingerprint() {
    if (!fingerprintData || !puzzleSolved) {
        showStatus('❌ Completa todos los pasos antes de continuar', 'error');
        return;
    }

    const resultsDiv = document.getElementById('results');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // Update UI
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analizando...';
    resultsDiv.innerHTML = '<div class="status info">🔄 Enviando datos para análisis...</div>';

    try {
        // Prepare payload for analysis
        const payload = {
            token: currentToken,
            fingerprintData: fingerprintData,
            puzzleCompleted: true,
            completionTime: Date.now(),
            demoVersion: '1.0.0'
        };

        // Call analysis API
        console.log('📤 API Request:', {
            url: 'https://dev.idfactory.me/TransactionFraud/api/Analyze',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            }
        });
        
        const response = await fetch('https://dev.idfactory.me/TransactionFraud/api/Analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                key: 'DEMO',
                nonce: crypto.randomUUID(),
                signedTimestamp: Date.now().toString(),
                hash: btoa(JSON.stringify(fingerprintData)),
                fingerprintDataBase64: btoa(JSON.stringify(fingerprintData))
            })
        });
        
        console.log('📥 API Response Status:', response.status, response.statusText);
        console.log('📥 API Response Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const result = await response.json();
            console.log('✅ API Response Data:', result);
            
            resultsDiv.innerHTML = `
                <div class="status success">✅ Análisis completado exitosamente</div>
                <h4>📊 Resultado del Análisis:</h4>
                <div class="fingerprint-data">${JSON.stringify(result, null, 2)}</div>
                <p><strong>Tiempo de procesamiento:</strong> ${new Date().toLocaleTimeString()}</p>
            `;
            
            showStatus('🎉 Análisis completado con éxito', 'success');
        } else {
            const errorText = await response.text();
            console.error('❌ API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Analysis error:', error);
        
        resultsDiv.innerHTML = `
            <div class="status error">❌ Error en el análisis: ${error.message}</div>
            <h4>📋 Datos de Fingerprinting Capturados:</h4>
            <div class="fingerprint-data">${JSON.stringify(fingerprintData, null, 2)}</div>
            <p><em>Nota: Los datos fueron capturados correctamente, pero hubo un problema con el servicio de análisis.</em></p>
        `;
        
        showStatus(`❌ Error en análisis: ${error.message}`, 'error');
    } finally {
        // Reset button
        analyzeBtn.textContent = 'Análisis Completado';
        updateStep(3, 'completed');
    }
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('A3 Device Fingerprinting Demo loaded');
    showStatus('👋 Bienvenido al demo de A3 Device Fingerprinting', 'info');
});