let currentPoints = 100;
let journalData = {};

// Initialize the app
function init() {
    updateDate();
    loadData();
    updateProgressBar();
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

function switchTab(tabId, event) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    // Add active class to clicked tab
    if (event) event.target.classList.add('active');
}

function updatePoints(checkbox, points) {
    if (checkbox.checked) {
        // Task completed - no change to points (already at max)
        checkbox.parentElement.classList.add('completed');
    } else {
        // Task unchecked - deduct points
        currentPoints -= points;
        checkbox.parentElement.classList.remove('completed');
    }
    // Ensure points don't go below 0
    currentPoints = Math.max(0, currentPoints);
    document.getElementById('pointsValue').textContent = currentPoints;
    updateProgressBar();
    saveData();
}

function updateProgressBar() {
    const progressPercentage = (currentPoints / 100) * 100;
    document.getElementById('progressBar').style.width = progressPercentage + '%';
}

function addJournalEntry(section) {
    const entriesContainer = document.getElementById(section + '-entries');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'journal-entry';
    entryDiv.innerHTML = `
        <textarea class="entry-input" placeholder="Write your thoughts, learnings, or notes here..."></textarea>
        <button class="save-btn" onclick="saveJournalEntry(this, '${section}')">Save</button>
        <button class="cancel-btn" onclick="cancelJournalEntry(this)">Cancel</button>
    `;
    entriesContainer.appendChild(entryDiv);
    entryDiv.querySelector('.entry-input').focus();
}

function saveJournalEntry(button, section) {
    const entryDiv = button.parentElement;
    const content = entryDiv.querySelector('.entry-input').value.trim();
    if (content === '') {
        alert('Please enter some content before saving.');
        return;
    }
    const timestamp = new Date().toLocaleString();
    const entryId = Date.now().toString();
    // Initialize section if it doesn't exist
    if (!journalData[section]) {
        journalData[section] = [];
    }
    // Save to data
    journalData[section].push({
        id: entryId,
        content: content,
        timestamp: timestamp
    });
    // Update display
    entryDiv.innerHTML = `
        <div class="entry-timestamp">${timestamp}</div>
        <div class="entry-content">${content}</div>
        <button class="delete-btn" onclick="deleteJournalEntry('${section}', '${entryId}')">Delete</button>
    `;
    saveData();
}

function cancelJournalEntry(button) {
    const entryDiv = button.parentElement;
    entryDiv.remove();
}

function deleteJournalEntry(section, entryId) {
    if (confirm('Are you sure you want to delete this entry?')) {
        // Remove from data
        journalData[section] = journalData[section].filter(entry => entry.id !== entryId);
        // Refresh the display
        loadJournalSection(section);
        saveData();
    }
}

function loadJournalSection(section) {
    const entriesContainer = document.getElementById(section + '-entries');
    entriesContainer.innerHTML = '';
    if (journalData[section]) {
        journalData[section].forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'journal-entry';
            entryDiv.innerHTML = `
                <div class="entry-timestamp">${entry.timestamp}</div>
                <div class="entry-content">${entry.content}</div>
                <button class="delete-btn" onclick="deleteJournalEntry('${section}', '${entry.id}')">Delete</button>
            `;
            entriesContainer.appendChild(entryDiv);
        });
    }
}

function saveData() {
    const data = {
        points: currentPoints,
        journal: journalData,
        tasks: getTaskStates(),
        date: new Date().toDateString()
    };
    // Note: Using in-memory storage only as browser storage is not supported
}

function loadData() {
    // Load journal sections
    const sections = ['tech-journal', 'food-wellness', 'career-growth', 'nyc-planning', 'opportunities', 'personal-dev'];
    sections.forEach(section => {
        if (!journalData[section]) {
            journalData[section] = [];
        }
        loadJournalSection(section);
    });
}

function getTaskStates() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const states = [];
    checkboxes.forEach((checkbox, index) => {
        states.push(checkbox.checked);
    });
    return states;
}

// Initialize app when page loads
window.addEventListener('load', init);

document.getElementById('clickMe').addEventListener('click', function() {
    alert('Button clicked!');
});
