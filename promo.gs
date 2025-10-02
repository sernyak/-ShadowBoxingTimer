// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the necessary HTML elements
    const promoForm = document.getElementById('promo-form');
    const submitButton = document.getElementById('submit-button');
    const emailInput = document.getElementById('email');
    const formMessage = document.getElementById('form-message'); // Unified message element
    const formContainer = document.getElementById('promo-form-container');
    const successContainer = document.getElementById('success-message-container');

    // Attach an event listener to the form's submit event
    promoForm.addEventListener('submit', async function(event) {
        // Prevent the default form submission behavior (which would reload the page)
        event.preventDefault();
        
        const email = emailInput.value;

        // --- Frontend Validation ---
        // A simple regular expression to check for a valid email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('Please enter a valid email address.', true);
            return;
        }
        
        // --- UI Update: Show Loading State ---
        // Disable the button and show a loading spinner to prevent multiple submissions
        showMessage('', false); // Clear previous messages
        submitButton.disabled = true;
        submitButton.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Sending...</span>`;

        // --- API Call ---
        try {
            // --- IMPORTANT ---
            // This is the API endpoint you need to create on your server.
            // It could be a serverless function (e.g., on Vercel, Netlify, AWS Lambda)
            // or a traditional backend route.
            const response = await fetch('/api/send-promo-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            // The backend should return a JSON response.
            const result = await response.json();

            if (!response.ok) {
                // If the server returns an error (e.g., 400, 500), throw an error
                // The backend should provide a meaningful error message in `result.message`
                throw new Error(result.message || 'An unknown error occurred.');
            }
            
            // --- UI Update: Show Success State ---
            // If the API call was successful, hide the form and show the success message
            formContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');

        } catch (error) {
            // --- UI Update: Show Error State ---
            // If the API call fails, show an error message and re-enable the form
            showMessage(error.message, true);
            resetButton();
        }
    });

    /**
     * Displays a message to the user.
     * @param {string} message - The message to display.
     * @param {boolean} isError - If true, the message will be styled as an error.
     */
    function showMessage(message, isError) {
        formMessage.textContent = message;
        formMessage.className = `text-sm mt-3 ${isError ? 'text-red-400' : 'text-green-400'}`;
        if (message) {
            formMessage.classList.remove('hidden');
        } else {
            formMessage.classList.add('hidden');
        }
    }

    /**
     * Resets the submit button to its original state.
     */
    function resetButton() {
        submitButton.disabled = false;
        submitButton.innerHTML = `<span>Get My Code</span>`;
    }
});

