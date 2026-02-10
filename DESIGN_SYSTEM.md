# V1 Design System

## UI Primitives

### Button
- Use `<Button>` from `components/ui/Button.tsx`.
- Variants: `primary`, `secondary`, `outline`.
- Never use random button classes.

### Container
- Use `<Container>` from `components/layout/Container.tsx`.
- Never use `mx-auto` or `px-*` directly in pages/components.

### Section
- Use `<Section>` from `components/layout/Section.tsx`.
- Never use random `py-*` for vertical spacing.

### Card
- Use `<Card>` from `components/ui/Card.tsx`.
- All cards, forms, and listings use this for visual consistency.

### Typography
- H1: `text-4xl font-bold`
- H2: `text-3xl font-semibold`
- Body: `text-base`
- Muted: `text-muted-foreground`
- Never use random font sizes or weights.

## Layout & Theme
- Layout is locked in `app/layout.tsx`.
- Theme tokens are defined in `globals.css` and `tailwind.config.ts`.
- Dark mode is controlled via `<html class="dark">`.

## Marketplace Grid Example
```
<Section>
  <Container>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <h3 className="text-lg font-semibold">BMW X5 2022</h3>
        <p className="mt-2 text-muted-foreground">₹45,00,000 • 12,000 km</p>
        <div className="mt-4">
          <Button>View Details</Button>
        </div>
      </Card>
    </div>
  </Container>
</Section>
```

## Rules
- Never break primitives.
- Never hardcode colors or spacing.
- Never use random Tailwind classes for core UI.
- All new features must use these primitives.
