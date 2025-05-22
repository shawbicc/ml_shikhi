/**
 * Main JavaScript for ML Storytelling App
 * Handles core functionality and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language support
    initLanguage();
    
    // UI Element References
    const startJourneyBtn = document.getElementById('start-journey');
    const continueJourneyBtn = document.getElementById('continue-journey');
    const languageBtns = document.querySelectorAll('.language-btn');
    const assistantToggle = document.getElementById('assistant-toggle');
    const assistantPanel = document.getElementById('assistant-panel');
    const chapterCards = document.querySelectorAll('.chapter-card');
    
    // Event Listeners
    
    // Language selection
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (changeLanguage(lang)) {
                // Update active state
                languageBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Start journey button
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', function() {
            // Scroll to learning area
            document.getElementById('learning-area').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Save progress to indicate user has started
            saveProgress('started', true);
            
            // Update UI to show continue button instead if needed
            updateJourneyButtons();
        });
    }
    
    // Continue journey button
    if (continueJourneyBtn) {
        continueJourneyBtn.addEventListener('click', function() {
            // Load saved progress and navigate to appropriate chapter
            const currentChapter = loadProgress('currentChapter') || 1;
            navigateToChapter(currentChapter);
        });
        
        // Initially hide continue button if no progress
        updateJourneyButtons();
    }
    
    // AI Assistant toggle
    if (assistantToggle && assistantPanel) {
        assistantToggle.addEventListener('click', function() {
            assistantPanel.classList.toggle('active');
        });
    }
    
    // Chapter card navigation
    chapterCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const chapterStatus = this.classList.contains('status-locked') ? 'locked' : 
                                 this.classList.contains('status-completed') ? 'completed' : 'available';
            
            if (chapterStatus !== 'locked') {
                navigateToChapter(index + 1);
            }
        });
    });
    
    // Check for offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    
    // Helper Functions
    
    // Update journey buttons based on saved progress
    function updateJourneyButtons() {
        const hasStarted = loadProgress('started');
        if (hasStarted) {
            continueJourneyBtn.style.display = 'inline-block';
        } else {
            continueJourneyBtn.style.display = 'none';
        }
    }
    
    // Navigate to specific chapter
    function navigateToChapter(chapterNum) {
        // In a real app, this would load the chapter content
        console.log(`Navigating to chapter ${chapterNum}`);
        
        // Scroll to learning area
        document.getElementById('learning-area').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Save current chapter to progress
        saveProgress('currentChapter', chapterNum);
        
        // Update UI to reflect current chapter (simplified for prototype)
        document.querySelector('.learning-area h2').textContent = 
            getTranslation(`chapter${chapterNum}_title`);
        
        // Update chapter status indicators
        updateChapterStatus(chapterNum);
    }
    
    // Update chapter status indicators
    function updateChapterStatus(currentChapter) {
        chapterCards.forEach((card, index) => {
            // Remove all status classes
            card.classList.remove('status-locked', 'status-available', 'status-completed');
            
            // Set appropriate status class
            if (index + 1 < currentChapter) {
                card.classList.add('status-completed');
                card.querySelector('.status span').textContent = getTranslation('completed');
            } else if (index + 1 === currentChapter) {
                card.classList.add('status-available');
                card.querySelector('.status span').textContent = getTranslation('available');
            } else {
                card.classList.add('status-locked');
                card.querySelector('.status span').textContent = getTranslation('locked');
            }
        });
    }
    
    // Save progress to localStorage
    function saveProgress(key, value) {
        try {
            const progressData = JSON.parse(localStorage.getItem('ml_explorer_progress') || '{}');
            progressData[key] = value;
            localStorage.setItem('ml_explorer_progress', JSON.stringify(progressData));
            return true;
        } catch (e) {
            console.error('Error saving progress:', e);
            return false;
        }
    }
    
    // Load progress from localStorage
    function loadProgress(key) {
        try {
            const progressData = JSON.parse(localStorage.getItem('ml_explorer_progress') || '{}');
            return progressData[key];
        } catch (e) {
            console.error('Error loading progress:', e);
            return null;
        }
    }
    
    // Update online/offline status indicator
    function updateOnlineStatus() {
        const offlineNotification = document.getElementById('offline-notification');
        if (navigator.onLine) {
            offlineNotification.classList.add('hidden');
        } else {
            offlineNotification.classList.remove('hidden');
        }
    }
});
