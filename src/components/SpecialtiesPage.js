import React from 'react';
// import { SpecialtiesIconSvg } from './Icons';

const SpecialtiesPage = ({ data, getSafeArray }) => {
    const specialties = getSafeArray(data, 'Specialties');

    return (
        <div className="page-container bg-gradient-green-lime">
            <div className="content-card">
                <h1 className="main-heading text-lime-800">
                    Our <span className="highlight-text-green">Specialties</span>
                </h1>
                <p className="sub-heading text-gray-700">
                    We pride ourselves on our core competencies and the specialized services we offer to our clients.
                </p>

                <div className="grid-3-cols md-grid-2-cols gap-6">
                    {specialties.length > 0 ? (
                        specialties.map((specialty, index) => (
                            <div key={index} className="specialty-item bg-gradient-teal-blue">
                                <div className="specialty-icon-container">
                                    ✓
                                </div>
                                <p className="specialty-text text-gray-800">{specialty}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">No specialties to display yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpecialtiesPage;