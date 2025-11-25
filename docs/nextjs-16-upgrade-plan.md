# Next.js 16 Upgrade Plan

## Status: Phase 1 Complete - @reach Migration Done

### Commit SHA: `d1eb5ffdbe4961d5ef5fc9ded521ed30f727c8fb`

### Commit Summary

**Phase 1: @reach/\* to Radix UI Migration** - Completed

All @reach/\* packages have been replaced with Radix UI equivalents. This was required because @reach packages have peer dependencies locked to React 16/17, which are incompatible with React 19.

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

## Next Steps

### Phase 2: Run Next.js 16 Codemod (Not Yet Started)

```bash
pnpx @next/codemod@canary upgrade latest
```

### Phase 3: Verify Build

```bash
pnpm build
pnpm test
```

---

## Current State

| Item               | Current  | Required for Next.js 16 | Status          |
| ------------------ | -------- | ----------------------- | --------------- |
| Next.js            | 15.4.5   | 16.x                    | Pending codemod |
| React              | 19.1.1   | 19.x                    | Ready           |
| TypeScript         | 5.1.6    | 5.1+                    | Ready           |
| Node.js            | 22.x     | 20.9+                   | Ready           |
| Async APIs         | Migrated | Async                   | Ready           |
| @reach/\* packages | Removed  | N/A                     | Complete        |
| Testing deps       | Updated  | React 19 compatible     | Complete        |

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
