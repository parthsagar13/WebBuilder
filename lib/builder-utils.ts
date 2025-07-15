export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

export function getComponentBounds(component: any) {
  return {
    left: component.position.x,
    top: component.position.y,
    right: component.position.x + component.size.width,
    bottom: component.position.y + component.size.height
  };
}

export function isPointInBounds(point: { x: number; y: number }, bounds: any): boolean {
  return point.x >= bounds.left && 
         point.x <= bounds.right && 
         point.y >= bounds.top && 
         point.y <= bounds.bottom;
}