import React, { useState } from "react"
import styled from "styled-components"


import Footer from "../components/footer"
import  {AppContext}  from "../store"

const App = styled.main`
  margin: 0 2rem;
  max-width: 42rem;
`



export default function Component({ children}) {
  
  return (
    <AppContext.Provider >
      <App>
        {children}
        <Footer />
      </App>
    </AppContext.Provider>
  )
}
