export interface Feature {
  title: string;
  subtitle: string;
  img: string;
  description?: string[];
}

export interface CardGroup {
  title: string;
  subtitle: string;
  icon: string;
  features?: Feature[];
}

export const data: CardGroup[] = [
  {
    title: "Wayfinders",
    subtitle: "Give users clues about how to interact with the model, particularly when getting started.",
    icon: "fa-solid fa-map",
    features: [
      {
        title: "Initial CTA",
        subtitle: "Large, open-ended input inviting the user to start their first interaction with the AI",
        img: "images/cta.svg",
        description: [
      "initial_cta.desc_1",
      "initial_cta.desc_2"
    ]
      },
      {
        title: "Follow up",
        subtitle: "Get more information from the user when the initial prompt isn't sufficiently clear",
        img: "images/followup_up.svg",
        description: [
      "follow_up.desc_1",
      "follow_up.desc_2"
    ]
      },
      {
        title: "Nudges",
        subtitle: "Alert users to actions they can take to use AI, especially if they are just getting started",
        img: "images/nudge.svg",
        description: [
      "nudges_cta.desc_1",
      "nudges_cta.desc_2"
    ]
      },
      {
        title: "Suggestions",
        subtitle: "Solves the blank canvas dilemma with clues for how to prompt",
        img: "images/suggestions.svg",
        description: [
      "suggestions_cta.desc_1",
      "suggestions_cta.desc_2"
    ]
      },
      {
        title: "Templates",
        subtitle: "Structured templates that can be filled by the user or pre-filled by the AI",
        img: "images/template.svg",
        description: [
      "templates_cta.desc_1",
      "templates_cta.desc_2"
    ]
      }
    ]
  },
  {
    title: "Inputs",
    subtitle: "Submit the user's prompt to the AI within its surrounding context",
    icon: "fa-solid fa-keyboard",
    features: [
      {
        title: "Auto fill",
        subtitle: "Makes it easy for users to extend a prompt to multiple inputs at once",
        img: "images/autofill.svg",
        description: [
      "auto_fill_cta.desc_1",
      "auto_fill_cta.desc_2"
    ]
      },
      {
        title: "Inline Action",
        subtitle: "Ask or interact with AI contextually based on something already available on the page",
        img: "images/inline_action.svg",
        description: [
      "inline_action_cta.desc_1",
      "inline_action_cta.desc_2"
    ]
      },
      {
        title: "Quote Reply",
        subtitle: "Enable users to initiate a contextual AI query directly from selected content, preserving focus and reducing disruption to the primary interaction flow.",
        img: "images/quote_reply.svg",
        description: [
      "quote_reply_cta.desc_1",
      "quote_reply_cta.desc_2"
    ]
      },
      {
        title: "Madlibs",
        subtitle: "Repeatedly run generative tasks without compromising on the format or accuracy",
        img: "images/madlibs.svg",
        description: [
      "mablibs_cta.desc_1",
      "mablibs_cta.desc_2"
    ]
      },
      {
        title: "Open text",
        subtitle: "Open ended prompt inputs that can be used in AI conversations and other natural language prompting",
        img: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68acf789178baa4e2e9e9aab_openinput_card.svg",
        description: [
      "open_text_cta.desc_1",
      "open_texe_cta.desc_2"
    ]
      },
      {
        title: "Remix",
        subtitle: "Use existing content as the starting point for prompting",
        img: "images/remix.svg",
        description: [
      "remix_cta.desc_1",
      "remix_cta.desc_2"
    ]
      },
      {
        title: "Restyle",
        subtitle: "Transfer styles without changing the underlying structure of a generation",
        img: "images/restyle.svg",
        description: [
      "restyle_cta.desc_1",
      "restyle_cta.desc_2"
    ]
      },
      {
        title: "Summary",
        subtitle: "Have AI distill a topic or resource down to its essence",
        img: "images/summary.svg",
        description: [
      "summary_cta.desc_1",
      "summary_cta.desc_2"
    ]
      },
      {
        title: "Synthesis",
        subtitle: "Distill or reorganize complicated information into simple structure",
        img: "images/synthesize.svg",
        description: [
      "synthesis_cta.desc_1",
      "synthesis_cta.desc_2"
    ]
      },
      {
        title: "Token layering",
        subtitle: "Construct a prompt with raw tokens, just like building with legos",
        img: "images/tokenlayering.svg",
        description: [
      "token_layering_cta.desc_1",
      "token_layering_cta.desc_2"
    ]
      },
      {
        title: "Transform",
        subtitle: "Use AI to change the modality of content",
        img: "images/transform.svg",
        description: [
      "transform_cta.desc_1",
      "transform_cta.desc_2"
    ]
      }
    ]
  },
  {
    title: "Tuners",
    subtitle: "Let users refine or remix their prompt to get improved results",
    icon: "fa-solid fa-filter",
    features: [
      {
        title: "Collapse Input",
        subtitle: "Improve focus and layout efficiency by collapsing the input area while preserving all input content.",
        img: "images/collapse_input.svg",
        description: [
      "collapse_input_cta.desc_1",
      "collapse_input_cta.desc_2"
    ]
      },
      {
        title: "Attachments",
        subtitle: "Give the AI a specific reference to anchor its response",
        img: "images/attachments.svg",
        description: [
      "attachments_cta.desc_1",
      "attachments_cta.desc_2"
    ]
      },
      {
        title: "Filters",
        subtitle: "Constrain the inputs or the outputs of the AI by source, type, modality, etc",
        img: "images/filters.svg",
        description: [
      "filters_cta.desc_1",
      "filters_cta.desc_2"
    ]
      },
      {
        title: "Inpainting",
        subtitle: "Target specific areas of the AI's result to regenerate or remix",
        img: "images/inpainting.svg",
        description: [
      "inpainting_cta.desc_1",
      "inpainting_cta.desc_2"
    ]
      },
      {
        title: "Model management",
        subtitle: "Let users specify what model to use for their prompts",
        img: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ad1231271efefc27673d31_modelmanagement_card.svg",
        description: [
      "model_management_cta.desc_1",
      "model_management_cta.desc_2"
    ]
      },
      {
        title: "Parameters",
        subtitle: "Include constraints with your prompt for the AI to reference when generating its result",
        img: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ad155b9b8d80f64aebee1e_parameters_card.svg",
        description: [
      "parameters_cta.desc_1",
      "parameters_cta.desc_2"
    ]
      },
      {
        title: "Personal voice",
        subtitle: "Ensure outputs match your voice, tone, and preferences in a consistent way",
        img: "images/personalovoice.svg",
        description: [
      "personal_voice_cta.desc_1",
      "personal_voice_cta.desc_2"
    ]
      },
      {
        title: "References",
        subtitle: "See and manage what additional sources the AI references to generate its response",
        img: "images/references.svg",
        description: [
      "references_cta.desc_1",
      "references_cta.desc_2"
    ]
      },
      {
        title: "Workflows",
        subtitle: "String generative steps together to synthesize, create, or send content on auto-pilot",
        img: "images/workflows.svg",
        description: [
      "workflows_cta.desc_1",
      "workflows_cta.desc_2"
    ]
      }
    ]
  },
  {
    title: "Governors",
    subtitle: "Maintain user agency as the AI works in order to understand and direct the AI's logic",
    icon: "fa-solid fa-wand-magic-sparkles",
    features: [
      {
        title: "Citations",
        subtitle: "Give the AI a specific reference to anchor its response",
        img: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ac7be5d23c1be315c14fc4_citation_card.svg",
        description: [
      "citations_desc_1",
      "citations_desc_2"
     ] 
      },
      {
        title: "Controls",
        subtitle: "Manage the flow of information or pause a request mid-stream to adjust the prompt",
        img: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ac7ee1bea66470b3c8339e_controls_card.svg",
        description: [
      "controls_desc_1",
      "controls_desc_2"
     ] 
      },
      {
        title: "Footprints",
        subtitle: "Let users trace the AI's steps from prompt to result",
        img: "images/footprints.svg",
        description: [
      "footprints_desc_1",
      "footprints_desc_2"
     ] 
      },
      {
        title: "Plan of Action",
        subtitle: "Have the AI show the steps it will take to respond to the user's prompt before it executes its response",
        img: "images/planofaction.svg",
        description: [
      "plan_of_action_desc_1",
      "plan_of_action_desc_2"
     ] 
      },
      {
        title: "Stream Of Thought",
        subtitle: "Reveals the AI's logic thought process, tool use, and decisions for oversight and auditability",
        img: "images/stream_of_thought.svg",
        description: [
      "stream_Of_thought_desc_1",
      "stream_Of_thought_desc_2"
     ] 
      },
      {
        title: "Prompt transparency",
        subtitle: "Show users what is actually happening behind the scenes",
        img: "images/prompttransparency.svg",
        description: [
      "prompt_transparency_desc_1",
      "prompt_transparency_desc_2"
     ] 
      },
      {
        title: "Regenerate",
        subtitle: "Have the AI reproduce its response to the prompt without additional input",
        img: "images/regenerate.svg",
        description: [
      "regenerate_desc_1",
      "regenerate_desc_2"
     ] 
      },
      {
        title: "Copy",
        subtitle: "Instantly copy the response to your clipboard.",
        img: "images/copy.svg",
        description: [
      "copy_desc_1",
      "copy_desc_2"
     ] 
      },
      {
        title: "Sample response",
        subtitle: "Confirm the user's intent for complicated prompts",
        img: "images/sampleresponse.svg",
        description: [
      "sample_response_desc_1",
      "sample_response_desc_2"
     ] 
      },
      {
        title: "Token Transparency",
        subtitle: "Reveal the tokens the AI used to craft its response",
        img: "images/tokentransparency.svg",
        description: [
      "token_transparency_desc_1",
      "token_transparency_desc_2"
     ] 
      },
      {
        title: "Variations",
        subtitle: "Trace through multiple variations of a result to choose the one that works best for them",
        img: "images/variations.svg",
        description: [
      "variations_desc_1",
      "variations_desc_2"
     ] 
      }
    ]
  },
  {
    title: "Trust builder",
    subtitle: "Give users confidence that the AI's results are ethical, accurate, and trustworthy",
    icon: "fa-solid fa-shield-halved",
    features: [
      {
        title: "Consent",
        subtitle: "Only capture data from others with their knowledge and permission",
        img: "images/consent.svg",
        description: [
      "consent_desc_1",
      "consent_desc_2"
     ] 
      },
      {
        title: "Watermark",
        subtitle: "Identifiers on AI Generative content that humans, software, or programs can read",
        img: "images/watermarks.svg",
        description: [
      "watermark_desc_1",
      "watermark_desc_2"
     ]  
      },
      {
        title: "Memory",
        subtitle: "Control what details the AI knows about you",
        img: "images/memory.svg",
        description: [
      "memory_desc_1",
      "memory_desc_2"
     ]  
      },
      {
        title: "Interact with the AI without leaving any traces",
        subtitle: "Large, open-ended input inviting the user to start their first interaction with the AI",
        img: "images/incognito.svg",
        description: [
      "interact_with_the_ai_without_leaving_any_traces_desc_1",
      "interact_with_the_ai_without_leaving_any_traces_desc_2"
     ] 
      }
    ]
  },
  {
    title: "Dark matter",
    subtitle: "Potentially nefarious, but certainly ambiguous patterns that impact user trust with questionable user value",
    icon: "fa-solid fa-virus",
    features: [
      {
        title: "Caveat",
        subtitle: "Inform users about shortcomings or risks in the model or the technology overall",
        img: "images/caveat.svg",
        description: [
      "caveat_desc_1",
      "caveat_desc_2"
     ]      
      },
      {
        title: "Rating",
        subtitle: "Signal expectation gaps or errors in the model – but is that clear to the user?",
        img: "images/rating.svg",
        description: [
      "rating_desc_1",
      "rating_desc_2"
     ]
      },
      {
        title: "Data ownership",
        subtitle: "Control how the model remembers and uses your data",
        img: "images/dataownership.svg",
        description: [
      "data_ownership_desc_1",
      "data_ownership_desc_2"
     ]
      }
    ]
  },
  {
    title: "Identifiers",
    subtitle: "Differentiate the AI from other features and highlight its use case",
    icon: "fa-solid fa-microchip",
    features: [
      {
        title: "Color",
        subtitle: "Visual cues to help users identify AI features or content",
        img: "images/color.svg",
        description: [
      "color_desc_1",
      "color_desc_2"
     ]
      },
      {
        title: "Disclosure",
        subtitle: "Clearly mark content and interactions guided or delivered by AI",
        img: "images/disclosure.svg",
        description: [
      "disclosure_desc_1",
      "disclosure_desc_2"
     ]
      },
      {
        title: "Name",
        subtitle: "How do we refer to the AI?",
        img: "images/name.svg",
        description: [
      "name_desc_1",
      "name_desc_2"
     ]
      },
      {
        title: "Personality",
        subtitle: "Characteristics that distinguish the AI's personality and vibe",
        img: "images/personality.svg",
        description: [
      "personality_desc_1",
      "personality_desc_2"
     ]
      }
    ]
  }
];
