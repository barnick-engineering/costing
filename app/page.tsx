"use client";

import { useState, useEffect } from "react";
import {
  Calculator,
  FileText,
  Package,
  CreditCard,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Menu items for sidebar
const menuItems = [
  {
    title: "Office Materials",
    icon: FileText,
    items: [{ title: "Visiting Card", id: "visiting-card" }],
  },
  {
    title: "Memo",
    icon: Receipt,
    items: [
      { title: "Offset Memo", id: "offset-memo" },
      { title: "Carbon Memo", id: "carbon-memo" },
    ],
  },
  {
    title: "Packaging",
    icon: Package,
    items: [
      { title: "Box Packaging", id: "box-packaging" },
      { title: "Bag Packaging", id: "bag-packaging" },
    ],
  },
];

function AppSidebar({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Calculator className="h-6 w-6" />
          <span className="font-semibold">Print Calculator</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="flex items-center gap-2">
              <group.icon className="h-4 w-4" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveItem(item.id)}
                      isActive={activeItem === item.id}
                    >
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

interface CalculationState {
  sideSelection: "single" | "both";
  designFee: number;
  paperType: string;
  sheetWidth: number;
  sheetHeight: number;
  cardWidth: number;
  cardHeight: number;
  totalQuantity: number;
  colors: number;
  mattLamination: boolean;
  spotUV: boolean;
  cuttingType: "regular" | "dye";
  profitMargin: number;
}

function VisitingCardCalculator() {
  const [calc, setCalc] = useState<CalculationState>({
    sideSelection: "single",
    designFee: 0,
    paperType: "Art Card",
    sheetWidth: 28,
    sheetHeight: 22,
    cardWidth: 3.5,
    cardHeight: 2,
    totalQuantity: 1000,
    colors: 1,
    mattLamination: false,
    spotUV: false,
    cuttingType: "regular",
    profitMargin: 0,
  });

  const [calculations, setCalculations] = useState({
    sheetsRequired: 0,
    totalSheets: 0,
    sheetCost: 0,
    plateCost: 0,
    printingCost: 0,
    mattCost: 0,
    spotCost: 0,
    filmCost: 0,
    cuttingCost: 0,
    packagingCost: 0,
    totalProductionCost: 0,
    finalPrice: 0,
    wastageSheets: 0,
    wastageCost: 0,
  });

  useEffect(() => {
    // Calculate sheets required
    const sheetsRequired = Math.ceil(calc.totalQuantity / 80);

    // Calculate wastage sheets based on colors (always divide by 4)
    let wastageSheets = 0;
    switch (calc.colors) {
      case 1:
        wastageSheets = Math.ceil(5 / 4); // 5/4 = 1.25 → 2 sheets
        break;
      case 2:
        wastageSheets = Math.ceil(10 / 4); // 10/4 = 2.5 → 3 sheets
        break;
      case 3:
        wastageSheets = Math.ceil(15 / 4); // 15/4 = 3.75 → 4 sheets
        break;
      case 4:
        wastageSheets = Math.ceil(20 / 4); // 20/4 = 5 sheets
        break;
      default:
        wastageSheets = 0;
    }

    // Calculate total sheets (required + wastage)
    const totalSheets = sheetsRequired + wastageSheets;

    // Calculate sheet cost (total sheets * 12)
    const sheetCost = totalSheets * 12;

    // Calculate wastage cost for display
    const wastageCost = wastageSheets * 12;

    // Calculate plate cost
    const plateCost = calc.colors * 120;

    // Calculate printing cost
    const printingCost = calc.colors * 300;

    // Calculate matt lamination cost
    let mattCost = 0;
    if (calc.mattLamination) {
      const baseMattCost = 11 * 14 * 0.006 * sheetsRequired;
      mattCost =
        calc.sideSelection === "both" ? baseMattCost * 2 : baseMattCost;
      mattCost = Math.max(mattCost, 300);
    }

    // Calculate spot UV cost
    let spotCost = 0;
    let filmCost = 0;
    if (calc.spotUV) {
      const baseSpotCost = 11 * 14 * 0.007 * sheetsRequired;
      spotCost =
        calc.sideSelection === "both" ? baseSpotCost * 2 : baseSpotCost;
      spotCost = Math.max(spotCost, 300);
      filmCost = 350;
    }

    // Calculate cutting cost
    const cuttingRate = calc.cuttingType === "regular" ? 25 : 50;
    const cuttingCost = (calc.totalQuantity / 1000) * cuttingRate;

    // Calculate packaging cost
    const packagingCost = (calc.totalQuantity / 100) * 5;

    // Calculate total production cost
    const totalProductionCost =
      calc.designFee +
      sheetCost +
      plateCost +
      printingCost +
      mattCost +
      spotCost +
      filmCost +
      cuttingCost +
      packagingCost;

    // Calculate final price
    const finalPrice =
      totalProductionCost + (totalProductionCost * calc.profitMargin) / 100;

    setCalculations({
      sheetsRequired,
      totalSheets,
      sheetCost,
      plateCost,
      printingCost,
      mattCost,
      spotCost,
      filmCost,
      cuttingCost,
      packagingCost,
      totalProductionCost,
      finalPrice,
      wastageSheets,
      wastageCost,
    });
  }, [calc]);

  const updateCalc = (field: keyof CalculationState, value: any) => {
    setCalc((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Visiting Card Calculator</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Side Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Side Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={calc.sideSelection}
                onValueChange={(value: "single" | "both") =>
                  updateCalc("sideSelection", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Side</SelectItem>
                  <SelectItem value="both">Both Sides</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Design Fee */}
          <Card>
            <CardHeader>
              <CardTitle>Design Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={calc.designFee}
                  onChange={(e) =>
                    updateCalc("designFee", Number(e.target.value))
                  }
                  placeholder="Enter design cost"
                />
                <span className="text-sm text-muted-foreground">BDT</span>
              </div>
            </CardContent>
          </Card>

          {/* Paper Type & Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle>Paper Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Paper Type</Label>
                <Select
                  value={calc.paperType}
                  onValueChange={(value) => updateCalc("paperType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Art Card">Art Card</SelectItem>
                    <SelectItem value="Matt Paper">Matt Paper</SelectItem>
                    <SelectItem value="Glossy Paper">Glossy Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sheet Width (inch)</Label>
                  <Input
                    type="number"
                    value={calc.sheetWidth}
                    onChange={(e) =>
                      updateCalc("sheetWidth", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>Sheet Height (inch)</Label>
                  <Input
                    type="number"
                    value={calc.sheetHeight}
                    onChange={(e) =>
                      updateCalc("sheetHeight", Number(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Card Width (inch)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={calc.cardWidth}
                    onChange={(e) =>
                      updateCalc("cardWidth", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>Card Height (inch)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={calc.cardHeight}
                    onChange={(e) =>
                      updateCalc("cardHeight", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantity & Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Quantity & Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Total Quantity</Label>
                <Input
                  type="number"
                  value={calc.totalQuantity}
                  onChange={(e) =>
                    updateCalc("totalQuantity", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Number of Colors</Label>
                <Select
                  value={calc.colors.toString()}
                  onValueChange={(value) => updateCalc("colors", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Color</SelectItem>
                    <SelectItem value="2">2 Colors</SelectItem>
                    <SelectItem value="3">3 Colors</SelectItem>
                    <SelectItem value="4">4 Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Finishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Finishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matt"
                  checked={calc.mattLamination}
                  onCheckedChange={(checked) =>
                    updateCalc("mattLamination", checked)
                  }
                />
                <Label htmlFor="matt">Matt Lamination</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spot"
                  checked={calc.spotUV}
                  onCheckedChange={(checked) => updateCalc("spotUV", checked)}
                />
                <Label htmlFor="spot">Spot UV</Label>
              </div>
            </CardContent>
          </Card>

          {/* Cutting & Profit */}
          <Card>
            <CardHeader>
              <CardTitle>Cutting & Profit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Cutting Type</Label>
                <Select
                  value={calc.cuttingType}
                  onValueChange={(value: "regular" | "dye") =>
                    updateCalc("cuttingType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">
                      Regular Cutting (25 BDT/1000)
                    </SelectItem>
                    <SelectItem value="dye">
                      Dye Cutting (50 BDT/1000)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Profit Margin (BDT)</Label>
                <Input
                  type="number"
                  value={calc.profitMargin}
                  onChange={(e) =>
                    updateCalc("profitMargin", Number(e.target.value))
                  }
                  placeholder="Enter desired profit"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
              <CardDescription>
                Detailed calculation for {calc.totalQuantity} visiting cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sheet Calculation */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Sheet Calculation</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Required Sheets:</span>
                    <span>{calculations.sheetsRequired} sheets</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Wastage Sheets ({calc.colors} colors):</span>
                    <span>+{calculations.wastageSheets} sheets</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Sheets:</span>
                    <span>{calculations.totalSheets} sheets</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Sheet Cost:</span>
                    <span>{calculations.sheetCost} BDT</span>
                  </div>
                </div>
              </div>

              {/* Cost Items */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Design Fee:</span>
                  <span className="font-medium">{calc.designFee} BDT</span>
                </div>

                <div className="flex justify-between">
                  <span>Plate Cost ({calc.colors} colors):</span>
                  <span className="font-medium">
                    {calculations.plateCost} BDT
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Printing Cost:</span>
                  <span className="font-medium">
                    {calculations.printingCost} BDT
                  </span>
                </div>

                {calc.mattLamination && (
                  <div className="flex justify-between">
                    <span>Matt Lamination:</span>
                    <span className="font-medium">
                      {calculations.mattCost.toFixed(2)} BDT
                    </span>
                  </div>
                )}

                {calc.spotUV && (
                  <>
                    <div className="flex justify-between">
                      <span>Spot UV:</span>
                      <span className="font-medium">
                        {calculations.spotCost.toFixed(2)} BDT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Film Cost:</span>
                      <span className="font-medium">
                        {calculations.filmCost} BDT
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span>Cutting Cost ({calc.cuttingType}):</span>
                  <span className="font-medium">
                    {calculations.cuttingCost} BDT
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Packaging Cost:</span>
                  <span className="font-medium">
                    {calculations.packagingCost} BDT
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Production Cost:</span>
                  <span>{calculations.totalProductionCost.toFixed(2)} BDT</span>
                </div>

                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-medium">{calc.profitMargin} BDT</span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Final Price:</span>
                  <span>{calculations.finalPrice.toFixed(2)} BDT</span>
                </div>
              </div>

              <div className="pt-4">
                <Badge
                  variant="secondary"
                  className="w-full justify-center py-2"
                >
                  Price per card:{" "}
                  {(calculations.finalPrice / calc.totalQuantity).toFixed(2)}{" "}
                  BDT
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => window.print()}>
                Print Quote
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Save Calculation
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Export to PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface MemoCalculationState {
  designPrice: number;
  paperGSM: string;
  memoSize: "9x11.5" | "5.75x9";
  totalOrder: number;
  totalColors: number;
  perSheetPrice: number;
  bindingType: "pad" | "memo";
  padBindingRate: number;
  memoBindingRate: number;
  profitMargin: number;
}

function OffsetMemoCalculator() {
  const [calc, setCalc] = useState<MemoCalculationState>({
    designPrice: 0,
    paperGSM: "80gsm",
    memoSize: "9x11.5",
    totalOrder: 1000,
    totalColors: 1,
    perSheetPrice: 7,
    bindingType: "pad",
    padBindingRate: 15, // Changed from 25 to 15
    memoBindingRate: 50,
    profitMargin: 0,
  });

  const [calculations, setCalculations] = useState({
    totalSheets: 0,
    sheetCost: 0,
    plateCost: 0,
    printingCost: 0,
    bindingCost: 0,
    packagingCost: 50,
    totalCost: 0,
    finalPrice: 0,
    piecesPerSheet: 0,
  });

  useEffect(() => {
    // Determine pieces per sheet based on memo size
    const piecesPerSheet = calc.memoSize === "9x11.5" ? 8 : 16;

    // Calculate total sheets needed
    const totalSheets = Math.ceil(calc.totalOrder / piecesPerSheet);

    // Calculate sheet cost
    const sheetCost = totalSheets * calc.perSheetPrice;

    // Calculate plate cost
    const plateCost = calc.totalColors * 120;

    // Calculate printing cost
    const printingCost = calc.totalColors * 300;

    // Calculate binding cost
    const bindingRate =
      calc.bindingType === "pad" ? calc.padBindingRate : calc.memoBindingRate;
    const bindingCost = Math.ceil(calc.totalOrder / 100) * bindingRate;

    // Calculate total cost
    const totalCost =
      calc.designPrice +
      sheetCost +
      plateCost +
      printingCost +
      bindingCost +
      calculations.packagingCost;

    // Calculate final price
    const finalPrice = totalCost + (totalCost * calc.profitMargin) / 100;

    setCalculations({
      totalSheets,
      sheetCost,
      plateCost,
      printingCost,
      bindingCost,
      packagingCost: 50,
      totalCost,
      finalPrice,
      piecesPerSheet,
    });
  }, [calc]);

  const updateCalc = (field: keyof MemoCalculationState, value: any) => {
    setCalc((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Receipt className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Offset Memo Calculator</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* General Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Design Price</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={calc.designPrice}
                    onChange={(e) =>
                      updateCalc("designPrice", Number(e.target.value))
                    }
                    placeholder="Enter design cost"
                  />
                  <span className="text-sm text-muted-foreground">TK</span>
                </div>
              </div>

              <div>
                <Label>Total Order</Label>
                <Input
                  type="number"
                  value={calc.totalOrder}
                  onChange={(e) =>
                    updateCalc("totalOrder", Number(e.target.value))
                  }
                  placeholder="How many memos are ordered"
                />
              </div>

              <div>
                <Label>Total Colors (1-4)</Label>
                <Select
                  value={calc.totalColors.toString()}
                  onValueChange={(value) =>
                    updateCalc("totalColors", Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Color</SelectItem>
                    <SelectItem value="2">2 Colors</SelectItem>
                    <SelectItem value="3">3 Colors</SelectItem>
                    <SelectItem value="4">4 Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Paper Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Paper Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Paper GSM</Label>
                <Select
                  value={calc.paperGSM}
                  onValueChange={(value) => updateCalc("paperGSM", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80gsm">80 GSM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sheet Size</Label>
                <div className="p-2 bg-muted rounded text-sm">
                  23 inch × 36 inch (Fixed)
                </div>
              </div>

              <div>
                <Label>Memo Size</Label>
                <Select
                  value={calc.memoSize}
                  onValueChange={(value: "9x11.5" | "5.75x9") =>
                    updateCalc("memoSize", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9x11.5">
                      9 × 11.5 inch (8 pieces per sheet)
                    </SelectItem>
                    <SelectItem value="5.75x9">
                      5.75 × 9 inch (16 pieces per sheet)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Per Sheet Price</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={calc.perSheetPrice}
                    onChange={(e) =>
                      updateCalc("perSheetPrice", Number(e.target.value))
                    }
                  />
                  <span className="text-sm text-muted-foreground">TK</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Binding Options */}
          <Card>
            <CardHeader>
              <CardTitle>Binding & Finishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Binding Type</Label>
                <Select
                  value={calc.bindingType}
                  onValueChange={(value: "pad" | "memo") =>
                    updateCalc("bindingType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pad">Pad Binding</SelectItem>
                    <SelectItem value="memo">Memo Binding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pad Binding Rate (per 100)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={calc.padBindingRate}
                      onChange={(e) =>
                        updateCalc("padBindingRate", Number(e.target.value))
                      }
                    />
                    <span className="text-sm text-muted-foreground">TK</span>
                  </div>
                </div>
                <div>
                  <Label>Memo Binding Rate (per 100)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={calc.memoBindingRate}
                      onChange={(e) =>
                        updateCalc("memoBindingRate", Number(e.target.value))
                      }
                    />
                    <span className="text-sm text-muted-foreground">TK</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Margin */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={calc.profitMargin}
                  onChange={(e) =>
                    updateCalc("profitMargin", Number(e.target.value))
                  }
                  placeholder="Enter desired profit"
                />
                <span className="text-sm text-muted-foreground">TK</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
              <CardDescription>
                Detailed calculation for {calc.totalOrder} offset memos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sheet Calculation */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Sheet Calculation</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Memo Size:</span>
                    <span>
                      {calc.memoSize === "9x11.5"
                        ? "9 × 11.5 inch"
                        : "5.75 × 9 inch"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pieces per Sheet:</span>
                    <span>{calculations.piecesPerSheet} pieces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Sheets Needed:</span>
                    <span>{calculations.totalSheets} sheets</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Sheet Cost:</span>
                    <span>{calculations.sheetCost} TK</span>
                  </div>
                </div>
              </div>

              {/* Cost Items */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Design Price:</span>
                  <span className="font-medium">{calc.designPrice} TK</span>
                </div>

                <div className="flex justify-between">
                  <span>Plate Cost ({calc.totalColors} colors):</span>
                  <span className="font-medium">
                    {calculations.plateCost} TK
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Printing Cost:</span>
                  <span className="font-medium">
                    {calculations.printingCost} TK
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Binding Cost ({calc.bindingType}):</span>
                  <span className="font-medium">
                    {calculations.bindingCost} TK
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Packaging Cost:</span>
                  <span className="font-medium">
                    {calculations.packagingCost} TK
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Cost:</span>
                  <span>{calculations.totalCost.toFixed(2)} TK</span>
                </div>

                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-medium">{calc.profitMargin} TK</span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Final Price:</span>
                  <span>{calculations.finalPrice.toFixed(2)} TK</span>
                </div>
              </div>

              <div className="pt-4">
                <Badge
                  variant="secondary"
                  className="w-full justify-center py-2"
                >
                  Price per memo:{" "}
                  {(calculations.finalPrice / calc.totalOrder).toFixed(2)} TK
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => window.print()}>
                Print Quote
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Save as PDF
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Export as CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PrintingCalculator() {
  const [activeItem, setActiveItem] = useState("visiting-card");

  const renderContent = () => {
    switch (activeItem) {
      case "visiting-card":
        return <VisitingCardCalculator />;
      case "offset-memo":
        return <OffsetMemoCalculator />;
      case "carbon-memo":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                Carbon Memo Calculator
              </h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      case "box-packaging":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                Box Packaging Calculator
              </h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      case "bag-packaging":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                Bag Packaging Calculator
              </h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Select a Product</h2>
              <p className="text-muted-foreground">
                Choose a product from the sidebar to start calculating costs.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <SidebarTrigger />
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default PrintingCalculator;
