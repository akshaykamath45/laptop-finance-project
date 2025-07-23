document.addEventListener("DOMContentLoaded", () => {
  const loanId = localStorage.getItem("selectedLoanId");
  const loanDetailsDiv = document.getElementById("loan-details");
  const emiDetailsDiv = document.getElementById("emi-details");

  if (!loanId) {
    loanDetailsDiv.innerHTML = "<p>No loan selected.</p>";
    return;
  }

  fetch(`http://localhost:9090/loan-db/get/${loanId}`)
    .then(res => res.json())
    .then(data => {
      loanDetailsDiv.innerHTML = `
        <div class="appdetail-section appdetail-loan">
          <div><strong>Loan ID:</strong> ${data.loanId || '-'}</div>
          <div><strong>Customer ID:</strong> ${data.customerId || '-'}</div>
          <div><strong>Laptop ID:</strong> ${data.laptopId || '-'}</div>
          <div><strong>Application Date:</strong> ${data.applicationDate || '-'}</div>
          <div><strong>Confirmation Date:</strong> ${data.confirmationDate || 'Pending'}</div>
          <div><strong>Loan Amount:</strong> ₹${data.loanAmount ? data.loanAmount.toLocaleString('en-IN') : '-'}</div>
          <div><strong>Interest Rate:</strong> ${data.interestRate || '-'}%</div>
          <div><strong>Tenure:</strong> ${data.tenureMonths || '-'} months</div>
          <div><strong>Status:</strong> ${data.approvalStatus || '-'}</div>
          <div><strong>Active:</strong> ${data.loanActive || '-'}</div>
          ${data.approvalStatus === 'Rejected' ? `<div><strong>Rejection Reason:</strong> ${data.rejectionReason || '-'}</div>` : ''}
        </div>
      `;
    });

  fetch(`http://localhost:9090/emi-db/getByLoan/${loanId}`)
    .then(res => res.json())
    .then(emis => {
      if (!emis || emis.length === 0) {
        emiDetailsDiv.innerHTML = "<p>No EMI records available.</p>";
        return;
      }
      let table = `
        <table class="emi-table">
          <thead>
            <tr>
              <th>EMI #</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Penalty</th>
              <th>Penalty Amount</th>
            </tr>
          </thead>
          <tbody>
      `;
      emis.forEach(e => {
        table += `
          <tr>
            <td>${e.emiNumber}</td>
            <td>${e.emiDueDate || '-'}</td>
            <td>${e.emiPaidDate || '—'}</td>
            <td>₹${e.emiPaidAmount ? e.emiPaidAmount.toLocaleString('en-IN') : '-'}</td>
            <td>${e.emiStatus || '-'}</td>
            <td>${e.penaltyApplied || '-'}</td>
            <td>₹${e.penaltyAmount ? e.penaltyAmount.toLocaleString('en-IN') : '-'}</td>
          </tr>
        `;
      });
      table += `</tbody></table>`;
      emiDetailsDiv.innerHTML = table;
    });
});
