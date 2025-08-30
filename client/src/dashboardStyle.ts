import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    h1 {
        font-family: Helvetica;
        font-size: 30px;
        font-weight: normal;
        vertical-align: middle;
    }
    
    p {
        font-family: Helvetica;
        font-size: 15px;
        color: gray;
        vertical-align: middle;
    }
        
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
        
    .filters {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-top: 2%;
    }
`;

export const MainBox = styled.div`
    flex: 1;
    padding-left: 20%;
    padding-right: 20%;
    padding-top: 1%;
`