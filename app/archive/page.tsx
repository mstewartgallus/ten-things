import type { Metadata } from "next";
import { Header, H1 } from "@/ui";

import { CompleteThings } from "./_ui/complete-things";

const CompletePage = () =>
    <>
       <Header>
          <H1>Archived Things</H1>
       </Header>
       <CompleteThings />
    </>;

export default CompletePage;

export const metadata: Metadata = {
  title: "Archived Things"
};
