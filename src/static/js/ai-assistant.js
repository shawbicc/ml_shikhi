/**
 * AI Assistant functionality for ML Storytelling App
 * Handles the AI mentor character interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // UI Element References
    const assistantToggle = document.getElementById('assistant-toggle');
    const assistantPanel = document.getElementById('assistant-panel');
    const assistantMessages = document.getElementById('assistant-messages');
    const assistantInput = document.getElementById('assistant-input');
    const assistantSend = document.getElementById('assistant-send');
    
    // Initialize AI Assistant
    function initAIAssistant() {
        // Show initial greeting
        const greeting = getTranslation('assistant_greeting');
        
        // Event listeners
        if (assistantToggle && assistantPanel) {
            assistantToggle.addEventListener('click', function() {
                assistantPanel.classList.toggle('active');
            });
        }
        
        if (assistantInput && assistantSend) {
            // Send message on button click
            assistantSend.addEventListener('click', function() {
                sendMessage();
            });
            
            // Send message on Enter key
            assistantInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
    
    // Send user message to AI Assistant
    function sendMessage() {
        const message = assistantInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            assistantInput.value = '';
            
            // Process message and get response
            processMessage(message);
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        
        messageElement.appendChild(paragraph);
        assistantMessages.appendChild(messageElement);
        
        // Scroll to bottom
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }
    
    // Process user message and generate response
    function processMessage(message) {
        // In a real app, this would call the backend AI service
        // For the prototype, we'll use predefined responses
        
        // Convert message to lowercase for easier matching
        const lowerMessage = message.toLowerCase();
        
        // Simulate typing delay
        setTimeout(() => {
            let response;
            
            // Check for keywords in the message
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response = "Hello! How can I help you with machine learning today?";
            }
            else if (lowerMessage.includes('feature') && lowerMessage.includes('label')) {
                response = "Features are the input variables used to make predictions, while labels are the output values we're trying to predict. In the current puzzle, you need to separate these in the dataset.";
            }
            else if (lowerMessage.includes('decision tree')) {
                response = "Decision trees are a type of model that makes decisions based on asking a series of questions. They're great for classification tasks and are easy to interpret!";
            }
            else if (lowerMessage.includes('neural network')) {
                response = "Neural networks are inspired by the human brain. They consist of layers of nodes (neurons) that process information and learn patterns in data. They're powerful for complex tasks like image recognition.";
            }
            else if (lowerMessage.includes('hint') || lowerMessage.includes('help')) {
                response = "For the current puzzle, remember that features (X) are all columns except the target column. The target column 'creature_type' is your label (y).";
            }
            else if (lowerMessage.includes('regression')) {
                response = "Regression is used to predict continuous values, like prices or temperatures. Linear regression finds the best-fitting straight line through your data points.";
            }
            else if (lowerMessage.includes('classification')) {
                response = "Classification is used to categorize data into classes or groups. For example, determining if an email is spam or not spam is a classification task.";
            }
            else if (lowerMessage.includes('thank')) {
                response = "You're welcome! I'm happy to help with your machine learning journey.";
            }
            else {
                response = "That's an interesting question about machine learning. As you progress through the chapters, you'll learn more about this concept and how to apply it in real-world scenarios.";
            }
            
            // Add AI response to chat
            addMessage(response, 'assistant');
        }, 1000);
    }
    
    // Initialize
    initAIAssistant();
});
