import React from 'react';
import './css/loginSignup.css'; // Import the CSS file

const FormWrapper = ({ children }) => {
  return (
    <section className="forms-section">
      <h1 className="section-title">Animated Forms</h1>
      <div className="forms">
        {children}
      </div>
    </section>
  );
}

export default FormWrapper;
