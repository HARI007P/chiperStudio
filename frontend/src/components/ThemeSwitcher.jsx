import React from "react";
import styled, { keyframes } from "styled-components";
import { FaSun, FaMoon } from "react-icons/fa";


// ----------------------------
// Animations
// ----------------------------
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ----------------------------
// Styled Components
// ----------------------------
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px;
  background: ${({ theme }) => theme.sidebarBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  user-select: none;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
    align-items: stretch;
  }
`;



const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ isActive, theme }) =>
    isActive ? theme.primary : theme.sidebarBg};
  color: ${({ isActive, theme }) =>
    isActive ? "#fff" : theme.sidebarText};
  border: 2px solid
    ${({ isActive, theme }) => (isActive ? theme.primary : theme.borderColor)};
  padding: 14px 28px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 36px;
  cursor: pointer;
  user-select: none;
  box-shadow: ${({ isActive }) =>
    isActive ? "0 8px 20px rgba(0, 123, 255, 0.55)" : "0 3px 7px rgba(0,0,0,0.12)"};
  transition: all 0.35s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 12px 26px rgba(0, 123, 255, 0.7);
    transform: translateY(-3px);
  }

  &:active {
    transform: scale(0.96);
    box-shadow: none;
  }

  svg {
    width: 24px;
    height: 24px;
    animation: ${fadeIn} 0.35s ease;
  }

  &:focus-visible {
    outline: 4px solid ${({ theme }) => theme.primary};
    outline-offset: 4px;
  }
`;

const GlowIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${rotate} 1.4s linear infinite;
  color: ${({ theme }) => theme.primary};
`;

// ----------------------------
// ThemeSwitcher Component
// ----------------------------
export default function ThemeSwitcher({ themeMode, onToggleTheme }) {
 
  const isLight = themeMode === "light";

  return (
    <Wrapper>
      
      <Controls>
        <Button
          onClick={onToggleTheme}
          type="button"
          aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          isActive
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          <GlowIcon aria-hidden="true">{isLight ? <FaMoon /> : <FaSun />}</GlowIcon>
          {isLight ? "Dark Mode" : "Light Mode"}
        </Button>
      </Controls>
    </Wrapper>
  );
}
