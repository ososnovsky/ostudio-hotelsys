// npm i
// npm install --save-dev vite-plugin-eslint eslint-config-react-app eslint
// npm i styled-components
// npm i react-router-dom
// npm i react-icons
// npm install --save @supabase/supabase-js
// npm i @tanstack/react-query@4
// npm i @tanstack/react-query-devtools@4
// npm i date-fns 
// npm i react-hot-toast
// npm i react-hook-form@7
// npm i recharts@2
// npm i react-error-boundary

import styled from "styled-components"
import GlobalStyles from "./styles/GlobalStyles"
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";
import Row from "./ui/Row";

const StyledApp = styled.div`
  /* background-color: orangered; */
  padding: 20px;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Row>

          <Row type="horizontal">
            <Heading as='h1'>The Wild Oasis</Heading>
            <div>

              <Heading as='h2'>Check in and out</Heading>
              <Button
                onClick={() => alert('Check in')}>Check in</Button>
              <Button
                variation='secondary'
                size='small'
                onClick={() => alert('Check out')}>Check out</Button>
            </div>

          </Row>

          <Row type='vertical'>

            <Heading as='h3'>Form</Heading>
            <form>
              <Input type='number' placeholder='Number of guests' />
              <Input type='number' placeholder='Number of guests' />
            </form>
          </Row>


        </Row>
      </StyledApp>
    </>

  )
}

export default App
