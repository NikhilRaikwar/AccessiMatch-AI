# AccessiMatch AI Architecture

This document gives the project diagrams for README, submission review, and video narration.

## User Flow

```mermaid
flowchart TD
  A[Open app] --> B[Select match moment]
  B --> C[Choose audience mode]
  C --> D[Generate explanation]
  D --> E[Read structured answer]
  E --> F{Need audio?}
  F -- Yes --> G[Play text-to-speech]
  F -- No --> H[Adjust readability controls]
  G --> H
  H --> I[Understand what happened, why it matters, and what to watch next]
```

## Explanation Pipeline

```mermaid
flowchart LR
  A[Match moment] --> B[Mode router]
  C[Accessibility settings] --> B
  B --> D[Explanation template or future Granite prompt]
  D --> E[Plain-language answer]
  D --> F[Key factors]
  D --> G[Watch-next guidance]
  E --> H[Accessible UI]
  F --> H
  G --> H
  H --> I[Speech synthesis]
```

## Future IBM AI Integration

```mermaid
flowchart TD
  A[User selects moment and mode] --> B[LangChain or LangFlow route]
  B --> C[Retrieve source snippets]
  C --> D[Docling-processed FIFA and accessibility docs]
  B --> E[Granite prompt]
  D --> E
  E --> F[watsonx.ai Granite response]
  F --> G[JSON validation]
  G --> H[Accessible explanation cards]
  G --> I[Source citations]
```

## Accessibility Modes

```mermaid
mindmap
  root((AccessiMatch AI))
    Blind or low vision
      spatial description
      audio-first wording
      field location context
    Beginner
      simple soccer terms
      no jargon
      clear next action
    Low cognitive load
      short sentences
      fewer concepts
      predictable layout
    Child-friendly
      safe tone
      simple analogy
      encouraging explanation
    Tactical
      pressing
      shape
      momentum
      substitutions
```

