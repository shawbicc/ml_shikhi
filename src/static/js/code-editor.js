/**
 * Code Editor functionality for ML Storytelling App
 * Handles code puzzle interactions, validation, and execution
 */

document.addEventListener('DOMContentLoaded', function() {
    // UI Element References
    const codeEditor = document.getElementById('code-editor');
    const runCodeBtn = document.getElementById('run-code');
    const checkAnswerBtn = document.getElementById('check-answer');
    const hintBtn = document.getElementById('hint');
    const resetBtn = document.getElementById('reset');
    const codeOutput = document.getElementById('code-output');
    const visualization = document.getElementById('visualization');
    const scoreDisplay = document.getElementById('score-display');
    
    // Store original code inputs for reset functionality
    const originalInputs = {};
    const codeInputs = document.querySelectorAll('.code-input');
    
    // Initialize code editor
    function initCodeEditor() {
        // Store original placeholder values
        codeInputs.forEach((input, index) => {
            originalInputs[index] = input.textContent;
            
            // Make code inputs editable
            input.addEventListener('focus', function() {
                if (this.textContent === originalInputs[index]) {
                    this.textContent = '';
                }
                this.classList.add('editing');
            });
            
            input.addEventListener('blur', function() {
                if (this.textContent.trim() === '') {
                    this.textContent = originalInputs[index];
                }
                this.classList.remove('editing');
            });
            
            // Handle tab key for indentation
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    document.execCommand('insertText', false, '    ');
                }
            });
        });
    }
    
    // Run code button
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', function() {
            runCode();
        });
    }
    
    // Check answer button
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', function() {
            checkAnswers();
        });
    }
    
    // Hint button
    if (hintBtn) {
        hintBtn.addEventListener('click', function() {
            showHint();
        });
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetCode();
        });
    }
    
    // Run the code and display output
    function runCode() {
        // In a real app, this would execute the code on the backend
        // For the prototype, we'll simulate execution
        
        // Get current code from inputs
        const code = getCompleteCode();
        
        // Simulate code execution
        simulateCodeExecution(code);
    }
    
    // Check if answers are correct
    function checkAnswers() {
        let allCorrect = true;
        let score = 0;
        
        codeInputs.forEach(input => {
            const userAnswer = input.textContent.trim();
            const correctAnswer = input.getAttribute('data-answer');
            
            if (userAnswer === correctAnswer) {
                input.classList.add('correct');
                input.classList.remove('incorrect');
                score++;
            } else {
                input.classList.add('incorrect');
                input.classList.remove('correct');
                allCorrect = false;
            }
        });
        
        // Calculate score (0-5 stars)
        const totalScore = Math.ceil((score / codeInputs.length) * 5);
        updateScoreDisplay(totalScore);
        
        // Show success message if all correct
        if (allCorrect) {
            showSuccessMessage();
            // Save progress
            const currentChapter = loadProgress('currentChapter') || 1;
            saveProgress(`chapter${currentChapter}Completed`, true);
            saveProgress('currentChapter', currentChapter + 1);
            
            // Update chapter status
            updateChapterStatus(currentChapter + 1);
        } else {
            showErrorMessage('error_incorrect');
        }
    }
    
    // Show hint for current puzzle
    function showHint() {
        // Find first incorrect or empty input
        let targetInput = null;
        
        for (const input of codeInputs) {
            const userAnswer = input.textContent.trim();
            const correctAnswer = input.getAttribute('data-answer');
            
            if (userAnswer === originalInputs[Array.from(codeInputs).indexOf(input)] || 
                userAnswer !== correctAnswer) {
                targetInput = input;
                break;
            }
        }
        
        if (targetInput) {
            const correctAnswer = targetInput.getAttribute('data-answer');
            // Provide a hint (first few characters of the answer)
            const hintLength = Math.ceil(correctAnswer.length / 3);
            targetInput.textContent = correctAnswer.substring(0, hintLength) + '...';
        }
    }
    
    // Reset code to original state
    function resetCode() {
        codeInputs.forEach((input, index) => {
            input.textContent = originalInputs[index];
            input.classList.remove('correct', 'incorrect');
        });
        
        // Clear output
        codeOutput.innerHTML = '';
        visualization.innerHTML = '';
    }
    
    // Get complete code from editor
    function getCompleteCode() {
        let code = '';
        const codeLines = codeEditor.querySelectorAll('.code-line');
        
        codeLines.forEach(line => {
            const lineNumber = line.querySelector('.line-number');
            const codeText = line.querySelector('.code-text');
            
            if (codeText) {
                code += codeText.textContent + '\n';
            }
        });
        
        return code;
    }
    
    // Simulate code execution (for prototype)
    function simulateCodeExecution(code) {
        // Check if code contains expected patterns
        const hasFeatures = code.includes('X = df.drop');
        const hasLabels = code.includes('y = df[');
        const hasHead = code.includes('.head()');
        
        // Clear previous output
        codeOutput.innerHTML = '';
        visualization.innerHTML = '';
        
        // Simulate output based on code content
        let output = '';
        
        if (hasFeatures && hasLabels) {
            output += '<h4>Features (X):</h4>';
            output += '<pre>   wings  magic_power  age  height\n';
            output += '0      2           85   120     1.2\n';
            output += '1      0           45    15     0.3\n';
            output += '2      4          100   500     2.5\n';
            output += '3      0           60    25     0.5\n';
            output += '4      2           75   200     1.8</pre>';
            
            output += '<h4>Labels (y):</h4>';
            output += '<pre>0       dragon\n';
            output += '1        pixie\n';
            output += '2       phoenix\n';
            output += '3         fairy\n';
            output += '4    griffin</pre>';
            
            // Add visualization
            createVisualization();
        } else {
            output = '<p class="error">Error: Missing required code elements.</p>';
        }
        
        codeOutput.innerHTML = output;
    }
    
    // Create data visualization
    function createVisualization() {
        // In a real app, this would generate actual charts based on the data
        // For the prototype, we'll use a placeholder image
        visualization.innerHTML = `
            <img src="https://via.placeholder.com/800x400.png?text=Feature+Visualization" 
                 alt="Data Visualization" style="width:100%; height:auto;">
        `;
    }
    
    // Update score display
    function updateScoreDisplay(score) {
        const stars = scoreDisplay.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            if (index < score) {
                star.textContent = '★'; // Filled star
            } else {
                star.textContent = '☆'; // Empty star
            }
        });
    }
    
    // Show success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <h3>${getTranslation('congratulations')}</h3>
            <p>You've successfully completed this puzzle!</p>
            <button class="btn" id="next-chapter">${getTranslation('next')}</button>
        `;
        
        codeOutput.appendChild(message);
        
        // Add event listener to next chapter button
        document.getElementById('next-chapter').addEventListener('click', function() {
            const currentChapter = loadProgress('currentChapter') || 2;
            navigateToChapter(currentChapter);
        });
    }
    
    // Show error message
    function showErrorMessage(errorKey) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = getTranslation(errorKey);
        
        codeOutput.appendChild(message);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
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
    
    // Update chapter status indicators
    function updateChapterStatus(currentChapter) {
        const chapterCards = document.querySelectorAll('.chapter-card');
        
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
    
    // Initialize code editor
    initCodeEditor();
});
