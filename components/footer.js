import React from "react"
import styled from "styled-components"
import Image from "next/image"

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
const heart="https://em-content.zobj.net/source/microsoft-teams/337/green-heart_1f49a.png"

export default function Component() {
  return (
    <Footer>
      <Copyright>© 2023 Sagnik Sahoo</Copyright>
      <BuiltWith>
        Built with{" "}
        <Image src={heart} alt='in' height={16} width={16} quality={100} style={{ pointerEvents: "none",userSelect: "none"  }}/>
         {" "}in India
      </BuiltWith>
    </Footer>
  )
}
