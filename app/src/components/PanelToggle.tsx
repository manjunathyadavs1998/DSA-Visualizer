/** Small chevron button used in panel headers to collapse/expand the body. */
export default function PanelToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle?: () => void;
}) {
  if (!onToggle) return null;
  return (
    <button
      onClick={onToggle}
      title={collapsed ? 'Expand panel' : 'Collapse panel'}
      className="flex h-4 w-5 items-center justify-center border border-line text-[9px] leading-none text-t3 transition-colors hover:border-cy/50 hover:text-cy"
    >
      {collapsed ? '▸' : '▾'}
    </button>
  );
}
