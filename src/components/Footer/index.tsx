import React from 'react';
import styled from 'styled-components';

// Estilização do Footer
const FooterContainer = styled.footer`
  display: flex;
  height: 100px;
  width: 100%;
  background-color: #1E2044;
  position: absolute;
  bottom: 0;
`;

export const Footer: React.FC = () => {
  return <FooterContainer />;
};

