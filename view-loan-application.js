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
        <div class="detail-item"><strong>Loan ID:</strong> ${data.loanId}</div>
        <div class="detail-item"><strong>Customer ID:</strong> ${data.customerId}</div>
        <div class="detail-item"><strong>Laptop ID:</strong> ${data.laptopId}</div>
        <div class="detail-item"><strong>Application Date:</strong> ${data.applicationDate}</div>
        <div class="detail-item"><strong>Confirmation Date:</strong> ${data.confirmationDate || 'Pending'}</div>
        <div class="detail-item"><strong>Loan Amount:</strong> ₹${data.loanAmount.toLocaleString()}</div>
        <div class="detail-item"><strong>Interest Rate:</strong> ${data.interestRate}%</div>
        <div class="detail-item"><strong>Tenure:</strong> ${data.tenureMonths} months</div>
        <div class="detail-item"><strong>Status:</strong> ${data.approvalStatus}</div>
        <div class="detail-item"><strong>Active:</strong> ${data.loanActive}</div>
        ${data.approvalStatus === 'Rejected' ? `<div class="detail-item"><strong>Rejection Reason:</strong> ${data.rejectionReason}</div>` : ''}
      `;
    });

  fetch(`http://localhost:9090/emi-db/getByLoan/${loanId}`)
    .then(res => res.json())
    .then(emis => {
      if (emis.length === 0) {
        emiDetailsDiv.innerHTML = "<p>No EMI records available.</p>";
        return;
      }
      let table = `
        <table>
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
            <td>${e.emiDueDate}</td>
            <td>${e.emiPaidDate || '—'}</td>
            <td>₹${e.emiPaidAmount}</td>
            <td>${e.emiStatus}</td>
            <td>${e.penaltyApplied}</td>
            <td>₹${e.penaltyAmount}</td>
          </tr>
        `;
      });
      table += `</tbody></table>`;
      emiDetailsDiv.innerHTML = table;
    });
});
