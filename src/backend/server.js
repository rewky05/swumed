const express = require('express');
const { checkRole } = require('./middleware/userAuth');
const { createDoctor, createPatient } = require('./controllers/userController.js');

const app = express();

app.use(express.json());

app.post('/create-doctor', checkRole(['Superadmin', 'Information Desk Staff']), createDoctor);
app.post('/create-patient', checkRole(['Superadmin', 'Information Desk Staff']), createPatient);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
