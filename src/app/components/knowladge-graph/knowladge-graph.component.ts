import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- Interfaces (moved from React component) ---

export interface Node {
  id: string;
  type: string;
  properties: {
    text?: string;
    flashcardId?: string;
    name?: string;
    cdc_score?: number;
  };
}

export interface Edge {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
  properties: {
    score?: number;
  };
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// D3 adds properties during the simulation, so we extend our base types.
// Added optional x, y, fx, and fy properties to satisfy TypeScript.
export interface D3Node extends Node, d3.SimulationNodeDatum {
  degree?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
  properties: {
    score?: number;
  };
  // D3 replaces string IDs with object references after initialization
  source: string | D3Node;
  target: string | D3Node;
}

@Component({
  selector: 'app-knowledge-graph',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './knowledge-graph.component.html',
  styleUrls: ['./knowledge-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeGraphComponent implements AfterViewInit, OnChanges {
  // --- Inputs ---
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Input() endpoint?: string;

  private readonly elementRef: ElementRef = inject(ElementRef);

  protected tooltipContent: string | undefined;

  public get width() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    return rect.width; // Provides precise decimal values
  }

  public get height() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    return rect.height; // Provides precise decimal values
  }

  // --- View Children ---
  @ViewChild('svgContainer') private svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('tooltip') private tooltipRef!: ElementRef<HTMLDivElement>;

  // --- Component State ---
  public graphData: GraphData = { nodes: [], edges: [] };
  public isLoading = false;
  public error: string | null = null;
  public inputValue = '';
  public nodeTypes: string[] = [];
  public typeColorScale: d3.ScaleOrdinal<string, string> = d3.scaleOrdinal();

  // --- D3 Simulation References ---
  private simulation?: d3.Simulation<D3Node, D3Link>;
  private zoom?: d3.ZoomBehavior<SVGSVGElement, unknown>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes after the component has been initialized.
    // The initial data load is handled in ngAfterViewInit.

    // If the endpoint URL changes, re-fetch the data.
    if (changes['endpoint'] && !changes['endpoint'].firstChange) {
      this.fetchData();
      return; // Prioritize endpoint over direct data inputs.
    }

    // If nodes or edges change AND we are not using an endpoint, update the graph.
    if (!this.endpoint && (changes['nodes'] || changes['edges'])) {
      if (!changes['nodes']?.firstChange || !changes['edges']?.firstChange) {
        this.graphData = { nodes: this.nodes || [], edges: this.edges || [] };
        this.updateDerivedData();
        this.createGraph();
      }
    }
  }

  ngAfterViewInit(): void {
    // Initial data load logic.
    if (this.endpoint) {
      this.fetchData();
    } else {
      this.graphData = { nodes: this.nodes, edges: this.edges };
      this.updateDerivedData();
      this.createGraph();
    }
  }

  fetchData(): void {
    if (!this.endpoint) return;

    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck(); // Trigger change detection to show loader

    this.http
      .get<GraphData>(this.endpoint)
      .pipe(
        catchError((err) => {
          this.error = err.message || 'Failed to fetch graph data';
          return of({ nodes: [], edges: [] });
        }),
        finalize(() => {
          this.cdr.markForCheck(); // Trigger change detection to hide loader
        })
      )
      .subscribe((data) => {
        this.graphData = data || { nodes: [], edges: [] }; // Ensure graphData is never null
        this.updateDerivedData();
        this.createGraph();
        this.isLoading = false;
        this.cdr.markForCheck(); // Trigger change detection to render graph
      });
  }

  private updateDerivedData(): void {
    if (!this.graphData || !this.graphData.nodes) return;
    this.nodeTypes = Array.from(
      new Set(this.graphData.nodes.map((n) => n.type))
    ).sort();
    this.typeColorScale = d3
      .scaleOrdinal(d3.schemeTableau10)
      .domain(this.nodeTypes);
  }

  handleFindClick(): void {
    if (!this.inputValue || !this.svgRef || !this.zoom) return;

    const svg = d3.select(this.svgRef.nativeElement);
    const node = this.simulation
      ?.nodes()
      .find((n: D3Node) => n.id === this.inputValue);

    if (node && typeof node.x === 'number' && typeof node.y === 'number') {
      svg
        .transition()
        .duration(750)
        .call(this.zoom.translateTo, node.x, node.y)
        .transition()
        .duration(500)
        .call(this.zoom.scaleTo, 1.5);
    } else {
      alert('Node ID not found.');
    }
  }

  handleZoomIn(): void {
    if (!this.svgRef || !this.zoom) return;
    d3.select(this.svgRef.nativeElement)
      .transition()
      .duration(500)
      .call(this.zoom.scaleBy, 1.4);
  }

  handleZoomOut(): void {
    if (!this.svgRef || !this.zoom) return;
    d3.select(this.svgRef.nativeElement)
      .transition()
      .duration(500)
      .call(this.zoom.scaleBy, 0.6);
  }

  private createGraph(): void {
    if (
      !this.svgRef ||
      !this.graphData ||
      !this.graphData.nodes ||
      this.graphData.nodes.length === 0
    ) {
      if (this.svgRef) {
        d3.select(this.svgRef.nativeElement).selectAll('*').remove();
      }
      return;
    }

    const svgElement = this.svgRef.nativeElement;
    d3.select(svgElement).selectAll('*').remove();

    // --- Data Validation and Sanitization ---
    const nodes = this.graphData.nodes || [];
    const edges = this.graphData.edges || [];

    const validNodes: D3Node[] = nodes
      .filter((n) => n && n.id != null)
      .map((n) => ({ ...n }));
    const nodeIds = new Set(validNodes.map((n) => n.id));
    const validLinks: D3Link[] = edges
      .filter(
        (l) =>
          l &&
          l.sourceId != null &&
          l.targetId != null &&
          nodeIds.has(l.sourceId) &&
          nodeIds.has(l.targetId)
      )
      .map((l) => ({ ...l, source: l.sourceId, target: l.targetId }));

    if (validNodes.length === 0) return;

    // --- Pre-computation ---
    const nodeDegreeMap = new Map<string, number>();
    validLinks.forEach((link) => {
      nodeDegreeMap.set(
        link.sourceId,
        (nodeDegreeMap.get(link.sourceId) || 0) + 1
      );
      nodeDegreeMap.set(
        link.targetId,
        (nodeDegreeMap.get(link.targetId) || 0) + 1
      );
    });
    validNodes.forEach(
      (node) => (node.degree = nodeDegreeMap.get(node.id) || 0)
    );

    const scoreToDistance = d3
      .scaleLinear()
      .domain(
        (d3.extent(validLinks, (d: D3Link) => d.properties.score) as [
          number,
          number
        ]) || [0, 1]
      )
      .range([150, 50]);

    const degreeToRadius = d3
      .scaleSqrt()
      .domain([0, (d3.max(validNodes, (d: D3Node) => d.degree) as number) || 1])
      .range([8, 25]);

    // --- D3 Setup ---
    const svg = d3.select(svgElement);
    const g = svg.append('g');

    const link = g
      .append('g')
      .attr('stroke', '#999')
      .selectAll('line')
      .data(validLinks)
      .join('line')
      .attr('stroke-width', (d: D3Link) =>
        d.properties.score ? d.properties.score * 5 : 1.5
      )
      .attr('stroke-opacity', (d: D3Link) =>
        d.properties.score ? d.properties.score : 0.6
      );

    const nodeGroup = g.append('g').selectAll('g').data(validNodes).join('g');

    // --- Node Elements ---
    nodeGroup
      .append('circle')
      .attr('r', (d: D3Node) => (d.degree ? degreeToRadius(d.degree) : 15))
      .attr('fill', (d: D3Node) => this.typeColorScale(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        this.inputValue = d.id;
        this.cdr.markForCheck();
        this.handleFindClick();
      });

    nodeGroup
      .append('text')
      .attr('class', 'node-label')
      .text((d: D3Node) =>
        d.properties.flashcardId
          ? d.properties.flashcardId.split('/').pop() || ''
          : d.properties.name ||
            (d.properties.text ? d.properties.text.split(':')[1] : d.type) ||
            ''
      )
      .attr(
        'y',
        (d: D3Node) => (d.degree ? degreeToRadius(d.degree) : 15) + 12
      );

    nodeGroup
      .append('text')
      .attr('class', 'node-score')
      .attr(
        'font-size',
        (d: D3Node) => `${(d.degree ? degreeToRadius(d.degree) : 15) * 0.8}px`
      )
      .text((d: D3Node) =>
        d.properties.cdc_score !== undefined
          ? (Math.round(d.properties.cdc_score * 9) + 1).toString()
          : ''
      );

    // --- Simulation ---
    this.simulation = d3
      .forceSimulation<D3Node, D3Link>(validNodes)
      .force(
        'link',
        d3
          .forceLink<D3Node, D3Link>(validLinks)
          .id((d: D3Node) => d.id)
          .distance((d: D3Link) =>
            d.properties.score ? scoreToDistance(d.properties.score) : 100
          )
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX(this.width / 2).strength(0.05))
      .force('y', d3.forceY(this.height / 2).strength(0.05));

    this.simulation.on('tick', () => {
      link
        .attr('x1', (d: D3Link) => (d.source as D3Node).x!)
        .attr('y1', (d: D3Link) => (d.source as D3Node).y!)
        .attr('x2', (d: D3Link) => (d.target as D3Node).x!)
        .attr('y2', (d: D3Link) => (d.target as D3Node).y!);
      nodeGroup.attr('transform', (d: D3Node) => `translate(${d.x}, ${d.y})`);
    });

    // --- Interactivity ---
    const drag = d3
      .drag<SVGGElement, D3Node>()
      .on('start', (event: any, d: D3Node) => {
        if (!event.active) this.simulation?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: any, d: D3Node) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: any, d: D3Node) => {
        if (!event.active) this.simulation?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeGroup.call(drag as any);

    const tooltip = d3.select(this.tooltipRef.nativeElement);
    nodeGroup
      .on('mouseenter', (event: MouseEvent, d: D3Node) => {
        // TODO: Make is so that when a node is selected the tooltip for the name
        // is "stickied" but is overwritten temporary when hovering over other nodes.
        tooltip.style('opacity', 1);
        let tooltipContent = `<strong>ID:</strong> ${
          d.id
        }<br/><strong>Type:</strong> ${
          d.type
        }<br/><strong>Connections:</strong> ${d.degree || 0}`;
        if (d.properties.flashcardId)
          tooltipContent += `<br/><strong>Flashcard:</strong> ${d.properties.flashcardId
            .split('/')
            .pop()}`;
        if (d.properties.name)
          tooltipContent += `<br/><strong>Name:</strong> ${d.properties.name}`;
        if (d.properties.text)
          tooltipContent += `<br/><strong>Text:</strong> ${d.properties.text}`;
        if (d.properties.cdc_score !== undefined)
          tooltipContent += `<br/><strong>CDC Score:</strong> ${d.properties.cdc_score.toFixed(
            3
          )}`;
        tooltip.html(tooltipContent);
      })
      .on('mouseleave', () => tooltip.style('opacity', 0));

    this.zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.01, 4])
      .on('zoom', (event: any) => g.attr('transform', event.transform));
    svg.call(this.zoom).call(this.zoom.scaleTo, 0.08);
  }
}
