import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { RebuzzBroll } from "./RebuzzBroll";
import { RebuzzOutro } from "./RebuzzOutro";
import { RebuzzOrderingPromo } from "./RebuzzOrderingPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzBroll"
        component={RebuzzBroll}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzOutro"
        component={RebuzzOutro}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzOrderingPromo-16-9"
        component={RebuzzOrderingPromo}
        durationInFrames={412}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RebuzzOrderingPromo-9-16"
        component={RebuzzOrderingPromo}
        durationInFrames={412}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzOrderingPromo-1-1"
        component={RebuzzOrderingPromo}
        durationInFrames={412}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
