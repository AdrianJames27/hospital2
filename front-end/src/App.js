import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserLogin from './component/UserLogin';
import StaffPanel from './component/StaffPanel';
import PatientPanel from './component/PatientPanel';
import PatientRegistration from './component/PatientRegistration';
import StaffRegistration from './component/StaffRegistration';
import ManageUsers from './component/ManageUsers';
import ManagePatientRecords from './component/ManagePatientRecords';
import PatientMedicalRecords from './component/PatientMedicalRecords';
import ManageDoctors from './component/ManageDoctors';
import ViewAppoinments from './component/ViewAppointments';
import ViewMedicalRecords from './component/ViewMedicalRecords';
import BookAppointment from './component/BookAppointment';
import ManageAppointments from './component/ManageAppointments';
import ManageMedicalRecords from './component/ManageMedicalRecords';
import DoctorViewProfile from './component/DoctorViewProfile';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {
            // login route
          }

          <Route
            exact
            path='/'
            element={<UserLogin />}
          />

          {
            // admin routes
          }

          <Route
            path='/hospital/admin/panel'
            element={<StaffPanel />}
          />

          <Route
            path='/hospital/admin/manage_user'
            element={<ManageUsers />}
          />

          <Route
            path='/hospital/admin/manage_patient_records'
            element={<ManagePatientRecords />}
          />

          <Route
            path='/hospital/admin/manage_doctors'
            element={<ManageDoctors />}
          />

          <Route
            path='/hospital/admin/view_appointments'
            element={<ViewAppoinments />}
          />

          <Route
            path='/hospital/admin/view_medical_records'
            element={<ViewMedicalRecords />}
          />

          {
            // patient routes
          }

          <Route
            path='/hospital/patient/panel'
            element={<PatientPanel />}
          />

          <Route
            path='/hospital/patient/book_appointment'
            element={<BookAppointment />}
          />

          <Route 
            path='/hospital/patient/manage_appointments'
            element={<ManageAppointments />}
          />

          <Route
            path='/hospital/patient/view_medical_records'
            element={<PatientMedicalRecords />}
          />

          {
            // doctor routes
          }

          <Route
            path='/hospital/doctor/panel'
            element={<StaffPanel />}
          />

          <Route
            path='/hospital/doctor/profile'
            element={<DoctorViewProfile />}
          />

          <Route
            path='/hospital/doctor/manage_patient_records'
            element={<ManagePatientRecords />}
          />

          <Route
            path='/hospital/doctor/manage_medical_records'
            element={<ManageMedicalRecords />}
          />

          <Route
            path='/hospital/doctor/manage_appointments'
            element={<ManageAppointments />}
          />

          {
            // receptionist routes
          }

          <Route
            path='/hospital/receptionist/panel'
            element={<StaffPanel />}
          />

          <Route
            path='/hospital/receptionist/manage_patient_records'
            element={<ManagePatientRecords />}
          />

          <Route
            path='/hospital/receptionist/book_appointment'
            element={<BookAppointment />}
          />

          {
            // registration routes
          }

          <Route
            path='/user/patient/register'
            element={<PatientRegistration />}
          />

          <Route
            path='/user/staff/register'
            element={<StaffRegistration />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
