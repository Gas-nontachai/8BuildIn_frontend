"use client"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
                <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/logo.jpg')" }}></div>
                <div className="w-1/2 flex items-center p-6">
                    <Card className="w-full" >
                        <CardContent>
                            <Typography variant="h5" className="text-center mb-4">
                                สมัครสมาชิก
                            </Typography>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <TextField
                                    label="Username"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    สมัครสมาชิก
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Register;
