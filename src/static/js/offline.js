/**
 * Offline functionality for ML Storytelling App
 * Handles service worker registration and offline data management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Register service worker for offline capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
    
    // UI Element References
    const offlineNotification = document.getElementById('offline-notification');
    const syncDataBtn = document.getElementById('sync-data');
    
    // Check online status
    function updateOnlineStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
            if (offlineNotification) {
                offlineNotification.classList.add('hidden');
            }
            
            // Try to sync data if we're coming back online
            syncData();
        } else {
            document.body.classList.add('offline');
            if (offlineNotification) {
                offlineNotification.classList.remove('hidden');
            }
        }
    }
    
    // Sync data with server when online
    function syncData() {
        // In a real app, this would sync local data with the server
        // For the prototype, we'll just simulate the process
        
        const pendingData = loadPendingData();
        
        if (pendingData && pendingData.length > 0) {
            console.log('Syncing pending data with server:', pendingData);
            
            // Simulate successful sync
            clearPendingData();
        }
    }
    
    // Save data locally when offline
    function saveOfflineData(data) {
        try {
            const pendingData = loadPendingData() || [];
            pendingData.push({
                timestamp: new Date().toISOString(),
                data: data
            });
            
            localStorage.setItem('ml_explorer_pending_data', JSON.stringify(pendingData));
            return true;
        } catch (e) {
            console.error('Error saving offline data:', e);
            return false;
        }
    }
    
    // Load pending data that needs to be synced
    function loadPendingData() {
        try {
            return JSON.parse(localStorage.getItem('ml_explorer_pending_data') || '[]');
        } catch (e) {
            console.error('Error loading pending data:', e);
            return [];
        }
    }
    
    // Clear pending data after successful sync
    function clearPendingData() {
        localStorage.removeItem('ml_explorer_pending_data');
    }
    
    // Cache resources for offline use
    function cacheResources() {
        // In a real app, this would use the Cache API to store resources
        // For the prototype, we'll rely on the service worker
        console.log('Caching resources for offline use');
    }
    
    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    if (syncDataBtn) {
        syncDataBtn.addEventListener('click', syncData);
    }
    
    // Initialize
    updateOnlineStatus();
    cacheResources();
    
    // Export functions for use in other modules
    window.offlineUtils = {
        saveOfflineData,
        loadPendingData,
        syncData,
        isOnline: () => navigator.onLine
    };
});
