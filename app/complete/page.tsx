import type { Metadata } from "next";
import { MainLabel, Header, H1 } from "@/ui";

import { CompleteThings } from "../_ui/complete-things";

const CompletePage = () =>
    <>
       <MainLabel>
           <Header>
               <H1>Complete Things</H1>
           </Header>
       </MainLabel>
       <CompleteThings />
    </>;

export default CompletePage;

export const metadata: Metadata = {
  title: "Complete Things"
};
