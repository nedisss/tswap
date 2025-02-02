import React from "react";
import styled, { keyframes } from "styled-components";

// Sukuriame CSS su styled-components
const LoadingModuleWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);  /* Pusiau permatomas fonas */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const LoadingContent = styled.div`
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
`;

// Sukuriame animacijos efektą
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
    border: 8px solid #f3f3f3; /* Šviesus pilkas fonas */
    border-top: 8px solid ${(props) => props.color || "#3498db"};  /* Mėlyna spalva arba pagal prop */
    border-radius: 50%;
    width: ${(props) => props.size || "50px"}; /* Dydis pagal prop */
    height: ${(props) => props.size || "50px"}; /* Dydis pagal prop */
    animation: ${spin} 1s linear infinite;
`;

const LoadingModule = ({ isLoading, size, color }) => {
    if (!isLoading) return null;

    return (
        <LoadingModuleWrapper>
            <LoadingContent>
                <Loader size={size} color={color} />
                <p>Loading... Please wait.</p>
            </LoadingContent>
        </LoadingModuleWrapper>
    );
};

export default LoadingModule;
