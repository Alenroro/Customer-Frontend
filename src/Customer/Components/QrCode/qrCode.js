import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Correctly import the QRCodeSVG component
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import './qrCode.css'; // Import your custom styles

const Qrcode = () => {
    // List of table numbers
    const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <>
            <h1 className="text-center my-4">QR Codes for Tables</h1>
            <div className="container">
                <div className="row">
                    {tableNumbers.map(tableNumber => (
                        <div key={tableNumber} className="col-md-4 text-center mb-4">
                            <div className="qr-code-item">
                                <QRCodeSVG value={`https://qr-scanning-customer-menu.netlify.app/`} />
                                <p className="mt-2">Table {tableNumber}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Qrcode;
