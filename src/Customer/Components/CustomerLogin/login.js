import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPhoneNumber, setName, setIsLogin } from '../../../SlicesFolder/Slices/userLoginSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumberState] = useState('');
    const [name, setNameState] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmResult, setConfirmResult] = useState(false); // Changed to a boolean for simplicity

    // Send OTP
    const onSendVerificationCode = async (e) => {
        e.preventDefault();
        
        // Ensure phone number includes the country code
        const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        try {
            await axios.post('/api/send-otp', { phoneNumber: formattedPhoneNumber });
            setConfirmResult(true); // Show the verification code input
            alert('Verification code sent!');
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('Failed to send verification code.');
        }
    };

    // Verify OTP
    const onVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/verify-otp', { phoneNumber, verificationCode });
            if (response.data.success) {
                dispatch(setPhoneNumber(phoneNumber));
                dispatch(setName(name));
                dispatch(setIsLogin(true));
                localStorage.setItem('userUid', response.data.userUid);
                navigate('/');
            } else {
                alert('Invalid verification code.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('Failed to verify the code.');
        }
    };

    return (
        <main className="login-main">
            <section className="login-section d-flex justify-content-center align-items-center">
                <div className="login-card card shadow-lg border-0">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Log In</h2>
                        {!confirmResult ? (
                            <form onSubmit={onSendVerificationCode}>
                                <div className="mb-3">
                                    <label htmlFor="phone-number" className="form-label">
                                        Phone Number (Include Country Code)
                                    </label>
                                    <input
                                        id="phone-number"
                                        name="phoneNumber"
                                        type="tel"
                                        className="form-control"
                                        required
                                        placeholder="e.g., +1234567890"
                                        onChange={(e) => setPhoneNumberState(e.target.value)}
                                        value={phoneNumber}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="Name"
                                        onChange={(e) => setNameState(e.target.value)}
                                        value={name}
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary w-100">
                                        Send Verification Code
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={onVerifyCode}>
                                <div className="mb-3">
                                    <label htmlFor="verification-code" className="form-label">
                                        Verification Code
                                    </label>
                                    <input
                                        id="verification-code"
                                        name="verificationCode"
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="Verification Code"
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        value={verificationCode}
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary w-100">
                                        Verify Code
                                    </button>
                                </div>
                            </form>
                        )}
                        <p className="text-center mt-3">
                           
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;
