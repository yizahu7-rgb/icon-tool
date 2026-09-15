export const ICON_GENERATION_STANDARD_VERSION = 'FS-LINE-2026.09';

/**
 * The approved 32px drawing keylines converted to the generated icon's
 * editable 24×24 viewBox. Stroke width remains an independent physical value.
 */
export const GENERATED_ICON_GRID = {
  canvas: 24,
  center: 12,
  squareSize: 18,
  circleDiameter: 21,
  irregularSize: 19.5,
  horizontalWidth: 19.5,
  horizontalHeight: 16.5,
  verticalWidth: 16.5,
  verticalHeight: 19.5,
  arrowWidth: 7.5,
  arrowHeight: 13.5,
  arrowHorizontalWidth: 13.5,
  arrowHorizontalHeight: 7.5,
  closeSize: 13.875,
  resizeSize: 16.5,
  minimumPadding: 0.75
} as const;

type IconGenerationPromptOptions = {
  concept: string;
  referenceLibrary: string;
  displaySize: number;
  physicalStrokeWidth: number;
  viewBoxStrokeWidth: number;
  displayCornerRadius: number;
  viewBoxCornerRadius: number;
  minimumGap: number;
  hasReferenceImage: boolean;
};

const format = (value: number) => Number(value.toFixed(3));

export const buildIconGenerationPrompt = ({
  concept,
  referenceLibrary,
  displaySize,
  physicalStrokeWidth,
  viewBoxStrokeWidth,
  displayCornerRadius,
  viewBoxCornerRadius,
  minimumGap,
  hasReferenceImage
}: IconGenerationPromptOptions) => {
  const sourceRule = hasReferenceImage
    ? `The uploaded image is the authoritative structural reference. Preserve its object count, openings, overlaps, directions, connection points, internal symbols, and aspect ratio. Do not replace it with a common icon-library metaphor merely because the concept name suggests one.`
    : `No image is supplied. Use the simplest unambiguous line-icon topology for the concept "${concept}", with no decorative or invented secondary detail.`;

  return `You are an SVG icon engineer. Generate one editable line icon that follows ${ICON_GENERATION_STANDARD_VERSION}.

CONCEPT
- Name: "${concept}"
- Reference language: ${referenceLibrary}
- ${sourceRule}

MANDATORY GEOMETRY
- Canvas/viewBox: exactly 0 0 ${GENERATED_ICON_GRID.canvas} ${GENERATED_ICON_GRID.canvas}.
- Display size: ${displaySize}px.
- Physical stroke: ${physicalStrokeWidth}px at display size; path-coordinate equivalent: ${format(viewBoxStrokeWidth)} units.
- Geometric corner radius: ${displayCornerRadius}px at display size; path-coordinate equivalent: ${format(viewBoxCornerRadius)} units.
- Default rendering uses butt line caps and miter joins. Curves and rounded corners must be explicit A/Q/C path geometry, not simulated with round caps or joins.
- Use centerline geometry only. Never expand strokes into filled silhouettes.
- Keep the source aspect ratio. Fit proportionally; never stretch width and height independently.

APPROVED 24-UNIT KEYLINES
- Square/dense form: ${GENERATED_ICON_GRID.squareSize}×${GENERATED_ICON_GRID.squareSize}, centered at (${GENERATED_ICON_GRID.center},${GENERATED_ICON_GRID.center}).
- Circle/large/sparse form: ${GENERATED_ICON_GRID.circleDiameter}×${GENERATED_ICON_GRID.circleDiameter}, centered.
- Horizontal form: at most ${GENERATED_ICON_GRID.horizontalWidth}×${GENERATED_ICON_GRID.horizontalHeight}, centered.
- Vertical form: at most ${GENERATED_ICON_GRID.verticalWidth}×${GENERATED_ICON_GRID.verticalHeight}, centered.
- Pure left/right arrow: ${GENERATED_ICON_GRID.arrowWidth}×${GENERATED_ICON_GRID.arrowHeight}; pure up/down arrow: ${GENERATED_ICON_GRID.arrowHorizontalWidth}×${GENERATED_ICON_GRID.arrowHorizontalHeight}.
- Standalone close: ${GENERATED_ICON_GRID.closeSize}×${GENERATED_ICON_GRID.closeSize}; standalone resize: ${GENERATED_ICON_GRID.resizeSize}×${GENERATED_ICON_GRID.resizeSize}.
- Choose by effective visual body, ink density, negative space, and directional weight—not by the icon name or bounding-box aspect ratio alone.
- Preserve at least ${GENERATED_ICON_GRID.minimumPadding} units of canvas padding. Keep meaningful gaps at least ${format(minimumGap)} units unless the structural reference clearly requires a tighter connection.
- Ignore extreme accessory points when judging visual weight. Sparse/open icons may need the large keyline; dense/closed icons may need the square keyline.
- Center optically around (12,12). Move the whole icon only; do not distort individual parts to force centering.

TOPOLOGY AND EDITABILITY
- Output exactly ONE <path> element. Use multiple absolute M subpaths inside its d attribute for disconnected semantic parts.
- Use only absolute path commands M L H V C S Q T A Z. Do not use lowercase/relative commands or transform attributes.
- Every coordinate, radius, and control point must remain within 0..24.
- Continuous source strokes must remain continuous. Do not hide missing segments with overlaps, thicker strokes, or rounded endpoints.
- Dots and stroke-relative marks must be path subsegments. A square dot has centreline length approximately ${format(viewBoxStrokeWidth)} units so its rendered width and height follow the selected stroke.
- Preserve repeated counts and family bases: bars, nodes, rays, windows, teeth, letters, currency marks, and state symbols are semantic geometry, not optional decoration.

OUTPUT CONTRACT
- Return only: <path d="..." fill="none"/>.
- Do not wrap it in <svg>, <g>, Markdown, comments, or prose.
- Do not output circle, ellipse, rect, line, polyline, polygon, text, clipPath, mask, style, stroke, stroke-width, stroke-linecap, stroke-linejoin, class, id, opacity, or transform.
- Before answering, verify: one path; correct topology; proportional keyline fit; valid 0..24 bounds; no fill silhouette; no omitted or invented parts.`;
};
