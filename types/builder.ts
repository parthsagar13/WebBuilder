export interface Component {
  type: string;
  name: string;
  icon?: any;
  category: string;
  defaultProps: Record<string, any>;
}

export interface ComponentInstance {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible?: boolean;
  locked?: boolean;
}

export interface BuilderState {
  components: ComponentInstance[];
  selectedComponent: ComponentInstance | null;
  canvasMode: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  isPreviewMode: boolean;
}