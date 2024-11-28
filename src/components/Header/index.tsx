import React from 'react';
import styled from 'styled-components';

// Estilização do Header
const HeaderContainer = styled.header`
  height: 100px; /
  width: 100%;
  background-color: #1E2044; /* Cor de fundo */
  margin: 0; 
  padding: 0; 
  box-sizing: border-box;
`;

export const Header: React.FC = () => {
  return <HeaderContainer />;
};

