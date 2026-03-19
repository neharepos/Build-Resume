import Image from "next/image";
import Dashboard from "./Dashboard/page";
import LandingPage from "./Landingpage/page";

export default function Home() {
  return (
   <main>
      
      <LandingPage/>
      <Dashboard/>
      
   </main>
  );
}
