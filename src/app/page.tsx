import Image from "next/image";
import HomeSection from "./[locale]/[home]/home-section/HomeSection";
import ContactSection from "./[locale]/[home]/contact-section/ContacSection";
import { redirect } from "next/navigation";


export default function Home(){
  redirect('/en')
}
// export default function Home() {
//   return (
//     <main className="flex flex-col items-center p-24">
//       <HomeSection/>
//       <ContactSection/>
//     </main>
//   );
// }
