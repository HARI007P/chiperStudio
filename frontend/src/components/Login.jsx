import React, { useState } from "react";
import { loginUser } from "../api/projectApi";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

// Minty, fresh and clean palette
const mint = "#23cba7";
const mintDark = "#15826b";
const mintHover = "#12a383";
const lightBg = "#f8fffc";
const danger = "#d14343";

const Card = styled.div`
  max-width: 400px;
  margin: 3rem auto 0;
  padding: 2.2rem 2rem 1.5rem 2rem;
  background: ${lightBg};
  border-radius: 18px;
  box-shadow: 0 8px 36px 0 rgb(35 203 167 / 11%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${mintDark};
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 1px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 12px 15px 12px;
  font-size: 1.08rem;
  font-weight: 500;
  border: 2px solid ${({ error }) => (error ? danger : mint)};
  border-radius: 10px;
  background: ${lightBg};
  color: #222;
  transition: border 0.22s, background 0.18s;
  outline: none;

  &:focus {
    border: 2px solid ${mintDark};
    background: #fff;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    top: -8px;
    left: 1rem;
    background: #fff;
    font-size: 0.98rem;
    font-weight: 600;
    color: ${mintDark};
    padding: 0 0.3em;
    letter-spacing: 0.5px;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 15px;
  left: 1rem;
  font-size: 1.07rem;
  color: #666;
  pointer-events: none;
  transition: all 0.17s;
  background: transparent;
`;

const SubmitBtn = styled.button`
  padding: 0.97rem 0;
  font-size: 1.19rem;
  border: none;
  border-radius: 11px;
  background: ${({ disabled }) => disabled ? "#c0eac0" : mint};
  color: #fff;
  font-weight: 700;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  box-shadow: ${({ disabled }) => (disabled
      ? "none"
      : "0 5px 15px 0 rgb(35 203 167 / 16%)")};
  transition: background 0.18s, box-shadow 0.18s;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: ${mintHover};
    box-shadow: 0 7px 18px 0 rgb(35 203 167 / 24%);
  }
`;

const ErrorMsg = styled.p`
  color: ${danger};
  font-weight: 600;
  margin: 0.15rem 0 0 0;
  font-size: 1.05rem;
  text-align: center;
`;

const Footer = styled.p`
  margin-top: 2.2rem;
  text-align: center;
  color: #425c4a;
  font-size: 1.02rem;
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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      localStorage.setItem("token", data.token);
      navigate("/projects");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !form.email.trim() || !form.password.trim() || loading;

  return (
    <Card>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
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
            autoComplete="current-password"
            error={!!error}
            disabled={loading}
          />
          <FloatingLabel htmlFor="password">Password</FloatingLabel>
        </InputWrapper>
        <SubmitBtn type="submit" disabled={isFormInvalid}>
          {loading ? "Logging in..." : "Login"}
        </SubmitBtn>
      </Form>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Footer>
        Don't have an account?
        <StyledLink to="/register">Register here</StyledLink>
      </Footer>
    </Card>
  );
}
