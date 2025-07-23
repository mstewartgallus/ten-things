import type { Metadata } from "next";

import { CompleteThings } from "../_ui/complete-things/CompleteThings";

const CompletePage = () =>
    <section>
       <h1>Complete Things</h1>
       <CompleteThings />
    </section>;

export default CompletePage;

export const metadata: Metadata = {
  title: "Complete Things"
};
