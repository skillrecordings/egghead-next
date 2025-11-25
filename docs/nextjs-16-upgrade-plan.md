# Next.js 16 Upgrade Plan

## Status: Complete - Upgraded to Next.js 16.0.4

### Commits

| Phase   | SHA                                        | Description                     |
| ------- | ------------------------------------------ | ------------------------------- |
| Phase 1 | `d1eb5ffdbe4961d5ef5fc9ded521ed30f727c8fb` | @reach/\* to Radix UI migration |
| Phase 2 | `362ea328`                                 | Next.js 15.4.5 → 16.0.4         |

### Summary

**Phase 1: @reach/\* to Radix UI Migration** - Complete

All @reach/\* packages have been replaced with Radix UI equivalents. This was required because @reach packages have peer dependencies locked to React 16/17, which are incompatible with React 19.

**Phase 2: Next.js 16 Upgrade** - Complete

Upgraded Next.js from 15.4.5 to 16.0.4. TypeScript compiles cleanly.

---

## What Was Changed

### Packages Removed

- @reach/tabs
- @reach/dialog
- @reach/auto-id
- @reach/visually-hidden
- @reach/alert-dialog
- @reach/listbox
- @reach/menu-button
- @reach/utils

### Packages Added/Upgraded

- @radix-ui/react-tabs@latest
- @radix-ui/react-dialog@latest
- @radix-ui/react-alert-dialog@latest
- @radix-ui/react-select@latest
- react-test-renderer@19
- @testing-library/react@15
- react-is@19

### Files Modified

| File                                                            | Change                                                               |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/player/player-sidebar.tsx`                      | @reach/tabs -> @radix-ui/react-tabs                                  |
| `src/components/dialog.tsx`                                     | @reach/dialog -> @radix-ui/react-dialog                              |
| `src/components/feedback-input/index.tsx`                       | @reach/dialog -> @radix-ui/react-dialog                              |
| `src/components/team/remove-member-confirm-dialog.tsx`          | @reach/dialog -> @radix-ui/react-alert-dialog                        |
| `src/components/team/transfer-ownership-confirm-dialog.tsx`     | @reach/dialog -> @radix-ui/react-alert-dialog                        |
| `src/components/card/index.tsx`                                 | @reach/utils, @reach/auto-id -> React built-ins                      |
| `src/components/grid/index.tsx`                                 | @reach/utils/polymorphic -> simplified types                         |
| `src/components/pages/courses/dialog-button.tsx`                | @reach/dialog, @reach/auto-id -> @radix-ui/react-dialog, React.useId |
| `src/components/pages/lessons/playback-speed-select.tsx`        | @reach/listbox -> @radix-ui/react-select                             |
| `src/components/pages/lessons/lesson/index.tsx`                 | @reach/tabs -> @radix-ui/react-tabs                                  |
| `src/app/(content)/courses/[course]/[lesson]/PlayerSidebar.tsx` | @reach/tabs -> @radix-ui/react-tabs                                  |

---

## Routes to Test After Migration

| Component                | Route                                       | What to Check                             |
| ------------------------ | ------------------------------------------- | ----------------------------------------- |
| **Tabs - PlayerSidebar** | `/lessons/[any-lesson-slug]`                | Sidebar tabs work, lesson list displays   |
| **Tabs - Lesson**        | `/lessons/[any-lesson-slug]`                | Transcript/Comments tabs below video      |
| **Dialog - Feedback**    | Footer on any page                          | Feedback modal opens/closes, form submits |
| **Dialog - General**     | Various pages                               | Modal opens/closes properly               |
| **Team Dialogs**         | `/user/team`                                | Remove member, transfer ownership dialogs |
| **PlaybackSpeedSelect**  | `/lessons/[any-lesson-slug]` (video player) | Speed selector dropdown works             |
| **DialogButton**         | Course pages (locked content)               | Dialog opens/closes properly              |

---

## Remaining Tasks

### Verify Build

```bash
pnpm build
pnpm test
```

### Packages with Peer Dependency Warnings

These packages warn about React 19 but should still work:

| Package                      | Issue                            | Priority       |
| ---------------------------- | -------------------------------- | -------------- |
| `@skillrecordings/player`    | Still has @reach deps internally | Low (internal) |
| `next-sanity`                | Warns about Next.js 16           | Medium         |
| `react-instantsearch-nextjs` | Warns about Next.js 16           | Medium         |
| `@headlessui/react`          | Peer deps for React 18           | Low            |
| `@code-hike/mdx`             | Peer deps for React 18           | Low            |

---

## Final State

| Item               | Version  | Required | Status   |
| ------------------ | -------- | -------- | -------- |
| Next.js            | 16.0.4   | 16.x     | Complete |
| React              | 19.1.1   | 19.x     | Complete |
| TypeScript         | 5.1.6    | 5.1+     | Complete |
| Node.js            | 22.x     | 20.9+    | Complete |
| Async APIs         | Migrated | Async    | Complete |
| @reach/\* packages | Removed  | N/A      | Complete |
| Testing deps       | Updated  | React 19 | Complete |

---

## Notes

### Radix UI Migration Patterns Used

**Tabs (@reach/tabs -> @radix-ui/react-tabs)**

```tsx
// Before
<Tabs index={idx} onChange={handleChange}>
  <TabList><Tab>A</Tab></TabList>
  <TabPanels><TabPanel>Content</TabPanel></TabPanels>
</Tabs>

// After
<Tabs.Root value={value} onValueChange={handleChange}>
  <Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger></Tabs.List>
  <Tabs.Content value="a">Content</Tabs.Content>
</Tabs.Root>
```

**Dialog (@reach/dialog -> @radix-ui/react-dialog)**

```tsx
// Before
<DialogOverlay isOpen={open} onDismiss={close}>
  <DialogContent>...</DialogContent>
</DialogOverlay>

// After
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**useId (@reach/auto-id -> React)**

```tsx
// Before
import {useId} from '@reach/auto-id'
const id = useId(props.id)

// After
const id = React.useId()
```
