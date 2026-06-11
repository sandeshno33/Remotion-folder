import "./index.css";
import { Composition } from "remotion";
import { ReBuzzSpot } from "./ReBuzzSpot";
import { RebuzzPromo } from "./RebuzzPromo";
import { RebuzzCTA } from "./RebuzzCTA";
import { RebuzzPOSPromo } from "./RebuzzPOSPromo";
import { RebuzzDemoCTA } from "./RebuzzDemoCTA";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReBuzzSpot"
        component={ReBuzzSpot}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzPromo"
        component={RebuzzPromo}
        durationInFrames={205}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzCTA"
        component={RebuzzCTA}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzPOSPromo"
        component={RebuzzPOSPromo}
        durationInFrames={348}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuzzPOSPromoLandscape"
        component={RebuzzPOSPromo}
        durationInFrames={348}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RebuzzPOSPromoSquare"
        component={RebuzzPOSPromo}
        durationInFrames={348}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="RebuzzDemoCTA"
        component={RebuzzDemoCTA}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

