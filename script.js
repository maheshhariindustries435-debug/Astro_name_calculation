// Character mapping from the original Java program
const charMap = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 8, 'g': 3, 'h': 5,
    'i': 1, 'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 7, 'p': 8,
    'q': 1, 'r': 2, 's': 3, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 5,
    'y': 1, 'z': 7
};

// Tamil meanings for numerology numbers
const tamilMeanings = {
    1: "தலைவர் - சுயாதீனம், மு ambitious, தீர்மானம்",
    2: "ஊடகர் - நயம், ஒத்துழைப்பு, உணர்ச்சிமயம்",
    3: "தொடர்பாளர் - படைப்பு, வெளிப்பாடு, சமூகம்",
    4: "கட்டுமானக்காரர் - நடைமுறை, நம்பகம், உழைப்பாளி",
    5: "சாகசக்காரர் - பன்முகம், ஆர்வம், சுதந்திரம்-காதல்",
    6: "பராமரிப்பாளர் - பொறுப்பு, காதல், இசைவு",
    7: "தேடுபவர் - பகுப்பாய்வு, ஆன்மீகம், உள்ளார்ந்த",
    8: "சாதனையாளர் - மு ambitious, சக்தி, இலக்கு நோக்கம்",
    9: "மனிதநேயவாதி - இரக்கம், தாராளம், ஆதர்ஷம்"
};

// Sample names database for demonstration (in a real app, this would come from document parsing)
const sampleNames = [
    "அருண்", "பாலாஜி", "சித்ரா", "தினேஷ்", "எழில்", "பிரகாஷ்", "கிருஷ்ணா", "லக்ஷ்மி",
    "மாதவன்", "நித்யா", "ஒளி", "பிரியா", "ராஜ்", "சுஜாதா", "தர்ஷன்", "உமா",
    "விஜய்", "சுரேஷ்", "ஆனந்த்", "பாரதி", "கார்த்தி", "லீலா", "மோகன்", "நவீன்",
    "ஐஸ்வர்யா", "ராகுல்", "சந்தோஷ்", "தேஜஸ்வி", "உஜ்ஜ瓦ல்", "வாஸ்", "ஆதித்யா", "பவித்ரா"
];

// DOM elements
const nameForm = document.getElementById('nameForm');
const userNameInput = document.getElementById('userName');
const resultContainer = document.getElementById('result');

// Document analysis elements
const documentForm = document.getElementById('documentForm');
const documentFileInput = document.getElementById('documentFile');
const targetNumberInput = document.getElementById('targetNumber');
const documentResultContainer = document.getElementById('documentResult');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Add event listener to form
nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateNumerology(userNameInput.value.trim());
});

// Add event listener to document form
documentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    analyzeDocument(documentFileInput.files[0], targetNumberInput.value);
});

// Add event listeners to tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // If history tab is clicked, load history
        if (tabId === 'history') {
            loadHistory();
        }
    });
});

// Calculate numerology for the given name
function calculateNumerology(name) {
    // Clear previous results
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('visible');
    
    // Validate input
    if (!name) {
        showError('ஒரு பெயரை உள்ளிடவும்', resultContainer);
        return;
    }
    
    // Convert to lowercase
    const lowerName = name.toLowerCase();
    
    // Check for invalid characters
    const validChars = /^[a-z\s]+$/;
    if (!validChars.test(lowerName)) {
        showError('பெயரில் எழுத்துகள் மற்றும் இடைவெளிகள் மட்டுமே இருக்க வேண்டும்', resultContainer);
        return;
    }
    
    // Remove spaces and convert to array of characters
    const cleanName = lowerName.replace(/\s+/g, '');
    const nameChars = cleanName.split('');
    
    // Map characters to numbers
    const mappedValues = [];
    for (let char of nameChars) {
        if (charMap[char]) {
            mappedValues.push(charMap[char]);
        } else {
            showError(`தவறான எழுத்து: ${char}`, resultContainer);
            return;
        }
    }
    
    // Display results
    displayResults(mappedValues, name);
}

// Display the calculation steps and final result
function displayResults(initialList, originalName) {
    // Clear previous results
    resultContainer.innerHTML = '';
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'கணக்கீட்டு முடிவுகள்';
    resultContainer.appendChild(title);
    
    // Show the name that was calculated
    const nameDiv = document.createElement('div');
    nameDiv.className = 'process-steps';
    nameDiv.innerHTML = `<p><strong>கணக்கிடப்பட்ட பெயர்:</strong> ${originalName}</p>`;
    resultContainer.appendChild(nameDiv);
    
    // Show initial mapped values
    showProcessStep('இணைக்கப்பட்ட மதிப்புகள்:', initialList);
    
    // Perform recursive calculation
    const finalResult = calculateRecursive(initialList);
    
    // Show final result
    const finalDiv = document.createElement('div');
    finalDiv.className = 'final-result';
    finalDiv.innerHTML = `உங்கள் எண்கணித எண்: <span>${finalResult}</span>`;
    resultContainer.appendChild(finalDiv);
    
    // Show meaning
    showMeaning(finalResult);
    
    // Add to history
    addToHistory(originalName, finalResult);
    
    // Make container visible
    resultContainer.classList.add('visible');
}

// Analyze document and find matching names
function analyzeDocument(file, targetNumber) {
    // Clear previous results
    documentResultContainer.innerHTML = '';
    documentResultContainer.classList.remove('visible');
    
    // Validate inputs
    if (!file) {
        showError('ஒரு ஆவணத்தை தேர்ந்தெடுக்கவும்', documentResultContainer);
        return;
    }
    
    if (!targetNumber || targetNumber < 1 || targetNumber > 9) {
        showError('1-9 இடையில் ஒரு எண்ணை உள்ளிடவும்', documentResultContainer);
        return;
    }
    
    // In a real application, you would parse the PDF/PPT here
    // For this demo, we'll use sample names
    const matchedNames = findMatchingNames(parseInt(targetNumber));
    
    // Display results
    displayDocumentResults(file.name, targetNumber, matchedNames);
}

// Find names that match the target numerology number
function findMatchingNames(targetNumber) {
    const matchedNames = [];
    
    // For demonstration, we'll check sample names
    // In a real app, this would check names extracted from the document
    sampleNames.forEach(name => {
        const numerologyNumber = getNumerologyNumber(name);
        if (numerologyNumber === targetNumber) {
            matchedNames.push(name);
        }
    });
    
    return matchedNames;
}

// Get numerology number for a name (without displaying steps)
function getNumerologyNumber(name) {
    // Convert to lowercase
    const lowerName = name.toLowerCase();
    
    // Check for invalid characters
    const validChars = /^[a-z\s]+$/;
    if (!validChars.test(lowerName)) {
        return null;
    }
    
    // Remove spaces and convert to array of characters
    const cleanName = lowerName.replace(/\s+/g, '');
    const nameChars = cleanName.split('');
    
    // Map characters to numbers
    const mappedValues = [];
    for (let char of nameChars) {
        if (charMap[char]) {
            mappedValues.push(charMap[char]);
        } else {
            return null;
        }
    }
    
    // Perform recursive calculation
    return calculateRecursiveSilent(mappedValues);
}

// Recursive calculation without displaying steps
function calculateRecursiveSilent(list) {
    // Base case: if only one element, return it
    if (list.length === 1) {
        return list[0];
    }
    
    // Calculate next level
    const nextList = [];
    for (let i = 0; i < list.length - 1; i++) {
        const sum = list[i] + list[i + 1];
        nextList.push(digitSum(sum));
    }
    
    // Recursively calculate
    return calculateRecursiveSilent(nextList);
}

// Display document analysis results
function displayDocumentResults(fileName, targetNumber, matchedNames) {
    // Clear previous results
    documentResultContainer.innerHTML = '';
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'ஆவண பகுப்பாய்வு முடிவுகள்';
    documentResultContainer.appendChild(title);
    
    // Show file name and target number
    const fileInfoDiv = document.createElement('div');
    fileInfoDiv.className = 'process-steps';
    fileInfoDiv.innerHTML = `
        <p><strong>ஆவணம்:</strong> ${fileName}</p>
        <p><strong>இலக்கு எண்:</strong> ${targetNumber}</p>
    `;
    documentResultContainer.appendChild(fileInfoDiv);
    
    // Show result
    const resultDiv = document.createElement('div');
    resultDiv.className = 'document-result';
    resultDiv.innerHTML = `பொருந்தும் பெயர்கள்: <span>${matchedNames.length}</span>`;
    documentResultContainer.appendChild(resultDiv);
    
    // Show matched names
    if (matchedNames.length > 0) {
        const namesDiv = document.createElement('div');
        namesDiv.className = 'matched-names';
        namesDiv.innerHTML = '<h3>பொருந்தும் பெயர்கள்:</h3>';
        
        const namesList = document.createElement('ul');
        matchedNames.forEach(name => {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            namesList.appendChild(listItem);
        });
        
        namesDiv.appendChild(namesList);
        documentResultContainer.appendChild(namesDiv);
    } else {
        const noMatchDiv = document.createElement('div');
        noMatchDiv.className = 'process-steps';
        noMatchDiv.innerHTML = '<p>கொடுக்கப்பட்ட இலக்கு எண்ணுடன் பொருந்தும் பெயர்கள் எதுவும் கிடைக்கவில்லை.</p>';
        documentResultContainer.appendChild(noMatchDiv);
    }
    
    // Add to history
    addToDocumentHistory(fileName, targetNumber, matchedNames.length);
    
    // Make container visible
    documentResultContainer.classList.add('visible');
}

// Recursive calculation function
function calculateRecursive(list) {
    // Base case: if only one element, return it
    if (list.length === 1) {
        return list[0];
    }
    
    // Calculate next level
    const nextList = [];
    for (let i = 0; i < list.length - 1; i++) {
        const sum = list[i] + list[i + 1];
        nextList.push(digitSum(sum));
    }
    
    // Show intermediate step
    showProcessStep('அடுத்த படி:', nextList);
    
    // Recursively calculate
    return calculateRecursive(nextList);
}

// Reduce number to single digit
function digitSum(num) {
    while (num > 9) {
        num = Math.floor(num / 10) + (num % 10);
    }
    return num;
}

// Show calculation step
function showProcessStep(label, list) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'process-steps';
    
    const labelElem = document.createElement('p');
    labelElem.innerHTML = `<strong>${label}</strong> ${list.join(' ')}`;
    
    stepDiv.appendChild(labelElem);
    resultContainer.appendChild(stepDiv);
}

// Show meaning of the numerology number in Tamil
function showMeaning(number) {
    const meaningDiv = document.createElement('div');
    meaningDiv.className = 'process-steps';
    
    const meaningTitle = document.createElement('p');
    meaningTitle.innerHTML = `<strong>பொருள்:</strong> ${tamilMeanings[number] || 'தெரியவில்லை'}`;
    
    meaningDiv.appendChild(meaningTitle);
    resultContainer.appendChild(meaningDiv);
}

// Show error message
function showError(message, container) {
    container.innerHTML = '';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    container.appendChild(errorDiv);
    container.classList.add('visible');
}

// Add calculation to history
function addToHistory(name, result) {
    // Get existing history or initialize empty array
    let history = JSON.parse(localStorage.getItem('numerologyHistory')) || [];
    
    // Add new entry
    history.unshift({
        type: 'single',
        name: name,
        result: result,
        date: new Date().toLocaleString('ta-IN')
    });
    
    // Keep only last 10 entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('numerologyHistory', JSON.stringify(history));
}

// Add document analysis to history
function addToDocumentHistory(fileName, targetNumber, matchCount) {
    // Get existing history or initialize empty array
    let history = JSON.parse(localStorage.getItem('numerologyHistory')) || [];
    
    // Add new entry
    history.unshift({
        type: 'document',
        fileName: fileName,
        targetNumber: targetNumber,
        matchCount: matchCount,
        date: new Date().toLocaleString('ta-IN')
    });
    
    // Keep only last 10 entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('numerologyHistory', JSON.stringify(history));
}

// Load and display calculation history
function loadHistory() {
    const historyContent = document.getElementById('history-content');
    const history = JSON.parse(localStorage.getItem('numerologyHistory')) || [];
    
    if (history.length === 0) {
        historyContent.innerHTML = '<p>சில பெயர்களைக் கணக்கிட்டு உங்கள் வரலாற்றை இங்கே பாருங்கள்!</p>';
        return;
    }
    
    let historyHTML = '<div class="history-container">';
    
    history.forEach(entry => {
        if (entry.type === 'single') {
            historyHTML += `
                <div class="history-item">
                    <span><strong>${entry.name}</strong> → எண் ${entry.result}</span>
                    <span>${entry.date}</span>
                </div>
            `;
        } else if (entry.type === 'document') {
            historyHTML += `
                <div class="history-item">
                    <span><strong>${entry.fileName}</strong> → இலக்கு: ${entry.targetNumber}, பொருந்தும்: ${entry.matchCount}</span>
                    <span>${entry.date}</span>
                </div>
            `;
        }
    });
    
    historyHTML += '</div>';
    
    // Add clear history button
    historyHTML += '<button class="clear-history" onclick="clearHistory()">வரலாற்றை அழி</button>';
    
    historyContent.innerHTML = historyHTML;
}

// Clear history
function clearHistory() {
    localStorage.removeItem('numerologyHistory');
    loadHistory();
}