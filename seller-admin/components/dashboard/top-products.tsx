import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function TopProducts() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium">Wireless Headphones XL</div>
            <Badge>New</Badge>
          </div>
          <div className="text-sm font-medium">$299.00</div>
        </div>
        <Progress value={84} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>84% of sales</div>
          <div>432 sold</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Smart Watch Series 7</div>
          <div className="text-sm font-medium">$199.00</div>
        </div>
        <Progress value={67} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>67% of sales</div>
          <div>356 sold</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Laptop Pro 16"</div>
          <div className="text-sm font-medium">$1299.00</div>
        </div>
        <Progress value={52} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>52% of sales</div>
          <div>294 sold</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Smartphone Ultra</div>
          <div className="text-sm font-medium">$899.00</div>
        </div>
        <Progress value={45} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>45% of sales</div>
          <div>245 sold</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Gaming Console X</div>
          <div className="text-sm font-medium">$499.00</div>
        </div>
        <Progress value={38} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>38% of sales</div>
          <div>217 sold</div>
        </div>
      </div>
    </div>
  )
}
