async function loadSheetData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycby46wk3ITow4k4UmJPVsm4Z9spHtly2cPthWDYJAW70HV7gfTLP1gezPdKiDndaFfzg/exec');
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
}

function renderTable(data) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = '';

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  data.forEach((row, index) => {
    const tr = document.createElement('tr');

    if (index === 0) {
      tr.classList.add('header-row');
    }

    row.forEach((cell, cellIndex) => {
      const td = document.createElement('td');
      td.textContent = cell;

      if (cellIndex > 0 && (cell.toLowerCase() === 'presente' || cell.toLowerCase() === 'ausente')) {
        td.classList.add(cell.toLowerCase());
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  sheetDataDiv.appendChild(table);

  const filterInput = document.createElement('input');
  filterInput.type = 'text';
  filterInput.placeholder = 'Filtrar por nombre de empresa';
  filterInput.classList.add('filter-input');

  filterInput.addEventListener('input', function() {
    const filterValue = this.value.toLowerCase();
    tbody.childNodes.forEach(tr => {
      const empresaCell = tr.childNodes[1];
      if (empresaCell.textContent.toLowerCase().includes(filterValue)) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    });
  });

  sheetDataDiv.insertBefore(filterInput, table);
}

function shareVisibleData() {
  const visibleRows = Array.from(document.querySelectorAll('tbody tr')).filter(tr => tr.style.display !== 'none');
  let tableContent = '<table>';
  visibleRows.forEach(row => {
    tableContent += '<tr>';
    Array.from(row.childNodes).forEach(cell => {
      tableContent += `<td>${cell.textContent}</td>`;
    });
    tableContent += '</tr>';
  });
  tableContent += '</table>';

  const mailtoLink = `mailto:?subject=Datos filtrados&body=${encodeURIComponent(tableContent)}`;
  window.location.href = mailtoLink;
}

document.addEventListener('DOMContentLoaded', loadSheetData);
document.getElementById('shareButton').addEventListener('click', shareVisibleData);
