/** Dedicated narration strip: the previous step dimmed above the current one,
 *  with <b> value highlights rendered (engine messages are self-generated). */
export default function NarrationBar({
  current,
  prev,
  html = false,
}: {
  current: string;
  prev?: string;
  html?: boolean;
}) {
  return (
    <div className="narration shrink-0 border-t border-line bg-panel/90 px-4 py-1 backdrop-blur-sm">
      <p className="h-4 truncate text-[10px] leading-4 text-t4">{prev ?? ''}</p>
      {html ? (
        <p
          className="truncate text-[12px] leading-5 text-t2"
          dangerouslySetInnerHTML={{ __html: current }}
        />
      ) : (
        <p className="truncate text-[12px] leading-5 text-t2">{current}</p>
      )}
    </div>
  );
}
