import styled, { createGlobalStyle } from 'styled-components';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const GlobalStyle = createGlobalStyle`
    h1 {
        font-family: Roboto;
        font-size: 30px;
        font-weight: normal;
        vertical-align: middle;
    }
    
    p {
        font-family: Roboto;
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
        
    .tags {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
        
    h2 {
        font-family: Roboto;
        margin-top: -20px;
        margin-bottom: -7px;
    }
        
    .voting {
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-left: auto;
        margin-right: 0;
        margin-top: 10px;
    }
        
    .votes {
        font-family: Roboto;
    }
        
    .details {
        display: flex;
        flex-direction: row;
        font-family: Roboto;
        font-size: 13px;
        margin-bottom: 15px;
    }
        
    .detail {
        margin-right: 30px;
    }
`;

export const MainBox = styled.div`
    flex: 1;
    padding-left: 20%;
    padding-right: 20%;
    padding-top: 1%;
`

export interface TagProps {
    backgroundColor: string;
    color: string;
}

export const Tag = styled.div<TagProps>`
    background-color: ${props => props.backgroundColor || "white"};
    color: ${props => props.color || "black"};
    display: inline-block;
    font-family: Roboto;
    border-radius: 10px;
    padding: 5px;
    margin-top: 15px;
    margin-right: 10px;
    font-size: 13px;
`

export const ProjectContainer = styled.div`
    border: 2px solid gray;
    border-radius: 15px;
    margin: 3%;
    padding: 0 3%;
`