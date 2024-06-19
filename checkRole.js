document.addEventListener('DOMContentLoaded', function() {
    // Example: Fetch user role from the server or retrieve from storage
    fetch('/api/getUserRole')  // Adjust this endpoint to your actual implementation
        .then(response => response.json())
        .then(data => {
            if (data.role === 'admin') {
                document.getElementById('admin-link').style.display = 'block';
            }
        })
        .catch(error => console.error('Error fetching user role:', error));
});
