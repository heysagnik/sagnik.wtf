import * as React from "react"
import Head from "next/head"
import CommandMenu from "../components/command"
import App from "../components/app"
import SectionHero from "../components/section-hero"
import SectionWork from "../components/section-work"
//import SectionMusic from "components/section-music"
import { Analytics } from '@vercel/analytics/react';

export default function Home(props) {
  return (
    <App {...props}>
      <Head>
        <title>Sagnik - Front-end Developer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Sagnik's personal website" />
      </Head>
      <SectionHero />
      <SectionWork />
      {/* <CommandMenu/> */}
      {/*<SectionMusic {...props} />*/}
      <Analytics />
    </App>
  )
}

export async function getServerSideProps(context){
  return {
    props: {
      //music: await getMusic()
    }
  }
}
  

