const calcDurationTips = ({ duration }: { duration: number }) => {
  if (duration === 0) {
    return '请开始录制'
  } else if (duration < 1000) {
    return '继续说话'
  } else if (duration < 3000) {
    return '录制时长太短'
  } else if (duration < 4000) {
    return '继续说话'
  } else if (duration > 10000) {
    return '录制时长太长'
  } else {
    return '录制时长合适'
  }
}
export function DurationTips({ duration }: { duration: number }) {
  return <div className='mt-4'>{calcDurationTips({ duration })}</div>
}
