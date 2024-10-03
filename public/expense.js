
const form = document.getElementById("expense-form");
const ul = document.getElementById('ul');

document.addEventListener('DOMContentLoaded', function () {
  // Fetch existing appointments on page load
  const token=localStorage.getItem('token');
  console.log(token);
  axios.get('http://localhost:3000/api/ExpenseTracker',{ headers: { 'Authorization': `Bearer ${token}` }})
      .then((response) => {
          const expensesData = response.data;
          ul.innerHTML = ''; // Ensure a clean slate for new data
          expensesData.forEach((details) => {
              showAppointmentDetails(details);
          });
      })
      .catch((error) => {
          console.error('Error fetching appointment data:', error);
      });

  form.addEventListener('submit', function (event) {
      event.preventDefault();

      const type = document.getElementById('type').value;
      const name = document.getElementById('name').value;
      const date = document.getElementById('date').value;
      const amount = document.getElementById('amount').value;

      const userDetails = { name, date, amount, type };
      const token=localStorage.getItem('token')
      axios.post('http://localhost:3000/api/ExpenseTracker', userDetails, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((result) => {
        showAppointmentDetails(result.data); // Display newly added appointment
    })
    .catch((error) => {
        console.error('Error adding appointment:', error);
    });
    

      // Reset the form after successful submission
      form.reset();
  });
});

function showAppointmentDetails(userDetails) {
  const li = document.createElement('li');
  const liText = document.createElement('span'); // Changed to span for better text handling
  liText.textContent = `On ${userDetails.date}, we paid ${userDetails.amount} for ${userDetails.type} on ${userDetails.name}`;
  li.appendChild(liText);
  li.style.margin = '15px';
  li.className = 'list';
  li.style.backgroundColor = 'gray';
  li.style.color = 'white';
  li.style.display = 'flex';
  li.style.justifyContent = 'space-between'; // Aligns text and buttons at opposite ends
  li.style.alignItems = 'center';
  ul.appendChild(li);

  const buttonContainer = document.createElement('div');
  li.appendChild(buttonContainer);

  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.appendChild(document.createTextNode('Delete Appointment'));
  deleteBtn.style.backgroundColor = '#4CAF50';
  deleteBtn.style.color = 'white';
  deleteBtn.style.border = 'none';
  deleteBtn.style.borderRadius = '4px';
  deleteBtn.style.padding = '10px 20px';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.marginRight = '10px'; // Add space between buttons
  buttonContainer.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', function () {
    const token=localStorage.getItem('token');
      axios.delete(`http://localhost:3000/api/ExpenseTracker/${userDetails.id}`,{ headers: { 'Authorization': `Bearer ${token}` }})
          .then(() => {
              ul.removeChild(li);
          })
          .catch((error) => {
              console.error('Error deleting appointment:', error);
          });
  });

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit Appointment';
  editBtn.style.backgroundColor = '#4CAF50';
  editBtn.style.color = 'white';
  editBtn.style.border = 'none';
  editBtn.style.borderRadius = '4px';
  editBtn.style.padding = '10px 20px';
  editBtn.style.cursor = 'pointer';
  buttonContainer.appendChild(editBtn);

  const editForm = document.createElement('form');
  editForm.style.display = 'none';
  editForm.style.flexDirection = 'column';
  editForm.style.marginTop = '10px';
  li.appendChild(editForm);

  const editType = document.createElement('input');
  editType.type = 'text';
  editType.value = userDetails.type;
  editForm.appendChild(editType);

  const editName = document.createElement('input');
  editName.type = 'text';
  editName.value = userDetails.name;
  editForm.appendChild(editName);

  const editDate = document.createElement('input');
  editDate.type = 'date';
  editDate.value = userDetails.date;
  editForm.appendChild(editDate);

  const editAmount = document.createElement('input');
  editAmount.type = 'number';
  editAmount.value = userDetails.amount;
  editForm.appendChild(editAmount);

  const editSubmitBtn = document.createElement('button');
  const editSubmitText = document.createTextNode('Save');
  editSubmitBtn.appendChild(editSubmitText);
  editForm.appendChild(editSubmitBtn);

  const editCancelBtn = document.createElement('button');
  const editCancelText = document.createTextNode('Cancel');
  editCancelBtn.appendChild(editCancelText);
  editForm.appendChild(editCancelBtn);

  li.appendChild(editForm);

  editBtn.addEventListener('click', function () {
      editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
  });

  editSubmitBtn.addEventListener('click', function (event) {
      event.preventDefault();

      // Update the userDetails object with the new values
      const updatedUserDetails = {
          id: userDetails.id,
          type: editType.value,
          name: editName.value,
          date: editDate.value,
          amount: editAmount.value
      };

      // Update the text without removing buttons and form
      liText.textContent = `On ${updatedUserDetails.date || userDetails.date}, we paid ${updatedUserDetails.amount} for ${updatedUserDetails.type} on ${updatedUserDetails.name}`;
      const token=localStorage.getItem('token')
      axios.put(`http://localhost:3000/api/ExpenseTracker/${updatedUserDetails.id}`, updatedUserDetails, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
        editForm.style.display = 'none';
    })
    .catch((error) => {
        console.error('Error editing appointment:', error);
    });
    
  });

  editCancelBtn.addEventListener('click', function (event) {
      event.preventDefault();
      editForm.style.display = 'none'; // Hide the form
  });
}


document.getElementById("leaderbtn").addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/leaderboard'; // Redirects to the leaderboard HTML page
  });
  