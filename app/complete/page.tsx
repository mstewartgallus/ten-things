import type { Metadata } from "next";
import { H1 } from "@/ui";

import { CompleteThings } from "../_ui/complete-things";

const CompletePage = () =>
    <section>
       <H1>Complete Things</H1>
       <CompleteThings />
    </section>;

export default CompletePage;

export const metadata: Metadata = {
  title: "Complete Things"
};
