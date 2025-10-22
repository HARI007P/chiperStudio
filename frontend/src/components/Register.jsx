import React, { useState } from "react";
import { registerUser } from "../api/projectApi";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

// Color palette
const mint = "#23cba7";
const mintDark = "#15826b";
const lightBg = "#f8fffc";
const danger = "#d14343";

const Card = styled.div`
  max-width: 400px;
  margin: 3rem auto 0;
  padding: 2.4rem 2rem 1.8rem 2rem;
  background: ${lightBg};
  border-radius: 17px;
  box-shadow: 0 10px 36px 0 rgb(35 203 167 / 11%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.05rem;
  font-weight: 700;
  color: ${mintDark};
  margin-bottom: 1.6rem;
  text-align: center;
  letter-spacing: 1px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 11px 15px 11px;
  font-size: 1.09rem;
  font-weight: 500;
  border: 2px solid ${({ error }) => (error ? danger : mint)};
  border-radius: 11px;
  background: ${lightBg};
  color: #222;
  transition: border 0.18s, background 0.18s;
  outline: none;

  &:focus {
    border-color: ${mintDark};
    background: #fff;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    top: -8px;
    left: 1rem;
    background: #fff;
    font-size: 0.97rem;
    font-weight: 600;
    color: ${mintDark};
    padding: 0 0.3em;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 15px;
  left: 1rem;
  font-size: 1.07rem;
  color: #888;
  pointer-events: none;
  transition: all 0.17s;
  background: transparent;
`;

const SubmitBtn = styled.button`
  padding: 1.01rem 0;
  font-size: 1.19rem;
  border: none;
  border-radius: 12px;
  background: ${({ disabled }) => disabled ? "#b9efe3" : mint};
  color: #fff;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  box-shadow: ${({ disabled }) => disabled ? "none" : "0 5px 18px 0 rgb(35 203 167 / 17%)"};
  transition: background 0.18s, box-shadow 0.18s;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: ${mintDark};
    box-shadow: 0 9px 20px 0 rgb(35 203 167 / 25%);
  }
`;

const ErrorMsg = styled.p`
  color: ${danger};
  font-weight: 600;
  margin: 0.13rem 0 0 0;
  font-size: 1.03rem;
  text-align: center;
`;

const Footer = styled.p`
  margin-top: 1.8rem;
  text-align: center;
  color: #1e4d3b;
  font-size: 1.01rem;
`;

const StyledLink = styled(Link)`
  color: ${mintDark};
  font-weight: 700;
  text-decoration: underline;
  margin-left: 6px;
  &:hover {
    text-decoration: none;
    color: ${mint};
  }
`;


export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError("Name, email and password are required.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });
      localStorage.setItem("token", data.token);
      navigate("/projects");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Account already exists. Please login instead.");
      } else {
        setError(
          err.response?.data?.message ||
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !form.name.trim() || !form.email.trim() || !form.password.trim() || loading;

  return (
    <Card>
      <Title>Sign Up</Title>
      <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <InputWrapper>
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder=" "
            required
            autoComplete="name"
            error={!!error}
            disabled={loading}
          />
          <FloatingLabel htmlFor="name">Full Name</FloatingLabel>
        </InputWrapper>
        <InputWrapper>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder=" "
            required
            autoComplete="email"
            error={!!error}
            disabled={loading}
          />
          <FloatingLabel htmlFor="email">Email</FloatingLabel>
        </InputWrapper>
        <InputWrapper>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder=" "
            required
            autoComplete="new-password"
            error={!!error}
            disabled={loading}
          />
          <FloatingLabel htmlFor="password">Password</FloatingLabel>
        </InputWrapper>
        <SubmitBtn type="submit" disabled={isFormInvalid}>
          {loading ? "Registering..." : "Register"}
        </SubmitBtn>
      </Form>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Footer>
        Already have an account?
        <StyledLink to="/login">Login here</StyledLink>
      </Footer>
    </Card>
  );
}
