import { Flex } from './Flex'
import { Heading } from './Heading'
import { Paper } from './Paper'
import './Modal.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Modal({
  visible,
  header = <Heading h='1'>Sample Heading</Heading>,
  content = <></>,
  footer = <></>,
  variant = 'primary',
  onBackdropClick = () => { },
  padding = 8
}) {
  if (!visible) return null;

  return (
    <div className={cx('modal-backdrop')} onClick={() => { onBackdropClick() }} style={{ padding: "32px 64px" }} data-variant={variant}>
      <Flex direction='column' className={cx('modal-wrapper')}>
        <Paper layer={0} variant={variant} className={cx('modal-header')}>
          <Flex direction='column' padding={padding} gap={32} className={cx('modal-flex')}>
            <Paper layer={1} className={cx('modal-header')}>
              {header}
            </Paper>
            <Paper layer={1} className={cx('modal-content')}>
              {content}
            </Paper>
            <Paper layer={1} className={cx('modal-footer')}>
              {footer}
            </Paper>
          </Flex>
        </Paper>
      </Flex>
    </div>
  )
}