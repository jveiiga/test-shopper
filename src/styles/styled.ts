import styled from 'styled-components';

export const DivContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 5%
`;

export const H1Container = styled.h1`
    display: flex;
    justify-content: center;
    color: #1E2044;
    font-size: 50px;
`

export const InputContainer = styled.input`
    color: rgb(102, 102, 102);
    width: 25%;
    padding: 5px 0px;
    font-size: 1rem;
    border-top: none;
    border-right: none;
    border-left: none;
    border-image: initial;
    line-height: 1.15;
    background: transparent;
    transition: border-bottom-color 0.3s;
    border-bottom: 1px solid rgb(102, 102, 102) !important;
    margin-top: 50px;
`;

export const ButtonContainer = styled.button`
    background: #07A776;
    color: #FFF;
    font-weight: 900;
    border-radius: 4px;
    padding: 12px 20px;
    line-height: 1;
    outline: 0px;
    text-align: center;
    width: 15%;
    font-size: 1rem;
    margin-top: 50px;
    cursor: pointer;
`