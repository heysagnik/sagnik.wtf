import React from "react"
import styled from "styled-components"

const Footer = styled.footer`
  margin-bottom: 1.87rem;
  margin-top: 5rem;
  font-weight: 500;
`
const Copyright = styled.div`
  font-size: 14px;
  line-height: 17px;
  color: #222222;
`
const BuiltWith = styled.div`
  font-size: 12px;
  color: #a7a7a7;
  margin-top: 2px;
`

const I = styled.img`
  width: 16px;
  }
`

export default function Component() {
  return (
    <Footer>
      <Copyright>© 2023 Sagnik Sahoo</Copyright>
      <BuiltWith>
        Built with{" "}
        <I src="https://emojipedia-us.s3.amazonaws.com/source/microsoft-teams/337/green-heart_1f49a.png"/>
         {" "}in India
      </BuiltWith>
    </Footer>
  )
}
