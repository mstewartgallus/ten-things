import type { Metadata } from "next";
import { Header, H1 } from "@/ui";

import { CompleteThings } from "../_ui/complete-things";

const CompletePage = () =>
    <section>
       <Header>
          <H1>Complete Things</H1>
       </Header>

       <CompleteThings />
    </section>;

export default CompletePage;

export const metadata: Metadata = {
  title: "Complete Things"
};
