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

// DOM elements
const nameForm = document.getElementById('nameForm');
const userNameInput = document.getElementById('userName');
const resultContainer = document.getElementById('result');

// Bulk analysis elements
const bulkForm = document.getElementById('bulkForm');
const bulkNamesInput = document.getElementById('bulkNames');
const bulkResultContainer = document.getElementById('bulkResult');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Add event listener to form
nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateNumerology(userNameInput.value.trim());
});

// Add event listener to bulk form
bulkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    analyzeBulkNames(bulkNamesInput.value);
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

// Analyze bulk names and display each name with its numerology number
function analyzeBulkNames(namesText) {
    // Clear previous results
    bulkResultContainer.innerHTML = '';
    bulkResultContainer.classList.remove('visible');
    
    // Validate inputs
    if (!namesText) {
        showError('ஒன்றுக்கும் மேற்பட்ட பெயர்களை உள்ளிடவும்', bulkResultContainer);
        return;
    }
    
    // Split text into individual names by spaces
    const names = namesText.split(/\s+/)
        .map(name => name.trim())
        .filter(name => name.length > 0);
    
    if (names.length === 0) {
        showError('சரியான பெயர்களை உள்ளிடவும்', bulkResultContainer);
        return;
    }
    
    // Calculate numerology numbers for each name
    const nameResults = calculateNumerologyForNames(names);
    
    // Display results
    displayBulkResults(nameResults);
}

// Calculate numerology numbers for multiple names
function calculateNumerologyForNames(names) {
    const results = [];
    
    names.forEach(name => {
        // Skip empty names
        if (!name) return;
        
        try {
            // Convert to English lowercase for numerology calculation
            const englishName = convertTamilToEnglish(name);
            
            // Convert to lowercase
            const lowerName = englishName.toLowerCase();
            
            // Remove spaces and convert to array of characters
            const cleanName = lowerName.replace(/\s+/g, '');
            const nameChars = cleanName.split('');
            
            // Map characters to numbers
            const mappedValues = [];
            for (let char of nameChars) {
                if (charMap[char]) {
                    mappedValues.push(charMap[char]);
                } else {
                    // Skip invalid characters
                    continue;
                }
            }
            
            // Perform recursive calculation
            const numerologyNumber = calculateRecursiveSilent(mappedValues);
            
            results.push({
                originalName: name,
                numerologyNumber: numerologyNumber
            });
        } catch (error) {
            console.error(`Error calculating numerology for ${name}:`, error);
            results.push({
                originalName: name,
                numerologyNumber: 'Error'
            });
        }
    });
    
    return results;
}

// Convert Tamil names to English transliteration (simplified)
function convertTamilToEnglish(tamilName) {
    // This is a simplified conversion for demonstration
    // In a real application, you would use a proper transliteration library
    
    // For now, we'll just return the name as is if it's already in English
    // or convert common Tamil names to their English equivalents
    const tamilToEnglishMap = {
        // Add common Tamil names and their English equivalents here
        'அருண்': 'arun',
        'பாலாஜி': 'balaji',
        'சித்ரா': 'chitra',
        'தினேஷ்': 'dinesh',
        'எழில்': 'ezhil',
        'பிரகாஷ்': 'prakash',
        'கிருஷ்ணா': 'krishna',
        'லக்ஷ்மி': 'lakshmi',
        'மாதவன்': 'madhavan',
        'நித்யா': 'nithya',
        'ஒளி': 'oli',
        'பிரியா': 'priya',
        'ராஜ்': 'raj',
        'சுஜாதா': 'sujatha',
        'தர்ஷன்': 'darshan',
        'உமா': 'uma',
        'விஜய்': 'vijay',
        'சுரேஷ்': 'suresh',
        'ஆனந்த்': 'anand',
        'பாரதி': 'bharathi',
        'கார்த்தி': 'karthi',
        'லீலா': 'leela',
        'மோகன்': 'mohan',
        'நவீன்': 'naveen',
        'ஐஸ்வர்யா': 'aishwarya',
        'ராகுல்': 'rahul',
        'சந்தோஷ்': 'santhosh',
        'தேஜஸ்வி': 'tejasvi',
        'உஜ்ஜ瓦ல்': 'ujjwal',
        'வாஸ்': 'vas',
        'ஆதித்யா': 'aditya',
        'பவித்ரா': 'pavithra'
    };
    
    // Return mapped English name or the original name in lowercase
    return tamilToEnglishMap[tamilName] || tamilName.toLowerCase();
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

// Display bulk analysis results
function displayBulkResults(nameResults) {
    // Clear previous results
    bulkResultContainer.innerHTML = '';
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'பெயர்கள் பகுப்பாய்வு முடிவுகள்';
    bulkResultContainer.appendChild(title);
    
    // Show total names processed
    const totalDiv = document.createElement('div');
    totalDiv.className = 'process-steps';
    totalDiv.innerHTML = `<p><strong>மொத்த பெயர்கள்:</strong> ${nameResults.length}</p>`;
    bulkResultContainer.appendChild(totalDiv);
    
    // Create results table
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'matched-names';
    
    const resultsList = document.createElement('ul');
    resultsList.style.listStyle = 'none';
    resultsList.style.padding = '0';
    
    nameResults.forEach(result => {
        const listItem = document.createElement('li');
        listItem.style.padding = '10px';
        listItem.style.margin = '5px 0';
        listItem.style.backgroundColor = '#f0f4f8';
        listItem.style.borderRadius = '5px';
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = result.originalName;
        nameSpan.style.fontWeight = 'bold';
        
        const numberSpan = document.createElement('span');
        numberSpan.textContent = result.numerologyNumber;
        numberSpan.style.color = '#667eea';
        numberSpan.style.fontWeight = 'bold';
        
        listItem.appendChild(nameSpan);
        listItem.appendChild(numberSpan);
        resultsList.appendChild(listItem);
    });
    
    resultsDiv.appendChild(resultsList);
    bulkResultContainer.appendChild(resultsDiv);
    
    // Add to history
    addToBulkHistory(nameResults.length);
    
    // Make container visible
    bulkResultContainer.classList.add('visible');
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

// Add bulk analysis to history
function addToBulkHistory(totalCount) {
    // Get existing history or initialize empty array
    let history = JSON.parse(localStorage.getItem('numerologyHistory')) || [];
    
    // Add new entry
    history.unshift({
        type: 'bulk',
        totalCount: totalCount,
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
        } else if (entry.type === 'bulk') {
            historyHTML += `
                <div class="history-item">
                    <span><strong>பல பெயர்கள்</strong> → மொத்தம்: ${entry.totalCount} பெயர்கள்</span>
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