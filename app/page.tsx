import Image from "next/image";
import Dashboard from "./Dashboard/page";
import Landingpage from "./Landingpage/page";

export default function Home() {
  return (
   <main>
      
      <Landingpage/>
      <Dashboard/>
      
   </main>
  );
}
