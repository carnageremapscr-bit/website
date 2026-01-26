const registrationInput = document.getElementById('registration');
const lookupBtn = document.getElementById('lookupBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');

lookupBtn.addEventListener('click', performLookup);
registrationInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performLookup();
});

async function performLookup() {
  const registration = registrationInput.value.trim();

  if (!registration) {
    showError('Please enter a registration number');
    return;
  }

  loading.style.display = 'block';
  error.style.display = 'none';
  results.style.display = 'none';

  try {
    const response = await fetch('/api/vehicle-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ registration })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Lookup failed');
    }

    displayResults(data);
  } catch (err) {
    showError(err.message);
  } finally {
    loading.style.display = 'none';
  }
}

function displayResults(data) {
  document.getElementById('make').textContent = data.make || '-';
  document.getElementById('model').textContent = data.model || '(Not provided by DVLA)';
  document.getElementById('yearOfManufacture').textContent = data.yearOfManufacture || '-';
  document.getElementById('engineCapacity').textContent = data.engineCapacity ? `${data.engineCapacity}cc` : '-';
  document.getElementById('colour').textContent = data.colour || '-';
  document.getElementById('fuelType').textContent = data.fuelType || '-';
  document.getElementById('co2Emissions').textContent = data.co2Emissions ? `${data.co2Emissions}g/km` : '-';

  results.style.display = 'block';
}

function showError(message) {
  error.textContent = message;
  error.style.display = 'block';
}
