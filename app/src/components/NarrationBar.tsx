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
    <div className="narration shrink-0 border-t border-line bg-panel/95 px-5 py-2 backdrop-blur-sm">
      <p className="narration-prev mb-0.5 h-[18px] truncate leading-[18px]">{prev ?? ''}</p>
      {html ? (
        <p
          className="narration-current truncate"
          dangerouslySetInnerHTML={{ __html: current }}
        />
      ) : (
        <p className="narration-current truncate">{current}</p>
      )}
    </div>
  );
}
