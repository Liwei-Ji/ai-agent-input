import { InitialCTA } from "./InitialCTA";
import { FollowUp } from "./FollowUp";
import { Suggestions } from "./Suggestions";
import { Nudges } from "./Nudges";
import { Templates } from "./Templates";
import { Madlibs } from "./Madlibs";
import { Rating } from "./Rating";
import { Caveat } from "./Caveat";
import { DataOwnership } from "./DataOwnership";
import { ZeroRetention } from "./ZeroRetention";
import { Memory } from "./Memory";
import { Consent } from "./Consent";
import { Watermark } from "./Watermark";
import { AutoFill } from "./AutoFill";
import { QuoteReply } from "./QuoteReply";
import { InlineAction } from "./InlineAction";
import { OpenText } from "./OpenText";
import { Remix } from "./Remix";
import { Restyle } from "./Restyle";
import { Summary } from "./Summary";
import { Synthesis } from "./Synthesis";
import { TokenLayering } from "./TokenLayering";
import { Transform } from "./Transform";
import { CollapseInput } from "./CollapseInput";
import { Attachments } from "./Attachments";
import { Filters } from "./Filters";
import { ModelManagement } from "./ModelManagement";
import { Parameters } from "./Parameters";
import { References } from "./References";
import { Workflows } from "./Workflows";
import { Controls } from "./Controls";
import { Regenerate } from "./Regenerate";
import { Copy } from "./Copy";
import { Variations } from "./Variations";
import { PromptTransparency } from "./PromptTransparency";
import { Footprints } from "./Footprints";
import { Citations } from "./Citations";



interface Props {
  featureTitle: string;
}

export const PreviewManager = ({ featureTitle }: Props) => {
  console.log("Current featureTitle:", featureTitle);

  switch (featureTitle) {
    case "Initial CTA":
      return <InitialCTA />;
    case "Follow up":
      return <FollowUp />;
    case "Suggestions":
      return <Suggestions />;
    case "Nudges":
      return <Nudges />;  
    case "Templates":
      return <Templates />;
    case "Madlibs":
      return <Madlibs />;
    case "Rating":
      return <Rating />;
    case "Caveat":
      return <Caveat />; 
    case "Data ownership":
      return <DataOwnership />; 
    case "ZeroRetention":
      return <ZeroRetention />;    
    case "Interact with the AI without leaving any traces":
      return <ZeroRetention />;  
    case "Memory":
      return <Memory />;
    case "Consent":
      return <Consent />;
    case "Watermark":
      return <Watermark />;
    case "Auto fill":
      return <AutoFill />;
    case "Quote Reply":
      return <QuoteReply />;
    case "Inline Action":
      return <InlineAction/>; 
    case "Open text":
      return <OpenText/>;
    case "Remix":
      return <Remix/>;
    case "Restyle":
      return <Restyle/>;
    case "Summary":
      return <Summary/>;
    case "Synthesis":
      return <Synthesis/>;
    case "Token layering":
      return <TokenLayering/>;
    case "Transform":
      return <Transform/>;
    case "Collapse Input":
      return <CollapseInput/>;
    case "Attachments":
      return <Attachments/>;
    case "Filters":
      return <Filters/>;
    case "Model management":
      return <ModelManagement/>; 
    case "Parameters":
      return <Parameters/>;
    case "References":
      return <References/>;
    case "Workflows":
      return <Workflows/>;
    case "Controls":
      return <Controls/>;
    case "Regenerate":
      return <Regenerate/>;
    case "Copy":
      return <Copy/>;
    case "Variations":
      return <Variations/>;
    case "Prompt transparency":
      return <PromptTransparency/>;
    case "Footprints":
      return <Footprints/>;
    case "Citations":
      return <Citations/>;  
    default:
      return (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
            <i className="fa-solid fa-code text-lg" />
          </div>
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.2em]">
            {featureTitle} Preview Slot
          </div>
        </div>
      );
  }
};