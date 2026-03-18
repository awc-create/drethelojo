SETUP NOTES
===========

1. Drop the two files into:
   app/projects/escape-room/play/
   ├── page.tsx
   └── play.module.scss

2. Update the "Open full screen" link in EscapeRoomClient.tsx:
   Change:  href="/game/index.html"
   To:      href="/projects/escape-room/play"
   Remove:  target="_blank" rel="noopener noreferrer"

3. Your root layout (app/layout.tsx) needs to pass remaining height
   down to this page. Find your layout's <body> or main wrapper and
   make sure it uses flexbox so the game page can fill the rest:

   Example — in your globals.css or layout:

     html, body { height: 100%; }

     body {
       display: flex;
       flex-direction: column;
       min-height: 100dvh;
     }

   And the <main> or content wrapper inside layout.tsx:

     <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
       {children}
     </main>

   If your layout already has something like this it will just work.
   If not, add the flex:1 to whatever wraps {children}.
