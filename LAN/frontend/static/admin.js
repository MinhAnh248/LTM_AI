function viewUsers() {
    fetch('/admin/users')
        .then(r => r.json())
        .then(data => {
            document.getElementById('results').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('results').textContent = 'Error: ' + error.message;
        });
}

function getStats() {
    fetch('/admin/stats')
        .then(r => r.json())
        .then(data => {
            document.getElementById('results').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('results').textContent = 'Error: ' + error.message;
        });
}

function clearData() {
    if(confirm('Clear all data?')) {
        fetch('/admin/clear-all', {method: 'DELETE'})
            .then(r => r.json())
            .then(data => {
                alert(data.message || 'Success');
                document.getElementById('results').textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    }
}