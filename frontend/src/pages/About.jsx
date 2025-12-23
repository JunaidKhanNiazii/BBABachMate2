import React from 'react';

function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">This is About Page</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="mb-4">
          This system implements role-based access control with three user types:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Industry Members:</strong> Have access to industry-specific dashboard</li>
          <li><strong>University Members:</strong> Have access to university dashboard</li>
          <li><strong>Admin:</strong> Full system control (special email: bscs22f46@namal.edu.pk)</li>
        </ul>
        <p>
          Built with Firebase Authentication, Firestore, React, Vite, and Tailwind CSS.
        </p>
      </div>
    </div>
  );
}

export default About;