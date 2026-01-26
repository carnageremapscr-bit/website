const form = document.getElementById('lookup-form');
const regInput = document.getElementById('reg');
const resultCard = document.getElementById('result');
const feedback = document.getElementById('feedback');
const regLabel = document.getElementById('reg-label');
const vehicleName = document.getElementById('vehicle-name');
const vehicleYear = document.getElementById('vehicle-year');
const stockHp = document.getElementById('stock-hp');
const stockNm = document.getElementById('stock-nm');
const stageRows = document.getElementById('stage-rows');

function renderVehicle(data) {
  const { registration, make, model, year, stock, stage1, stage2, stage3 } = data;
  regLabel.textContent = registration.toUpperCase();
  vehicleName.textContent = `${make} ${model}`;
  vehicleYear.textContent = year ? `Year ${year}` : '';
  stockHp.textContent = stock.hp;
  stockNm.textContent = stock.nm;

  const stages = [
    { label: 'Stage 1', values: stage1 },
    { label: 'Stage 2', values: stage2 },
    { label: 'Stage 3', values: stage3 }
  ];

  stageRows.innerHTML = stages
    .map(({ label, values }) => {
      if (!values) return '';
      const hpGain = values.hp - stock.hp;
      const nmGain = values.nm - stock.nm;
      return `
        <tr>
          <td class="stage-label">${label}</td>
          <td>${values.hp}</td>
          <td>${values.nm}</td>
          <td class="positive">+${hpGain}</td>
          <td class="positive">+${nmGain}</td>
        </tr>
      `;
    })
    .join('');

  resultCard.classList.remove('hidden');
  feedback.classList.add('hidden');
}

function showError(message) {
  feedback.textContent = message;
  feedback.classList.remove('hidden');
  resultCard.classList.add('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const reg = regInput.value.trim();
  if (!reg) {
    showError('Please enter a registration');
    return;
  }

  const query = encodeURIComponent(reg);
  try {
    const res = await fetch(`/api/lookup?reg=${query}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      showError(body.error || 'Lookup failed');
      return;
    }
    const data = await res.json();
    renderVehicle(data);
  } catch (err) {
    showError('Network error, try again');
  }
});
