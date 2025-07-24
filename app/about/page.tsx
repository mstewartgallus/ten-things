import type { Metadata } from "next";
import { Header, H1, P } from "@/ui";

const AboutPage = () =>
    <section>
       <Header>
          <H1>About Ten Things</H1>
       </Header>

       <P>Right now this is mostly just a a demo page for Lorem Ipsum text and testing layout stuff.</P>

       <P>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
sollicitudin nibh ut quam interdum, ac sodales arcu viverra. Phasellus
luctus id lacus vel rutrum. Vestibulum ante ipsum primis in faucibus
orci luctus et ultrices posuere cubilia curae; Cras in metus felis. In
suscipit lorem neque. Ut id tellus quam. Pellentesque imperdiet sed
sapien a tristique.</P>

<P>Nam venenatis volutpat vestibulum. Fusce sed imperdiet nisi. Aenean
interdum odio sem, at elementum velit imperdiet quis. Nulla libero
lorem, rhoncus eu purus et, varius mattis magna. Nullam suscipit
iaculis libero ac blandit. Sed sit amet orci sit amet eros feugiat
venenatis. Proin feugiat vestibulum scelerisque. Sed placerat nunc id
quam mattis, hendrerit porta enim faucibus. Nam id lorem eu massa
fringilla fringilla quis non turpis.</P>

<P>Praesent mauris odio, tristique quis diam eget, rutrum scelerisque
ante. Donec a magna metus. Maecenas venenatis sollicitudin
placerat. Donec efficitur diam nec ligula rhoncus tempus. Cras
bibendum faucibus elit at bibendum. Praesent aliquet faucibus
accumsan. Aliquam consequat maximus erat. Proin dignissim pharetra ex
quis eleifend. Mauris id quam pellentesque, auctor libero nec, pretium
lacus.</P>

<P>Maecenas non sem eget arcu feugiat tincidunt a vitae nunc. Nulla
facilisi. Etiam suscipit, ligula ac pulvinar dignissim, velit enim
ultricies nulla, vitae placerat metus nulla id dolor. Etiam sit amet
nibh hendrerit, suscipit felis non, eleifend lectus. Nunc fermentum
posuere velit, sed varius ipsum aliquet non. Nulla facilisi. Vivamus
magna risus, porttitor sit amet elementum a, vestibulum eget
ligula. Morbi ultricies fringilla tempor.</P>

<P>Pellentesque gravida velit est, at aliquet quam imperdiet
eget. Maecenas commodo lacus eu interdum tincidunt. Aliquam rhoncus
nulla in posuere faucibus. Morbi pellentesque odio ultrices tempus
malesuada. Pellentesque non arcu tortor. Morbi non urna eget elit
molestie aliquam. Morbi bibendum non nisi eu pellentesque. Maecenas
auctor sodales augue vitae efficitur. In vehicula eu purus vel
tincidunt.</P>

    </section>;

export default AboutPage;

export const metadata: Metadata = {
  title: "About Ten Things"
};
