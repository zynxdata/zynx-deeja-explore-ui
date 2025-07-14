# Component Reference Guide

Quick reference for all available UI components in the Zynx Data AGI Platform.

## Core Components

### Button
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">Click me</Button>
<Button variant="hero">Meet Deeja</Button>
<Button variant="destructive">Delete</Button>
```

**Variants**: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link` | `hero` | `explore` | `interactive`
**Sizes**: `default` | `sm` | `lg` | `icon`

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Input
```tsx
import { Input } from "@/components/ui/input";

<Input placeholder="Enter text..." />
<Input type="email" />
<Input disabled />
```

### Textarea
```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Long text..." />
<Textarea rows={5} />
```

## Form Components

### Form
```tsx
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

<Form {...form}>
  <FormField
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

### Label
```tsx
import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email Address</Label>
```

### Checkbox
```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="terms" />
<Checkbox checked={true} />
<Checkbox disabled />
```

### RadioGroup
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
</RadioGroup>
```

### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Switch
```tsx
import { Switch } from "@/components/ui/switch";

<Switch />
<Switch checked={true} />
<Switch disabled />
```

### Slider
```tsx
import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[50]} max={100} step={1} />
<Slider defaultValue={[20, 80]} />
```

## Navigation Components

### NavigationMenu
```tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>Home</NavigationMenuItem>
    <NavigationMenuItem>About</NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Breadcrumb
```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>Current</BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Menubar
```tsx
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
      <MenubarItem>Open</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### Pagination
```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Data Display

### Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Badge
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Avatar
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Chart
```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

<ChartContainer config={chartConfig}>
  {/* Chart content using recharts */}
</ChartContainer>
```

## Feedback Components

### Alert
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Important message here.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertDescription>Error message.</AlertDescription>
</Alert>
```

### Toast
```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed.",
});

toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});
```

### Progress
```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={33} />
<Progress value={66} className="w-[60%]" />
```

### Skeleton
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-4 w-[200px]" />
```

## Overlay Components

### Dialog
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content here.</p>
  </DialogContent>
</Dialog>
```

### AlertDialog
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Sheet
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
    </SheetHeader>
    <p>Sheet content here.</p>
  </SheetContent>
</Sheet>
```

### Popover
```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

<Popover>
  <PopoverTrigger asChild>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content here.</p>
  </PopoverContent>
</Popover>
```

### Tooltip
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### HoverCard
```tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@username</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <p>User information here.</p>
  </HoverCardContent>
</HoverCard>
```

### ContextMenu
```tsx
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger>
    <div>Right click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### DropdownMenu
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Layout Components

### Separator
```tsx
import { Separator } from "@/components/ui/separator";

<Separator />
<Separator orientation="vertical" />
```

### AspectRatio
```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio";

<AspectRatio ratio={16 / 9}>
  <img src="/image.jpg" alt="Image" />
</AspectRatio>
```

### ScrollArea
```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

<ScrollArea className="h-[200px] w-[350px]">
  <div>Scrollable content here...</div>
</ScrollArea>
```

### Resizable
```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>
    <div>Panel 1</div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    <div>Panel 2</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Accordion
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question 1</AccordionTrigger>
    <AccordionContent>Answer 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Question 2</AccordionTrigger>
    <AccordionContent>Answer 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Collapsible
```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

<Collapsible>
  <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
  <CollapsibleContent>
    <div>Collapsible content here.</div>
  </CollapsibleContent>
</Collapsible>
```

## Interactive Components

### Command
```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Item 1</CommandItem>
      <CommandItem>Item 2</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### Toggle
```tsx
import { Toggle } from "@/components/ui/toggle";

<Toggle>Toggle me</Toggle>
<Toggle pressed={true}>Pressed</Toggle>
<Toggle disabled>Disabled</Toggle>
```

### ToggleGroup
```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

<ToggleGroup type="single">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
```

### Carousel
```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Calendar
```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

### InputOTP
```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

### Drawer
```tsx
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
    </DrawerHeader>
    <div>Drawer content here.</div>
  </DrawerContent>
</Drawer>
```

### Sidebar
```tsx
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

<Sidebar>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Home</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>About</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
```

## Quick Tips

### Common Patterns

**Conditional Rendering**
```tsx
{isLoading ? <Skeleton className="h-4 w-full" /> : <div>Content</div>}
```

**Form Validation**
```tsx
<FormField
  control={form.control}
  name="email"
  rules={{ required: "Email is required" }}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Responsive Design**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

**Loading States**
```tsx
<Button disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### Styling Tips

- Use `cn()` utility for conditional classes
- Prefer Tailwind classes over custom CSS
- Use design system colors (agi-yellow, agi-orange, agi-blue)
- Follow mobile-first responsive design
- Use semantic color tokens (primary, secondary, destructive, etc.)

---

*For detailed documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)*