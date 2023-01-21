import React, { useContext } from "react"
import styled from "styled-components"
import Image from "next/image"

import { AppContext } from "../store"

const InnerCircle = styled.div`
  width: 4rem;
  height: 4rem;
  background: linear-gradient(
    to top left,
    hsl(16, 100%, 60%) 0%,
    hsl(0, 100%, 74%) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) {
    height: 5rem;
    width: 5rem;
  }

  img {
    height: 2.75rem;
    width: 2.75rem;
  }

  @media (min-width: 768px) {
    img {
      height: 3.375rem;
      width: 3.375rem;
    }
  }
`

const OuterCircle = styled.div`
  width: 4.625rem;
  height: 4.625rem;
  border: 3px solid #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) {
    height: 5.5rem;
    width: 5.5rem;
  }
`

export default function Component() {
  

  return (
    <OuterCircle>
      <InnerCircle >
        <Image
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20sunglasses/3D/smiling_face_with_sunglasses_3d.png"
          alt="avatar"
          height={54}
          width={54}
          quality={100}
        />
      </InnerCircle>
    </OuterCircle>
  )
}
